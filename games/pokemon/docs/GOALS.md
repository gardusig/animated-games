# Pokemon — product goals

## Category

Interactive game — visual collection and skill progression.

## Core loop

1. **Browse** the national dex (paginated species, sprites via URL)
2. **Build** a team of six in fixed slots
3. **Track** caught dex entries, achievements, and gym rooms

## UI patterns

- URL-driven pagination (`?page=` / `?firstDex=`)
- Grid + detail modal — stay on browse page
- Nav: Pokedex | Team | Achievements

## Data policy

- Full species catalog in git as CSV + manifest
- Sprites as `sprite_url` columns — no binary sprites in repo
- Seed: Ash + Pikachu party, eight gym room rows

## Scale

~1,351 species is trivial for Postgres with indexes on name and generation. Search may add `pg_trgm` later.

## Out of scope for this game

Abstract logic puzzles (sudoku, etc.) live under **static-puzzles** — different category, different UX goals.
