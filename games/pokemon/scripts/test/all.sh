#!/usr/bin/env bash
set -euo pipefail
"$(dirname "$0")/unit.sh"
"$(dirname "$0")/integration.sh"
