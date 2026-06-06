# V360 - Checklist QA Admin con informazioni

- Aggiunta una icona informativa `i` a ogni test della Checklist QA Admin.
- Ogni test ora spiega cosa controllare manualmente, senza dover usare la console o consultare docs separati.
- L export Markdown include la colonna `Cosa controllare`.
- Aggiunto `static/zonaorientale/tools/audit-manual-qa-info-v360.mjs`.
- Nessuna modifica a Firebase, Netlify Functions, Calciomercato, Listone, Fantamercato reale, Admin reale o `FUNZIONALITA'.md`.
- Aggiornati footer, cache-buster, `DEPLOY_EXPECTED_VERSION_V181`, audit e documentazione a V360.

## V359 - Diagnostica giocatori Calciomercato

- Aggiunto `assets/js/calciomercato/calciomercato-players-v359.js` come evoluzione protetta del matching V340.
- Preservato il matching conservativo e aggiunti alias sicuri, forma compatta per nomi con apostrofi/spazi e diagnostica articoli associati/non associati.
- Aggiunto controllo `calciomercato-player-diagnostics` nella Checklist QA Admin.
- Aggiunti `window.ZonaOrientaleCalciomercatoPlayerMatchingV359` e `window.ZonaOrientaleCalciomercatoPlayerDiagnosticsV359`.
- Nessuna modifica a Firebase, Netlify Functions, `links.json`, archivi JSON, JSON Listone o `FUNZIONALITA'.md`.
- Aggiornati footer, cache-buster, `DEPLOY_EXPECTED_VERSION_V181`, audit e documentazione a V359.

## V353 - Audit tema Light sospeso e dominio competizioni

- Aggiunto audit mirato per `assets/css/refactor/theme-light-suspended.css` e `assets/js/domain/competitions.js`.
- Confermato che il CSS Light resta conservato ma non importato dagli HTML.
- Confermato che il modulo `domain/competitions.js` resta conservato/non importato; le funzioni competizione canoniche restano inline in `assets/app.js`.
- Nessuna rimozione in V353.
- Aggiunti `audit-theme-competitions-v353.mjs`, `FUNZIONALITAV353.md`, handoff, matrice audit, refactor doc e release doc.
- Aggiornati footer, cache-buster, `DEPLOY_EXPECTED_VERSION_V181` e `check-zonaorientale.sh` a V353.


## V351 - Audit workflow pubblicazione Admin

- Aggiunto audit mirato per `assets/js/refactor/admin-publication-workflow-v213.js`.
- Confermato che il workflow Admin pubblicazione attivo resta inline in `assets/app.js`.
- Nessuna rimozione e nessun cambio comportamento.

## V348 - Audit simulatore trade dev (05/06/2026)

- Aggiunto audit mirato per `assets/js/dev/trade-notification-simulator-v254.js`.
- Confermato che il runtime resta su `assets/js/dev/trade-notification-simulator-v255.js`.
- Verificato che V255 mantiene alias console V254 e comandi diagnostici.
- Nessun file rimosso; V254 resta candidato review per una futura V dedicata.
- Aggiornati footer, cache-buster, `DEPLOY_EXPECTED_VERSION_V181`, check e documentazione.


## V346 - Audit candidati legacy minori

- Aggiunto `static/zonaorientale/tools/audit-minor-legacy-v346.mjs` per classificare i candidati legacy minori rimasti dopo V343-V345.
- La release e' audit-only: nessun file e' stato rimosso.
- Aggiunta diagnostica `window.ZonaOrientaleMinorLegacyAuditV346` con smoke test runtime.
- Candidati monitorati: simulatori trade legacy/duplicati, workflow Admin storico V213, hotfix mobile V166/V167, tema light sospeso e modulo dominio competizioni.
- Aggiornato `check-zonaorientale.sh` per verificare tool, marker e documentazione V346.
- Aggiunti `FUNZIONALITAV346.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V346.md`, `refactor/MINOR_LEGACY_AUDIT_V346.md`, `audit/MINOR_LEGACY_CANDIDATES_V346.md`, `release/RELEASE_V346_MINOR_LEGACY_AUDIT.md`.
- Non modificati `FUNZIONALITA'.md`, Netlify Functions, `links.json`, archivi Calciomercato, JSON Listone, Firebase/Auth/EmailJS, Listone runtime, Rose, Fantamercato interno, Dashboard Presidente o Admin generale.

## V344 - Cleanup JS legacy Calciomercato player

- Rimossi dal pacchetto i moduli legacy `assets/js/calciomercato/calciomercato-players-v335.js` e `assets/js/calciomercato/calciomercato-players-v337.js`, superati dal modulo attivo `calciomercato-players-v340.js`.
- Preservati in `assets/app.js` i wrapper pubblici con suffissi storici V335/V337 per non scollegare renderer card, tag giocatore e timeline modal.
- Aggiunto tool `static/zonaorientale/tools/audit-js-legacy-v344.mjs`.
- Aggiunta diagnostica runtime `window.ZonaOrientaleJsLegacyCleanupV344`.
- Aggiornati cache-buster, footer, `DEPLOY_EXPECTED_VERSION_V181` e `check-zonaorientale.sh` a V344.
- Nessuna modifica a Netlify Functions, `links.json`, archivi Calciomercato, JSON Listone, CSS, Firebase/Auth/EmailJS, Listone runtime, Rose, Fantamercato interno, Dashboard Presidente o Admin generale.

## V343 - Cleanup CSS legacy e Diagnostica Admin

- Aggiunto feedback visibile al bottone Admin `Aggiorna diagnostica`: vicino al tasto compare data/ora italiana dell'ultimo refresh nella sessione corrente.
- Aggiunta diagnostica runtime `window.ZonaOrientaleAdminDiagnosticsV343` con smoke test e stato funzioni Admin principali.
- Aggiunto tool `static/zonaorientale/tools/audit-admin-functions-v343.mjs` per verificare wiring Admin/Diagnostica/Richieste/Convertitore/Calciomercato Solo Admin.
- Aggiunto tool `static/zonaorientale/tools/cleanup-css-legacy-v343.sh` per dry-run/apply della pulizia controllata dei CSS refactor V291/V292.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V343.
- Non modificati `FUNZIONALITA'.md`, Netlify Functions, `links.json`, archivi Calciomercato, JSON Listone, Firebase/Auth/EmailJS, Listone runtime, Rose, Fantamercato interno, Dashboard Presidente o Admin generale.

# Aggiornamento V336 - Timeline giocatore Calciomercato in scheda

- Il tag giocatore degli articoli Calciomercato apre ora una scheda/modal sovrapposta invece di una pagina dedicata.
- Rimossi dalla timeline i tasti `Torna agli articoli` e `Torna al Calciomercato`, che in alcune condizioni non funzionavano correttamente.
- La scheda si chiude con X, click sullo sfondo o Escape.
- Il matching giocatore V335 resta invariato: ultimo listone della stagione selezionata, nome completo o cognome univoco.
- La timeline continua a usare articoli caricati + archivio statico disponibile, con deduplica.
- Compatibilita mantenuta con hash legacy `#calciomercato-player-*`: apre il modal invece della pagina.
- Nessuna modifica a Netlify Functions, `links.json`, JSON archivio, JSON Listone, Firebase/Auth/EmailJS, Rose, Fantamercato, Dashboard Presidente, Admin o `FUNZIONALITA'.md`.
- Aggiornati footer, cache-buster, `DEPLOY_EXPECTED_VERSION_V181` e `check-zonaorientale.sh` a V336.
- Documenti aggiunti: `FUNZIONALITAV336.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V336.md`, `refactor/CALCIOMERCATO_PLAYER_MODAL_V336.md`, `release/RELEASE_V336_PLAYER_TIMELINE_MODAL.md`.

# Aggiornamento V335 - Tag giocatore e timeline Calciomercato

- Aggiunto il modulo puro `assets/js/calciomercato/calciomercato-players-v335.js` per associare articoli ai giocatori dell'ultimo listone della stagione selezionata.
- Le card Calciomercato mostrano un tag giocatore cliccabile accanto a squadra/topic/status, sopra il titolo.
- Il click apre la route interna `#calciomercato-player-<slug>` con una timeline degli articoli collegati al giocatore.
- Il matching resta conservativo: nome completo o cognome univoco nel listone, per ridurre falsi positivi.
- La timeline usa gli articoli gia caricati e, quando disponibile, anche l'archivio statico Calciomercato.
- Nessuna modifica a Netlify Functions, `links.json`, JSON archivio, JSON Listone, Firebase/Auth/EmailJS, Rose, Fantamercato, Dashboard Presidente, Admin o `FUNZIONALITA'.md`.
- Aggiornati footer, cache-buster, `DEPLOY_EXPECTED_VERSION_V181` e `check-zonaorientale.sh` a V335.
- Documenti aggiunti: `FUNZIONALITAV335.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V335.md`, `refactor/CALCIOMERCATO_PLAYER_TIMELINE_REFACTOR_V335.md`, `release/RELEASE_V335_PLAYER_TIMELINE_CALCIOMERCATO.md`.

# Aggiornamento V334 - Refactor immagini Calciomercato protetto

- Estratti da `assets/app.js` gli helper immagini/testi Calciomercato nel nuovo modulo `assets/js/calciomercato/calciomercato-images-v334.js`.
- Collegato il modulo con import ES module e cache-buster V334.
- Mantenuti in `app.js` wrapper/alias con i nomi storici V325/V328/V330 per preservare compatibilita e diagnostiche.
- Aggiunta diagnostica `window.ZonaOrientaleCalciomercatoImagesV334`.
- Aggiornato `check-zonaorientale.sh` per verificare marker, modulo e documentazione V334.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V334.
- Nessuna modifica a Netlify Functions, `links.json`, archivi Calciomercato, JSON Listone, CSS card, CSS Listone, Firebase/Auth/EmailJS, Rose, Fantamercato, Presidente, Admin o `FUNZIONALITA'.md`.
- Documenti aggiunti: `FUNZIONALITAV334.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V334.md`, `refactor/CALCIOMERCATO_IMAGES_REFACTOR_V334.md`, `release/RELEASE_V334_CALCIOMERCATO_IMAGES_REFACTOR.md`.

## V331 - Card Calciomercato compatte e Listone uniforme

- Le card articolo Calciomercato non renderizzano piu' l'anteprima/testo descrittivo, sia desktop sia mobile.
- Da mobile il pulsante `Apri articolo` viene nascosto: restano cliccabili il titolo e l'immagine articolo.
- Fonte, data, topic, status e chip squadra restano visibili nelle card.
- Listone: l'etichetta `Modifiche` del filtro usa stile coerente con gli altri controlli.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V331.
- Nessuna modifica a Netlify Functions, `links.json`, archivio Calciomercato, JSON Listone, Firebase/Auth/EmailJS, Rose, Fantamercato interno, Dashboard Presidente, Admin generale o `FUNZIONALITA'.md`.
- Diagnostica: `window.ZonaOrientaleCalciomercatoListoneUiV331`.

## V328 - Card Calciomercato mobile e favicon fonte

- Da mobile le card Calciomercato nascondono la descrizione/anteprima lunga: restano titolo, metadati, fonte/data e link.
- I testi degli articoli vengono decodificati prima dell'escape del rendering, evitando la visualizzazione di entita come `&#8217;` o `&#124;`.
- Gli articoli senza immagine di anteprima provano a usare la favicon della fonte; se la favicon non carica resta il fallback alla tile fonte.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V328.
- Nessuna modifica a Netlify Functions, JSON archivio, `links.json`, Firebase, EmailJS, Listone, Rose, Fantamercato interno, Dashboard Presidente o `FUNZIONALITA'.md`.
- Diagnostica: `window.ZonaOrientaleCalciomercatoCardV328`.

## V327 - Fix Solo Admin Calciomercato

- Calciomercato Solo Admin: rimosso dal label il testo non destinato alla UI, lasciando soltanto `Solo Admin`.
- Calciomercato Solo Admin: il pulsante `Espandi`/`Riduci` ora aggiorna direttamente stato, attributo `aria-expanded`, corpo del pannello e classe collapsed.
- CSS Calciomercato: aggiunta protezione esplicita per nascondere davvero il body del pannello quando ridotto.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V327.
- Nessuna modifica a Netlify Functions, Firebase, dati statici Calciomercato/Listone o `FUNZIONALITA'.md`.
- Diagnostica: `window.ZonaOrientaleCalciomercatoAdminToggleV327`.

