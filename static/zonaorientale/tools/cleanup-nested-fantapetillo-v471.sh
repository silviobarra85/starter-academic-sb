#!/usr/bin/env bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
if [ -d "static/zonaorientale/static/fantapetillomantramanager" ]; then
  if [ -n "$(git ls-files static/zonaorientale/static/fantapetillomantramanager)" ]; then
    git rm -r static/zonaorientale/static/fantapetillomantramanager
  else
    rm -rf static/zonaorientale/static/fantapetillomantramanager
  fi
fi
find static/zonaorientale/static -depth -type d -empty -delete 2>/dev/null || true
if [ -d "static/zonaorientale/static/fantapetillomantramanager" ]; then
  echo "FAIL: copia annidata FantaPetillo ancora presente" >&2
  exit 1
fi
echo "OK: copia annidata FantaPetillo assente da ZonaOrientale"
