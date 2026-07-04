#!/bin/bash
# Set GitHub descriptions and topics for gardusig repos.
set -euo pipefail

edit_repo() {
  local repo="$1"
  shift
  echo ">>> gardusig/${repo}"
  gh repo edit "gardusig/${repo}" "$@"
}

edit_repo 2D-games \
  --description "Interactive 2D browser games for Chrome — Yu-Gi-Oh, Pokemon, Naruto. ~60fps, player interaction." \
  --add-topic 2d-games --add-topic games --add-topic chrome --add-topic react \
  --add-topic docker --add-topic yugioh --add-topic pokemon --add-topic naruto

edit_repo static-puzzles \
  --description "Newspaper-style solo puzzles for Chrome — sudoku, chess, crosswords. Offline, minimal animation." \
  --add-topic puzzles --add-topic sudoku --add-topic chess --add-topic chrome --add-topic offline

edit_repo 3D-games \
  --description "3D browser games for Chrome — WebGL, enhanced graphics. Smash and future interactive 3D titles." \
  --add-topic 3d-games --add-topic webgl --add-topic chrome --add-topic games

# --- Legacy (deleted on GitHub — skip if missing) ---
edit_repo github-pipelines \
  --description "GitHub Actions orchestrator for gardusig — workflows, PR CI, deploy, release, and e2e workflow tests." \
  --add-topic github-actions --add-topic ci-cd --add-topic devops \
  --add-topic docker --add-topic automation --add-topic monorepo

edit_repo cli \
  --description "gardusig CLI — shell commands and OpenCode helpers used across pipelines and app repos." \
  --add-topic cli --add-topic python --add-topic automation --add-topic opencode

# --- Other public repos ---
edit_repo computer-science \
  --description "Computer science exercises and reference implementations — many languages, Docker-tested." \
  --add-topic computer-science --add-topic learning --add-topic docker \
  --add-topic algorithms --add-topic polyglot

edit_repo chrome-extensions \
  --description "Browser extensions and Chrome tooling experiments." \
  --add-topic chrome-extension --add-topic javascript --add-topic browser

edit_repo gardusig \
  --description "GitHub profile README and personal landing page for @gardusig." \
  --add-topic profile --add-topic github-profile

edit_repo private \
  --description "Private experiments and notes (not public)." \
  --add-topic private

echo "Done."