## V326 - Rifiniture UI Calciomercato/Listone/mobile

- Calciomercato: ogni articolo senza immagine di anteprima usa ora una tile immagine della fonte, non solo gli articoli da archivio statico.
- Calciomercato desktop: `Cerca`, `Da` e `A` sono allineati sulla stessa riga per compattare il blocco filtri.
- Calciomercato Solo Admin: il pannello archivio statico e' espandibile/riducibile con pulsante in alto a destra.
- Mobile: rimosso il toggle per passare da vista mobile a vista desktop; il menu `Altro` normalizza le icone anche sui link dinamici.
- Listone: il menu `Modifiche` usa le classi standard dei controlli (`input filter-input`).
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V326.
- Nessuna modifica a Netlify Functions, Firebase, dati statici Calciomercato/Listone o `FUNZIONALITA'.md`.
- Diagnostica: `window.ZonaOrientaleRifinitureUiV326`.

## V325 - Anteprime Calciomercato complete e fallback fonte archivio statico

- Le descrizioni nelle schede Calciomercato ora occupano tutta la larghezza disponibile e non vengono piu' nascoste o troncate su mobile.
- Rimossa dalla visualizzazione delle card la sottosezione `Giocatori/Allenatori`, conservando pero' le funzioni dati per ricerca e diagnostica.
- Gli articoli statici caricati da `assets/calciomercato/archive/` senza immagine propria mostrano una tile immagine della fonte.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V325.
- Nessuna modifica a feed Netlify, JSON archivio, `links.json`, Firebase, EmailJS, Fantamercato interno, Listone, Rose, Dashboard Presidente o Admin generale.
- Aggiunti i documenti `calciomercato/CALCIOMERCATO_ANTEPRIME_CARD_V325.md` e `release/RELEASE_V325_ANTEPRIME_CALCIOMERCATO.md`.

## V313 - Admin ordinato, feed Calciomercato esteso e resoconto funzionale

- Titolo Admin mantenuto sempre sopra tutti i pannelli informativi.
- Categorie Admin e pannelli collassabili avviati ridotti; il gate `Carica dati amministrazione` resta aperto.
- Netlify Function Calciomercato aggiornata a V313 con supporto `feedUrls` multipli, deduplica e limiti configurabili.
- Aggiornati handoff, resoconto sito e documento principale `FUNZIONALITA'.md` su richiesta esplicita.
- Nessuna scrittura Firebase nuova e nessuna modifica a Fantamercato interno, Listone, Rose, Presidente o dati competizioni.

## Aggiornamento V299 - CSS refactor stabile

- Consolidati i CSS refactor V292 con nomi stabili: `mobile-controls.css`, `rosters-tables.css`, `theme-light-suspended.css`.
- Aggiornati gli import HTML per usare i nuovi nomi stabili con cache-buster V299.
- `theme-light-suspended.css` resta conservato ma non caricato: la Light mode resta sospesa.
- Nessuna logica runtime, Firebase, EmailJS o dato JSON modificato.
- Funzionalita da preservare e testare: Listone, export admin-only, Rose/pagina squadra, Dashboard Presidente, mobile nav, Dark mode, `competition.html`, `player.html`.
- Aggiunta diagnostica `window.ZonaOrientaleCssStableRefactorV299` e documento `docs/zonaorientale/refactor/CSS_REFACTOR_STABLE_V299.md`.

## Aggiornamento V298 - Audit asset/import orfani

- Aggiunto lo script `static/zonaorientale/tools/audit-assets-v298.sh` per individuare riferimenti locali mancanti e possibili asset CSS/JS orfani.
- Aggiornato `check-zonaorientale.sh` per verificare la presenza del tool e della documentazione V298.
- Aggiunta diagnostica runtime `window.ZonaOrientaleAssetImportAuditV298`.
- Nessun asset rimosso, nessuna logica runtime modificata, nessun dato JSON/Firebase/EmailJS toccato.
- Funzionalita da preservare prima di pulizie future: Listone, Rose, Dashboard Presidente, Admin, pagine standalone, mobile nav, Dark mode e helper CSV V295.

## Aggiornamento V296 - Export modifiche Listone solo Admin

- Il pulsante `Esporta modifiche CSV` nel Listone viene mostrato solo agli utenti Admin.
- Gli utenti pubblici continuano a vedere Listone, colonna `Modifica`, filtro `Modifiche` e usciti storici, ma non possono scaricare il CSV.
- L'export diretto e' protetto anche da guardia runtime, non solo da UI.
- Nessuna modifica a Firebase, EmailJS, JSON, CSS, Rose, Dashboard Presidente o flussi Admin diversi dal controllo `state.isAdmin`.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V296.
- Aggiunta diagnostica `window.ZonaOrientaleListoneExportAdminOnlyV296`.
- Aggiunto documento `docs/zonaorientale/refactor/LISTONE_EXPORT_ADMIN_ONLY_V296.md`.

## Aggiornamento V292 - Pulizia CSS Light sospeso

- Sostituiti gli import V291 con `assets/css/refactor/mobile-controls-v292.css` e `assets/css/refactor/rosters-tables-v292.css`.
- Spostate le regole Light recenti V285-V288 nel file conservativo non importato `assets/css/refactor/theme-light-suspended-v292.css`.
- Mantenute attive le regole Dark/mobile necessarie per controlli, tabelle rose, pagina squadra e Dashboard Presidente.
- Nessuna modifica a Firebase, EmailJS, JSON, Listone o logiche Rose.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V292.
- Aggiunta diagnostica `window.ZonaOrientaleCssCleanupV292`.
- Aggiunto documento `docs/zonaorientale/refactor/CSS_CLEANUP_V292.md`.

## Aggiornamento V291 - Refactor CSS prudente

- Estratti da `assets/styles.css` i blocchi CSS recenti V285-V289, senza riscriverli, nei nuovi file `assets/css/refactor/mobile-controls-v291.css` e `assets/css/refactor/rosters-tables-v291.css`.
- Aggiornati gli import CSS in `index.html`, `competition.html` e `player.html` con cache-buster V291.
- `styles.css` conserva solo un commento di indirizzamento: nessuna funzionalita mobile/rose/Listone e' stata rimossa.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V291.
- Aggiunta diagnostica `window.ZonaOrientaleCssRefactorV291`.
- Aggiunto documento `docs/zonaorientale/refactor/CSS_REFACTOR_V291.md`.
- Funzionalita preservate esplicitamente: Listone Modifica/export, rose/pagina squadra, Dashboard Presidente, bottom navigation e Dark mode unico.
- Nessuna modifica a Firebase, EmailJS, dati JSON, logiche `app.js` o `FUNZIONALITA'.md`.

## Aggiornamento V290 - Audit styles.css e app.js

- Aggiunto `docs/zonaorientale/refactor/AUDIT_STYLES_APP_V290.md`.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V290.
- Aggiunta diagnostica `window.ZonaOrientaleStylesAppAuditV290`.
- Nessuna modifica funzionale: audit e guardrail per evitare regressioni durante la futura pulizia di `styles.css` e `app.js`.
- Ogni prossimo refactor deve indicare esplicitamente funzionalita a rischio e verifiche di preservazione.

## Aggiornamento V289 - Dark mode e rose mobile

- Sospesa temporaneamente la modalita Light dal sito.
- Il bootstrap HTML e runtime JS forzano `data-theme="dark"` e aggiornano `localStorage` a `dark`.
- Nascosto il pulsante di cambio tema in header e nella pagina giocatore standalone.
- Corrette le tabelle Rosa da mobile in modalita Dark: righe piu' compatte, prima colonna centrata verticalmente, testo giocatore piu' leggibile.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V289.
- Aggiunta diagnostica `window.ZonaOrientaleDarkModeOnlyV289`.
- Aggiunto documento `docs/zonaorientale/audit/DARK_MODE_ROSE_MOBILE_V289.md`.
- Nessuna modifica a Firebase, EmailJS, dati JSON o `FUNZIONALITA'.md`.

## Aggiornamento V288 - Fix rose mobile Light

- Corretto il contrasto della prima colonna nella tabella Rosa della pagina squadra in modalita Light mobile.
- Forzato testo chiaro su sfondo scuro per celle, link e pulsanti nella prima colonna sticky delle rose.
- Nome giocatore leggermente piu' grande e contenuto centrato verticalmente.
- Righe rosa mobile rese piu' compatte.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V288.
- Aggiunta diagnostica `window.ZonaOrientaleRosterMobileLightV288`.
- Aggiunto documento `docs/zonaorientale/audit/FIX_ROSE_MOBILE_LIGHT_V288.md`.
- Nessuna modifica a dati, Firebase, EmailJS o `FUNZIONALITA'.md`.

## Aggiornamento V287 - Rifinitura controlli mobile

- Migliorati target touch e leggibilita' di input, select, textarea, filtri e bottoni da smartphone.
- Rafforzati focus ring, gruppi checkbox/radio, pill attive, bottom navigation e menu mobile in tema Light.
- Migliorato lo scroll orizzontale delle tabelle con `-webkit-overflow-scrolling: touch`.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V287.
- Aggiunta diagnostica `window.ZonaOrientaleMobileControlsV287`.
- Aggiunto documento `docs/zonaorientale/audit/RIFINITURA_CONTROLLI_MOBILE_V287.md`.
- Nessuna modifica a dati, Firebase, EmailJS o `FUNZIONALITA'.md`.

## Aggiornamento V285 - Fix mirati mobile

- Migliorata la leggibilita' mobile in tema Light.
- Rafforzati pannelli/card, testi secondari, controlli, badge/pill e bottom navigation.
- Migliorate tabelle mobile con bordi piu' chiari, indicazione `Scorri` e prima colonna sticky piu' leggibile.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V285.
- Aggiunta diagnostica `window.ZonaOrientaleMobileFixesV285`.
- Aggiunto documento `docs/zonaorientale/audit/FIX_MOBILE_MIRATI_V285.md`.
- Nessuna modifica a Firebase, EmailJS, dati JSON o logiche runtime.

## Aggiornamento V284 - Audit mobile completo

- Aggiunto `docs/zonaorientale/audit/AUDIT_MOBILE_COMPLETO_V284.md`.
- Aggiornato `static/zonaorientale/tools/check-zonaorientale.sh` con promemoria audit mobile.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V284.
- Aggiunta diagnostica `window.ZonaOrientaleMobileAuditV284`.
- Nessuna modifica funzionale a Firebase, EmailJS o dati JSON.

## Aggiornamento V283 - Pulizia file macOS/residui

- Aggiunto `static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh`.
- Lo script esegue dry-run di default e rimuove solo con `--apply` o `--git-rm`.
- Aggiornato `check-zonaorientale.sh` per riconoscere anche `.AppleDouble` e `.LSOverride`.
- Rafforzata `.gitignore` locale del sito per metadata macOS.
- Aggiunta diagnostica `window.ZonaOrientaleMacOsCleanupV283`.
- Aggiunto documento operativo `docs/zonaorientale/release/PULIZIA_MACOS_V283.md`.
- Nessuna modifica a Firebase, EmailJS, dati JSON o `FUNZIONALITA'.md`.

## Aggiornamento V282 - Controlli pre-push

V282 aggiunge lo script `static/zonaorientale/tools/check-zonaorientale.sh` per centralizzare i controlli tecnici prima di commit/push: sintassi JS, validita JSON, footer/cache-buster/versione e file macOS indesiderati. Nessuna modifica funzionale a Firebase, EmailJS o dati runtime. Diagnostica: `window.ZonaOrientalePrePushChecksV282`. Documento operativo: `release/CONTROLLI_PRE_PUSH_V282.md`.

## V275 - Funzionalita V271-V274

- Aggiunto `docs/zonaorientale/FUNZIONALITA'V271-274.md`.
- Registrate le funzionalita recenti V271-V274 senza modificare `FUNZIONALITA'.md`.
- Aggiornati footer/cache-buster/diagnostica a V275.

## V273 - Test listone reale e normalizzazione squadre

- Eseguito test end-to-end sul file Excel reale Classic a foglio singolo.
- Confermata conversione di 663 giocatori, con 532 in listone e 131 asteriscati.
- Confermato confronto con listone precedente `2026-05-15`: 2 nuovi, 0 usciti, 96 aumenti quotazione, 120 diminuzioni.
- Corretti i falsi cambi squadra dovuti al confronto tra sigle storiche e nomi estesi.
- Aggiunto documento `docs/zonaorientale/listoni/LISTONE_TEST_REALE_V273.md`.
- Aggiornati footer/cache-buster a V273.

