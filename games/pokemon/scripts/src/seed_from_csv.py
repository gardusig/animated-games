#!/usr/bin/env python3
"""Seed pokemon DB from data/*.csv."""

import csv
import os
import sys
from pathlib import Path

import psycopg2

DB = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "port": int(os.environ.get("DB_PORT", 5432)),
    "dbname": os.environ.get("DB_NAME", "pokemon_db"),
    "user": os.environ.get("DB_USER", "pokemon_user"),
    "password": os.environ.get("DB_PASSWORD", "pokemon_password"),
}

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"


def conn():
    return psycopg2.connect(**DB)


def seed_species(cur):
    path = DATA / "pokemon_species.csv"
    for row in csv.DictReader(path.open(encoding="utf-8")):
        cur.execute(
            """
            INSERT INTO pokemon_species
              (national_dex_id, name, type_primary, type_secondary, generation, region, source_game, sprite_url, description)
            VALUES (%(national_dex_id)s, %(name)s, %(type_primary)s, NULLIF(%(type_secondary)s,''),
                    %(generation)s, %(region)s, %(source_game)s, NULLIF(%(sprite_url)s,''), %(description)s)
            ON CONFLICT (national_dex_id) DO UPDATE SET name = EXCLUDED.name
            """,
            row,
        )


def seed_trainers(cur):
    path = DATA / "trainers.csv"
    for row in csv.DictReader(path.open(encoding="utf-8")):
        companion = row.get("companion_species_id") or None
        cur.execute(
            """
            INSERT INTO trainers (name, companion_species_id, avatar)
            VALUES (%(name)s, %(companion_species_id)s, NULLIF(%(avatar)s,''))
            ON CONFLICT (name) DO NOTHING
            """,
            {**row, "companion_species_id": companion},
        )


def seed_pokedex(cur):
    path = DATA / "pokedex_entries.csv"
    for row in csv.DictReader(path.open(encoding="utf-8")):
        cur.execute("SELECT id FROM trainers WHERE name = %s", (row["trainer_name"],))
        trainer = cur.fetchone()
        if not trainer:
            continue
        caught = row.get("caught", "false").lower() == "true"
        shiny = row.get("shiny", "false").lower() == "true"
        cur.execute(
            """
            INSERT INTO pokedex_entries (trainer_id, species_id, caught, shiny, caught_at)
            VALUES (%s, %s, %s, %s, CASE WHEN %s THEN CURRENT_TIMESTAMP ELSE NULL END)
            ON CONFLICT (trainer_id, species_id, shiny) DO UPDATE SET caught = EXCLUDED.caught
            """,
            (trainer[0], int(row["species_national_id"]), caught, shiny, caught),
        )


def seed_achievements(cur):
    path = DATA / "achievements.csv"
    for row in csv.DictReader(path.open(encoding="utf-8")):
        completed = row.get("completed", "false").lower() == "true"
        cur.execute(
            """
            INSERT INTO achievements (code, title, description, completed, completed_at)
            VALUES (%(code)s, %(title)s, %(description)s, %s, CASE WHEN %s THEN CURRENT_TIMESTAMP ELSE NULL END)
            ON CONFLICT (code) DO NOTHING
            """,
            (completed, completed, row),
        )


def seed_gyms(cur):
    path = DATA / "gym_rooms.csv"
    if not path.exists():
        return
    for row in csv.DictReader(path.open(encoding="utf-8")):
        completed = row.get("completed", "false").lower() == "true"
        cur.execute(
            """
            INSERT INTO gym_rooms (generation, gym_order, leader_name, badge_name, house_slug, source_game, completed)
            VALUES (%(generation)s, %(gym_order)s, %(leader_name)s, %(badge_name)s, %(house_slug)s, %(source_game)s, %s)
            ON CONFLICT (house_slug) DO NOTHING
            """,
            (completed, row),
        )


def seed_party(cur):
    path = DATA / "party_members.csv"
    if not path.exists():
        return
    for row in csv.DictReader(path.open(encoding="utf-8")):
        cur.execute("SELECT id FROM trainers WHERE name = %s", (row["trainer_name"],))
        trainer = cur.fetchone()
        if not trainer:
            continue
        cur.execute(
            """
            INSERT INTO party_members (trainer_id, species_id, slot, nickname)
            VALUES (%s, %s, %s, NULLIF(%(nickname)s,''))
            ON CONFLICT (trainer_id, slot) DO UPDATE SET
              species_id = EXCLUDED.species_id,
              nickname = EXCLUDED.nickname
            """,
            (trainer[0], int(row["species_national_id"]), int(row["slot"]), row),
        )


def main():
    c = conn()
    c.autocommit = False
    try:
        with c.cursor() as cur:
            seed_species(cur)
            seed_trainers(cur)
            seed_pokedex(cur)
            seed_achievements(cur)
            seed_gyms(cur)
            seed_party(cur)
        c.commit()
        print("Seed complete")
    except Exception:
        c.rollback()
        raise
    finally:
        c.close()


if __name__ == "__main__":
    main()
