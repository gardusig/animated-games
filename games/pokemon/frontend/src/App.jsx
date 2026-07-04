import React from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Pokedex from './pages/Pokedex'
import Team from './pages/Team'
import Achievements from './pages/Achievements'

const navClass = ({ isActive }) =>
  `hover:text-poke-gold ${isActive ? 'text-poke-gold font-semibold' : ''}`

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-poke-dark to-slate-900">
        <nav className="border-b border-poke-gold/30 bg-black/40 backdrop-blur">
          <div className="container mx-auto flex items-center justify-between px-4 py-3">
            <Link to="/" className="text-xl font-bold text-poke-gold">⚡ Platinum Merge</Link>
            <div className="flex gap-5 text-sm">
              <NavLink to="/pokedex" className={navClass}>Pokedex</NavLink>
              <NavLink to="/team" className={navClass}>Team</NavLink>
              <NavLink to="/achievements" className={navClass}>Achievements</NavLink>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokedex" element={<Pokedex />} />
            <Route path="/team" element={<Team />} />
            <Route path="/achievements" element={<Achievements />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
