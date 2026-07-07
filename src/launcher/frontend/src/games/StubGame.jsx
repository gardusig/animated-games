import React from 'react'
import { Link } from 'react-router-dom'

export default function StubGame({ slug, title, emoji, description }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="text-6xl">{emoji}</span>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="max-w-md text-slate-400">
        {description || (
          <>
            Planned micro-frontend at <code className="text-cyan-400">/play/{slug}</code>. Catalog entry
            exists in <code className="text-cyan-400">games.yaml</code>.
          </>
        )}
      </p>
      <Link to="/" className="text-cyan-400 hover:underline">
        ← Back to launcher
      </Link>
    </div>
  )
}
