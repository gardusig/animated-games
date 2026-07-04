# Vision — Pokemon Platinum Merge

## Elevator pitch

One small overworld map. **Eight houses** = first gym of each generation. Beat them all to "complete" every game in one run. Ash walks with Pikachu beside him (HeartGold companion pawn). Not a huge open world — a curated museum of Pokemon history.

## MVP (now)

- [x] Repo boilerplate (backend / frontend / db / docker)
- [x] Global species list from merged game data (CSV seed)
- [x] Pokedex UI with **shiny toggle**
- [x] Achievement list (read-only seed)
- [x] Gym room table (data only, 8 leaders)

## Phase 2 — World shell

- [ ] 2D tile map (small hub + 8 gym house entrances)
- [ ] Ash sprite + Pikachu follower pawn
- [ ] Walk into house → load gym interior scene
- [ ] Gym room shows leader team pulled from `gym_rooms` + `pokemon_species`

## Phase 3 — Routes & encounters

- [ ] Route tiles: tall grass, lake, cave, volcano, snow, sand (one per common type)
- [ ] Random encounter table per route (no full battle UI yet — "seen" registration)
- [ ] Register species in pokedex on encounter

## Phase 4 — Services

- [ ] Pokemon Center (heal party / full restore)
- [ ] Poké Mart (buy potions, balls — economy stub)

## Phase 5 — Battles (later)

- [ ] Turn-based duel engine (deferred — pokedex-first)
- [ ] Gym leader fights exactly as original teams
- [ ] Badge + achievement on win

## Phase 6 — Data merge

- [ ] Import species from each gen (sprites, typings, learnsets)
- [ ] Per-gym team scraper / manual YAML per game
- [ ] Shiny odds + shiny dex completion %

## Phase 7 — Deploy

- [ ] `scripts/deploy` → container hosting (Fly.io / Railway / VPS)
- [ ] Static frontend CDN + managed Postgres

## Design constraints

- Keep map **small** — quality over scale
- **Faithful gym teams** where possible (Gen 1 Brock = Geodude + Onix, etc.)
- Single save / single trainer (Ash) for now
- No competitive multiplayer
