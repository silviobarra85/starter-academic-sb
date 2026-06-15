## Test e audit V445 - Presentazione runtime da config

- Aggiunto `tools/audit-runtime-presentation-config-v445.mjs`.
- L'audit verifica config branding, metadata pagina, menu mobile Altro, hook HTML, helper loader, uso `siteUrl` per share comunicati, supporto `siteName/shortName` nei comunicati e assenza di Firebase/snapshot nel loader.
- Integrato il gate V445 in `tools/check-zonaorientale.sh`.
- I controlli V443 e V444 restano attivi per garantire che la config base e la mappa hard-coded continuino a esistere.

## Test e audit V444 - Mappa riferimenti hard-coded multi-lega

- Aggiunto `tools/audit-hardcoded-league-refs-v444.mjs`.
- Aggiunta baseline `tools/hardcoded-league-refs-v444.json`, generabile anche con `node tools/audit-hardcoded-league-refs-v444.mjs --json`.
- L'audit e' osservativo: fallisce solo se mancano la config, la baseline o i riferimenti principali che rendono significativa la mappa; non fallisce perche' trova stringhe hard-coded.
- Integrato il gate V444 in `tools/check-zonaorientale.sh`.

Comandi consigliati:

```bash
cd static/zonaorientale
node --check assets/app.js
node --check assets/js/core/league-config-v443.js
node tools/audit-league-config-v443.mjs
node tools/audit-hardcoded-league-refs-v444.mjs
bash tools/check-zonaorientale.sh
```

## Test e audit V443 - Configurazione lega multi-lega

- Aggiunto `tools/audit-league-config-v443.mjs`.
- L'audit verifica presenza e contenuto di `assets/league-config.json`, loader `league-config-v443.js`, caricamento in home e standalone, cache-buster/footer V443, marker runtime, integrazione Bilanci con fallback e assenza di Firebase nel loader.
- Aggiornato `tools/check-zonaorientale.sh` con il gate V443.
- Resi compatibili con V443 gli audit recenti V438-V442 che controllavano cache-buster/footer/runtime specifici.

Comandi consigliati:

```bash
cd static/zonaorientale
node --check assets/app.js
node --check assets/js/core/league-config-v443.js
node --check assets/js/sections/bilanci-snapshot-section-v435.js
node tools/audit-league-config-v443.mjs
bash tools/check-zonaorientale.sh
```

## Test e audit V440 - Link WhatsApp Bilanci

- Aggiunto `tools/audit-bilanci-whatsapp-v440.mjs`.
- L'audit verifica runtime/cache V440, pulsante `Copia link WhatsApp`, landing `bilanci.html`, metadati Open Graph specifici e redirect a `#bilanci`.
- Aggiornato `tools/check-zonaorientale.sh` con il gate V440.

## Test e audit V439 - Menu Altro pagine standalone

- Aggiunto `tools/audit-mobile-more-standalone-v439.mjs`.
- L'audit verifica runtime/cache V439 e la presenza delle stesse voci `Altro` su `index.html`, `competition.html` e `player.html`.
- Il gate controlla anche che `player.html` abbia bottom nav e sheet `Altro`, e che il marker runtime `ZonaOrientaleStandaloneMoreMenuV439` sia presente.
- Aggiornato `tools/check-zonaorientale.sh` con il gate V439.

## Test e audit V438

- Aggiunto `tools/audit-bilanci-mobile-v438.mjs`.
- L'audit verifica runtime/cache V438, controlli sotto il titolo `Bilancio stagione`, sticky robusto della colonna `Voce`, dettagli mensili chiusi di default e mantenimento della sorgente snapshot.
- Aggiornato `tools/check-zonaorientale.sh` con il gate V438.

## Test e audit V437

- Aggiunto `tools/audit-bilanci-mobile-v437.mjs`.
- L'audit verifica runtime/cache V437, assenza della fonte tecnica visibile nella sezione Bilanci, layout header dedicato, sticky mobile rinforzato per la colonna `Voce` e mantenimento della sorgente dati snapshot.
- Aggiornato `tools/check-zonaorientale.sh` con il gate V437.

## Test e audit V436

- Aggiunto `tools/audit-admin-fm-movement-edit-v436.mjs`.
- L'audit verifica runtime V436, pulsante `Modifica`, precompilazione form tramite stato edit, uso di `updateDoc` per movimenti esistenti, mantenimento di `addDoc` e side effect per i nuovi movimenti, CSS mobile e badge V434.
- Aggiornato `tools/check-zonaorientale.sh` con il gate V436.

```bash
node --check assets/app.js
node tools/audit-admin-fm-movement-edit-v436.mjs
bash tools/check-zonaorientale.sh
```

## Test e audit V435

- Aggiunto `tools/audit-bilanci-snapshot-v435.mjs`.
- L'audit verifica sezione/link Bilanci, CSS/JS dedicati, registry, uso di `assets/snapshots/seasons/*.json`, assenza di `assets/bilanci`, presenza di movimenti FM in `2025-2026.json` e badge V434 ancora collegato.
- Aggiornato `tools/check-zonaorientale.sh` con il gate V435.

Comandi consigliati:

```bash
cd static/zonaorientale
node --check assets/js/sections/bilanci-snapshot-section-v435.js
node tools/audit-bilanci-snapshot-v435.mjs
bash tools/check-zonaorientale.sh
```

## Test e audit V434

- Aggiunto `tools/audit-device-badge-v434.mjs`.
- L'audit verifica asset CSS/JS del badge, caricamento sulle pagine principali, marker runtime, footer/cache-buster V434 e comportamento non invasivo `pointer-events: none`.
- Aggiornato `tools/check-zonaorientale.sh` con il gate V434.

Comandi consigliati:

```bash
cd static/zonaorientale
node --check assets/app.js
node tools/audit-device-badge-v434.mjs
bash tools/check-zonaorientale.sh
```

## Test e audit V433

- Aggiunto `tools/audit-teamarea-mobile-v433.mjs`.
- L'audit verifica runtime/cache/footer V433, card Notifiche presidente nascosta da mobile, pannelli V242/V261 spostati in basso, azioni 2x2 e integrazione nel check principale.
- Aggiornato `tools/check-zonaorientale.sh` con il gate V433.

Comandi consigliati:

```bash
cd static/zonaorientale
node --check assets/app.js
node tools/audit-teamarea-mobile-v433.mjs
bash tools/check-zonaorientale.sh
```

## Test e audit V432

- Aggiunto `tools/audit-teamarea-mobile-v432.mjs`.
- L'audit verifica runtime/cache/footer V432, selector corretto `.president-dashboard-v369`, griglia 2 colonne per metriche/azioni e pannelli collassabili V242/V261.
- Aggiornato `tools/check-zonaorientale.sh` con il gate V432.
- Reso l'audit V431 compatibile con runtime successivi.

## Test e audit V431

- Aggiunto `tools/audit-teamarea-mobile-v431.mjs`.
- L'audit verifica runtime/footer/cache-buster V431, marker `ZonaOrientaleTeamAreaMobileCompactV431`, helper di ordinamento, classi CSS V431 e integrazione nel check principale.
- Aggiornato `tools/check-zonaorientale.sh` con il gate V431.

## Test e audit V429

- Aggiunto `tools/audit-admin-mobile-header-v429.mjs`.
- L'audit verifica runtime V429, footer/cache-buster V429, marker `ZonaOrientaleAdminMobileHeaderFixV429`, presenza delle regole CSS che impediscono la compressione dei titoli Admin e integrazione nel check principale.
- Aggiornato `tools/check-zonaorientale.sh` per includere il gate V429.

Comandi consigliati:

```bash
cd static/zonaorientale
node --check assets/app.js
node tools/audit-admin-mobile-header-v429.mjs
bash tools/check-zonaorientale.sh
```

## Test e audit V428

- Aggiunto `tools/audit-premerge-cleanup-v428.mjs`.
- L'audit verifica runtime V428, footer/cache-buster V428, marker `ZonaOrientalePreMergeCleanupV428`, preservazione V407-V427, docs consolidati, assenza di `sezioni/`, assenza asset sperimentali e assenza artefatti macOS.
- Aggiornato `tools/check-zonaorientale.sh` per includere il gate V428.

Comandi consigliati:

```bash
cd static/zonaorientale
node --check assets/app.js
node tools/audit-premerge-cleanup-v428.mjs
bash tools/check-zonaorientale.sh
```

## Test e audit V427

- Aggiunto `tools/audit-legacy-warning-cleanup-v427.mjs`.
- L'audit verifica runtime V427, footer/cache-buster V427, marker `ZonaOrientaleLegacyWarningCleanupV427`, preservazione V426, assenza del refactor `sezioni/`, asset sperimentali non collegati e riclassificazione dei tool Soccer Data storici come advisory.
- Aggiornato `tools/check-zonaorientale.sh` per ridurre warning legacy non azionabili e mantenere fallimenti solo su regressioni operative.

## Test e audit V426

- Aggiunto `tools/audit-mobile-final-checklist-v426.mjs`.
- L'audit verifica runtime V426, footer/cache-buster V426, marker `ZonaOrientaleMobileChecklistV426`, scala mobile canonica, presenza audit V407-V425, docs consolidati e assenza della cartella `sezioni/`.
- Reso `tools/audit-mobile-scale-consolidation-v425.mjs` compatibile con versioni successive.
- Aggiornato `tools/check-zonaorientale.sh` per includere il gate V426.

Comandi consigliati:

```bash
cd static/zonaorientale
node --check assets/app.js
node tools/audit-mobile-final-checklist-v426.mjs
bash tools/check-zonaorientale.sh
```

---

# Test, audit e regressioni

## Test e audit V424

- Aggiunto `tools/audit-mobile-typography-residue-v424.mjs`.
- L'audit verifica runtime V424, cache-buster/footer, marker runtime V424 e copertura CSS per News, Competizioni, Honor, Clubs/Rose e Fantamercato.
- Aggiornato `tools/check-zonaorientale.sh` per includere il gate V424.
- Reso `tools/audit-mobile-typography-global-v423.mjs` compatibile con versioni successive, mantenendo la protezione V423.

Comandi consigliati:

```bash
cd static/zonaorientale
node --check assets/app.js
node tools/audit-mobile-typography-residue-v424.mjs
bash tools/check-zonaorientale.sh
```

---


## Test e audit V423

- Aggiunto `tools/audit-mobile-typography-global-v423.mjs`.
- L'audit verifica runtime V423, cache-buster/footer, blocco CSS V423, copertura di Confronta, Statistiche e tabelle Rosa.
- Aggiornato `tools/check-zonaorientale.sh` per includere il gate V423.
- Reso `tools/audit-mobile-scale-archive-v422.mjs` compatibile con versioni successive, mantenendo la protezione Archivio.

---


## Audit V422 - scala mobile estesa e Archivio

Nuovo controllo: `static/zonaorientale/tools/audit-mobile-scale-archive-v422.mjs`.

Verifica:

- runtime, footer e cache-buster V422;
- marker runtime `ZonaOrientaleArchiveMobileTypographyV422`;
- timeline Archivio alimentata dagli stessi 4 comunicati visibili della dashboard;
- refresh del renderer Archivio dopo caricamento live news;
- assenza della card duplicata `Albo della stagione` nel renderer live;
- griglia mobile `Squadre della stagione` a 2 colonne;
- preservazione della scala mobile `0.78/0.66/0.62/0.73rem`;
- assenza di pagine standalone reintrodotte.

Comandi consigliati:

```bash
cd static/zonaorientale
node --check assets/app.js
node --check assets/js/refactor/live-data-archive-v209.js
node tools/audit-mobile-scale-archive-v422.mjs
bash tools/check-zonaorientale.sh
```

---


## Audit V421 - tipografia Archivio mobile e Timeline comunicati

Nuovo controllo: `static/zonaorientale/tools/audit-archive-mobile-typography-v421.mjs`.

Verifica:

- runtime, footer e cache-buster V421;
- presenza del marker `ZonaOrientaleArchiveMobileTypographyV421`;
- mantenimento della scala V420;
- copertura CSS per sotto-card Albo, Competizioni, Partite recenti e Timeline dati;
- presenza del merge comunicati `getSeasonArchiveMergedNewsV421`;
- assenza del vecchio uso esclusivo di `snapshot.news`;
- assenza di pagine standalone reintrodotte.

Comandi consigliati:

```bash
cd static/zonaorientale
node --check assets/app.js
node tools/audit-archive-mobile-typography-v421.mjs
bash tools/check-zonaorientale.sh
```

---

## Audit V420 - tipografia mobile globale

Nuovo controllo: `static/zonaorientale/tools/audit-mobile-typography-v420.mjs`.

Verifica:

- `DEPLOY_EXPECTED_VERSION_V181 = "420"`;
- footer e cache-buster V420 su `index.html`, `competition.html`, `player.html` e `assets/app.js`;
- marker runtime `ZonaOrientaleMobileTypographyV420`;
- presenza delle quattro variabili CSS della scala mobile: `0.78rem`, `0.66rem`, `0.62rem`, `0.73rem`;
- copertura di Archivio, Calciomercato, home mobile, Admin, Listone e La mia squadra;
- preservazione dei marker V418 e V419;
- assenza di ritorno alle pagine standalone.

Comandi consigliati:

```bash
cd static/zonaorientale
node --check assets/app.js
node tools/audit-mobile-typography-v420.mjs
bash tools/check-zonaorientale.sh
```

---


## Audit V418 - accessibilita mobile

Nuovo controllo: `static/zonaorientale/tools/audit-mobile-accessibility-v418.mjs`.

Verifica:

- `DEPLOY_EXPECTED_VERSION_V181 = "418"`;
- footer e cache-buster V418 su `index.html`, `competition.html`, `player.html` e `assets/app.js`;
- presenza del marker runtime `ZonaOrientaleMobileAccessibilityV418`;
- presenza del blocco CSS `V418 - Accessibilita mobile`;
- focus visibile, tap highlight, `touch-action: manipulation`, overflow controllato e `prefers-reduced-motion`;
- preservazione dei marker V415, V416 e V417;
- assenza di ritorno alle pagine standalone.

Comandi consigliati:

```bash
cd static/zonaorientale
node --check assets/app.js
node tools/audit-mobile-accessibility-v418.mjs
bash tools/check-zonaorientale.sh
```

---

## Audit V417 - pulizia CSS asset

Nuovo controllo: `static/zonaorientale/tools/audit-css-asset-cleanup-v417.mjs`.

Verifica:

- `DEPLOY_EXPECTED_VERSION_V181 = "417"`;
- footer e cache-buster V417 su `index.html`, `competition.html`, `player.html` e `assets/app.js`;
- assenza dei CSS legacy V291/V292 dal pacchetto;
- presenza degli alias CSS stabili ancora collegati;
- assenza di asset sperimentali `role-backgrounds-v405r2`;
- assenza di ritorno alle pagine standalone;
- esistenza dei riferimenti locali CSS/JS dichiarati da HTML e import locali di `assets/app.js`;
- preservazione dei guardrail V415 e V416.

Comandi consigliati:

```bash
cd static/zonaorientale
node --check assets/app.js
node tools/audit-css-asset-cleanup-v417.mjs
bash tools/check-zonaorientale.sh
```

---


## Audit V416 - admin mobile compatto

Nuovo controllo: `static/zonaorientale/tools/audit-admin-mobile-v416.mjs`.

Verifica:

- `DEPLOY_EXPECTED_VERSION_V181 = "416"`;
- footer e cache-buster V416 su `index.html`, `competition.html`, `player.html` e `assets/app.js`;
- presenza del blocco CSS `V416 - Admin mobile compatto`;
- protezione mobile di `form-grid`, `admin-list` e `result-admin-table-wrap` dentro `data-page="admin"`;
- preservazione V415 della home mobile e della tabella La mia squadra;
- assenza di pagine standalone e asset sperimentali `role-backgrounds-v405r2`.

---

## Audit V415 - home mobile e La mia squadra

Nuovo controllo: `static/zonaorientale/tools/audit-mobile-home-teamprofile-v415.mjs`.

Verifica:

- `DEPLOY_EXPECTED_VERSION_V181 = "415"`;
- footer e cache-buster V415 su `index.html`, `competition.html`, `player.html` e `assets/app.js`;
- presenza del helper `ensureMobileLatestNewsCardFirstV415`;
- presenza del helper `applyTeamProfileRosterListoneSkinV415`;
- presenza della classe `team-profile-listone-skin-v415`;
- sticky della prima colonna Listone/La mia squadra;
- colore ruolo applicato anche alla prima colonna per portieri, difensori, centrocampisti e attaccanti;
- preservazione V408, V413, V414 e assenza di refactor pagine standalone o asset sperimentali.

---

---

## Audit V414 - Area Squadra mobile compatta

Nuovo controllo: `static/zonaorientale/tools/audit-teamarea-mobile-v414.mjs`.

Verifica:

- `DEPLOY_EXPECTED_VERSION_V181 = "414"`;
- footer e cache-buster V414 su `index.html`, `competition.html`, `player.html` e `assets/app.js`;
- presenza del blocco CSS V414 in `assets/css/refactor/mobile-controls.css`;
- scope mobile per `teamarea`, `#teamAreaBody`, `user-actions-grid`, `form-grid` e dashboard presidente V369;
- preservazione dei form Area Squadra e degli ID DOM originali;
- preservazione V408, V410, V412, V413 e assenza di refactor pagine standalone o asset sperimentali.

---

## Audit V413 - filtri mobile compatti

Nuovo controllo: `static/zonaorientale/tools/audit-mobile-filters-v413.mjs`.

Verifica:

- `DEPLOY_EXPECTED_VERSION_V181 = "413"`;
- footer e cache-buster V413 su `index.html`, `competition.html`, `player.html` e `assets/app.js`;
- presenza del blocco CSS V413 in `assets/css/refactor/mobile-controls.css`;
- filtri Listone mobile in griglia per stato e ruolo;
- filtri Calciomercato mobile con layout adattivo e controlli compatti;
- preservazione V408, V410, V412 e assenza di refactor pagine standalone o asset sperimentali.

---

## Audit V412 - menu mobile Altro compatto

Nuovo controllo: `static/zonaorientale/tools/audit-mobile-more-menu-v412.mjs`.

Verifica:

- `DEPLOY_EXPECTED_VERSION_V181 = "412"`;
- footer e cache-buster V412 su `index.html`, `competition.html`, `player.html` e `assets/app.js`;
- presenza del blocco CSS V412 in `assets/css/refactor/mobile-controls.css`;
- menu Altro mobile con altezza controllata, scroll interno, header a larghezza piena e layout a due colonne;
- fallback a una colonna per schermi molto stretti;
- preservazione dei link mobile esistenti e assenza del refactor pagine standalone.



## Audit V411 - dashboard mobile compatta

Nuovo controllo: `static/zonaorientale/tools/audit-dashboard-mobile-v411.mjs`.

Verifica:

- `DEPLOY_EXPECTED_VERSION_V181 = "411"`;
- footer e cache-buster V411 su `index.html`, `competition.html`, `player.html` e `assets/app.js`;
- presenza del blocco CSS V411 in `assets/css/refactor/mobile-controls.css`;
- compattezza mobile dashboard su pannelli, metriche e comunicati;
- preservazione V407: 4 comunicati in home e immagini Calciomercato nascoste solo mobile;
- preservazione V408: skin Listone sulla tabella Rosa espansa;
- preservazione V409: blocco tabelle giocatori mobile compatte;
- preservazione V410: blocco Calciomercato mobile compatto;
- assenza di riferimenti al refactor pagine standalone.


## Audit V410 - Calciomercato mobile compatto

Nuovo controllo: `static/zonaorientale/tools/audit-calciomercato-mobile-v410.mjs`.

Verifica:

- `DEPLOY_EXPECTED_VERSION_V181 = "410"`;
- footer e cache-buster V410 su `index.html`, `competition.html`, `player.html` e `assets/app.js`;
- presenza del blocco CSS V410 in `assets/css/refactor/calciomercato.css`;
- preservazione V407: 4 comunicati in home e immagini Calciomercato nascoste solo mobile;
- preservazione V408: skin Listone sulla tabella Rosa espansa;
- preservazione V409: blocco tabelle giocatori mobile compatte;
- assenza di riferimenti al refactor pagine standalone.


---

## Audit V409 - tabelle giocatori mobile compatte

Nuovo controllo: `static/zonaorientale/tools/audit-mobile-player-tables-v409.mjs`.

Verifica:

- `DEPLOY_EXPECTED_VERSION_V181 = "409"`;
- footer e cache-buster V409 su `index.html`, `competition.html`, `player.html` e `assets/app.js`;
- presenza del blocco CSS V409 in `assets/css/refactor/mobile-controls.css`;
- compattezza solo per tabelle dense Listone/Rose, senza ridurre i tap-target globali;
- preservazione V407: 4 comunicati in home e immagini Calciomercato nascoste solo mobile;
- preservazione V408: skin Listone sulla tabella Rosa espansa;
- assenza di riferimenti al refactor pagine standalone.


---

## Audit V406 - baseline mobile pulita

Nuovo controllo: `static/zonaorientale/tools/audit-baseline-mobile-v406.mjs`.

Verifica:

- `DEPLOY_EXPECTED_VERSION_V181 = "406"`;
- footer V406 su `index.html`, `competition.html`, `player.html`;
- cache-buster coerenti a `?v=406`;
- asset sperimentali `role-backgrounds-v405r2.css/js` non collegati;
- colori ruolo consolidati nel runtime canonico;
- assenza di observer duplicato per i colori ruolo;
- presenza delle micro-regole mobile conservative;
- nessun ritorno al refactor pagine standalone.


Contiene smoke test, QA manuali, audit automatici, regression matrix e gate di verifica.

> Documento generato da accorpamento per categoria. I contenuti originali sono riportati integralmente sotto il rispettivo percorso originale.

File originali accorpati: **76**.

## Indice dei file originali in questa categoria