# Aggiornamento V272 - Handoff e verifica pre-merge

- Aggiunti documenti organizzati per handoff, audit funzionalita, audit file legacy, pianificazione e procedura merge master.
- Aggiornati footer/cache-buster/diagnostica a V272.
- Confermato che `FUNZIONALITA'.md` non viene modificato.
- Preparata procedura Git per merge su `master` e ritorno al branch `refactor/260528-zonaorientale-next`.

# Aggiornamento V266 - Email deliverability EmailJS

V266 rende piu' pulite e coerenti le mail operative inviate via EmailJS: aggiunge parametri comuni di mittente logico (`Lega ZonaOrientale Salerno`), Reply-To dell'utente loggato quando disponibile, oggetti piu' sobri e firma standard del gestionale. I flussi aggiornati sono: comunicato avvenuto scambio e informativa svincolo giocatori. Non modifica `FUNZIONALITA'.md`. Diagnostica: `window.ZonaOrientaleEmailJsDeliverabilityV266`.

# Aggiornamento V265 - Pulizia asset sicuri

V265 e' una pulizia fisica controllata: rimuove dai comandi di release i duplicati/inutilizzati sicuri gia' identificati nell'audit, mantiene come canonico il simulatore trattative `assets/js/dev/trade-notification-simulator-v255.js` e aggiunge/rafforza `.gitignore` per impedire il ritorno di file macOS. Non modifica `FUNZIONALITA'.md` e non cambia comportamento runtime. Diagnostica: `window.ZonaOrientaleCleanupV265`.

# Aggiornamento V263 - Funzionalita V256-262

V263 aggiunge `FUNZIONALITA'V256-262.md`, registro incrementale delle funzionalita introdotte o consolidate tra V256 e V262. Non modifica `FUNZIONALITA'.md` e non cambia il comportamento runtime. Diagnostica: `window.ZonaOrientaleFeaturesDocV263`.

# Aggiornamento V262 - Audit pulizia codice

V262 aggiunge `AUDIT_CODICE_260528_V262.md` e una `.gitignore` locale in `static/zonaorientale/`. Non cambia funzionalita': fotografa file duplicati/non importati, file macOS e candidati a pulizia controllata. Diagnostica runtime: `window.ZonaOrientaleAuditV262`.

## V261 - Svincola Giocatori in Dashboard Presidente

- Aggiunta terza sottosezione presidente `Svincola Giocatori` dopo `Invia comunicato squadra` e `Comunicato avvenuto scambio`.
- Il presidente puo selezionare uno o piu giocatori dalla propria rosa.
- Il corpo email viene generato automaticamente con elenco giocatori e Qt.A recuperata dal listone piu recente disponibile per ciascun giocatore.
- Invio EmailJS a `caparrotti86@yahoo.it` con oggetto `<Nome Squadra> - Svincolo giocatori - <Data odierna>`.
- Nessuna scrittura Firebase: e' una sola informativa email.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V261.

## V257 - Firebase Rules notifiche trattative

- Aggiunto file completo rules `docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules`.
- Aggiunto file patch `docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules` per integrare solo la parte `transferNegotiations`.
- La lettura esito trattativa del mittente puo essere salvata in Firebase su campi dedicati, sincronizzando smartphone e desktop.
- Le update non-admin su `transferNegotiations` vengono limitate a: risposta del destinatario, reset flag lettura del destinatario, lettura esito del mittente.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V257.

## V256 - Documento funzionalita V240-255

- Aggiunto `FUNZIONALITA'V240-255.md`, documento separato che traccia le funzionalita introdotte/consolidate tra V240 e V255.
- Confermato che `FUNZIONALITA'.md` non viene modificato automaticamente e resta aggiornabile solo su richiesta esplicita.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V256.

## V255 - Comandi test trattative

- Aggiornato il simulatore a `assets/js/dev/trade-notification-simulator-v255.js`.
- Aggiunte API console `help()`, `getTestCommands()` e `runLocalSmokeTest()` per testare badge e card trattative con comandi standard.
- Mantenuto alias temporaneo `window.ZonaOrientaleTradeSimulatorV254` per non rompere i comandi usati durante V254.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V255.

## V254 - Simulatore notifiche trattative

- Aggiunto modulo `assets/js/dev/trade-notification-simulator-v254.js` con API console `window.ZonaOrientaleTradeSimulatorV254`.
- Le simulazioni locali permettono di provare badge e card trattative senza scrivere in Firebase.
- La funzione opzionale `createFirebaseSentProposal({ confirm: true })` crea una proposta reale da presidente corrente verso un'altra squadra, utile per test end-to-end se le rules lo consentono.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V254.
- `FUNZIONALITA'.md` non modificato.

## V253 - Estrazione modulare Richieste presidenti Admin

- Aggiunto modulo `assets/js/admin/team-requests-panel-v253.js` per installare il pannello `Admin -> Richieste presidenti` fuori da `assets/app.js`.
- Preservate le funzionalita gia testate: Aggiorna richieste, Approva, Rifiuta, Elimina da Firebase per comunicati approvati/rifiutati.
- Il blocco inline V249 resta disponibile come fallback, ma il render canonico usa attributi V253 per evitare doppi handler legacy.
- Aggiunta diagnostica runtime `window.ZonaOrientaleTeamRequestsV253`.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V253.
- `FUNZIONALITA'.md` non modificato perche' va aggiornato solo su richiesta esplicita.

## V252 - Pulizia asset inutilizzati e file locali
- Aggiunta `.gitignore` locale in `static/zonaorientale/` per impedire nuovi commit di `.DS_Store`, `__MACOSX` e AppleDouble `._*`.
- Confermati come rimovibili `assets/css/mobile-hotfix-v166.css` e `assets/css/mobile-hotfix-v167.css`, perche non linkati dagli HTML e gia inglobati in `assets/css/mobile-suite-v168.css`.
- Aggiunta diagnostica runtime `window.ZonaOrientaleCleanupV252`.
- Nessuna modifica funzionale a pubblico, presidente o admin; cleanup controllato con rimozioni da fare via `git rm`.
- Aggiornati footer/cache-buster/diagnostica a V252.

## V251 - Workflow pubblicazione Admin ripristinato

- Consolidato il workflow pubblicazione inline V190/V191/V203 come versione canonica, senza reimportare il modulo esterno V213.
- Restano operativi e canonici i pannelli Admin `Stato Firebase / JSON` e `Procedura guidata Pubblica aggiornamenti`.
- Il workflow resta zero-scrittura Firebase: controlla asset pubblici, promemoria locali, modalita admin e prepara comandi/checklist per pubblicazione.
- Aggiornati i comandi suggeriti dal wizard, rimuovendo il vecchio riferimento al branch `feature/zonaorientale-v187-next`.
- Aggiunta diagnostica `window.ZonaOrientalePublicationWorkflowV251`.
- Aggiornati footer/cache-buster/diagnostica a V251.
- `FUNZIONALITA'.md` non modificato perche' va aggiornato solo su richiesta esplicita.

## V250 - Generatore comunicati automatici ripristinato

- Ripristinato il modulo `admin-communication-generator-v210.js`, che era importato ma non installato.
- Il generatore torna visibile in Admin e prepara bozze per risultati, vincitori competizione, mercato, focus squadra, Albo/Palmares e aggiornamento dati pubblici.
- Il flusso resta sicuro: nessuna scrittura diretta su Firebase; la bozza puo' essere copiata oppure inserita nel form `Admin -> Comunicati` per revisione e salvataggio manuale.
- Aggiunto collegamento esplicito a `expandAdminPanel` per aprire correttamente il pannello Comunicati quando si usa `Inserisci nei Comunicati`.
- Aggiunta diagnostica `window.ZonaOrientaleCommunicationGeneratorV250`.
- Aggiornati footer/cache-buster/diagnostica a V250.
- `FUNZIONALITA'.md` non modificato perche' va aggiornato solo su richiesta esplicita.

## V249 - Richieste presidenti canoniche

- Consolidato `Admin -> Richieste presidenti` in un unico pannello canonico, superando le sovrapposizioni V243/V244/V245.
- Aggiunto refresh V249 dedicato da Firebase con status del pannello.
- I pulsanti `Approva`, `Rifiuta` ed `Elimina da Firebase` usano attributi/handler V249 dedicati per ridurre il rischio di listener doppi legacy.
- La cancellazione resta limitata ai comunicati approvati/rifiutati nel registro `teamRequests`; eventuali news gia' pubblicate non vengono cancellate.
- Aggiunta diagnostica `window.ZonaOrientaleTeamRequestsV249`.
- Aggiornati footer/cache-buster/diagnostica a V249.
- `FUNZIONALITA'.md` non modificato perche' va aggiornato solo su richiesta esplicita.

## V248 - Pulizia handler legacy comunicato scambio

- Aggiunto guard runtime per impedire che vecchi form/handler V50/V79/V237 del comunicato avvenuto scambio possano riagganciarsi al DOM.
- Mantenuto un solo flusso canonico: `teamRequests/TRANSFER_NEWS` + EmailJS + approvazione Admin.
- Aggiunta diagnostica leggera `window.ZonaOrientaleLegacyCleanupV248`.
- Aggiornati footer/cache-buster/diagnostica a V248.
- `FUNZIONALITA'.md` non modificato.

## V247 - Checklist regressioni

- Aggiunto `REGRESSION_TESTS.md` come checklist operativa per test pubblico, presidente, admin, mobile, Firebase e pre-commit.
- Aggiornati footer/cache-buster/diagnostica a V247.
- Nessuna modifica funzionale runtime: la release serve a standardizzare i controlli prima dei merge.
- `FUNZIONALITA'.md` non modificato perche' va aggiornato solo su richiesta esplicita.

## V246 - Notifiche trattative sincronizzate su Firebase

- Il badge esito trattativa del presidente mittente non dipende piu' solo da `localStorage`: quando si apre la card della proposta conclusa, il sito prova a marcare la lettura nel documento `transferNegotiations/{id}`.
- Aggiunti campi di lettura esito: `outcomeSeenByFromUid`, `outcomeSeenAtByFromUid`, `outcomeSeenMarkerByFromUid`, `outcomeSeenByUid`.
- Quando il destinatario approva o rifiuta una trattativa, la lettura del mittente viene resettata, cosi' l'esito torna notificato.
- `localStorage` resta fallback se le regole Firebase negano l'update, senza bloccare la UI.
- Aggiornati footer/cache-buster/diagnostica a V246.
- `FUNZIONALITA'.md` non modificato perche' va aggiornato solo su richiesta esplicita.

## V245 - Elimina comunicati approvati da Firebase

- Admin -> Richieste presidenti: il pulsante `Elimina da Firebase` ora compare anche sui comunicati gia' approvati, oltre che sui comunicati rifiutati.
- La cancellazione resta limitata alle richieste comunicato (`TEAM_NEWS` e `TRANSFER_NEWS`, inclusi topic `COMUNICATO_SQUADRA` e `COMUNICATO_AVVENUTO_SCAMBIO`) in stato `APPROVED`/`ACCEPTED` o `REJECTED`.
- Per i comunicati approvati la conferma chiarisce che viene cancellato solo il documento `teamRequests/{id}`: una eventuale news gia' pubblicata resta nella raccolta `news`.
- Aggiornati footer/cache-buster/diagnostica a V245.
- `FUNZIONALITA'.md` non modificato perche' va aggiornato solo su richiesta esplicita.

## V244 - Elimina comunicati rifiutati da Firebase

- Admin -> Richieste presidenti: quando un comunicato squadra o un comunicato avvenuto scambio viene rifiutato, compare il pulsante `Elimina da Firebase`.
- Il pulsante cancella definitivamente il documento `teamRequests/{id}` solo per richieste comunicato in stato `REJECTED`; le richieste pending o approvate non vengono rese cancellabili.
- Dopo la cancellazione lo stato locale viene aggiornato, il pannello resta aperto e si puo' usare ancora `Aggiorna richieste` per rileggere Firebase.
- Aggiornati footer/cache-buster/diagnostica a V244.
- `FUNZIONALITA'.md` non modificato perche' va aggiornato solo su richiesta esplicita.

## V243 - Comunicato scambio canonico

