# Yu-Gi-Oh! — product goals

## Category

Interactive game — visual TCG collection and deck strategy.

## Core loop

1. **Browse** the card catalog (paginated, card art via URL)
2. **Inspect** card stats in a detail modal
3. **Explore** preset decks and full deck lineups

## UI patterns

- URL-driven pagination (`?page=` / `?firstCard=`)
- 3D-styled card tiles + modal detail
- Nav: Cards | Decks

## Data policy

- Cards CSV in git with manifest row counts
- `image` column = external CDN URL only
- Decks and deck_cards as relational seed data

## Scale

~900 cards today; room to grow toward full card pool with indexes on name and type.

## Out of scope for this game

Solo logic puzzles (sudoku, chess drills) belong under **static-puzzles** — not comparable UX to a TCG browser.
