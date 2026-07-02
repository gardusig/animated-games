#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
docker build -f backend/Dockerfile --target test ./backend
docker build -f frontend/Dockerfile --target test ./frontend
docker build -f scripts/Dockerfile --target test .
