const API_BASE = import.meta.env.VITE_POKEMON_API || '/api/pokemon'

export async function fetchSpecies({ page, firstDex, limit = 24, search = '' } = {}) {
  const params = new URLSearchParams({ limit: String(limit) })
  if (firstDex) params.set('firstDex', String(firstDex))
  else if (page) params.set('page', String(page))
  if (search) params.set('search', search)
  const res = await fetch(`${API_BASE}/species?${params}`)
  if (!res.ok) throw new Error('Failed to load species')
  return res.json()
}

export async function fetchPokedex(trainerId = 1, shiny = false) {
  const params = new URLSearchParams({ trainerId, shiny })
  const res = await fetch(`${API_BASE}/pokedex?${params}`)
  if (!res.ok) throw new Error('Failed to load pokedex')
  return res.json()
}

export async function fetchTeam(trainerId = 1) {
  const res = await fetch(`${API_BASE}/team?trainerId=${trainerId}`)
  if (!res.ok) throw new Error('Failed to load team')
  return res.json()
}

export async function fetchAchievements() {
  const res = await fetch(`${API_BASE}/achievements`)
  if (!res.ok) throw new Error('Failed to load achievements')
  return res.json()
}