- Consolidato il flusso Presidente -> Comunicato avvenuto scambio con form canonico `teamTransferCommunicationFormV243`.
- Neutralizzati gli handler legacy V50/V79 che potevano agganciare lo stesso form e tentare ancora la pubblicazione diretta in `news`.
- Il flusso resta: `teamRequests/TRANSFER_NEWS` + EmailJS immediato + pubblicazione News dopo approvazione Admin.
- Aggiornati footer/cache-buster/diagnostica a V243.
- `FUNZIONALITA'.md` non modificato perche' va aggiornato solo su richiesta esplicita.

## V241 - Accetta utenti stabile

- Corretto il flusso Admin -> Accetta utenti: gli utenti rifiutati non vengono piu' cancellati da `pendingUsers`, ma marcati `REJECTED` con metadati di rifiuto.
- Impedita la rigenerazione automatica di richieste `PENDING` per utenti gia' approvati in `teamUsers`, anche dopo login Google.
- Il pannello Accetta utenti nasconde eventuali vecchi duplicati pending relativi a UID gia' approvati e mostra solo richieste realmente in attesa.
- Aggiornati footer/cache-buster/diagnostica a V241.
- `FUNZIONALITA'.md` non modificato: resta aggiornabile solo su richiesta esplicita.

## V240 - Sync live trattative presidente

- Corretto il loader lazy del fantamercato: `force: true` ora ricarica davvero `transferListings` e `transferNegotiations` anche se erano gia' state caricate.
- La Dashboard Presidente rilegge e ridisegna le liste Trattative quando viene aperta e quando da mobile si usa l'azione rapida Trattative.
- Il badge del destinatario resta fino ad Approva/Rifiuta; il badge del mittente resta fino all'apertura della card con l'esito.
- Aggiornati footer/cache-buster/diagnostica a V240.
- `FUNZIONALITA'.md` non modificato: documento aggiornabile solo su richiesta esplicita.

## V239 - Notifiche trattative presidente e hotfix comunicato scambio

## V239 - storico e notifiche trattative persistenti
- Dashboard Presidente: le liste Trattative Inviate/Ricevute mostrano lo storico completo in un riquadro scrollabile, con ultime 5 visibili senza scroll.
- Notifiche trattative: il badge del destinatario resta finche' la proposta non viene approvata o rifiutata.
- Notifiche esito: il badge del mittente resta finche' non viene aperta la card della proposta nella sottosezione Trattative.
- Documentazione: aggiunto `FUNZIONALITA'.md` come registro funzionale da aggiornare solo su richiesta esplicita.


- Corretto il submit del comunicato avvenuto scambio: dopo il salvataggio in `teamRequests` il presidente non forza piu' `loadFullDataV32`, evitando la lettura non consentita di `teamUsers`.
- Aggiunto badge rosso con punto esclamativo bianco su `Dashboard Presidente` e sul pulsante header `Pres. Cognome` quando una squadra riceve una trattativa in attesa.
- Quando il destinatario accetta/rifiuta, il badge sparisce al destinatario e viene mostrato al presidente mittente come esito da leggere; lo storico resta visibile in `Trattative` sotto Inviate/Ricevute.
- Migliorati i sommari delle card trattativa con proposta compatta ed esito nel titolo della card.
- Aggiornati footer/cache-buster/diagnostica a V239.

## V237 - Hotfix comunicato scambio presidente e permessi Firebase

- Corretto il flusso del pulsante "Invia comunicato di scambio": i presidenti approvati non scrivono piu' direttamente in `news`, perche' le regole Firestore consentono la scrittura news solo agli admin.
- Il comunicato viene salvato in `teamRequests` come `TRANSFER_NEWS`, la mail EmailJS a `caparrotti86@yahoo.it` viene inviata subito e l'Admin puo' approvare la richiesta per pubblicarla in News con topic `COMUNICATO_AVVENUTO_SCAMBIO`.
- Ripristinata la visibilita' dei `TRANSFER_NEWS` nel pannello Admin Richieste presidenti e aggiornati footer/cache-buster/diagnostica a V237.

## V236 - Ripristino comunicato avvenuto scambio presidente
- Ripristinato nella Dashboard Presidente il secondo form `Comunicato avvenuto scambio`, perso dal refactor V119 dell'area squadra.
- Il comunicato di scambio viene pubblicato direttamente nella raccolta Firebase `news` con topic `COMUNICATO_AVVENUTO_SCAMBIO`.
- Dopo la pubblicazione viene inviata una email tramite EmailJS a `caparrotti86@yahoo.it` con oggetto `Comunicato avvenuto scambio NOME_SQUADRA` e corpo composto da titolo, testo, giocatori/contropartite e squadra coinvolta.
- Aggiunta scorciatoia mobile `Scambio` nell'hub azioni rapide della Dashboard Presidente.
- Aggiornate etichette topic/richieste, footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V236.

## V235 - Hotfix filtri listone
- Corretto definitivamente il filtro della sezione Listone:
  - `In listone` mostra i giocatori con stato esatto `In listone` / `IN_LISTONE`;
  - `Asteriscato` mostra i giocatori con stato esatto `Asteriscato` / `ASTERISCATO`;
  - `Svincolati` mostra i giocatori non presenti in nessuna rosa, indipendentemente dallo stato listone.
- Se nessuna checkbox stato e' selezionata, il risultato e' vuoto invece di tornare implicitamente a tutti i giocatori.
- Aggiornati footer/cache-buster a V235.

## V235 - Hotfix listone, dashboard mobile e tema light
- Corretto filtro stato nella sezione Listone: In listone, Asteriscato e Svincolati ora sono mutuamente coerenti e non si sovrappongono.
- Rimossa duplicazione interna delle checkbox dei campi visibili del Listone.
- Dashboard Presidente mobile: le schede Saldo/Rosa e In vendita/Trattative restano su due colonne anche sugli schermi stretti.
- Rafforzato tema light per Archivio, Statistiche e Confronta con sfondi chiari e testi scuri.
- Aggiornati footer/cache-buster a V235.

## V232 - Hotfix routing comunicati condivisi

- Corretto il redirect utenti della preview dinamica comunicati: gli hash `#news-<id>` ora aprono la sezione News invece di lasciare la webapp senza pagina attiva.
- Il comunicato target viene espanso e scrollato dopo il caricamento dati.
- Aggiornati footer/cache-buster a V232.

## V231 - Preview WhatsApp comunicati dinamica Netlify

- Sostituito il flusso operativo basato su pagine statiche `comunicati/*.html` con una Netlify Function.
- Nuovo endpoint condivisibile: `https://silviobarra.com/zonaorientale/share/news/<id-comunicato>`.
- Il pulsante `Copia link WhatsApp` usa subito l'ID Firebase del comunicato, senza generare file HTML in repo.
- Aggiunta redirect Netlify in `netlify.toml` verso `netlify/functions/news-share.js`.
- L'Admin ora chiarisce che non serve piu' rigenerare/committare preview statiche dopo ogni comunicato.
- Aggiornati footer/cache-buster a V231.

## V230 - Hotfix link WhatsApp comunicati

- Corretto dominio hardcoded dei link comunicati da `www.silviobarra.com` a `silviobarra.com`.
- Il pulsante `Copia link WhatsApp` calcola la base dall'URL corrente.
- Le pagine statiche `comunicati/*.html` ora usano canonical/OG non-`www`.
- I redirect delle preview sono relativi, cosi' non portano a 404 se cambia host.
- Aggiornati footer/cache-buster a V230.

# Changelog consolidato ZonaOrientale

Questo file sostituisce i molti `REFACTOR_Vxxx.md` e `AI_HANDOFF_ZONAORIENTALE_Vxxx.md` storici. Mantiene una vista sintetica di cosa conta davvero per proseguire lo sviluppo.

## V229 - Account presidente in header

- Quando un utente presidente approvato effettua il login, il pulsante header `Account` non viene piu mostrato.
- Al suo posto il pulsante mostra logo squadra e label `Pres. Cognome`.
- Il click sul pulsante porta direttamente alla Dashboard Presidente (`#teamarea`) invece di riaprire il dialog di login.
- Per utenti non approvati resta il comportamento precedente; per admin resta la logica Admin esistente.
- Aggiornati footer/cache-buster a V229.

## V228 - Comunicati condivisibili WhatsApp

- aggiunto `assets/js/domain/news-share-v228.js`;
- aggiunto `tools/generate-news-share-pages.mjs`;
- generate pagine statiche in `comunicati/*.html` per i comunicati presenti negli snapshot;
- `news.html` ora contiene i meta Open Graph dell'ultimo comunicato e reindirizza alla relativa news;
- `index.html` riceve meta Open Graph aggiornati all'ultimo comunicato dal generatore;
- News pubbliche e Admin mostrano pulsanti `Copia link WhatsApp`;
- Admin permette anche di scaricare l'HTML preview di un singolo comunicato;
- aggiornati footer/cache-buster a V228.

## V227 - Hotfix FM Archivio

- Corretto Archivio -> Squadre della stagione: il saldo FM non viene piu' letto solo da `seasonTeams.fmBalance`.
- Aggiunta risoluzione saldo da snapshot rose statiche (`remainingCredits`) e fallback su `fmMovements`.
- Se il dato FM non esiste davvero per una stagione storica, viene mostrato `-` invece di un falso `0 FM`.
- Aggiornati footer/cache-buster a V227.

## V226 - Hotfix statistiche storiche

Correzione mirata della pagina `#stats` dopo segnalazione utente:

- ripristinati i nomi in `Club più vincenti`;
- ripristinati i nomi in `Podi Campionato`;
- `Ultimi titoli assegnati` usa i nomi storici dallo snapshot honor statico quando disponibili;
- `Top FIFA Ranking` non mostra piu la nota ripetitiva `FIFA Ranking` accanto a ogni squadra;
- footer/cache-buster e `DEPLOY_EXPECTED_VERSION_V181` aggiornati a V226.

## V225 - Stabilizzazione finale post-refactor

Overlay tecnico conclusivo del primo ciclo di pulizia V220-V224.

- aggiunto `assets/js/refactor/refactor-stability-v225.js`;
- il sito espone `window.ZonaOrientaleRefactorStatus` per verificare a runtime la presenza dei moduli estratti;
- controllati repository dati V222, orchestrator V221, chrome mobile V220, statistiche storiche V224 e helper Archivio V215/V218/V219;
- nessun cambio UI, nessun cambio dati, nessun cambio Firebase;
- footer/cache-buster e `DEPLOY_EXPECTED_VERSION_V181` aggiornati a V225.

## V224 - Hardening statistiche storiche

Correzioni funzionali e refactor prudente:

- le celle Albo con stato `NON_DISPUTATA`/status non-team non vengono piu conteggiate come titoli;
- `Non disputata` non puo piu comparire tra i club piu vincenti;
- la classifica `Presidenti piu vincenti` pre-carica gli snapshot stagione statici mancanti, cosi usa presidenti e squadre storiche di tutte le stagioni archiviate e non solo l'ultima stagione caricata;
- `historical-stats-compare-v211.js` resta il modulo storico, ma viene rinforzato senza cambiare UI generale o schema dati;
- footer/cache-buster aggiornati a V224.

## Linea storica fino a V188

Le versioni V127-V188 hanno costruito la base del sito: refactor progressivi, UI mobile, componenti admin, asset pubblici, checklist e stabilizzazione. I dettagli granulari sono stati accorpati e non vanno piu mantenuti come file separati salvo recupero storico da Git.

Punti permanenti ereditati:

- sito statico senza build system;
- `assets/app.js` come bundle principale con molte patch storiche;
- CSS mobile stratificato;
- Admin con workflow snapshot/preflight;
- Firebase lato browser;
- preferenza per JSON statici pubblici.

## V189-V198 - Pubblicazione dati e stabilizzazione JSON

Aree consolidate:

- stato pubblicazione Firebase/JSON;
- procedura guidata pubblicazione aggiornamenti;
- miglioramenti a snapshot pubblici;
- helper per Archivio e statistiche storiche;
- validazione asset pubblici;
- riduzione letture Firebase tramite JSON statici.

Documenti vecchi accorpati:

- `RELEASE_NOTES_V187_V198.md`;
- `VALIDAZIONE_AGGIORNAMENTO_V187_V198.md`;
- `changelog/CHANGELOG_REFACTOR_V127_V188.md`;
- handoff/refactor storici in `archive/`.

## V199-V208 - Live data, comunicati e mercato

Aree consolidate:

- comunicati/news live da Firebase in background;
- mercato/trattative live e lazy;
- ottimizzazioni per non caricare dati pesanti a visitatori pubblici;
- integrazione di snapshot e Archivio;
- compatibilita con dashboard presidente e rose.

