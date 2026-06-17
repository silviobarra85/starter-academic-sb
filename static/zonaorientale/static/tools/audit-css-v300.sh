#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
QUIET=0
if [[ "${1:-}" == "--quiet" ]]; then
  QUIET=1
fi

failures=0
warns=0

say() {
  if [[ "$QUIET" -eq 0 ]]; then
    printf '%s\n' "$1"
  fi
}

section() {
  if [[ "$QUIET" -eq 0 ]]; then
    printf '\n== %s ==\n' "$1"
  fi
}

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  failures=$((failures + 1))
}

warn() {
  printf 'WARN: %s\n' "$1" >&2
  warns=$((warns + 1))
}

ok() {
  say "OK: $1"
}

if [[ ! -d "$SITE_ROOT/assets" ]]; then
  fail "cartella assets non trovata vicino allo script"
  exit 1
fi

section "Contesto"
say "Sito: $SITE_ROOT"

styles_file="$SITE_ROOT/assets/styles.css"
mobile_css="$SITE_ROOT/assets/css/refactor/mobile-controls.css"
rosters_css="$SITE_ROOT/assets/css/refactor/rosters-tables.css"
light_css="$SITE_ROOT/assets/css/refactor/theme-light-suspended.css"

section "File CSS principali"
for css_file in "$styles_file" "$mobile_css" "$rosters_css" "$light_css"; do
  rel="${css_file#$SITE_ROOT/}"
  if [[ -f "$css_file" ]]; then
    lines="$(wc -l < "$css_file" | tr -d ' ')"
    ok "$rel presente ($lines righe)"
  else
    fail "$rel mancante"
  fi
done

section "Import CSS HTML"
for html_file in "$SITE_ROOT/index.html" "$SITE_ROOT/competition.html" "$SITE_ROOT/player.html"; do
  html_name="$(basename "$html_file")"
  if [[ ! -f "$html_file" ]]; then
    fail "$html_name mancante"
    continue
  fi
  if grep -q 'assets/css/refactor/mobile-controls.css' "$html_file"; then
    ok "$html_name importa mobile-controls.css"
  else
    fail "$html_name non importa mobile-controls.css"
  fi
  if grep -q 'assets/css/refactor/rosters-tables.css' "$html_file"; then
    ok "$html_name importa rosters-tables.css"
  else
    fail "$html_name non importa rosters-tables.css"
  fi
  if grep -q 'theme-light-suspended.css' "$html_file"; then
    fail "$html_name importa theme-light-suspended.css, ma Light mode deve restare sospesa"
  else
    ok "$html_name non importa theme-light-suspended.css"
  fi
  if grep -q 'assets/css/refactor/.*-v[0-9][0-9]*\.css' "$html_file"; then
    warn "$html_name importa ancora CSS refactor versionati; preferire alias stabili"
  fi
done

section "Vecchi CSS refactor versionati"
old_found="$(find "$SITE_ROOT/assets/css/refactor" -maxdepth 1 -type f \( -name '*-v291.css' -o -name '*-v292.css' \) -print 2>/dev/null || true)"
if [[ -n "$old_found" ]]; then
  printf '%s\n' "$old_found"
  warn "trovati CSS refactor versionati vecchi; usare tools/cleanup-css-refactor-v301.sh in dry-run prima di rimuovere"
else
  ok "nessun CSS refactor V291/V292 residuo trovato"
fi
cleanup_tool="$SITE_ROOT/tools/cleanup-css-refactor-v301.sh"
if [[ -x "$cleanup_tool" ]]; then
  ok "tool pulizia CSS V301 disponibile"
else
  warn "tool pulizia CSS V301 non disponibile; se ci sono residui usare overlay V301"
fi

section "Light mode sospesa"
if grep -R 'id="themeToggle"\|id="themeToggleStandalone"' "$SITE_ROOT"/*.html >/dev/null 2>&1; then
  warn "markup toggle tema ancora presente negli HTML; verificare se nascosto/neutralizzato dal runtime V289"
else
  ok "toggle tema non rilevato negli HTML principali"
fi
if [[ -f "$light_css" ]]; then
  ok "CSS Light sospeso conservato per recupero futuro"
else
  warn "CSS Light sospeso non trovato; se si vuole recuperare Light mode serve un piano dedicato"
fi

section "Selettori critici da preservare"
if [[ -f "$rosters_css" ]]; then
  for pattern in 'sticky' 'roster' 'team-roster' 'table'; do
    if grep -qi "$pattern" "$rosters_css"; then
      ok "rosters-tables.css contiene riferimenti a $pattern"
    else
      warn "rosters-tables.css non contiene riferimenti a $pattern; verificare prima colonna rose/listone"
    fi
  done
fi
if [[ -f "$mobile_css" ]]; then
  for pattern in 'mobile' 'bottom' 'input' 'button'; do
    if grep -qi "$pattern" "$mobile_css"; then
      ok "mobile-controls.css contiene riferimenti a $pattern"
    else
      warn "mobile-controls.css non contiene riferimenti a $pattern; verificare controlli mobile"
    fi
  done
fi

section "Possibili duplicati selettori in styles.css"
if [[ -f "$styles_file" ]]; then
  tmp_selectors="$(mktemp)"
  # Estrazione prudente: prende solo righe che iniziano senza indentazione e terminano con {.
  # Serve come indicatore, non come prova di duplicato sicuro.
  sed -n 's/^[[:space:]]*\([^@{}][^{}]*\)[[:space:]]*{[[:space:]]*$/\1/p' "$styles_file" \
    | sed 's/[[:space:]][[:space:]]*/ /g; s/[[:space:]]*$//' \
    | sort > "$tmp_selectors"
  dup_count="$(uniq -d "$tmp_selectors" | wc -l | tr -d ' ')"
  rm -f "$tmp_selectors"
  if [[ "$dup_count" -gt 0 ]]; then
    warn "styles.css ha $dup_count selettori potenzialmente duplicati; non rimuovere senza audit visuale"
  else
    ok "nessun duplicato semplice rilevato in styles.css"
  fi
fi

section "Funzionalita da non perdere nei prossimi cleanup"
say "- Listone: Modifica, filtri, usciti storici, export CSV admin-only"
say "- Rose/pagina squadra: prima colonna sticky, righe compatte, nomi leggibili"
say "- Dashboard Presidente: tabelle rosa e controlli"
say "- Mobile: bottom navigation, menu Altro, pulsante Su"
say "- Dark mode unico V289, Light mode sospesa"
say "- competition.html e player.html"

section "Riepilogo"
if [[ "$failures" -gt 0 ]]; then
  printf 'Audit CSS fallito: %s errori, %s warning.\n' "$failures" "$warns" >&2
  exit 1
fi
printf 'Audit CSS completato: 0 errori, %s warning.\n' "$warns"
