#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT=""
if git -C "$SITE_ROOT" rev-parse --show-toplevel >/dev/null 2>&1; then
  REPO_ROOT="$(git -C "$SITE_ROOT" rev-parse --show-toplevel)"
fi

APPLY=0
if [[ "${1:-}" == "--apply" ]]; then
  APPLY=1
fi

required_files=(
  "$SITE_ROOT/assets/css/refactor/mobile-controls.css"
  "$SITE_ROOT/assets/css/refactor/rosters-tables.css"
  "$SITE_ROOT/assets/css/refactor/listone.css"
  "$SITE_ROOT/assets/css/refactor/calciomercato.css"
  "$SITE_ROOT/assets/css/refactor/theme-light-suspended.css"
)

obsolete_files=(
  "$SITE_ROOT/assets/css/refactor/mobile-controls-v291.css"
  "$SITE_ROOT/assets/css/refactor/rosters-tables-v291.css"
  "$SITE_ROOT/assets/css/refactor/mobile-controls-v292.css"
  "$SITE_ROOT/assets/css/refactor/rosters-tables-v292.css"
  "$SITE_ROOT/assets/css/refactor/theme-light-suspended-v292.css"
)

failures=0
for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "FAIL: CSS stabile mancante: ${file#$SITE_ROOT/}" >&2
    failures=$((failures + 1))
  fi
done

for obsolete in "${obsolete_files[@]}"; do
  rel="${obsolete#$SITE_ROOT/}"
  if grep -R --include='*.html' --include='*.js' --include='*.css' -F "$rel" "$SITE_ROOT" >/dev/null 2>&1; then
    refs="$(grep -R --include='*.html' --include='*.js' --include='*.css' -l -F "$rel" "$SITE_ROOT" | sed "s#^$SITE_ROOT/##" | grep -v '^tools/cleanup-css-legacy-v343.sh$' || true)"
    blocking="$(printf '%s\n' "$refs" | grep -Ev '^(assets/app\.js|tools/cleanup-css-refactor-v301\.sh|tools/check-zonaorientale\.sh|assets/styles\.css|assets/css/refactor/.*|tools/cleanup-css-legacy-v343\.sh)$' || true)"
    if [[ -n "$blocking" ]]; then
      echo "FAIL: riferimento runtime inatteso a $rel" >&2
      printf '%s\n' "$blocking" >&2
      failures=$((failures + 1))
    fi
  fi
done

if [[ "$failures" -gt 0 ]]; then
  echo "Pulizia CSS legacy bloccata: $failures problemi." >&2
  exit 1
fi

if [[ "$APPLY" -eq 0 ]]; then
  echo "Dry-run OK. I CSS legacy V291/V292 sono rimovibili in modo controllato."
  for file in "${obsolete_files[@]}"; do
    if [[ -f "$file" ]]; then
      echo "- rimuovibile: ${file#$SITE_ROOT/}"
    else
      echo "- gia assente: ${file#$SITE_ROOT/}"
    fi
  done
  echo "Per applicare: static/zonaorientale/tools/cleanup-css-legacy-v343.sh --apply"
  exit 0
fi

for file in "${obsolete_files[@]}"; do
  if [[ -f "$file" ]]; then
    rm -f "$file"
    echo "Rimosso: ${file#$SITE_ROOT/}"
  fi
done

echo "Pulizia CSS legacy V343 completata."
if [[ -n "$REPO_ROOT" ]]; then
  echo "Consiglio Git: usa git status e includi le deletion nel commit V343."
fi