## V209 - Refactor live data / archivio

Estratta logica in:

```text
assets/js/refactor/live-data-archive-v209.js
```

Gestisce:

- comunicati live Firebase;
- refresh comunicati;
- trasferibili/trattative lazy/live;
- Archivio stagioni da snapshot statici.

Regola: non rendere bloccante il bootstrap pubblico.

## V210 - Refactor generatore comunicati admin

Estratta logica in:

```text
assets/js/refactor/admin-communication-generator-v210.js
```

Il generatore:

- usa dati gia caricati in `state.raw`;
- non scrive automaticamente su Firebase;
- compila il form Comunicati solo quando l'admin conferma;
- mantiene `window.ZonaOrientaleCommunicationGenerator`.

## V211 - Refactor statistiche storiche e confronta

Estratta logica in:

```text
assets/js/refactor/historical-stats-compare-v211.js
```

Gestisce:

- `#stats`;
- `#compare`;
- titoli, podi, FIFA da `honor.json` o fallback;
- layout mobile delle sezioni storiche.

Nota: in seguito e' stato necessario installarlo davvero nel bootstrap con V218.

## V212 - Refactor dashboard presidente / rose

Estratta logica in:

```text
assets/js/refactor/president-dashboard-rosters-v212.js
```

Gestisce:

- dashboard presidente;
- conteggio rosa da raw/snapshot/static rosters;
- helper robusti per rose;
- hub mobile presidente;
- hook renderUserArea/renderAll.

## V213 - Refactor workflow pubblicazione admin

Creato modulo:

```text
assets/js/refactor/admin-publication-workflow-v213.js
```

Contieneva logiche storiche V190/V191/V203:

- stato Firebase/JSON;
- procedura guidata pubblicazione;
- sync preflight asset pubblici.

## V214 - Hotfix stabilizzazione post V213

Il modulo V213 e' stato rimosso dal bootstrap perche poteva impedire la visualizzazione dati. La logica inline stabile e' stata preservata.

Regola: non reinserire V213 senza test browser completi.

## V215 - Hotfix helper Archivio V196

Risolto errore:

```text
ReferenceError: buildSeasonArchiveV196 is not defined
```

Sono stati reinseriti helper base Archivio V196 necessari agli override V204/V209.

## V216 - Classifica campionato completa

Le classifiche di competizioni campionato/classifica supportano:

```text
POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT
```

Estesi:

- Admin risultati competizioni;
- salvataggio Firebase;
- vista pubblica competizioni;
- `competition.html`;
- CSS desktop/mobile.

Campi canonici:

```text
points, played, wins, draws, losses, goalsFor, goalsAgainst, goalDifference, fantapoints
```

## V217 - Cache fix classifica campionato

Corretto problema di cache:

- import `admin-competitions.js` con query versionata;
- link verso `competition.html` con query `v=217` poi evoluta a V219;
- rinforzi CSS per evitare vecchia UI tabellare incompleta.

## V218 - UI mobile globale e pagine storiche

Interventi:

- pulsante globale "Su" mobile-only;
- bottom menu solo smartphone;
- `mobile-viewport.js` basato su larghezza `<= 900px`, non solo pointer coarse;
- `competition.html` senza `body.is-mobile-ux` iniziale;
- installazione reale V211;
- `renderAll()` richiama Statistiche/Confronta e Archivio;
- `stats`, `archive`, `compare` registrati come hash statici.

## V219 - Hotfix Archivio stagioni

Risolto errore:

```text
ReferenceError: getSeasonSortValueV193 is not defined
```

Ripristinati:

```text
HISTORICAL_COMPETITIONS_V193
getSeasonSortValueV193
getSeasonLabelV193
```

Risultato: Archivio stagioni torna visibile e V218 resta attiva.

## V220 - Safety refactor mobile chrome

Primo overlay tecnico del percorso di pulizia codice. Nessuna nuova feature e nessun cambio dati.

Aggiunto:

```text
assets/js/mobile/mobile-chrome-v220.js
```

Centralizza il comportamento mobile condiviso da app principale e pagine standalone:

- pulsante globale `Su`;
- rilevamento smartphone;
- `body.is-mobile-ux`;
- chiusura bottom sheet/menu da desktop;
- rispetto della modalita display forzata desktop.

Aggiornati `app.js`, `competition.html` e `player.html` per usare il nuovo modulo condiviso, eliminando duplicazioni inline.

Cache-buster e footer portati a V220.


## V222 - Data repository facade

Creato modulo:

```text
assets/js/data/repository-v222.js
```

Scopo:

- introdurre una facciata unica per letture Firebase e asset statici;
- instradare i caricamenti statici `listoni/rose/competitions` tramite `loadStaticAssets()`;
- instradare le raccolte Firebase tramite `loadCollections()`;
- esporre `window.ZonaOrientaleDataRepository` per diagnostica e sviluppo futuro;
- non cambiare UI, dati, Firebase o comportamento Admin.

Questa versione prepara il refactor successivo senza rimuovere helper legacy o cambiare il ciclo di render.

## V221 - Separazione rendering public/admin

Secondo overlay tecnico del percorso di pulizia codice. Nessuna nuova feature e nessun cambio dati.

Aggiunto:

```text
assets/js/refactor/public-admin-render-orchestrator-v221.js
```

Il `renderAll()` base di `app.js` e' stato riorganizzato in gruppi:

```text
publicRenderers
adminRenderers
afterRenderers
```

Obiettivo: iniziare la separazione tra rendering pubblico e rendering Admin senza cambiare comportamento visibile e senza toccare i dati.

Aggiornati footer e cache-buster a V221.

## Docs consolidation - 25/05/2026

Ridotta la documentazione da molti file storici a pochi documenti canonici:

```text
README.md
AI_HANDOFF_ZONAORIENTALE_CURRENT.md
ARCHITETTURA_E_DATI.md
OPERATIVITA_ADMIN_E_RELEASE.md
CHANGELOG_CONSOLIDATO.md
ROADMAP.md
firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V124C.rules
```

I vecchi handoff/refactor per versione non vanno piu ricreati automaticamente: usare questo changelog e l'handoff current.

## V223 - CSS cleanup progressivo

Overlay tecnico senza cambio funzionale visibile.

- creato `assets/css/mobile-chrome-v223.css`;
- spostate nel nuovo file le regole globali del pulsante `Su` e del guard desktop bottom menu;
- rimossi i blocchi V218 duplicati da `assets/styles.css` e `assets/css/mobile-suite-v168.css`;
- aggiornati footer/cache-buster a V223 e runtime expected version a 223.

Scopo: iniziare la modularizzazione CSS mantenendo invariata la UI V222.


## V235 - hotfix filtri Listone coerenti
- `In listone` e `Asteriscato` filtrano solo la colonna Stato.
- `Svincolati` filtra solo la colonna Rosa, includendo i giocatori senza squadra fantasy.
- Combinazioni checkbox rese coerenti: gli svincolati vengono esclusi quando la checkbox `Svincolati` non e selezionata.

## V243 refresh richieste presidenti

- Aggiunto refresh esplicito/automatico del pannello Admin → Richieste presidenti per rileggere `teamRequests` da Firebase quando una richiesta appena inviata non compare subito.
- Normalizzato il payload del Comunicato avvenuto scambio con campi compatibili Admin (`TRANSFER_NEWS`, `requestType`, `adminVisible`, `needsAdminApproval`).
- `FUNZIONALITA'.md` non modificato.

## V267 - Audit competizioni

- Aggiunto audit documentale e runtime per la sezione Competizioni.
- Aggiornata la guida per un eventuale nuovo assistente AI.
- Nessuna rimozione di funzionalita o asset competizioni.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a `267`.


## V268 - Convertitore listone flessibile

- Corretto il convertitore listone Excel che produceva 0 giocatori con file Classic a foglio singolo.
- Conservato il formato storico `Tutti`/`Ceduti`.
- Aggiunto riconoscimento automatico del foglio con colonna `Nome`.
- Aggiunta mappatura `QUOT.` -> quotazione attuale e `Fuori lista` -> asteriscato.


## V269 - Storico e confronto listoni

- Aggiunto confronto automatico tra listone selezionato e listone precedente della stessa stagione.
- Il convertitore listone arricchisce il JSON generato con campi `previous`, `diff`, `previousQuotationCurrent`, `quotationDiffFromPrevious`, `statusChange` e riepilogo `history`.
- La sezione pubblica `Listone` mostra un pannello `Storico listoni` con nuovi, usciti, variazioni quotazione e ricerca negli altri listoni.
- Il campo ricerca puo' trovare giocatori presenti in listoni passati anche quando non sono nel listone selezionato.
- Diagnostica: `window.ZonaOrientaleListoneHistoryV269`.
- Non sono state rimosse funzionalita' esistenti; il formato storico Tutti/Ceduti e il formato Classic a foglio singolo restano supportati.

## V270 - modifica listone visibile

- Aggiunta colonna opzionale `Modifica` nel Listone pubblico.
- La colonna mostra nuovi giocatori, usciti, variazioni di quotazione, cambi stato, squadra e ruolo.
- Aggiunto toggle `Mostra usciti storici` per includere in tabella i giocatori presenti nei listoni precedenti ma non nel listone selezionato.
- Per i giocatori usciti viene indicato l'ultimo listone in cui erano presenti.

## V271 - funzionalita V263-270

- Aggiunto `FUNZIONALITA'V263-270.md` come registro incrementale delle modifiche V263-V270.
- Tracciate le funzionalita' di accesso riservato, deliverability EmailJS, audit competizioni, convertitore listone flessibile, storico listoni e colonna `Modifica`.
- Nessuna modifica funzionale diretta al runtime oltre alla diagnostica `window.ZonaOrientaleFunctionLedgerV271`.


## V274 - Codici squadra canonici nel Listone

Il convertitore listone accetta sia sigle sia nomi estesi per la squadra reale, ma salva/visualizza la sigla canonica a 3 lettere. Questo evita falsi cambi squadra nei confronti storici e rende stabile la colonna `Modifica`.

## V276-V277

- V276: aggiunto pannello Admin `Diagnostica dati` con semafori pre-deploy su listoni, rose, competizioni, news, richieste presidenti, trattative, EmailJS e versione runtime.
- V277: aggiunto filtro `Modifiche` nel Listone per isolare nuovi, usciti, variazioni quotazione, cambi stato, squadra e ruolo.

## V278 - Export modifiche listone

Aggiunto export CSV non distruttivo delle modifiche del Listone. Il pulsante `Esporta modifiche CSV` rispetta il filtro `Modifiche` e include nuove righe, usciti storici, variazioni quotazione/stato/squadra/ruolo. Documento tecnico: `docs/zonaorientale/listoni/LISTONE_EXPORT_MODIFICHE_V278.md`.


## V280 - UI Listone semplificata

- Rimossa/nascosta dalla UI pubblica la sezione `Storico listoni`.
- Rimosso dalla UI il toggle `Cerca anche negli altri listoni`.
- Preservate le logiche storiche usate da colonna `Modifica`, filtro `Modifiche`, usciti storici ed export CSV.
- Aggiunta diagnostica `window.ZonaOrientaleListoneUiV280`.
- Aggiunto documento tecnico `docs/zonaorientale/listoni/LISTONE_UI_SEMPLIFICATA_V280.md`.
- Aggiunto audit `docs/zonaorientale/audit/AUDIT_MOBILE_LIGHT_CONTRAST_V280.md` per pianificare la prossima patch sulla leggibilita mobile in Light.


## V281 - Contrasto mobile Light

- Migliorata la leggibilita del tema Light da smartphone.
- Rafforzati testi secondari, hint, meta, badge e stati.
- Migliorato il contrasto del corpo tabella mobile e della prima colonna sticky.
- Aggiunta diagnostica `window.ZonaOrientaleMobileLightContrastV281`.
- Aggiunto documento `docs/zonaorientale/audit/AUDIT_MOBILE_LIGHT_CONTRAST_V281.md`.
- Nessuna modifica a dati, Firebase, EmailJS o `FUNZIONALITA'.md`.

## V286 - Fix prima colonna mobile Light

- Corretto contrasto della prima colonna sticky in modalita Light/mobile per Listone e tabelle rose.
- Evitato il caso nome giocatore nero su sfondo scuro.
- Forzato testo chiaro su sfondo scuro per celle, link e bottoni nome giocatore nella prima colonna sticky.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V286.
- Aggiunta diagnostica `window.ZonaOrientaleStickyColumnContrastV286`.
- Aggiunto documento `docs/zonaorientale/audit/FIX_PRIMA_COLONNA_MOBILE_LIGHT_V286.md`.
- Nessuna modifica a dati, Firebase, EmailJS o `FUNZIONALITA'.md`.


