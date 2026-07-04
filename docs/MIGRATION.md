# Migration checklist

Consolidation into `2d-games` — verify per game folder, not per legacy repo name.

## Interactive games

- [ ] `games/yugioh/` — backend, frontend, data, migrations, scripts, docs
- [ ] `games/pokemon/` — same
- [ ] Launcher routes `/play/yugioh`, `/play/pokemon`
- [ ] `docker compose up` — both APIs healthy

## Static puzzles

- [ ] `games/static-puzzles/` — goals, manifest, stub launcher route
- [ ] No interactive-game docs copied here — separate category

## CI

- [ ] `github-pipelines` `repos.yaml` — single `2d-games` entry

## Archive

Once parity holds, archive empty standalone clones with a one-line pointer to this monorepo.
