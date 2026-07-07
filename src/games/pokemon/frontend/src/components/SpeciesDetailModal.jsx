import React, { useEffect } from 'react'

const TYPE_COLORS = {
  Fire: 'bg-orange-600', Water: 'bg-blue-600', Grass: 'bg-green-600', Electric: 'bg-yellow-500 text-black',
  Normal: 'bg-gray-500', Rock: 'bg-amber-800', Ground: 'bg-yellow-800', Psychic: 'bg-pink-600',
  Fighting: 'bg-red-800', Ghost: 'bg-purple-800', Poison: 'bg-purple-600', Steel: 'bg-slate-500',
}

export default function SpeciesDetailModal({ species, caught, shiny, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!species) return null

  const id = species.nationalDexId ?? species.national_dex_id
  const type = species.typePrimary ?? species.type_primary
  const type2 = species.typeSecondary ?? species.type_secondary

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="max-w-md w-full rounded-xl border border-poke-gold/40 bg-poke-dark p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-sm text-gray-400">#{String(id).padStart(4, '0')}</div>
        <h2 className="text-2xl font-bold text-poke-gold mb-2">{species.name}</h2>
        <div className="flex gap-2 mb-4">
          <span className={`text-xs px-2 py-1 rounded ${TYPE_COLORS[type] || 'bg-gray-600'}`}>{type}</span>
          {type2 && (
            <span className={`text-xs px-2 py-1 rounded ${TYPE_COLORS[type2] || 'bg-gray-600'}`}>{type2}</span>
          )}
        </div>
        <p className="text-gray-300 text-sm mb-4">{species.description || 'No description yet.'}</p>
        <dl className="text-sm space-y-1 text-gray-400">
          <div><dt className="inline font-medium text-gray-300">Gen </dt><dd className="inline">{species.generation}</dd></div>
          <div><dt className="inline font-medium text-gray-300">Region </dt><dd className="inline">{species.region}</dd></div>
          <div><dt className="inline font-medium text-gray-300">Source </dt><dd className="inline">{species.sourceGame ?? species.source_game}</dd></div>
          {caught != null && (
            <div><dt className="inline font-medium text-gray-300">Status </dt>
              <dd className="inline">{caught ? (shiny ? 'Caught (shiny)' : 'Caught') : 'Not caught'}</dd>
            </div>
          )}
        </dl>
        <button type="button" onClick={onClose} className="mt-6 w-full py-2 rounded bg-poke-red font-semibold">
          Close
        </button>
      </div>
    </div>
  )
}