- `audit/AUDIT_CODICE_260528_V262.md`
- `audit/AUDIT_COMPETIZIONI_V267.md`
- `audit/AUDIT_FILE_E_LEGACY_V272.md`
- `audit/AUDIT_MOBILE_COMPLETO_V284.md`
- `audit/AUDIT_MOBILE_LIGHT_CONTRAST_V280.md`
- `audit/AUDIT_MOBILE_LIGHT_CONTRAST_V281.md`
- `audit/DARK_MODE_ROSE_MOBILE_V289.md`
- `audit/FIX_MOBILE_MIRATI_V285.md`
- `audit/FIX_PRIMA_COLONNA_MOBILE_LIGHT_V286.md`
- `audit/FIX_ROSE_MOBILE_LIGHT_V288.md`
- `audit/JS_LEGACY_CLEANUP_MATRIX_V344.md`
- `audit/LEGACY_DEPENDENCIES_MATRIX_V342.md`
- `audit/MANUAL_QA_INFO_MATRIX_V360.md`
- `audit/MANUAL_QA_PANEL_MATRIX_V357.md`
- `audit/MANUAL_QA_PANEL_MATRIX_V358.md`
- `audit/MANUAL_QA_STABILITY_MATRIX_V363.md`
- `audit/MANUAL_QA_TRACKER_MATRIX_V356.md`
- `audit/MINOR_LEGACY_CANDIDATES_V346.md`
- `audit/MOBILE_HOTFIX_CLEANUP_MATRIX_V352.md`
- `audit/MOBILE_REVIEW_FINALE_V304.md`
- `audit/PRESIDENT_DASHBOARD_MATRIX_V369.md`
- `audit/PRESIDENT_NOTIFICATION_CENTER_MATRIX_V370.md`
- `audit/PROTECTED_REGRESSION_MATRIX_V367.md`
- `audit/PULIZIA_ASSET_V265.md`
- `audit/REFACTOR_CLEANUP_CONSOLIDATION_MATRIX_V354.md`
- `audit/REGRESSION_SMOKE_MATRIX_V355.md`
- `audit/RIFINITURA_CONTROLLI_MOBILE_V287.md`
- `audit/SHARED_HELPER_LEGACY_CLEANUP_MATRIX_V345.md`
- `audit/STABILIZZAZIONE_PROTETTA_MATRIX_V365.md`
- `audit/THEME_COMPETITIONS_AUDIT_MATRIX_V353.md`
- `audit/TRADE_DOMAIN_HARDENING_MATRIX_V366.md`
- `audit/TRADE_SIMULATOR_CLEANUP_MATRIX_V347.md`
- `audit/TRADE_SIMULATOR_DEV_AUDIT_MATRIX_V348.md`
- `audit/TRADE_SIMULATOR_DEV_CLEANUP_MATRIX_V350.md`
- `audit/TRADE_SIMULATOR_LOCAL_ACTIONS_MATRIX_V349.md`
- `audit/TRADE_SIMULATOR_PANEL_MATRIX_V361.md`
- `audit/TRADE_SIMULATOR_TARGET_MATRIX_V362.md`
- `audit/VERIFICA_FUNZIONALITA_V272.md`
- `refactor/APP_JS_AUDIT_V293.md`
- `refactor/ASSET_IMPORT_AUDIT_V298.md`
- `refactor/AUDIT_STYLES_APP_V290.md`
- `refactor/CSS_AUDIT_V300.md`
- `refactor/LEGACY_DEPENDENCIES_AUDIT_V342.md`
- `refactor/MANUAL_QA_INFO_V360.md`
- `refactor/MANUAL_QA_PANEL_V357.md`
- `refactor/MANUAL_QA_PANEL_V358.md`
- `refactor/MANUAL_QA_STABILITY_V363.md`
- `refactor/MANUAL_QA_TRACKER_V356.md`
- `refactor/MINOR_LEGACY_AUDIT_V346.md`
- `refactor/REGRESSION_SMOKE_SUITE_V355.md`
- `refactor/THEME_COMPETITIONS_AUDIT_V353.md`
- `refactor/TRADE_SIMULATOR_DEV_AUDIT_V348.md`
- `REGRESSION_TESTS.md`
- `release/RELEASE_V330_TMW_TILE_TESTUALE.md`
- `release/RELEASE_V342_LEGACY_DEPENDENCIES_AUDIT.md`
- `release/RELEASE_V346_MINOR_LEGACY_AUDIT.md`
- `release/RELEASE_V348_TRADE_SIMULATOR_DEV_AUDIT.md`
- `release/RELEASE_V353_THEME_COMPETITIONS_AUDIT.md`
- `release/RELEASE_V355_REGRESSION_SMOKE_SUITE.md`
- `release/RELEASE_V356_MANUAL_QA_TRACKER.md`
- `release/RELEASE_V357_MANUAL_QA_PANEL.md`
- `release/RELEASE_V358_MANUAL_QA_PANEL.md`
- `release/RELEASE_V360_MANUAL_QA_INFO.md`
- `release/RELEASE_V363_MANUAL_QA_STABILITY.md`
- `release/RELEASE_V367_SMOKE_TEST_PROTETTI.md`
- `test/MANUAL_QA_INFO_INTERFACCIA_V360.md`
- `test/MANUAL_QA_INTERFACCIA_V357.md`
- `test/MANUAL_QA_INTERFACCIA_V358.md`
- `test/MANUAL_QA_STABILITY_INTERFACCIA_V363.md`
- `test/MANUAL_QA_TRACKER_COMANDI_V356.md`
- `test/PRESIDENT_DASHBOARD_V369.md`
- `test/PRESIDENT_NOTIFICATION_CENTER_V370.md`
- `test/SMOKE_TEST_AUTOMATICI_V367.md`
- `test/TEST_MANUALE_COMPLETO_V355.md`
- `test/TRADE_SIMULATOR_PANEL_INTERFACCIA_V361.md`
- `test/TRADE_SIMULATOR_TARGET_INTERFACCIA_V362.md`

---

## 1. `audit/AUDIT_CODICE_260528_V262.md`

- Percorso originale: `audit/AUDIT_CODICE_260528_V262.md`
- Dimensione originale: 4703 byte
- SHA-256: `19efa482fa1aefea0b5b302afff615d17afffddd9917caf9948bab266d7e161b`

````markdown
# Audit codice ZonaOrientale - V262

Documento creato sul branch `refactor/260528-zonaorientale-next` dopo la V261.

Obiettivo: fotografare lo stato del codice e indicare pulizie/refactor utili senza perdere funzionalita'. Questo documento non sostituisce `FUNZIONALITA'.md` e non lo modifica.

## Stato tecnico sintetico

Baseline analizzata: codice e documentazione allegati dopo V261.

Risultati principali:

- `assets/app.js`: circa 21.251 righe.
- `assets/styles.css`: circa 13.678 righe.
- JS principale sintatticamente valido con `node --check assets/app.js`.
- JSON pubblici validi: 33 file controllati.
- La funzionalita' V261 `Svincola Giocatori` e' presente in `Dashboard Presidente` e usa EmailJS senza scrivere su Firebase.

## Pulizie sicure individuate

### 1. File macOS da rimuovere dalla repo

Sono presenti file/metadati non necessari:

```text
.DS_Store
assets/.DS_Store
assets/css/.DS_Store
assets/js/.DS_Store
assets/snapshots/.DS_Store
assets/competitions/.DS_Store
__MACOSX/
```

V262 aggiunge `static/zonaorientale/.gitignore` per prevenirne il ritorno.

### 2. Simulatore trattative duplicato

Sono presenti due copie identiche del simulatore V255:

```text
assets/js/dev/trade-notification-simulator-v255.js
assets/js/trade-notification-simulator-v255.js
```

La copia attiva e importata da `app.js` e':

```text
assets/js/dev/trade-notification-simulator-v255.js
```

La copia nella root `assets/js/trade-notification-simulator-v255.js` e' un duplicato non importato ed e' candidata a rimozione.

### 3. Simulatore V254 non piu' importato

```text
assets/js/dev/trade-notification-simulator-v254.js
```

Non risulta importato. V255 espone comunque l'alias:

```js
window.ZonaOrientaleTradeSimulatorV254
```

quindi il file V254 e' candidato a rimozione controllata.

### 4. CSS mobile hotfix V166/V167

```text
assets/css/mobile-hotfix-v166.css
assets/css/mobile-hotfix-v167.css
```

Non risultano linkati dagli HTML. Le correzioni sono gia' inglobate in:

```text
assets/css/mobile-suite-v168.css
```

Sono candidati a rimozione, previa verifica mobile.

## File da NON rimuovere senza verifica ulteriore

### `assets/js/refactor/admin-publication-workflow-v213.js`

Modulo non importato direttamente, ma collegato storicamente al workflow pubblicazione Admin. La funzionalita' oggi vive inline in `app.js` ed e' stata consolidata in V251. Prima di rimuovere questo file conviene archiviare una nota o confermare che non serva come riferimento.

### `assets/js/domain/competitions.js`

Non risulta importato dalla baseline analizzata, ma riguarda un dominio centrale. Va verificato prima di qualsiasi cancellazione.

### Fallback inline `Admin -> Richieste presidenti`

Dopo V253 esiste il modulo:

```text
assets/js/admin/team-requests-panel-v253.js
```

Il vecchio blocco inline V249 resta come fallback intenzionale. Va rimosso solo dopo un ciclo completo di test Admin.

## Refactor consigliati successivi

1. **V263 - Pulizia fisica file sicuri**
   - Rimuovere `.DS_Store`, `__MACOSX`, duplicato simulatore V255 root, simulatore V254 non importato, CSS hotfix V166/V167 se test mobile ok.

2. **V264 - Consolidare Dashboard Presidente**
   - Estrarre i tre flussi comunicati in moduli separati:
     - comunicato squadra;
     - comunicato avvenuto scambio;
     - svincola giocatori.

3. **V265 - Storico svincoli opzionale**
   - Valutare se salvare in Firebase uno storico delle informative svincolo inviate, oltre alla mail.

4. **V266 - Ridurre fallback legacy**
   - Dopo test, eliminare fallback inline V249 e vecchi handler V50/V79 ormai neutralizzati.

5. **V267 - Audit competizioni**
   - Verificare `domain/competitions.js` e decidere se riattivarlo, fonderlo in app o rimuoverlo.

## Comandi di pulizia consigliati per V263

Da eseguire solo quando si decide di fare la pulizia fisica:

```bash
git rm --ignore-unmatch static/zonaorientale/assets/js/trade-notification-simulator-v255.js
git rm --ignore-unmatch static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v166.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v167.css
find static/zonaorientale -name ".DS_Store" -delete
rm -rf static/zonaorientale/__MACOSX __MACOSX
```

Poi verificare:

```bash
node --check static/zonaorientale/assets/app.js
```

## Nota funzionale

Dall'audit non emerge perdita evidente di funzionalita' rispetto alle ultime modifiche. Le aree piu' delicate restano:

- comunicati presidente e flussi EmailJS;
- `Admin -> Richieste presidenti`;
- notifiche trattative multi-dispositivo;
- anteprime WhatsApp news/home;
- nuova informativa `Svincola Giocatori`.
````

---

## 2. `audit/AUDIT_COMPETIZIONI_V267.md`

- Percorso originale: `audit/AUDIT_COMPETIZIONI_V267.md`
- Dimensione originale: 2545 byte
- SHA-256: `85238f534b5d1ab1a7b16c95ed99055c7f60a5975975cbcfc7486acfd25c1fc6`

````markdown
# Audit competizioni - V267

Documento creato per verificare la sezione **Competizioni** prima di qualsiasi pulizia o refactor.

## Obiettivo

Evitare di perdere funzionalita collegate a competizioni, calendari, risultati, classifiche e archivio. Questa versione non rimuove codice e non modifica il comportamento runtime.

## Area analizzata

File sospetto da verificare:

```text
static/zonaorientale/assets/js/domain/competitions.js
```

Nel codice principale sono presenti funzioni inline analoghe:

```text
getCompetitionTypeOrderV52
compareCompetitionsForPublicDisplayV52
getSeasonCompetitionsForPublicDisplayV52
```

Queste funzioni inline sono usate in piu punti di `assets/app.js` per render pubblici, dashboard, archivio e viste correlate. Il modulo `domain/competitions.js` esporta helper simili, ma nella baseline corrente non risulta importato dal bootstrap principale di `app.js`.

## Valutazione

Il modulo `assets/js/domain/competitions.js` e' probabilmente legacy o preparatorio, ma **non deve essere eliminato subito**. Le competizioni sono una sezione critica e collegata a diverse aree del sito.

## Funzionalita da proteggere

Prima di ogni rimozione/refactor, verificare:

```text
Dashboard pubblica -> riepilogo competizioni
Sezione Competizioni
Pulsanti e link verso competition.html
competition.html -> calendario, risultati, classifiche
Archivio stagioni -> competizioni storiche
Admin -> gestione competizioni
Admin -> import/aggiornamento competizioni
Albo/Statistiche collegate alle competizioni
Mobile -> card/blocchi competizioni
```

## Esito V267

```text
Nessuna funzionalita rimossa.
Nessun file competizioni eliminato.
Aggiunta diagnostica window.ZonaOrientaleCompetitionsAuditV267.
Aggiornata la guida per un eventuale nuovo assistente AI.
```

## Diagnostica runtime

Da console browser:

```js
window.ZonaOrientaleCompetitionsAuditV267
```

Deve indicare:

```text
behaviorChanged: false
legacyModuleUnderReview: assets/js/domain/competitions.js
```

## Raccomandazione

La prossima modifica non dovrebbe essere la rimozione diretta del modulo, ma un test mirato:

```text
1. Aprire Dashboard pubblica.
2. Aprire Competizioni.
3. Aprire una competizione da competition.html.
4. Verificare calendario/classifica/risultati.
5. Verificare archivio stagioni.
6. Verificare Admin -> Competizioni.
```

Solo dopo questi test si puo decidere se:

```text
A) eliminare domain/competitions.js come legacy;
B) riattivarlo e usarlo come modulo canonico;
C) lasciarlo temporaneamente come file legacy documentato.
```
````

---

## 3. `audit/AUDIT_FILE_E_LEGACY_V272.md`

- Percorso originale: `audit/AUDIT_FILE_E_LEGACY_V272.md`
- Dimensione originale: 2143 byte
- SHA-256: `74fd8421e1a0c23c368578dddc1a9a3cfd364a18a9278bc531acf0f0930bf105`

````markdown
# Audit file e legacy V272

Questo documento organizza i file sospetti/legacy e indica cosa fare senza rischiare perdita funzionalita.

## File da mantenere per ora

### `assets/js/domain/competitions.js`

Stato: sotto audit.  
Motivo: competizioni, classifiche e calendario sono funzionalita centrali. Il file puo' essere parzialmente sostituito da logiche inline, ma non va rimosso senza test mirato su:

- `#competitions`
- `competition.html`
- Archivio competizioni
- Admin -> Competizioni
- Albo/Statistiche collegate

### `assets/js/refactor/admin-publication-workflow-v213.js`

Stato: legacy/scollegato probabile.  
Motivo: il workflow pubblicazione attivo e' inline in `app.js`, ma il modulo esterno va rimosso solo dopo conferma che non sia usato da import dinamici o vecchi flussi.

### `news.html`, `comunicati/*.html`, `tools/generate-news-share-pages.mjs`

Stato: compatibilita legacy.  
Motivo: il flusso moderno delle preview e' `/zonaorientale/share/news/<id>` via Netlify Function, ma i file statici possono ancora servire per link vecchi.

## File candidati a pulizia sicura se ancora presenti

- `assets/js/trade-notification-simulator-v255.js` duplicato non canonico.
- `assets/js/dev/trade-notification-simulator-v254.js` sostituito da V255 con alias V254.
- `assets/css/mobile-hotfix-v166.css` e `mobile-hotfix-v167.css`, contenuti inglobati in `mobile-suite-v168.css`.
- `.DS_Store`, `__MACOSX`, `._*`.

Prima di rimuovere, verificare:

```bash
git status
ls static/zonaorientale/assets/js/dev/trade-notification-simulator-v255.js
```

La posizione canonica del simulatore e':

```text
static/zonaorientale/assets/js/dev/trade-notification-simulator-v255.js
```

## Organizzazione documenti consigliata

La documentazione corrente resta compatibile nella cartella principale, ma i nuovi documenti V272 sono organizzati in cartelle:

```text
docs/zonaorientale/handoff/
docs/zonaorientale/audit/
docs/zonaorientale/pianificazione/
docs/zonaorientale/release/
```

Non spostare automaticamente i documenti storici finche' non si decide una migrazione completa, per evitare riferimenti rotti nei messaggi/guide precedenti.
````

---

## 4. `audit/AUDIT_MOBILE_COMPLETO_V284.md`

- Percorso originale: `audit/AUDIT_MOBILE_COMPLETO_V284.md`
- Dimensione originale: 5436 byte
- SHA-256: `dd616300a13ffc1a8fe1e9f651e5b2c4b0983e907619b85d70d38758387f66ad`

````markdown
# V284 - Audit mobile completo

## Scopo

V284 introduce un audit operativo completo dell'esperienza mobile di ZonaOrientale.

La release non corregge ancora layout o CSS: fotografa le aree da verificare, definisce una checklist coerente e prepara il lavoro per i prossimi interventi UI mirati.

Non modifica Firebase, EmailJS, dati JSON o logiche funzionali.

## Stato versione

```text
Versione runtime: V284 audit mobile completo
Diagnostica: window.ZonaOrientaleMobileAuditV284
```

## Viewport da usare nei test

Testare almeno:

```text
390 x 844  - smartphone compatto
430 x 932  - smartphone grande
768 x 1024 - tablet verticale
```

Quando possibile, ripetere il controllo anche su un dispositivo reale.

## Modalita tema

Per ogni sezione controllare:

- tema Light;
- tema Dark;
- passaggio Light -> Dark -> Light senza refresh;
- contrasto di testi, badge, input e tabelle;
- leggibilita quando il contenuto va a capo su due o piu righe.

## Aree da verificare

### 1. Home e navigazione

Controllare:

- header e pulsante account;
- menu mobile e bottom navigation;
- menu `Altro`;
- card riepilogo stagione;
- comunicati recenti;
- scorciatoie rapide;
- pulsante globale `Su`.

Rischi noti:

- testo secondario troppo chiaro in tema Light;
- badge piccoli poco leggibili;
- bottom menu troppo fitto su smartphone stretti.

### 2. News e comunicati

Controllare:

- lista comunicati;
- card comunicato lunga;
- link WhatsApp;
- apertura da hash diretto `#news-...`;
- leggibilita di titolo, data, topic e testo.

Rischi noti:

- metadati/tag poco contrastati;
- spaziatura insufficiente tra azioni su schermi stretti.

### 3. Listone

Controllare:

- filtri ruolo/stato/modifiche;
- ricerca;
- `Mostra usciti storici`;
- pulsante `Esporta modifiche CSV`;
- colonna `Modifica`;
- tabella scrollabile;
- prima colonna sticky;
- righe `Nuovo`, `Uscito`, aumenti e diminuzioni.

Rischi noti:

- troppa densita verticale;
- colonne tecniche difficili da leggere;
- badge `Modifica` lunghi su una riga;
- input e select troppo vicini.

Nota: la sezione pubblica `Storico listoni` resta nascosta dalla UI dopo V280, ma le logiche di confronto interne vengono preservate per `Modifica`, filtri ed export.

### 4. Competizioni

Controllare:

- lista competizioni;
- card competizione;
- calendario;
- risultati;
- classifica campionato completa;
- pagina `competition.html`;
- tabelle con colonne POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT.

Rischi noti:

- classifica troppo larga;
- celle numeriche poco distanziate;
- prima colonna/sticky e intestazioni da verificare in Light.

### 5. Archivio

Controllare:

- selettore stagione;
- squadre storiche;
- saldi FM;
- competizioni storiche;
- rose e movimenti storici se disponibili.

Rischi noti:

- card dense;
- testo secondario e valori `-` poco evidenti;
- pulsanti stagione troppo piccoli.

### 6. Statistiche

Controllare:

- club piu vincenti;
- podi campionato;
- ultimi titoli assegnati;
- presidenti piu vincenti;
- ranking storici.

Rischi noti:

- card statistiche molto compatte;
- badge/etichette poco leggibili;
- tabelle lunghe in sezioni storiche.

### 7. Confronta

Controllare:

- selezione squadre;
- card confronto;
- valori aggregati;
- storico risultati;
- comportamento con una sola squadra selezionata o dati incompleti.

Rischi noti:

- select e pulsanti troppo ravvicinati;
- colori Light simili tra sfondo e testo muted.

### 8. Dashboard Presidente

Controllare con account presidente approvato:

- header `Pres. Cognome`;
- badge trattative;
- riepilogo squadra;
- azioni rapide mobile;
- comunicato squadra;
- comunicato avvenuto scambio;
- svincola giocatori;
- trattative inviate/ricevute;
- fantamercato presidente.

Rischi noti:

- sezioni lunghe con molti pulsanti;
- textarea/input da verificare in Light;
- badge notifiche da verificare su header e card.

### 9. Admin

Controllare con account admin:

- Accetta utenti;
- Richieste presidenti;
- Comunicati;
- Generatore comunicati;
- Diagnostica dati;
- Converti listone Excel;
- Competizioni;
- Snapshot pubblici;
- Procedura guidata pubblicazione.

Rischi noti:

- molte tabelle e form complessi;
- bottoni secondari poco leggibili;
- pannelli diagnostica con stati colorati da verificare in Light.

## Classificazione problemi

Durante i test segnare ogni problema come:

```text
Critico  - testo illeggibile, azione non cliccabile, layout rotto
Medio    - leggibilita difficile, tabella scomoda, spaziatura problematica
Minore   - solo estetica o rifinitura
```

Per ogni problema annotare:

```text
Sezione:
Tema:
Viewport/dispositivo:
Descrizione:
Screenshot, se disponibile:
Priorita:
```

## Fix consigliati dopo audit

Intervenire a blocchi piccoli, per esempio:

1. testi e badge Light;
2. tabelle mobile;
3. form e input;
4. bottom navigation e menu mobile;
5. dashboard presidente;
6. admin.

Evitare un'unica patch CSS troppo ampia.

## Test automatici da eseguire comunque

```bash
static/zonaorientale/tools/check-zonaorientale.sh
```

Poi test manuale locale:

```bash
cd static/zonaorientale
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

## Esito V284

V284 e' un audit operativo e una base di lavoro. Le correzioni UI successive dovranno essere versionate in release dedicate, per esempio:

```text
V285 - fix tabelle mobile
V286 - fix form e input mobile
V287 - fix dashboard presidente mobile
```
````

---

## 5. `audit/AUDIT_MOBILE_LIGHT_CONTRAST_V280.md`

- Percorso originale: `audit/AUDIT_MOBILE_LIGHT_CONTRAST_V280.md`
- Dimensione originale: 2549 byte
- SHA-256: `2d4cc165fcabb2a855f6c9237d2555c54e6a2d99f5a521e9489ea4fe72f62298`

````markdown
# Audit V280 - Leggibilita mobile in modalita Light

## Scopo

Primo controllo statico sulla leggibilita della UI mobile in tema Light, richiesto dopo la semplificazione del Listone.

## Esito sintetico

Il tema Light ha gia' diverse correzioni per tabelle e intestazioni sticky, ma il CSS contiene ancora aree a rischio contrasto, soprattutto dove colori chiari nati per il tema scuro vengono usati su sfondi chiari o semitrasparenti.

## Aree a rischio individuate

### 1. Testo muted su sfondi grigio chiaro

Vari elementi usano `var(--muted)` in Light, pari a `#64748b`, su sfondi come `#e5e7eb`, `#e2e8f0` o pannelli bianchi trasparenti.

Rischio: testo secondario poco leggibile in card, filtri e righe compatte, soprattutto da smartphone.

### 2. Colori hardcoded chiari ereditati dal tema dark

Sono presenti colori come:

```text
#94a3b8
#cbd5e1
#bbf7d0
#fbbf24
#fde68a
```

Questi colori funzionano su sfondo scuro, ma in Light possono diventare poco leggibili se non sovrascritti da regole dedicate.

### 3. Badge e stati

Badge tecnici o di stato con testo verde/ambra chiaro su background chiaro possono perdere contrasto. Alcuni badge sono gia' corretti in Light, altri vanno verificati se compaiono ancora in mobile/Admin.

### 4. Tabelle mobile

Le intestazioni tabella in Light sono forzate a sfondo scuro e testo chiaro, scelta corretta. Il rischio principale resta nel corpo tabella: celle dense, testo muted, bordi leggeri e righe trasparenti possono rendere difficile leggere dati piccoli.

### 5. CSS duplicato/stratificato

Esistono molte regole storiche V90/V97/V98 e fallback `body.is-mobile-ux`. La stratificazione non e' un bug immediato, ma rende facile introdurre conflitti se si interviene senza una patch mirata.

## Proposta per prossima uscita

Preparare una release dedicata, ad esempio `V281 - contrasto mobile Light`, con obiettivi limitati:

1. rafforzare il colore dei testi secondari in mobile Light;
2. correggere badge/stati con colori chiari non adatti a sfondi chiari;
3. aumentare contrasto del corpo tabella in Light;
4. non cambiare layout desktop;
5. non toccare Firebase, listoni JSON o logiche Admin.

## Test manuale consigliato

- Tema Light attivo.
- Smartphone reale o viewport mobile.
- Home.
- Listone.
- Competizioni.
- Archivio.
- Statistiche.
- Dashboard Presidente.
- Admin, almeno Diagnostica dati e Richieste presidenti.

