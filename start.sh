#!/usr/bin/env bash
set -euo pipefail

echo "Building WASM crates..."
cd "$(dirname "$0")/wasm"
for dir in wasm-pokemon wasm-yugioh; do
  (cd "$dir" && wasm-pack build --target web --out-dir "../frontend/public/wasm/$dir")
done

echo "Starting services..."
docker compose up --build
