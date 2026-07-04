#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
docker build -f backend/Dockerfile --target builder ./backend
docker build -f frontend/Dockerfile --target builder ./frontend