Per ogni sezione controllare:

- titoli card;
- testi secondari/muted;
- badge;
- celle tabella;
- bottoni secondari;
- contrasto dopo scroll su intestazioni sticky.
````

---

## 6. `audit/AUDIT_MOBILE_LIGHT_CONTRAST_V281.md`

- Percorso originale: `audit/AUDIT_MOBILE_LIGHT_CONTRAST_V281.md`
- Dimensione originale: 1548 byte
- SHA-256: `6d4d7d6ba9f800e43f662dbbeb3451917ffae542c0107792b242f24e8ca1c320`

````markdown
# V281 - Contrasto mobile in modalita Light

## Scopo

Correzione mirata della leggibilita su smartphone quando il sito e' in tema Light.

## Intervento

- Rafforzati i testi secondari (`muted`, hint, note, meta e descrizioni) in Light/mobile.
- Resi piu' solidi sfondi e bordi di card, pannelli e controlli.
- Migliorato il contrasto del corpo tabella in Light/mobile.
- Mantenute intestazioni sticky scure con testo chiaro.
- Rafforzata la prima colonna sticky delle tabelle mobile per evitare testo scuro su fondo scuro o testo chiaro su fondo chiaro.
- Normalizzati badge/stati `ok`, `warning`, `danger`, `muted` con colori leggibili su sfondo chiaro.

## Cosa non cambia

- Nessuna modifica a Firebase.
- Nessuna modifica a EmailJS.
- Nessuna modifica ai dati JSON.
- Nessuna modifica alle logiche Listone V269-V278.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Diagnostica runtime

```js
window.ZonaOrientaleMobileLightContrastV281
```

Valori attesi:

```text
version: V281
scope: mobile-light-contrast
cssOnly: true
preservesListoneLogic: true
```

## Test manuale consigliato

Attivare tema Light e testare da smartphone reale o viewport mobile:

1. Home e dashboard pubblica.
2. Listone con filtro `Modifiche`, `Mostra usciti storici` ed export CSV.
3. Competizioni e pagina dettaglio competizione.
4. Archivio, Statistiche e Confronta.
5. Dashboard Presidente.
6. Admin -> Diagnostica dati e Richieste presidenti.

Controllare in particolare: testi secondari, badge, righe tabella, prima colonna sticky, bottoni secondari e menu mobile.
````

---

## 7. `audit/DARK_MODE_ROSE_MOBILE_V289.md`

- Percorso originale: `audit/DARK_MODE_ROSE_MOBILE_V289.md`
- Dimensione originale: 1599 byte
- SHA-256: `9c18c0ced50ca6e5292129b1508e7b3fc9ad3bfa9ab66652db626ae9e119508c`

````markdown
# V289 - Dark mode e rose mobile

## Scopo

V289 sospende temporaneamente la modalita Light, che verra' ripresa in una fase successiva, e corregge le tabelle Rosa da smartphone in modalita Dark.

## Modifiche

- Il bootstrap HTML imposta sempre `document.documentElement.dataset.theme = "dark"`.
- Il runtime `applyZonaOrientaleThemeV89` ignora richieste Light e forza il tema Dark.
- `localStorage.zonaOrientaleTheme` viene riallineato a `dark` quando disponibile.
- Il pulsante `#themeToggleBtn` viene nascosto e reso non focusable.
- La pagina standalone `player.html` applica la stessa regola.
- Le tabelle `.roster-player-table` e `.team-profile-roster-table` da mobile hanno righe piu' compatte e celle centrate verticalmente.
- La prima colonna sticky delle rose resta su sfondo scuro con testo chiaro, anche durante lo scroll orizzontale.

## Test consigliati

1. Impostare manualmente in console `localStorage.setItem("zonaOrientaleTheme", "light")`, ricaricare e verificare che il sito torni Dark.
2. Verificare che il pulsante cambio tema non sia visibile in header.
3. Mobile/Light salvato in precedenza: nessuna schermata deve restare in Light.
4. Mobile/Dark: `Rose`, pagina squadra e Dashboard Presidente devono mostrare righe Rosa compatte.
5. La prima colonna della tabella Rosa deve avere testo leggibile e centrato verticalmente.

## Diagnostica runtime

```js
window.ZonaOrientaleDarkModeOnlyV289
```

## Note

La sospensione Light e' intenzionale e reversibile. Le regole Light precedenti non vengono rimosse: restano nel CSS per una futura ripresa controllata del tema chiaro.
````

---

## 8. `audit/FIX_MOBILE_MIRATI_V285.md`

- Percorso originale: `audit/FIX_MOBILE_MIRATI_V285.md`
- Dimensione originale: 2483 byte
- SHA-256: `aacdc5540f838de40e32940010d77429a84493481faadddb513d8a543ab2556e`

````markdown
# V285 - Fix mirati mobile

## Scopo

V285 applica correzioni CSS conservative alla UI mobile, con focus su tema Light, tabelle scrollabili e controlli secondari.

La release non modifica dati, Firebase, EmailJS, formati JSON o logiche runtime. Le modifiche sono concentrate in `assets/styles.css`, con diagnostica runtime in `window.ZonaOrientaleMobileFixesV285`.

## Interventi applicati

- Rafforzato il contrasto dei testi secondari in tema Light mobile.
- Resi piu' solidi pannelli, card e blocchi che in Light potevano risultare troppo trasparenti.
- Migliorata la leggibilita' delle tabelle mobile con bordi, ombre interne e indicazione `Scorri`.
- Rafforzata la prima colonna sticky delle tabelle, inclusi link e testi secondari.
- Migliorati bottoni secondari, pill, chip, badge e campi focus in Light.
- Migliorata la leggibilita' della bottom navigation e del menu mobile in Light.

## Aree da testare

```text
Tema Light attivo
Home
Listone
Competizioni
Archivio
Statistiche
Confronta
Dashboard Presidente
Admin -> Diagnostica dati
Admin -> Richieste presidenti
```

## Viewport consigliati

```text
390x844  - smartphone stretto
430x932  - smartphone grande
768x1024 - tablet verticale
```

## Controlli specifici Listone

- `Storico listoni` non deve essere visibile, come da V280.
- `Modifiche` deve restare disponibile.
- `Mostra usciti storici` deve restare disponibile.
- `Esporta modifiche CSV` deve restare disponibile.
- La tabella deve rimanere scrollabile orizzontalmente.
- La prima colonna sticky deve essere leggibile in Light.

## Controlli specifici Competizioni

- Classifiche e calendari devono rimanere scrollabili.
- Le intestazioni sticky devono restare leggibili.
- Le celle non devono confondersi con lo sfondo.

## Controlli Admin/Presidente

- Dashboard Presidente leggibile in Light.
- Trattative e card operative leggibili.
- Admin -> Diagnostica dati leggibile.
- Admin -> Richieste presidenti leggibile.

## Diagnostica runtime

```js
window.ZonaOrientaleMobileFixesV285
```

Valori attesi:

```text
version: "V285"
cssOnly: true
preservesRuntime: true
```

## Note operative

- Non rimuovere le patch V281: V285 le rafforza, non le sostituisce.
- Non cancellare logiche Listone V269-V278: la UI Storico listoni resta nascosta, ma le logiche servono ancora a colonna `Modifica`, filtro `Modifiche`, usciti storici ed export CSV.
- Se emergono problemi grafici specifici, intervenire con fix piccoli e per area, evitando refactor CSS massivi.
````

---

## 9. `audit/FIX_PRIMA_COLONNA_MOBILE_LIGHT_V286.md`

- Percorso originale: `audit/FIX_PRIMA_COLONNA_MOBILE_LIGHT_V286.md`
- Dimensione originale: 1938 byte
- SHA-256: `5f9cf1ad0dccb115daa3b9e719a9a4d1223e6ca446fc1670ffda4a1830290ba9`

````markdown
# V286 - Fix prima colonna mobile Light

## Obiettivo

Correggere il problema segnalato in modalita Light da smartphone: nella prima colonna sticky del Listone e delle tabelle rose il nome del giocatore poteva apparire nero su sfondo scuro, rendendo la cella illeggibile.

## Causa probabile

Le patch mobile precedenti rafforzavano lo sfondo della prima colonna sticky con un colore scuro, ma alcune regole Light successive riportavano il colore del testo delle celle a `#0f172a`. Il risultato poteva essere testo scuro su sfondo scuro, soprattutto quando la tabella era in modalita tabellare mobile con prima colonna sticky.

## Intervento

Aggiunta una patch CSS finale e piu specifica per:

- `table.listone-table`;
- `table.free-agents-table`;
- `table.roster-season-table`;
- `table.roster-player-table`;
- `table.roster-main-table`;
- `table.roster-dialog-players-table`;
- wrapper listone e rose in modalita mobile.

La patch forza:

- sfondo scuro coerente sulla prima colonna sticky;
- testo bianco/chiaro su tutti i discendenti della prima cella;
- link e bottoni nome giocatore con colore chiaro e peso alto;
- intestazione della prima colonna con sfondo ancora piu scuro e testo chiaro.

## Ambito

Intervento solo CSS/UI.

Non modifica:

- Firebase;
- EmailJS;
- dati JSON;
- logiche Listone;
- logiche rose;
- `FUNZIONALITA'.md`.

## Test manuali consigliati

Attivare tema Light e verificare da smartphone reale o viewport mobile:

- Listone: prima colonna con nome giocatore leggibile durante scroll orizzontale;
- Listone: filtro `Modifiche`, `Mostra usciti storici` ed export CSV ancora funzionanti;
- Rose pubbliche: nomi giocatori leggibili nella prima colonna;
- Dashboard Presidente: tabelle rosa leggibili se disponibili;
- Dialog rosa/squadra: nomi giocatori leggibili nella prima colonna;
- Tema Dark: nessuna regressione evidente.

## Diagnostica runtime

```js
window.ZonaOrientaleStickyColumnContrastV286
```
````

---

## 10. `audit/FIX_ROSE_MOBILE_LIGHT_V288.md`

- Percorso originale: `audit/FIX_ROSE_MOBILE_LIGHT_V288.md`
- Dimensione originale: 1431 byte
- SHA-256: `72d8018aff6ab50682770adb497222a85f559e2d134f3026974f74856f1bdc37`

````markdown
# V288 - Fix rose mobile Light

## Scopo

V288 corregge un problema residuo segnalato nella pagina squadra/rose in modalita Light da smartphone: nella prima colonna sticky della tabella Rosa il nome giocatore poteva risultare nero su sfondo scuro.

## Intervento

Patch CSS finale e specifica per le tabelle:

```text
.team-profile-roster-table
.roster-sticky-table.team-profile-roster-table
.team-profile-roster-wrap table
```

La patch:

- forza testo chiaro su sfondo scuro nella prima colonna sticky;
- mantiene leggibili link e pulsanti dentro la prima colonna;
- aumenta leggermente la dimensione del nome giocatore;
- centra verticalmente il contenuto della riga;
- compatta padding e altezza delle righe rosa da mobile.

## Cosa non cambia

- Nessuna modifica a Firebase.
- Nessuna modifica a EmailJS.
- Nessuna modifica a dati JSON.
- Nessuna modifica a logiche Listone/Rose/Admin.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Test consigliati

Da smartphone reale o viewport mobile, con tema Light:

```text
Pagina squadra -> tabella Rosa
Prima colonna: nome giocatore chiaro e leggibile
Prima colonna: contenuto centrato verticalmente
Righe: altezza non eccessiva
Scroll orizzontale: prima colonna resta leggibile
Listone: controllo rapido prima colonna per assenza regressioni
Tema Dark: controllo rapido per assenza regressioni evidenti
```

## Diagnostica runtime

```js
window.ZonaOrientaleRosterMobileLightV288
```
````

---

## 11. `audit/JS_LEGACY_CLEANUP_MATRIX_V344.md`

- Percorso originale: `audit/JS_LEGACY_CLEANUP_MATRIX_V344.md`
- Dimensione originale: 1267 byte
- SHA-256: `702a328df816c2258eae5e935e557283447c1fe858a1b2ce3036fca37fb6d440`

````markdown
# Matrice audit JS legacy V344

| File | Stato V344 | Motivazione | Azione |
| --- | --- | --- | --- |
| `assets/js/calciomercato/calciomercato-players-v335.js` | Rimosso | Superato da `calciomercato-players-v340.js`; nessun import runtime diretto | `git rm` se presente nella repo locale |
| `assets/js/calciomercato/calciomercato-players-v337.js` | Rimosso | Superato da `calciomercato-players-v340.js`; nessun import runtime diretto | `git rm` se presente nella repo locale |
| `assets/js/calciomercato/calciomercato-players-v340.js` | Attivo | Matching corrente con punteggiatura, maiuscole/minuscole e disambiguazione | Preservare |
| `renderCalciomercatoPlayerTagsV335` in `app.js` | Attivo | Wrapper pubblico usato dal renderer card V338 | Non rinominare |
| `activateCalciomercatoPlayerTimelineFromHashV335` in `app.js` | Attivo | Compatibilita hash/modal timeline V336 | Non rinominare |
| `normalizeCalciomercatoPlayerMatchValueV337` in `app.js` | Attivo | Wrapper normalizzazione usato con helper V340 | Non rinominare |

## Tool di verifica

```bash
static/zonaorientale/tools/audit-js-legacy-v344.mjs
```

## Esito atteso

- V340 presente.
- V335/V337 non presenti come file.
- Nessun import V335/V337 in `app.js`.
- Wrapper compatibili ancora presenti.
````

---

## 12. `audit/LEGACY_DEPENDENCIES_MATRIX_V342.md`

- Percorso originale: `audit/LEGACY_DEPENDENCIES_MATRIX_V342.md`
- Dimensione originale: 5326 byte
- SHA-256: `b32b694126ee882bd81bed05b13889507050376d1aa81d00fa89f05bf891a88f`

````markdown
# Matrice candidati legacy V342

Data: 05/06/2026  
Origine: `node static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs --quiet`

## Esito sintetico

- Nessun riferimento locale mancante rilevato.
- Presenti candidati versionati superati e altri file non referenziati direttamente.
- Nessun file e' stato rimosso in V342.

## Candidati e rischio

| File | Motivo audit | Rischio | Prossima azione consigliata |
| --- | --- | --- | --- |
| `assets/css/mobile-hotfix-v166.css` | versione piu recente: `mobile-hotfix-v167.css` | Medio | verificare import HTML, regressioni mobile e storico prima di rimuovere |
| `assets/css/mobile-hotfix-v167.css` | non referenziato direttamente | Medio | verificare se realmente non piu collegato, poi eventuale rimozione isolata |
| `assets/css/refactor/mobile-controls-v291.css` | alias stabile `mobile-controls.css` | Medio | candidato per V343 se confermato da test mobile |
| `assets/css/refactor/mobile-controls-v292.css` | alias stabile `mobile-controls.css` | Medio | candidato per V343 se confermato da test mobile |
| `assets/css/refactor/rosters-tables-v291.css` | alias stabile `rosters-tables.css` | Medio | verificare Rose/Listone mobile prima di rimuovere |
| `assets/css/refactor/rosters-tables-v292.css` | alias stabile `rosters-tables.css` | Medio | verificare Rose/Listone mobile prima di rimuovere |
| `assets/css/refactor/theme-light-suspended-v292.css` | alias stabile `theme-light-suspended.css` | Basso/Medio | verificare tema Light e classi sospese prima di rimuovere |
| `assets/js/calciomercato/calciomercato-players-v335.js` | versione piu recente: `calciomercato-players-v340.js` | Medio/Alto | non rimuovere finche matching/tag/timeline non sono testati a fondo |
| `assets/js/calciomercato/calciomercato-players-v337.js` | versione piu recente: `calciomercato-players-v340.js` | Medio/Alto | non rimuovere insieme a V335; verificare import e fallback |
| `assets/js/dev/trade-notification-simulator-v254.js` | versione piu recente: `trade-notification-simulator-v255.js` | Medio | verificare Admin/dev simulator prima di rimuovere |
| `assets/js/refactor/admin-publication-workflow-v213.js` | non referenziato direttamente | Medio | verificare workflow Admin/pubblicazione e documentazione storica |
| `assets/js/trade-notification-simulator-v255.js` | non referenziato direttamente | Medio | attenzione: esiste anche `assets/js/dev/trade-notification-simulator-v255.js` |
| `assets/js/utils/shared-helpers-v294.js` | rimosso in V345 dopo audit dedicato | Risolto | non ripristinare; usare V295 + bridge V341 |

## Regola operativa

La prossima pulizia deve scegliere un solo gruppo, preferibilmente CSS refactor versionati vecchi, e produrre una release dedicata con test browser mobile/desktop. Non cancellare JS Calciomercato legacy nella stessa release dei CSS.

## Output audit sintetico

```text
OK: nessun riferimento locale mancante rilevato.

Candidati versionati superati:
- assets/css/mobile-hotfix-v166.css
- assets/css/mobile-hotfix-v167.css
- assets/css/refactor/mobile-controls-v291.css
- assets/css/refactor/mobile-controls-v292.css
- assets/css/refactor/rosters-tables-v291.css
- assets/css/refactor/rosters-tables-v292.css
- assets/css/refactor/theme-light-suspended-v292.css
- assets/js/calciomercato/calciomercato-players-v335.js
- assets/js/calciomercato/calciomercato-players-v337.js
- assets/js/dev/trade-notification-simulator-v254.js
- assets/js/refactor/admin-publication-workflow-v213.js
- assets/js/trade-notification-simulator-v255.js
- assets/js/utils/shared-helpers-v294.js
```

## Aggiornamento V344

I candidati `assets/js/calciomercato/calciomercato-players-v335.js` e `assets/js/calciomercato/calciomercato-players-v337.js` sono stati rimossi in V344 dopo verifica che il runtime importa direttamente `assets/js/calciomercato/calciomercato-players-v340.js`.

Restano volutamente in `assets/app.js` alcuni wrapper con suffisso V335/V337 per compatibilita runtime; non sono file da rimuovere e non vanno rinominati automaticamente.

## Aggiornamento V350

Il candidato `assets/js/dev/trade-notification-simulator-v254.js` e stato rimosso nella V350 dopo audit V348 e correzione azioni locali V349. Non va reintrodotto: usare `assets/js/dev/trade-notification-simulator-v255.js`.


## Aggiornamento V351

`assets/js/refactor/admin-publication-workflow-v213.js` verificato con audit dedicato. Risulta non importato direttamente; resta in review e non viene rimosso in V351.

## Aggiornamento V352

- `assets/css/mobile-hotfix-v166.css`: rimosso in V352 come file sciolto; regole preservate in `assets/css/mobile-suite-v168.css`.
- `assets/css/mobile-hotfix-v167.css`: rimosso in V352 come file sciolto; regole preservate in `assets/css/mobile-suite-v168.css`.
- Audit dedicato: `static/zonaorientale/tools/audit-mobile-hotfix-v352.mjs`.

## Aggiornamento V353

- `assets/css/refactor/theme-light-suspended.css`: audit completato. Resta conservato e non importato dagli HTML. Non rimosso in V353 perche utile come archivio/rollback della Light mode.
- `assets/js/domain/competitions.js`: audit completato. Resta conservato e non importato dal runtime corrente. Non rimosso in V353 perche l'area Competizioni richiede test manuale dedicato.
- Audit dedicato: `static/zonaorientale/tools/audit-theme-competitions-v353.mjs`.
````

---

## 13. `audit/MANUAL_QA_INFO_MATRIX_V360.md`

- Percorso originale: `audit/MANUAL_QA_INFO_MATRIX_V360.md`
- Dimensione originale: 623 byte
- SHA-256: `4fbb56ac8a88f83fe754292274ecb0fbb0fa2dcac7f10141435b037c475ef6d8`

````markdown
# Manual QA Info Matrix V360

| Area | Controllo | Cosa verifica l'audit |
| --- | --- | --- |
| Versione | `DEPLOY_EXPECTED_VERSION_V181 = 360` | Allineamento runtime |
| QA panel | `const version = 'V360'` | Versione interna pannello |
| UI | `details.manual-qa-card-v358__info` | Presenza della `i` informativa |
| Dati test | almeno 15 campi `info` | Ogni test storico ha una spiegazione |
| Export | colonna `Cosa controllare` | Riepilogo Markdown piu' chiaro |
| Sicurezza | admin-only invariato | Il pannello resta nascosto ai non admin |

Tool:

```bash
static/zonaorientale/tools/audit-manual-qa-info-v360.mjs
```
````

---

## 14. `audit/MANUAL_QA_PANEL_MATRIX_V357.md`

- Percorso originale: `audit/MANUAL_QA_PANEL_MATRIX_V357.md`
- Dimensione originale: 567 byte
- SHA-256: `a6b7f1af7aed0ffa388ed952092f566b33f9be76f00ef6e3139c2b5664fdc521`

```markdown
# Matrice Manual QA Panel V357

| Area | Esito | Note |
| --- | --- | --- |
| Visibilita solo Admin | OK | Gating con `state.isAdmin` |
| Persistenza locale | OK | `localStorage`, chiave V356 |
| Export | OK | Markdown nel pannello |
| Calciomercato | OK | Pulsanti di navigazione sezione |
| Listone | OK | Pulsanti di navigazione sezione |
| Admin Diagnostica | OK | Navigazione ad Admin |
| Trade simulator | OK | Invoca `ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()` |
| Firebase | OK | Nessuna nuova scrittura |
| Netlify | OK | Nessuna modifica |
```

---

## 15. `audit/MANUAL_QA_PANEL_MATRIX_V358.md`

- Percorso originale: `audit/MANUAL_QA_PANEL_MATRIX_V358.md`
- Dimensione originale: 530 byte
- SHA-256: `80f9d4bee84f836754006abe2762c2f92958513dbb7ee657019803b23364d58d`

```markdown
# Manual QA Panel Matrix V358

| Area | Rischio | Mitigazione |
| --- | --- | --- |
| UI Admin bottom panel | Basso | Visibile solo con `state.isAdmin` |
| localStorage QA | Basso | Chiave dedicata e nessuna scrittura remota |
| Navigazione test | Basso | Usa link/pagine esistenti |
| Simulatore trade | Basso | Usa simulatore locale V255/V349 |
| Auto-check | Basso | Controlla solo marker tecnici, non cambia dati core |

## Marker

- `window.ZonaOrientaleManualQaPanelV358`
- `runAutoChecks()`
- `markArea()`
- `copyExport()`
```

---

## 16. `audit/MANUAL_QA_STABILITY_MATRIX_V363.md`

- Percorso originale: `audit/MANUAL_QA_STABILITY_MATRIX_V363.md`
- Dimensione originale: 693 byte
- SHA-256: `2acffe137a08d5c68cc570f4582aaca1b62bb4cadc83a242dee2f72b92b31aa5`

```markdown
# Manual QA stability matrix V363

| Area | Controllo | Esito atteso |
| --- | --- | --- |
| Layout checklist | Box simulatore trade | Non sfora nelle schede affiancate |
| Select destinatario | Cambio squadra/presidente | Non si resetta dopo pochi secondi |
| Info test | Click sulla `i` | Resta aperta mentre si legge |
| Auto refresh | Pannello espanso con focus | Non ridisegna in modo distruttivo |
| Simulazione | Admin crea verso presidente | Riga salvata in localStorage |
| Verifica presidente | Login come destinatario | Badge/card visibili nello stesso browser |
| Azioni locali | Accetta/Rifiuta simulazione | Nessun errore Firebase |
| Dati reali | Trattative reali | Invariate |
```

---

## 17. `audit/MANUAL_QA_TRACKER_MATRIX_V356.md`

- Percorso originale: `audit/MANUAL_QA_TRACKER_MATRIX_V356.md`
- Dimensione originale: 841 byte
- SHA-256: `db571885d341963f2be7196ab5a6a648477abef4682bec75a489227b4a961081`

