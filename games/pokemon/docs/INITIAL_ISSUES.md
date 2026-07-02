# Initial GitHub issues (copy or `gh issue create`)

## Epic: Pokedex

1. **Import full national dex CSV (gens 1–9)**  
   Expand `data/pokemon_species.csv` with sprites from PokeAPI. Label: `data`, `pokedex`

2. **Pokedex detail modal**  
   Click species → types, description, source game, caught/shiny status. Label: `frontend`, `pokedex`

3. **Register species on encounter (API)**  
   `POST /pokedex/catch` with trainer, species, shiny flag. Label: `backend`, `pokedex`

## Epic: Gym houses

4. **Gym house data — Gen 1 Brock faithful team**  
   Document exact levels/moves from FireRed; link species to `gym_rooms` fighters table. Label: `data`, `gyms`

5. **Gym fighters table + seed**  
   `gym_fighters(gym_id, species_id, level, moves)` migration. Label: `db`, `gyms`

6. **8 gym house slugs on hub map**  
   Placeholder React map with 8 clickable houses. Label: `frontend`, `map`

## Epic: World

7. **Ash + Pikachu pawn sprites**  
   Top-down walk cycle; Pikachu follows offset tile. Label: `frontend`, `map`

8. **Route tiles prototype**  
   Grass, lake, cave scenes with encounter tables (JSON). Label: `gameplay`, `routes`

9. **Pokemon Center heal interaction**  
   Restore party HP (when party exists). Label: `gameplay`, `shop`

10. **Poké Mart buy items**  
    Seed `items.csv`, shop UI stub. Label: `gameplay`, `shop`

## Epic: Achievements

11. **Achievement unlock API**  
    `PATCH /achievements/{code}/complete` when gym cleared. Label: `backend`

12. **Link gym completion → badge achievement**  
    Wire gym win event to achievements. Label: `gameplay`, `achievements`

## Epic: Deploy

13. **Deploy target spike**  
    Evaluate Fly.io vs Railway for docker-compose stack. Label: `ops`, `deploy`

14. **Production env vars + health checks**  
    Document `DB_*`, frontend `VITE_API_URL`. Label: `ops`, `docs`

## Epic: CI

15. **Register in gardusig/pipelines repos.yaml**  
    Enable pull_request polling + daily review. Label: `ops`
