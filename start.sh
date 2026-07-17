#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="$ROOT/frontend/public/wasm"

echo "Building WASM crates..."
for crate in wasm-pokemon wasm-yugioh; do
  id="${crate#wasm-}"
  echo "  wasm-pack build wasm/$crate --out-dir $OUT/$id"
  (cd "$ROOT/wasm/$crate" && wasm-pack build --target web --out-dir "$OUT/$id")
done

echo ""
echo "Starting Docker services..."
docker compose up --build
