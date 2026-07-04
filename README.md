# 2D-games

**Interactive browser games** for Chrome — collection, battles, and player interaction at ~60fps without a strong GPU.

Yu-Gi-Oh, Pokemon, and Naruto. Visual catalogs, teams/decks, and multiplayer-oriented progression. Medium browser requirements: 2D sprites, pagination, APIs — not newspaper puzzles, not 3D engines.

## Games

| Game | Status | Focus |
|------|--------|--------|
| Yu-Gi-Oh! Deck Editor | active | TCG catalog, decks, strategy |
| Pokemon Platinum Merge | active | Dex, team, gyms |
| Naruto Missions | planned | Missions, roster, battles |

## Principles

- **Chrome-first** — primary target; standard web APIs
- **Interaction** — build collections, compete, test skill vs others or systems
- **~60fps 2D** — URL-based art, React UI, Spring APIs; no heavy WebGL
- **Micro frontends** — `/play/{slug}` per game

## Quick start

```bash
docker compose up --build
```

Launcher: http://localhost:8090

## Related hubs (separate repos)

- **static-puzzles** — solo newspaper logic (sudoku, crosswords)
- **3D-games** — enhanced 3D graphics in the browser
