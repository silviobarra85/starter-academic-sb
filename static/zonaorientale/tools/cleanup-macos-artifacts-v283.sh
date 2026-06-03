#!/usr/bin/env bash
set -euo pipefail

apply=0
git_rm=0

for arg in "$@"; do
  case "$arg" in
    --apply)
      apply=1
      ;;
    --git-rm)
      git_rm=1
      ;;
    -h|--help)
      echo "Uso: $0 [--apply] [--git-rm]"
      exit 0
      ;;
    *)
      echo "Argomento non riconosciuto: $arg" >&2
      exit 2
      ;;
  esac
done

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$repo_root"

echo "Root controllo: $repo_root"

if [ "$apply" -eq 1 ] || [ "$git_rm" -eq 1 ]; then
  echo "Modalita: apply"
else
  echo "Modalita: dry-run"
fi

tmp_file="$(mktemp)"
trap 'rm -f "$tmp_file"' EXIT

find static/zonaorientale docs/zonaorientale \
  \( -name ".DS_Store" -o -name "._*" -o -name "__MACOSX" -o -name ".AppleDouble" -o -name ".LSOverride" \) \
  -print > "$tmp_file"

if [ ! -s "$tmp_file" ]; then
  echo "OK: nessun file macOS indesiderato trovato."
else
  echo "File macOS indesiderati trovati:"
  cat "$tmp_file"

  if [ "$apply" -eq 1 ]; then
    while IFS= read -r path; do
      if [ -d "$path" ]; then
        rm -rf "$path"
      else
        rm -f "$path"
      fi
    done < "$tmp_file"
    echo "OK: file macOS indesiderati rimossi dalla working tree."
  else
    echo "Dry-run: usa --apply per rimuovere i file non tracciati."
  fi
fi

if [ "$git_rm" -eq 1 ]; then
  echo "Controllo file macOS tracciati da Git..."
  git ls-files static/zonaorientale docs/zonaorientale | while IFS= read -r tracked; do
    base="$(basename "$tracked")"
    case "$base" in
      .DS_Store|._*|__MACOSX|.AppleDouble|.LSOverride)
        git rm -r -- "$tracked"
        ;;
    esac
  done
fi
