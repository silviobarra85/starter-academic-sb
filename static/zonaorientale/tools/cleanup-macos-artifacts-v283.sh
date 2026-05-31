#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if git -C "$SITE_ROOT" rev-parse --show-toplevel >/dev/null 2>&1; then
  ROOT="$(git -C "$SITE_ROOT" rev-parse --show-toplevel)"
else
  ROOT="$SITE_ROOT"
fi

APPLY=0
GIT_RM=0

usage() {
  cat <<USAGE
Uso: $0 [--apply] [--git-rm]

Senza opzioni esegue solo un dry-run.
--apply   rimuove fisicamente i file/cartelle macOS trovati nella working tree.
--git-rm  rimuove dall'indice Git eventuali file macOS gia tracciati.

Eseguire sempre prima senza opzioni e controllare l'elenco.
USAGE
}

for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=1 ;;
    --git-rm) GIT_RM=1 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Opzione non riconosciuta: $arg" >&2; usage; exit 2 ;;
  esac
done

printf 'Root controllo: %s\n' "$ROOT"
printf 'Modalita: %s\n' "$([[ "$APPLY" -eq 1 ]] && echo apply || echo dry-run)"
if [[ "$GIT_RM" -eq 1 ]]; then
  printf 'Git rm: attivo\n'
fi

mapfile -d '' found < <(find "$ROOT" \
  -path "$ROOT/.git" -prune -o \
  -path "$ROOT/node_modules" -prune -o \
  \( -name '.DS_Store' -o -name '._*' -o -name '__MACOSX' -o -name '.AppleDouble' -o -name '.LSOverride' \) \
  -print0)

printf '\n== File/cartelle macOS trovati ==\n'
if [[ "${#found[@]}" -eq 0 ]]; then
  printf 'Nessun file macOS trovato.\n'
else
  printf '%s\n' "${found[@]}"
fi

if [[ "$APPLY" -eq 1 && "${#found[@]}" -gt 0 ]]; then
  printf '\n== Rimozione working tree ==\n'
  for item in "${found[@]}"; do
    rm -rf -- "$item"
    printf 'Rimosso: %s\n' "$item"
  done
fi

if [[ "$GIT_RM" -eq 1 ]]; then
  if git -C "$ROOT" rev-parse --show-toplevel >/dev/null 2>&1; then
    mapfile -d '' tracked < <(git -C "$ROOT" ls-files -z | while IFS= read -r -d '' path; do
      case "/$path" in
        */.DS_Store|*/__MACOSX/*|*/._*|*/.AppleDouble/*|*/.LSOverride) printf '%s\0' "$path" ;;
      esac
    done)
    printf '\n== File macOS tracciati da Git ==\n'
    if [[ "${#tracked[@]}" -eq 0 ]]; then
      printf 'Nessun file macOS tracciato.\n'
    else
      printf '%s\n' "${tracked[@]}"
      git -C "$ROOT" rm -r --ignore-unmatch -- "${tracked[@]}"
    fi
  else
    echo "Non sono dentro una repo Git: impossibile usare --git-rm." >&2
    exit 1
  fi
fi

printf '\nComando consigliato dopo eventuale pulizia:\n'
printf '  static/zonaorientale/tools/check-zonaorientale.sh\n'
