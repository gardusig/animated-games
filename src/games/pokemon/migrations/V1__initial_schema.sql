-- Pokemon Platinum Merge — initial schema (pokedex-first MVP)

CREATE TABLE IF NOT EXISTS pokemon_species (
    national_dex_id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type_primary VARCHAR(20) NOT NULL,
    type_secondary VARCHAR(20),
    generation SMALLINT NOT NULL,
    region VARCHAR(50),
    source_game VARCHAR(80),
    sprite_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trainers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    companion_species_id INTEGER REFERENCES pokemon_species(national_dex_id),
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pokedex_entries (
    id SERIAL PRIMARY KEY,
    trainer_id INTEGER NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    species_id INTEGER NOT NULL REFERENCES pokemon_species(national_dex_id),
    caught BOOLEAN NOT NULL DEFAULT FALSE,
    shiny BOOLEAN NOT NULL DEFAULT FALSE,
    caught_at TIMESTAMP,
    UNIQUE (trainer_id, species_id, shiny)
);

CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    code VARCHAR(80) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gym_rooms (
    id SERIAL PRIMARY KEY,
    generation SMALLINT NOT NULL,
    gym_order SMALLINT NOT NULL,
    leader_name VARCHAR(100) NOT NULL,
    badge_name VARCHAR(100),
    house_slug VARCHAR(50) NOT NULL UNIQUE,
    source_game VARCHAR(80),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (generation, gym_order)
);

CREATE INDEX IF NOT EXISTS idx_pokedex_trainer ON pokedex_entries(trainer_id);
CREATE INDEX IF NOT EXISTS idx_pokedex_species ON pokedex_entries(species_id);
CREATE INDEX IF NOT EXISTS idx_species_generation ON pokemon_species(generation);
