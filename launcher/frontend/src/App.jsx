import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import LauncherHome from './pages/LauncherHome'
import YugiohApp from './games/YugiohApp'
import PokemonApp from './games/PokemonApp'
import StubGame from './games/StubGame'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LauncherHome />} />
        <Route path="/play/yugioh/*" element={<YugiohApp />} />
        <Route path="/play/pokemon/*" element={<PokemonApp />} />
        <Route
          path="/play/naruto/*"
          element={
            <StubGame
              slug="naruto"
              title="Naruto Missions"
              emoji="🍥"
              description="Interactive ninja missions and battles — multiplayer-oriented progression in the browser."
            />
          }
        />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
              <p className="text-xl">Page not found</p>
              <Link to="/" className="text-cyan-400 hover:underline">
                Back to launcher
              </Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
