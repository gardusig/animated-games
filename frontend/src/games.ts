export interface Game {
  id: string
  name: string
  description: string
}

export const games: Game[] = [
  {
    id: 'pokemon',
    name: 'Pokémon',
    description: 'Turn-based battle — Pikachu vs Charmander in WASM',
  },
  {
    id: 'yugioh',
    name: 'Yu-Gi-Oh!',
    description: 'Card duel — Dark Magician vs Blue-Eyes White Dragon',
  },
]
