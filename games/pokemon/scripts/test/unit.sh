#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/../docker/_common.sh"
run_unit_tests
