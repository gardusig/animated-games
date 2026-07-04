#!/bin/bash
set -e
sed -i 's|to={`/decks/${deck.id}`}|to={`${deck.id}`}|g' /home/gardusig/github/2d-games/games/yugioh/frontend/src/pages/Decks.jsx
sed -i 's|to="/decks"|to="decks"|g' /home/gardusig/github/2d-games/games/yugioh/frontend/src/pages/DeckDetail.jsx
sed -i 's|to="/pokedex"|to="pokedex"|g; s|to="/team"|to="team"|g' /home/gardusig/github/2d-games/games/pokemon/frontend/src/pages/Home.jsx
echo patched
