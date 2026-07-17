# gardusig/animated-games

60fps browser games — React + TypeScript launcher, Rust WASM engine, Rust backend.

## Structure

| Path | Role |
| --- | --- |
| [`frontend/`](frontend) | React + TypeScript game launcher |
| [`wasm/`](wasm) | Rust → WASM game engine crates |
| [`backend/`](backend) | Rust (Axum) API |
| [`data/`](data) | Game metadata |
| [`docs/`](docs) | Architecture and design docs |
| [`scripts/`](scripts) | Build helpers |

## Quick start

```bash
./scripts/build.sh
```