## V293 - Audit mirato app.js

- Aggiunto `docs/zonaorientale/refactor/APP_JS_AUDIT_V293.md`.
- Mappate le aree di `assets/app.js` da non toccare nel primo refactor JS: bootstrap, `renderAll` e override storici, Firebase/Auth/Admin, Dashboard Presidente, trattative, Listone, Archivio/Statistiche/Confronta e news share.
- Definiti i candidati sicuri per una futura estrazione V294: helper puri di testo, data/numero, export CSV e diagnostiche non bloccanti.
- Aggiunta diagnostica `window.ZonaOrientaleAppJsAuditV293`.
- Aggiornato lo script pre-push per verificare la presenza dell'audit V293.
- Nessuna modifica funzionale a UI, dati, Firebase, EmailJS o logiche runtime.
- Funzionalita da preservare esplicitamente nei prossimi refactor: Listone con Modifica/export, rose e pagina squadra, Dashboard Presidente, Admin Richieste/Diagnostica/Converti listone, mobile nav, `competition.html`, `player.html` e share WhatsApp.

## V294 - Helper puri app.js

- Aggiunto `assets/js/utils/shared-helpers-v294.js` come primo modulo di helper puri per il refactor di `assets/app.js`.
- Esposti helper per normalizzazione testo, slug, numeri, CSV e deduplicazione.
- Importato il modulo in `assets/app.js` con cache-buster `?v=294` ed esposto in `window.ZonaOrientaleSharedHelpersV294`.
- Aggiunta diagnostica `window.ZonaOrientaleAppHelpersExtractionV294` con smoke test.
- Aggiornato lo script pre-push per verificare modulo e documento V294.
- Nessuna funzione storica di `app.js` viene rimossa o ricollegata: Listone, rose, Dashboard Presidente, Admin, Firebase/EmailJS e mobile restano invariati.
- Aggiunto documento `docs/zonaorientale/refactor/APP_HELPERS_EXTRACTION_V294.md`.
## V295 - Primo collegamento helper puri app.js

- Aggiunto `assets/js/utils/shared-helpers-v295.js`.
- Collegato il solo `csvEscapeV278` dell'export modifiche Listone a `ZonaOrientaleSharedHelpersV295.csvEscape`.
- Mantenuti alias diagnostici V294 verso V295 per compatibilita console.
- Nessuna funzione storica rimossa da `assets/app.js`.
- Nessun cambio a Firebase, Auth, EmailJS, dati JSON, render Admin, Rose o mobile chrome.
- Aggiunto documento `docs/zonaorientale/refactor/APP_HELPER_REWIRE_V295.md`.
- Aggiornato lo script pre-push per verificare helper e documento V295.
- Funzionalita a rischio preservate: Listone `Modifica`/`Modifiche`/usciti storici/export CSV, Rose, Dashboard Presidente, Admin, News share WhatsApp e mobile nav.



## V297 - Pulizia helper V294 obsoleto

- Rimosso il vecchio `assets/js/utils/shared-helpers-v294.js` ormai sostituito da `shared-helpers-v295.js`.
- Nessuna funzione storica rimossa da `app.js`.
- Preservati export CSV Listone admin-only, filtri Listone, Rose, Admin, Firebase, EmailJS e mobile.
- Diagnostica: `window.ZonaOrientaleHelperCleanupV297`.

## V300 - Audit CSS e pulizia controllata styles.css

- Aggiunto `static/zonaorientale/tools/audit-css-v300.sh`.
- Aggiunto `docs/zonaorientale/refactor/CSS_AUDIT_V300.md`.
- Aggiornato `check-zonaorientale.sh` per verificare lo script e la documentazione V300.
- Nessuna regola CSS viene rimossa in questa release.
- Funzionalita a rischio esplicitamente preservate: Listone, rose/pagina squadra, Dashboard Presidente, mobile navigation, Dark mode unico, Admin e pagine standalone.

## V301 - Pulizia controllata CSS refactor residui

- Aggiunto `static/zonaorientale/tools/cleanup-css-refactor-v301.sh`.
- Lo script individua e rimuove solo in modalita controllata i vecchi CSS refactor versionati V291/V292, dopo verifica che non siano piu' referenziati.
- Nessuna regola CSS attiva viene modificata.
- Preservati Listone, rose/pagina squadra, Dashboard Presidente, mobile navigation, Dark mode unico, Admin e pagine standalone.
- Aggiunto documento `docs/zonaorientale/refactor/CSS_CLEANUP_V301.md`.

## V302 - Helper CSV condiviso e studio Calciomercato

- Collegato il builder CSV dell'export modifiche Listone a `ZonaOrientaleSharedHelpersV295.rowsToCsv`, mantenendo fallback legacy e restrizione admin-only V296.
- Aggiunta diagnostica `window.ZonaOrientaleAppHelperRewireV302`.
- Documentato lo studio di fattibilita' per una futura sezione `Calciomercato`, senza implementarla.
- Escluso il recupero Light mode dalla roadmap corrente: la modalita' Light resta sospesa.
- Nessuna modifica a Firebase, EmailJS, dati JSON, rose, Dashboard Presidente o Admin.

## V303 - Diagnostica dati Admin estesa

- Estesa `Admin -> Diagnostica dati` con controlli non distruttivi su qualita di Listoni, Rose, Competizioni e News.
- Nessuna scrittura Firebase, nessuna modifica ai dati JSON e nessuna logica Listone/Rose/Admin spostata.
- Funzionalita da preservare esplicitamente: export modifiche CSV solo Admin, colonna `Modifica`, filtro `Modifiche`, rose/pagina squadra, Dashboard Presidente, Richieste presidenti, mobile nav e Dark mode unico.
- Diagnostica runtime: `window.ZonaOrientaleAdminDiagnosticsV303`.



## V304 - Mobile review finale e pre-Calciomercato

- Aggiunto `docs/zonaorientale/audit/MOBILE_REVIEW_FINALE_V304.md`.
- Fissata la checklist finale mobile prima della nuova funzionalita Calciomercato.
- Nessuna nuova feature implementata e nessun cambio dati/runtime intenzionale.
- Funzionalita da preservare esplicitamente per la fase successiva: Listone pubblico/admin, export CSV solo Admin, rose/pagina squadra, Dashboard Presidente, Admin, mobile navigation, Dark mode unico, `competition.html`, `player.html` e share WhatsApp.
- Aggiunta diagnostica `window.ZonaOrientaleMobileFinalReviewV304`.

## V305 - Calciomercato base statico

- Aggiunta la sezione pubblica `Calciomercato` con navigazione desktop e link mobile in `Altro`.
- Aggiunto il file statico `assets/calciomercato/links.json` per configurare manualmente fonti e articoli.
- Aggiunte card articolo con filtri per squadra/topic e ricerca testuale.
- Nessun recupero automatico da siti esterni, nessuna scrittura Firebase e nessuna modifica a Fantamercato/Listone/Rose/Admin.
- Documentazione: `docs/zonaorientale/calciomercato/CALCIOMERCATO_BASE_V305.md`.

## V306 - Calciomercato: giocatori interessati

- Estesa la sezione pubblica `Calciomercato` con il campo `players`/`giocatori` negli articoli statici.
- I giocatori interessati vengono mostrati come chip nelle card articolo e sono inclusi nella ricerca.
- Nessuna lettura automatica da siti esterni, nessuno scraping, nessuna scrittura Firebase.
- Funzionalita preservate: Fantamercato interno, Listone, Rose, Dashboard Presidente, Admin, mobile navigation e Dark mode unico.
## V307 - Calciomercato nome sezione

- Rinominata la sezione pubblica da `Calcio mercato` a `Calciomercato` in menu desktop, menu mobile, titolo e messaggi runtime.
- Preservata la route interna `#calciomercato` e il JSON statico `assets/calciomercato/links.json`.
- Nessuna modifica a Fantamercato interno, Listone, Rose, Admin, Firebase o EmailJS.



## V308 - Calciomercato squadre multiple e stato trattativa

- La sezione `Calciomercato` resta statica/manuale e non recupera automaticamente dati dai siti esterni.
- Ogni articolo puo essere collegato a piu squadre tramite `teams`, `teamNames` o `squadre`.
- Ogni articolo puo mostrare uno stato trattativa tramite `marketStatus`, `status` o `stato`.
- Funzionalita preservate: Fantamercato interno, Listone, export CSV solo Admin, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, mobile navigation e Dark mode unico.

## V309 - Calciomercato automatico RSS

V309 introduce il recupero automatico degli articoli Calciomercato tramite Netlify Function `netlify/functions/calciomercato-feed.js`. Le fonti sono configurate in `assets/calciomercato/links.json`; fonti iniziali: TuttoMercatoWeb, SOS Fanta e Gianluca Di Marzio. Il browser usa la funzione server-side e ricade sul JSON statico se la funzione non e' disponibile. Non modifica Fantamercato interno, Listone, Rose, Admin, Firebase o EmailJS. Diagnostica: `window.ZonaOrientaleCalciomercatoV309`.


## V310 - Calciomercato layout orizzontale

- Corretto il layout della sezione `Calciomercato`: gli articoli RSS vengono mostrati in card orizzontali/lista invece che in colonne strette.
- Intervento isolato al CSS della sezione Calciomercato.
- Nessuna modifica a feed RSS, Netlify Function, fallback statico, Fantamercato interno, Listone, Rose, Admin, Presidente o Firebase.
- Diagnostica: `window.ZonaOrientaleCalciomercatoLayoutV310`.

## V311 - Ora pubblicazione articoli Calciomercato

- La card degli articoli Calciomercato mostra ora data e ora quando il feed RSS espone un timestamp completo.
- Il fallback resta compatibile con date semplici o stringhe non parseabili.
- Nessuna modifica a Fantamercato interno, Listone, Rose, Admin, Firebase o formato dati statico.

## V312 - Fuso orario articoli Calciomercato

- Corretto il riepilogo `aggiornato ...` della sezione Calciomercato: ora non usa piu la stringa UTC grezza ma formatta in `Europe/Rome`.
- Anche data/ora degli articoli RSS viene normalizzata con lo stesso formatter.
- Nessuna modifica a Netlify Function, recupero RSS, fallback statico, Fantamercato interno, Listone, Rose, Admin o Firebase.

## V314 - Calciomercato fonti e piano AI

- Il filtro squadra della sezione `Calciomercato` ora mostra `Generale` subito dopo `Tutte le squadre`.
- Aggiunto filtro fonte (`Tutte le fonti`) per selezionare gli articoli per testata/feed.
- Estesa la configurazione RSS con fonti aggiuntive: Fantacalcio.it, La Gazzetta dello Sport, Virgilio Sport e CalcioMercato.it, oltre a TMW, SOS Fanta e Gianluca Di Marzio.
- Aumentati i limiti configurabili degli articoli recuperabili dalla Netlify Function.
- Documentata la fattibilita' del futuro modulo AI per riepiloghi per giocatore/squadra.
- Nessuna modifica a Fantamercato interno, Firebase, EmailJS, Listone, Rose, Dashboard Presidente o Admin.

## V316 - Calciomercato ricerca e range

- Rimossa l'idea di applicare ora la sintesi AI: nessuna funzione AI e nessuna chiave OpenAI richiesta.
- Rimossi dalle fonti attive Virgilio Sport e La Gazzetta dello Sport.
- Aggiunti ricerca per keyword e range temporale sui feed RSS Calciomercato.
- Default UI: ultime 12 ore; scroll/pulsante caricano articoli più vecchi.
- Limiti feed alzati a 500 articoli totali, 250 per fonte, 20 fonti.
- Funzionalita da preservare: Fantamercato interno, Listone, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, mobile navigation e fallback statico.

## V317 - Calciomercato scroll e range RSS

V317 corregge il caricamento progressivo del Calciomercato: quando si arriva in fondo alla sezione o si clicca `Carica articoli piu vecchi`, il sito non deve tornare in alto e deve mantenere la posizione di scroll. La lista non viene piu sostituita dal loader durante il caricamento degli articoli meno recenti.

La Netlify Function `calciomercato-feed` espone anche un riepilogo `feedRange`, cosi la UI puo spiegare quando un range molto vecchio non produce risultati perche i feed RSS non sono un archivio storico completo.

