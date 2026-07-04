-- Active party (maps to yugioh deck composition)

CREATE TABLE IF NOT EXISTS party_members (
    id SERIAL PRIMARY KEY,
    trainer_id INTEGER NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    species_id INTEGER NOT NULL REFERENCES pokemon_species(national_dex_id),
    slot SMALLINT NOT NULL CHECK (slot BETWEEN 1 AND 6),
    nickname VARCHAR(100),
    UNIQUE (trainer_id, slot)
);

CREATE INDEX IF NOT EXISTS idx_party_trainer ON party_members(trainer_id);
