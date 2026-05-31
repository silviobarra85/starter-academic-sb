#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ -d "$SITE_ROOT/assets" ]]; then
  :
else
  echo "Errore: cartella assets non trovata vicino allo script." >&2
  echo "Esegui lo script dalla repo con: static/zonaorientale/tools/check-zonaorientale.sh" >&2
  exit 1
fi

REPO_ROOT=""
if git -C "$SITE_ROOT" rev-parse --show-toplevel >/dev/null 2>&1; then
  REPO_ROOT="$(git -C "$SITE_ROOT" rev-parse --show-toplevel)"
fi

DOCS_ROOT=""
if [[ -n "$REPO_ROOT" && -d "$REPO_ROOT/docs/zonaorientale" ]]; then
  DOCS_ROOT="$REPO_ROOT/docs/zonaorientale"
elif [[ -d "$SITE_ROOT/../docs/zonaorientale" ]]; then
  DOCS_ROOT="$(cd "$SITE_ROOT/../docs/zonaorientale" && pwd)"
fi

failures=0
warns=0

print_step() {
  printf '\n== %s ==\n' "$1"
}

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  failures=$((failures + 1))
}

warn() {
  printf 'WARN: %s\n' "$1" >&2
  warns=$((warns + 1))
}

pass() {
  printf 'OK: %s\n' "$1"
}

print_step "Contesto"
printf 'Sito: %s\n' "$SITE_ROOT"
if [[ -n "$REPO_ROOT" ]]; then
  printf 'Repo: %s\n' "$REPO_ROOT"
else
  warn "non sono dentro una repo Git; salto i controlli git ls-files"
fi
if [[ -n "$DOCS_ROOT" ]]; then
  printf 'Docs: %s\n' "$DOCS_ROOT"
else
  warn "cartella docs/zonaorientale non trovata; controllo solo il sito"
fi

print_step "Sintassi JavaScript"
if command -v node >/dev/null 2>&1; then
  js_count=0
  while IFS= read -r -d '' js_file; do
    js_count=$((js_count + 1))
    node --check "$js_file" >/dev/null
  done < <(find "$SITE_ROOT/assets" -name '*.js' -type f -print0)
  pass "node --check completato su $js_count file JS"
else
  fail "node non disponibile"
fi

print_step "Validita JSON"
json_count=0
if command -v jq >/dev/null 2>&1; then
  while IFS= read -r -d '' json_file; do
    json_count=$((json_count + 1))
    jq empty "$json_file" >/dev/null
  done < <(find "$SITE_ROOT/assets" -name '*.json' -type f -print0)
  pass "jq empty completato su $json_count file JSON"
elif command -v python3 >/dev/null 2>&1; then
  while IFS= read -r -d '' json_file; do
    json_count=$((json_count + 1))
    python3 -m json.tool "$json_file" >/dev/null
  done < <(find "$SITE_ROOT/assets" -name '*.json' -type f -print0)
  pass "python3 -m json.tool completato su $json_count file JSON"
else
  fail "ne jq ne python3 sono disponibili per validare i JSON"
fi

print_step "Versione deploy"
app_file="$SITE_ROOT/assets/app.js"
expected_version=""
if [[ -f "$app_file" ]]; then
  expected_version="$(sed -n 's/^const DEPLOY_EXPECTED_VERSION_V181 = "\([0-9][0-9]*\)";$/\1/p' "$app_file" | tail -n 1)"
fi

if [[ -z "$expected_version" ]]; then
  fail "DEPLOY_EXPECTED_VERSION_V181 non trovato in assets/app.js"
else
  pass "DEPLOY_EXPECTED_VERSION_V181 = V$expected_version"
fi

html_files=("$SITE_ROOT/index.html" "$SITE_ROOT/competition.html" "$SITE_ROOT/player.html")
for html_file in "${html_files[@]}"; do
  if [[ ! -f "$html_file" ]]; then
    fail "file HTML mancante: $html_file"
    continue
  fi
  html_name="$(basename "$html_file")"
  if [[ -n "$expected_version" ]] && ! grep -q "V$expected_version" "$html_file"; then
    fail "$html_name non contiene footer/versione V$expected_version"
  else
    pass "$html_name contiene footer/versione V$expected_version"
  fi
  versions="$(grep -o '?v=[0-9][0-9]*' "$html_file" | sed 's/?v=//' | sort -u | tr '\n' ' ' | sed 's/[[:space:]]*$//')"
  if [[ -n "$expected_version" && -n "$versions" && "$versions" != "$expected_version" ]]; then
    fail "$html_name ha cache-buster non allineati: $versions; atteso $expected_version"
  else
    pass "$html_name cache-buster allineati"
  fi
done

