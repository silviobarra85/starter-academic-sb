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


print_step "CSS refactor"
css_refactor_files=(
  "$SITE_ROOT/assets/css/refactor/mobile-controls.css"
  "$SITE_ROOT/assets/css/refactor/rosters-tables.css"
  "$SITE_ROOT/assets/css/refactor/theme-light-suspended.css"
)
for css_refactor_file in "${css_refactor_files[@]}"; do
  if [[ -f "$css_refactor_file" ]]; then
    pass "CSS refactor stabile presente: ${css_refactor_file#$SITE_ROOT/}"
  else
    fail "CSS refactor stabile mancante: ${css_refactor_file#$SITE_ROOT/}"
  fi
done
old_css_refactor_files=(
  "$SITE_ROOT/assets/css/refactor/mobile-controls-v292.css"
  "$SITE_ROOT/assets/css/refactor/rosters-tables-v292.css"
  "$SITE_ROOT/assets/css/refactor/theme-light-suspended-v292.css"
)
for old_css_refactor_file in "${old_css_refactor_files[@]}"; do
  if [[ -f "$old_css_refactor_file" ]]; then
    warn "CSS refactor versionato vecchio ancora presente: ${old_css_refactor_file#$SITE_ROOT/} (rimuovere con git rm dopo V299)"
  fi
