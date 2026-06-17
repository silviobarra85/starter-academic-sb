#!/usr/bin/env bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"
NESTED="static/zonaorientale/static/fantapetillomantramanager"
if git ls-files "$NESTED" | grep -q .; then
  git rm -r "$NESTED"
else
  rm -rf "$NESTED"
fi
find static/zonaorientale/static -depth -type d -empty -delete 2>/dev/null || true
if [ -d "$NESTED" ]; then
  echo "FAIL: copia annidata ancora presente: $NESTED" >&2
  exit 1
fi
echo "OK: copia annidata FantaPetillo rimossa da ZonaOrientale"