Funzionalita da preservare: Fantamercato interno, Listone pubblico/Admin, export CSV solo Admin, Rose, pagina squadra, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, mobile navigation e fallback statico Calciomercato.

## V319 - Calciomercato mobile compatto

V319 migliora la leggibilita mobile della sezione `Calciomercato`: i filtri vengono posizionati sotto il titolo `Articoli di mercato`, i menu `Squadre`/`Topic`/`Fonti` sono affiancati, il campo `Cerca...` usa tutta la larghezza, il range `Da/A` e' piu compatto e le card mobile mostrano immagine quadrata con titolo/metadati senza descrizione lunga. Nessuna modifica a feed RSS, Netlify Function, fallback statico, Fantamercato interno, Listone, Rose, Dashboard Presidente o Admin. Diagnostica: `window.ZonaOrientaleCalciomercatoMobileV319`.


## V320 - Riconoscimento automatico Calciomercato

- Aggiunto riconoscimento euristico di squadre, giocatori e allenatori negli articoli RSS.
- La funzione Calciomercato espone `detectedTeams`, `detectedPlayers` ed `entities`.
- La ricerca e il filtro squadra includono anche le entita rilevate automaticamente.
- Nessuna modifica a Fantamercato interno, Listone, Rose, Admin, Presidente, Firebase/Auth/EmailJS.


## V321 - Fix espansione Diagnostica dati Admin

Ripristinata l'espansione del pannello `Admin -> Diagnostica dati` con handler delegato limitato al solo pannello diagnostica. Nessuna modifica a Firebase, Listone, Rose, Calciomercato o Dashboard Presidente.


## V322 - Fix diagnostica ruoli Listone

Corretto il falso positivo nel pannello `Admin -> Diagnostica dati`, riga `Listoni - qualita dati`, che poteva segnalare `senza ruolo 663` nonostante i ruoli fossero presenti nei JSON Listone. La diagnostica ora riconosce anche `classicRole`, `rosterRole`, `mantraRoles`, `roleClassic`, `roleMantra`, `R`, `R.` e `R.MANTRA`. Nessun JSON, rendering Listone, convertitore, Firebase, EmailJS, Calciomercato o Fantamercato interno e' stato modificato.

## V329 - Calciomercato fonti TMW per squadra

- Sostituita la fonte generica `TuttoMercatoWeb` con 20 fonti TMW dedicate alle squadre indicate in `assets/calciomercato/links.json`.
- La Netlify Function `calciomercato-feed` ora supporta anche pagine HTML TMW squadra, oltre ai feed RSS gia presenti.
- Aumentati i limiti di recupero/download archivio Calciomercato a 5000 articoli globali e 500 per fonte configurata.
- Il download Admin dell'archivio statico giornaliero usa i nuovi limiti e puo includere gli articoli TMW squadra nei JSON da copiare in `assets/calciomercato/archive/`.
- Per gli articoli TMW squadra senza immagine anteprima viene mostrato un fallback a scudetto della squadra; per le altre fonti resta il fallback favicon/tile V328.
- `removedSourcesV316` include anche `TuttoMercatoWeb`/`tuttomercatoweb`, per indicare che il canale generico e' stato sostituito dai canali squadra.
- Funzionalita preservate: Calciomercato V328, toggle Solo Admin V327, menu mobile V326, archivio statico V323/V324, Netlify Function, Listone, Rose, Fantamercato interno, Dashboard Presidente, Firebase/Auth/EmailJS.

## V330 - Calciomercato fallback testuale TMW squadra

- Per gli articoli delle fonti TMW squadra senza immagine anteprima viene ora mostrata una tile SVG con testo `TMW - <NomeSquadra>`.
- Il parser HTML TMW non usa piu lo scudetto/logo squadra come `image` artificiale: mantiene `teamLogoUrl` solo come metadato, cosi la UI puo distinguere le immagini articolo reali dai fallback.
- Gli eventuali JSON archivio gia generati con `image` uguale a `teamLogoUrl` vengono trattati come mancanti e mostrano comunque la nuova tile testuale.
- `links.json` usa `fallbackImageMode: tmw-team-text` per le 20 fonti TMW squadra.
- Restano invariati limiti download V329, parser RSS/HTML, fallback favicon/tile per fonti non TMW, mobile card V328, toggle Solo Admin V327 e rifiniture UI V326.

## V332 - Card Calciomercato piu compatte

- Ridotto l'ingombro delle schede articolo nella sezione `Calciomercato`, intervenendo soprattutto sulla dimensione dell'immagine di anteprima.
- Su desktop le card usano una colonna immagine piu stretta e meno alta, mantenendo titolo, metadati, fonte/data e link articolo.
- Su mobile l'immagine scende a una miniatura piu compatta, mantenendo titolo cliccabile e metadati essenziali.
- Restano invariati feed, archivio statico, fallback favicon/TMW, Netlify Function, Listone, Rose, Fantamercato interno, Dashboard Presidente e Admin.


## V333 - Refactor CSS protetto Listone

- Creato `assets/css/refactor/listone.css` per ospitare le regole specifiche del Listone, iniziando la pulizia del CSS senza cambiare comportamento runtime.
- Spostate da `mobile-controls.css` solo le regole del filtro `Modifiche` Listone, mantenendo invariati classi, ID DOM, export CSV e logiche JS.
- Collegato `listone.css?v=333` in `index.html`; `competition.html` e `player.html` restano senza CSS Listone per non caricare asset non necessari.
- Aggiunta diagnostica `window.ZonaOrientaleRefactorCssProtettoV333`.
- Aggiornato `check-zonaorientale.sh` per verificare file CSS V333 e documentazione dedicata.
- Aggiunti `FUNZIONALITAV333.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V333.md`, `refactor/CSS_REFACTOR_PROTETTO_V333.md` e `release/RELEASE_V333_REFACTOR_CSS_PROTETTO.md`.
- Non modificato `FUNZIONALITA'.md`.
- Funzionalita preservate: Calciomercato V332/V330/V329, Listone con filtro Modifiche e export CSV solo Admin, Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, News/share WhatsApp, mobile navigation, `competition.html` e `player.html`.

## V337 - Matching giocatore Calciomercato migliorato

- Creato `assets/js/calciomercato/calciomercato-players-v337.js` come evoluzione protetta del modulo V335.
- Il matching articolo -> giocatore ora rimuove sempre punteggiatura, apostrofi, tag HTML, separatori e spazi multipli prima del confronto.
- Corretto il caso di titoli come `Kalulu, ...`, che ora riconoscono `Kalulu` se presente nell'ultimo listone della stagione selezionata.
- La policy resta conservativa: nome completo o cognome univoco; nessun matching fuzzy aggressivo.
- La timeline giocatore resta in modal V336, chiudibile con X/sfondo/Escape.
- Aggiunta diagnostica `window.ZonaOrientaleCalciomercatoPlayerMatchingV337` con smoke test runtime.
- Aggiornato `check-zonaorientale.sh` per verificare il modulo V337.
- Aggiunti `FUNZIONALITAV337.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V337.md`, `refactor/CALCIOMERCATO_PLAYER_MATCHING_V337.md`, `release/RELEASE_V337_PLAYER_MATCHING.md`.
- Non modificati `FUNZIONALITA'.md`, Netlify Functions, `links.json`, archivi Calciomercato, JSON Listone, Firebase/Auth/EmailJS, Listone runtime, Rose, Fantamercato interno, Dashboard Presidente o Admin.
## V338 - Renderer card Calciomercato protetto

- Creato `assets/js/calciomercato/calciomercato-render-v338.js` per isolare il rendering HTML delle card articolo Calciomercato.
- `renderCalciomercatoArticleCardV306(article)` resta in `assets/app.js` come wrapper storico verso il renderer V338.
- Il markup equivalente preserva card compatte V332, tag giocatore V335-V337, modal timeline V336, fallback immagini V334/V328/V330, titolo/immagine cliccabili e metadati fonte/data.
- Aggiunta diagnostica `window.ZonaOrientaleCalciomercatoRendererV338`.
- Aggiornato `check-zonaorientale.sh` per verificare modulo e delega V338.
- Aggiunti `FUNZIONALITAV338.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V338.md`, `refactor/CALCIOMERCATO_RENDERER_REFACTOR_V338.md`, `release/RELEASE_V338_CALCIOMERCATO_RENDERER_REFACTOR.md`.
- Non modificati `FUNZIONALITA'.md`, Netlify Functions, `links.json`, archivi Calciomercato, JSON Listone, CSS card, Firebase/Auth/EmailJS, Listone runtime, Rose, Fantamercato interno, Dashboard Presidente o Admin.

## V339 - Filtri Calciomercato protetti

- Creato `assets/js/calciomercato/calciomercato-filters-v339.js` per isolare ricerca, filtri select e binding controlli della sezione Calciomercato.
- I wrapper storici in `assets/app.js` restano attivi e delegano al modulo V339: `getCalciomercatoFilteredArticlesV306`, `renderCalciomercatoSelectOptionsV306`, `renderCalciomercatoTeamSelectOptionsV314`, `renderCalciomercatoSourceSelectOptionsV314`, `setupCalciomercatoControlsV306`.
- Preservati filtri `Cerca`, squadra, topic, fonte, range `Da/A`, reset/applica periodo e caricamento articoli piu vecchi.
- Aggiunta diagnostica `window.ZonaOrientaleCalciomercatoFiltersV339`.
- Aggiornato `check-zonaorientale.sh` per verificare modulo/delega/documentazione V339.
- Aggiunti `FUNZIONALITAV339.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V339.md`, `refactor/CALCIOMERCATO_FILTERS_REFACTOR_V339.md`, `release/RELEASE_V339_CALCIOMERCATO_FILTERS_REFACTOR.md`.
- Non modificati `FUNZIONALITA'.md`, Netlify Functions, `links.json`, archivi Calciomercato, JSON Listone, CSS, Firebase/Auth/EmailJS, Listone runtime, Rose, Fantamercato interno, Dashboard Presidente o Admin.


## V340 - Archivio Admin Calciomercato e matching giocatore protetti

- Creato `assets/js/calciomercato/calciomercato-admin-v340.js` per isolare il rendering/toggle del pannello `Solo Admin` della sezione Calciomercato.
- `renderCalciomercatoArchiveAdminToolsV323()` resta wrapper storico in `assets/app.js` e delega al modulo V340.
- `setCalciomercatoArchiveAdminExpandedV327()` resta disponibile e delega al modulo V340.
- Creato `assets/js/calciomercato/calciomercato-players-v340.js` come evoluzione del matching V337.
- Il matching ora distingue alias singoli capitalizzati: `Giovane, ...` viene riconosciuto come giocatore, mentre `giovane` minuscolo come aggettivo non genera match.
- Aggiunte diagnostiche `window.ZonaOrientaleCalciomercatoArchiveAdminV340` e `window.ZonaOrientaleCalciomercatoPlayerMatchingV340`.
- Aggiornato `check-zonaorientale.sh` per verificare modulo Admin V340, matching V340 e documentazione V340.
- Aggiunti `FUNZIONALITAV340.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V340.md`, `refactor/CALCIOMERCATO_ARCHIVE_ADMIN_REFACTOR_V340.md`, `release/RELEASE_V340_ARCHIVE_ADMIN_PLAYER_MATCHING.md`.
- Non modificati `FUNZIONALITA'.md`, Netlify Functions, `links.json`, archivi Calciomercato, JSON Listone, Firebase/Auth/EmailJS, Listone runtime, Rose, Fantamercato interno, Dashboard Presidente o Admin generale.


## V341 - Shared helper bridge protetto

- Creato `assets/js/utils/shared-helper-bridge-v341.js` per centralizzare helper puri gia usati dal sito senza cambiare comportamento pubblico.
- Ricollegati in modo conservativo i wrapper storici `csvEscapeV278`, `buildListoneChangeExportCsvV278`, `normalizeListoneSearchKeyV269`, `normalizeDiagnosticKeyV303` e `normalizeCalciomercatoValueV306`.
- Il bridge usa `ZonaOrientaleSharedHelpersV295` quando disponibile e mantiene fallback locali per CSV e normalizzazioni.
- Aggiunta diagnostica `window.ZonaOrientaleSharedHelperBridgeV341` con smoke test runtime.
- Aggiornato `check-zonaorientale.sh` per verificare modulo/delega/documentazione V341.
- Aggiunti `FUNZIONALITAV341.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V341.md`, `refactor/SHARED_HELPER_BRIDGE_V341.md`, `release/RELEASE_V341_SHARED_HELPER_BRIDGE.md`.
- Non modificati `FUNZIONALITA'.md`, Netlify Functions, `links.json`, archivi Calciomercato, JSON Listone, Firebase/Auth/EmailJS, Listone runtime, Rose, Fantamercato interno, Dashboard Presidente o Admin generale.
## V342 - Audit dipendenze legacy protetto

