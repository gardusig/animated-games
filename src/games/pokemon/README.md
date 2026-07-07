# Pokemon Platinum Merge

**Category:** interactive game

## Goal

Explore the national dex, curate a six-slot team, and track gym and achievement progress. A visual collection RPG — species sprites, types, generations — focused on building your party and proving skill through the campaign structure.

## What you do

| Screen | Purpose |
|--------|---------|
| **Pokedex** | Paginated species catalog |
| **Team** | Six active party slots |
| **Achievements** | Progress milestones |

## Stack

- Spring Boot API — `/api/pokemon`
- Postgres — species, pokedex entries, party, gyms
- React UI — launcher route `/play/pokemon`
- Data — `data/pokemon_species.csv` (1,351 species), sprite URLs only

## Docs

See `docs/` in this folder for vision, catalog ETL, and data policy.