```markdown
# Manual QA tracker matrix V356

| Area | Check | Rischio | Mitigazione |
| --- | --- | --- | --- |
| Runtime | Marker `ZonaOrientaleManualQaTrackerV356` | Basso | Solo oggetto console, nessun binding UI automatico |
| Storage | `localStorage` | Basso | Chiave dedicata `zonaorientale.manualQa.v356` |
| Calciomercato | Check manuali feed/filtri/player modal | Basso | Nessuna modifica alla logica Calciomercato |
| Admin | Check diagnostica timestamp | Basso | Nessuna modifica al pannello Admin |
| Fantamercato | Check simulatore e flussi reali | Basso | Nessuna modifica a V255/V349 |
| Mobile | Check bottom nav/menu Altro | Basso | Nessuna modifica CSS/JS mobile |
| Documentazione | Handoff/FUNZIONALITAV356/test docs | Basso | `FUNZIONALITA'.md` non modificato |

Esito: V356 e una versione di supporto QA, non un cambio funzionale.
```

---

## 18. `audit/MINOR_LEGACY_CANDIDATES_V346.md`

- Percorso originale: `audit/MINOR_LEGACY_CANDIDATES_V346.md`
- Dimensione originale: 3249 byte
- SHA-256: `fe1a2d9454a141f0f62fce53af9225ba841be06233e57ff87a8aceaa5ba3df0a`

```markdown
# Matrice candidati legacy minori - V346

La V346 non rimuove file. Questa matrice serve a decidere le prossime rimozioni controllate, una release alla volta.

| Candidato | Evidenza | Rischio se rimosso subito | Azione consigliata |
| --- | --- | --- | --- |
| `assets/js/dev/trade-notification-simulator-v254.js` | versione precedente rispetto a `assets/js/dev/trade-notification-simulator-v255.js` | basso/medio: possibile uso manuale dev | verificare simulatori trade e poi eventuale V dedicata |
| `assets/js/trade-notification-simulator-v255.js` | duplicato top-level; runtime importa la copia in `assets/js/dev/` | basso/medio: possibile link storico non rilevato | grep completo + test Admin/Fantamercato prima di rimozione |
| `assets/js/refactor/admin-publication-workflow-v213.js` | non importato direttamente dagli entrypoint correnti | medio: area Admin/pubblicazione storica | non rimuovere senza test su workflow pubblicazione e comunicati |
| `assets/css/mobile-hotfix-v166.css` | non referenziato dagli HTML correnti | medio: hotfix storico mobile | valutare insieme a `mobile-hotfix-v167.css` in una sola V CSS |
| `assets/css/mobile-hotfix-v167.css` | non referenziato dagli HTML correnti | medio: hotfix storico mobile | test mobile light/dark prima di rimozione |
| `assets/css/refactor/theme-light-suspended.css` | non referenziato direttamente | medio: tema sospeso/rollback | lasciare finche non si decide policy tema light |
| `assets/js/domain/competitions.js` | non importato direttamente | medio: dominio competizioni/refactor futuri | verificare `competition.html`, orchestratori e storico release |

## Regola operativa

- Non cancellare piu di un gruppo alla volta.
- Ogni cleanup deve avere zip dedicato, test dedicato e documento release dedicato.
- Prima di cancellare: `grep`, audit asset, audit CSS, check globale e test browser.
- Preservare tutte le funzionalita arrivate all'ultimo merge su master.

## Aggiornamento V350

`assets/js/dev/trade-notification-simulator-v254.js` e stato rimosso in modo controllato nella V350. Il modulo attivo resta `assets/js/dev/trade-notification-simulator-v255.js`, che mantiene anche l'alias console `ZonaOrientaleTradeSimulatorV254`.


## Aggiornamento V351

- `assets/js/refactor/admin-publication-workflow-v213.js`: audit completato. Non importato dal runtime corrente, ma tenuto per prudenza storica. Non rimosso in V351.

## Aggiornamento V352

- `assets/css/mobile-hotfix-v166.css`: rimosso in V352 come file sciolto; regole preservate in `assets/css/mobile-suite-v168.css`.
- `assets/css/mobile-hotfix-v167.css`: rimosso in V352 come file sciolto; regole preservate in `assets/css/mobile-suite-v168.css`.
- Audit dedicato: `static/zonaorientale/tools/audit-mobile-hotfix-v352.mjs`.

## Aggiornamento V353

- `assets/css/refactor/theme-light-suspended.css`: audit completato. Resta conservato e non importato dagli HTML. Non rimosso in V353 perche utile come archivio/rollback della Light mode.
- `assets/js/domain/competitions.js`: audit completato. Resta conservato e non importato dal runtime corrente. Non rimosso in V353 perche l'area Competizioni richiede test manuale dedicato.
- Audit dedicato: `static/zonaorientale/tools/audit-theme-competitions-v353.mjs`.
```

---

## 19. `audit/MOBILE_HOTFIX_CLEANUP_MATRIX_V352.md`

- Percorso originale: `audit/MOBILE_HOTFIX_CLEANUP_MATRIX_V352.md`
- Dimensione originale: 1089 byte
- SHA-256: `9a5b7005e5c3d3a276d3051bef4fbaa94cde9fe3d9862c07d3f8c7ee904f0874`

```markdown
# MOBILE_HOTFIX_CLEANUP_MATRIX_V352

## Decisione

`mobile-hotfix-v166.css` e `mobile-hotfix-v167.css` sono stati rimossi come file sciolti perche non sono linkati dagli entrypoint HTML e risultano gia consolidati dentro `mobile-suite-v168.css`.

## Verifiche

| Elemento | Esito | Note |
| --- | --- | --- |
| `index.html` | OK | Linka `mobile-suite-v168.css?v=352`, non linka hotfix V166/V167. |
| `competition.html` | OK | Linka `mobile-suite-v168.css?v=352`, non linka hotfix V166/V167. |
| `player.html` | OK | Usa `mobile-chrome-v223.css?v=352` e refactor mobile, non hotfix V166/V167. |
| `mobile-suite-v168.css` | OK | Contiene sezioni commentate `mobile-hotfix-v166.css` e `mobile-hotfix-v167.css`. |
| `audit-mobile-hotfix-v352.mjs` | OK | Verifica rimozione file, presenza suite e assenza link HTML. |

## Rischio

Basso, perche il CSS effettivo resta nella suite consolidata V168.

## Aree da verificare manualmente

- Mobile bottom nav.
- Menu mobile `Altro`.
- Card Calciomercato mobile.
- Tabelle Rose/Listone mobile.
- Competition detail mobile.
- Scheda giocatore mobile.
```

---

## 20. `audit/MOBILE_REVIEW_FINALE_V304.md`

- Percorso originale: `audit/MOBILE_REVIEW_FINALE_V304.md`
- Dimensione originale: 3057 byte
- SHA-256: `63edac8b7229c7a35f5a49d7ee79b2d55d16b847f1b53bd7190f84c6e4fea080`

````markdown
# V304 - Mobile review finale e audit pre-Calciomercato

## Scopo

V304 chiude la fase di stabilizzazione mobile/refactor prima di iniziare la nuova funzionalita `Calcio mercato`.

Questa release non introduce nuove funzioni e non cambia dati: serve a fissare la checklist finale delle funzionalita da preservare e dei test minimi prima della fase successiva.

## Funzionalita a rischio da non perdere

Durante i prossimi overlay, in particolare per la sezione Calcio mercato, vanno preservate esplicitamente:

- Home pubblica e navigazione desktop/mobile.
- News e share WhatsApp dinamico via Netlify Function.
- Listone pubblico e Admin.
- Colonna `Modifica`, filtro `Modifiche`, usciti storici.
- Export CSV modifiche solo Admin.
- Rose pubbliche, pagina squadra e Dashboard Presidente.
- Trattative, comunicati presidente e svincoli.
- Admin: Diagnostica dati, Richieste presidenti, Converti listone Excel, snapshot e workflow pubblicazione.
- Competizioni, `competition.html`, Archivio, Statistiche e Confronta.
- `player.html`.
- Mobile bottom navigation, menu Altro e pulsante Su.
- Dark mode unico V289 con toggle Light nascosto.

## Test mobile finale consigliato

Viewport:

- 390x844 smartphone standard.
- 430x932 smartphone grande.
- 768x1024 tablet verticale.

Sezioni:

1. Home: navigazione, card, accessi rapidi, bottom nav.
2. Listone pubblico: filtri, ricerca, colonna `Modifica`, assenza export CSV.
3. Listone Admin: export CSV visibile e funzionante.
4. Pagina squadra -> Rosa: prima colonna sticky, righe compatte, nomi leggibili.
5. Dashboard Presidente: tabelle rosa, bottoni, form e notifiche.
6. Admin -> Diagnostica dati: righe V303 visibili e refresh senza errori.
7. Admin -> Richieste presidenti: aggiorna, approva/rifiuta visivamente integri.
8. Competizioni e `competition.html`: classifiche e scroll tabelle.
9. `player.html`: layout mobile e tema dark.
10. Bottom nav, menu Altro e pulsante Su.

## Criteri per iniziare Calcio mercato

La fase Calcio mercato puo iniziare quando:

- `static/zonaorientale/tools/check-zonaorientale.sh` passa.
- La review mobile sopra non segnala regressioni critiche.
- La Light mode resta sospesa, quindi la nuova sezione va progettata solo per Dark mode.
- La nuova feature viene introdotta in modo isolato, senza toccare Listone/Rose/Admin salvo necessita documentata.

## Indicazione tecnica per la prossima feature

La prima versione Calcio mercato dovrebbe essere statica/configurabile, senza scraping diretto dal browser:

- pagina/sezione pubblica `Calcio mercato`;
- dati da JSON statico o configurazione locale;
- card articolo con titolo, fonte, squadra, topic, immagine opzionale, link esterno;
- nessuna chiamata automatica a siti esterni nella prima versione;
- successiva evoluzione con Netlify Function solo dopo test e scelta fonti.

## Diagnostica

```js
window.ZonaOrientaleMobileFinalReviewV304
```

Valori attesi:

```js
window.ZonaOrientaleMobileFinalReviewV304.behaviorChange === false
window.ZonaOrientaleMobileFinalReviewV304.calciomercatoImplemented === false
```
````

---

## 21. `audit/PRESIDENT_DASHBOARD_MATRIX_V369.md`

- Percorso originale: `audit/PRESIDENT_DASHBOARD_MATRIX_V369.md`
- Dimensione originale: 747 byte
- SHA-256: `5c83b8e8219bda46d395a7fc1c5a61c26092d885b85d19f3365afe2661b09f41`

````markdown
# Matrix audit V369 - Dashboard Presidente protetta

## Controlli protettivi

| Area | Esito atteso |
| --- | --- |
| Versione runtime | `DEPLOY_EXPECTED_VERSION_V181 = 369` |
| Footer/cache-buster | HTML e import allineati a V369 |
| Area Presidente | Dashboard aggiunta sopra le sezioni esistenti |
| Trattative | Card e azioni Accetta/Rifiuta/Annulla preservate |
| Comunicati squadra | Form `teamNewsRequestForm` preservato |
| Admin V368 | Marker e pannello pre-deploy preservati |
| Smoke V367 | Marker preservato |
| Firebase | Nessuna nuova scrittura introdotta dalla dashboard |
| Documentazione protetta | `FUNZIONALITA'.md` invariato |

## Tool

Eseguire:

```bash
node static/zonaorientale/tools/audit-president-dashboard-v369.mjs
```
````

---

## 22. `audit/PRESIDENT_NOTIFICATION_CENTER_MATRIX_V370.md`

- Percorso originale: `audit/PRESIDENT_NOTIFICATION_CENTER_MATRIX_V370.md`
- Dimensione originale: 709 byte
- SHA-256: `be3e7383751d94e59aca67c7d352bfdf60a4d4d9eaf9779738616cb72ca24840`

```markdown
# Audit Matrix V370 - Centro notifiche presidente

## Controlli obbligatori

- `DEPLOY_EXPECTED_VERSION_V181 >= 370`.
- Footer e cache-buster allineati alla versione corrente.
- Marker `window.ZonaOrientalePresidentNotificationCenterV370` presente.
- Wrapper conservativo `renderUserAreaApprovedBeforeV370` presente.
- Dashboard Presidente V369 ancora presente.
- Dashboard Admin V368 ancora presente.
- Smoke test V367 ancora presente.
- Hardening trattative V366 ancora presente.
- Pulsanti Accetta/Rifiuta trattative ancora presenti.
- `FUNZIONALITA'.md` non richiesto/modificato.

## Esito atteso

`node static/zonaorientale/tools/audit-president-notification-center-v370.mjs` deve chiudere senza errori.
```

---

## 23. `audit/PROTECTED_REGRESSION_MATRIX_V367.md`

- Percorso originale: `audit/PROTECTED_REGRESSION_MATRIX_V367.md`
- Dimensione originale: 1573 byte
- SHA-256: `348d80209656249471aa28be603343ef40b9d9c9118ad56177f2545b1be8a1d9`

```markdown
# Matrice audit V367 - Protected regression

## Scopo

La matrice V367 definisce i controlli minimi anti-regressione da eseguire prima di una consegna.

## Controlli automatici

| Area | Controllo | Esito atteso |
| --- | --- | --- |
| Versione | `DEPLOY_EXPECTED_VERSION_V181` | `367` |
| HTML | footer/cache-buster | `V367` e `v=367` |
| Asset locali | link CSS/JS/JSON/manifest | file presenti |
| JS | `node --check` su asset JS | nessun errore sintattico |
| Import JS | import relativi | file esistenti |
| JSON | parse dei JSON in `assets` | JSON validi |
| Marker runtime | V358-V367 | presenti |
| Trade | simulatori local-only | marker preservati |
| Calciomercato | diagnostica player V359 | marker e modulo presenti |
| Docs | documenti V367 | presenti |
| Documento protetto | `FUNZIONALITA'.md` | presente e non modificato in questa release |

## File principali protetti

- `assets/app.js`
- `assets/js/market/transfer-market.js`
- `assets/js/dev/trade-notification-simulator-v255.js`
- `assets/js/calciomercato/calciomercato-players-v359.js`
- `assets/js/utils/shared-helper-bridge-v341.js`
- `assets/css/mobile-suite-v168.css`
- `assets/css/refactor/listone.css`
- `assets/css/refactor/calciomercato.css`
- `assets/competitions/manifest.json`
- `assets/calciomercato/links.json`
- `assets/calciomercato/archive/manifest.json`

## Note operative

