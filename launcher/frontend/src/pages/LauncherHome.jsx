import React from 'react'
import { Link } from 'react-router-dom'
import games from './gamesCatalog'

const statusBadge = {
  active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  planned: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
}

export default function LauncherHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <header className="border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold tracking-tight">2D Games</h1>
          <p className="mt-1 text-slate-400 text-sm max-w-2xl">
            Interactive browser games for Chrome — collections, battles, and player interaction at ~60fps
            without a strong GPU.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <article
              key={game.slug}
              className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl">{game.emoji}</span>
                <span className={`text-xs uppercase px-2 py-0.5 rounded border ${statusBadge[game.status]}`}>
                  {game.status}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-semibold">{game.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{game.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
              {game.status === 'active' ? (
                <Link
                  to={game.frontend_route}
                  className="mt-6 inline-block rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-sm font-medium"
                >
                  Play
                </Link>
              ) : (
                <span className="mt-6 inline-block rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-400">
                  Coming soon
                </span>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
