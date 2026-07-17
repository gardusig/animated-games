#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "Building WASM crates..."
for crate in wasm-pokemon wasm-yugioh; do
  echo "  wasm-pack build wasm/$crate ..."
  (cd "$ROOT/wasm/$crate" && wasm-pack build --target web --out-dir "$ROOT/frontend/public/wasm/$crate")
done

echo ""
echo "Starting Docker services..."
docker compose up --build