Gli audit storici V358-V362 non devono richiedere una versione esatta ormai superata. Devono verificare che il runtime sia almeno pari alla release che proteggono e che i marker/funzioni siano ancora presenti.
```

---

## 24. `audit/PULIZIA_ASSET_V265.md`

- Percorso originale: `audit/PULIZIA_ASSET_V265.md`
- Dimensione originale: 2055 byte
- SHA-256: `342a7508bb69ff10a445b7c1a6e4190425a558f66cde342842e066ee5886edd1`

````markdown
# Pulizia asset V265

Documento operativo per la pulizia fisica dei file duplicati/inutilizzati sicuri sul branch `refactor/260528-zonaorientale-next`.

## Obiettivo

Ridurre confusione e rischio di manutenzione senza cambiare funzionalita' runtime.

## File da rimuovere dalla repo

Questi file sono stati identificati come duplicati o non piu' necessari:

```text
static/zonaorientale/assets/js/trade-notification-simulator-v255.js
static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js
static/zonaorientale/assets/css/mobile-hotfix-v166.css
static/zonaorientale/assets/css/mobile-hotfix-v167.css
```

La posizione canonica del simulatore trattative resta:

```text
static/zonaorientale/assets/js/dev/trade-notification-simulator-v255.js
```

## File da mantenere

Non rimuovere senza audit specifico:

```text
static/zonaorientale/assets/js/refactor/admin-publication-workflow-v213.js
static/zonaorientale/assets/js/domain/competitions.js
static/zonaorientale/news.html
static/zonaorientale/comunicati/*.html
static/zonaorientale/tools/generate-news-share-pages.mjs
```

## Comandi di rimozione

```bash
git rm --ignore-unmatch static/zonaorientale/assets/js/trade-notification-simulator-v255.js
git rm --ignore-unmatch static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v166.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v167.css
find static/zonaorientale -name ".DS_Store" -delete
rm -rf static/zonaorientale/__MACOSX __MACOSX
```

## Test post-pulizia

- Aprire la home e verificare footer `V265 pulizia asset sicuri`.
- Eseguire da console: `window.ZonaOrientaleCleanupV265`.
- Verificare che il simulatore trattative sia ancora disponibile: `ZonaOrientaleTradeSimulatorV255.help()`.
- Verificare una navigazione mobile rapida: Dashboard, News, Rose, Competizioni, Dashboard Presidente.

## Note

`FUNZIONALITA'.md` non viene modificato in questa release. La pulizia non aggiunge o rimuove funzionalita' utente.
````

---

## 25. `audit/REFACTOR_CLEANUP_CONSOLIDATION_MATRIX_V354.md`

- Percorso originale: `audit/REFACTOR_CLEANUP_CONSOLIDATION_MATRIX_V354.md`
- Dimensione originale: 2012 byte
- SHA-256: `5c0e273bdbeaad6861937c11b8bbc77e2dd4300d46498a07f6cd82458a6bbdbc`

````markdown
# Matrice consolidamento cleanup/refactor V354

| Area | Stato V354 | Decisione | Rischio | Note |
| --- | --- | --- | --- | --- |
| Calciomercato immagini | Modulo V334 attivo | Preservare | Basso | Fallback favicon/fonte/TMW testuale invariati |
| Calciomercato player | Modulo V340 attivo | Preservare | Medio | Matching conservativo, modal timeline V336 |
| Calciomercato renderer | Modulo V338 attivo | Preservare | Basso | Wrapper storico ancora attivo |
| Calciomercato filtri | Modulo V339 attivo | Preservare | Basso | Cerca/Da/A/squadra/topic/fonte invariati |
| Calciomercato Solo Admin | Modulo V340 attivo | Preservare | Medio | Download archivio e diagnostica da testare manualmente |
| Helper condivisi | V295 + bridge V341 | Preservare | Basso | V294 rimosso in V345 |
| CSS refactor legacy | Rimossi V343 | Nessuna azione | Basso | Controlli obbligatori OK |
| Mobile hotfix V166/V167 | Rimossi V352 | Nessuna azione | Basso | Regole consolidate in mobile-suite-v168 |
| Simulatore trade | V255 attivo | Preservare | Medio | V254 e duplicato top-level rimossi; azioni locali V349 |
| Admin diagnostica | Timestamp V343 attivo | Preservare | Medio | Click Aggiorna Diagnostica mostra ora italiana |
| Workflow pubblicazione Admin V213 | Non importato | Tenere per ora | Medio | Rimozione solo dopo test Admin pubblicazione |
| theme-light-suspended.css | Non importato | Tenere per ora | Basso | Archivio/rollback tema Light |
| domain/competitions.js | Non importato | Tenere per ora | Medio | Rimozione solo dopo test Dashboard Competizioni/competition.html |
| Netlify Functions | Non toccate | Preservare | Medio | Warning V320 noto, non bloccante |
| `FUNZIONALITA'.md` | Non modificato | Preservare | Basso | Modificare solo su richiesta esplicita |

## Politica V354

Nessuna rimozione automatica. La V354 e un punto di stop e consolidamento.

## Comandi audit

```bash
static/zonaorientale/tools/audit-refactor-consolidation-v354.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```
````

---

## 26. `audit/REGRESSION_SMOKE_MATRIX_V355.md`

- Percorso originale: `audit/REGRESSION_SMOKE_MATRIX_V355.md`
- Dimensione originale: 2381 byte
- SHA-256: `1bfa8455db2b0c79b914339dac82b1dcb2f665acfb98b540aaaa1a816712a161`

````markdown
# REGRESSION_SMOKE_MATRIX_V355

Versione: V355  
Scopo: matrice statica e manuale per verificare che il ciclo V333-V354 non abbia scollegato funzionalita.

## Audit automatico

Tool:

```bash
static/zonaorientale/tools/audit-regression-smoke-v355.mjs
```

Controlla:

- `DEPLOY_EXPECTED_VERSION_V181 = "355"`.
- cache-buster HTML/app V355.
- marker runtime `window.ZonaOrientaleRegressionSmokeSuiteV355`.
- preservazione marker V354.
- presenza moduli canonici Calciomercato/Listone/helper/trade.
- assenza file legacy rimossi in V343-V352.
- presenza documenti V355.

## Checklist manuale prioritaria

| Area | Test | Esito atteso |
| --- | --- | --- |
| Login presidente | Accedi con presidente approvato | Dashboard e dati squadra visibili |
| Login Admin | Accedi come admin | Area Admin visibile |
| Calciomercato | Apri sezione | Articoli caricati da feed/statico |
| Calciomercato filtri | Cerca, Da, A, squadra/fonte/topic | Lista filtrata senza errori console |
| Calciomercato player tag | Clic su tag giocatore | Modal timeline aperto e chiudibile |
| Calciomercato Solo Admin | Espandi/Riduci | Pannello si apre/chiude |
| Archivio Calciomercato | Diagnostica/download giorno | Nessun errore UI/console |
| Listone | Filtri e Modifiche | Risultati coerenti e stile uniforme |
| Listone Admin | Export modifiche CSV | CSV scaricabile |
| Rose | Apri rose squadra | Tabelle leggibili desktop/mobile |
| Fantamercato | Apri trattative | Stato coerente |
| Simulatore trade | `simulateIncomingProposal()` | Badge e card visibili |
| Simulatore trade | Clic Accetta/Rifiuta su simulazione | Nessun errore Firebase |
| Admin Diagnostica | Aggiorna diagnostica | Timestamp italiano aggiornato |
| Mobile | Bottom nav + Altro | Icone e link visibili |
| Competition | Apri dettaglio competizione | Pagina funzionante |
| Player | Apri scheda giocatore | Pagina funzionante |

## Comandi console utili

```js
window.ZonaOrientaleRegressionSmokeSuiteV355.runSmokeTest()
window.ZonaOrientaleRefactorConsolidationV354.runSmokeTest()
ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()
window.ZonaOrientaleTradeSimulatorLocalActionsV349.runSmokeTest()
```

## Decisione V355

Non procedere con nuove rimozioni fino a quando la checklist manuale non e stata verificata almeno su:

- desktop Chrome/Safari;
- mobile o responsive emulator;
- utente presidente;
- utente admin.
````

---

## 27. `audit/RIFINITURA_CONTROLLI_MOBILE_V287.md`

- Percorso originale: `audit/RIFINITURA_CONTROLLI_MOBILE_V287.md`
- Dimensione originale: 1936 byte
- SHA-256: `999885c82bc352139b5bd83d89822f86414343c92ecda32f5bf1bc86e53c2ba0`

````markdown
# V287 - Rifinitura controlli mobile

## Scopo

V287 applica una rifinitura CSS mirata ai controlli mobile dopo V285/V286.
L'obiettivo e' rendere piu' leggibili e comodi da usare form, filtri, bottoni, menu e aree scrollabili da smartphone, soprattutto in tema Light.

## Tipo intervento

- Solo CSS/UI.
- Nessuna modifica a Firebase.
- Nessuna modifica a EmailJS.
- Nessuna modifica ai dati JSON.
- Nessuna modifica alle logiche Listone/Rose/Admin.
- `FUNZIONALITA'.md` non modificato.

## Aree coinvolte

- Filtri Listone e form generici.
- Bottoni primari, secondari e ghost.
- Pill/filter chip e subnav mobile.
- Bottom navigation e menu mobile Altro.
- Aree tabellari scrollabili.
- Modali/sheet con larghezza vincolata su smartphone.

## Correzioni principali

- Target touch minimo piu' coerente per input, select, textarea, bottoni e link interattivi.
- Font size mobile degli input portato a 16px per ridurre zoom automatico su iOS.
- Focus ring piu' evidente in tema Light.
- Controlli e gruppi checkbox/radio piu' leggibili su sfondo chiaro.
- Bottoni e pill attivi con contrasto piu' netto.
- Safe area migliorata per bottom navigation.
- Scroll orizzontale tabelle piu' fluido con `-webkit-overflow-scrolling: touch`.

## Diagnostica runtime

```js
window.ZonaOrientaleMobileControlsV287
```

## Test manuali consigliati

Da smartphone o viewport mobile:

1. Tema Light attivo.
2. Home: menu, subnav, pulsanti principali.
3. Listone: ricerca, filtri, campi visibili, filtro Modifiche, export CSV.
4. Rose squadra: tabella e scroll orizzontale.
5. Dashboard Presidente: form e bottoni.
6. Admin: Diagnostica dati, Richieste presidenti, form e toolbar.
7. Tema Dark: controllo rapido per assenza regressioni evidenti.

## Note

V287 non riscrive il layout mobile: aggiunge regole finali conservative per aumentare usabilita' e leggibilita'. Eventuali problemi residui vanno corretti con patch puntuali sulla singola sezione.
````

---

## 28. `audit/SHARED_HELPER_LEGACY_CLEANUP_MATRIX_V345.md`

- Percorso originale: `audit/SHARED_HELPER_LEGACY_CLEANUP_MATRIX_V345.md`
- Dimensione originale: 992 byte
- SHA-256: `28da85410b1f87ae8f426577f2d086a6282ef9e4efa88002fa71fa45f456a276`

````markdown
# Audit matrix V345 - Shared helper legacy

| File/elemento | Stato V345 | Azione |
| --- | --- | --- |
| `assets/js/utils/shared-helpers-v294.js` | legacy, non importato | rimosso con `git rm` |
| `assets/js/utils/shared-helpers-v295.js` | attivo | preservare |
| `assets/js/utils/shared-helper-bridge-v341.js` | attivo | preservare |
| `csvEscapeV278` | wrapper compatibile | preservare |
| `buildListoneChangeExportCsvV278` | wrapper compatibile | preservare |
| `normalizeListoneSearchKeyV269` | wrapper compatibile | preservare |
| `normalizeDiagnosticKeyV303` | wrapper compatibile | preservare |
| `normalizeCalciomercatoValueV306` | wrapper compatibile | preservare |

## Esito audit

La rimozione del file V294 e' considerata sicura solo se il tool V345 passa:

```bash
static/zonaorientale/tools/audit-shared-helpers-v345.mjs
```

## Note

I riferimenti documentali storici a V294 possono restare nei documenti vecchi. Il vincolo V345 riguarda il runtime, gli HTML e i file attivi.
````

---

## 29. `audit/STABILIZZAZIONE_PROTETTA_MATRIX_V365.md`

- Percorso originale: `audit/STABILIZZAZIONE_PROTETTA_MATRIX_V365.md`
- Dimensione originale: 1499 byte
- SHA-256: `347168fd61575ea5715b5d2d5292aea2a9ecaddd5f6137f2dd44c452fedf48ce`

````markdown
# Matrice stabilizzazione protetta - V365

## Ambito

Release senza cambio funzionale. Scopo: allineamento versione/cache/documentazione e marker runtime per bloccare regressioni prima dei prossimi refactor.

| Area | Stato V365 | Impatto |
| --- | --- | --- |
| Footer/cache-buster index | aggiornato a V365 | solo cache/versione |
| Footer/cache-buster competition | aggiornato a V365 | solo cache/versione |
| Footer/cache-buster player | aggiornato a V365 | solo cache/versione |
| `DEPLOY_EXPECTED_VERSION_V181` | aggiornato a `365` | solo diagnostica/versione |
| Trattative reali Firebase | non modificate | nessun impatto |
| Simulazioni trade local-only | non modificate | preservato fix V364 |
| Area Presidente | non modificata | nessun impatto |
| Admin/Checklist QA | non modificato | solo marker V365 disponibile |
| Listone | non modificato | nessun impatto |
| Rose/snapshot | non modificati | nessun impatto |
| Competizioni | non modificate | solo cache/footer pagina |
| Player page | non modificata | solo cache/footer pagina |
| Calciomercato | non modificato | nessun impatto |
| `FUNZIONALITA'.md` | non modificato | vincolo rispettato |
| File runtime legacy | non rimossi | rischio regressione evitato |

## Marker runtime

```js
window.ZonaOrientaleProtectedStabilizationV365
```

## Criterio di successo

- Il sito carica con footer V365.
- Il controllo versione/cache non segnala mismatch su home.
- Il fix V364 rimane presente.
- Nessuna funzionalita' viene scollegata.
````

---

## 30. `audit/THEME_COMPETITIONS_AUDIT_MATRIX_V353.md`

- Percorso originale: `audit/THEME_COMPETITIONS_AUDIT_MATRIX_V353.md`
- Dimensione originale: 980 byte
- SHA-256: `46a74c306f67d1100b5a7b0c579788f650efdc7b0e5e4a8729958126f6cc5ebd`

````markdown
# Matrice audit tema/competizioni - V353

| File | Stato V353 | Evidenza | Decisione |
| --- | --- | --- | --- |
| `assets/css/refactor/theme-light-suspended.css` | conservato/non importato | gli entrypoint HTML non lo caricano; contiene marker di Light sospeso | non rimuovere in V353; decidere policy Light in una release dedicata |
| `assets/js/domain/competitions.js` | conservato/non importato | il runtime usa funzioni inline in `assets/app.js`; il modulo esporta duplicati storici V52 | non rimuovere in V353; eventuale cleanup solo dopo test Competizioni |

## Aree protette

- Tema corrente e Dark mode.
- Eventuale ripristino futuro della Light mode.
- Dashboard Competizioni.
- `competition.html`.
- Archivio e render gruppi competizioni.
- Admin competizioni e stato pubblicazione.

## Comando audit

```bash
static/zonaorientale/tools/audit-theme-competitions-v353.mjs
```

## Risultato atteso

Tutti i check devono essere `OK`. La release non prevede cancellazioni.
````

---

## 31. `audit/TRADE_DOMAIN_HARDENING_MATRIX_V366.md`

- Percorso originale: `audit/TRADE_DOMAIN_HARDENING_MATRIX_V366.md`
- Dimensione originale: 2402 byte
- SHA-256: `ba7b82123b62b91a45c33ef2e069617a5f775853b734c2c82be40540299b2a76`

````markdown
# Matrix V366 - Hardening dominio trattative/notifiche

## Scopo

Controllare che la V366 rafforzi il flusso trattative senza staccare funzionalita' esistenti.

| Area | Stato | Note |
| --- | --- | --- |
| Trattative reali Firebase | Preservata | Il wrapper normalizza lo status e poi delega al flusso esistente. |
| Simulazioni local-only V255 | Preservata | Nessuna scrittura Firebase per righe `localOnly`. |
| Azioni locali V349 | Preservata | Il wrapper V366 passa stati normalizzati al wrapper V349. |
| Simulazioni Admin target V362/V364 | Preservata | La sync localStorage V364 viene richiamata anche dopo il wrapper V366. |
| Badge notifiche V238/V239/V246 | Rafforzati | La normalizzazione V238 viene reindirizzata a V366. |
| Card trattativa | Rafforzata | Rendering e pulsanti usano stati normalizzati. |
| ID trattative | Rafforzati | `getNegotiationById` confronta gli ID come stringhe. |
| Admin QA | Preservato | Badge pannello aggiornato a V366, logica non riscritta. |
| Listone | Non toccato | Solo cache-buster globale. |
| Rose | Non toccate | Solo cache-buster globale. |
| Competizioni | Non toccate | Solo footer/cache-buster. |
| player.html | Non toccato | Solo footer/cache-buster. |
| Calciomercato | Non toccato | Solo cache-buster globale. |
| Mobile navigation | Non toccata | Solo cache-buster globale. |
| File legacy | Non rimossi | Nessuna cancellazione in V366. |

## Controlli automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
```

## Controlli console

```js
ZonaOrientaleTradeDomainHardeningV366.normalizeStatus('in attesa') === 'PENDING'
ZonaOrientaleTradeDomainHardeningV366.normalizeStatus('accettata') === 'ACCEPTED'
ZonaOrientaleTradeDomainHardeningV366.normalizeStatus('rifiutata') === 'REJECTED'
ZonaOrientaleTradeDomainHardeningV366.normalizeStatus('annullata') === 'CANCELLED'
ZonaOrientaleTradeDomainHardeningV366.runSmokeTest().ok === true
```

## Rischi residui

- Le trattative reali restano dipendenti dai permessi Firestore configurati.
- Se una riga Firebase contiene uno status non previsto, viene mostrato come valore normalizzato sconosciuto e non viene trattato come pendente.
- La piena verifica cross-device degli esiti reali richiede ambiente Firebase live.

## Esito

V366 idonea come hardening mirato prima di eventuali test automatici minimi V367.
````

---

## 32. `audit/TRADE_SIMULATOR_CLEANUP_MATRIX_V347.md`

- Percorso originale: `audit/TRADE_SIMULATOR_CLEANUP_MATRIX_V347.md`
- Dimensione originale: 1196 byte
- SHA-256: `a71a9b366b399ecba521df047e8a7b0ce9d929b6e5a902f1681d2924d602fb3f`

```markdown
# Matrice cleanup simulatore trade V347

Data: 05/06/2026

## Esito

| File | Stato V347 | Note |
| --- | --- | --- |
| `assets/js/trade-notification-simulator-v255.js` | rimosso | duplicato top-level non importato dal runtime |
| `assets/js/dev/trade-notification-simulator-v255.js` | preservato | copia canonica importata da `assets/app.js` |
| `assets/js/dev/trade-notification-simulator-v254.js` | candidato review | versione precedente, non importata; da valutare in V futura |

## Controlli richiesti

- `assets/app.js` deve importare `./js/dev/trade-notification-simulator-v255.js?v=347`.
- `assets/app.js` non deve importare `./js/trade-notification-simulator-v255.js`.
- `index.html`, `competition.html` e `player.html` non devono linkare il duplicato top-level.
- `static/zonaorientale/tools/audit-trade-simulator-v347.mjs` deve terminare con esito OK.

## Funzionalita preservate

- Fantamercato interno.
- Notifiche trade.
- Simulatore dev V255.
- Admin, Calciomercato, Listone, Rose, Dashboard Presidente, Firebase/Auth/EmailJS e Netlify Functions.

## Policy

La V347 rimuove un solo file. Gli altri candidati legacy minori restano in review e non vanno cancellati automaticamente.
```

---

## 33. `audit/TRADE_SIMULATOR_DEV_AUDIT_MATRIX_V348.md`

- Percorso originale: `audit/TRADE_SIMULATOR_DEV_AUDIT_MATRIX_V348.md`
- Dimensione originale: 1687 byte
- SHA-256: `7c075c253a9e452b5aef3c3256babffff8bf2371f215c4c18394059aa895ad23`

```markdown
# Matrice audit simulatore trade dev V348

Data: 05/06/2026

## Scope

Audit mirato di `assets/js/dev/trade-notification-simulator-v254.js` rispetto al modulo canonico `assets/js/dev/trade-notification-simulator-v255.js`.

## Esito

| Controllo | Esito | Nota |
| --- | --- | --- |
| V255 presente | OK | modulo attivo e importato dal runtime |
| V254 presente | OK | conservato solo come candidato review |
| Runtime importa V255 | OK | import in `assets/app.js` su `./js/dev/trade-notification-simulator-v255.js?v=<versione>` |
| Runtime importa V254 | OK | nessun import runtime a V254 |
| HTML pubblici importano simulatori dev | OK | nessun link diretto da `index.html`, `competition.html`, `player.html` |
| Alias console V254 in V255 | OK | `window.ZonaOrientaleTradeSimulatorV254 = api` preserva compatibilita |
| Comandi diagnostici V255 | OK | V255 include `getTestCommands`, `help`, `printHelp`, `runLocalSmokeTest` |

## Raccomandazione

Non rimuovere `assets/js/dev/trade-notification-simulator-v254.js` in questa release. La rimozione puo essere una V successiva, ma solo dopo test manuale di:

- `ZonaOrientaleTradeSimulatorV255.help()`;
- `ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()`;
- badge notifiche Fantamercato;
- proposta ricevuta/inviata simulata;
- `markAllOutcomeSeen()` se Firebase lo consente.

## Policy

Ogni rimozione deve essere isolata in una versione dedicata, con tool audit, documentazione e comandi `git rm` separati.

## Aggiornamento V350

Dopo l'audit V348 e la correzione V349, `assets/js/dev/trade-notification-simulator-v254.js` e stato rimosso in V350. La compatibilita console V254 resta garantita dall'alias esposto dal modulo V255.
```

---

## 34. `audit/TRADE_SIMULATOR_DEV_CLEANUP_MATRIX_V350.md`

- Percorso originale: `audit/TRADE_SIMULATOR_DEV_CLEANUP_MATRIX_V350.md`
- Dimensione originale: 641 byte
- SHA-256: `b1e0490fa1df9fd54366ae63de1973fdc316ab468af25900057fb8ce35f541f2`

````markdown
# Matrice audit V350 - Cleanup simulatore trade dev

| Controllo | Esito atteso |
|---|---|
| `assets/js/dev/trade-notification-simulator-v255.js` presente | OK |
| `assets/js/dev/trade-notification-simulator-v254.js` assente | OK |
| `app.js` importa solo V255 | OK |
| HTML pubblici non importano simulatori trade dev | OK |
| V255 espone `ZonaOrientaleTradeSimulatorV255` | OK |
| V255 mantiene alias `ZonaOrientaleTradeSimulatorV254` | OK |
| V349 local actions presente | OK |
| Marker `ZonaOrientaleTradeSimulatorDevCleanupV350` presente | OK |

Tool:

```bash
static/zonaorientale/tools/audit-trade-simulator-dev-cleanup-v350.mjs
```
````

---

## 35. `audit/TRADE_SIMULATOR_LOCAL_ACTIONS_MATRIX_V349.md`

- Percorso originale: `audit/TRADE_SIMULATOR_LOCAL_ACTIONS_MATRIX_V349.md`
- Dimensione originale: 942 byte
- SHA-256: `7d6139922f7f79e41bd09e68b0d1348c59247dbfecc0b97f1404997a114cd776`

````markdown
# V349 - Matrice audit azioni locali simulatore trade

| Area | Stato | Note |
|---|---:|---|
| Simulatore V255 canonico | OK | `assets/js/dev/trade-notification-simulator-v255.js` resta attivo. |
| Alias console V254 | OK | Preservato nel modulo V255. |
| Proposte simulate localOnly | OK | Riconosciute da `isLocalTradeSimulationV349`. |
| Accetta/Rifiuta simulati | OK | Aggiornano stato locale, nessun Firebase. |
| Annulla simulato | OK | Rimuove riga locale. |
| Trattative reali | OK | Continuano a usare `updateNegotiationStatusBeforeV349`. |
| Badge notifiche | OK | Ricalcolati dopo azione locale. |
| Rischio regressione | Basso | Wrapper condizionato solo su `localOnly/source` simulatore. |

## Tool

```bash
static/zonaorientale/tools/audit-trade-simulator-local-actions-v349.mjs
```

## Test manuale

```js
ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()
```

Poi cliccare `Rifiuta` o `Accetta` nella card ricevuta.
````

---

## 36. `audit/TRADE_SIMULATOR_PANEL_MATRIX_V361.md`

- Percorso originale: `audit/TRADE_SIMULATOR_PANEL_MATRIX_V361.md`
- Dimensione originale: 514 byte
- SHA-256: `382297d3c995f2143903158589e40e137c99bfab45c490c4df0d237db3c87896`

```markdown
# Matrice audit V361 - Trade simulator panel

| Area | Stato | Note |
| --- | --- | --- |
| Simulatore V255 | Preservato | API console ancora disponibile. |
| Azioni locali V349 | Preservate | Accetta/Rifiuta simulati non scrivono su Firebase. |
| Checklist QA Admin | Estesa | Nuova card `trade-simulator-panel`. |
| Firebase reale | Non modificato | Flussi reali invariati. |
| Badge notifiche | Aggiornabili da UI | Pulsante `Aggiorna badge`. |
| Pulizia simulazioni | Da UI | Pulsante `Pulisci simulazioni`. |
```

---

## 37. `audit/TRADE_SIMULATOR_TARGET_MATRIX_V362.md`

- Percorso originale: `audit/TRADE_SIMULATOR_TARGET_MATRIX_V362.md`
- Dimensione originale: 641 byte
- SHA-256: `40d98eeca7a7cd335a775272fa8216a185d047d4eaa5de6bb68a7a391fd5848d`

```markdown
# Audit matrix V362 - Simulazione notifica verso presidente

| Area | Esito | Note |
| --- | --- | --- |
| Runtime marker `ZonaOrientaleTradeSimulatorTargetPanelV362` | OK | Nuovo oggetto disponibile in browser. |
| Menu destinatario presidente/squadra | OK | Usa squadre stagione corrente e presidenti associati. |
| Persistenza locale | OK | Usa `zonaorientale.tradeSimulatorTargetPanel.v362.rows`. |
| Firebase | OK | Nessuna scrittura; flusso local-only. |
| Pulizia simulazioni | OK | Integrata nel pulsante `Pulisci simulazioni`. |
| Trattative reali | OK | Non modificate. |
| Simulatore V255/V349/V361 | OK | Preservato e riusato. |
```

---

## 38. `audit/VERIFICA_FUNZIONALITA_V272.md`

- Percorso originale: `audit/VERIFICA_FUNZIONALITA_V272.md`
- Dimensione originale: 2768 byte
- SHA-256: `f632a44742c54b00381d794db2219c4197625867d1a2ddfab3c78e31697d54be`

````markdown
# Verifica funzionalita V272 - rischio perdita funzionalita

Data: 30/05/2026  
Branch: `refactor/260528-zonaorientale-next`  
Versione runtime: `V273 test listone reale`

## Esito sintetico

Dal controllo statico sulla baseline allegata non risultano riferimenti mancanti negli HTML/import principali, e non risultano errori sintattici su `assets/app.js` o JSON pubblici.

Non risultano funzionalita perse in modo evidente rispetto alle modifiche V240-V271. Restano pero' aree legacy da non cancellare senza test mirato.

## Controlli eseguiti sul pacchetto allegato

```text
assets/app.js: node --check OK
assets/js/*.js: node --check OK
assets/**/*.json: parse OK
HTML src/href principali: nessun riferimento mancante rilevato
import JS relativi: nessun riferimento mancante rilevato
```

## Funzionalita recenti ancora da proteggere

### Comunicati presidente

- `Comunicato squadra`: resta flusso storico.
- `Comunicato avvenuto scambio`: deve restare flusso canonico presidente -> `teamRequests` -> EmailJS -> Admin approva -> News.
- `Svincola Giocatori`: deve restare solo email EmailJS, senza scrittura Firebase/Admin.

### Trattative/notifiche

- Badge proposta ricevuta finche' `status = PENDING`.
- Badge esito mittente finche' card non viene aperta.
- Lettura esito su Firebase con fallback localStorage.
- Simulatore test: `ZonaOrientaleTradeSimulatorV255.help()`.

### Listone

- Convertitore formato storico `Tutti/Ceduti`.
- Convertitore formato Classic `Lista calciatori`.
- Ricerca storica su altri listoni.
- Colonna opzionale `Modifica`.
- Righe `Uscito` con indicazione ultimo listone che conteneva il giocatore.

### Admin

- Richieste presidenti modulari V253 + fallback V249.
- Aggiorna richieste.
- Approva/rifiuta.
- Elimina da Firebase comunicati approvati/rifiutati.
- Generatore comunicati automatici.
- Workflow pubblicazione inline.

## Rischi residui

1. `domain/competitions.js` sembra potenzialmente legacy, ma le competizioni sono centrali: non eliminarlo senza test.
2. `admin-publication-workflow-v213.js` e' probabilmente scollegato, ma il workflow inline e' vivo: non eliminarlo senza audit dedicato.
3. File statici news/comunicati legacy possono servire per vecchi link WhatsApp.
4. Alcuni file duplicati/vecchi possono ancora essere presenti se la pulizia fisica V265 non e' stata applicata in repo.

## Funzionalita nuove da documentare nel registro principale, se richiesto

Non modificare `FUNZIONALITA'.md` senza richiesta esplicita. Se l'utente chiede aggiornamento del registro principale, includere almeno:

- Svincola Giocatori.
- Convertitore listone flessibile.
- Storico/confronto listoni.
- Colonna Modifica e usciti storici.
- Migliorie EmailJS/deliverability.
- Login senza Nome visualizzato e con logo Google.
````

---

## 39. `refactor/APP_JS_AUDIT_V293.md`

- Percorso originale: `refactor/APP_JS_AUDIT_V293.md`
- Dimensione originale: 4584 byte
- SHA-256: `7b6efe1d7160574b282d79e176bec418103447493472ded1d37e0c1931dd7c7a`

````markdown
# V293 - Audit mirato app.js

Data: 31/05/2026  
Versione runtime: **V293 audit mirato app.js**

## Scopo

Questa release non modifica il comportamento del sito e non estrae ancora codice da `assets/app.js`.

Lo scopo e' mappare le aree piu' delicate prima di un futuro refactor JS, evitando che modifiche progressive stacchino funzionalita gia' presenti.

## Stato numerico del file

Checkpoint analizzato:

```text
assets/app.js: 23.366 righe
import statici: 37
funzioni dichiarate con function: circa 884
diagnostiche window.ZonaOrientale*: circa 55
```

Il file e' un bundle storico stratificato: contiene bootstrap iniziale, override Vxx successivi, fallback legacy, moduli installati e diagnostiche runtime.

## Funzionalita a rischio da preservare

Ogni refactor JS futuro deve verificare esplicitamente queste aree:

### Pubblico

- Home e dashboard stagione.
- News e link WhatsApp dinamici `/zonaorientale/share/news/<id>`.
- Listone con colonna `Modifica`, filtro `Modifiche`, `Mostra usciti storici` ed export CSV.
- Rose pubbliche, pagina squadra e saldi/movimenti.
- Competizioni, classifica completa campionato e `competition.html`.
- Archivio, Statistiche e Confronta.
- Bottom navigation mobile, menu Altro e pulsante Su.

### Presidente

- Login e riconoscimento presidente approvato.
- Dashboard Presidente.
- Comunicati squadra e comunicati avvenuto scambio.
- `Svincola Giocatori` con EmailJS senza scrittura Firebase.
- Trattative inviate/ricevute e badge notifiche.
- Lettura esiti trattative sincronizzabile con Firebase Rules V257 quando pubblicate.

### Admin

- Accetta utenti stabile anti-duplicati.
- Richieste presidenti: aggiorna, approva, rifiuta, elimina da Firebase.
- Generatore comunicati automatici.
- Workflow pubblicazione Admin inline.
- Diagnostica dati Admin.
- Converti listone Excel storico/Classic.
- Snapshot pubblici, backup, competizioni, rose, albo, FIFA ranking e stadi.

### Infrastruttura/UI

- Dark mode unico V289 e toggle tema nascosto.
- CSS refactor V291/V292 caricato in ordine corretto.
- Pagine standalone `competition.html` e `player.html`.
- Cache-buster e `DEPLOY_EXPECTED_VERSION_V181` allineati.

## Aree da non toccare nel primo refactor JS

Non spostare ancora:

```text
renderAll e override renderAllVxx
bootstrap/initializeAppUi
setupAuth e onAuthStateChanged
Firebase/Auth/Admin
Dashboard Presidente e trattative
Listone pubblico completo
Convertitore listone Admin
Archivio/Statistiche/Confronta
workflow pubblicazione Admin
News share WhatsApp
```

