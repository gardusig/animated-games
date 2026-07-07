import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchTeam } from '../api/pokemonApi'

const TYPE_COLORS = {
  Fire: 'bg-orange-600', Water: 'bg-blue-600', Grass: 'bg-green-600', Electric: 'bg-yellow-500 text-black',
  Normal: 'bg-gray-500', Rock: 'bg-amber-800', Fighting: 'bg-red-800',
}

export default function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeam(1)
      .then((data) => setMembers(data.members || []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false))
  }, [])

  const slots = Array.from({ length: 6 }, (_, i) => {
    const slot = i + 1
    return members.find((m) => m.slot === slot) || { slot, empty: true }
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-poke-gold mb-2">Team</h1>
      <p className="text-sm text-gray-400 mb-6">
        Ash&apos;s party (max 6) — mirrors yugioh <Link to="/pokedex" className="text-poke-gold underline">Deck</Link> composition
      </p>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
          {slots.map((m) => (
            <div
              key={m.slot}
              className={`rounded-xl border p-4 min-h-[120px] ${
                m.empty ? 'border-dashed border-gray-600 bg-black/10' : 'border-poke-gold/40 bg-black/30'
              }`}
            >
              <div className="text-xs text-gray-500 mb-2">Slot {m.slot}</div>
              {m.empty ? (
                <span className="text-gray-500 text-sm">Empty</span>
              ) : (
                <>
                  <div className="font-bold">{m.nickname || m.species?.name}</div>
                  <div className="text-xs text-gray-400">#{m.species?.nationalDexId}</div>
                  {m.species?.typePrimary && (
                    <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded ${TYPE_COLORS[m.species.typePrimary] || 'bg-gray-600'}`}>
                      {m.species.typePrimary}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 text-sm text-gray-500">
        Pikachu stays in slot 1 as companion pawn (HeartGold follower — map phase later).
      </p>
    </div>
  )
}
