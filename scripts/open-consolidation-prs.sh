#!/bin/bash
# Sync split repos to WSL, rename folders, create GH repos, open one PR per repo (skip no-remote).
set -euo pipefail

G=/home/gardusig/github
C=/mnt/c/home/gardusig/github

sync_repo() {
  local name="$1"
  if [[ -d "$C/$name" ]]; then
    mkdir -p "$G/$name"
    rsync -a --delete --exclude=.git "$C/$name/" "$G/$name/"
  fi
}

for r in 2d-games static-puzzles 3D-games; do sync_repo "$r"; done

# Merge 2d-games content into 2D-games folder name
if [[ -d "$G/2d-games" ]]; then
  mkdir -p "$G/2D-games"
  rsync -a "$G/2d-games/" "$G/2D-games/"
  rm -rf "$G/2d-games"
fi

# Remove static-puzzles from 2D-games
rm -rf "$G/2D-games/games/static-puzzles"
mkdir -p "$G/2D-games/games/naruto"

# Copy legacy static-puzzles docs if present
if [[ -f "$C/2d-games/games/static-puzzles/docs/GOALS.md" ]]; then
  mkdir -p "$G/static-puzzles/docs"
  cp "$C/2d-games/games/static-puzzles/docs/GOALS.md" "$G/static-puzzles/docs/" 2>/dev/null || true
fi

# GitHub repos
create_if_missing() {
  local name="$1" desc="$2"
  if ! gh repo view "gardusig/$name" &>/dev/null; then
    gh repo create "gardusig/$name" --public --description "$desc" --source "$G/$name" --remote origin 2>/dev/null || \
    gh repo create "gardusig/$name" --public --description "$desc"
  fi
}

create_if_missing "static-puzzles" "Newspaper-style solo puzzles for Chrome — sudoku, chess, crosswords. Offline, minimal animation."
create_if_missing "3D-games" "3D browser games for Chrome — WebGL, enhanced graphics. Smash and future interactive 3D titles."

# Fix 2D-games remote
if [[ -d "$G/2D-games/.git" ]]; then
  git -C "$G/2D-games" remote set-url origin git@github.com:gardusig/2D-games.git 2>/dev/null || true
fi

open_pr() {
  local dir="$1" branch="${2:-feat/consolidate}"
  local repo_name
  [[ -d "$dir/.git" ]] || return 0
  if ! git -C "$dir" remote get-url origin &>/dev/null; then
    echo "SKIP (no remote): $dir"
    return 0
  fi
  repo_name=$(basename "$dir")
  if ! gh repo view "gardusig/$repo_name" &>/dev/null; then
    echo "SKIP (remote missing on GH): $dir"
    return 0
  fi
  echo "PR: $dir"
  git -C "$dir" checkout -B "$branch" 2>/dev/null || git -C "$dir" checkout -b "$branch"
  git -C "$dir" add -A
  if git -C "$dir" diff --cached --quiet; then
    echo "  nothing to commit"
    return 0
  fi
  git -C "$dir" -c user.name="Gustavo Gardusi" -c user.email="gustavo.gardusi@gmail.com" \
    commit -m "Consolidate: align with hub split and Chrome-first browser targets"
  git -C "$dir" push -u origin "$branch" 2>/dev/null || git -C "$dir" push -u origin "$branch" --force-with-lease
  gh pr create --repo "gardusig/$repo_name" --head "$branch" --base main --title "Consolidate hub split and metadata" \
    --body "## Summary
- Align repo with gardusig game hub architecture (2D / static / 3D).
- Chrome-first browser targets documented.

## Test plan
- [ ] README and games.yaml reviewed
- [ ] Local dev server or docker compose smoke test" 2>/dev/null || echo "  PR may already exist"
}

init_git() {
  local dir="$1"
  [[ -d "$dir" ]] || return 0
  if [[ ! -d "$dir/.git" ]]; then
    git -C "$dir" init
    git -C "$dir" branch -M main
    git -C "$dir" remote add origin "git@github.com:gardusig/$(basename "$dir").git" 2>/dev/null || true
  fi
}

init_git "$G/static-puzzles"
init_git "$G/3D-games"
init_git "$G/2D-games"

open_pr "$G/2D-games"
open_pr "$G/static-puzzles"
open_pr "$G/3D-games"
open_pr "$G/github-pipelines" "feat/per-repo-automation"

echo "Complete."