Motivo: queste aree hanno override successivi, dipendenze globali e fallback storici. Una rimozione apparentemente piccola potrebbe staccare funzioni ancora vive.

## Candidati sicuri per una futura V294

Possibili estrazioni, solo dopo grep e test browser:

```text
helper di normalizzazione testo
escape HTML e sanitizzazione semplice
helper data/numero senza DOM
helper download CSV/export
costanti o diagnostiche runtime non bloccanti
utility pure senza accesso diretto a state, Firebase o DOM complesso
```

Regola: ogni funzione estratta deve mantenere un alias/fallback se esistono chiamate storiche nel file principale.

## Procedura obbligatoria prima di estrarre codice da app.js

1. Cercare tutti gli usi con `grep`.
2. Verificare se la funzione viene sovrascritta da versioni Vxx successive.
3. Verificare se e' richiamata da listener/eventi installati dopo il bootstrap.
4. Estrarre una sola famiglia di helper per release.
5. Lasciare alias compatibili quando necessario.
6. Eseguire test automatici e manuali.
7. Aggiornare handoff, changelog, regression tests e script pre-push.

## Test minimi richiesti dopo ogni refactor JS

```bash
static/zonaorientale/tools/check-zonaorientale.sh
```

Test manuali:

```text
Home pubblica
News e link WhatsApp
Listone: Modifica, filtro Modifiche, usciti storici, export CSV
Rose e pagina squadra
Competizioni e competition.html
Archivio, Statistiche, Confronta
Dashboard Presidente: rose, comunicati, trattative
Admin: Richieste presidenti, Diagnostica dati, Converti listone Excel
Mobile: bottom nav, menu Altro, pulsante Su
player.html
```

## Diagnostica runtime

```js
window.ZonaOrientaleAppJsAuditV293
```

Valori attesi:

```text
version: V293
behaviorChange: false
document: docs/zonaorientale/refactor/APP_JS_AUDIT_V293.md
```

## Decisione operativa

Il prossimo refactor consigliato e' una V294 molto piccola, dedicata solo a helper puri e non collegati a Firebase o render complessi. Evitare refactor ampi di `app.js` finche' non esiste una copertura manuale stabile delle funzionalita critiche.
````

---

## 40. `refactor/ASSET_IMPORT_AUDIT_V298.md`

- Percorso originale: `refactor/ASSET_IMPORT_AUDIT_V298.md`
- Dimensione originale: 2926 byte
- SHA-256: `992675a7114f2f4002012a55e4f2c20bdcfc149008c3c28f6216fc3a94b71abc`

````markdown
# V298 - Audit asset e import orfani

## Scopo

V298 introduce un controllo non distruttivo sugli asset del sito ZonaOrientale. L'obiettivo e' individuare prima di ogni futura pulizia:

- import, `href`, `src` o `url(...)` locali che puntano a file mancanti;
- file CSS/JS versionati vecchi non piu' referenziati;
- possibili candidati orfani da verificare manualmente;
- rischio di rimuovere asset ancora usati da fallback, pagine standalone o codice legacy.

La release non rimuove asset, non modifica dati e non cambia comportamento runtime.

## Tool aggiunto

```bash
static/zonaorientale/tools/audit-assets-v298.sh
```

Uso standard:

```bash
static/zonaorientale/tools/audit-assets-v298.sh
```

Modalita' compatta:

```bash
static/zonaorientale/tools/audit-assets-v298.sh --quiet
```

Il tool analizza HTML, JS e CSS locali, normalizza i path e segnala riferimenti mancanti come errore. I possibili file orfani sono solo warning: non autorizzano cancellazioni automatiche.

## Funzionalita' a rischio e preservazione

### Funzionalita' a rischio

- CSS refactor mobile/rose/tabelle V292.
- Dark mode unico V289 e toggle tema nascosto.
- Listone: colonna `Modifica`, filtro `Modifiche`, usciti storici ed export CSV admin-only.
- Export CSV Listone collegato a `assets/js/utils/shared-helpers-v295.js`.
- Pagine standalone `competition.html` e `player.html`.
- Moduli legacy/fallback importati da `app.js`.
- Moduli Admin, Presidente, Firebase, EmailJS e share news.

### Preservazione applicata

- Nessun file viene eliminato dalla V298.
- Il nuovo tool segnala soltanto; le rimozioni devono restare manuali e motivate.
- I candidati orfani vanno verificati con `grep`, test browser e checklist regressione prima di `git rm`.
- `check-zonaorientale.sh` controlla solo presenza di tool e documento, senza bloccare il lavoro per warning non distruttivi.

## Regola per le pulizie future

Prima di rimuovere un asset CSS/JS:

1. eseguire `static/zonaorientale/tools/audit-assets-v298.sh`;
2. cercare il file con `grep -R "NOME_FILE" static/zonaorientale docs/zonaorientale`;
3. verificare se il file puo' essere richiamato dinamicamente o da pagina standalone;
4. eseguire `static/zonaorientale/tools/check-zonaorientale.sh`;
5. testare manualmente le funzionalita' a rischio;
6. documentare la rimozione in changelog/handoff.

## Test consigliati dopo V298

- Home pubblica.
- Listone pubblico senza export CSV per non Admin.
- Listone Admin con export CSV funzionante.
- Pagina squadra e rose mobile.
- Dashboard Presidente.
- Admin -> Diagnostica dati.
- Admin -> Richieste presidenti.
- `competition.html`.
- `player.html`.
- Mobile bottom nav, menu Altro e pulsante Su.

## Diagnostica runtime

```js
window.ZonaOrientaleAssetImportAuditV298
```

Valori attesi:

```js
window.ZonaOrientaleAssetImportAuditV298.behaviorChange === false
window.ZonaOrientaleAssetImportAuditV298.tool === "tools/audit-assets-v298.sh"
```
````

---

## 41. `refactor/AUDIT_STYLES_APP_V290.md`

- Percorso originale: `refactor/AUDIT_STYLES_APP_V290.md`
- Dimensione originale: 6092 byte
- SHA-256: `847f7007ab219831ffb3c8805578e1206504827545b956b1a907c68e56b58d58`

````markdown
# V290 - Audit `styles.css` e `app.js`

> Obiettivo: preparare un refactor conservativo di `assets/styles.css` e `assets/app.js` senza perdere funzionalita' esistenti.
>
> Questa release non cambia comportamento runtime: aggiunge una mappa di rischio e una diagnostica di checkpoint.

## Stato file al checkpoint V290

| File | Righe | Dimensione indicativa | Note |
| --- | ---: | ---: | --- |
| `assets/styles.css` | 14.690 | 435 KB | CSS storico + patch mobile/recenti V280-V289. |
| `assets/app.js` | 23.302 | 1.095 KB | Bundle principale storico, 782 funzioni dichiarate circa. |

Indicatori rilevati:

- `styles.css` contiene circa 2.070 blocchi/regole CSS e molte regole `@media` ripetute per mobile.
- Le patch recenti CSS V280-V289 sono concentrate nella coda del file.
- `app.js` contiene ancora molte patch storiche Vxxx, override e fallback: non va alleggerito con cancellazioni dirette.
- Gli import critici di `app.js` usano cache-buster e vanno mantenuti allineati alla versione deploy.

## Blocchi CSS recenti da proteggere

Nel refactor CSS non perdere questi blocchi/funzioni visive:

- V280: semplificazione UI del Listone, con pannello `Storico listoni` nascosto ma logiche V269-V278 conservate.
- V281/V285: contrasto mobile e leggibilita' generale.
- V286: fix prima colonna sticky mobile.
- V287: rifinitura controlli mobile, input, select, bottoni, focus e bottom navigation.
- V288: fix rose mobile Light, utile come riferimento se Light verra' ripresa.
- V289: Dark mode temporaneo, toggle tema nascosto e rose mobile compatte.

## Funzionalita' a rischio e come preservarle

### Listone

Da non perdere:

- colonna `Modifica`;
- filtro `Modifiche`;
- `Mostra usciti storici`;
- export CSV modifiche;
- normalizzazione codici squadra V274;
- dati storici V269-V278 usati sotto il cofano anche se il pannello `Storico listoni` e' nascosto.

Presidio:

- prima di spostare CSS Listone, testare tabella, filtri, export e scroll mobile;
- non eliminare funzioni `V269`, `V270`, `V277`, `V278` da `app.js` senza audit dedicato.

### Rose e pagina squadra

Da non perdere:

- tabella Rosa pubblica;
- pagina squadra standalone;
- Dashboard Presidente con rosa;
- prima colonna sticky leggibile;
- righe compatte e contenuto centrato verticalmente da mobile.

Presidio:

- qualsiasi CSS su tabelle deve essere verificato su `Rose`, pagina squadra e Dashboard Presidente;
- mantenere test in Dark mode, dato che Light e' sospesa temporaneamente.

### Mobile chrome

Da non perdere:

- bottom navigation solo smartphone;
- menu mobile `Altro`;
- pulsante globale `Su`;
- modal e sheet che non devono restare aperti passando desktop/mobile.

Presidio:

- non modificare `mobile-chrome-v220.js`, `mobile-chrome-v223.css` o regole correlate senza test desktop/mobile.

### Admin

Da non perdere:

- `Admin -> Richieste presidenti`;
- `Admin -> Diagnostica dati`;
- `Admin -> Converti listone Excel`;
- workflow pubblicazione Admin inline;
- generatore comunicati automatici.

Presidio:

- non estrarre codice Admin da `app.js` prima di una mappa funzioni dedicata;
- testare i pannelli Admin dopo qualsiasi modifica CSS generale a card, form, tabelle, button o toolbar.

### Presidente

Da non perdere:

- Dashboard Presidente;
- trattative e notifiche;
- comunicato squadra;
- comunicato avvenuto scambio;
- svincola giocatori;
- lettura esiti trattative multi-dispositivo quando le Firebase Rules V257 sono pubblicate.

Presidio:

- non toccare Auth/Firebase/trattative in un refactor CSS;
- testare Dashboard Presidente dopo ogni modifica a layout mobile, form e tabelle.

### News / share WhatsApp

Da non perdere:

- link `/zonaorientale/share/news/<id>`;
- redirect a `#news-<id>`;
- pulsante `Copia link WhatsApp`;
- home con meta generici, non ultima news.

Presidio:

- non toccare `news.html`, `comunicati/*.html`, `tools/generate-news-share-pages.mjs` senza audit di compatibilita'.

## Linee guida per pulire `styles.css`

### Passo sicuro consigliato V291

Estrarre solo blocchi recenti e isolabili in file dedicati, mantenendo ordine di import finale:

```text
assets/css/refactor/mobile-fixes-v291.css
assets/css/refactor/rosters-tables-v291.css
```

Regola: prima copiare il blocco, testare, poi rimuovere il duplicato da `styles.css` solo se il risultato visivo e' invariato.

### Non fare in V291

- Non riscrivere tutta la struttura CSS.
- Non dividere subito tutto in `dark-mobile`, `dark-desktop`, `light-mobile`, `light-desktop`.
- Non rimuovere il CSS Light: archiviarlo/separarlo piu' avanti, perche' la Light mode verra' ripresa.
- Non cambiare nomi classe/ID usati dal JavaScript.

## Linee guida per pulire `app.js`

### Passo sicuro consigliato V293/V294

Prima creare una mappa delle funzioni e poi estrarre solo helper puri:

```text
assets/js/utils/text-utils-v294.js
assets/js/utils/export-utils-v294.js
assets/js/utils/version-diagnostics-v294.js
```

Candidati iniziali:

- escape/normalizzazione testo solo se non gia' centralizzati;
- CSV/download file;
- diagnostiche di versione;
- helper senza accesso a Firebase, DOM complesso o `state` globale.

### Non fare in V290-V294

- Non toccare `renderAll`.
- Non toccare bootstrap, Auth o inizializzazione Firebase.
- Non spostare Listone completo, Admin completo o Dashboard Presidente in un unico refactor.
- Non rimuovere override storici Vxxx solo perche' sembrano duplicati.

## Checklist regressione prima di qualunque estrazione

- Home pubblica.
- News e link WhatsApp.
- Listone: filtri, `Modifiche`, export CSV, usciti storici.
- Rose e pagina squadra da mobile.
- Competizioni e classifica campionato.
- Archivio, Statistiche, Confronta.
- Dashboard Presidente.
- Admin: Richieste presidenti, Diagnostica dati, Converti listone Excel.
- Mobile: bottom navigation, menu Altro, pulsante Su.
- Dark mode: tema unico attuale dopo V289.

## Diagnostica runtime

```js
window.ZonaOrientaleStylesAppAuditV290
```

## Conclusione operativa

La prossima modifica consigliata e' V291: separazione prudente dei CSS mobile/rose/tabelle, con confronto visivo prima/dopo e senza toccare `app.js`.
````

---

## 42. `refactor/CSS_AUDIT_V300.md`

- Percorso originale: `refactor/CSS_AUDIT_V300.md`
- Dimensione originale: 2416 byte
- SHA-256: `bbdb2171740a69a5a705886bcff4928545c0dad450351ba60106c4b44d09e5df`

````markdown
# V300 - Audit CSS e pulizia controllata styles.css

## Obiettivo

V300 introduce un audit CSS non distruttivo per preparare la futura pulizia di `assets/styles.css` senza perdere funzionalita esistenti.

Questa release non rimuove regole CSS e non cambia UI intenzionalmente. Aggiunge solo lo script:

```text
static/zonaorientale/tools/audit-css-v300.sh
```

## Funzionalita a rischio da preservare

Prima di qualsiasi futura pulizia CSS bisogna verificare esplicitamente:

- Listone: colonna `Modifica`, filtro `Modifiche`, usciti storici, export CSV solo Admin.
- Rose e pagina squadra: prima colonna sticky, testo leggibile, righe mobile compatte.
- Dashboard Presidente: tabelle rosa, form e controlli mobile.
- Mobile: bottom navigation, menu `Altro`, pulsante globale `Su`.
- Tema: Dark mode unico introdotto in V289; Light mode sospesa e non caricata.
- Pagine standalone: `competition.html` e `player.html`.
- Admin: Diagnostica dati e Richieste presidenti non devono subire regressioni visive.

## Script aggiunto

Esecuzione standard:

```bash
static/zonaorientale/tools/audit-css-v300.sh
```

Esecuzione compatta:

```bash
static/zonaorientale/tools/audit-css-v300.sh --quiet
```

Lo script controlla:

- presenza di `assets/styles.css`;
- presenza dei CSS refactor stabili `mobile-controls.css`, `rosters-tables.css`, `theme-light-suspended.css`;
- import corretti negli HTML principali;
- assenza di import del CSS Light sospeso;
- residui dei vecchi CSS refactor versionati V291/V292;
- presenza di selettori critici nei CSS mobile/rose;
- possibili duplicati semplici in `styles.css`.

## Regola operativa

L'audit segnala candidati, ma non autorizza cancellazioni automatiche. Un blocco CSS puo essere rimosso solo se:

1. e' dimostrato duplicato o non piu importato;
2. non protegge una funzionalita elencata sopra;
3. i test manuali mobile e desktop sono passati;
4. la modifica e' documentata nel changelog/handoff.

## Test minimi dopo V300

```bash
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-css-v300.sh
```

Controlli manuali consigliati:

- Home mobile.
- Listone pubblico e Admin.
- Pagina squadra -> Rosa.
- Dashboard Presidente.
- Bottom navigation, menu Altro e pulsante Su.
- `competition.html` e `player.html`.

## Esito atteso

V300 non deve produrre cambi visibili. Serve come base per una futura V301/V302 di pulizia CSS realmente applicata.
````

---

## 43. `refactor/LEGACY_DEPENDENCIES_AUDIT_V342.md`

- Percorso originale: `refactor/LEGACY_DEPENDENCIES_AUDIT_V342.md`
- Dimensione originale: 1753 byte
- SHA-256: `529e2e537ba314bcbf7d0eee6072f91d7bf462d7d75395843e4fc2de5aa822c0`

````markdown
# Legacy dependencies audit V342

## Scopo

Preparare una futura pulizia dei file legacy senza perdere funzionalita. La V342 non cancella nulla: aggiunge solo uno strumento di audit e documenta i candidati.

## Tool introdotto

```text
static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs
```

Esecuzioni consigliate:

```bash
node static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs
node static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs --quiet
node static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs --json
```

## Cosa controlla

- HTML principali del sito.
- File JS/MJS/CSS sotto `assets/`.
- Import statici e dinamici.
- `href`, `src` e `url(...)` locali.
- Versioni duplicate con suffisso `-vNNN`.
- Alias stabili che possono aver sostituito file versionati vecchi.

## Cosa non decide

Il tool non puo' sapere con certezza se un file sia caricato dinamicamente da logiche non statiche, da documentazione storica o da workflow manuali. Per questo ogni risultato e' un candidato, non una decisione di cancellazione.

## Policy di sicurezza

Prima di rimuovere un file candidato:

1. cercare il nome file con `grep -R`;
2. eseguire `audit-assets-v298.sh`;
3. eseguire `audit-css-v300.sh` se e' CSS;
4. eseguire `check-zonaorientale.sh`;
5. testare browser desktop e mobile;
6. rimuovere un solo gruppo per release;
7. aggiornare docs e handoff.

## Marker runtime

```js
window.ZonaOrientaleLegacyDependencyAuditV342
```

Serve solo a indicare che la V342 e' stata applicata.

## Funzionalita preservate

Nessun cambio funzionale. Restano invariati Calciomercato, Listone, Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, Netlify Functions, news/share e navigazione mobile.
````

---

## 44. `refactor/MANUAL_QA_INFO_V360.md`

- Percorso originale: `refactor/MANUAL_QA_INFO_V360.md`
- Dimensione originale: 974 byte
- SHA-256: `6d70cedec4c60d2569acade4b1f53e96fcf72c279c40a0467a0d37d1104798ef`

````markdown
# Manual QA Info V360

## Contesto

Dopo V357/V358 la checklist QA era utilizzabile da interfaccia, ma alcuni test non erano abbastanza chiari. La V360 aggiunge una spiegazione per ogni test direttamente nella card.

## Implementazione

Le descrizioni sono aggiunte ai check del tracker QA come campo `info`. Il pannello Admin renderizza il campo con un elemento `details/summary`:

```html
<details class="manual-qa-card-v358__info">
  <summary>i</summary>
  <p>...</p>
</details>
```

Questo evita nuovo stato JavaScript e mantiene accessibilita' base da tastiera/browser.

## Compatibilita'

- API pubblica invariata: `window.ZonaOrientaleManualQaPanelV358`.
- Storage invariato: `zonaorientale.manualQa.v356`.
- Nessun cambio su stato checklist gia' salvato.
- Export Markdown arricchito con la colonna `Cosa controllare`.

## Rischi mitigati

- Nessuna chiamata Firebase.
- Nessuna modifica a funzioni reali.
- Nessuna modifica a feed o JSON.
- Nessuna rimozione file.
````

---

## 45. `refactor/MANUAL_QA_PANEL_V357.md`

- Percorso originale: `refactor/MANUAL_QA_PANEL_V357.md`
- Dimensione originale: 539 byte
- SHA-256: `91b042b428296bc143d59f00e9b6b09c693f967d7a55997e48cac2dbbe108069`

```markdown
# Manual QA Panel V357

## Scopo

Portare la checklist post-refactor da console a interfaccia grafica, solo per admin.

## Comportamento

- Pannello bottom fixed.
- Espandi/Riduci.
- Pulsanti Apri sezione / Simula proposta.
- Stato OK/Problema/Saltato/Reset.
- Note salvate localmente.
- Export Markdown.

## Sicurezza funzionale

Non scrive su Firebase, non modifica JSON, non invoca Netlify Functions. L'unica azione automatica potenzialmente attiva e il simulatore locale trade V255/V349, che non scrive su Firebase per le simulazioni.
```

---

## 46. `refactor/MANUAL_QA_PANEL_V358.md`

- Percorso originale: `refactor/MANUAL_QA_PANEL_V358.md`
- Dimensione originale: 395 byte
- SHA-256: `91e62b442e8a6c95c208213f1abb7bee4e071c847ae1d02cfb768bcd8eaed701`

```markdown
# Manual QA Panel V358

La V358 rende piu pratico il pannello QA Admin:

- gruppi per area;
- filtro area;
- progress bar;
- reset per area;
- auto-check di marker tecnici;
- copia riepilogo Markdown;
- esportazione riepilogo.

Gli auto-check sono solo un aiuto: non sostituiscono il test manuale.

Nessuna scrittura Firebase. Nessun cambio a feed, archivi, Listone, Fantamercato o Admin reale.
```

---

## 47. `refactor/MANUAL_QA_STABILITY_V363.md`

- Percorso originale: `refactor/MANUAL_QA_STABILITY_V363.md`
- Dimensione originale: 1020 byte
- SHA-256: `1bb63d177d1fd16a7a06bca0f712a342b329c4c82c76c57d9dbefcf423f5a961`

````markdown
# Manual QA stability V363

## Scopo

Rendere usabile la checklist QA Admin dopo l'aggiunta del pannello simulatore target presidente V362.

## Interventi

### Layout

Il box trade simulator ora e' full width nella griglia QA:

```css
.manual-qa-card-v358.is-trade-simulator-v363 { grid-column: 1 / -1; }
```

Il select del destinatario usa una riga responsive e non sfora:

```css
.manual-qa-trade-v361__target-row { grid-template-columns: minmax(0, 1fr) auto; }
.manual-qa-trade-v361__target select { min-width: 0; max-width: 100%; }
```

### Stato UI

L'auto-refresh non ridisegna il pannello quando:

- il focus e' dentro la checklist;
- una `details` informativa e' aperta;
- il pannello e' espanso e l'utente sta interagendo.

### Compatibilita

La V363 non cambia storage key V362, per conservare eventuali simulazioni gia create:

- `zonaorientale.tradeSimulatorTargetPanel.v362.rows`
- `zonaorientale.tradeSimulatorTargetPanel.v362.selectedTarget`

## Rischio

Basso. La modifica e' solo UI Admin/localStorage.
````

---

## 48. `refactor/MANUAL_QA_TRACKER_V356.md`

- Percorso originale: `refactor/MANUAL_QA_TRACKER_V356.md`
- Dimensione originale: 832 byte
- SHA-256: `39312293d5a5f4268e09b623df6d88764e5f77a4101027b7235cab84c0c4aedc`

````markdown
# Manual QA tracker V356

## Obiettivo

Dopo il ciclo V333-V355, la V356 introduce uno strumento leggero per tracciare da console i test manuali completati. Lo strumento non modifica i dati applicativi e non scrive su Firebase.

## Implementazione

In `assets/app.js` e stato aggiunto:

```js
window.ZonaOrientaleManualQaTrackerV356
```

Il tracker contiene una lista di checkpoint funzionali e salva lo stato in `localStorage`.

## Perche e sicuro

- Nessun listener globale invasivo.
- Nessuna modifica DOM automatica.
- Nessuna chiamata Firebase/Netlify.
- Nessuna rimozione di file.
- I comandi sono disponibili solo se invocati dalla console.

## Checkpoint coperti

Auth/Admin, Dashboard Presidente, Diagnostica dati, Calciomercato, Listone, Rose, Competizioni, Fantamercato, simulatore trade, mobile navigation e News/share.
````

---

## 49. `refactor/MINOR_LEGACY_AUDIT_V346.md`

- Percorso originale: `refactor/MINOR_LEGACY_AUDIT_V346.md`
- Dimensione originale: 1015 byte
- SHA-256: `de6529977e411c1ef85ce950beda97fa9176218465533b05807b17c91c22a096`