if [[ -n "$expected_version" ]]; then
  app_versions="$(grep -o '?v=[0-9][0-9]*' "$app_file" | sed 's/?v=//' | sort -u | tr '\n' ' ' | sed 's/[[:space:]]*$//')"
  if [[ -n "$app_versions" && "$app_versions" != "$expected_version" ]]; then
    fail "assets/app.js ha import cache-buster non allineati: $app_versions; atteso $expected_version"
  else
    pass "assets/app.js import cache-buster allineati"
  fi
fi

print_step "File macOS indesiderati"
macos_roots=("$SITE_ROOT")
if [[ -n "$DOCS_ROOT" ]]; then
  macos_roots+=("$DOCS_ROOT")
fi
macos_found="$(find "${macos_roots[@]}" \( -name '.DS_Store' -o -name '._*' -o -name '__MACOSX' -o -name '.AppleDouble' -o -name '.LSOverride' \) -print 2>/dev/null || true)"
if [[ -n "$macos_found" ]]; then
  printf '%s\n' "$macos_found"
  fail "trovati file macOS indesiderati nel sito/docs"
  if [[ -x "$SCRIPT_DIR/cleanup-macos-artifacts-v283.sh" ]]; then
    printf 'Suggerimento: esegui %s/cleanup-macos-artifacts-v283.sh per il dry-run.\n' "$SCRIPT_DIR"
  fi
else
  pass "nessun file macOS indesiderato trovato nel sito/docs"
fi

if [[ -n "$REPO_ROOT" ]]; then
  tracked_macos="$(git -C "$REPO_ROOT" ls-files | grep -E '(^|/)(\.DS_Store|__MACOSX|\._|\.AppleDouble|\.LSOverride)' || true)"
  if [[ -n "$tracked_macos" ]]; then
    printf '%s\n' "$tracked_macos"
    fail "trovati file macOS tracciati da Git"
  else
    pass "nessun file macOS tracciato da Git"
  fi
fi


print_step "Audit mobile"
if [[ -n "$DOCS_ROOT" ]]; then
  mobile_audit_doc="$DOCS_ROOT/audit/AUDIT_MOBILE_COMPLETO_V284.md"
  mobile_fix_doc="$DOCS_ROOT/audit/FIX_MOBILE_MIRATI_V285.md"
  sticky_fix_doc="$DOCS_ROOT/audit/FIX_PRIMA_COLONNA_MOBILE_LIGHT_V286.md"
  controls_fix_doc="$DOCS_ROOT/audit/RIFINITURA_CONTROLLI_MOBILE_V287.md"
  roster_fix_doc="$DOCS_ROOT/audit/FIX_ROSE_MOBILE_LIGHT_V288.md"
  dark_mode_doc="$DOCS_ROOT/audit/DARK_MODE_ROSE_MOBILE_V289.md"
  if [[ -f "$mobile_audit_doc" ]]; then
    pass "audit mobile V284 disponibile: audit/AUDIT_MOBILE_COMPLETO_V284.md"
  else
    warn "audit mobile V284 non trovato; se stai lavorando su UI/mobile consulta o aggiorna docs/zonaorientale/audit"
  fi
  if [[ -f "$mobile_fix_doc" ]]; then
    pass "fix mobile V285 documentato: audit/FIX_MOBILE_MIRATI_V285.md"
  else
    warn "documento fix mobile V285 non trovato; se stai applicando V285 verifica docs/zonaorientale/audit"
  fi
  if [[ -f "$sticky_fix_doc" ]]; then
    pass "fix prima colonna V286 documentato: audit/FIX_PRIMA_COLONNA_MOBILE_LIGHT_V286.md"
  else
    warn "documento fix prima colonna V286 non trovato; se stai applicando V286 verifica docs/zonaorientale/audit"
  fi
  if [[ -f "$controls_fix_doc" ]]; then
    pass "rifinitura controlli mobile V287 documentata: audit/RIFINITURA_CONTROLLI_MOBILE_V287.md"
  else
    warn "documento rifinitura controlli V287 non trovato; se stai applicando V287 verifica docs/zonaorientale/audit"
  fi
  if [[ -f "$roster_fix_doc" ]]; then
    pass "fix rose mobile Light V288 documentato: audit/FIX_ROSE_MOBILE_LIGHT_V288.md"
  else
    warn "documento fix rose mobile Light V288 non trovato; se stai applicando V288 verifica docs/zonaorientale/audit"
  fi
  if [[ -f "$dark_mode_doc" ]]; then
    pass "dark mode e rose mobile V289 documentato: audit/DARK_MODE_ROSE_MOBILE_V289.md"
  else
    warn "documento dark mode/rose mobile V289 non trovato; se stai applicando V289 verifica docs/zonaorientale/audit"
  fi
else
  warn "docs non disponibili; salto controllo audit mobile"
fi

print_step "Riepilogo"
if [[ "$failures" -gt 0 ]]; then
  printf 'Controlli falliti: %s. Warning: %s.\n' "$failures" "$warns" >&2
  exit 1
fi
printf 'Tutti i controlli obbligatori sono passati. Warning: %s.\n' "$warns"
