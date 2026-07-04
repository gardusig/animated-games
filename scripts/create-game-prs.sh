#!/bin/bash
set -euo pipefail
export GIT_AUTHOR_NAME="Gustavo Gardusi" GIT_AUTHOR_EMAIL="gustavo.gardusi@gmail.com"
export GIT_COMMITTER_NAME="Gustavo Gardusi" GIT_COMMITTER_EMAIL="gustavo.gardusi@gmail.com"

BODY_FILE=$(mktemp)
cat >"$BODY_FILE" <<'EOF'
## Summary
- Hub split: interactive 2D / static puzzles / 3D
- Chrome-first browser targets

## Test plan
- [ ] Review games.yaml and README
- [ ] docker compose up --build
EOF

for r in 2D-games static-puzzles 3D-games; do
  echo "=== $r ==="
  dir="/home/gardusig/github/$r"
  git -C "$dir" fetch origin
  git -C "$dir" checkout feat/consolidate
  if ! git -C "$dir" merge-base --is-ancestor origin/main HEAD 2>/dev/null; then
    git -C "$dir" merge origin/main --allow-unrelated-histories -m "Merge empty main for PR base" || true
  fi
  git -C "$dir" push origin feat/consolidate
  if gh pr view --repo "gardusig/$r" --head feat/consolidate &>/dev/null; then
    echo "PR already exists for $r"
  else
    gh pr create --repo "gardusig/$r" --head feat/consolidate --base main \
      --title "Consolidate hub split and Chrome-first targets" \
      --body-file "$BODY_FILE"
  fi
done

rm -f "$BODY_FILE"
