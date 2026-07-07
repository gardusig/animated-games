# Catalog data — metadata in git, images deferred

See also [gardusig/pokemon `docs/CATALOG_DATA.md`](https://github.com/gardusig/pokemon/blob/main/docs/CATALOG_DATA.md) for the shared model.

## Yu-Gi-Oh layout

| File | Required | Purpose |
|------|----------|---------|
| `manifest.yaml` | yes | Row counts + validation contract |
| `card_list.csv` | yes | Card id + name index |
| `cards.csv` | yes | Full metadata; image column = URL or empty |
| `decks.csv` / `deck_cards.csv` | yes | Preset content |

## Size (current)

- **~900 cards**, full `cards.csv` ≈ **192 KB**
- Metadata without `description` + `image` ≈ **58 KB**
- No binary images in repo — only URLs to YGOPRODECK CDN

## Regenerate / images (network)

```bash
python3 CLI commands / src/generate_cards_csv.py              # metadata from card_list
python3 CLI commands / src/generate_cards_csv.py --fetch-images   # fill all image URLs
python3 CLI commands / src/generate_cards_csv.py --fill-missing-images
python3 CLI commands / src/validate_catalog.py              # if present
```

Bootstrap (`docker compose up`) does **not** require network when `cards.csv` is committed.

## Full card pool (~12k)

When expanding beyond the demo 900:

1. Export id + name list to `card_list.csv`
2. Run `generate_cards_csv.py` **without** `--fetch-images` first → small commit
3. Run `--fill-missing-images` in a separate commit or CI artifact
4. Consider split: `cards.core.csv` + `cards.images.csv` (see pokemon CATALOG_DATA.md)