```markdown
# Refactor V346 - Audit candidati legacy minori

## Tipo intervento

Audit-only. Nessuna cancellazione e nessun cambio comportamento.

## File aggiunti

- `static/zonaorientale/tools/audit-minor-legacy-v346.mjs`
- `docs/zonaorientale/audit/MINOR_LEGACY_CANDIDATES_V346.md`
- `docs/zonaorientale/FUNZIONALITAV346.md`
- `docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V346.md`
- `docs/zonaorientale/release/RELEASE_V346_MINOR_LEGACY_AUDIT.md`

## Runtime marker

`window.ZonaOrientaleMinorLegacyAuditV346`

## Perche non rimuove file

Dopo V343-V345 restano candidati minori con rischio non nullo: simulatori trade, workflow Admin storico, hotfix mobile e modulo competizioni. Sono candidati plausibili, ma non abbastanza sicuri per una rimozione cumulativa.

## Prossima V consigliata

V347: rimozione controllata del solo duplicato `assets/js/trade-notification-simulator-v255.js`, lasciando attivo `assets/js/dev/trade-notification-simulator-v255.js`, solo se l'audit conferma assenza di import/link runtime.
```

---

## 50. `refactor/REGRESSION_SMOKE_SUITE_V355.md`

- Percorso originale: `refactor/REGRESSION_SMOKE_SUITE_V355.md`
- Dimensione originale: 1149 byte
- SHA-256: `439e6a23bc88ee4e5f5cc647d46b5fd985e8f76920bbcf3e4f53e2679849e153`

````markdown
# REGRESSION_SMOKE_SUITE_V355

## Obiettivo

La V355 aggiunge una suite di controllo post-refactor. Non cambia comportamento utente e non rimuove file.

## File aggiunto

```bash
static/zonaorientale/tools/audit-regression-smoke-v355.mjs
```

## Marker runtime

```js
window.ZonaOrientaleRegressionSmokeSuiteV355
```

Il marker espone:

- versione V355;
- aree manuali da testare;
- controlli statici attesi;
- `runSmokeTest()`.

## Perche serve

Dopo il ciclo V333-V354 sono stati spostati moduli, rimossi file legacy e aggiunti wrapper di compatibilita. Prima di continuare con refactor o rimozioni, e necessario avere un punto di verifica stabile.

## Regole per il prossimo assistente

- Non cancellare file solo perche segnalati come legacy.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
- Ogni nuova release deve aggiornare footer, cache-buster, `DEPLOY_EXPECTED_VERSION_V181`, changelog, handoff e `FUNZIONALITAVxxx.md`.
- Ogni modifica deve dichiarare le funzionalita a rischio e come vengono preservate.
- Prima di riprendere cleanup, completare `docs/zonaorientale/test/TEST_MANUALE_COMPLETO_V355.md`.
````

---

## 51. `refactor/THEME_COMPETITIONS_AUDIT_V353.md`

- Percorso originale: `refactor/THEME_COMPETITIONS_AUDIT_V353.md`
- Dimensione originale: 1072 byte
- SHA-256: `e40ab145ab4183879c04435b639d0a1abfc79cf6908b3756be5d05b47d8571f4`

```markdown
# Refactor V353 - Audit tema/competizioni

La V353 non modifica logica runtime. Aggiunge un audit mirato per chiarire lo stato di due candidati legacy rimasti:

1. `assets/css/refactor/theme-light-suspended.css`
2. `assets/js/domain/competitions.js`

## Motivazione

Dopo le rimozioni controllate V343-V352, questi file risultano ancora candidati ma con rischio non nullo:

- il CSS Light sospeso puo servire come rollback/archivio per una futura ricostruzione del tema chiaro;
- il modulo `domain/competitions.js` duplica helper competizioni gia inline in `assets/app.js`, ma l'area Competizioni e delicata.

## Scelta tecnica

La V353 introduce solo:

- audit CLI `audit-theme-competitions-v353.mjs`;
- marker runtime `window.ZonaOrientaleThemeCompetitionsAuditV353`;
- documentazione e matrice decisionale.

Nessun file viene rimosso.

## Prossimo step consigliato

V354: consolidamento finale dei cleanup e programma prossime attivita, oppure audit piu approfondito di `domain/competitions.js` con test manuale delle pagine Competizioni prima di una rimozione futura.
```

---

## 52. `refactor/TRADE_SIMULATOR_DEV_AUDIT_V348.md`

- Percorso originale: `refactor/TRADE_SIMULATOR_DEV_AUDIT_V348.md`
- Dimensione originale: 1021 byte
- SHA-256: `8c8e8d21ac93b8bf3a421f572dab494d0a8b5eaa0d61b57fd4564e3425445db2`

````markdown
# Refactor/Audit V348 - Simulatore trade dev

La V348 non rimuove codice. Serve a consolidare lo stato dopo la rimozione V347 del duplicato top-level.

## Decisione

- Modulo attivo: `assets/js/dev/trade-notification-simulator-v255.js`.
- Modulo candidato review: `assets/js/dev/trade-notification-simulator-v254.js`.
- Nessuna modifica a logiche Fantamercato o Firebase.
- Nessuna modifica al rendering o alle sezioni utente/admin.

## Perche non rimuovere subito V254

Il file V254 non e' importato, ma riguarda un'area delicata: simulazione notifiche trade e test Fantamercato. La V255 conserva alias V254, ma la rimozione fisica deve essere fatta solo dopo test browser manuale del simulatore.

## Tool

```bash
static/zonaorientale/tools/audit-trade-simulator-dev-v348.mjs
```

## Marker runtime

```js
window.ZonaOrientaleTradeSimulatorDevAuditV348
```

## Prossimo passo consigliato

V349: rimozione controllata di `assets/js/dev/trade-notification-simulator-v254.js`, solo se i test manuali V255 sono confermati.
````

---

## 53. `REGRESSION_TESTS.md`

- Percorso originale: `REGRESSION_TESTS.md`
- Dimensione originale: 8320 byte
- SHA-256: `e97aa75a456f3df5f6810d184396d26238bf70a43417863c89fa4c3ba8197682`

````markdown
# Regression tests - ZonaOrientale

## Test automatici minimi

Da `static/zonaorientale`:

```bash
node tools/audit-section-registry-v401.mjs
node tools/audit-role-backgrounds-v405r2.mjs
node --check assets/app.js
node --check assets/role-backgrounds-v405r2.js
find assets -name '*.js' -type f -print0 | xargs -0 -n 1 node --check
```

Se la modifica tocca `netlify/functions`:

```bash
find ../netlify/functions -name '*.js' -type f -print0 | xargs -0 -n 1 node --check
```

Se viene generato uno zip:

```bash
unzip -t NOME_ZIP.zip
```


## Checklist V405r2 colori ruolo

Verificare che nelle tabelle giocatori siano visibili sfondi tenui per ruolo:

- portieri arancione;
- difensori verde;
- centrocampisti blu/azzurro;
- attaccanti rosso.

Controllare almeno Listone, Svincolati/Rose, schede squadra e vista mobile. Dopo filtri o ordinamenti le righe devono mantenere la colorazione.

Comando dedicato:

```bash
node tools/audit-role-backgrounds-v405r2.mjs
```

## Checklist V401 section registry

Verificare che:

- `assets/js/core/section-registry-v401.js` sia caricato prima di `assets/app.js`;
- `window.ZonaOrientaleSectionRegistryV401` esista;
- `window.ZonaOrientaleSectionRefactorV401.runSmokeTest().ok` sia `true` in console;
- `#soccerdata` venga ancora riportato al Listone;
- il link Soccer Data non compaia in navbar desktop/mobile;
- Admin resti admin-only.

## Checklist funzionale pubblica

Verificare almeno:

- Home/Dashboard si apre senza errori console.
- Navbar desktop funzionante.
- Bottom nav mobile funzionante.
- Menu Altro mobile funzionante.
- Pulsante Su funzionante.
- News/Comunicati visibili.
- Link WhatsApp comunicato copiabile/apribile se toccati i comunicati.
- Listone visibile e filtrabile.
- Rose pubbliche e pagina squadra leggibili.
- Competizioni leggibili.
- Calciomercato apre feed/card.
- Archivio/Statistiche/Confronta aprono senza errori.
- Regolamento raggiungibile.

## Checklist Admin

Se la modifica tocca Admin o dati:

- Login admin riconosciuto.
- Pannello Admin caricato.
- Richieste presidenti leggibili.
- Comunicati salvabili/approvabili se toccati.
- Diagnostica dati apribile.
- Convertitore listone Excel non scollegato.
- Snapshot pubblici: pulsanti visibili e date aggiornate.
- Export/overlay generati correttamente.

## Checklist Presidente/Fantamercato

Se vengono toccati trattative, notifiche o Dashboard Presidente:

- Utente presidente approvato entra correttamente.
- Dashboard Presidente mostra squadra/dati.
- Trattative in entrata/uscita visibili.
- Accetta/Rifiuta funzionano secondo rules.
- Badge/notifiche si aggiornano.
- Esiti letti/non letti non si resettano erroneamente.
- Fantamercato pubblico e interno non vengono confusi.

## Checklist Listone

Se viene toccato Listone/Excel/storico:

- Listone pubblico carica.
- Ricerca funziona.
- Filtri funzionano.
- Colonna Modifiche/storico funziona.
- Usciti storici, se previsti, funzionano.
- Export admin resta solo admin.
- Mobile: celle non si sovrappongono e prima colonna resta leggibile.

## Checklist Rose

Se vengono toccate Rose o pagine squadra:

- Lista rose carica.
- Pagina squadra apre.
- Tabella rosa mobile resta leggibile.
- Dati statici e snapshot restano coerenti.
- Nessun errore su giocatori senza dati accessori.

## Checklist Calciomercato

Se vengono toccati feed/card/player timeline:

- Feed Calciomercato carica.
- Card leggibili desktop/mobile.
- Click su titolo/immagine apre articolo.
- Tag giocatore, se presente, apre scheda/timeline.
- Archivio statico resta compatibile.
- Netlify Function feed funziona se modificata.

## Checklist Soccer Data

Stato attuale: sezione rimossa in V398.

Verificare che:

- non compaia link Soccer Data in navbar desktop;
- non compaia link Soccer Data in menu mobile;
- aprendo `#soccerdata` si venga reindirizzati al Listone;
- non ci siano errori console dovuti all'assenza della sezione;
- il registry V401 non la consideri pagina attiva.

## Checklist documentazione

Ad ogni modifica futura:

- aggiornare `AI_HANDOFF_ZONAORIENTALE_CURRENT.md` se cambia stato;
- aggiornare `CURRENT_STATE.md`;
- aggiornare `CHANGELOG_CONSOLIDATO.md` sempre;
- aggiornare `ARCHITETTURA_E_DATI.md` se cambiano architettura/dati;
- aggiornare `OPERATIVITA_ADMIN_E_RELEASE.md` se cambiano procedure;
- aggiornare `REGRESSION_TESTS.md` se cambia la checklist;
- aggiornare lo storico tematico se serve conservare dettaglio lungo;
- evitare nuovi file storici per-versione.


## Checklist V402 - Regolamento modulare

- Aprire `#regolamento` da desktop: titolo, indice e 13 sezioni devono comparire.
- Aprire `#regolamento` dal menu mobile Altro: stessa resa e nessuna pagina bianca.
- Verificare che i link indice `#rules-*` continuino a scorrere alla sezione corretta.
- Verificare console browser senza errori da `regolamento-section-v402.js`.
- Verificare che `#soccerdata` continui a reindirizzare al Listone.
- Verificare che Dashboard, Listone, Competizioni e Admin si aprano come prima.

Comandi V402:

```bash
node tools/audit-compare-section-v403.mjs
node tools/audit-regolamento-section-v402.mjs
node tools/audit-section-registry-v401.mjs
node tools/audit-soccer-data-removed-v398.mjs
node --check assets/app.js
find assets -name '*.js' -type f -print0 | xargs -0 -n 1 node --check
```


## Checklist V403 - Confronta modulare

- `assets/js/sections/compare-section-v403.js` presente.
- `index.html` contiene host `data-section-template="compare-v403"`.
- `index.html` non contiene piu il template completo Confronta inline.
- Il modulo conserva `compareTitle`, `teamCompareControlsV195` e `teamCompareContentV195`.
- `assets/js/core/section-registry-v403.js` punta `compare.source` al modulo V403.
- Alias registry V401/V402/V403 disponibili.
- `#compare` si apre da desktop e mobile.
- I controlli e il risultato del confronto squadre continuano a essere popolati dalla logica esistente in `assets/app.js`.

Comandi V403:

```bash
node tools/audit-compare-section-v403.mjs
node tools/audit-regolamento-section-v402.mjs
node tools/audit-section-registry-v401.mjs
node tools/audit-role-backgrounds-v405r2.mjs
node --check assets/app.js
node --check assets/role-backgrounds-v405r2.js
node --check assets/js/core/section-registry-v403.js
node --check assets/js/sections/compare-section-v403.js
find assets -name '*.js' -type f -print0 | xargs -0 -n 1 node --check
```



## Checklist V405 - Archivio modulare

- `index.html` contiene host Archivio con `data-section-template="archive-v405"`.
- `assets/js/sections/archive-section-v405.js` contiene `archiveTitle`, `seasonArchiveControlsV196`, `seasonArchiveContentV196`.
- `assets/js/core/section-registry-v405.js` punta `archive.source` al modulo V405.
- Alias registry V401/V402/V403/V404 disponibili.
- `#archive` resta raggiungibile da desktop e mobile.
- I controlli stagione e il contenuto archivio vengono popolati dalla logica esistente.
- Nessuna modifica o regressione su Regolamento, Confronta, Statistiche, Listone, Rose, Admin e Snapshot.

Comandi V405:

```bash
node tools/audit-archive-section-v405.mjs
node tools/audit-stats-section-role-colors-v404.mjs
node tools/audit-compare-section-v403.mjs
node tools/audit-regolamento-section-v402.mjs
node tools/audit-section-registry-v401.mjs
node tools/audit-soccer-data-removed-v398.mjs
```

## Checklist V404 - Statistiche modulari e colori ruolo

Verificare:

- `assets/js/sections/stats-section-v404.js` esista e contenga `historicalStatsSummaryV193` e `historicalStatsContentV193`.
- `assets/js/core/section-registry-v404.js` punti `stats.source` al modulo V404.
- Alias registry V401/V402/V403/V404 disponibili.
- `#stats` si apra da desktop e mobile.
- La logica delle statistiche storiche continui a popolare summary e contenuto.
- Le tabelle giocatori abbiano colori ruolo tenui: P arancione, D verde chiaro, C azzurro/blu tenue, A rosso tenue.
- Listone, Svincolati, Rose, Area squadra e schede squadra non perdano ordinamenti, filtri o layout mobile.

Comandi V404:

```bash
node tools/audit-stats-section-role-colors-v404.mjs
node tools/audit-compare-section-v403.mjs
node tools/audit-regolamento-section-v402.mjs
node tools/audit-section-registry-v401.mjs
node tools/audit-soccer-data-removed-v398.mjs
node --check assets/app.js
find assets -name '*.js' -type f -print0 | xargs -0 -n 1 node --check
```
````

---

## 54. `release/RELEASE_V330_TMW_TILE_TESTUALE.md`

- Percorso originale: `release/RELEASE_V330_TMW_TILE_TESTUALE.md`
- Dimensione originale: 1524 byte
- SHA-256: `f795879bd138fbe97f0f537ceab04958d7d0d7fe96f30c4111d94d20ec4b05d3`

```markdown
# Release V330 - Fallback testuale TMW squadra

## Sintesi

V330 rifinisce la V329: quando un articolo proveniente da una fonte TMW squadra non ha una vera immagine di anteprima, la card mostra una tile generata con testo `TMW - <NomeSquadra>` invece dello scudetto/logo squadra.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/css/refactor/calciomercato.css`
- `static/zonaorientale/assets/calciomercato/links.json`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`
- `netlify/functions/calciomercato-feed.js`
- `docs/zonaorientale/CHANGELOG_CONSOLIDATO.md`
- `docs/zonaorientale/calciomercato/CALCIOMERCATO_TMW_TILE_TESTUALE_V330.md`
- `docs/zonaorientale/release/RELEASE_V330_TMW_TILE_TESTUALE.md`

## Controlli funzionali

- `node --check static/zonaorientale/assets/app.js`
- `node --check netlify/functions/calciomercato-feed.js`
- `python3 -m json.tool static/zonaorientale/assets/calciomercato/links.json`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-assets-v298.sh`
- `static/zonaorientale/tools/audit-css-v300.sh`

## Funzionalita da non perdere

- Fonti TMW squadra V329.
- Download archivio Calciomercato con limiti V329.
- Parser RSS e HTML Calciomercato.
- Fallback favicon/tile per fonti non TMW.
- Card mobile V328.
- Toggle Solo Admin V327.
- Rifiniture UI V326.
- Listone, Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.
```

---

## 55. `release/RELEASE_V342_LEGACY_DEPENDENCIES_AUDIT.md`

- Percorso originale: `release/RELEASE_V342_LEGACY_DEPENDENCIES_AUDIT.md`
- Dimensione originale: 1454 byte
- SHA-256: `d9ae9dc197d4d7f7d5d8d28183cfde5564a6f0066d219e7ccdd38aab93e9b428`

````markdown
# Release V342 - Audit dipendenze legacy protetto

Data: 05/06/2026

## Tipo modifica

Refactor/audit protetto. Nessuna rimozione file.

## File modificati principali

```text
static/zonaorientale/assets/app.js
static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
docs/zonaorientale/CHANGELOG_CONSOLIDATO.md
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md
docs/zonaorientale/FUNZIONALITAV342.md
docs/zonaorientale/audit/LEGACY_DEPENDENCIES_MATRIX_V342.md
docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V342.md
docs/zonaorientale/refactor/LEGACY_DEPENDENCIES_AUDIT_V342.md
```

## Dettagli

- Aggiunto `audit-legacy-dependencies-v342.mjs`.
- Aggiunta diagnostica runtime `window.ZonaOrientaleLegacyDependencyAuditV342`.
- Aggiornato `check-zonaorientale.sh` con controlli V342.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V342.
- Documentata la matrice dei candidati legacy.

## Funzionalita preservate

- Calciomercato feed, filtri, renderer, card, timeline giocatore e archivio.
- Listone, filtro Modifiche, export CSV solo Admin.
- Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.
- Netlify Functions e dati statici.
- Mobile navigation e pagine standalone.

## Note

Non modificato `docs/zonaorientale/FUNZIONALITA'.md`.
````

---

## 56. `release/RELEASE_V346_MINOR_LEGACY_AUDIT.md`

- Percorso originale: `release/RELEASE_V346_MINOR_LEGACY_AUDIT.md`
- Dimensione originale: 942 byte
- SHA-256: `1dbd9562fa058a9ed547844031b30d630f76cf46e730727fe4d889e644886acd`

````markdown
# Release V346 - Minor legacy audit

## Sintesi

V346 introduce un audit dei candidati legacy minori rimasti dopo le pulizie V343-V345. Non rimuove file e non cambia UI/dati.

## Modifiche

- Aggiunto `audit-minor-legacy-v346.mjs`.
- Aggiunta diagnostica `window.ZonaOrientaleMinorLegacyAuditV346`.
- Aggiornato `check-zonaorientale.sh`.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V346.
- Aggiunta documentazione V346.

## Test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/tools/audit-minor-legacy-v346.mjs
static/zonaorientale/tools/audit-minor-legacy-v346.mjs
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh --quiet
static/zonaorientale/tools/audit-css-v300.sh
```

## Funzionalita preservate

Nessuna modifica intenzionale a UI, feed, dati, Firebase, Netlify, Calciomercato, Listone, Rose, Admin o mobile navigation.
````

---

## 57. `release/RELEASE_V348_TRADE_SIMULATOR_DEV_AUDIT.md`

- Percorso originale: `release/RELEASE_V348_TRADE_SIMULATOR_DEV_AUDIT.md`
- Dimensione originale: 851 byte
- SHA-256: `0cee38c5ebdab85b7eea84e76ace727a58e31a911de042b7c84f7f21a8f79010`

````markdown
# Release V348 - Audit simulatore trade dev

Data: 05/06/2026

## Tipo release

Audit/refactor protetto. Nessuna rimozione file.

## Modifiche

- Aggiunto `audit-trade-simulator-dev-v348.mjs`.
- Aggiunto marker runtime `window.ZonaOrientaleTradeSimulatorDevAuditV348`.
- Aggiornato `check-zonaorientale.sh` con controlli V348.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V348.
- Aggiornata documentazione V348.

## Rischio

Basso. Nessuna funzionalita runtime e' stata modificata. L'area sensibile e' Fantamercato/notifiche trade, ma la V348 verifica solo gli agganci.

## Test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/tools/audit-trade-simulator-dev-v348.mjs
static/zonaorientale/tools/audit-trade-simulator-dev-v348.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```
````

---

## 58. `release/RELEASE_V353_THEME_COMPETITIONS_AUDIT.md`

- Percorso originale: `release/RELEASE_V353_THEME_COMPETITIONS_AUDIT.md`
- Dimensione originale: 848 byte
- SHA-256: `6b40b7d7495fac0b7589d77bac3c7297e1479ff15036e7628e97a2afb8f9b5cb`

````markdown
# Release V353 - Audit tema/competizioni legacy

Data: 05/06/2026

## Tipo release

Audit/refactor protetto, senza cambio comportamento.

## Modifiche

- Aggiunto `audit-theme-competitions-v353.mjs`.
- Aggiunto marker runtime `ZonaOrientaleThemeCompetitionsAuditV353`.
- Documentato stato di `theme-light-suspended.css` e `domain/competitions.js`.
- Aggiornati footer, cache-buster, `DEPLOY_EXPECTED_VERSION_V181` e check globale a V353.

## Rimozioni

Nessuna.

## Test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/tools/audit-theme-competitions-v353.mjs
static/zonaorientale/tools/audit-theme-competitions-v353.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

## Decisione

Lasciare entrambi i file sotto osservazione. Eventuale rimozione futura solo con test manuale su tema/Competizioni.
````

---

## 59. `release/RELEASE_V355_REGRESSION_SMOKE_SUITE.md`

- Percorso originale: `release/RELEASE_V355_REGRESSION_SMOKE_SUITE.md`
- Dimensione originale: 929 byte
- SHA-256: `9e0e80fa86072256ab3de286ccd7b92d30d1b1448679de6c4d943eff708e2946`

````markdown
# RELEASE_V355_REGRESSION_SMOKE_SUITE

## Tipo release

Chore/refactor safety. Nessun cambio funzionale.

## Modifiche

- Aggiunto audit statico regressione V355.
- Aggiunto marker runtime V355.
- Aggiunta checklist manuale completa.
- Aggiornati documenti e handoff.
- Aggiornata versione runtime/cache-buster/footer a V355.

## Rischio

Basso. Non sono stati modificati feed, dati, CSS funzionali, Netlify Functions o Firebase.

## Test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/tools/audit-regression-smoke-v355.mjs
static/zonaorientale/tools/audit-regression-smoke-v355.mjs
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh --quiet
static/zonaorientale/tools/audit-css-v300.sh
node --check netlify/functions/calciomercato-feed.js
```

## Note

Dopo V355 non procedere con nuove rimozioni senza completare la checklist manuale.
````

---

## 60. `release/RELEASE_V356_MANUAL_QA_TRACKER.md`

- Percorso originale: `release/RELEASE_V356_MANUAL_QA_TRACKER.md`
- Dimensione originale: 683 byte
- SHA-256: `4847f7b0f57b9e26aa71d634f63584939d735dcf5f61db9ba01ad64c5ee9db07`

```markdown
# Release V356 - Manual QA tracker

Data: 05/06/2026

## Tipo

Supporto QA/documentazione. Nessun cambio funzionale.

