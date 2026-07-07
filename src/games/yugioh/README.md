# Yu-Gi-Oh! Deck Editor

**Category:** interactive game

## Goal

Browse a large TCG card catalog, inspect card stats and art (via URLs), and explore preset decks. The experience is visual and strategic — understanding synergies, archetypes, and deck composition — not abstract logic puzzles.

## What you do

| Screen | Purpose |
|--------|---------|
| **Cards** | Paginated catalog with detail modal |
| **Decks** | Preset and custom deck lists |
| **Deck detail** | See card lineup for a deck |

## Stack

- Spring Boot API — `/api/yugioh`
- Postgres — cards, decks, deck_cards
- React UI — launcher route `/play/yugioh`
- Data — `data/cards.csv` (~900 cards), image URLs only

## Docs

See `docs/` in this folder for API, migrations, and catalog maintenance.
