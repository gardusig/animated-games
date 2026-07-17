# gardusig/animated-games

60fps browser games — React + TypeScript launcher, Rust WASM engine, Go backend.

## Structure

| Path | Tech | Role |
| --- | --- | --- |
| [`frontend/`](frontend) | React + TypeScript (Vite) | Game launcher — pick Pokémon, Yu-Gi-Oh, etc. |
| [`wasm/`](wasm) | Rust → WASM (wasm-pack) | Game engine crates — 60 FPS locked |
| [`backend/`](backend) | Go | Catalog API and game services |
| [`catalog/`](catalog) | YAML | Game metadata and config |
| [`docs/`](docs) | Markdown | Architecture and design docs |

## Getting started

```bash
# 1. Build WASM crates
cd wasm
wasm-pack build wasm-pokemon --target web --out-dir ../frontend/public/wasm/pokemon
wasm-pack build wasm-yugioh --target web --out-dir ../frontend/public/wasm/yugioh

# 2. Start everything
cd ..
docker compose up --build
```

Or use `./start.sh`.

**Parent:** [gardusig/full-stack](https://github.com/gardusig/full-stack)
