# Game categories

## Interactive games

**Purpose:** Visual, collection-driven experiences where the fun is browsing art, building a roster, and testing skill in a themed world.

- Rich catalogs (cards, species, fighters) with pagination and detail views
- Active sets: decks, teams, party slots
- Progression: gyms, achievements, presets
- Backend + Postgres for catalogs and player state
- External image URLs — no binary assets in git

**When to play:** You want to explore a universe, optimize a build, or challenge yourself in a game-like shell — not solve a minimal logic grid.

**Games:** `yugioh`, `pokemon`, `naruto` (planned), `smash` (planned)

## Static puzzles

**Purpose:** Solo offline logic — train your brain with clear rules and immediate feedback.

- Sudoku, chess puzzles, checkers, crosswords
- UI clarity over animation; keyboard-friendly
- Puzzle definitions as text/CSV in git
- Often **no backend** — static data bundled with the frontend
- Answer preview / reveal for learning

**When to play:** You want ten quiet minutes with sudoku before bed — no accounts, no matchmaking, no card sprites.

**Hub:** `static-puzzles` → routes like `/play/static-puzzles/sudoku`

## Launcher

The home screen groups games by category so the distinction is obvious. Each game's README states its own goals; categories are not compared side-by-side in game docs.
