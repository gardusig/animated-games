import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchSpecies } from '../api/pokemonApi'
import PaginationBar from '../components/PaginationBar'
import SpeciesDetailModal from '../components/SpeciesDetailModal'

const TYPE_COLORS = {
  Fire: 'bg-orange-600', Water: 'bg-blue-600', Grass: 'bg-green-600', Electric: 'bg-yellow-500 text-black',
  Normal: 'bg-gray-500', Rock: 'bg-amber-800', Ground: 'bg-yellow-800', Psychic: 'bg-pink-600',
  Fighting: 'bg-red-800', Ghost: 'bg-purple-800', Poison: 'bg-purple-600', Steel: 'bg-slate-500',
}

export default function Pokedex() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [species, setSpecies] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [shiny, setShiny] = useState(false)
  const [search, setSearch] = useState(searchParams.get('q') || '')

  const page = searchParams.get('page') ? parseInt(searchParams.get('page'), 10) : null
  const firstDex = searchParams.get('firstDex') ? parseInt(searchParams.get('firstDex'), 10) : null

  useEffect(() => {
    setLoading(true)
    fetchSpecies({ page, firstDex, limit: 24, search: searchParams.get('q') || '' })
      .then((data) => {
        setSpecies(data.species || [])
        setPagination(data.pagination)
      })
      .catch(() => setSpecies([]))
      .finally(() => setLoading(false))
  }, [page, firstDex, searchParams])

  const updatePage = (newPage, newFirstDex) => {
    const params = new URLSearchParams(searchParams)
    if (newFirstDex) {
      params.set('firstDex', String(newFirstDex))
      params.delete('page')
    } else if (newPage) {
      params.set('page', String(newPage))
      params.delete('firstDex')
    }
    setSearchParams(params)
  }

  const applySearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) params.set('q', search.trim())
    setSearchParams(params)
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-poke-gold">Pokedex</h1>
          <p className="text-sm text-gray-400">National dex · paginated catalog (yugioh Cards pattern)</p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={shiny} onChange={(e) => setShiny(e.target.checked)} />
          Shiny overlay
        </label>
      </div>

      <form onSubmit={applySearch} className="mb-6 flex gap-2 max-w-md">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search species…"
          className="flex-1 px-3 py-2 rounded bg-black/40 border border-gray-600"
        />
        <button type="submit" className="px-4 py-2 bg-poke-blue rounded">Search</button>
      </form>

      {loading ? (
        <p className="text-center py-12">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {species.map((sp) => {
              const type = sp.typePrimary ?? sp.type_primary
              return (
                <button
                  key={sp.nationalDexId}
                  type="button"
                  onClick={() => setSelected(sp)}
                  className={`text-left rounded-lg border p-3 transition hover:scale-[1.02] ${
                    shiny ? 'border-yellow-400/60' : 'border-gray-700'
                  } bg-black/30`}
                >
                  <div className="text-xs text-gray-500">#{String(sp.nationalDexId).padStart(3, '0')}</div>
                  <div className="font-semibold truncate">{sp.name}</div>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${TYPE_COLORS[type] || 'bg-gray-600'}`}>
                    {type}
                  </span>
                </button>
              )
            })}
          </div>

          <PaginationBar
            pagination={pagination}
            onPrev={() => updatePage(Math.max(1, (pagination?.page || 1) - 1), null)}
            onNext={() => updatePage(Math.min(pagination?.totalPages || 1, (pagination?.page || 1) + 1), null)}
          />
        </>
      )}

      {selected && (
        <SpeciesDetailModal species={selected} shiny={shiny} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
