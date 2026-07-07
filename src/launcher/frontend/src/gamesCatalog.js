/** 2D-games launcher — interactive games only */
export default [
  {
    slug: 'yugioh',
    title: 'Yu-Gi-Oh! Deck Editor',
    emoji: '⚡',
    status: 'active',
    description: 'TCG catalog and decks — build strategies and compete.',
    frontend_route: '/play/yugioh',
    tags: ['tcg', 'collection', 'interaction'],
  },
  {
    slug: 'pokemon',
    title: 'Pokemon Platinum Merge',
    emoji: '🔴',
    status: 'active',
    description: 'Dex, team, gyms — collection RPG with skill challenges.',
    frontend_route: '/play/pokemon',
    tags: ['rpg', 'team', 'interaction'],
  },
  {
    slug: 'naruto',
    title: 'Naruto Missions',
    emoji: '🍥',
    status: 'planned',
    description: 'Ninja missions and battles — interactive PvP-oriented progression.',
    frontend_route: '/play/naruto',
    tags: ['anime', 'missions', 'multiplayer'],
  },
]
