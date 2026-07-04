#!/bin/bash
set -euo pipefail
WSL_ROOT=/home/gardusig/github/2d-games
WIN_ROOT=/mnt/c/home/gardusig/github/2d-games

mkdir -p "$WSL_ROOT/docs" "$WSL_ROOT/scripts"
cp -r "$WIN_ROOT/launcher" "$WSL_ROOT/"
cp "$WIN_ROOT/docker-compose.yml" "$WSL_ROOT/"
cp "$WIN_ROOT/games.yaml" "$WSL_ROOT/"
cp "$WIN_ROOT/README.md" "$WSL_ROOT/"
cp "$WIN_ROOT/.gitignore" "$WSL_ROOT/"
cp "$WIN_ROOT/docs/"*.md "$WSL_ROOT/docs/" 2>/dev/null || true
cp "$WIN_ROOT/games/yugioh/scripts/Dockerfile" "$WSL_ROOT/games/yugioh/scripts/"
cp "$WIN_ROOT/games/pokemon/scripts/Dockerfile" "$WSL_ROOT/games/pokemon/scripts/"
cp "$WIN_ROOT/games/yugioh/backend/src/main/resources/application.properties" "$WSL_ROOT/games/yugioh/backend/src/main/resources/"
cp "$WIN_ROOT/games/pokemon/backend/src/main/resources/application.properties" "$WSL_ROOT/games/pokemon/backend/src/main/resources/"
cp "$WIN_ROOT/games/yugioh/frontend/src/api/config.js" "$WSL_ROOT/games/yugioh/frontend/src/api/"
cp "$WIN_ROOT/games/pokemon/frontend/src/api/pokemonApi.js" "$WSL_ROOT/games/pokemon/frontend/src/api/"
cp "$WIN_ROOT/games/yugioh/README.md" "$WSL_ROOT/games/yugioh/" 2>/dev/null || true
cp "$WIN_ROOT/games/pokemon/README.md" "$WSL_ROOT/games/pokemon/" 2>/dev/null || true
cp "$WIN_ROOT/scripts/patch-routes.sh" "$WSL_ROOT/scripts/" 2>/dev/null || true
chmod +x "$WSL_ROOT/scripts/patch-routes.sh" 2>/dev/null || true
bash "$WSL_ROOT/scripts/patch-routes.sh" 2>/dev/null || true
echo "Merged to $WSL_ROOT"
find "$WSL_ROOT" -type f | wc -l
