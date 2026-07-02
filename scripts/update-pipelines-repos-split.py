#!/usr/bin/env python3
"""Update github-pipelines/repos.yaml for 2D-games, static-puzzles, 3D-games split."""
from pathlib import Path

path = Path("/home/gardusig/github/github-pipelines/repos.yaml")
text = path.read_text(encoding="utf-8")

# Remove legacy entries if present
for legacy in ("  yugioh:\n", "  pokemon:\n", "  2d-games:\n"):
    if legacy in text:
        pass  # handle below

replacements = [
    ("  2d-games:", "  2D-games:"),
]

if "  static-puzzles:" not in text:
    block = """
  static-puzzles:
    events:
      pull_request: { enabled: true }
    automation:
      daily_review: { enabled: true }
      pr_merged: { enabled: true }
    notes: Solo newspaper puzzles — sudoku, chess, crosswords. Chrome-first, offline.

  3D-games:
    events:
      pull_request: { enabled: true }
    automation:
      daily_review: { enabled: true }
      pr_merged: { enabled: true }
    notes: 3D browser games — WebGL, enhanced graphics. Smash etc.

"""
    if "  2D-games:" in text:
        text = text.replace("  2D-games:", block + "  2D-games:")
    elif "  2d-games:" in text:
        text = text.replace("  2d-games:", block + "  2D-games:")

for old, new in replacements:
    text = text.replace(old, new)

# Update 2D-games notes
import re
text = re.sub(
    r"(  2D-games:\n    events:.*?\n    notes:).*",
    r"\1 Interactive 2D browser games — Yu-Gi-Oh, Pokemon, Naruto. Chrome ~60fps.",
    text,
    count=1,
    flags=re.DOTALL,
)

# Drop deprecated yugioh/pokemon blocks
text = re.sub(r"\n  yugioh:.*?(?=\n  [a-zA-Z0-9])", "\n", text, flags=re.DOTALL)
text = re.sub(r"\n  pokemon:.*?(?=\n  [a-zA-Z0-9])", "\n", text, flags=re.DOTALL)

path.write_text(text, encoding="utf-8")
print("updated repos.yaml")