## Modifiche

- Aggiunto `window.ZonaOrientaleManualQaTrackerV356`.
- Aggiunto audit `audit-manual-qa-tracker-v356.mjs`.
- Aggiornato `check-zonaorientale.sh`.
- Aggiornati footer, cache-buster e versione runtime a V356.
- Aggiunti documenti V356.

## Test

- `node --check assets/app.js`
- `node --check tools/audit-manual-qa-tracker-v356.mjs`
- `tools/audit-manual-qa-tracker-v356.mjs`
- `tools/check-zonaorientale.sh`
- audit asset/CSS

## Note

Non sono stati modificati dati, archivi, Netlify Functions, Firebase, Listone, Calciomercato, Fantamercato o Admin.
```

---

## 61. `release/RELEASE_V357_MANUAL_QA_PANEL.md`

- Percorso originale: `release/RELEASE_V357_MANUAL_QA_PANEL.md`
- Dimensione originale: 371 byte
- SHA-256: `003611c38aa26c69706d5514dd0fbd1fcbecef53ef7b7a7330b49b2c9f832a40`

```markdown
# Release V357 - Manual QA Panel

## Tipo

Utility Admin / QA post-refactor.

## Cambiamenti

- Aggiunta bottom area Checklist QA Admin.
- Persistenza locale degli stati QA.
- Export Markdown.
- Tool `audit-manual-qa-panel-v357.mjs`.

## Non cambiato

- Nessuna modifica a Firebase.
- Nessuna modifica a Netlify.
- Nessuna rimozione file.
- Nessun cambio a dati statici.
```

---

## 62. `release/RELEASE_V358_MANUAL_QA_PANEL.md`

- Percorso originale: `release/RELEASE_V358_MANUAL_QA_PANEL.md`
- Dimensione originale: 372 byte
- SHA-256: `f6a22a5c55eabf98426af5d1ce7f06ebf8380e073b55c0019c4d1bae868b4e51`

```markdown
# Release V358 - Manual QA panel migliorato

## Tipo

Test/supporto Admin. Nessuna modifica funzionale core.

## Contenuto

- Pannello QA Admin migliorato.
- Progress bar e filtro per area.
- Reset per area.
- Auto-check tecnici.
- Copia/esporta riepilogo.

## Test

- `node --check assets/app.js`
- `tools/audit-manual-qa-panel-v358.mjs`
- `tools/check-zonaorientale.sh`
```

---

## 63. `release/RELEASE_V360_MANUAL_QA_INFO.md`

- Percorso originale: `release/RELEASE_V360_MANUAL_QA_INFO.md`
- Dimensione originale: 671 byte
- SHA-256: `f0fd1011801ca0d23f7f5e0fe046eb7537cc43e9b67f16ba69f11182c4b5120f`

```markdown
# Release V360 - Checklist QA con informazioni

Data: 2026-06-05

## Sintesi

La V360 migliora la Checklist QA Admin aggiungendo una icona informativa `i` per ogni test, con descrizione operativa di cosa controllare.

## Modifiche

- Aggiunti testi `info` per tutti i controlli QA.
- Aggiunta UI `details/summary` con icona `i` in ogni card.
- Export Markdown QA aggiornato con la colonna `Cosa controllare`.
- Aggiunto audit `audit-manual-qa-info-v360.mjs`.
- Aggiornati footer, cache-buster e versione runtime a V360.

## Nessun cambio funzionale core

Nessuna modifica a Firebase, Netlify, Calciomercato, Listone, Rose, Competizioni, Fantamercato reale o Admin reale.
```

---

## 64. `release/RELEASE_V363_MANUAL_QA_STABILITY.md`

- Percorso originale: `release/RELEASE_V363_MANUAL_QA_STABILITY.md`
- Dimensione originale: 644 byte
- SHA-256: `97929216bc793afe5eb4220762620703fafeb888d8275e092386be7b408a7438`

```markdown
# Release V363 - Manual QA stability

## Tipo

Fix UX Admin QA.

## Summary

Stabilizza la checklist QA Admin e il pannello simulatore trade target presidente.

## Cambiamenti

- Card simulatore full-width.
- Select destinatario responsive.
- Auto-refresh non distruttivo.
- Info `i` persistente mentre aperta.
- Istruzioni di test presidente chiarite.

## Test

- `node --check static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/audit-manual-qa-stability-v363.mjs`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-assets-v298.sh --quiet`
- `static/zonaorientale/tools/audit-css-v300.sh`
```

---

## 65. `release/RELEASE_V367_SMOKE_TEST_PROTETTI.md`

- Percorso originale: `release/RELEASE_V367_SMOKE_TEST_PROTETTI.md`
- Dimensione originale: 1564 byte
- SHA-256: `615fc9c6fd78a4db1fac3681db6339880bff0938003a5f3c7bf760e975e04f35`

````markdown
# Release V367 - Smoke test protetti

Data: 05/06/2026

## Obiettivo

Aggiungere una cintura di sicurezza automatica prima dei prossimi refactor, senza cambiare comportamento del sito.

## Modifiche incluse

- Aggiornamento footer/cache-buster a V367.
- Aggiornamento `DEPLOY_EXPECTED_VERSION_V181` a `367`.
- Nuovo audit `tools/audit-protected-regression-v367.mjs`.
- Nuovo marker runtime `window.ZonaOrientaleProtectedRegressionSuiteV367`.
- Integrazione del nuovo audit in `tools/check-zonaorientale.sh`.
- Audit storici V358-V362 resi compatibili con runtime successivi, per evitare falsi negativi.
- Documentazione V367 aggiornata.

## Cosa non cambia

- Nessuna UI modificata.
- Nessuna logica Firebase modificata.
- Nessuna scrittura Firebase aggiunta.
- Nessun file runtime rimosso.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Nessuna modifica a rose, listone, competizioni, player, comunicati, calciomercato o workflow reali.

## Controlli principali

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-protected-regression-v367.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

Da console browser:

```js
ZonaOrientaleProtectedRegressionSuiteV367.runSmokeTest()
```

## Esito atteso

- Footer V367 visibile.
- Cache-buster allineati a `v=367`.
- Audit V367 superato.
- Marker V358-V367 presenti.
- Trattative simulate local-only ancora gestite senza Firebase writes.
- Trattative reali Firebase non alterate.
````

---

## 66. `test/MANUAL_QA_INFO_INTERFACCIA_V360.md`

- Percorso originale: `test/MANUAL_QA_INFO_INTERFACCIA_V360.md`
- Dimensione originale: 676 byte
- SHA-256: `e8a82fdafc3d13c27f9d5fa7e70dcca45126abd83a0bb0497399e5a150455590`

```markdown
# Test Manuale - Checklist QA con informazioni V360

1. Accedi come admin.
2. Apri la bottom area `Checklist QA Admin`.
3. Verifica che ogni card mostri una piccola `i` vicino al titolo del test.
4. Clicca la `i` su almeno questi test:
   - Calciomercato feed;
   - Filtri Calciomercato;
   - Diagnostica giocatori;
   - Fantamercato simulatore;
   - Mobile navigation.
5. Verifica che la spiegazione sia comprensibile e che il click non cambi pagina.
6. Segna un test come OK e aggiungi una nota.
7. Usa `Esporta` o `Copia riepilogo` e controlla che compaia anche la colonna `Cosa controllare`.

La checklist deve restare visibile solo admin e non deve scrivere su Firebase.
```

---

## 67. `test/MANUAL_QA_INTERFACCIA_V357.md`

- Percorso originale: `test/MANUAL_QA_INTERFACCIA_V357.md`
- Dimensione originale: 646 byte
- SHA-256: `d1ef5c159a6c670e1c25f753f09d5123ad6e2c43b38aa3f557ad75fcd3de4e07`

```markdown
# Manual QA da interfaccia - V357

## Uso

1. Accedi come admin.
2. In basso compare **Checklist QA Admin**.
3. Premi **Espandi**.
4. Usa i pulsanti Apri/Simula per andare alle sezioni.
5. Dopo il test segna OK, Problema o Saltato.
6. Aggiungi note se serve.
7. Usa **Esporta riepilogo** per ottenere un Markdown del giro QA.

## Test consigliati

- Calciomercato feed e archivio.
- Filtri Cerca/Da/A/fonte/squadra/topic.
- Timeline giocatore in modal.
- Solo Admin Calciomercato.
- Listone e filtro Modifiche.
- Rose e scheda giocatore.
- Competizioni.
- Fantamercato e simulatore trade.
- Admin Diagnostica con timestamp.
- Navigazione mobile.
```

---

## 68. `test/MANUAL_QA_INTERFACCIA_V358.md`

- Percorso originale: `test/MANUAL_QA_INTERFACCIA_V358.md`
- Dimensione originale: 567 byte
- SHA-256: `20674f3643a3486ea4b4e5d4c8bb972bdbb20ed84d6e3eb7f89d2e400fbea70a`

```markdown
# Manual QA interfaccia V358

1. Accedi come Admin.
2. Apri la bottom area `Checklist QA Admin`.
3. Usa i filtri area per concentrarti su Calciomercato, Admin, Fantamercato, ecc.
4. Clicca `Apri/Simula`, prova la funzione e segna `OK` o `Problema`.
5. Usa `OK area` solo quando tutti i test di quell'area sono stati verificati.
6. Usa `Auto-check` solo come supporto tecnico: non sostituisce il controllo manuale.
7. Usa `Copia riepilogo` o `Esporta` per condividere lo stato.

I dati restano nel browser e possono essere cancellati con `Reset tutto` o `Reset area`.
```

---

## 69. `test/MANUAL_QA_STABILITY_INTERFACCIA_V363.md`

- Percorso originale: `test/MANUAL_QA_STABILITY_INTERFACCIA_V363.md`
- Dimensione originale: 862 byte
- SHA-256: `4ffff79c40573ce5a487650568ca2988daefc738a86807311ce9fed68ab3769a`

```markdown
# Test manuale interfaccia V363

## Checklist QA

1. Accedi come Admin.
2. Apri la Checklist QA Admin.
3. Filtra `Fantamercato`.
4. Clicca sulla `i` di un test.
5. Attendi piu di 7 secondi.
6. La spiegazione deve restare aperta.
7. Seleziona una squadra nel menu simulazione presidente.
8. Attendi piu di 7 secondi.
9. Il menu non deve tornare al valore precedente.
10. Verifica che il box simulatore non sfori lateralmente.

## Simulazione presidente

1. Da Admin scegli una squadra/presidente.
2. Premi `Simula per presidente`.
3. Esci dall'admin.
4. Accedi come quel presidente nello stesso browser.
5. Apri Dashboard Presidente/Fantamercato.
6. Verifica badge e card proposta ricevuta.
7. Premi `Rifiuta` o `Accetta`.
8. Non deve comparire `Missing or Insufficient permissions`.

## Pulizia

Da Admin, torna nella Checklist QA e premi `Pulisci simulazioni`.
```

---

## 70. `test/MANUAL_QA_TRACKER_COMANDI_V356.md`

- Percorso originale: `test/MANUAL_QA_TRACKER_COMANDI_V356.md`
- Dimensione originale: 840 byte
- SHA-256: `2c66ac605f18d505c98affcc2172bd7eb15cbd14d8cc8066ab0ae31b0fd5dc38`

````markdown
# Comandi Manual QA tracker V356

Aprire il sito, poi la console browser.

## Elenco check

```js
ZonaOrientaleManualQaTrackerV356.print()
```

## Segnare un check OK

```js
ZonaOrientaleManualQaTrackerV356.mark('calciomercato-feed', 'ok', 'feed e archivio caricati')
```

## Segnare un problema

```js
ZonaOrientaleManualQaTrackerV356.mark('mobile-nav', 'ko', 'menu Altro da rivedere su iPhone')
```

## Saltare un check

```js
ZonaOrientaleManualQaTrackerV356.mark('trade-real', 'skipped', 'non testato per evitare scritture Firebase')
```

## Riepilogo

```js
ZonaOrientaleManualQaTrackerV356.summary()
```

## Esportazione Markdown

```js
ZonaOrientaleManualQaTrackerV356.exportMarkdown()
```

## Reset

```js
ZonaOrientaleManualQaTrackerV356.reset()
```

## Smoke test marker

```js
ZonaOrientaleManualQaTrackerV356.runSmokeTest()
```
````

---

## 71. `test/PRESIDENT_DASHBOARD_V369.md`

- Percorso originale: `test/PRESIDENT_DASHBOARD_V369.md`
- Dimensione originale: 865 byte
- SHA-256: `997cf9b6efd51c2d907f713ff187b3a8515aa57b90185692ca6a0b8ecd8b31fd`

````markdown
# Test V369 - Dashboard Presidente

## Test manuale presidente

1. Login come presidente approvato.
2. Aprire `Area squadra`.
3. Verificare la presenza della Dashboard presidente in alto.
4. Verificare metriche: saldo FM, giocatori, valore rosa, trattative, richieste, mercato.
5. Verificare che sotto restino le sezioni Proponi svincolo, Trattative e Invia comunicato squadra.
6. Usare i pulsanti rapidi della dashboard.
7. Creare una proposta di trattativa e verificare che il form funzioni ancora.
8. Accettare/Rifiutare una trattativa ricevuta e verificare che non torni in attesa.

## Test manuale Admin

1. Login Admin.
2. Verificare che il Cruscotto pre-deploy V368 sia ancora presente.
3. Eseguire la Checklist QA Admin.
4. Aprire home, competizione e scheda giocatore.

## Test console browser

```js
ZonaOrientalePresidentDashboardV369.runSmokeTest()
```
````

---

## 72. `test/PRESIDENT_NOTIFICATION_CENTER_V370.md`

- Percorso originale: `test/PRESIDENT_NOTIFICATION_CENTER_V370.md`
- Dimensione originale: 624 byte
- SHA-256: `a1192edf33f7a11d34fcf08a6f2f493b81c6ce6d93d689872c6ceb0f922a8f56`

```markdown
# Test manuale V370 - Centro notifiche presidente

1. Aprire il sito e verificare footer V370.
2. Login come presidente approvato.
3. Aprire Area squadra.
4. Verificare presenza Dashboard Presidente V369.
5. Verificare presenza Centro notifiche V370.
6. Verificare presenza sezioni operative sotto: proposta, trattative, comunicato.
7. Usare il pulsante Apri trattative.
8. Usare il pulsante Nuova proposta.
9. Simulare proposta Admin -> presidente e accettare/rifiutare.
10. Verificare che lo stato non torni In attesa.
11. Login Admin e verificare Cruscotto pre-deploy V368.
12. Aprire `competition.html` e `player.html`.
```

---

## 73. `test/SMOKE_TEST_AUTOMATICI_V367.md`

- Percorso originale: `test/SMOKE_TEST_AUTOMATICI_V367.md`
- Dimensione originale: 1002 byte
- SHA-256: `a34fa4c3da49a7bf2253bdf4d6665d911d5f39607800aabc88c2e446b9d9d403`

````markdown
# Test automatici V367

## Comandi

Dalla root della repo:

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-protected-regression-v367.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Test browser

Aprire il sito localmente e lanciare in console:

```js
ZonaOrientaleProtectedRegressionSuiteV367.runSmokeTest()
```

Il campo `ok` deve essere `true`.

## Test manuale minimo

1. Home: footer V367 visibile.
2. Menu desktop/mobile: navigazione base funzionante.
3. Admin: checklist QA apribile solo da profilo autorizzato.
4. Presidente: area protetta non visibile a utente non loggato.
5. Trade simulator: simulazione Admin verso presidente ancora local-only.
6. Trade action: Accetta/Rifiuta non deve tornare `IN ATTESA`.
7. Competizione: apertura dettaglio competizione.
8. Player: apertura scheda giocatore.
9. Calciomercato: archivio/diagnostica non devono sparire.
````

---

## 74. `test/TEST_MANUALE_COMPLETO_V355.md`

- Percorso originale: `test/TEST_MANUALE_COMPLETO_V355.md`
- Dimensione originale: 2006 byte
- SHA-256: `302d20a59bae84817ba12a4243a8bef63839c44bbe629948f92b73691da0cfc8`

````markdown
# TEST_MANUALE_COMPLETO_V355

Versione: V355  
Scopo: checklist manuale da eseguire prima di altri cleanup/refactor.

## Avvio locale

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire il sito locale e svuotare cache se necessario.

## 1. Smoke statico

```bash
static/zonaorientale/tools/audit-regression-smoke-v355.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

## 2. Console browser

```js
window.ZonaOrientaleRegressionSmokeSuiteV355.runSmokeTest()
```

Esito atteso: `ok: true`.

## 3. Calciomercato

- Aprire sezione Calciomercato.
- Verificare caricamento articoli.
- Provare ricerca testuale.
- Provare range Da/A.
- Provare filtri squadra/fonte/topic.
- Verificare card compatte.
- Verificare immagini/fallback TMW.
- Cliccare tag giocatore.
- Chiudere modal con X, sfondo, Escape.
- Espandere/Ridurre Solo Admin.

## 4. Listone

- Aprire Listone.
- Verificare filtro Modifiche.
- Verificare stile label/select.
- Se admin, provare export CSV modifiche.

## 5. Admin

- Aprire Area Admin.
- Aprire Diagnostica dati.
- Premere Aggiorna diagnostica.
- Verificare data/ora italiana aggiornata.
- Verificare Richieste presidenti e Converti listone.

## 6. Fantamercato e notifiche trade

Da console come presidente approvato:

```js
ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()
```

Poi cliccare Accetta/Rifiuta sulla card simulata.

Esito atteso:

- badge/notifica visibile;
- nessun errore `Missing or Insufficient permissions`;
- azione gestita localmente.

Pulizia:

```js
ZonaOrientaleTradeSimulatorV255.clearLocalSimulations()
```

## 7. Mobile

- Emulatore mobile o smartphone.
- Verificare bottom nav.
- Verificare menu Altro e icone.
- Verificare Calciomercato card compatte.
- Verificare Listone e Rose leggibili.

## 8. Pagine dettaglio

- Aprire `competition.html` da una competizione.
- Aprire `player.html` da un giocatore.
- Verificare mobile chrome.

## Esito

Annotare eventuali regressioni prima di procedere a V356 o a nuove rimozioni.
````

---

## 75. `test/TRADE_SIMULATOR_PANEL_INTERFACCIA_V361.md`

- Percorso originale: `test/TRADE_SIMULATOR_PANEL_INTERFACCIA_V361.md`
- Dimensione originale: 526 byte
- SHA-256: `4aba46cf05ac156502b2d6833c6c1fe300ea230d8059e68e346146b5679638c0`

```markdown
# Test interfaccia simulatore trade V361

1. Avviare il sito in locale.
2. Accedere come admin o presidente approvato.
3. Aprire la Checklist QA Admin.
4. Filtrare per area `Fantamercato`.
5. Premere `Simula ricevuta`.
6. Aprire Fantamercato/Dashboard e verificare la notifica.
7. Premere Accetta o Rifiuta sulla card simulata.
8. Verificare che non compaia `Missing or Insufficient permissions`.
9. Premere `Esito accettato` e `Esito rifiutato`.
10. Premere `Pulisci simulazioni` e verificare che i badge locali si spengano.
```

---

## 76. `test/TRADE_SIMULATOR_TARGET_INTERFACCIA_V362.md`

- Percorso originale: `test/TRADE_SIMULATOR_TARGET_INTERFACCIA_V362.md`
- Dimensione originale: 532 byte
- SHA-256: `f318e437974864dafc155d0b9992ce7ed340156ee88a450446d8889f002f49ef`

```markdown
# Test interfaccia V362 - Simula per presidente

1. Avvia il sito in locale.
2. Accedi come admin.
3. Apri la Checklist QA Admin.
4. Filtra `Fantamercato`.
5. Nel box simulatore scegli una squadra/presidente.
6. Premi `Simula per presidente`.
7. Verifica che compaia l'ultima azione V362.
8. Accedi come presidente destinatario nello stesso browser.
9. Verifica badge e card proposta ricevuta.
10. Premi `Rifiuta` o `Accetta`: non deve comparire `Missing or Insufficient permissions`.
11. Torna admin e premi `Pulisci simulazioni`.
```

---

## Audit V407 - Home e Calciomercato mobile

Aggiunto `tools/audit-home-calciomercato-mobile-v407.mjs`. Il controllo verifica:

- runtime, footer e cache-buster allineati a V407;
- home dashboard configurata a 4 comunicati e non piu a 3;
- regola mobile per nascondere le anteprime immagini del Calciomercato;
- assenza di `display:none` globale sulle anteprime, cosi il desktop resta invariato;
- assenza di riferimenti al refactor pagine standalone;
- preservazione della mobile safety introdotta in V406.


---

## Audit V408 - Rosa stile Listone

Nuovo controllo: `static/zonaorientale/tools/audit-roster-listone-style-v408.mjs`.

Verifica:

- `DEPLOY_EXPECTED_VERSION_V181 = "408"`;
- footer V408 su `index.html`, `competition.html`, `player.html`;
- cache-buster coerenti a `?v=408`;
- preservazione V407: home a 4 comunicati e Calciomercato mobile senza immagini anteprima;
- tabella Rosa espansa con classi `listone-table`, `roster-listone-skin-v408`, `listone-table-wrap`, `roster-listone-wrap-v408`;
- colonne Rosa non rimosse ne rinominate;
- blocco CSS V408 presente;
- nessun ritorno al refactor pagine standalone.

## Audit V419 - Archivio stagioni mobile

Nuovo audit aggiunto:

```bash
node tools/audit-archive-mobile-v419.mjs
```

Il gate verifica:

- runtime/footer/cache-buster a V419;
- rimozione della card separata Albo della stagione;
- label `Vincitore:` al posto di `Vincitore/Classifica`;
- vincitore competizione renderizzato con logo quando disponibile;
- metriche mobile 2x2 nella card stagione;
- card Squadre della stagione compatte su mobile;
- timeline dati con comunicati non limitati a 4 e ordinati temporalmente.

`tools/check-zonaorientale.sh` richiama anche l'audit V419 dopo il gate V418.

## Test e audit V425

- Aggiunto `tools/audit-mobile-scale-consolidation-v425.mjs`.
- Il gate verifica cache-buster/footer V425, marker runtime, variabili CSS canoniche e integrazione in `check-zonaorientale.sh`.
- `check-zonaorientale.sh` include il nuovo audit obbligatorio V425.

## V430 - Audit Admin mobile pulsante sopra

Aggiunto `tools/audit-admin-mobile-button-top-v430.mjs`, integrato in `tools/check-zonaorientale.sh`. Il controllo verifica versione V430, cache-buster, marker runtime e CSS necessario a posizionare Apri/Riduci sopra i titoli Admin mobile.

## Audit V441

Aggiunto `tools/audit-mantra-role-filters-v441.mjs` e integrato in `tools/check-zonaorientale.sh`. L audit verifica ordine ruoli Mantra, filtri Listone/Rose/Area Squadra, CSS dedicato e versione deploy V441.

## Audit V442

Aggiunto `tools/audit-panel-title-stack-v442.mjs` e integrato in `tools/check-zonaorientale.sh`. Il controllo verifica caricamento CSS V442 su `index.html`, `competition.html` e `player.html`, presenza delle regole per header con filtri/controlli/filtri Mantra e runtime atteso V442.


## Aggiornamento V446 - Percorsi dati statici da configurazione

La preparazione multi-lega ora include `dataPaths` in `static/zonaorientale/assets/league-config.json`. I reader pubblici possono risolvere da configurazione i percorsi di config pubblica, snapshot stagioni, honor snapshot, listoni, rose, competizioni, loghi e calciomercato, mantenendo i path ZonaOrientale come fallback. Non sono stati modificati Firebase, Admin, generator snapshot, Area Squadra presidenti, Bilanci mobile V438 o badge dispositivo V434.
