import { useCallback, useEffect, useRef, useState } from 'react'
import type { Game } from './games'

interface WasmExports {
  init: (canvasId: string) => void
  tick: (dt: number) => void
  render: () => void
  resize: (width: number, height: number) => void
  select_action: (index: number) => void
  get_state: () => string
}

interface GameState {
  phase: string
  playerHp?: number
  playerMaxHp?: number
  enemyHp?: number
  enemyMaxHp?: number
  playerName?: string
  enemyName?: string
  moves?: string[]
  playerLp?: number
  enemyLp?: number
  playerMonster?: { name: string; atk: number; def: number; level: number } | null
  enemyMonster?: { name: string; atk: number; def: number; level: number } | null
  turn?: number
  log: string[]
  winner: string | null
}

interface RuntimeProps {
  game: Game
  onBack: () => void
}

export default function Runtime({ game, onBack }: RuntimeProps) {
  const wasmRef = useRef<WasmExports | null>(null)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const fpsRef = useRef<number>(60)
  const frameCountRef = useRef<number>(0)
  const fpsTimeRef = useRef<number>(0)
  const [state, setState] = useState<GameState | null>(null)
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function boot() {
      try {
        const mod = await import(`/wasm/${game.id}/wasm_${game.id}.js`)
        const wasm = await mod.default()
        if (cancelled) return
        wasmRef.current = wasm as WasmExports
        wasm.init('game-canvas')
        setBooted(true)
      } catch (err) {
        console.error('WASM boot failed:', err)
      }
    }

    boot()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
    }
  }, [game])

  useEffect(() => {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null
    if (!canvas) return

    function resize() {
      const dpr = devicePixelRatio
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      wasmRef.current?.resize(canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)
    lastTimeRef.current = 0
    frameCountRef.current = 0
    fpsTimeRef.current = 0

    function loop(time: number) {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const dt = Math.min((time - lastTimeRef.current) / 1000, 1 / 30)
      lastTimeRef.current = time

      frameCountRef.current++
      if (time - fpsTimeRef.current >= 1000) {
        fpsRef.current = frameCountRef.current
        frameCountRef.current = 0
        fpsTimeRef.current = time
      }

      const wasm = wasmRef.current
      if (wasm) {
        wasm.tick(dt)
        wasm.render()

        if (frameCountRef.current % 3 === 0) {
          try {
            const raw = wasm.get_state()
            setState(JSON.parse(raw) as GameState)
          } catch { /* ignore parse errors during init */ }
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleAction = useCallback((index: number) => {
    wasmRef.current?.select_action(index)
  }, [])

  const isPokemon = game.id === 'pokemon'
  const isSelectable = state?.phase === 'select'
  const isGameOver = state?.phase === 'gameover'

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <canvas
        id="game-canvas"
        style={{ display: 'block', width: '100%', height: '100%' }}
      />

      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          padding: '6px 14px',
          borderRadius: 6,
          border: '1px solid #444',
          background: 'rgba(0,0,0,0.6)',
          color: '#ccc',
          cursor: 'pointer',
          fontSize: 13,
          fontFamily: 'inherit',
          zIndex: 10,
        }}
      >
        ← Menu
      </button>

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '0 16px',
        zIndex: 10,
      }}>
        {isPokemon && state?.moves && state.moves.length > 0 && isSelectable && (
          <>
            {state.moves.map((move, i) => (
              <button
                key={i}
                onClick={() => handleAction(i)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1px solid #555',
                  background: '#1a1a2e',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontFamily: 'monospace',
                  minWidth: 120,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#2a2a4e' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#1a1a2e' }}
              >
                {move}
              </button>
            ))}
          </>
        )}

        {!isPokemon && state && isSelectable && (
          <>
            <button onClick={() => handleAction(0)} style={actionBtnStyle('#e74c3c')}>
              Attack
            </button>
            <button onClick={() => handleAction(1)} style={actionBtnStyle('#3498db')}>
              Defend
            </button>
            <button onClick={() => handleAction(2)} style={actionBtnStyle('#95a5a6')}>
              Pass Turn
            </button>
          </>
        )}

        {!booted && (
          <span style={{ color: '#888', fontFamily: 'monospace', fontSize: 14 }}>
            Loading WASM...
          </span>
        )}

        {isGameOver && (
          <button
            onClick={onBack}
            style={{
              padding: '12px 32px',
              borderRadius: 8,
              border: '1px solid #666',
              background: '#222',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 16,
              fontFamily: 'monospace',
            }}
          >
            Back to Menu
          </button>
        )}
      </div>
    </div>
  )
}

function actionBtnStyle(color: string): Record<string, string | number> {
  return {
    padding: '10px 20px',
    borderRadius: 8,
    border: `1px solid ${color}`,
    background: '#0d0d1a',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'monospace',
    minWidth: 100,
  }
}
