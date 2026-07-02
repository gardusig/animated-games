import React from 'react'
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
