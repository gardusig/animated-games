#!/usr/bin/env python3
"""Check DB state: 0 empty, 2 populated, 3 connection error."""

import os
import sys

import psycopg2

DB = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "port": int(os.environ.get("DB_PORT", 5432)),
    "dbname": os.environ.get("DB_NAME", "pokemon_db"),
    "user": os.environ.get("DB_USER", "pokemon_user"),
    "password": os.environ.get("DB_PASSWORD", "pokemon_password"),
}


def main():
    try:
        conn = psycopg2.connect(**DB)
        with conn.cursor() as cur:
            cur.execute(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pokemon_species')"
            )
            if not cur.fetchone()[0]:
                sys.exit(0)
            cur.execute("SELECT COUNT(*) FROM pokemon_species")
            count = cur.fetchone()[0]
        conn.close()
        sys.exit(0 if count == 0 else 2)
    except psycopg2.Error:
        sys.exit(3)


if __name__ == "__main__":
    main()
