#!/bin/bash
# Split 2D-games into 2D-games, static-puzzles, 3D-games; align folder names; open PRs.
set -euo pipefail

GITHUB_ROOT=/home/gardusig/github
SRC_2D="$GITHUB_ROOT/2d-games"
[[ -d "$SRC_2D" ]] || SRC_2D="$GITHUB_ROOT/2D-games"

STATIC="$GITHUB_ROOT/static-puzzles"
GAMES_3D="$GITHUB_ROOT/3D-games"

echo "=== 1. Create static-puzzles repo ==="
mkdir -p "$STATIC"/{launcher/frontend/src/{pages,games},games/{sudoku,chess,crosswords,checkers}/{data,frontend},docs,scripts}
rsync -a "$SRC_2D/games/static-puzzles/" "$STATIC/games/hub/" 2>/dev/null || mkdir -p "$STATIC/games/hub"

echo "=== 2. Create 3D-games repo ==="
mkdir -p "$GAMES_3D"/{launcher/frontend/src/{pages,games},games/smash/{data,frontend,docs},docs}

echo "=== 3. Strip static-puzzles + smash from 2D-games ==="
rm -rf "$SRC_2D/games/static-puzzles"
mkdir -p "$SRC_2D/games/naruto"/{frontend,docs,data}

echo "=== 4. Rename 2d-games -> 2D-games ==="
if [[ -d "$GITHUB_ROOT/2d-games" && ! -d "$GITHUB_ROOT/2D-games" ]]; then
  mv "$GITHUB_ROOT/2d-games" "$GITHUB_ROOT/2D-games"
fi

echo "done scaffold dirs"
