import React, { useEffect, useState } from 'react'
import { fetchAchievements } from '../api/pokemonApi'

export default function Achievements() {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetchAchievements().then(setItems).catch(() => setItems([]))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-poke-gold mb-6">Achievements</h1>
      <ul className="space-y-3">
        {items.map((a) => (
          <li
            key={a.id}
            className={`p-4 rounded-lg border ${a.completed ? 'border-green-500/50 bg-green-900/20' : 'border-gray-700 bg-black/20'}`}
          >
            <div className="font-semibold">{a.completed ? '✓' : '○'} {a.title}</div>
            <div className="text-sm text-gray-400">{a.description}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
