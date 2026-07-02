# Catalog data policy

All games in this monorepo follow the same storage rules:

## In git

- **CSV / YAML** — ids, names, stats, descriptions, external URLs
- **manifest.yaml** — `min_rows`, file list, validation rules
- **scripts** — fetchers that refresh catalogs from public APIs (optional, run locally)

## Not in git

- Binary images, sprites, audio, or large assets
- Generated blobs that can be re-fetched from CDN URLs

## Image columns

| Game | Column | Source |
|------|--------|--------|
| Yu-Gi-Oh | `image` | YGOPRODeck CDN URLs in `cards.csv` |
| Pokemon | `sprite_url` | PokeAPI / sprites CDN |

## Validation

```bash
python games/yugioh/scripts/src/validate_catalog.py
python games/pokemon/scripts/src/validate_catalog.py
```

## Size targets

Keep each catalog CSV under ~500 KB of text metadata. Split core vs images CSV when scaling (see yugioh `card_list.csv` + `cards.csv` pattern).
