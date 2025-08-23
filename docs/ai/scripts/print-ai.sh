#!/usr/bin/env bash
set -euo pipefail
for f in $(find docs/ai -type f | sort); do
  echo "======== $f ========"
  sed -n '1,400p' "$f"
  echo
done