#!/usr/bin/env python3
"""Apply SQL migrations from migrations/."""

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
MIGRATIONS = ROOT / "migrations"


def main():
    files = sorted(MIGRATIONS.glob("V*.sql"))
    if not files:
        print("No migrations found")
        return
    conn = psycopg2.connect(**DB)
    conn.autocommit = True
    with conn.cursor() as cur:
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version VARCHAR(50) PRIMARY KEY,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        for path in files:
            version = path.stem.split("__", 1)[0]
            cur.execute("SELECT 1 FROM schema_migrations WHERE version = %s", (version,))
            if cur.fetchone():
                continue
            print(f"Applying {path.name}")
            cur.execute(path.read_text(encoding="utf-8"))
            cur.execute("INSERT INTO schema_migrations (version) VALUES (%s)", (version,))
    conn.close()
    print("Migrations complete")


if __name__ == "__main__":
    try:
        main()
    except psycopg2.Error as exc:
        print(f"Migration error: {exc}", file=sys.stderr)
        sys.exit(1)
