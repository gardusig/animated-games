#!/usr/bin/env python3
from pathlib import Path

props = """spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:twodgames_db}
spring.datasource.username=${DB_USER:twodgames_user}
spring.datasource.password=${DB_PASSWORD:twodgames_password}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.open-in-view=false
"""

root = Path("/home/gardusig/github/2d-games")
for game in ("yugioh", "pokemon"):
    p = root / "games" / game / "backend" / "src" / "main" / "resources" / "application.properties"
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(props)
    print("wrote", p)

# patch routes
decks = root / "games/yugioh/frontend/src/pages/Decks.jsx"
if decks.exists():
    decks.write_text(decks.read_text().replace("to={`/decks/${deck.id}`}", "to={`${deck.id}`}"))
home = root / "games/pokemon/frontend/src/pages/Home.jsx"
if home.exists():
    t = home.read_text()
    t = t.replace('to="/pokedex"', 'to="pokedex"').replace('to="/team"', 'to="team"')
    home.write_text(t)
detail = root / "games/yugioh/frontend/src/pages/DeckDetail.jsx"
if detail.exists():
    detail.write_text(detail.read_text().replace('to="/decks"', 'to="decks"'))
print("patched routes")
