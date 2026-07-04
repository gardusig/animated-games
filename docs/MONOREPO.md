# Monorepo layout

## Launcher

SPA at `/` — reads `games.yaml` categories and lists games under **Interactive** vs **Static puzzles**.

Routes: `/play/{slug}/…` loads that game's micro-frontend.

## Per-game folder (interactive)

```
games/{slug}/
  data/           # CSV + manifest
  migrations/     # SQL schema
  backend/        # Spring Boot API
  frontend/       # React (imported by launcher via Vite alias)
  scripts/        # migrate + seed
  docs/           # goals for this game only
  README.md
```

## Static puzzles folder

```
games/static-puzzles/
  data/           # puzzle banks (CSV/JSON)
  frontend/       # per-puzzle routes (when built)
  docs/GOALS.md
  README.md
```

Backend optional — prefer bundled puzzle data and client-side validation.

## Docker

`docker-compose.yml` runs micro-backends for **interactive** games only. Static puzzles may be static files served by the launcher nginx build.

## Retiring standalone clones

Legacy standalone repos can be archived once parity is verified here. Each game is documented on its own terms under `games/{slug}/`.