done
if grep -R "css/refactor/.*-v292.css" "$SITE_ROOT"/*.html >/dev/null 2>&1; then
  fail "HTML ancora collegati a CSS refactor V292; aggiornare agli alias stabili V299"
else
  pass "HTML collegati ai CSS refactor stabili V299"
fi


print_step "Helper JS refactor"
helper_v295_file="$SITE_ROOT/assets/js/utils/shared-helpers-v295.js"
if [[ -f "$helper_v295_file" ]]; then
  pass "helper puri V295 presente: assets/js/utils/shared-helpers-v295.js"
else
  fail "helper puri V295 mancante: assets/js/utils/shared-helpers-v295.js"
fi

helper_v294_file="$SITE_ROOT/assets/js/utils/shared-helpers-v294.js"
if [[ -f "$helper_v294_file" ]]; then
  fail "helper obsoleto V294 ancora presente: assets/js/utils/shared-helpers-v294.js (rimuovere con git rm)"
else
  pass "helper obsoleto V294 rimosso"
fi

admin_only_marker="ZonaOrientaleListoneExportAdminOnlyV296"
if grep -q "$admin_only_marker" "$app_file"; then
  pass "export modifiche Listone admin-only V296 presente"
else
  fail "export modifiche Listone admin-only V296 non rilevato in assets/app.js"
fi

helper_rewire_v302_marker="ZonaOrientaleAppHelperRewireV302"
if grep -q "$helper_rewire_v302_marker" "$app_file" && grep -q "rowsToCsv(rows, columns" "$app_file"; then
  pass "secondo collegamento helper CSV V302 presente"
else
  fail "secondo collegamento helper CSV V302 non rilevato in assets/app.js"
fi

admin_diagnostics_v303_marker="ZonaOrientaleAdminDiagnosticsV303"
if grep -q "$admin_diagnostics_v303_marker" "$app_file"; then
  pass "diagnostica dati Admin estesa V303 presente"
else
  fail "diagnostica dati Admin estesa V303 non rilevata in assets/app.js"
fi

mobile_review_v304_marker="ZonaOrientaleMobileFinalReviewV304"
if grep -q "$mobile_review_v304_marker" "$app_file"; then
  pass "mobile review finale V304 presente"
else
  fail "mobile review finale V304 non rilevata in assets/app.js"
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
  mobile_final_review_doc="$DOCS_ROOT/audit/MOBILE_REVIEW_FINALE_V304.md"
  if [[ -f "$mobile_final_review_doc" ]]; then
    pass "mobile review finale V304 documentata: audit/MOBILE_REVIEW_FINALE_V304.md"
  else
    warn "mobile review finale V304 non documentata; verificare docs/zonaorientale/audit/MOBILE_REVIEW_FINALE_V304.md"
  fi
else
  warn "docs non disponibili; salto controllo audit mobile"
fi

print_step "Audit refactor"
if [[ -n "$DOCS_ROOT" ]]; then
  styles_app_audit_doc="$DOCS_ROOT/refactor/AUDIT_STYLES_APP_V290.md"
  css_refactor_doc="$DOCS_ROOT/refactor/CSS_REFACTOR_V291.md"
  css_cleanup_doc="$DOCS_ROOT/refactor/CSS_CLEANUP_V292.md"
  app_js_audit_doc="$DOCS_ROOT/refactor/APP_JS_AUDIT_V293.md"
  app_helpers_doc="$DOCS_ROOT/refactor/APP_HELPERS_EXTRACTION_V294.md"
  app_helper_rewire_doc="$DOCS_ROOT/refactor/APP_HELPER_REWIRE_V295.md"
  app_export_admin_doc="$DOCS_ROOT/refactor/LISTONE_EXPORT_ADMIN_ONLY_V296.md"
  app_helper_cleanup_doc="$DOCS_ROOT/refactor/APP_HELPER_CLEANUP_V297.md"
  if [[ -f "$styles_app_audit_doc" ]]; then
    pass "audit styles/app V290 disponibile: refactor/AUDIT_STYLES_APP_V290.md"
  else
    warn "audit styles/app V290 non trovato; prima di refactor CSS/JS creare o aggiornare docs/zonaorientale/refactor"
  fi
  if [[ -f "$css_refactor_doc" ]]; then
    pass "refactor CSS V291 documentato: refactor/CSS_REFACTOR_V291.md"
  else
    warn "refactor CSS V291 non documentato; verificare docs/zonaorientale/refactor/CSS_REFACTOR_V291.md"
  fi
  if [[ -f "$css_cleanup_doc" ]]; then
    pass "pulizia CSS V292 documentata: refactor/CSS_CLEANUP_V292.md"
  else
    warn "pulizia CSS V292 non documentata; verificare docs/zonaorientale/refactor/CSS_CLEANUP_V292.md"
  fi
  if [[ -f "$app_js_audit_doc" ]]; then
    pass "audit app.js V293 documentato: refactor/APP_JS_AUDIT_V293.md"
  else
    warn "audit app.js V293 non documentato; prima di estrarre helper JS creare docs/zonaorientale/refactor/APP_JS_AUDIT_V293.md"
  fi
  if [[ -f "$app_helpers_doc" ]]; then
    pass "estrazione helper V294 documentata: refactor/APP_HELPERS_EXTRACTION_V294.md"
  else
    warn "estrazione helper V294 non documentata; verificare docs/zonaorientale/refactor/APP_HELPERS_EXTRACTION_V294.md"
  fi
  if [[ -f "$app_helper_rewire_doc" ]]; then
    pass "primo collegamento helper V295 documentato: refactor/APP_HELPER_REWIRE_V295.md"
  else
    warn "primo collegamento helper V295 non documentato; verificare docs/zonaorientale/refactor/APP_HELPER_REWIRE_V295.md"
  fi

  if [[ -f "$app_export_admin_doc" ]]; then
    pass "export modifiche admin-only V296 documentato: refactor/LISTONE_EXPORT_ADMIN_ONLY_V296.md"
  else
    warn "export modifiche admin-only V296 non documentato; verificare docs/zonaorientale/refactor/LISTONE_EXPORT_ADMIN_ONLY_V296.md"
  fi
  if [[ -f "$app_helper_cleanup_doc" ]]; then
    pass "pulizia helper V297 documentata: refactor/APP_HELPER_CLEANUP_V297.md"
  else
    warn "pulizia helper V297 non documentata; verificare docs/zonaorientale/refactor/APP_HELPER_CLEANUP_V297.md"
  fi
  css_stable_doc="$DOCS_ROOT/refactor/CSS_REFACTOR_STABLE_V299.md"
  if [[ -f "$css_stable_doc" ]]; then
    pass "CSS refactor stabile V299 documentato: refactor/CSS_REFACTOR_STABLE_V299.md"
  else
    warn "CSS refactor stabile V299 non documentato; verificare docs/zonaorientale/refactor/CSS_REFACTOR_STABLE_V299.md"
  fi

  app_helper_rewire_v302_doc="$DOCS_ROOT/refactor/APP_HELPER_REWIRE_V302.md"
  if [[ -f "$app_helper_rewire_v302_doc" ]]; then
    pass "secondo collegamento helper V302 documentato: refactor/APP_HELPER_REWIRE_V302.md"
  else
    warn "secondo collegamento helper V302 non documentato; verificare docs/zonaorientale/refactor/APP_HELPER_REWIRE_V302.md"
  fi
  calciomercato_plan_doc="$DOCS_ROOT/pianificazione/CALCIOMERCATO_AGGREGATORE_V302.md"
  if [[ -f "$calciomercato_plan_doc" ]]; then
    pass "studio fattibilita Calcio mercato V302 documentato: pianificazione/CALCIOMERCATO_AGGREGATORE_V302.md"
  else
    warn "studio fattibilita Calcio mercato V302 non trovato; se si pianifica la feature creare docs/zonaorientale/pianificazione/CALCIOMERCATO_AGGREGATORE_V302.md"
  fi
  admin_diag_v303_doc="$DOCS_ROOT/admin/DIAGNOSTICA_DATI_V303.md"
  if [[ -f "$admin_diag_v303_doc" ]]; then
    pass "diagnostica dati Admin V303 documentata: admin/DIAGNOSTICA_DATI_V303.md"
  else
    warn "diagnostica dati Admin V303 non documentata; verificare docs/zonaorientale/admin/DIAGNOSTICA_DATI_V303.md"
  fi
else
  warn "docs non disponibili; salto controllo audit refactor"
fi



print_step "Audit asset/import"
asset_audit_tool="$SCRIPT_DIR/audit-assets-v298.sh"
if [[ -x "$asset_audit_tool" ]]; then
  pass "tool audit asset/import V298 presente: tools/audit-assets-v298.sh"
else
  fail "tool audit asset/import V298 mancante o non eseguibile: tools/audit-assets-v298.sh"
fi
if [[ -n "$DOCS_ROOT" ]]; then
  asset_audit_doc="$DOCS_ROOT/refactor/ASSET_IMPORT_AUDIT_V298.md"
  if [[ -f "$asset_audit_doc" ]]; then
    pass "audit asset/import V298 documentato: refactor/ASSET_IMPORT_AUDIT_V298.md"
  else
    warn "audit asset/import V298 non documentato; verificare docs/zonaorientale/refactor/ASSET_IMPORT_AUDIT_V298.md"
  fi
else
  warn "docs non disponibili; salto controllo documento audit asset/import V298"
fi



print_step "Audit CSS"
css_audit_tool="$SCRIPT_DIR/audit-css-v300.sh"
if [[ -x "$css_audit_tool" ]]; then
  pass "tool audit CSS V300 presente: tools/audit-css-v300.sh"
else
  fail "tool audit CSS V300 mancante o non eseguibile: tools/audit-css-v300.sh"
fi

cleanup_css_tool="$SCRIPT_DIR/cleanup-css-refactor-v301.sh"
if [[ -x "$cleanup_css_tool" ]]; then
  pass "tool pulizia CSS refactor V301 presente: tools/cleanup-css-refactor-v301.sh"
else
  fail "tool pulizia CSS refactor V301 mancante o non eseguibile: tools/cleanup-css-refactor-v301.sh"
fi
if [[ -n "$DOCS_ROOT" ]]; then
  css_cleanup_doc="$DOCS_ROOT/refactor/CSS_CLEANUP_V301.md"
  if [[ -f "$css_cleanup_doc" ]]; then
    pass "pulizia CSS refactor V301 documentata: refactor/CSS_CLEANUP_V301.md"
  else
    warn "pulizia CSS refactor V301 non documentata; verificare docs/zonaorientale/refactor/CSS_CLEANUP_V301.md"
  fi
else
  warn "docs non disponibili; salto controllo documento pulizia CSS V301"
fi
if [[ -n "$DOCS_ROOT" ]]; then
  css_audit_doc="$DOCS_ROOT/refactor/CSS_AUDIT_V300.md"
  if [[ -f "$css_audit_doc" ]]; then
    pass "audit CSS V300 documentato: refactor/CSS_AUDIT_V300.md"
  else
    warn "audit CSS V300 non documentato; verificare docs/zonaorientale/refactor/CSS_AUDIT_V300.md"
  fi
else
  warn "docs non disponibili; salto controllo documento audit CSS V300"
fi

print_step "Riepilogo"
if [[ "$failures" -gt 0 ]]; then
  printf 'Controlli falliti: %s. Warning: %s.\n' "$failures" "$warns" >&2
  exit 1
fi
printf 'Tutti i controlli obbligatori sono passati. Warning: %s.\n' "$warns"
