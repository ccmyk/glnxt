#!/usr/bin/env bash
set -euo pipefail
root="docs/ai"
archive="ai-bundle.tgz"
tar -czf "$archive" \
  "$root/AI_README.md" \
  "$root/checklists" \
  "$root/context" \
  "$root/plans" \
  "$root/policies" \
  "$root/prompts" \
  "$root/rules" \
  "$root/scripts"
echo "Packed $archive"