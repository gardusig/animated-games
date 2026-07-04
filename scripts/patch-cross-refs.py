#!/usr/bin/env python3
"""Remove cross-game repo references after consolidation."""
from pathlib import Path

ROOT = Path("/home/gardusig/github/2d-games")

# Pokemon Home.jsx — full replace
(ROOT / "games/pokemon/frontend/src/pages/Home.jsx").write_text(
    '''import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <h1 className="text-4xl font-bold text-poke-gold mb-4">Pokemon Platinum Merge</h1>
      <p className="text-gray-300 mb-6">
        Explore the national dex, build your team of six, and track gym progress — a visual
        collection RPG focused on skill and progression.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto text-left text-sm mb-8">
        <div className="p-4 rounded-lg border border-gray-700 bg-black/20">
          <div className="font-semibold text-poke-gold">Pokedex</div>
          <div className="text-gray-400">Paginated species catalog with detail view</div>
        </div>
        <div className="p-4 rounded-lg border border-gray-700 bg-black/20">
          <div className="font-semibold text-poke-gold">Team</div>
          <div className="text-gray-400">Six party slots — curate your active roster</div>
        </div>
      </div>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link to="pokedex" className="px-6 py-3 bg-poke-red rounded-lg font-semibold hover:opacity-90">
          Pokedex
        </Link>
        <Link to="team" className="px-6 py-3 bg-poke-blue rounded-lg font-semibold hover:opacity-90">
          Team
        </Link>
      </div>
    </div>
  )
}
''',
    encoding="utf-8",
)

pokedex = ROOT / "games/pokemon/frontend/src/pages/Pokedex.jsx"
t = pokedex.read_text(encoding="utf-8")
t = t.replace(
    "National dex · paginated catalog (yugioh Cards pattern)",
    "National dex · paginated species catalog",
)
pokedex.write_text(t, encoding="utf-8")

team = ROOT / "games/pokemon/frontend/src/pages/Team.jsx"
t = team.read_text(encoding="utf-8")
t = t.replace(
    "Ash&apos;s party (max 6) — mirrors yugioh <Link to=\"/pokedex\" className=\"text-poke-gold underline\">Deck</Link> composition",
    "Ash&apos;s party — six active slots for your roster",
)
team.write_text(t, encoding="utf-8")

ygo_catalog = ROOT / "games/yugioh/docs/CATALOG_DATA.md"
t = ygo_catalog.read_text(encoding="utf-8")
t = t.replace(
    "See also [gardusig/pokemon `docs/CATALOG_DATA.md`](https://github.com/gardusig/pokemon/blob/main/docs/CATALOG_DATA.md) for the shared model.\n\n",
    "Monorepo policy: metadata CSV + manifest in git; images as URL columns only.\n\n",
)
t = t.replace(
    "4. Consider split: `cards.core.csv` + `cards.images.csv` (see pokemon CATALOG_DATA.md)",
    "4. Consider split: `cards.core.csv` + `cards.images.csv` when scaling past ~10k rows",
)
ygo_catalog.write_text(t, encoding="utf-8")

poke_catalog = ROOT / "games/pokemon/docs/CATALOG_DATA.md"
if poke_catalog.exists():
    t = poke_catalog.read_text(encoding="utf-8")
    t = t.replace("yugioh", "interactive games")
    t = t.replace("Yu-Gi-Oh", "other interactive titles")
    if "gardusig/" in t:
        import re
        t = re.sub(r"\[.*?\]\(https://github\.com/gardusig/.*?\)\s*", "", t)
    poke_catalog.write_text(t, encoding="utf-8")

for stray in [
    ROOT / "games/pokemon/Home.jsx",
    ROOT / "games/pokemon/GOALS.md",
    ROOT / "games/yugioh/GOALS.md",
]:
    stray.unlink(missing_ok=True)

print("patched cross-references")
