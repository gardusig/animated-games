export interface Game {
  id: string
  name: string
  description: string
}

export const games: Game[] = [
  {
    id: 'pokemon',
    name: 'Pokémon',
    description: 'Gotta render \'em all — WASM-powered Pokémon battle simulation',
  },
  {
    id: 'yugioh',
    name: 'Yu-Gi-Oh!',
    description: 'High-speed duel animations driven by the Rust WASM engine',
  },
]
