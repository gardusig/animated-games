# 🧪 Tests

Dockerized unit and integration gates — local commands mirror the GitHub Actions stages.

---

## ⚡ Quick start

From **repo root**:

```bash
docker compose --profile test build
```

---

## What runs where

| Gate | Timeout | Command | What it does |
|------|---------|---------|--------------|
| **Unit** | 2 min | backend/frontend test commands | unit coverage for application code |
| **Integration** | 8 min | Docker build smoke | backend + frontend integration smoke |

Per-component test steps are defined next to each application component.

---

## Compose (alternative)

```bash
docker compose --profile test build
```

Builds all three test images in parallel (no hard timeout wrapper).

---

## CI

The pull request workflow runs the same gates through the central pipeline:

1. **Unit tests (Docker)** — 2 minute job timeout
2. **Integration tests (Docker)** — 8 minute job timeout (after unit passes)

---

## See also

- **Setup & run app:** [SETUP_AND_TESTS.md](SETUP_AND_TESTS.md)
- **Local dev (no containers):** [DEVELOPMENT.md](DEVELOPMENT.md)
