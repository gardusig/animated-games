#!/bin/bash
# Copy remaining content from legacy pokemon/yugioh clones into 2d-games/games/*.
# Preserves monorepo-specific API routes, DB config, and Dockerfiles.
set -euo pipefail

ROOT=/home/gardusig/github/2d-games
POKE_SRC=/home/gardusig/github/pokemon
YGO_SRC=/home/gardusig/github/yugioh
BACKUP=$(mktemp -d)

preserve() {
  local game="$1"
  shift
  for rel in "$@"; do
    src="${ROOT}/games/${game}/${rel}"
    if [[ -f "$src" ]]; then
      mkdir -p "${BACKUP}/${game}/$(dirname "$rel")"
      cp "$src" "${BACKUP}/${game}/${rel}"
    fi
  done
}

preserve pokemon \
  backend/src/main/resources/application.properties \
  scripts/Dockerfile \
  frontend/src/api/pokemonApi.js \
  frontend/src/pages/Home.jsx

preserve yugioh \
  backend/src/main/resources/application.properties \
  scripts/Dockerfile \
  frontend/src/api/config.js \
  frontend/src/pages/Decks.jsx \
  frontend/src/pages/DeckDetail.jsx

rsync -a --delete \
  --exclude=.git --exclude=.github --exclude=.cli \
  --exclude=docker-compose.yml --exclude=Dockerfile \
  --exclude=README.md \
  "$POKE_SRC/" "$ROOT/games/pokemon/"

rsync -a --delete \
  --exclude=.git --exclude=.github --exclude=.cli \
  --exclude=docker-compose.yml --exclude=Dockerfile \
  --exclude=README.md \
  --exclude='docs/screenshots/*.png' \
  "$YGO_SRC/" "$ROOT/games/yugioh/"

restore() {
  local game="$1"
  if [[ -d "${BACKUP}/${game}" ]]; then
    rsync -a "${BACKUP}/${game}/" "${ROOT}/games/${game}/"
  fi
}

restore pokemon
restore yugioh

rm -rf "$BACKUP"
echo "Consolidated pokemon + yugioh into ${ROOT}/games/"
