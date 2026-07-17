import { useEffect, useRef } from 'react'
import type { Game } from './games'

interface WasmExports {
  init: (canvasId: string) => void
  tick: (dt: number) => void
  render: (fps: number) => void
  resize: (width: number, height: number) => void
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

  useEffect(() => {
    async function boot() {
      try {
        const mod = await import(`/wasm/${game.id}.wasm`)
        const exports = await mod.default() as WasmExports
        wasmRef.current = exports
        exports.init('game-canvas')
      } catch (err) {
        console.error('WASM boot failed:', err)
      }
    }

    boot()

    return () => {
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
        wasm.render(fpsRef.current)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        id="game-canvas"
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
