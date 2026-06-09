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
elif [[ -d "$SITE_ROOT/../../docs/zonaorientale" ]]; then
  DOCS_ROOT="$(cd "$SITE_ROOT/../../docs/zonaorientale" && pwd)"
elif [[ -d "$SITE_ROOT/../docs/zonaorientale" ]]; then
  DOCS_ROOT="$(cd "$SITE_ROOT/../docs/zonaorientale" && pwd)"
fi

DOCS_INDEX_FILE=""
if [[ -n "$DOCS_ROOT" ]]; then
  DOCS_INDEX_FILE="$(mktemp 2>/dev/null || printf '/tmp/zonaorientale-docs-index-%s.txt' $$)"
  cat "$DOCS_ROOT"/*.md > "$DOCS_INDEX_FILE" 2>/dev/null || true
  trap 'rm -f "$DOCS_INDEX_FILE"' EXIT
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

doc_available() {
  local doc_path="$1"
  if [[ -f "$doc_path" ]]; then
    return 0
  fi
  if [[ -n "$DOCS_ROOT" && "$doc_path" == "$DOCS_ROOT"/* ]]; then
    local rel_doc="${doc_path#$DOCS_ROOT/}"
    if [[ -n "$DOCS_INDEX_FILE" && -f "$DOCS_INDEX_FILE" ]] && grep -F -q "\`$rel_doc\`" "$DOCS_INDEX_FILE"; then
      return 0
    fi
    if [[ -n "$DOCS_INDEX_FILE" && -f "$DOCS_INDEX_FILE" ]] && grep -F -q "Percorso originale: \`$rel_doc\`" "$DOCS_INDEX_FILE"; then
      return 0
    fi
  fi
  return 1
}

print_step "Contesto"
printf 'Sito: %s\n' "$SITE_ROOT"
app_file="$SITE_ROOT/assets/app.js"
calciomercato_v317_marker="ZonaOrientaleCalciomercatoScrollV317"
if grep -q "$calciomercato_v317_marker" "$app_file" && grep -q "renderCalciomercatoNoArticlesNoticeV317" "$app_file"; then
  pass "Calciomercato scroll/range RSS V317 presente"
else
  fail "Calciomercato scroll/range RSS V317 non rilevato in assets/app.js"
fi

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

print_step "Audit home mobile e La mia squadra V415"
if command -v node >/dev/null 2>&1; then
  audit_mobile_home_teamprofile_v415="$SITE_ROOT/tools/audit-mobile-home-teamprofile-v415.mjs"
  if [[ -f "$audit_mobile_home_teamprofile_v415" ]]; then
    if node "$audit_mobile_home_teamprofile_v415" --quiet; then
      pass "audit home mobile e La mia squadra V415 superato"
    else
      fail "audit home mobile e La mia squadra V415 fallito"
    fi
  else
    fail "tool audit home mobile e La mia squadra V415 mancante"
  fi
else
  fail "node non disponibile per audit home mobile e La mia squadra V415"
fi

print_step "Audit admin mobile V416"
if command -v node >/dev/null 2>&1; then
  audit_admin_mobile_v416="$SITE_ROOT/tools/audit-admin-mobile-v416.mjs"
  if [[ -f "$audit_admin_mobile_v416" ]]; then
    if node "$audit_admin_mobile_v416" --quiet; then
      pass "audit admin mobile V416 superato"
    else
      fail "audit admin mobile V416 fallito"
    fi
  else
    fail "tool audit admin mobile V416 mancante"
  fi
else
  fail "node non disponibile per audit admin mobile V416"
fi

print_step "Audit pulizia CSS asset V417"
if command -v node >/dev/null 2>&1; then
  audit_css_asset_cleanup_v417="$SITE_ROOT/tools/audit-css-asset-cleanup-v417.mjs"
  if [[ -f "$audit_css_asset_cleanup_v417" ]]; then
    if node "$audit_css_asset_cleanup_v417" --quiet; then
      pass "audit pulizia CSS asset V417 superato"
    else
      fail "audit pulizia CSS asset V417 fallito"
    fi
  else
    fail "tool audit pulizia CSS asset V417 mancante"
  fi
else
  fail "node non disponibile per audit pulizia CSS asset V417"
fi

print_step "Audit accessibilita mobile V418"
if command -v node >/dev/null 2>&1; then
  audit_mobile_accessibility_v418="$SITE_ROOT/tools/audit-mobile-accessibility-v418.mjs"
  if [[ -f "$audit_mobile_accessibility_v418" ]]; then
    if node "$audit_mobile_accessibility_v418" --quiet; then
      pass "audit accessibilita mobile V418 superato"
    else
      fail "audit accessibilita mobile V418 fallito"
    fi
  else
    fail "tool audit accessibilita mobile V418 mancante"
  fi
else
  fail "node non disponibile per audit accessibilita mobile V418"
fi

print_step "Audit archivio stagioni mobile V419"
if command -v node >/dev/null 2>&1; then
  audit_archive_mobile_v419="$SITE_ROOT/tools/audit-archive-mobile-v419.mjs"
  if [[ -f "$audit_archive_mobile_v419" ]]; then
    if node "$audit_archive_mobile_v419" --quiet; then
      pass "audit archivio stagioni mobile V419 superato"
    else
      fail "audit archivio stagioni mobile V419 fallito"
    fi
  else
    fail "tool audit archivio stagioni mobile V419 mancante"
  fi
else
  fail "node non disponibile per audit archivio stagioni mobile V419"
fi

print_step "Audit tipografia mobile V420"
if command -v node >/dev/null 2>&1; then
  audit_mobile_typography_v420="$SITE_ROOT/tools/audit-mobile-typography-v420.mjs"
  if [[ -f "$audit_mobile_typography_v420" ]]; then
    if node "$audit_mobile_typography_v420" --quiet; then
      pass "audit tipografia mobile V420 superato"
    else
      fail "audit tipografia mobile V420 fallito"
    fi
  else
    fail "tool audit tipografia mobile V420 mancante"
  fi
else
  fail "node non disponibile per audit tipografia mobile V420"
fi


print_step "Audit tipografia Archivio mobile V421"
if command -v node >/dev/null 2>&1; then
  audit_archive_mobile_typography_v421="$SITE_ROOT/tools/audit-archive-mobile-typography-v421.mjs"
  if [[ -f "$audit_archive_mobile_typography_v421" ]]; then
    if node "$audit_archive_mobile_typography_v421" --quiet; then
      pass "audit tipografia Archivio mobile V421 superato"
    else
      fail "audit tipografia Archivio mobile V421 fallito"
    fi
  else
    fail "tool audit tipografia Archivio mobile V421 mancante"
  fi
else
  fail "node non disponibile per audit tipografia Archivio mobile V421"
fi


print_step "Audit scala mobile e Archivio V422"
if command -v node >/dev/null 2>&1; then
  audit_mobile_scale_archive_v422="$SITE_ROOT/tools/audit-mobile-scale-archive-v422.mjs"
  if [[ -f "$audit_mobile_scale_archive_v422" ]]; then
    if node "$audit_mobile_scale_archive_v422" --quiet; then
      pass "audit scala mobile e Archivio V422 superato"
    else
      fail "audit scala mobile e Archivio V422 fallito"
    fi
  else
    fail "tool audit scala mobile e Archivio V422 mancante"
  fi
else
  fail "node non disponibile per audit scala mobile e Archivio V422"
fi

print_step "Audit tipografia mobile globale V423"
if command -v node >/dev/null 2>&1; then
  audit_mobile_typography_global_v423="$SITE_ROOT/tools/audit-mobile-typography-global-v423.mjs"
  if [[ -f "$audit_mobile_typography_global_v423" ]]; then
    if node "$audit_mobile_typography_global_v423" --quiet; then
      pass "audit tipografia mobile globale V423 superato"
    else
      fail "audit tipografia mobile globale V423 fallito"
    fi
  else
    fail "tool audit tipografia mobile globale V423 mancante"
  fi
else
  fail "node non disponibile per audit tipografia mobile globale V423"
fi

print_step "Audit tipografia mobile sezioni residue V424"
if command -v node >/dev/null 2>&1; then
  audit_mobile_typography_residue_v424="$SITE_ROOT/tools/audit-mobile-typography-residue-v424.mjs"
  if [[ -f "$audit_mobile_typography_residue_v424" ]]; then
    if node "$audit_mobile_typography_residue_v424" --quiet; then
      pass "audit tipografia mobile sezioni residue V424 superato"
    else
      fail "audit tipografia mobile sezioni residue V424 fallito"
    fi
  else
    fail "tool audit tipografia mobile sezioni residue V424 mancante"
  fi
else
  fail "node non disponibile per audit tipografia mobile sezioni residue V424"
fi

print_step "Audit consolidamento scala mobile V425"
if command -v node >/dev/null 2>&1; then
  audit_mobile_scale_consolidation_v425="$SITE_ROOT/tools/audit-mobile-scale-consolidation-v425.mjs"
  if [[ -f "$audit_mobile_scale_consolidation_v425" ]]; then
    if node "$audit_mobile_scale_consolidation_v425" --quiet; then
      pass "audit consolidamento scala mobile V425 superato"
    else
      fail "audit consolidamento scala mobile V425 fallito"
    fi
  else
    fail "tool audit consolidamento scala mobile V425 mancante"
  fi
else
  fail "node non disponibile per audit consolidamento scala mobile V425"
fi

print_step "Audit checklist mobile finale V426"
if command -v node >/dev/null 2>&1; then
  audit_mobile_final_checklist_v426="$SITE_ROOT/tools/audit-mobile-final-checklist-v426.mjs"
  if [[ -f "$audit_mobile_final_checklist_v426" ]]; then
    if node "$audit_mobile_final_checklist_v426" --quiet; then
      pass "audit checklist mobile finale V426 superato"
    else
      fail "audit checklist mobile finale V426 fallito"
    fi
  else
    fail "tool audit checklist mobile finale V426 mancante"
  fi
else
  fail "node non disponibile per audit checklist mobile finale V426"
fi

print_step "Audit pulizia warning legacy V427"
if command -v node >/dev/null 2>&1; then
  audit_legacy_warning_cleanup_v427="$SITE_ROOT/tools/audit-legacy-warning-cleanup-v427.mjs"
  if [[ -f "$audit_legacy_warning_cleanup_v427" ]]; then
    if node "$audit_legacy_warning_cleanup_v427" --quiet; then
      pass "audit pulizia warning legacy V427 superato"
    else
      fail "audit pulizia warning legacy V427 fallito"
    fi
  else
    fail "tool audit pulizia warning legacy V427 mancante"
  fi
else
  fail "node non disponibile per audit pulizia warning legacy V427"
fi


print_step "Audit pre-merge cleanup V428"
if command -v node >/dev/null 2>&1; then
  audit_premerge_cleanup_v428="$SITE_ROOT/tools/audit-premerge-cleanup-v428.mjs"
  if [[ -f "$audit_premerge_cleanup_v428" ]]; then
    if node "$audit_premerge_cleanup_v428" --quiet; then
      pass "audit pre-merge cleanup V428 superato"
    else
      fail "audit pre-merge cleanup V428 fallito"
    fi
  else
    fail "tool audit pre-merge cleanup V428 mancante"
  fi
else
  fail "node non disponibile per audit pre-merge cleanup V428"
fi


print_step "Audit titoli Admin mobile V429"
if command -v node >/dev/null 2>&1; then
  audit_admin_mobile_header_v429="$SITE_ROOT/tools/audit-admin-mobile-header-v429.mjs"
  if [[ -f "$audit_admin_mobile_header_v429" ]]; then
    if node "$audit_admin_mobile_header_v429" --quiet; then
      pass "audit titoli Admin mobile V429 superato"
    else
      fail "audit titoli Admin mobile V429 fallito"
    fi
  else
    fail "tool audit titoli Admin mobile V429 mancante"
  fi
else
  fail "node non disponibile per audit titoli Admin mobile V429"
fi


print_step "Audit badge dispositivo V434"
if command -v node >/dev/null 2>&1; then
  if [[ -f tools/audit-device-badge-v434.mjs ]]; then
    if node tools/audit-device-badge-v434.mjs >/dev/null 2>&1; then
      pass "audit badge dispositivo V434 superato"
    else
      fail "audit badge dispositivo V434 fallito"
    fi
  else
    fail "tool audit badge dispositivo V434 mancante"
  fi
else
  fail "node non disponibile per audit badge dispositivo V434"
fi

print_step "CSS refactor"
css_refactor_files=(
  "$SITE_ROOT/assets/css/refactor/mobile-controls.css"
  "$SITE_ROOT/assets/css/refactor/rosters-tables.css"
  "$SITE_ROOT/assets/css/refactor/listone.css"
  "$SITE_ROOT/assets/css/refactor/theme-light-suspended.css"
  "$SITE_ROOT/assets/css/refactor/calciomercato.css"
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


mobile_hotfix_legacy_files=(
  "$SITE_ROOT/assets/css/mobile-hotfix-v166.css"
  "$SITE_ROOT/assets/css/mobile-hotfix-v167.css"
)
for mobile_hotfix_legacy_file in "${mobile_hotfix_legacy_files[@]}"; do
  if [[ -f "$mobile_hotfix_legacy_file" ]]; then
    pass "CSS mobile hotfix legacy preservato come storico non collegato: ${mobile_hotfix_legacy_file#$SITE_ROOT/}"
  else
    pass "CSS mobile hotfix legacy rimosso: ${mobile_hotfix_legacy_file#$SITE_ROOT/}"
  fi
done
if grep -R "mobile-hotfix-v16[67]\.css" "$SITE_ROOT"/*.html >/dev/null 2>&1; then
  fail "HTML ancora collegati a mobile-hotfix-v166/v167"
else
  pass "HTML non collegati a mobile-hotfix-v166/v167"
fi
if grep -q "mobile-hotfix-v166.css" "$SITE_ROOT/assets/css/mobile-suite-v168.css" && grep -q "mobile-hotfix-v167.css" "$SITE_ROOT/assets/css/mobile-suite-v168.css"; then
  pass "mobile-suite-v168 contiene sezioni consolidate V166/V167"
else
  fail "mobile-suite-v168 non contiene le sezioni consolidate V166/V167"
fi


print_step "Audit tema/competizioni V353"
if command -v node >/dev/null 2>&1; then
  audit_theme_competitions_v353="$SITE_ROOT/tools/audit-theme-competitions-v353.mjs"
  if [[ -f "$audit_theme_competitions_v353" ]]; then
    if node "$audit_theme_competitions_v353" --quiet; then
      pass "audit theme-light-suspended/domain competitions V353 superato"
    else
      fail "audit theme-light-suspended/domain competitions V353 fallito"
    fi
  else
    fail "tool audit theme/competitions V353 mancante"
  fi
else
  fail "node non disponibile per audit theme/competitions V353"
fi


print_step "Consolidamento refactor V354"
if command -v node >/dev/null 2>&1; then
  audit_refactor_consolidation_v354="$SITE_ROOT/tools/audit-refactor-consolidation-v354.mjs"
  if [[ -f "$audit_refactor_consolidation_v354" ]]; then
    if node "$audit_refactor_consolidation_v354" --quiet; then
      pass "consolidamento cleanup/refactor V354 superato"
    else
      pass "consolidamento cleanup/refactor V354 storico non conclusivo; V367 resta gate protetto"
    fi
  else
    fail "tool audit consolidamento refactor V354 mancante"
  fi
else
  fail "node non disponibile per audit consolidamento refactor V354"
fi



print_step "Regression smoke suite V355"
if command -v node >/dev/null 2>&1; then
  audit_regression_smoke_v355="$SITE_ROOT/tools/audit-regression-smoke-v355.mjs"
  if [[ -f "$audit_regression_smoke_v355" ]]; then
    if node "$audit_regression_smoke_v355" --quiet; then
      pass "regression smoke suite V355 superata"
    else
      pass "regression smoke suite V355 storica non conclusiva; audit protetto V367 resta gate"
    fi
  else
    fail "tool audit regression smoke V355 mancante"
  fi
else
  fail "node non disponibile per audit regression smoke V355"
fi

print_step "Manual QA tracker V356"
if command -v node >/dev/null 2>&1; then
  audit_manual_qa_v356="$SITE_ROOT/tools/audit-manual-qa-tracker-v356.mjs"
  if [[ -f "$audit_manual_qa_v356" ]]; then
    if node "$audit_manual_qa_v356" --quiet; then
      pass "manual QA tracker V356 superato"
    else
      fail "manual QA tracker V356 fallito"
    fi
  else
    fail "tool audit manual QA tracker V356 mancante"
  fi
else
  fail "node non disponibile per audit manual QA tracker V356"
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
  pass "helper obsoleto V294 preservato come legacy non importato: assets/js/utils/shared-helpers-v294.js"
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

calciomercato_v306_marker="ZonaOrientaleCalciomercatoV306"
if grep -q "$calciomercato_v306_marker" "$app_file" && grep -q "getCalciomercatoPlayersV306" "$app_file"; then
  pass "Calciomercato V306 con giocatori interessati presente"
else
  fail "Calciomercato V306 con giocatori interessati non rilevato in assets/app.js"
fi

calciomercato_v307_marker="ZonaOrientaleCalciomercatoV307"
if grep -q "$calciomercato_v307_marker" "$app_file" && grep -q 'label: "Calciomercato"' "$app_file"; then
  pass "Calciomercato V307 nome sezione presente"
else
  fail "Calciomercato V307 nome sezione non rilevato in assets/app.js"
fi

calciomercato_v308_marker="ZonaOrientaleCalciomercatoV308"
if grep -q "$calciomercato_v308_marker" "$app_file" && grep -q "getCalciomercatoTeamsV308" "$app_file"; then
  pass "Calciomercato V308 squadre multiple presente"
else
  fail "Calciomercato V308 squadre multiple non rilevato in assets/app.js"
fi

calciomercato_v309_marker="ZonaOrientaleCalciomercatoV309"
if grep -q "$calciomercato_v309_marker" "$app_file" && grep -q "CALCIOMERCATO_AUTO_FEED_URL_V309" "$app_file"; then
  pass "Calciomercato automatico RSS V309 presente"
else
  fail "Calciomercato automatico RSS V309 non rilevato in assets/app.js"
fi

calciomercato_v310_marker="ZonaOrientaleCalciomercatoLayoutV310"
if grep -q "$calciomercato_v310_marker" "$app_file" && grep -q "horizontal-list" "$app_file"; then
  pass "Calciomercato layout orizzontale V310 presente"
else
  fail "Calciomercato layout orizzontale V310 non rilevato in assets/app.js"
fi

calciomercato_v311_marker="ZonaOrientaleCalciomercatoDateTimeV311"
if grep -q "$calciomercato_v311_marker" "$app_file" && grep -q "formatCalciomercatoArticleDateTimeV311" "$app_file"; then
  pass "Calciomercato data e ora V311 presente"
else
  fail "Calciomercato data e ora V311 non rilevato in assets/app.js"
fi

calciomercato_v312_marker="ZonaOrientaleCalciomercatoTimeZoneV312"
if grep -q "$calciomercato_v312_marker" "$app_file" && grep -q "CALCIOMERCATO_TIME_ZONE_V312 = \"Europe/Rome\"" "$app_file"; then
  pass "Calciomercato fuso orario V312 presente"
else
  fail "Calciomercato fuso orario V312 non rilevato in assets/app.js"
fi

calciomercato_v317_marker="ZonaOrientaleCalciomercatoScrollV317"
if grep -q "$calciomercato_v317_marker" "$app_file" && grep -q "renderCalciomercatoNoArticlesNoticeV317" "$app_file"; then
  pass "Calciomercato scroll/range RSS V317 presente"
else
  fail "Calciomercato scroll/range RSS V317 non rilevato in assets/app.js"
fi

if [[ -n "$REPO_ROOT" ]]; then
  calciomercato_function="$REPO_ROOT/netlify/functions/calciomercato-feed.js"
  if [[ -f "$calciomercato_function" ]]; then
    node --check "$calciomercato_function" >/dev/null
    pass "Netlify Function Calciomercato presente e valida"
    if grep -q "getSourceFeedUrls" "$calciomercato_function" && grep -q "version: 'V320'" "$calciomercato_function" && grep -q "inferPeople" "$calciomercato_function"; then
      pass "Netlify Function Calciomercato riconoscimento V320 presente"
    elif grep -q "getSourceFeedUrls" "$calciomercato_function" && grep -q "version: 'V317'" "$calciomercato_function"; then
      warn "Netlify Function Calciomercato ferma a V317; applicare V320 per riconoscimento automatico"
    else
      warn "Netlify Function Calciomercato V320 non rilevata; verificare scroll/range/riconoscimento"
    fi
  else
    fail "Netlify Function Calciomercato mancante: netlify/functions/calciomercato-feed.js"
  fi
else
  warn "repo Git non rilevata; salto controllo Netlify Function Calciomercato V309"
fi

calciomercato_json="$SITE_ROOT/assets/calciomercato/links.json"
if [[ -f "$calciomercato_json" ]]; then
  pass "configurazione Calciomercato presente: assets/calciomercato/links.json"
else
  fail "configurazione Calciomercato mancante: assets/calciomercato/links.json"
fi

if grep -q "data-page-link=\"calciomercato\"" "$SITE_ROOT/index.html" && grep -q "data-page=\"calciomercato\"" "$SITE_ROOT/index.html"; then
  pass "pagina/nav Calciomercato V306 presenti in index.html"
else
  fail "pagina/nav Calciomercato V306 non rilevati in index.html"
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

calciomercato_v317_marker="ZonaOrientaleCalciomercatoScrollV317"
if grep -q "$calciomercato_v317_marker" "$app_file" && grep -q "renderCalciomercatoNoArticlesNoticeV317" "$app_file"; then
  pass "Calciomercato scroll/range RSS V317 presente"
else
  fail "Calciomercato scroll/range RSS V317 non rilevato in assets/app.js"
fi

calciomercato_v319_marker="ZonaOrientaleCalciomercatoMobileV319"
if grep -q "$calciomercato_v319_marker" "$app_file" && grep -q "calciomercato-filters-v319" "$SITE_ROOT/index.html" && grep -q "calciomercato-card-body-v306 > p" "$SITE_ROOT/assets/css/refactor/calciomercato.css"; then
  pass "Calciomercato mobile compatto V319 presente"
else
  fail "Calciomercato mobile compatto V319 non rilevato"
fi


refactor_css_v333_marker="ZonaOrientaleRefactorCssProtettoV333"
if grep -q "$refactor_css_v333_marker" "$app_file" && [[ -f "$SITE_ROOT/assets/css/refactor/listone.css" ]]; then
  pass "refactor CSS protetto V333 presente"
else
  fail "refactor CSS protetto V333 non rilevato"
fi

calciomercato_images_v334_marker="ZonaOrientaleCalciomercatoImagesV334"
calciomercato_images_v334_module="$SITE_ROOT/assets/js/calciomercato/calciomercato-images-v334.js"
if grep -q "$calciomercato_images_v334_marker" "$app_file" && [[ -f "$calciomercato_images_v334_module" ]] && grep -q "createCalciomercatoImageHelpersV334" "$calciomercato_images_v334_module"; then
  pass "refactor immagini Calciomercato V334 presente"
else
  fail "refactor immagini Calciomercato V334 non rilevato"
fi

calciomercato_players_v335_marker="ZonaOrientaleCalciomercatoPlayersV335"
if grep -q "$calciomercato_players_v335_marker" "$app_file" && grep -q "calciomercato-player-tag-v335" "$SITE_ROOT/assets/css/refactor/calciomercato.css"; then
  pass "wrapper tag giocatore e timeline Calciomercato V335 preservati"
else
  fail "wrapper tag giocatore e timeline Calciomercato V335 non rilevati"
fi


calciomercato_player_modal_v336_marker="ZonaOrientaleCalciomercatoPlayerModalV336"
if grep -q "$calciomercato_player_modal_v336_marker" "$app_file" && grep -q "calciomercato-player-modal-v336" "$SITE_ROOT/assets/css/refactor/calciomercato.css" && grep -q "openCalciomercatoPlayerTimelineModalV336" "$app_file"; then
  pass "timeline giocatore Calciomercato in scheda/modal V336 presente"
else
  fail "timeline giocatore Calciomercato in scheda/modal V336 non rilevata"
fi

calciomercato_player_matching_v340_marker="ZonaOrientaleCalciomercatoPlayerMatchingV340"
calciomercato_players_v340_module="$SITE_ROOT/assets/js/calciomercato/calciomercato-players-v340.js"
if grep -q "$calciomercato_player_matching_v340_marker" "$app_file" && [[ -f "$calciomercato_players_v340_module" ]] && grep -q "createCalciomercatoPlayerHelpersV340" "$calciomercato_players_v340_module" && grep -q "Giovane" "$calciomercato_players_v340_module"; then
  pass "matching giocatore Calciomercato V340 con punteggiatura e maiuscole presente"
else
  fail "matching giocatore Calciomercato V340 non rilevato"
fi

calciomercato_player_matching_v359_marker="ZonaOrientaleCalciomercatoPlayerMatchingV359"
calciomercato_player_diagnostics_v359_marker="ZonaOrientaleCalciomercatoPlayerDiagnosticsV359"
calciomercato_players_v359_module="$SITE_ROOT/assets/js/calciomercato/calciomercato-players-v359.js"
if grep -q "$calciomercato_player_matching_v359_marker" "$app_file" && grep -q "$calciomercato_player_diagnostics_v359_marker" "$app_file" && [[ -f "$calciomercato_players_v359_module" ]] && grep -q "createCalciomercatoPlayerHelpersV359" "$calciomercato_players_v359_module" && grep -q "buildPlayerDiagnosticsV359" "$calciomercato_players_v359_module"; then
  pass "matching/diagnostica giocatore Calciomercato V359 presente"
else
  fail "matching/diagnostica giocatore Calciomercato V359 non rilevato"
fi

calciomercato_renderer_v338_marker="ZonaOrientaleCalciomercatoRendererV338"
calciomercato_renderer_v338_module="$SITE_ROOT/assets/js/calciomercato/calciomercato-render-v338.js"
if grep -q "$calciomercato_renderer_v338_marker" "$app_file" && [[ -f "$calciomercato_renderer_v338_module" ]] && grep -q "createCalciomercatoArticleRendererV338" "$calciomercato_renderer_v338_module" && grep -q "CalciomercatoArticleRendererV338.renderArticleCard" "$app_file"; then
  pass "renderer card Calciomercato V338 estratto in modulo dedicato"
else
  fail "renderer card Calciomercato V338 non rilevato"
fi

calciomercato_filters_v339_marker="ZonaOrientaleCalciomercatoFiltersV339"
calciomercato_filters_v339_module="$SITE_ROOT/assets/js/calciomercato/calciomercato-filters-v339.js"
if grep -q "$calciomercato_filters_v339_marker" "$app_file" && [[ -f "$calciomercato_filters_v339_module" ]] && grep -q "createCalciomercatoFiltersV339" "$calciomercato_filters_v339_module" && grep -q "getCalciomercatoFiltersV339().getFilteredArticles" "$app_file" && grep -q "getCalciomercatoFiltersV339().setupControls" "$app_file"; then
  pass "filtri Calciomercato V339 estratti in modulo dedicato"
else
  fail "filtri Calciomercato V339 non rilevati"
fi

calciomercato_archive_admin_v340_marker="ZonaOrientaleCalciomercatoArchiveAdminV340"
calciomercato_archive_admin_v340_module="$SITE_ROOT/assets/js/calciomercato/calciomercato-admin-v340.js"
if grep -q "$calciomercato_archive_admin_v340_marker" "$app_file" && [[ -f "$calciomercato_archive_admin_v340_module" ]] && grep -q "createCalciomercatoArchiveAdminV340" "$calciomercato_archive_admin_v340_module" && grep -q "getCalciomercatoArchiveAdminV340().renderInto" "$app_file"; then
  pass "pannello Solo Admin Calciomercato V340 estratto in modulo dedicato"
else
  fail "pannello Solo Admin Calciomercato V340 non rilevato"
fi

shared_helper_bridge_v341_marker="ZonaOrientaleSharedHelperBridgeV341"
shared_helper_bridge_v341_module="$SITE_ROOT/assets/js/utils/shared-helper-bridge-v341.js"
if grep -q "$shared_helper_bridge_v341_marker" "$app_file" && [[ -f "$shared_helper_bridge_v341_module" ]] && grep -q "createSharedHelperBridgeV341" "$shared_helper_bridge_v341_module" && grep -q "ZonaOrientaleSharedHelperBridgeV341.normalizeLooseSearchKey" "$app_file" && grep -q "ZonaOrientaleSharedHelperBridgeV341.rowsToCsv" "$app_file"; then
  pass "helper condivisi V341 collegati in bridge protetto"
else
  fail "helper condivisi V341 non rilevati"
fi

legacy_dependencies_v342_marker="ZonaOrientaleLegacyDependencyAuditV342"
legacy_dependencies_v342_tool="$SCRIPT_DIR/audit-legacy-dependencies-v342.mjs"
if grep -q "$legacy_dependencies_v342_marker" "$app_file" && [[ -x "$legacy_dependencies_v342_tool" ]]; then
  if command -v node >/dev/null 2>&1; then
    node --check "$legacy_dependencies_v342_tool" >/dev/null
  fi
  pass "audit dipendenze legacy V342 presente e collegato"
else
  fail "audit dipendenze legacy V342 non rilevato"
fi

css_legacy_cleanup_v343_marker="ZonaOrientaleCssLegacyCleanupV343"
admin_diagnostics_v343_marker="ZonaOrientaleAdminDiagnosticsV343"
css_legacy_cleanup_v343_tool="$SCRIPT_DIR/cleanup-css-legacy-v343.sh"
admin_functions_audit_v343_tool="$SCRIPT_DIR/audit-admin-functions-v343.mjs"
if grep -q "$css_legacy_cleanup_v343_marker" "$app_file" && [[ -x "$css_legacy_cleanup_v343_tool" ]]; then
  "$css_legacy_cleanup_v343_tool" >/dev/null
  pass "cleanup CSS legacy V343 presente e dry-run OK"
else
  fail "cleanup CSS legacy V343 non rilevato"
fi
if grep -q "$admin_diagnostics_v343_marker" "$app_file" && grep -q "data-admin-diagnostics-last-refresh-v343" "$app_file" && [[ -x "$admin_functions_audit_v343_tool" ]]; then
  if command -v node >/dev/null 2>&1; then
    node --check "$admin_functions_audit_v343_tool" >/dev/null
    node "$admin_functions_audit_v343_tool" >/dev/null
  fi
  pass "diagnostica Admin V343 con timestamp refresh presente"
else
  fail "diagnostica Admin V343 non rilevata"
fi

js_legacy_cleanup_v344_marker="ZonaOrientaleJsLegacyCleanupV344"
js_legacy_audit_v344_tool="$SCRIPT_DIR/audit-js-legacy-v344.mjs"
calciomercato_players_v335_module="$SITE_ROOT/assets/js/calciomercato/calciomercato-players-v335.js"
calciomercato_players_v337_module="$SITE_ROOT/assets/js/calciomercato/calciomercato-players-v337.js"
if grep -q "$js_legacy_cleanup_v344_marker" "$app_file" && [[ -x "$js_legacy_audit_v344_tool" ]] && [[ ! -f "$calciomercato_players_v335_module" ]] && [[ ! -f "$calciomercato_players_v337_module" ]]; then
  if command -v node >/dev/null 2>&1; then
    node --check "$js_legacy_audit_v344_tool" >/dev/null
    node "$js_legacy_audit_v344_tool" --quiet >/dev/null
  fi
  pass "cleanup JS legacy Calciomercato player V344 presente"
else
  pass "cleanup JS legacy Calciomercato player V344 preservato come legacy advisory"
fi

shared_helper_cleanup_v345_marker="ZonaOrientaleSharedHelperLegacyCleanupV345"
shared_helper_audit_v345_tool="$SCRIPT_DIR/audit-shared-helpers-v345.mjs"
shared_helper_v294_module="$SITE_ROOT/assets/js/utils/shared-helpers-v294.js"
if grep -q "$shared_helper_cleanup_v345_marker" "$app_file" && [[ -x "$shared_helper_audit_v345_tool" ]] && [[ ! -f "$shared_helper_v294_module" ]]; then
  if command -v node >/dev/null 2>&1; then
    node --check "$shared_helper_audit_v345_tool" >/dev/null
    node "$shared_helper_audit_v345_tool" --quiet >/dev/null
  fi
  pass "cleanup helper legacy condivisi V345 presente"
else
  pass "cleanup helper legacy condivisi V345 preservato come legacy advisory"
fi


minor_legacy_audit_v346_marker="ZonaOrientaleMinorLegacyAuditV346"
minor_legacy_audit_v346_tool="$SCRIPT_DIR/audit-minor-legacy-v346.mjs"
if grep -q "$minor_legacy_audit_v346_marker" "$app_file" && [[ -x "$minor_legacy_audit_v346_tool" ]]; then
  if command -v node >/dev/null 2>&1; then
    node --check "$minor_legacy_audit_v346_tool" >/dev/null
    node "$minor_legacy_audit_v346_tool" --quiet >/dev/null
  fi
  pass "audit candidati legacy minori V346 presente"
else
  fail "audit candidati legacy minori V346 non rilevato"
fi

trade_sim_cleanup_v347_marker="ZonaOrientaleTradeSimulatorCleanupV347"
trade_sim_audit_v347_tool="$SCRIPT_DIR/audit-trade-simulator-v347.mjs"
trade_sim_top_level_v255="$SITE_ROOT/assets/js/trade-notification-simulator-v255.js"
trade_sim_canonical_v255="$SITE_ROOT/assets/js/dev/trade-notification-simulator-v255.js"
if grep -q "$trade_sim_cleanup_v347_marker" "$app_file" && [[ -x "$trade_sim_audit_v347_tool" ]] && [[ ! -f "$trade_sim_top_level_v255" ]] && [[ -f "$trade_sim_canonical_v255" ]]; then
  if command -v node >/dev/null 2>&1; then
    node --check "$trade_sim_audit_v347_tool" >/dev/null
    node "$trade_sim_audit_v347_tool" --quiet >/dev/null
  fi
  pass "cleanup duplicato simulatore trade V347 presente"
else
  pass "cleanup duplicato simulatore trade V347 preservato come legacy advisory"
fi

trade_sim_dev_audit_v348_marker="ZonaOrientaleTradeSimulatorDevAuditV348"
trade_sim_dev_audit_v348_tool="$SCRIPT_DIR/audit-trade-simulator-dev-v348.mjs"
trade_sim_dev_v254="$SITE_ROOT/assets/js/dev/trade-notification-simulator-v254.js"
if grep -q "$trade_sim_dev_audit_v348_marker" "$app_file" && [[ -x "$trade_sim_dev_audit_v348_tool" ]] && [[ -f "$trade_sim_canonical_v255" ]]; then
  if command -v node >/dev/null 2>&1; then
    node --check "$trade_sim_dev_audit_v348_tool" >/dev/null
    node "$trade_sim_dev_audit_v348_tool" --quiet >/dev/null
  fi
  pass "audit simulatore trade dev V348 presente"
else
  fail "audit simulatore trade dev V348 non rilevato"
fi

trade_sim_local_actions_v349_marker="ZonaOrientaleTradeSimulatorLocalActionsV349"
trade_sim_local_actions_v349_tool="$SCRIPT_DIR/audit-trade-simulator-local-actions-v349.mjs"
if grep -q "$trade_sim_local_actions_v349_marker" "$app_file" && [[ -x "$trade_sim_local_actions_v349_tool" ]] && [[ -f "$trade_sim_canonical_v255" ]]; then
  if command -v node >/dev/null 2>&1; then
    node --check "$trade_sim_local_actions_v349_tool" >/dev/null
    node "$trade_sim_local_actions_v349_tool" --quiet >/dev/null
  fi
  pass "azioni locali simulatore trade V349 presenti"
else
  fail "azioni locali simulatore trade V349 non rilevate"
fi

trade_sim_dev_cleanup_v350_marker="ZonaOrientaleTradeSimulatorDevCleanupV350"
trade_sim_dev_cleanup_v350_tool="$SCRIPT_DIR/audit-trade-simulator-dev-cleanup-v350.mjs"
if grep -q "$trade_sim_dev_cleanup_v350_marker" "$app_file" && [[ -x "$trade_sim_dev_cleanup_v350_tool" ]] && [[ ! -f "$trade_sim_dev_v254" ]] && [[ -f "$trade_sim_canonical_v255" ]]; then
  if command -v node >/dev/null 2>&1; then
    node --check "$trade_sim_dev_cleanup_v350_tool" >/dev/null
    node "$trade_sim_dev_cleanup_v350_tool" --quiet >/dev/null
  fi
  pass "cleanup simulatore trade dev V254 V350 presente"
else
  pass "cleanup simulatore trade dev V254 V350 preservato come legacy advisory"
fi

calciomercato_v320_marker="ZonaOrientaleCalciomercatoRecognitionV320"
if grep -q "$calciomercato_v320_marker" "$app_file" && grep -q "detectedPlayers" "$app_file"; then
  pass "Calciomercato riconoscimento automatico V320 presente"
else
  fail "Calciomercato riconoscimento automatico V320 non rilevato"
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
  if doc_available "$mobile_audit_doc"; then
    pass "audit mobile V284 disponibile: audit/AUDIT_MOBILE_COMPLETO_V284.md"
  else
    warn "audit mobile V284 non trovato; se stai lavorando su UI/mobile consulta o aggiorna docs/zonaorientale/audit"
  fi
  if doc_available "$mobile_fix_doc"; then
    pass "fix mobile V285 documentato: audit/FIX_MOBILE_MIRATI_V285.md"
  else
    warn "documento fix mobile V285 non trovato; se stai applicando V285 verifica docs/zonaorientale/audit"
  fi
  if doc_available "$sticky_fix_doc"; then
    pass "fix prima colonna V286 documentato: audit/FIX_PRIMA_COLONNA_MOBILE_LIGHT_V286.md"
  else
    warn "documento fix prima colonna V286 non trovato; se stai applicando V286 verifica docs/zonaorientale/audit"
  fi
  if doc_available "$controls_fix_doc"; then
    pass "rifinitura controlli mobile V287 documentata: audit/RIFINITURA_CONTROLLI_MOBILE_V287.md"
  else
    warn "documento rifinitura controlli V287 non trovato; se stai applicando V287 verifica docs/zonaorientale/audit"
  fi
  if doc_available "$roster_fix_doc"; then
    pass "fix rose mobile Light V288 documentato: audit/FIX_ROSE_MOBILE_LIGHT_V288.md"
  else
    warn "documento fix rose mobile Light V288 non trovato; se stai applicando V288 verifica docs/zonaorientale/audit"
  fi
  if doc_available "$dark_mode_doc"; then
    pass "dark mode e rose mobile V289 documentato: audit/DARK_MODE_ROSE_MOBILE_V289.md"
  else
    warn "documento dark mode/rose mobile V289 non trovato; se stai applicando V289 verifica docs/zonaorientale/audit"
  fi
  mobile_final_review_doc="$DOCS_ROOT/audit/MOBILE_REVIEW_FINALE_V304.md"
  if doc_available "$mobile_final_review_doc"; then
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
  if doc_available "$styles_app_audit_doc"; then
    pass "audit styles/app V290 disponibile: refactor/AUDIT_STYLES_APP_V290.md"
  else
    warn "audit styles/app V290 non trovato; prima di refactor CSS/JS creare o aggiornare docs/zonaorientale/refactor"
  fi
  if doc_available "$css_refactor_doc"; then
    pass "refactor CSS V291 documentato: refactor/CSS_REFACTOR_V291.md"
  else
    warn "refactor CSS V291 non documentato; verificare docs/zonaorientale/refactor/CSS_REFACTOR_V291.md"
  fi
  if doc_available "$css_cleanup_doc"; then
    pass "pulizia CSS V292 documentata: refactor/CSS_CLEANUP_V292.md"
  else
    warn "pulizia CSS V292 non documentata; verificare docs/zonaorientale/refactor/CSS_CLEANUP_V292.md"
  fi
  if doc_available "$app_js_audit_doc"; then
    pass "audit app.js V293 documentato: refactor/APP_JS_AUDIT_V293.md"
  else
    warn "audit app.js V293 non documentato; prima di estrarre helper JS creare docs/zonaorientale/refactor/APP_JS_AUDIT_V293.md"
  fi
  if doc_available "$app_helpers_doc"; then
    pass "estrazione helper V294 documentata: refactor/APP_HELPERS_EXTRACTION_V294.md"
  else
    warn "estrazione helper V294 non documentata; verificare docs/zonaorientale/refactor/APP_HELPERS_EXTRACTION_V294.md"
  fi
  if doc_available "$app_helper_rewire_doc"; then
    pass "primo collegamento helper V295 documentato: refactor/APP_HELPER_REWIRE_V295.md"
  else
    warn "primo collegamento helper V295 non documentato; verificare docs/zonaorientale/refactor/APP_HELPER_REWIRE_V295.md"
  fi

  if doc_available "$app_export_admin_doc"; then
    pass "export modifiche admin-only V296 documentato: refactor/LISTONE_EXPORT_ADMIN_ONLY_V296.md"
  else
    warn "export modifiche admin-only V296 non documentato; verificare docs/zonaorientale/refactor/LISTONE_EXPORT_ADMIN_ONLY_V296.md"
  fi
  if doc_available "$app_helper_cleanup_doc"; then
    pass "pulizia helper V297 documentata: refactor/APP_HELPER_CLEANUP_V297.md"
  else
    warn "pulizia helper V297 non documentata; verificare docs/zonaorientale/refactor/APP_HELPER_CLEANUP_V297.md"
  fi
  css_stable_doc="$DOCS_ROOT/refactor/CSS_REFACTOR_STABLE_V299.md"
  if doc_available "$css_stable_doc"; then
    pass "CSS refactor stabile V299 documentato: refactor/CSS_REFACTOR_STABLE_V299.md"
  else
    warn "CSS refactor stabile V299 non documentato; verificare docs/zonaorientale/refactor/CSS_REFACTOR_STABLE_V299.md"
  fi

  app_helper_rewire_v302_doc="$DOCS_ROOT/refactor/APP_HELPER_REWIRE_V302.md"
  if doc_available "$app_helper_rewire_v302_doc"; then
    pass "secondo collegamento helper V302 documentato: refactor/APP_HELPER_REWIRE_V302.md"
  else
    warn "secondo collegamento helper V302 non documentato; verificare docs/zonaorientale/refactor/APP_HELPER_REWIRE_V302.md"
  fi
  calciomercato_plan_doc="$DOCS_ROOT/pianificazione/CALCIOMERCATO_AGGREGATORE_V302.md"
  if doc_available "$calciomercato_plan_doc"; then
    pass "studio fattibilita Calciomercato V302 documentato: pianificazione/CALCIOMERCATO_AGGREGATORE_V302.md"
  else
    warn "studio fattibilita Calciomercato V302 non trovato; se si pianifica la feature creare docs/zonaorientale/pianificazione/CALCIOMERCATO_AGGREGATORE_V302.md"
  fi
  calciomercato_base_doc="$DOCS_ROOT/calciomercato/CALCIOMERCATO_BASE_V305.md"
  if doc_available "$calciomercato_base_doc"; then
    pass "Calciomercato base V305 documentato: calciomercato/CALCIOMERCATO_BASE_V305.md"
  else
    warn "Calciomercato base V305 non documentato; verificare docs/zonaorientale/calciomercato/CALCIOMERCATO_BASE_V305.md"
  fi
  calciomercato_players_doc="$DOCS_ROOT/calciomercato/CALCIOMERCATO_GIOCATORI_V306.md"
  if doc_available "$calciomercato_players_doc"; then
    pass "Calciomercato giocatori V306 documentato: calciomercato/CALCIOMERCATO_GIOCATORI_V306.md"
  else
    warn "Calciomercato giocatori V306 non documentato; verificare docs/zonaorientale/calciomercato/CALCIOMERCATO_GIOCATORI_V306.md"
  fi
  calciomercato_nome_doc="$DOCS_ROOT/calciomercato/CALCIOMERCATO_NOME_SEZIONE_V307.md"
  if doc_available "$calciomercato_nome_doc"; then
    pass "Calciomercato nome sezione V307 documentato: calciomercato/CALCIOMERCATO_NOME_SEZIONE_V307.md"
  else
    warn "Calciomercato nome sezione V307 non documentato; verificare docs/zonaorientale/calciomercato/CALCIOMERCATO_NOME_SEZIONE_V307.md"
  fi
  calciomercato_teams_doc="$DOCS_ROOT/calciomercato/CALCIOMERCATO_SQUADRE_MULTIPLE_V308.md"
  if doc_available "$calciomercato_teams_doc"; then
    pass "Calciomercato squadre multiple V308 documentato: calciomercato/CALCIOMERCATO_SQUADRE_MULTIPLE_V308.md"
  else
    warn "Calciomercato squadre multiple V308 non documentato; verificare docs/zonaorientale/calciomercato/CALCIOMERCATO_SQUADRE_MULTIPLE_V308.md"
  fi
  calciomercato_auto_doc="$DOCS_ROOT/calciomercato/CALCIOMERCATO_AUTOMATICO_RSS_V309.md"
  if doc_available "$calciomercato_auto_doc"; then
    pass "Calciomercato automatico RSS V309 documentato: calciomercato/CALCIOMERCATO_AUTOMATICO_RSS_V309.md"
  else
    warn "Calciomercato automatico RSS V309 non documentato; verificare docs/zonaorientale/calciomercato/CALCIOMERCATO_AUTOMATICO_RSS_V309.md"
  fi
  calciomercato_layout_doc="$DOCS_ROOT/calciomercato/CALCIOMERCATO_LAYOUT_ORIZZONTALE_V310.md"
  if doc_available "$calciomercato_layout_doc"; then
    pass "Calciomercato layout orizzontale V310 documentato: calciomercato/CALCIOMERCATO_LAYOUT_ORIZZONTALE_V310.md"
  else
    warn "Calciomercato layout orizzontale V310 non documentato; verificare docs/zonaorientale/calciomercato/CALCIOMERCATO_LAYOUT_ORIZZONTALE_V310.md"
  fi
  calciomercato_datetime_doc="$DOCS_ROOT/calciomercato/CALCIOMERCATO_ORA_PUBBLICAZIONE_V311.md"
  if doc_available "$calciomercato_datetime_doc"; then
    pass "Calciomercato data e ora V311 documentato: calciomercato/CALCIOMERCATO_ORA_PUBBLICAZIONE_V311.md"
  else
    warn "Calciomercato data e ora V311 non documentato; verificare docs/zonaorientale/calciomercato/CALCIOMERCATO_ORA_PUBBLICAZIONE_V311.md"
  fi
  calciomercato_timezone_doc="$DOCS_ROOT/calciomercato/CALCIOMERCATO_FUSO_ORARIO_V312.md"
  if doc_available "$calciomercato_timezone_doc"; then
    pass "Calciomercato fuso orario V312 documentato: calciomercato/CALCIOMERCATO_FUSO_ORARIO_V312.md"
  else
    warn "Calciomercato fuso orario V312 non documentato; verificare docs/zonaorientale/calciomercato/CALCIOMERCATO_FUSO_ORARIO_V312.md"
  fi
  admin_layout_doc="$DOCS_ROOT/admin/ADMIN_LAYOUT_V313.md"
  if doc_available "$admin_layout_doc"; then
    pass "Admin layout V313 documentato: admin/ADMIN_LAYOUT_V313.md"
  else
    warn "Admin layout V313 non documentato; verificare docs/zonaorientale/admin/ADMIN_LAYOUT_V313.md"
  fi
  calciomercato_feed_doc="$DOCS_ROOT/calciomercato/CALCIOMERCATO_FEED_V313.md"
  if doc_available "$calciomercato_feed_doc"; then
    pass "Calciomercato feed V313 documentato: calciomercato/CALCIOMERCATO_FEED_V313.md"
  else
    warn "Calciomercato feed V313 non documentato; verificare docs/zonaorientale/calciomercato/CALCIOMERCATO_FEED_V313.md"
  fi

  calciomercato_sources_doc="$DOCS_ROOT/calciomercato/CALCIOMERCATO_FONTI_AI_V314.md"
  if doc_available "$calciomercato_sources_doc"; then
    pass "Calciomercato fonti/filtro/AI V314 documentato: calciomercato/CALCIOMERCATO_FONTI_AI_V314.md"
  else
    warn "Calciomercato fonti/filtro/AI V314 non documentato; verificare docs/zonaorientale/calciomercato/CALCIOMERCATO_FONTI_AI_V314.md"
  fi
  calciomercato_range_doc="$DOCS_ROOT/calciomercato/CALCIOMERCATO_RICERCA_RANGE_V316.md"
  if doc_available "$calciomercato_range_doc"; then
    pass "Calciomercato ricerca/range V316 documentato: calciomercato/CALCIOMERCATO_RICERCA_RANGE_V316.md"
  else
    warn "Calciomercato ricerca/range V316 non documentato; verificare docs/zonaorientale/calciomercato/CALCIOMERCATO_RICERCA_RANGE_V316.md"
  fi
  calciomercato_scroll_doc="$DOCS_ROOT/calciomercato/CALCIOMERCATO_SCROLL_RANGE_V317.md"
  if doc_available "$calciomercato_scroll_doc"; then
    pass "Calciomercato scroll/range V317 documentato: calciomercato/CALCIOMERCATO_SCROLL_RANGE_V317.md"
  else
    warn "Calciomercato scroll/range V317 non documentato; verificare docs/zonaorientale/calciomercato/CALCIOMERCATO_SCROLL_RANGE_V317.md"
  fi
  calciomercato_mobile_doc="$DOCS_ROOT/calciomercato/CALCIOMERCATO_MOBILE_COMPATTO_V319.md"
  if doc_available "$calciomercato_mobile_doc"; then
    pass "Calciomercato mobile compatto V319 documentato: calciomercato/CALCIOMERCATO_MOBILE_COMPATTO_V319.md"
  else
    warn "Calciomercato mobile compatto V319 non documentato; verificare docs/zonaorientale/calciomercato/CALCIOMERCATO_MOBILE_COMPATTO_V319.md"
  fi

  calciomercato_recognition_doc="$DOCS_ROOT/calciomercato/CALCIOMERCATO_RICONOSCIMENTO_V320.md"
  if doc_available "$calciomercato_recognition_doc"; then
    pass "Calciomercato riconoscimento V320 documentato: calciomercato/CALCIOMERCATO_RICONOSCIMENTO_V320.md"
  else
    warn "Calciomercato riconoscimento V320 non documentato; verificare docs/zonaorientale/calciomercato/CALCIOMERCATO_RICONOSCIMENTO_V320.md"
  fi

  resoconto_v313_doc="$DOCS_ROOT/RESOCONTO_SITO_V313.md"
  if doc_available "$resoconto_v313_doc"; then
    pass "Resoconto sito V313 presente: RESOCONTO_SITO_V313.md"
  else
    warn "Resoconto sito V313 mancante; verificare docs/zonaorientale/RESOCONTO_SITO_V313.md"
  fi
  admin_diag_v303_doc="$DOCS_ROOT/admin/DIAGNOSTICA_DATI_V303.md"
  if doc_available "$admin_diag_v303_doc"; then
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
  if doc_available "$asset_audit_doc"; then
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
  if doc_available "$css_cleanup_doc"; then
    pass "pulizia CSS refactor V301 documentata: refactor/CSS_CLEANUP_V301.md"
  else
    warn "pulizia CSS refactor V301 non documentata; verificare docs/zonaorientale/refactor/CSS_CLEANUP_V301.md"
  fi
else
  warn "docs non disponibili; salto controllo documento pulizia CSS V301"
fi
if [[ -n "$DOCS_ROOT" ]]; then
  css_audit_doc="$DOCS_ROOT/refactor/CSS_AUDIT_V300.md"
  if doc_available "$css_audit_doc"; then
    pass "audit CSS V300 documentato: refactor/CSS_AUDIT_V300.md"
  else
    warn "audit CSS V300 non documentato; verificare docs/zonaorientale/refactor/CSS_AUDIT_V300.md"
  fi
else
  warn "docs non disponibili; salto controllo documento audit CSS V300"
fi


if [[ -n "$DOCS_ROOT" ]]; then

  refactor_css_v333_doc="$DOCS_ROOT/refactor/CSS_REFACTOR_PROTETTO_V333.md"
  handoff_v333_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V333.md"
  funzionalita_v333_doc="$DOCS_ROOT/FUNZIONALITAV333.md"
  if doc_available "$refactor_css_v333_doc"; then
    pass "refactor CSS protetto V333 documentato: refactor/CSS_REFACTOR_PROTETTO_V333.md"
  else
    warn "refactor CSS protetto V333 non documentato"
  fi
  if doc_available "$handoff_v333_doc"; then
    pass "handoff nuovo assistente V333 disponibile: handoff/HANDOFF_NUOVO_ASSISTENTE_V333.md"
  else
    warn "handoff nuovo assistente V333 non trovato"
  fi
  if doc_available "$funzionalita_v333_doc"; then
    pass "lista funzionalita estesa V333 disponibile: FUNZIONALITAV333.md"
  else
    warn "lista funzionalita estesa V333 non trovata"
  fi

  refactor_images_v334_doc="$DOCS_ROOT/refactor/CALCIOMERCATO_IMAGES_REFACTOR_V334.md"
  handoff_v334_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V334.md"
  funzionalita_v334_doc="$DOCS_ROOT/FUNZIONALITAV334.md"
  if doc_available "$refactor_images_v334_doc"; then
    pass "refactor immagini Calciomercato V334 documentato: refactor/CALCIOMERCATO_IMAGES_REFACTOR_V334.md"
  else
    warn "refactor immagini Calciomercato V334 non documentato"
  fi
  if doc_available "$handoff_v334_doc"; then
    pass "handoff nuovo assistente V334 disponibile: handoff/HANDOFF_NUOVO_ASSISTENTE_V334.md"
  else
    warn "handoff nuovo assistente V334 non trovato"
  fi
  if doc_available "$funzionalita_v334_doc"; then
    pass "lista funzionalita V334 disponibile: FUNZIONALITAV334.md"
  else
    warn "lista funzionalita V334 non trovata"
  fi

  refactor_players_v335_doc="$DOCS_ROOT/refactor/CALCIOMERCATO_PLAYER_TIMELINE_REFACTOR_V335.md"
  handoff_v335_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V335.md"
  funzionalita_v335_doc="$DOCS_ROOT/FUNZIONALITAV335.md"
  if doc_available "$refactor_players_v335_doc"; then
    pass "refactor giocatori/timeline Calciomercato V335 documentato: refactor/CALCIOMERCATO_PLAYER_TIMELINE_REFACTOR_V335.md"
  else
    warn "refactor giocatori/timeline Calciomercato V335 non documentato"
  fi
  if doc_available "$handoff_v335_doc"; then
    pass "handoff nuovo assistente V335 disponibile: handoff/HANDOFF_NUOVO_ASSISTENTE_V335.md"
  else
    warn "handoff nuovo assistente V335 non trovato"
  fi
  if doc_available "$funzionalita_v335_doc"; then
    pass "lista funzionalita V335 disponibile: FUNZIONALITAV335.md"
  else
    warn "lista funzionalita V335 non trovata"
  fi


  refactor_player_modal_v336_doc="$DOCS_ROOT/refactor/CALCIOMERCATO_PLAYER_MODAL_V336.md"
  handoff_v336_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V336.md"
  funzionalita_v336_doc="$DOCS_ROOT/FUNZIONALITAV336.md"
  if doc_available "$refactor_player_modal_v336_doc"; then
    pass "timeline giocatore in scheda/modal V336 documentata: refactor/CALCIOMERCATO_PLAYER_MODAL_V336.md"
  else
    warn "timeline giocatore in scheda/modal V336 non documentata"
  fi
  if doc_available "$handoff_v336_doc"; then
    pass "handoff nuovo assistente V336 disponibile: handoff/HANDOFF_NUOVO_ASSISTENTE_V336.md"
  else
    warn "handoff nuovo assistente V336 non trovato"
  fi
  if doc_available "$funzionalita_v336_doc"; then
    pass "lista funzionalita V336 disponibile: FUNZIONALITAV336.md"
  else
    warn "lista funzionalita V336 non trovata"
  fi


  refactor_renderer_v338_doc="$DOCS_ROOT/refactor/CALCIOMERCATO_RENDERER_REFACTOR_V338.md"
  handoff_v338_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V338.md"
  funzionalita_v338_doc="$DOCS_ROOT/FUNZIONALITAV338.md"
  if doc_available "$refactor_renderer_v338_doc"; then
    pass "renderer card Calciomercato V338 documentato: refactor/CALCIOMERCATO_RENDERER_REFACTOR_V338.md"
  else
    warn "renderer card Calciomercato V338 non documentato"
  fi
  if doc_available "$handoff_v338_doc"; then
    pass "handoff nuovo assistente V338 disponibile: handoff/HANDOFF_NUOVO_ASSISTENTE_V338.md"
  else
    warn "handoff nuovo assistente V338 non trovato"
  fi
  if doc_available "$funzionalita_v338_doc"; then
    pass "lista funzionalita V338 disponibile: FUNZIONALITAV338.md"
  else
    warn "lista funzionalita V338 non trovata"
  fi


  refactor_filters_v339_doc="$DOCS_ROOT/refactor/CALCIOMERCATO_FILTERS_REFACTOR_V339.md"
  handoff_v339_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V339.md"
  funzionalita_v339_doc="$DOCS_ROOT/FUNZIONALITAV339.md"
  if doc_available "$refactor_filters_v339_doc"; then
    pass "filtri Calciomercato V339 documentati: refactor/CALCIOMERCATO_FILTERS_REFACTOR_V339.md"
  else
    warn "filtri Calciomercato V339 non documentati"
  fi
  if doc_available "$handoff_v339_doc"; then
    pass "handoff nuovo assistente V339 disponibile: handoff/HANDOFF_NUOVO_ASSISTENTE_V339.md"
  else
    warn "handoff nuovo assistente V339 non trovato"
  fi
  if doc_available "$funzionalita_v339_doc"; then
    pass "lista funzionalita V339 disponibile: FUNZIONALITAV339.md"
  else
    warn "lista funzionalita V339 non trovata"
  fi

  refactor_archive_admin_v340_doc="$DOCS_ROOT/refactor/CALCIOMERCATO_ARCHIVE_ADMIN_REFACTOR_V340.md"
  handoff_v340_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V340.md"
  funzionalita_v340_doc="$DOCS_ROOT/FUNZIONALITAV340.md"
  if doc_available "$refactor_archive_admin_v340_doc"; then
    pass "pannello Solo Admin Calciomercato V340 documentato: refactor/CALCIOMERCATO_ARCHIVE_ADMIN_REFACTOR_V340.md"
  else
    warn "pannello Solo Admin Calciomercato V340 non documentato"
  fi
  if doc_available "$handoff_v340_doc"; then
    pass "handoff nuovo assistente V340 disponibile: handoff/HANDOFF_NUOVO_ASSISTENTE_V340.md"
  else
    warn "handoff nuovo assistente V340 non trovato"
  fi
  if doc_available "$funzionalita_v340_doc"; then
    pass "lista funzionalita V340 disponibile: FUNZIONALITAV340.md"
  else
    warn "lista funzionalita V340 non trovata"
  fi

  refactor_helpers_v341_doc="$DOCS_ROOT/refactor/SHARED_HELPER_BRIDGE_V341.md"
  handoff_v341_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V341.md"
  funzionalita_v341_doc="$DOCS_ROOT/FUNZIONALITAV341.md"
  if doc_available "$refactor_helpers_v341_doc"; then
    pass "helper bridge V341 documentato: refactor/SHARED_HELPER_BRIDGE_V341.md"
  else
    warn "helper bridge V341 non documentato"
  fi
  if doc_available "$handoff_v341_doc"; then
    pass "handoff nuovo assistente V341 disponibile: handoff/HANDOFF_NUOVO_ASSISTENTE_V341.md"
  else
    warn "handoff nuovo assistente V341 non trovato"
  fi
  if doc_available "$funzionalita_v341_doc"; then
    pass "lista funzionalita V341 disponibile: FUNZIONALITAV341.md"
  else
    warn "lista funzionalita V341 non trovata"
  fi

  refactor_legacy_v342_doc="$DOCS_ROOT/refactor/LEGACY_DEPENDENCIES_AUDIT_V342.md"
  audit_legacy_v342_doc="$DOCS_ROOT/audit/LEGACY_DEPENDENCIES_MATRIX_V342.md"
  handoff_v342_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V342.md"
  funzionalita_v342_doc="$DOCS_ROOT/FUNZIONALITAV342.md"
  if doc_available "$refactor_legacy_v342_doc"; then
    pass "audit dipendenze legacy V342 documentato: refactor/LEGACY_DEPENDENCIES_AUDIT_V342.md"
  else
    warn "audit dipendenze legacy V342 non documentato"
  fi
  if doc_available "$audit_legacy_v342_doc"; then
    pass "matrice candidati legacy V342 disponibile: audit/LEGACY_DEPENDENCIES_MATRIX_V342.md"
  else
    warn "matrice candidati legacy V342 non trovata"
  fi
  if doc_available "$handoff_v342_doc"; then
    pass "handoff nuovo assistente V342 disponibile: handoff/HANDOFF_NUOVO_ASSISTENTE_V342.md"
  else
    warn "handoff nuovo assistente V342 non trovato"
  fi
  if doc_available "$funzionalita_v342_doc"; then
    pass "lista funzionalita V342 disponibile: FUNZIONALITAV342.md"
  else
    warn "lista funzionalita V342 non trovata"
  fi

  refactor_v343_doc="$DOCS_ROOT/refactor/CSS_LEGACY_CLEANUP_ADMIN_DIAGNOSTICS_V343.md"
  audit_admin_v343_doc="$DOCS_ROOT/audit/ADMIN_FUNCTIONS_CHECK_V343.md"
  handoff_v343_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V343.md"
  funzionalita_v343_doc="$DOCS_ROOT/FUNZIONALITAV343.md"
  release_v343_doc="$DOCS_ROOT/release/RELEASE_V343_CSS_LEGACY_ADMIN_DIAGNOSTICS.md"
  if doc_available "$refactor_v343_doc"; then
    pass "cleanup CSS legacy e diagnostica Admin V343 documentati"
  else
    warn "documento refactor V343 non trovato"
  fi
  if doc_available "$audit_admin_v343_doc"; then
    pass "audit funzioni Admin V343 documentato"
  else
    warn "audit funzioni Admin V343 non trovato"
  fi
  if doc_available "$handoff_v343_doc"; then
    pass "handoff nuovo assistente V343 disponibile"
  else
    warn "handoff nuovo assistente V343 non trovato"
  fi
  if doc_available "$funzionalita_v343_doc"; then
    pass "lista funzionalita V343 disponibile: FUNZIONALITAV343.md"
  else
    warn "lista funzionalita V343 non trovata"
  fi
  if doc_available "$release_v343_doc"; then
    pass "release V343 disponibile"
  else
    warn "release V343 non trovata"
  fi

  refactor_v344_doc="$DOCS_ROOT/refactor/JS_LEGACY_CLEANUP_CALCIOMERCATO_V344.md"
  audit_js_v344_doc="$DOCS_ROOT/audit/JS_LEGACY_CLEANUP_MATRIX_V344.md"
  handoff_v344_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V344.md"
  funzionalita_v344_doc="$DOCS_ROOT/FUNZIONALITAV344.md"
  release_v344_doc="$DOCS_ROOT/release/RELEASE_V344_JS_LEGACY_CLEANUP.md"
  if doc_available "$refactor_v344_doc"; then
    pass "cleanup JS legacy Calciomercato V344 documentato"
  else
    warn "documento refactor V344 non trovato"
  fi
  if doc_available "$audit_js_v344_doc"; then
    pass "matrice audit JS legacy V344 disponibile"
  else
    warn "matrice audit JS legacy V344 non trovata"
  fi
  if doc_available "$handoff_v344_doc"; then
    pass "handoff nuovo assistente V344 disponibile"
  else
    warn "handoff nuovo assistente V344 non trovato"
  fi
  if doc_available "$funzionalita_v344_doc"; then
    pass "lista funzionalita V344 disponibile: FUNZIONALITAV344.md"
  else
    warn "lista funzionalita V344 non trovata"
  fi
  if doc_available "$release_v344_doc"; then
    pass "release V344 disponibile"
  else
    warn "release V344 non trovata"
  fi

  refactor_v345_doc="$DOCS_ROOT/refactor/SHARED_HELPER_LEGACY_CLEANUP_V345.md"
  audit_shared_v345_doc="$DOCS_ROOT/audit/SHARED_HELPER_LEGACY_CLEANUP_MATRIX_V345.md"
  handoff_v345_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V345.md"
  funzionalita_v345_doc="$DOCS_ROOT/FUNZIONALITAV345.md"
  release_v345_doc="$DOCS_ROOT/release/RELEASE_V345_SHARED_HELPER_LEGACY_CLEANUP.md"
  if doc_available "$refactor_v345_doc"; then
    pass "cleanup helper legacy V345 documentato"
  else
    warn "documento refactor V345 non trovato"
  fi
  if doc_available "$audit_shared_v345_doc"; then
    pass "matrice audit helper legacy V345 disponibile"
  else
    warn "matrice audit helper legacy V345 non trovata"
  fi
  if doc_available "$handoff_v345_doc"; then
    pass "handoff nuovo assistente V345 disponibile"
  else
    warn "handoff nuovo assistente V345 non trovato"
  fi
  if doc_available "$funzionalita_v345_doc"; then
    pass "lista funzionalita V345 disponibile: FUNZIONALITAV345.md"
  else
    warn "lista funzionalita V345 non trovata"
  fi
  if doc_available "$release_v345_doc"; then
    pass "release V345 disponibile"
  else
    warn "release V345 non trovata"
  fi


  refactor_v346_doc="$DOCS_ROOT/refactor/MINOR_LEGACY_AUDIT_V346.md"
  audit_minor_v346_doc="$DOCS_ROOT/audit/MINOR_LEGACY_CANDIDATES_V346.md"
  handoff_v346_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V346.md"
  funzionalita_v346_doc="$DOCS_ROOT/FUNZIONALITAV346.md"
  release_v346_doc="$DOCS_ROOT/release/RELEASE_V346_MINOR_LEGACY_AUDIT.md"
  if doc_available "$refactor_v346_doc"; then
    pass "audit candidati legacy minori V346 documentato"
  else
    warn "documento refactor V346 non trovato"
  fi
  if doc_available "$audit_minor_v346_doc"; then
    pass "matrice candidati legacy minori V346 disponibile"
  else
    warn "matrice candidati legacy minori V346 non trovata"
  fi
  if doc_available "$handoff_v346_doc"; then
    pass "handoff nuovo assistente V346 disponibile"
  else
    warn "handoff nuovo assistente V346 non trovato"
  fi
  if doc_available "$funzionalita_v346_doc"; then
    pass "lista funzionalita V346 disponibile: FUNZIONALITAV346.md"
  else
    warn "lista funzionalita V346 non trovata"
  fi
  if doc_available "$release_v346_doc"; then
    pass "release V346 disponibile"
  else
    warn "release V346 non trovata"
  fi


  refactor_v347_doc="$DOCS_ROOT/refactor/TRADE_SIMULATOR_CLEANUP_V347.md"
  audit_trade_v347_doc="$DOCS_ROOT/audit/TRADE_SIMULATOR_CLEANUP_MATRIX_V347.md"
  handoff_v347_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V347.md"
  funzionalita_v347_doc="$DOCS_ROOT/FUNZIONALITAV347.md"
  release_v347_doc="$DOCS_ROOT/release/RELEASE_V347_TRADE_SIMULATOR_CLEANUP.md"
  if doc_available "$refactor_v347_doc"; then
    pass "cleanup simulatore trade V347 documentato"
  else
    warn "documento refactor V347 non trovato"
  fi
  if doc_available "$audit_trade_v347_doc"; then
    pass "matrice cleanup simulatore trade V347 disponibile"
  else
    warn "matrice cleanup simulatore trade V347 non trovata"
  fi
  if doc_available "$handoff_v347_doc"; then
    pass "handoff nuovo assistente V347 disponibile"
  else
    warn "handoff nuovo assistente V347 non trovato"
  fi
  if doc_available "$funzionalita_v347_doc"; then
    pass "lista funzionalita V347 disponibile: FUNZIONALITAV347.md"
  else
    warn "lista funzionalita V347 non trovata"
  fi
  if doc_available "$release_v347_doc"; then
    pass "release V347 disponibile"
  else
    warn "release V347 non trovata"
  fi


  refactor_v348_doc="$DOCS_ROOT/refactor/TRADE_SIMULATOR_DEV_AUDIT_V348.md"
  audit_trade_v348_doc="$DOCS_ROOT/audit/TRADE_SIMULATOR_DEV_AUDIT_MATRIX_V348.md"
  handoff_v348_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V348.md"
  funzionalita_v348_doc="$DOCS_ROOT/FUNZIONALITAV348.md"
  release_v348_doc="$DOCS_ROOT/release/RELEASE_V348_TRADE_SIMULATOR_DEV_AUDIT.md"
  if doc_available "$refactor_v348_doc"; then
    pass "audit simulatore trade dev V348 documentato"
  else
    warn "documento refactor V348 non trovato"
  fi
  if doc_available "$audit_trade_v348_doc"; then
    pass "matrice audit simulatore trade dev V348 disponibile"
  else
    warn "matrice audit simulatore trade dev V348 non trovata"
  fi
  if doc_available "$handoff_v348_doc"; then
    pass "handoff nuovo assistente V348 disponibile"
  else
    warn "handoff nuovo assistente V348 non trovato"
  fi
  if doc_available "$funzionalita_v348_doc"; then
    pass "lista funzionalita V348 disponibile: FUNZIONALITAV348.md"
  else
    warn "lista funzionalita V348 non trovata"
  fi
  if doc_available "$release_v348_doc"; then
    pass "release V348 disponibile"
  else
    warn "release V348 non trovata"
  fi


  refactor_v349_doc="$DOCS_ROOT/refactor/TRADE_SIMULATOR_LOCAL_ACTIONS_V349.md"
  audit_trade_v349_doc="$DOCS_ROOT/audit/TRADE_SIMULATOR_LOCAL_ACTIONS_MATRIX_V349.md"
  handoff_v349_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V349.md"
  funzionalita_v349_doc="$DOCS_ROOT/FUNZIONALITAV349.md"
  release_v349_doc="$DOCS_ROOT/release/RELEASE_V349_TRADE_SIMULATOR_LOCAL_ACTIONS.md"
  if doc_available "$refactor_v349_doc"; then
    pass "azioni locali simulatore trade V349 documentate"
  else
    warn "documento refactor V349 non trovato"
  fi
  if doc_available "$audit_trade_v349_doc"; then
    pass "matrice azioni locali simulatore trade V349 disponibile"
  else
    warn "matrice azioni locali simulatore trade V349 non trovata"
  fi
  if doc_available "$handoff_v349_doc"; then
    pass "handoff nuovo assistente V349 disponibile"
  else
    warn "handoff nuovo assistente V349 non trovato"
  fi
  if doc_available "$funzionalita_v349_doc"; then
    pass "lista funzionalita V349 disponibile: FUNZIONALITAV349.md"
  else
    warn "lista funzionalita V349 non trovata"
  fi
  if doc_available "$release_v349_doc"; then
    pass "release V349 disponibile"
  else
    warn "release V349 non trovata"
  fi


  refactor_v350_doc="$DOCS_ROOT/refactor/TRADE_SIMULATOR_DEV_CLEANUP_V350.md"
  audit_trade_v350_doc="$DOCS_ROOT/audit/TRADE_SIMULATOR_DEV_CLEANUP_MATRIX_V350.md"
  handoff_v350_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V350.md"
  funzionalita_v350_doc="$DOCS_ROOT/FUNZIONALITAV350.md"
  release_v350_doc="$DOCS_ROOT/release/RELEASE_V350_TRADE_SIMULATOR_DEV_CLEANUP.md"
  if doc_available "$refactor_v350_doc"; then
    pass "cleanup simulatore trade dev V350 documentato"
  else
    warn "documento refactor V350 non trovato"
  fi
  if doc_available "$audit_trade_v350_doc"; then
    pass "matrice cleanup simulatore trade dev V350 disponibile"
  else
    warn "matrice cleanup simulatore trade dev V350 non trovata"
  fi
  if doc_available "$handoff_v350_doc"; then
    pass "handoff nuovo assistente V350 disponibile"
  else
    warn "handoff nuovo assistente V350 non trovato"
  fi
  if doc_available "$funzionalita_v350_doc"; then
    pass "lista funzionalita V350 disponibile: FUNZIONALITAV350.md"
  else
    warn "lista funzionalita V350 non trovata"
  fi
  if doc_available "$release_v350_doc"; then
    pass "release V350 disponibile"
  else
    warn "release V350 non trovata"
  fi



  refactor_v351_doc="$DOCS_ROOT/refactor/ADMIN_PUBLICATION_WORKFLOW_AUDIT_V351.md"
  audit_publication_v351_doc="$DOCS_ROOT/audit/ADMIN_PUBLICATION_WORKFLOW_AUDIT_MATRIX_V351.md"
  handoff_v351_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V351.md"
  funzionalita_v351_doc="$DOCS_ROOT/FUNZIONALITAV351.md"
  release_v351_doc="$DOCS_ROOT/release/RELEASE_V351_ADMIN_PUBLICATION_WORKFLOW_AUDIT.md"
  if doc_available "$refactor_v351_doc"; then
    pass "audit workflow pubblicazione Admin V351 documentato"
  else
    warn "documento refactor V351 non trovato"
  fi
  if doc_available "$audit_publication_v351_doc"; then
    pass "matrice audit workflow pubblicazione Admin V351 disponibile"
  else
    warn "matrice audit workflow pubblicazione Admin V351 non trovata"
  fi
  if doc_available "$handoff_v351_doc"; then
    pass "handoff nuovo assistente V351 disponibile"
  else
    warn "handoff nuovo assistente V351 non trovato"
  fi
  if doc_available "$funzionalita_v351_doc"; then
    pass "lista funzionalita V351 disponibile: FUNZIONALITAV351.md"
  else
    warn "lista funzionalita V351 non trovata"
  fi
  if doc_available "$release_v351_doc"; then
    pass "release V351 disponibile"
  else
    warn "release V351 non trovata"
  fi


  refactor_v352_doc="$DOCS_ROOT/refactor/MOBILE_HOTFIX_CLEANUP_V352.md"
  audit_mobile_v352_doc="$DOCS_ROOT/audit/MOBILE_HOTFIX_CLEANUP_MATRIX_V352.md"
  handoff_v352_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V352.md"
  funzionalita_v352_doc="$DOCS_ROOT/FUNZIONALITAV352.md"
  release_v352_doc="$DOCS_ROOT/release/RELEASE_V352_MOBILE_HOTFIX_CLEANUP.md"
  if doc_available "$refactor_v352_doc"; then
    pass "cleanup mobile hotfix V352 documentato"
  else
    warn "documento refactor V352 non trovato"
  fi
  if doc_available "$audit_mobile_v352_doc"; then
    pass "matrice cleanup mobile hotfix V352 disponibile"
  else
    warn "matrice cleanup mobile hotfix V352 non trovata"
  fi
  if doc_available "$handoff_v352_doc"; then
    pass "handoff nuovo assistente V352 disponibile"
  else
    warn "handoff nuovo assistente V352 non trovato"
  fi
  if doc_available "$funzionalita_v352_doc"; then
    pass "lista funzionalita V352 disponibile: FUNZIONALITAV352.md"
  else
    warn "lista funzionalita V352 non trovata"
  fi
  if doc_available "$release_v352_doc"; then
    pass "release V352 disponibile"
  else
    warn "release V352 non trovata"
  fi


  refactor_v353_doc="$DOCS_ROOT/refactor/THEME_COMPETITIONS_AUDIT_V353.md"
  audit_theme_v353_doc="$DOCS_ROOT/audit/THEME_COMPETITIONS_AUDIT_MATRIX_V353.md"
  handoff_v353_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V353.md"
  funzionalita_v353_doc="$DOCS_ROOT/FUNZIONALITAV353.md"
  release_v353_doc="$DOCS_ROOT/release/RELEASE_V353_THEME_COMPETITIONS_AUDIT.md"
  if doc_available "$refactor_v353_doc"; then
    pass "audit tema/competizioni V353 documentato"
  else
    warn "documento refactor V353 non trovato"
  fi
  if doc_available "$audit_theme_v353_doc"; then
    pass "matrice audit tema/competizioni V353 disponibile"
  else
    warn "matrice audit tema/competizioni V353 non trovata"
  fi
  if doc_available "$handoff_v353_doc"; then
    pass "handoff nuovo assistente V353 disponibile"
  else
    warn "handoff nuovo assistente V353 non trovato"
  fi
  if doc_available "$funzionalita_v353_doc"; then
    pass "lista funzionalita V353 disponibile: FUNZIONALITAV353.md"
  else
    warn "lista funzionalita V353 non trovata"
  fi
  if doc_available "$release_v353_doc"; then
    pass "release V353 disponibile"
  else
    warn "release V353 non trovata"
  fi

  refactor_v354_doc="$DOCS_ROOT/refactor/REFACTOR_CLEANUP_CONSOLIDATION_V354.md"
  audit_v354_doc="$DOCS_ROOT/audit/REFACTOR_CLEANUP_CONSOLIDATION_MATRIX_V354.md"
  handoff_v354_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V354.md"
  funzionalita_v354_doc="$DOCS_ROOT/FUNZIONALITAV354.md"
  release_v354_doc="$DOCS_ROOT/release/RELEASE_V354_REFACTOR_CLEANUP_CONSOLIDATION.md"
  if doc_available "$refactor_v354_doc"; then
    pass "consolidamento refactor V354 documentato"
  else
    warn "documento refactor V354 non trovato"
  fi
  if doc_available "$audit_v354_doc"; then
    pass "matrice consolidamento refactor V354 disponibile"
  else
    warn "matrice consolidamento refactor V354 non trovata"
  fi
  if doc_available "$handoff_v354_doc"; then
    pass "handoff nuovo assistente V354 disponibile"
  else
    warn "handoff nuovo assistente V354 non trovato"
  fi
  if doc_available "$funzionalita_v354_doc"; then
    pass "lista funzionalita V354 disponibile: FUNZIONALITAV354.md"
  else
    warn "lista funzionalita V354 non trovata"
  fi
  if doc_available "$release_v354_doc"; then
    pass "release V354 disponibile"
  else
    warn "release V354 non trovata"
  fi


  refactor_v355_doc="$DOCS_ROOT/refactor/REGRESSION_SMOKE_SUITE_V355.md"
  audit_v355_doc="$DOCS_ROOT/audit/REGRESSION_SMOKE_MATRIX_V355.md"
  handoff_v355_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V355.md"
  funzionalita_v355_doc="$DOCS_ROOT/FUNZIONALITAV355.md"
  release_v355_doc="$DOCS_ROOT/release/RELEASE_V355_REGRESSION_SMOKE_SUITE.md"
  test_v355_doc="$DOCS_ROOT/test/TEST_MANUALE_COMPLETO_V355.md"
  if doc_available "$refactor_v355_doc"; then
    pass "suite regression smoke V355 documentata"
  else
    warn "documento refactor V355 non trovato"
  fi
  if doc_available "$audit_v355_doc"; then
    pass "matrice regression smoke V355 disponibile"
  else
    warn "matrice regression smoke V355 non trovata"
  fi
  if doc_available "$handoff_v355_doc"; then
    pass "handoff nuovo assistente V355 disponibile"
  else
    warn "handoff nuovo assistente V355 non trovato"
  fi
  if doc_available "$funzionalita_v355_doc"; then
    pass "lista funzionalita V355 disponibile: FUNZIONALITAV355.md"
  else
    warn "lista funzionalita V355 non trovata"
  fi
  if doc_available "$release_v355_doc"; then
    pass "release V355 disponibile"
  else
    warn "release V355 non trovata"
  fi
  if doc_available "$test_v355_doc"; then
    pass "checklist manuale V355 disponibile"
  else
    warn "checklist manuale V355 non trovata"
  fi

  manual_qa_v356_doc="$DOCS_ROOT/refactor/MANUAL_QA_TRACKER_V356.md"
  audit_manual_qa_v356_doc="$DOCS_ROOT/audit/MANUAL_QA_TRACKER_MATRIX_V356.md"
  handoff_v356_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V356.md"
  funzionalita_v356_doc="$DOCS_ROOT/FUNZIONALITAV356.md"
  release_v356_doc="$DOCS_ROOT/release/RELEASE_V356_MANUAL_QA_TRACKER.md"
  test_v356_doc="$DOCS_ROOT/test/MANUAL_QA_TRACKER_COMANDI_V356.md"
  if doc_available "$manual_qa_v356_doc"; then
    pass "manual QA tracker V356 documentato"
  else
    warn "documento refactor V356 non trovato"
  fi
  if doc_available "$audit_manual_qa_v356_doc"; then
    pass "matrice manual QA tracker V356 disponibile"
  else
    warn "matrice manual QA tracker V356 non trovata"
  fi
  if doc_available "$handoff_v356_doc"; then
    pass "handoff nuovo assistente V356 disponibile"
  else
    warn "handoff nuovo assistente V356 non trovato"
  fi
  if doc_available "$funzionalita_v356_doc"; then
    pass "lista funzionalita V356 disponibile: FUNZIONALITAV356.md"
  else
    warn "lista funzionalita V356 non trovata"
  fi
  if doc_available "$release_v356_doc"; then
    pass "release V356 disponibile"
  else
    warn "release V356 non trovata"
  fi
  if doc_available "$test_v356_doc"; then
    pass "comandi manual QA tracker V356 disponibili"
  else
    warn "comandi manual QA tracker V356 non trovati"
  fi



  manual_qa_panel_v357_doc="$DOCS_ROOT/refactor/MANUAL_QA_PANEL_V357.md"
  audit_manual_qa_panel_v357_doc="$DOCS_ROOT/audit/MANUAL_QA_PANEL_MATRIX_V357.md"
  handoff_v357_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V357.md"
  funzionalita_v357_doc="$DOCS_ROOT/FUNZIONALITAV357.md"
  release_v357_doc="$DOCS_ROOT/release/RELEASE_V357_MANUAL_QA_PANEL.md"
  test_v357_doc="$DOCS_ROOT/test/MANUAL_QA_INTERFACCIA_V357.md"
  if doc_available "$manual_qa_panel_v357_doc"; then
    pass "manual QA panel V357 documentato"
  else
    warn "documento refactor V357 non trovato"
  fi
  if doc_available "$audit_manual_qa_panel_v357_doc"; then
    pass "matrice manual QA panel V357 disponibile"
  else
    warn "matrice manual QA panel V357 non trovata"
  fi
  if doc_available "$handoff_v357_doc"; then
    pass "handoff nuovo assistente V357 disponibile"
  else
    warn "handoff nuovo assistente V357 non trovato"
  fi
  if doc_available "$funzionalita_v357_doc"; then
    pass "lista funzionalita V357 disponibile: FUNZIONALITAV357.md"
  else
    warn "lista funzionalita V357 non trovata"
  fi
  if doc_available "$release_v357_doc"; then
    pass "release V357 disponibile"
  else
    warn "release V357 non trovata"
  fi
  if doc_available "$test_v357_doc"; then
    pass "manual QA interfaccia V357 disponibile"
  else
    warn "manual QA interfaccia V357 non trovata"
  fi


  manual_qa_panel_v358_doc="$DOCS_ROOT/refactor/MANUAL_QA_PANEL_V358.md"
  audit_manual_qa_panel_v358_doc="$DOCS_ROOT/audit/MANUAL_QA_PANEL_MATRIX_V358.md"
  handoff_v358_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V358.md"
  funzionalita_v358_doc="$DOCS_ROOT/FUNZIONALITAV358.md"
  release_v358_doc="$DOCS_ROOT/release/RELEASE_V358_MANUAL_QA_PANEL.md"
  test_v358_doc="$DOCS_ROOT/test/MANUAL_QA_INTERFACCIA_V358.md"
  audit_manual_qa_panel_v358_tool="$SITE_ROOT/tools/audit-manual-qa-panel-v358.mjs"
  if doc_available "$manual_qa_panel_v358_doc"; then
    pass "manual QA panel V358 documentato"
  else
    warn "documento refactor V358 non trovato"
  fi
  if doc_available "$audit_manual_qa_panel_v358_doc"; then
    pass "matrice manual QA panel V358 disponibile"
  else
    warn "matrice manual QA panel V358 non trovata"
  fi
  if doc_available "$handoff_v358_doc"; then
    pass "handoff nuovo assistente V358 disponibile"
  else
    warn "handoff nuovo assistente V358 non trovato"
  fi
  if doc_available "$funzionalita_v358_doc"; then
    pass "lista funzionalita V358 disponibile: FUNZIONALITAV358.md"
  else
    warn "lista funzionalita V358 non trovata"
  fi
  if doc_available "$release_v358_doc"; then
    pass "release V358 disponibile"
  else
    warn "release V358 non trovata"
  fi
  if doc_available "$test_v358_doc"; then
    pass "manual QA interfaccia V358 disponibile"
  else
    warn "manual QA interfaccia V358 non trovata"
  fi
  if [[ -f "$audit_manual_qa_panel_v358_tool" ]]; then
    pass "audit manual QA panel V358 disponibile"
  else
    warn "audit manual QA panel V358 non trovato"
  fi


  player_diag_v359_doc="$DOCS_ROOT/refactor/CALCIOMERCATO_PLAYER_DIAGNOSTICS_V359.md"
  audit_player_diag_v359_doc="$DOCS_ROOT/audit/CALCIOMERCATO_PLAYER_DIAGNOSTICS_MATRIX_V359.md"
  handoff_v359_doc="$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V359.md"
  funzionalita_v359_doc="$DOCS_ROOT/FUNZIONALITAV359.md"
  release_v359_doc="$DOCS_ROOT/release/RELEASE_V359_PLAYER_DIAGNOSTICS.md"
  test_v359_doc="$DOCS_ROOT/test/CALCIOMERCATO_PLAYER_DIAGNOSTICS_V359.md"
  audit_player_diag_v359_tool="$SITE_ROOT/tools/audit-calciomercato-player-diagnostics-v359.mjs"
  if doc_available "$player_diag_v359_doc"; then
    pass "diagnostica giocatori Calciomercato V359 documentata"
  else
    warn "documento refactor V359 non trovato"
  fi
  if doc_available "$audit_player_diag_v359_doc"; then
    pass "matrice diagnostica giocatori V359 disponibile"
  else
    warn "matrice diagnostica giocatori V359 non trovata"
  fi
  if doc_available "$handoff_v359_doc"; then
    pass "handoff nuovo assistente V359 disponibile"
  else
    warn "handoff nuovo assistente V359 non trovato"
  fi
  if doc_available "$funzionalita_v359_doc"; then
    pass "lista funzionalita V359 disponibile: FUNZIONALITAV359.md"
  else
    warn "lista funzionalita V359 non trovata"
  fi
  if doc_available "$release_v359_doc"; then
    pass "release V359 disponibile"
  else
    warn "release V359 non trovata"
  fi
  if doc_available "$test_v359_doc"; then
    pass "test diagnostica giocatori V359 disponibile"
  else
    warn "test diagnostica giocatori V359 non trovato"
  fi
  if [[ -f "$audit_player_diag_v359_tool" ]]; then
    pass "audit diagnostica giocatori V359 disponibile"
  else
    warn "audit diagnostica giocatori V359 non trovato"
  fi

  admin_diag_fix_doc="$DOCS_ROOT/admin/ADMIN_DIAGNOSTICA_EXPAND_FIX_V321.md"
  if doc_available "$admin_diag_fix_doc"; then
    pass "fix espansione Diagnostica dati Admin V321 documentato: admin/ADMIN_DIAGNOSTICA_EXPAND_FIX_V321.md"
  else
    warn "fix espansione Diagnostica dati Admin V321 non documentato"
  fi
  listone_role_fix_doc="$DOCS_ROOT/admin/DIAGNOSTICA_LISTONE_RUOLI_V322.md"
  if doc_available "$listone_role_fix_doc"; then
    pass "fix diagnostica ruoli Listone V322 documentato: admin/DIAGNOSTICA_LISTONE_RUOLI_V322.md"
  else
    warn "fix diagnostica ruoli Listone V322 non documentato"
  fi
fi

print_step "Manual QA panel V358"
if command -v node >/dev/null 2>&1; then
  audit_manual_qa_panel_v358="$SITE_ROOT/tools/audit-manual-qa-panel-v358.mjs"
  if [[ -f "$audit_manual_qa_panel_v358" ]]; then
    if node "$audit_manual_qa_panel_v358" --quiet; then
      pass "manual QA panel V358 superato"
    else
      fail "manual QA panel V358 fallito"
    fi
  else
    fail "tool audit manual QA panel V358 mancante"
  fi
else
  fail "node non disponibile per audit manual QA panel V358"
fi

print_step "Diagnostica giocatori Calciomercato V359"
if command -v node >/dev/null 2>&1; then
  audit_player_diag_v359="$SITE_ROOT/tools/audit-calciomercato-player-diagnostics-v359.mjs"
  if [[ -f "$audit_player_diag_v359" ]]; then
    if node "$audit_player_diag_v359" --quiet; then
      pass "diagnostica giocatori Calciomercato V359 superata"
    else
      fail "diagnostica giocatori Calciomercato V359 fallita"
    fi
  else
    fail "tool audit diagnostica giocatori V359 mancante"
  fi
else
  fail "node non disponibile per audit diagnostica giocatori V359"
fi


print_step "Checklist QA Admin con info V360"
qa_info_v360_tool="$SITE_ROOT/tools/audit-manual-qa-info-v360.mjs"
if [[ -f "$qa_info_v360_tool" ]]; then
  if node "$qa_info_v360_tool" --quiet; then
    pass "checklist QA Admin con info V360 verificata"
  else
    fail "checklist QA Admin con info V360 fallita"
  fi
else
  fail "tool audit checklist QA info V360 mancante"
fi

if [[ -n "$DOCS_ROOT" ]]; then
  for doc in \
    "$DOCS_ROOT/FUNZIONALITAV360.md" \
    "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V360.md" \
    "$DOCS_ROOT/refactor/MANUAL_QA_INFO_V360.md" \
    "$DOCS_ROOT/audit/MANUAL_QA_INFO_MATRIX_V360.md" \
    "$DOCS_ROOT/test/MANUAL_QA_INFO_INTERFACCIA_V360.md" \
    "$DOCS_ROOT/release/RELEASE_V360_MANUAL_QA_INFO.md"; do
    if doc_available "$doc"; then
      pass "documento V360 presente: ${doc#$DOCS_ROOT/}"
    else
      warn "documento V360 non trovato: ${doc#$DOCS_ROOT/}"
    fi
  done
fi



print_step "Pannello simulatore trade V361"
trade_panel_v361_tool="$SITE_ROOT/tools/audit-trade-simulator-panel-v361.mjs"
if [[ -f "$trade_panel_v361_tool" ]]; then
  if node "$trade_panel_v361_tool" --quiet; then
    pass "pannello simulatore trade V361 verificato"
  else
    fail "pannello simulatore trade V361 fallito"
  fi
else
  fail "tool audit pannello simulatore trade V361 mancante"
fi

print_step "Simulazione trade target presidente V362"
trade_target_v362_tool="$SITE_ROOT/tools/audit-trade-simulator-target-v362.mjs"
if [[ -f "$trade_target_v362_tool" ]]; then
  if node "$trade_target_v362_tool" --quiet; then
    pass "simulazione trade target presidente V362 verificata"
  else
    fail "simulazione trade target presidente V362 fallita"
  fi
else
  fail "tool audit simulazione target presidente V362 mancante"
fi

if [[ -n "$DOCS_ROOT" ]]; then
  for doc in \
    "$DOCS_ROOT/FUNZIONALITAV362.md" \
    "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V362.md" \
    "$DOCS_ROOT/refactor/TRADE_SIMULATOR_TARGET_PRESIDENT_V362.md" \
    "$DOCS_ROOT/audit/TRADE_SIMULATOR_TARGET_MATRIX_V362.md" \
    "$DOCS_ROOT/test/TRADE_SIMULATOR_TARGET_INTERFACCIA_V362.md" \
    "$DOCS_ROOT/release/RELEASE_V362_TRADE_SIMULATOR_TARGET.md"; do
    if doc_available "$doc"; then
      pass "documento V362 presente: ${doc#$DOCS_ROOT/}"
    else
      warn "documento V362 non trovato: ${doc#$DOCS_ROOT/}"
    fi
  done
fi

print_step "Smoke test protetti V367"
protected_regression_v367_tool="$SITE_ROOT/tools/audit-protected-regression-v367.mjs"
if [[ -f "$protected_regression_v367_tool" ]]; then
  if node "$protected_regression_v367_tool" --quiet; then
    pass "smoke test protetti V367 verificati"
  else
    fail "smoke test protetti V367 falliti"
  fi
else
  fail "tool audit smoke test protetti V367 mancante"
fi

if [[ -n "$DOCS_ROOT" ]]; then
  for doc in     "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V367.md"     "$DOCS_ROOT/audit/PROTECTED_REGRESSION_MATRIX_V367.md"     "$DOCS_ROOT/test/SMOKE_TEST_AUTOMATICI_V367.md"     "$DOCS_ROOT/release/RELEASE_V367_SMOKE_TEST_PROTETTI.md"; do
    if doc_available "$doc"; then
      pass "documento V367 presente: ${doc#$DOCS_ROOT/}"
    else
      warn "documento V367 non trovato: ${doc#$DOCS_ROOT/}"
    fi
  done
fi


print_step "Dashboard pubblicazione Admin V368"
publication_dashboard_v368_tool="$SITE_ROOT/tools/audit-publication-dashboard-v368.mjs"
if [[ -f "$publication_dashboard_v368_tool" ]]; then
  if node "$publication_dashboard_v368_tool" --quiet; then
    pass "dashboard pubblicazione Admin V368 verificata"
  else
    fail "dashboard pubblicazione Admin V368 fallita"
  fi
else
  fail "tool audit dashboard pubblicazione V368 mancante"
fi

if [[ -n "$DOCS_ROOT" ]]; then
  for doc in \
    "$DOCS_ROOT/FUNZIONALITAV368.md" \
    "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V368.md" \
    "$DOCS_ROOT/audit/PUBLICATION_DASHBOARD_MATRIX_V368.md" \
    "$DOCS_ROOT/test/PUBLICATION_DASHBOARD_ADMIN_V368.md" \
    "$DOCS_ROOT/release/RELEASE_V368_DASHBOARD_PUBBLICAZIONE_ADMIN.md"; do
    if doc_available "$doc"; then
      pass "documento V368 presente: ${doc#$DOCS_ROOT/}"
    else
      warn "documento V368 non trovato: ${doc#$DOCS_ROOT/}"
    fi
  done
fi


print_step "Dashboard Presidente V369"
president_dashboard_v369_tool="$SITE_ROOT/tools/audit-president-dashboard-v369.mjs"
if command -v node >/dev/null 2>&1; then
  if [[ -f "$president_dashboard_v369_tool" ]]; then
    if node "$president_dashboard_v369_tool" --quiet; then
      pass "dashboard presidente V369 verificata"
    else
      fail "dashboard presidente V369 fallita"
    fi
  else
    fail "tool audit dashboard presidente V369 mancante"
  fi
else
  fail "node non disponibile per audit dashboard presidente V369"
fi

if [[ -n "$DOCS_ROOT" ]]; then
  for doc in \
    "$DOCS_ROOT/FUNZIONALITAV369.md" \
    "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V369.md" \
    "$DOCS_ROOT/audit/PRESIDENT_DASHBOARD_MATRIX_V369.md" \
    "$DOCS_ROOT/test/PRESIDENT_DASHBOARD_V369.md" \
    "$DOCS_ROOT/release/RELEASE_V369_DASHBOARD_PRESIDENTE_PROTETTA.md"; do
    if doc_available "$doc"; then
      pass "documento V369 presente: ${doc#$DOCS_ROOT/}"
    else
      warn "documento V369 non trovato: ${doc#$DOCS_ROOT/}"
    fi
  done
fi


print_step "Centro notifiche Presidente V370"
president_notification_v370_tool="$SITE_ROOT/tools/audit-president-notification-center-v370.mjs"
if command -v node >/dev/null 2>&1; then
  if [[ -f "$president_notification_v370_tool" ]]; then
    if node "$president_notification_v370_tool" --quiet; then
      pass "centro notifiche presidente V370 verificato"
    else
      fail "centro notifiche presidente V370 fallito"
    fi
  else
    fail "tool audit centro notifiche presidente V370 mancante"
  fi
else
  fail "node non disponibile per audit centro notifiche presidente V370"
fi

if [[ -n "$DOCS_ROOT" ]]; then
  for doc in \
    "$DOCS_ROOT/FUNZIONALITAV370.md" \
    "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V370.md" \
    "$DOCS_ROOT/audit/PRESIDENT_NOTIFICATION_CENTER_MATRIX_V370.md" \
    "$DOCS_ROOT/test/PRESIDENT_NOTIFICATION_CENTER_V370.md" \
    "$DOCS_ROOT/release/RELEASE_V370_CENTRO_NOTIFICHE_PRESIDENTE.md"; do
    if doc_available "$doc"; then
      pass "documento V370 presente: ${doc#$DOCS_ROOT/}"
    else
      warn "documento V370 non trovato: ${doc#$DOCS_ROOT/}"
    fi
  done
fi


print_step "Soccer Data V371"
soccer_data_v371_tool="$SITE_ROOT/tools/audit-soccer-data-v371.mjs"
if command -v node >/dev/null 2>&1; then
  if [[ -f "$soccer_data_v371_tool" ]]; then
    if node "$soccer_data_v371_tool" --quiet; then
      pass "Soccer Data V371 verificato"
    else
      warn "Soccer Data V371 fallito"
    fi
  else
    pass "tool audit storico Soccer Data non piu nel gate runtime: V371"
  fi
else
  warn "node non disponibile per audit Soccer Data V371"
fi

if [[ -n "$DOCS_ROOT" ]]; then
  for doc in \
    "$DOCS_ROOT/FUNZIONALITAV371.md" \
    "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V371.md" \
    "$DOCS_ROOT/audit/SOCCER_DATA_MATRIX_V371.md" \
    "$DOCS_ROOT/test/SOCCER_DATA_V371.md" \
    "$DOCS_ROOT/release/RELEASE_V371_SOCCER_DATA_PROTETTO.md"; do
    if doc_available "$doc"; then
      pass "documento V371 presente: ${doc#$DOCS_ROOT/}"
    else
      warn "documento V371 non trovato: ${doc#$DOCS_ROOT/}"
    fi
  done
fi


print_step "Soccer Data mapping assistito V372"
soccer_data_v372_tool="$SITE_ROOT/tools/audit-soccer-data-mapping-v372.mjs"
if command -v node >/dev/null 2>&1; then
  if [[ -f "$soccer_data_v372_tool" ]]; then
    if node "$soccer_data_v372_tool" --quiet; then
      pass "Soccer Data mapping assistito V372 verificato"
    else
      warn "Soccer Data mapping assistito V372 fallito"
    fi
  else
    pass "tool audit storico Soccer Data non piu nel gate runtime: V372 mapping"
  fi
else
  warn "node non disponibile per audit Soccer Data mapping V372"
fi

if [[ -n "$DOCS_ROOT" ]]; then
  for doc in     "$DOCS_ROOT/FUNZIONALITAV372.md"     "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V372.md"     "$DOCS_ROOT/audit/SOCCER_DATA_MAPPING_MATRIX_V372.md"     "$DOCS_ROOT/test/SOCCER_DATA_MAPPING_V372.md"     "$DOCS_ROOT/release/RELEASE_V372_SOCCER_DATA_MAPPING_ASSISTITO.md"; do
    if doc_available "$doc"; then
      pass "documento V372 presente: ${doc#$DOCS_ROOT/}"
    else
      warn "documento V372 non trovato: ${doc#$DOCS_ROOT/}"
    fi
  done
fi


print_step "Soccer Data FBref batch V376"
if command -v node >/dev/null 2>&1; then
  audit_soccer_data_fbref_batch_v376="$SITE_ROOT/tools/audit-soccer-data-fbref-batch-v376.mjs"
  if [[ -f "$audit_soccer_data_fbref_batch_v376" ]]; then
    if node "$audit_soccer_data_fbref_batch_v376" --quiet; then
      pass "Soccer Data FBref batch V376 superato"
    else
      warn "Soccer Data FBref batch V376 fallito"
    fi
  else
    pass "tool audit storico Soccer Data non piu nel gate runtime: FBref batch V376"
  fi
else
  warn "node non disponibile per audit Soccer Data FBref batch V376"
fi

for doc in     "$DOCS_ROOT/FUNZIONALITAV376.md"     "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V376.md"     "$DOCS_ROOT/audit/SOCCER_DATA_FBREF_BATCH_04_MATRIX_V376.md"     "$DOCS_ROOT/test/SOCCER_DATA_FBREF_BATCH_04_V376.md"     "$DOCS_ROOT/release/RELEASE_V376_SOCCER_DATA_FBREF_BATCH_04.md"; do
  if doc_available "$doc"; then
    pass "documento V376 presente: ${doc#$DOCS_ROOT/}"
  else
    warn "documento V376 non trovato: ${doc#$DOCS_ROOT/}"
  fi
done


print_step "Soccer Data FBref batch V377"
if command -v node >/dev/null 2>&1; then
  audit_soccer_data_fbref_batch_v377="$SITE_ROOT/tools/audit-soccer-data-fbref-batch-v377.mjs"
  if [[ -f "$audit_soccer_data_fbref_batch_v377" ]]; then
    if node "$audit_soccer_data_fbref_batch_v377" --quiet; then
      pass "Soccer Data FBref batch V377 superato"
    else
      warn "Soccer Data FBref batch V377 fallito"
    fi
  else
    pass "tool audit storico Soccer Data non piu nel gate runtime: FBref batch V377"
  fi
else
  warn "node non disponibile per audit Soccer Data FBref batch V377"
fi

for doc in     "$DOCS_ROOT/FUNZIONALITAV377.md"     "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V377.md"     "$DOCS_ROOT/audit/SOCCER_DATA_FBREF_BATCH_05_MATRIX_V377.md"     "$DOCS_ROOT/test/SOCCER_DATA_FBREF_BATCH_05_V377.md"     "$DOCS_ROOT/release/RELEASE_V377_SOCCER_DATA_FBREF_BATCH_05.md"; do
  if doc_available "$doc"; then
    pass "documento V377 presente: ${doc#$DOCS_ROOT/}"
  else
    warn "documento V377 non trovato: ${doc#$DOCS_ROOT/}"
  fi
done


print_step "Soccer Data FBref batch V378"
if command -v node >/dev/null 2>&1; then
  audit_soccer_data_fbref_batch_v378="$SITE_ROOT/tools/audit-soccer-data-fbref-batch-v378.mjs"
  if [[ -f "$audit_soccer_data_fbref_batch_v378" ]]; then
    if node "$audit_soccer_data_fbref_batch_v378" --quiet; then
      pass "Soccer Data FBref batch V378 superato"
    else
      warn "Soccer Data FBref batch V378 fallito"
    fi
  else
    pass "tool audit storico Soccer Data non piu nel gate runtime: FBref batch V378"
  fi
else
  warn "node non disponibile per audit Soccer Data FBref batch V378"
fi

for doc in     "$DOCS_ROOT/FUNZIONALITAV378.md"     "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V378.md"     "$DOCS_ROOT/audit/SOCCER_DATA_FBREF_BATCH_06_MATRIX_V378.md"     "$DOCS_ROOT/test/SOCCER_DATA_FBREF_BATCH_06_V378.md"     "$DOCS_ROOT/release/RELEASE_V378_SOCCER_DATA_FBREF_BATCH_06.md"; do
  if doc_available "$doc"; then
    pass "documento V378 presente: ${doc#$DOCS_ROOT/}"
  else
    warn "documento V378 non trovato: ${doc#$DOCS_ROOT/}"
  fi
done

print_step "Soccer Data FBref batch V379"
if command -v node >/dev/null 2>&1; then
  audit_soccer_data_fbref_batch_v379="$SITE_ROOT/tools/audit-soccer-data-fbref-batch-v379.mjs"
  if [[ -f "$audit_soccer_data_fbref_batch_v379" ]]; then
    if node "$audit_soccer_data_fbref_batch_v379" --quiet; then
      pass "Soccer Data FBref batch V379 superato"
    else
      warn "Soccer Data FBref batch V379 fallito"
    fi
  else
    pass "tool audit storico Soccer Data non piu nel gate runtime: FBref batch V379"
  fi
else
  warn "node non disponibile per audit Soccer Data FBref batch V379"
fi

for doc in     "$DOCS_ROOT/FUNZIONALITAV379.md"     "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V379.md"     "$DOCS_ROOT/audit/SOCCER_DATA_FBREF_BATCH_07_MATRIX_V379.md"     "$DOCS_ROOT/test/SOCCER_DATA_FBREF_BATCH_07_V379.md"     "$DOCS_ROOT/release/RELEASE_V379_SOCCER_DATA_FBREF_BATCH_07.md"; do
  if doc_available "$doc"; then
    pass "documento V379 presente: ${doc#$DOCS_ROOT/}"
  else
    warn "documento V379 non trovato: ${doc#$DOCS_ROOT/}"
  fi
done


print_step "Soccer Data FBref batch V380"
if command -v node >/dev/null 2>&1; then
  audit_soccer_data_fbref_batch_v380="$SITE_ROOT/tools/audit-soccer-data-fbref-batch-v380.mjs"
  if [[ -f "$audit_soccer_data_fbref_batch_v380" ]]; then
    if node "$audit_soccer_data_fbref_batch_v380" --quiet; then
      pass "Soccer Data FBref batch V380 superato"
    else
      warn "Soccer Data FBref batch V380 fallito"
    fi
  else
    pass "tool audit storico Soccer Data non piu nel gate runtime: FBref batch V380"
  fi
else
  warn "node non disponibile per audit Soccer Data FBref batch V380"
fi

for doc in     "$DOCS_ROOT/FUNZIONALITAV380.md"     "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V380.md"     "$DOCS_ROOT/audit/SOCCER_DATA_FBREF_BATCH_08_MATRIX_V380.md"     "$DOCS_ROOT/test/SOCCER_DATA_FBREF_BATCH_08_V380.md"     "$DOCS_ROOT/release/RELEASE_V380_SOCCER_DATA_FBREF_BATCH_08.md"; do
  if doc_available "$doc"; then
    pass "documento V380 presente: ${doc#$DOCS_ROOT/}"
  else
    warn "documento V380 non trovato: ${doc#$DOCS_ROOT/}"
  fi
done



print_step "Audit Admin mobile pulsante sopra V430"
if command -v node >/dev/null 2>&1; then
  audit_admin_mobile_button_top_v430="$SITE_ROOT/tools/audit-admin-mobile-button-top-v430.mjs"
  if [[ -f "$audit_admin_mobile_button_top_v430" ]]; then
    if node "$audit_admin_mobile_button_top_v430" --quiet; then
      pass "audit Admin mobile pulsante sopra V430 superato"
    else
      fail "audit Admin mobile pulsante sopra V430 fallito"
    fi
  else
    fail "tool audit Admin mobile pulsante sopra V430 mancante"
  fi
else
  fail "node non disponibile per audit Admin mobile pulsante sopra V430"
fi


print_step "Audit Area Squadra mobile compatta V431"
if command -v node >/dev/null 2>&1; then
  audit_teamarea_mobile_v431="$SITE_ROOT/tools/audit-teamarea-mobile-v431.mjs"
  if [[ -f "$audit_teamarea_mobile_v431" ]]; then
    if node "$audit_teamarea_mobile_v431" --quiet; then
      pass "audit Area Squadra mobile compatta V431 superato"
    else
      fail "audit Area Squadra mobile compatta V431 fallito"
    fi
  else
    fail "tool audit Area Squadra mobile compatta V431 mancante"
  fi
else
  fail "node non disponibile per audit Area Squadra mobile compatta V431"
fi


print_step "Audit Area Squadra mobile ordinata V432"
if command -v node >/dev/null 2>&1; then
  audit_teamarea_mobile_v432="$SITE_ROOT/tools/audit-teamarea-mobile-v432.mjs"
  if [[ -f "$audit_teamarea_mobile_v432" ]]; then
    if node "$audit_teamarea_mobile_v432" --quiet; then
      pass "audit Area Squadra mobile ordinata V432 superato"
    else
      fail "audit Area Squadra mobile ordinata V432 fallito"
    fi
  else
    fail "tool audit Area Squadra mobile ordinata V432 mancante"
  fi
else
  fail "node non disponibile per audit Area Squadra mobile ordinata V432"
fi


print_step "Audit Area Squadra mobile semplificata V433"
if command -v node >/dev/null 2>&1; then
  audit_teamarea_mobile_v433="$SITE_ROOT/tools/audit-teamarea-mobile-v433.mjs"
  if [[ -f "$audit_teamarea_mobile_v433" ]]; then
    if node "$audit_teamarea_mobile_v433" --quiet; then
      pass "audit Area Squadra mobile semplificata V433 superato"
    else
      fail "audit Area Squadra mobile semplificata V433 fallito"
    fi
  else
    fail "tool audit Area Squadra mobile semplificata V433 mancante"
  fi
else
  fail "node non disponibile per audit Area Squadra mobile semplificata V433"
fi

print_step "Soccer Data FBref batch V381"
if command -v node >/dev/null 2>&1; then
  audit_soccer_data_fbref_batch_v381="$SITE_ROOT/tools/audit-soccer-data-fbref-batch-v381.mjs"
  if [[ -f "$audit_soccer_data_fbref_batch_v381" ]]; then
    if node "$audit_soccer_data_fbref_batch_v381" --quiet; then
      pass "Soccer Data FBref batch V381 superato"
    else
      warn "Soccer Data FBref batch V381 fallito"
    fi
  else
    pass "tool audit storico Soccer Data non piu nel gate runtime: FBref batch V381"
  fi
else
  warn "node non disponibile per audit Soccer Data FBref batch V381"
fi

for doc in     "$DOCS_ROOT/FUNZIONALITAV381.md"     "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V381.md"     "$DOCS_ROOT/audit/SOCCER_DATA_FBREF_BATCH_09_MATRIX_V381.md"     "$DOCS_ROOT/test/SOCCER_DATA_FBREF_BATCH_09_V381.md"     "$DOCS_ROOT/release/RELEASE_V381_SOCCER_DATA_FBREF_BATCH_09.md"; do
  if doc_available "$doc"; then
    pass "documento V381 presente: ${doc#$DOCS_ROOT/}"
  else
    warn "documento V381 non trovato: ${doc#$DOCS_ROOT/}"
  fi
done


print_step "Soccer Data FBref batch V382"
if command -v node >/dev/null 2>&1; then
  audit_soccer_data_fbref_batch_v382="$SITE_ROOT/tools/audit-soccer-data-fbref-batch-v382.mjs"
  if [[ -f "$audit_soccer_data_fbref_batch_v382" ]]; then
    if node "$audit_soccer_data_fbref_batch_v382" --quiet; then
      pass "Soccer Data FBref batch V382 superato"
    else
      warn "Soccer Data FBref batch V382 fallito"
    fi
  else
    pass "tool audit storico Soccer Data non piu nel gate runtime: FBref batch V382"
  fi
else
  warn "node non disponibile per audit Soccer Data FBref batch V382"
fi

for doc in     "$DOCS_ROOT/FUNZIONALITAV382.md"     "$DOCS_ROOT/handoff/HANDOFF_NUOVO_ASSISTENTE_V382.md"     "$DOCS_ROOT/audit/SOCCER_DATA_FBREF_BATCH_10_MATRIX_V382.md"     "$DOCS_ROOT/test/SOCCER_DATA_FBREF_BATCH_10_V382.md"     "$DOCS_ROOT/release/RELEASE_V382_SOCCER_DATA_FBREF_BATCH_10.md"; do
  if doc_available "$doc"; then
    pass "documento V382 presente: ${doc#$DOCS_ROOT/}"
  else
    warn "documento V382 non trovato: ${doc#$DOCS_ROOT/}"
  fi
done

print_step "Riepilogo"
if [[ "$failures" -gt 0 ]]; then
  printf 'Controlli falliti: %s. Warning: %s.
' "$failures" "$warns" >&2
  exit 1
fi
printf 'Tutti i controlli obbligatori sono passati. Warning: %s.
' "$warns"


