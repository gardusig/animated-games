import { useEffect, useRef } from 'react'
import type { Game } from './games'

interface WasmExports {
  init: () => void
  tick: (dt: number) => void
  get_state: () => string
  resize: (width: number, height: number) => void
}

interface RuntimeProps {
  game: Game
  onBack: () => void
}

export default function Runtime({ game, onBack }: RuntimeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wasmRef = useRef<WasmExports | null>(null)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    let cancelled = false

    async function boot() {
      try {
        const mod = await import(`/wasm/${game.id}.wasm`)
        const exports = await mod.default() as WasmExports
        wasmRef.current = exports
        exports.init()

        if (canvasRef.current) {
          const dpr = devicePixelRatio
          exports.resize(canvasRef.current.width * dpr, canvasRef.current.height * dpr)
        }
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
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

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

    function loop(time: number) {
      const dt = lastTimeRef.current
        ? Math.min((time - lastTimeRef.current) / 1000, 1 / 30)
        : 1 / 60
      lastTimeRef.current = time

      const wasm = wasmRef.current
      if (wasm) {
        wasm.tick(dt)
        const raw = wasm.get_state()
        const state = JSON.parse(raw) as Record<string, number>

        const dpr = devicePixelRatio
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#0a0a0f'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = '#e0e0e0'
        ctx.font = `${16 * dpr}px monospace`
        ctx.fillText(`${game.name} — ${(1 / dt).toFixed(0)} FPS`, 16 * dpr, 24 * dpr)

        if (state.x !== undefined && state.y !== undefined) {
          ctx.beginPath()
          ctx.arc(state.x * dpr, state.y * dpr, 20 * dpr, 0, Math.PI * 2)
          ctx.fillStyle = '#ff4444'
          ctx.fill()
        }
        if (state.rotation !== undefined) {
          ctx.save()
          ctx.translate(state.x * dpr, state.y * dpr)
          ctx.rotate(state.rotation)
          ctx.fillStyle = '#44aaff'
          ctx.fillRect(-30 * dpr, -20 * dpr, 60 * dpr, 40 * dpr)
          ctx.restore()
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [game])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          padding: '8px 16px',
          borderRadius: 8,
          border: '1px solid #2a2a3a',
          background: '#12121a',
          color: '#e0e0e0',
          cursor: 'pointer',
          fontSize: 14,
          fontFamily: 'inherit',
        }}
      >
        ← Back to menu
      </button>
    </div>
  )
}
