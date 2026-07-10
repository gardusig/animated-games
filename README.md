# gardusig/animated-games

60fps browser games — React hub, Rust WASM game core, Java Spring APIs, shared catalog and docs.

**Meta-repo only** — all application code lives in leaf submodules. Init recursively:

```bash
git submodule update --init --recursive
```

## Leaf submodules

| Path | Repository | Role |
| --- | --- | --- |
| [`frontend/`](frontend/README.md) | [gardusig/animated-games-frontend](https://github.com/gardusig/animated-games-frontend) | React launcher and game shell |
| [`wasm/`](wasm/README.md) | [gardusig/animated-games-wasm](https://github.com/gardusig/animated-games-wasm) | Rust WASM game runtime |
| [`backend/`](backend/README.md) | [gardusig/animated-games-backend](https://github.com/gardusig/animated-games-backend) | Java Spring APIs and services |
| [`catalog/`](catalog/README.md) | [gardusig/animated-games-catalog](https://github.com/gardusig/animated-games-catalog) | Game metadata and catalog YAML |
| [`docs/`](docs/README.md) | [gardusig/animated-games-docs](https://github.com/gardusig/animated-games-docs) | Product and architecture docs |

**Parent:** [gardusig/full-stack](https://github.com/gardusig/full-stack) · **Hub:** [`public/full-stack/animated-games/`](https://github.com/gardusig/gardusig/tree/main/public/full-stack/animated-games)