- Creato `static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs` per individuare riferimenti locali mancanti, file versionati superati e JS/CSS non referenziati direttamente.
- La release e' audit-only: nessun file legacy e' stato rimosso.
- Aggiunta diagnostica `window.ZonaOrientaleLegacyDependencyAuditV342`.
- Documentata la matrice candidati in `docs/zonaorientale/audit/LEGACY_DEPENDENCIES_MATRIX_V342.md`.
- Aggiornato `check-zonaorientale.sh` per verificare tool, marker e documentazione V342.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V342.
- Non modificati `FUNZIONALITA'.md`, Netlify Functions, `links.json`, archivi Calciomercato, JSON Listone, Firebase/Auth/EmailJS, Listone runtime, Rose, Fantamercato interno, Dashboard Presidente o Admin generale.


## V345 - Cleanup helper legacy condivisi

- Rimosso in modo controllato `assets/js/utils/shared-helpers-v294.js`, gia sostituito da `shared-helpers-v295.js` e dal bridge `shared-helper-bridge-v341.js`.
- Nessun call-site funzionale viene scollegato: restano attivi i wrapper storici `csvEscapeV278`, `buildListoneChangeExportCsvV278`, `normalizeListoneSearchKeyV269`, `normalizeDiagnosticKeyV303` e `normalizeCalciomercatoValueV306`.
- Aggiunto `static/zonaorientale/tools/audit-shared-helpers-v345.mjs` per verificare assenza del file V294, presenza degli helper attivi e wiring runtime V345.
- Aggiunta diagnostica `window.ZonaOrientaleSharedHelperLegacyCleanupV345` con smoke test runtime.
- Aggiornato `check-zonaorientale.sh` per verificare tool, marker e documentazione V345.
- Aggiunti `FUNZIONALITAV345.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V345.md`, `refactor/SHARED_HELPER_LEGACY_CLEANUP_V345.md`, `audit/SHARED_HELPER_LEGACY_CLEANUP_MATRIX_V345.md`, `release/RELEASE_V345_SHARED_HELPER_LEGACY_CLEANUP.md`.
- Non modificati `FUNZIONALITA'.md`, Netlify Functions, `links.json`, archivi Calciomercato, JSON Listone, Firebase/Auth/EmailJS, Listone runtime, Rose, Fantamercato interno, Dashboard Presidente o Admin generale.

## V347 - Cleanup duplicato simulatore trade

- Rimosso in modo controllato `assets/js/trade-notification-simulator-v255.js`, duplicato top-level non importato dal runtime.
- Preservato il modulo canonico `assets/js/dev/trade-notification-simulator-v255.js`, ancora importato da `assets/app.js?v=347`.
- Aggiunto tool `static/zonaorientale/tools/audit-trade-simulator-v347.mjs` per verificare assenza del duplicato, presenza del modulo canonico e assenza di link HTML al file rimosso.
- Aggiunto marker runtime `window.ZonaOrientaleTradeSimulatorCleanupV347`.
- Aggiornato `check-zonaorientale.sh` per includere controllo V347 e documentazione dedicata.
- Aggiunti `FUNZIONALITAV347.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V347.md`, `refactor/TRADE_SIMULATOR_CLEANUP_V347.md`, `audit/TRADE_SIMULATOR_CLEANUP_MATRIX_V347.md`, `release/RELEASE_V347_TRADE_SIMULATOR_CLEANUP.md`.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V347.
- Non modificati `FUNZIONALITA'.md`, Netlify Functions, Calciomercato, Listone, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, Fantamercato interno o mobile navigation.

## V349 - Azioni locali simulatore trade

- Corretto il comportamento delle trattative simulate create da `ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()`.
- I pulsanti `Accetta` / `Rifiuta` su righe `localOnly` non chiamano piu Firebase e non generano `Missing or Insufficient permissions`.
- Aggiunto wrapper conservativo `updateNegotiationStatusV349`: le trattative simulate aggiornano solo stato locale, mentre le trattative reali delegano al flusso storico Firebase.
- Dopo un'azione locale vengono aggiornati area presidente, pagina Fantamercato e badge notifiche.
- Aggiunto tool `tools/audit-trade-simulator-local-actions-v349.mjs`.
- Aggiunto marker runtime `window.ZonaOrientaleTradeSimulatorLocalActionsV349`.
- Aggiunti `FUNZIONALITAV349.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V349.md`, `refactor/TRADE_SIMULATOR_LOCAL_ACTIONS_V349.md`, `audit/TRADE_SIMULATOR_LOCAL_ACTIONS_MATRIX_V349.md`, `release/RELEASE_V349_TRADE_SIMULATOR_LOCAL_ACTIONS.md`.
- Non modificati `FUNZIONALITA'.md`, Calciomercato, Listone, Rose, Admin generale, Firebase/Auth/EmailJS, Netlify Functions o navigazione mobile.

## V350 - Cleanup simulatore trade dev legacy

- Rimosso in modo controllato `assets/js/dev/trade-notification-simulator-v254.js`, gia non importato dal runtime.
- Preservato il modulo canonico `assets/js/dev/trade-notification-simulator-v255.js` e l'alias console storico `ZonaOrientaleTradeSimulatorV254`.
- Preservate le azioni locali V349 su trattative simulate: `Accetta` / `Rifiuta` non scrivono su Firebase.
- Aggiornato l'audit V348 per restare compatibile con il cleanup successivo.
- Aggiunto `tools/audit-trade-simulator-dev-cleanup-v350.mjs`.
- Aggiunto marker runtime `window.ZonaOrientaleTradeSimulatorDevCleanupV350`.
- Aggiunti `FUNZIONALITAV350.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V350.md`, `refactor/TRADE_SIMULATOR_DEV_CLEANUP_V350.md`, `audit/TRADE_SIMULATOR_DEV_CLEANUP_MATRIX_V350.md`, `release/RELEASE_V350_TRADE_SIMULATOR_DEV_CLEANUP.md`.
- Non modificati `FUNZIONALITA'.md`, Calciomercato, Listone, Rose, Admin generale, Firebase/Auth/EmailJS, Netlify Functions o navigazione mobile.
## V352 - Cleanup mobile hotfix legacy

- Rimossi i file CSS sciolti `mobile-hotfix-v166.css` e `mobile-hotfix-v167.css`, gia consolidati in `mobile-suite-v168.css`.
- Aggiunto audit `audit-mobile-hotfix-v352.mjs`.
- Aggiornati footer, cache-buster e controlli obbligatori a V352.
- Preservate navigazione mobile, menu Altro, tabelle mobile, card Calciomercato e tema light/dark.

## V354 - Consolidamento finale ciclo cleanup/refactor

- Aggiunto consolidamento documentale e audit del ciclo V333-V353.
- Nessuna rimozione e nessun cambio funzionale intenzionale.
- Aggiunto marker runtime `window.ZonaOrientaleRefactorConsolidationV354`.
- Aggiunto tool `static/zonaorientale/tools/audit-refactor-consolidation-v354.mjs`.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V354.
- Aggiornato `check-zonaorientale.sh` con controllo consolidamento V354 e documentazione dedicata.
- Aggiunti `FUNZIONALITAV354.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V354.md`, `refactor/REFACTOR_CLEANUP_CONSOLIDATION_V354.md`, `audit/REFACTOR_CLEANUP_CONSOLIDATION_MATRIX_V354.md`, `release/RELEASE_V354_REFACTOR_CLEANUP_CONSOLIDATION.md`.
- Non modificato `FUNZIONALITA'.md`.
- Prossimo step consigliato: test manuale funzionale completo; solo dopo valutare cleanup separati di `domain/competitions.js`, `theme-light-suspended.css`, `admin-publication-workflow-v213.js`.


## V355 - Suite regressione/smoke post cleanup

- Aggiunto audit statico `static/zonaorientale/tools/audit-regression-smoke-v355.mjs`.
- Aggiunto marker runtime `window.ZonaOrientaleRegressionSmokeSuiteV355`.
- Aggiunta checklist manuale completa `docs/zonaorientale/test/TEST_MANUALE_COMPLETO_V355.md`.
- Aggiunti documenti `FUNZIONALITAV355.md`, `handoff/HANDOFF_NUOVO_ASSISTENTE_V355.md`, `refactor/REGRESSION_SMOKE_SUITE_V355.md`, `audit/REGRESSION_SMOKE_MATRIX_V355.md`, `release/RELEASE_V355_REGRESSION_SMOKE_SUITE.md`.
- Aggiornati footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a V355.
- Nessun cambio funzionale e nessuna rimozione di file.

## V356 - Manual QA tracker post-refactor

- Aggiunto marker runtime `ZonaOrientaleManualQaTrackerV356`.
- Aggiunti comandi console per tracciare test manuali, note, riepilogo ed export Markdown.
- Aggiunto audit `audit-manual-qa-tracker-v356.mjs` e controlli in `check-zonaorientale.sh`.
- Aggiornati footer, cache-buster e versione runtime a V356.
- Nessuna modifica funzionale, nessuna rimozione, nessuna scrittura Firebase/Netlify.

## V357 - Checklist QA da interfaccia Admin

- Aggiunta bottom area grafica **Checklist QA Admin**, visibile solo agli admin.
- Stati QA salvati localmente e compatibili con tracker V356.
- Pulsanti rapidi per aprire sezioni e simulare una proposta trade.
- Export riepilogo Markdown.
- Nessuna rimozione file e nessun cambio funzionale ai flussi esistenti.


## V358 - Manual QA panel migliorato

- Migliorata la checklist QA Admin da interfaccia con gruppi, filtri, reset per area, auto-check e copia riepilogo.
- Nessuna rimozione e nessun cambio ai flussi core.

## V361 - Simulatore notifiche trade da interfaccia Admin

- Aggiunto `window.ZonaOrientaleTradeSimulatorPanelV361`.
- Aggiunto pannello simulazioni trade nella Checklist QA Admin.
- Aggiunti pulsanti: Simula ricevuta, Esito accettato, Esito rifiutato, Aggiorna badge, Pulisci simulazioni.
- Le azioni restano local-only e non scrivono su Firebase.
- Aggiunti documenti e audit V361.

## V362 - Simulazione notifica trade verso presidente da Admin

- Aggiunto menu destinatario nella Checklist QA Admin per simulare una proposta ricevuta da uno specifico presidente/squadra.
- Le simulazioni restano local-only e vengono salvate nel browser per testare il passaggio al profilo presidente.
- Aggiunto audit `audit-trade-simulator-target-v362.mjs`.
- Nessuna modifica a Firebase, Netlify o trattative reali.

## V383 - Soccer Data FBref batch-11 finale

- Aggiunti 31 mapping FBref confermati nel batch finale.
- Mapping confermati totali: 531/532.
- Balentien resta in `needs-review` per assenza di profilo FBref stabile verificabile.
- Nessuno scraping live, nessuna scrittura Firebase, nessuna modifica a `FUNZIONALITA'.md`.

## V385 - Soccer Data associazione FBref locale

- Aggiunto mini flusso di associazione FBref per giocatori non mappati/needs-review.
- La UI consente di incollare link FBref, indicare nome opzionale e preparare patch JSON locale.
- Aggiunti pulsanti `Copia patch FBref` e `Scarica patch FBref`.
- Mapping corrente invariato: `fbref-player-map.v383.json`.
- Nessuna scrittura Firebase, nessuno scraping live, nessuna modifica a `FUNZIONALITA'.md`.

## V386 - Soccer Data solo admin

- Resa la sezione Soccer Data disponibile solo agli admin.
- Nascosti ai non-admin i link Soccer Data desktop e mobile tramite logica `nav-link-admin`.
- Bloccato l'accesso diretto `#soccerdata` per utenti non-admin, con ritorno alla dashboard e richiesta login.
- Evitato il caricamento manifest/mapping Soccer Data quando l'utente non e admin.
- Colorato in verde il link giocatore FBref nella colonna `FBref / Giocatore`.
- Mapping corrente invariato: `fbref-player-map.v383.json`.
- Nessuna scrittura Firebase, nessuno scraping live, nessuna modifica a `FUNZIONALITA'.md`.
