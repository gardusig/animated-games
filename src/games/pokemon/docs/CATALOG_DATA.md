# Catalog data — metadata in git, images deferred

Both **yugioh** and **pokemon** treat the repo as a **catalog host**: commit numbers + metadata, not binary art.

## Principle: three tiers

| Tier | In git? | Contents | Size (order of magnitude) |
|------|---------|----------|---------------------------|
| **1. Manifest** | yes | `data/manifest.yaml` — required files, min row counts | &lt;1 KB |
| **2. Metadata CSV** | yes | id, name, stats, types — **no JPEG/PNG** | 60 KB – 2 MB |
| **3. Images** | URLs only | `image` / `sprite_url` column — empty or CDN link | +0–2 MB URLs |
| **4. Binary assets** | **no** | Sprites, card scans | 0 in repo |

Postgres holds the same metadata after seed; git CSV is source of truth for bootstrap.

## Yu-Gi-Oh today

| File | Rows | Full size | Metadata-only est. |
|------|------|-----------|-------------------|
| `cards.csv` | ~900 | **~192 KB** | **~58 KB** without description + image columns |
| `card_list.csv` | ~900 | minimal | id + name only |

Already close to the right model:

- `card_list.csv` = required index (id, name)
- `cards.csv` = metadata + optional image URL
- `generate_cards_csv.py --fetch-images` = tier 3, network, not required for CI

### Recommended yugioh split (optional refactor)

```
data/
  manifest.yaml
  card_list.csv          # required: id, name
  cards.core.csv         # id, type, attribute, race, level, atk, def, cost, rarity
  cards.text.csv         # id, description (optional join at seed)
  cards.images.csv       # id, image_url — generated, can gitignore until filled
```

**Why:** descriptions are ~94 chars avg × 900 ≈ most of the 192 KB. Splitting keeps PR diffs small when only images update.

**Keep for now:** single `cards.csv` works at 192 KB. Split when adding full YGOPRODECK (~12k cards → ~2 MB full, ~700 KB metadata-only).

## Pokemon target

| File | Rows | Target size |
|------|------|-------------|
| `pokemon_species.csv` | **1,025+** national dex | **~150–250 KB** metadata |
| `manifest.yaml` | min_rows gate | seed fails if catalog stale |

```bash
# One-time / periodic refresh (network)
python3 CLI commands / src/fetch_pokemon_catalog.py
python3 CLI commands / src/validate_catalog.py

# Optional: official artwork URLs (slow)
python3 CLI commands / src/fetch_pokemon_catalog.py --fill-images

# Optional: flavor text (extra API call per row)
python3 CLI commands / src/fetch_pokemon_catalog.py --with-flavor
```

Default `sprite_url` uses predictable PokeAPI CDN pattern — **works without `--fill-images`**.

## Image strategy (both repos)

| Approach | Pros | Cons |
|----------|------|------|
| **Empty column, fill later** | Smallest git, fastest clone | UI needs placeholder |
| **Predictable URL template** | No API; pokemon default sprites | Not always official art |
| **CDN URL in CSV** | UI works offline from DB | URLs can rot — `verify-images` script |
| **Binary in repo** | — | **Avoid** — MB per asset, LFS cost |

Yu-Gi-Oh: `generate_cards_csv.py --verify-images`  
Pokemon: `fetch_pokemon_catalog.py --fill-images`

## CI / seed contract

1. `data/manifest.yaml` declares `min_rows`
2. `validate_catalog.py` runs in CI (or before seed)
3. Seed loads CSV → Postgres; **never** downloads images in Docker bootstrap
4. UI loads images from URL at runtime (browser cache)

## Scale ceiling (when to leave CSV)

| Catalog | Rows | Stay on CSV? |
|---------|------|----------------|
| Pokemon dex | ~1,025 | yes |
| Yu-Gi-Oh | ~900 now, ~12k full | yes up to ~12k metadata |
| Beyond ~50k | | consider JSONL.gz release artifact + import job |

## Postgres vs git

| Store | Role |
|-------|------|
| **Git CSV** | Reproducible bootstrap, reviewable diffs, works offline |
| **Postgres** | Pagination, search, user state (caught, decks, party) |

User state (`pokedex_entries`, `deck_cards`) stays small — never duplicate full catalog per user.
