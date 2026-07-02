#!/usr/bin/env python3
"""
Fetch full Pokemon national dex metadata from PokeAPI into data/pokemon_species.csv.

Metadata only — sprite_url uses predictable CDN pattern; run --fill-images to
resolve official-artwork URLs via API (slow, network).

  python3 scripts/src/fetch_pokemon_catalog.py
  python3 scripts/src/fetch_pokemon_catalog.py --fill-images --limit 50
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data" / "pokemon_species.csv"
MANIFEST = ROOT / "data" / "manifest.yaml"
API = "https://pokeapi.co/api/v2"

COLUMNS = [
    "national_dex_id",
    "name",
    "type_primary",
    "type_secondary",
    "generation",
    "region",
    "source_game",
    "sprite_url",
    "description",
]

# Map generation id → label / default region
GEN_REGION = {
    1: ("Kanto", "Red/Blue"),
    2: ("Johto", "Gold/Silver"),
    3: ("Hoenn", "Ruby/Sapphire"),
    4: ("Sinnoh", "Diamond/Pearl"),
    5: ("Unova", "Black/White"),
    6: ("Kalos", "X/Y"),
    7: ("Alola", "Sun/Moon"),
    8: ("Galar", "Sword/Shield"),
    9: ("Paldea", "Scarlet/Violet"),
}


def fetch_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "gardusig-pokemon-catalog/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


def default_sprite_url(dex_id: int) -> str:
    return f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{dex_id}.png"


def list_all_pokemon() -> list[dict]:
    """Paginate /pokemon endpoint for id + name."""
    out: list[dict] = []
    url = f"{API}/pokemon?limit=2000"
    while url:
        data = fetch_json(url)
        out.extend(data.get("results", []))
        url = data.get("next")
    return out


def dex_id_to_generation(dex_id: int) -> int:
    """Static national dex ranges → generation (no extra API call)."""
    if dex_id <= 151:
        return 1
    if dex_id <= 251:
        return 2
    if dex_id <= 386:
        return 3
    if dex_id <= 493:
        return 4
    if dex_id <= 649:
        return 5
    if dex_id <= 721:
        return 6
    if dex_id <= 809:
        return 7
    if dex_id <= 905:
        return 8
    return 9


def enrich_pokemon(name: str, dex_id: int, fill_images: bool, with_flavor: bool) -> dict:
    detail = fetch_json(f"{API}/pokemon/{name}")
    types = [t["type"]["name"].title() for t in detail.get("types", [])]
    type_primary = types[0] if types else "Normal"
    type_secondary = types[1] if len(types) > 1 else ""

    generation = dex_id_to_generation(dex_id)
    region, source_game = GEN_REGION.get(generation, (f"Gen {generation}", "Unknown"))
    desc = ""

    if with_flavor:
        try:
            species = fetch_json(detail["species"]["url"])
            for entry in species.get("flavor_text_entries", []):
                if entry.get("language", {}).get("name") == "en":
                    desc = entry.get("flavor_text", "").replace("\n", " ").replace("\f", " ")
                    break
        except (urllib.error.URLError, KeyError):
            pass

    sprite = default_sprite_url(dex_id)
    if fill_images:
        try:
            other = detail.get("sprites", {}).get("other", {}).get("official-artwork", {})
            if other.get("front_default"):
                sprite = other["front_default"]
        except (TypeError, KeyError):
            pass

    display_name = detail.get("name", name).replace("-", " ").title()
    return {
        "national_dex_id": dex_id,
        "name": display_name,
        "type_primary": type_primary,
        "type_secondary": type_secondary,
        "generation": generation,
        "region": region,
        "source_game": source_game,
        "sprite_url": sprite,
        "description": desc[:500] if desc else "",
    }


def write_manifest(count: int, source: str) -> None:
    MANIFEST.write_text(
        f"""# Required catalog manifest — seed fails if counts drift (see scripts/src/validate_catalog.py)
version: 1
source: {source}
species:
  file: pokemon_species.csv
  min_rows: {count}
  id_column: national_dex_id
images:
  strategy: url_only  # never commit binary sprites
  fill_script: scripts/src/fetch_pokemon_catalog.py --fill-images
""",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--fill-images", action="store_true", help="Resolve official artwork URLs per row")
    parser.add_argument("--with-flavor", action="store_true", help="Extra API call per row for Pokedex text")
    parser.add_argument("--limit", type=int, default=0, help="Cap rows (dev/test)")
    parser.add_argument("--workers", type=int, default=12, help="Parallel API workers")
    args = parser.parse_args()

    print("[INFO] Listing pokemon from PokeAPI...", file=sys.stderr)
    entries = list_all_pokemon()
    if args.limit:
        entries = entries[: args.limit]

    rows: list[dict] = []
    total = len(entries)
    done = 0

    def work(entry: dict) -> dict | None:
        name = entry["name"]
        part = entry["url"].rstrip("/").split("/")[-1]
        dex_id = int(part) if part.isdigit() else 0
        if dex_id <= 0:
            return None
        return enrich_pokemon(name, dex_id, args.fill_images, args.with_flavor)

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(work, e): e for e in entries}
        for fut in as_completed(futures):
            done += 1
            try:
                row = fut.result()
                if row:
                    rows.append(row)
            except Exception as exc:
                ent = futures[fut]
                print(f"[WARN] skip {ent.get('name')}: {exc}", file=sys.stderr)
            if done % 100 == 0 or done == total:
                print(f"  ... {done}/{total}", file=sys.stderr)

    rows.sort(key=lambda r: r["national_dex_id"])
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS)
        w.writeheader()
        w.writerows(rows)

    write_manifest(len(rows), "pokeapi")
    size_kb = OUT.stat().st_size / 1024
    print(f"[OK] Wrote {len(rows)} species → {OUT} ({size_kb:.1f} KB)")
    if not args.fill_images:
        print("[TIP] Sprite column uses default GitHub CDN URLs; run --fill-images for official art", file=sys.stderr)


if __name__ == "__main__":
    main()
