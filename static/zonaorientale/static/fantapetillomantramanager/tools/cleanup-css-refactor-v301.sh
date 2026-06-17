#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
APPLY=0
GIT_RM=0
QUIET=0

for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=1 ;;
    --git-rm) GIT_RM=1 ;;
    --quiet) QUIET=1 ;;
    -h|--help)
      cat <<'EOF'
Uso:
  static/zonaorientale/tools/cleanup-css-refactor-v301.sh
  static/zonaorientale/tools/cleanup-css-refactor-v301.sh --apply
  static/zonaorientale/tools/cleanup-css-refactor-v301.sh --git-rm
  static/zonaorientale/tools/cleanup-css-refactor-v301.sh --apply --git-rm

Senza opzioni fa solo dry-run. Rimuove solo CSS refactor versionati obsoleti V291/V292
se non sono piu' referenziati dagli HTML principali o da assets/app.js.
EOF
      exit 0
      ;;
    *)
      echo "Argomento non riconosciuto: $arg" >&2
      exit 1
      ;;
  esac
done

say() {
  if [[ "$QUIET" -eq 0 ]]; then
    printf '%s\n' "$1"
  fi
}

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

if [[ ! -d "$SITE_ROOT/assets/css/refactor" ]]; then
  fail "cartella assets/css/refactor non trovata"
fi

stable_files=(
  "$SITE_ROOT/assets/css/refactor/mobile-controls.css"
  "$SITE_ROOT/assets/css/refactor/rosters-tables.css"
  "$SITE_ROOT/assets/css/refactor/theme-light-suspended.css"
)

for stable_file in "${stable_files[@]}"; do
  if [[ ! -f "$stable_file" ]]; then
    fail "CSS stabile richiesto mancante: ${stable_file#$SITE_ROOT/}"
  fi
done

obsolete_files=(
  "$SITE_ROOT/assets/css/refactor/mobile-controls-v291.css"
  "$SITE_ROOT/assets/css/refactor/rosters-tables-v291.css"
  "$SITE_ROOT/assets/css/refactor/mobile-controls-v292.css"
  "$SITE_ROOT/assets/css/refactor/rosters-tables-v292.css"
  "$SITE_ROOT/assets/css/refactor/theme-light-suspended-v292.css"
)

found=()
for file in "${obsolete_files[@]}"; do
  if [[ -e "$file" ]]; then
    found+=("$file")
  fi
done

if [[ "${#found[@]}" -eq 0 ]]; then
  say "OK: nessun CSS refactor versionato obsoleto trovato."
  exit 0
fi

say "CSS refactor versionati obsoleti trovati:"
for file in "${found[@]}"; do
  say "- ${file#$SITE_ROOT/}"
done

# Guard: non rimuovere file ancora referenziati.
for file in "${found[@]}"; do
  base="$(basename "$file")"
  refs="$(grep -R --exclude-dir=.git --exclude='cleanup-css-refactor-v301.sh' -n "$base" "$SITE_ROOT/index.html" "$SITE_ROOT/competition.html" "$SITE_ROOT/player.html" "$SITE_ROOT/assets/app.js" 2>/dev/null || true)"
  if [[ -n "$refs" ]]; then
    printf '%s\n' "$refs" >&2
    fail "${file#$SITE_ROOT/} e' ancora referenziato; non rimuovo"
  fi
done

if [[ "$APPLY" -eq 0 && "$GIT_RM" -eq 0 ]]; then
  say "Dry-run: nessuna rimozione effettuata. Usa --apply oppure --git-rm dopo i test."
  exit 0
fi

if [[ "$GIT_RM" -eq 1 ]]; then
  if ! git -C "$SITE_ROOT" rev-parse --show-toplevel >/dev/null 2>&1; then
    fail "--git-rm richiede una repo Git"
  fi
  for file in "${found[@]}"; do
    if git -C "$SITE_ROOT" ls-files --error-unmatch "${file#$SITE_ROOT/}" >/dev/null 2>&1; then
      git -C "$SITE_ROOT" rm "${file#$SITE_ROOT/}"
    else
      rm -f "$file"
    fi
  done
  say "OK: rimozione via git rm/rm completata."
else
  for file in "${found[@]}"; do
    rm -f "$file"
  done
  say "OK: rimozione locale completata."
fi
