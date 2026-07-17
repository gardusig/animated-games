import { type Game, games } from './games'

interface GameLauncherProps {
  onSelect: (game: Game) => void
}

export default function GameLauncher({ onSelect }: GameLauncherProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 32,
    }}>
      <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em' }}>
        Animated Games
      </h1>
      <p style={{ color: '#888', fontSize: 18, marginBottom: 8 }}>
        Select a game to launch
      </p>
      <div style={{ display: 'flex', gap: 24 }}>
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelect(game)}
            style={{
              width: 240,
              padding: '32px 24px',
              borderRadius: 12,
              border: '1px solid #2a2a3a',
              background: '#12121a',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.2s, transform 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#555'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#2a2a3a'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <h2 style={{ fontSize: 22, marginBottom: 8, color: '#fff' }}>
              {game.name}
            </h2>
            <p style={{ fontSize: 14, color: '#888', lineHeight: 1.5 }}>
              {game.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
