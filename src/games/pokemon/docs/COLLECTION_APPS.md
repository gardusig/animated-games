# Collection apps — Pokemon & Yu-Gi-Oh

Both repos are **gardusig collection browsers**: huge catalogs + a smaller “active set” the player cares about. Same stack (Spring Boot · Postgres · React · Python scripts · Docker). Different domain skin.

## Concept mapping

| Yu-Gi-Oh (`yugioh`) | Pokemon (`pokemon`) | Role |
|---------------------|---------------------|------|
| **Cards** | **Pokedex / species** | Paginated catalog of all entities |
| **Deck** (40 cards) | **Team** (6 slots) | Curated active set |
| `deck_cards` positions | `party_members` slots | Ordered membership |
| Card detail modal | Species detail modal | Drill-down on one entity |
| Archetype / type filters | Type / gen / shiny dex | Collection filters |
| Preset decks | Ash seed team + gyms (later) | Starter content |

## UI patterns (shared)

Both should converge on:

1. **URL-driven pagination** — `?page=` or `?firstCard=` / `?firstDex=` (cursor by stable id)
2. **Grid + modal** — browse page, click for detail (no navigation away)
3. **Nav: Catalog | Active set | Meta** — Cards/Decks vs Pokedex/Team/Achievements
4. **`PaginationResponse`** — `{ page, limit, total, totalPages }` in API JSON
5. **Search in query string** — `?q=` for name filter

Pokemon now mirrors yugioh Cards pagination on `/pokedex`. Team mirrors Deck list (fixed 6 slots).

### Future: shared frontend package

Extract to `gardusig/collection-ui` (or copy-paste components):

- `PaginationBar`
- `usePaginatedCatalog(searchParams)`
- `DetailModal` shell

Not worth a monorepo yet — two repos, same conventions.

## Storage — what works at scale

### Current (good default): PostgreSQL + CSV seed

| Dataset | Scale | Verdict |
|---------|-------|---------|
| Pokemon national dex | ~1,025 species | Trivial for Postgres |
| Yu-Gi-Oh cards | ~12k+ | Fine with indexes + pagination |
| Deck / party rows | tens per user | Relational FKs ideal |
| Achievements, gyms | hundreds | Relational |

**Keep in Postgres:** ids, names, types, stats, relationships, caught flags, party slots.

**Do not store in Postgres:** large images. Use URLs pointing to CDN / PokeAPI sprites / YGOPRODECK images.

### Indexes (add as catalogs grow)

```sql
-- pokemon
CREATE INDEX idx_species_name_lower ON pokemon_species (lower(name));
CREATE INDEX idx_species_gen ON pokemon_species (generation);

-- yugioh (if not present)
CREATE INDEX idx_cards_name_lower ON cards (lower(name));
CREATE INDEX idx_cards_type ON cards (type);
```

### Pagination strategy

| Approach | When |
|----------|------|
| **Offset** (`page` + `limit`) | &lt; ~50k rows, simple UX |
| **Keyset** (`firstDex` / `firstCard`) | Stable browse when rows inserted mid-catalog |
| **Search** | `ILIKE` or Postgres `pg_trgm` for fuzzy name search at 10k+ |

Avoid loading full catalogs in the browser. Both apps target **24 items/page** (cards) or **20** (decks).

### ETL vs runtime API

| Source | Pattern |
|--------|---------|
| PokeAPI | Nightly script → `pokemon_species.csv` + sprite URLs |
| YGOPRODECK | `generate_cards_csv.py` (already in yugioh) |

Never call external APIs from request path in production — batch import into Postgres.

### When to add more

| Signal | Upgrade |
|--------|---------|
| Search feels slow | `pg_trgm` + GIN index on `name` |
| Read-heavy public deploy | Redis cache on `GET /species?page=1` |
| User-generated teams/decks per account | `trainer_id` / `user_id` on all owned rows + auth |
| Full-text lore | `description tsvector` or leave in JSON files |

### Blob / asset storage

- Sprites, card art: **object storage** (S3, R2) or hotlink URLs with local fallback
- Version assets in git only for **seed demos**, not full dex art

## Reshaping checklist

### Pokemon (this repo)

- [x] Paginated pokedex (yugioh Cards pattern)
- [x] Team page (yugioh Deck pattern)
- [x] Detail modal
- [ ] Caught dex view with pagination (trainer-specific, not all species)
- [ ] Shared search + shiny filter in API
- [ ] Import full dex via PokeAPI ETL (#1)

### Yu-Gi-Oh

- [ ] Align API envelope: always `{ items, pagination }` (some endpoints already do)
- [ ] Extract `PaginationBar` equivalent if pokemon’s stabilizes
- [ ] Deck builder (future) ↔ pokemon party editor

## Deploy note

Both use the same Docker pipeline (`unit` / `integration` / `deploy`). Catalog size does not change deploy — only DB size and CDN for images.
