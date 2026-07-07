import React from 'react'
import { Link, NavLink, Routes, Route } from 'react-router-dom'
import '@pokemon/index.css'
import Home from '@pokemon/pages/Home'
import Pokedex from '@pokemon/pages/Pokedex'
import Team from '@pokemon/pages/Team'
import Achievements from '@pokemon/pages/Achievements'

const navClass = ({ isActive }) =>
  `hover:text-poke-gold ${isActive ? 'text-poke-gold font-semibold' : ''}`

export default function PokemonApp() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-poke-dark to-slate-900">
      <nav className="border-b border-poke-gold/30 bg-black/40 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/play/pokemon" className="text-xl font-bold text-poke-gold">
            ⚡ Platinum Merge
          </Link>
          <div className="flex gap-5 text-sm items-center">
            <NavLink to="/play/pokemon/pokedex" className={navClass}>
              Pokedex
            </NavLink>
            <NavLink to="/play/pokemon/team" className={navClass}>
              Team
            </NavLink>
            <NavLink to="/play/pokemon/achievements" className={navClass}>
              Achievements
            </NavLink>
            <Link to="/" className="text-slate-400 hover:text-white">
              Launcher
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route index element={<Home />} />
          <Route path="pokedex" element={<Pokedex />} />
          <Route path="team" element={<Team />} />
          <Route path="achievements" element={<Achievements />} />
        </Routes>
      </main>
    </div>
  )
}
