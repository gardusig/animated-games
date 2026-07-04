#!/usr/bin/env python3
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent


def main():
    result = subprocess.run([sys.executable, str(SCRIPT_DIR / "check_db.py")], capture_output=True)
    state = result.returncode
    if state in (0, 1):
        subprocess.run([sys.executable, str(SCRIPT_DIR / "run_migrations.py")], check=True)
        subprocess.run([sys.executable, str(SCRIPT_DIR / "seed_from_csv.py")], check=True)
    elif state == 2:
        print("Database already populated")
    else:
        print("Cannot connect to database", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
