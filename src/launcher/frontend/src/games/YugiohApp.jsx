import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import '@yugioh/index.css'
import Cards from '@yugioh/pages/Cards'
import Decks from '@yugioh/pages/Decks'
import DeckDetail from '@yugioh/pages/DeckDetail'

export default function YugiohApp() {
  return (
    <div className="min-h-screen bg-yugioh-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yugioh-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yugioh-purple/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <nav className="relative bg-yugioh-dark/90 backdrop-blur-md border-b-2 border-yugioh-accent/30 shadow-yugioh-glow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/play/yugioh" className="text-2xl font-bold yugioh-text-glow text-yugioh-accent">
            ⚡ Yu-Gi-Oh!
          </Link>
          <div className="flex gap-6 items-center">
            <Link to="/play/yugioh/cards" className="text-white hover:text-yugioh-accent font-medium">
              Cards
            </Link>
            <Link to="/play/yugioh/decks" className="text-white hover:text-yugioh-accent font-medium">
              Decks
            </Link>
            <Link to="/" className="text-sm text-slate-400 hover:text-white">
              Launcher
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative container mx-auto px-4 py-8">
        <Routes>
          <Route
            index
            element={
              <div className="text-center py-16">
                <h1 className="text-5xl font-bold mb-4 text-yugioh-accent">Yu-Gi-Oh! Deck Editor</h1>
                <p className="text-gray-200 mb-8">Browse cards and build decks</p>
                <div className="flex gap-4 justify-center">
                  <Link
                    to="cards"
                    className="px-8 py-4 bg-yugioh-accent hover:bg-yugioh-gold text-yugioh-dark rounded-lg font-bold"
                  >
                    View Cards
                  </Link>
                  <Link
                    to="decks"
                    className="px-8 py-4 bg-yugioh-blue text-white rounded-lg font-bold"
                  >
                    View Decks
                  </Link>
                </div>
              </div>
            }
          />
          <Route path="cards" element={<Cards />} />
          <Route path="decks" element={<Decks />} />
          <Route path="decks/:id" element={<DeckDetail />} />
        </Routes>
      </main>
    </div>
  )
}
