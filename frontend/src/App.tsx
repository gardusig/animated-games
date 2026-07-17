import { useState } from 'react'
import type { Game } from './games'
import GameLauncher from './GameLauncher'
import Runtime from './Runtime'

export default function App() {
  const [selected, setSelected] = useState<Game | null>(null)

  if (selected) {
    return <Runtime game={selected} onBack={() => setSelected(null)} />
  }

  return <GameLauncher onSelect={setSelected} />
}
