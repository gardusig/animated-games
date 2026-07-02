#!/usr/bin/env python3
"""Validate data/manifest.yaml against catalog CSV row counts."""

import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "data" / "manifest.yaml"


def main() -> int:
    try:
        import yaml
    except ImportError:
        print("python3-yaml required", file=sys.stderr)
        return 1

    if not MANIFEST.exists():
        print(f"ERROR: missing {MANIFEST}", file=sys.stderr)
        return 1

    data = yaml.safe_load(MANIFEST.read_text(encoding="utf-8")) or {}
    cards = data.get("cards") or {}
    path = ROOT / "data" / cards.get("file", "cards.csv")
    min_rows = int(cards.get("min_rows", 1))

    if not path.exists():
        print(f"ERROR: missing catalog {path}", file=sys.stderr)
        return 1

    with path.open(encoding="utf-8") as f:
        count = sum(1 for _ in csv.DictReader(f))

    if count < min_rows:
        print(f"ERROR: {path.name} has {count} rows, manifest requires >= {min_rows}", file=sys.stderr)
        return 1

    print(f"OK: catalog {path.name} — {count} rows (min {min_rows})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
