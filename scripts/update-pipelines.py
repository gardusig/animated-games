#!/usr/bin/env python3
"""Add 2d-games to pipelines/repos.yaml and mark legacy game repos."""
from pathlib import Path

path = Path("/home/gardusig/github/pipelines/repos.yaml")
text = path.read_text()

if "2d-games:" not in text:
    insert = """
  2d-games:
    events:
      pull_request: { enabled: true }
    automation:
      daily_review: { enabled: true }
      pr_merged: { enabled: true }
    notes: Monorepo launcher + yugioh/pokemon micro-apps. Replaces standalone game repos.

"""
    text = text.replace("  yugioh:", insert + "  yugioh:")
    path.write_text(text)
    print("added 2d-games entry")
else:
    print("2d-games already present")

text = path.read_text()
text = text.replace(
    "  yugioh:\n    events:",
    "  yugioh:\n    notes: DEPRECATED — use 2d-games/games/yugioh\n    events:",
)
text = text.replace(
    "  pokemon:\n    events:",
    "  pokemon:\n    notes: DEPRECATED — use 2d-games/games/pokemon\n    events:",
)
path.write_text(text)
print("marked yugioh/pokemon deprecated")
