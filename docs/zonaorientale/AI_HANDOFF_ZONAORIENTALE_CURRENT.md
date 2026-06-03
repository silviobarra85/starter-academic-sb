## Aggiornamento V313 - Admin ordinato e resoconto funzionale

V313 corregge l'area Admin: il titolo `Admin` viene mantenuto sopra tutti i pannelli informativi (`Avvisi pubblicazione`, `Stato Firebase / JSON`, `Procedura guidata Pubblica aggiornamenti`), le categorie Admin partono ridotte e il pannello `Carica dati amministrazione` resta aperto. La Netlify Function `calciomercato-feed.js` passa a V313 con supporto a feed multipli per fonte e limite articoli configurabile. Aggiunti `RESOCONTO_SITO_V313.md`, `admin/ADMIN_LAYOUT_V313.md`, `calciomercato/CALCIOMERCATO_FEED_V313.md` e `handoff/HANDOFF_NUOVO_ASSISTENTE_V313.md`. `FUNZIONALITA'.md` e' stato aggiornato su richiesta esplicita dell'utente. Diagnostica: `window.ZonaOrientaleAdminLayoutV313`.

Funzionalita da preservare obbligatoriamente: Home, News/share WhatsApp, Rose, Fantamercato interno, Calciomercato, Listone con Modifica/filtro/export admin-only, Competizioni, Archivio/Statistiche/Confronta, Dashboard Presidente, Admin leggero/completo, Richieste presidenti, Diagnostica dati, Converti listone Excel, mobile nav e Dark mode unico.

## Aggiornamento V299 - CSS refactor stabile

V299 consolida i CSS refactor introdotti in V291/V292 con nomi stabili: `assets/css/refactor/mobile-controls.css`, `assets/css/refactor/rosters-tables.css` e `assets/css/refactor/theme-light-suspended.css`. Gli HTML importano solo i primi due; il Light resta sospeso e non importato. I vecchi file versionati `mobile-controls-v292.css`, `rosters-tables-v292.css` e `theme-light-suspended-v292.css` vanno rimossi con `git rm` dopo applicazione overlay. Nessuna regola CSS intenzionalmente cambiata, nessuna logica JS spostata. Diagnostica: `window.ZonaOrientaleCssStableRefactorV299`.

Funzionalita da verificare: Listone pubblico/Admin, colonna `Modifica`, filtro `Modifiche`, export admin-only, Rose e prima colonna sticky, Dashboard Presidente, bottom nav/menu Altro/pulsante Su, Dark mode unico, `competition.html` e `player.html`.

## Aggiornamento V298 - Audit asset/import orfani

V298 aggiunge `static/zonaorientale/tools/audit-assets-v298.sh` e `docs/zonaorientale/refactor/ASSET_IMPORT_AUDIT_V298.md`. Il tool e' solo diagnostico: segnala riferimenti locali mancanti e candidati orfani, ma non autorizza cancellazioni automatiche. Prima di rimuovere asset verificare sempre le funzionalita a rischio: CSS mobile/rose/tabelle V292, Dark mode unico V289, Listone con Modifica/filtro/export admin-only, helper CSV V295, `competition.html`, `player.html`, Admin, Presidente e news share. Diagnostica: `window.ZonaOrientaleAssetImportAuditV298`.

## Aggiornamento V296 - Export modifiche Listone solo Admin

V296 rende il pulsante `Esporta modifiche CSV` disponibile solo per utenti Admin. Il Listone pubblico conserva colonna `Modifica`, filtro `Modifiche`, usciti storici, ricerca e visualizzazione; cambia solo la disponibilita' del download CSV. Il calcolo CSV V278 e l'escape helper V295 restano invariati. Diagnostica: `window.ZonaOrientaleListoneExportAdminOnlyV296`. Documento tecnico: `docs/zonaorientale/refactor/LISTONE_EXPORT_ADMIN_ONLY_V296.md`.

Funzionalita da preservare nei test: Listone pubblico senza pulsante export per non Admin, Listone Admin con export funzionante, filtro `Modifiche`, `Mostra usciti storici`, rose/pagina squadra, Dashboard Presidente, Admin, mobile nav e news share.

## Aggiornamento V295 - Primo collegamento helper puri app.js

V295 introduce `assets/js/utils/shared-helpers-v295.js` e collega in modo minimale `csvEscapeV278` all'helper condiviso `ZonaOrientaleSharedHelpersV295.csvEscape`. Il refactor non rimuove funzioni storiche e non tocca Firebase/Auth/EmailJS, render Admin, Rose, Listone o mobile chrome. Documento tecnico: `docs/zonaorientale/refactor/APP_HELPER_REWIRE_V295.md`. Diagnostica: `window.ZonaOrientaleAppHelpersExtractionV295`.

Funzionalita da verificare obbligatoriamente: Listone con `Modifica`, filtro `Modifiche`, usciti storici ed export CSV; rose e pagina squadra; Dashboard Presidente; Admin Richieste/Diagnostica/Converti listone; news share WhatsApp; bottom nav/menu Altro/pulsante Su.

## Aggiornamento V293 - Audit mirato app.js

V293 aggiunge `docs/zonaorientale/refactor/APP_JS_AUDIT_V293.md` e la diagnostica `window.ZonaOrientaleAppJsAuditV293`. Non cambia comportamento runtime e non estrae ancora codice. Prima di qualunque refactor JS futuro, verificare le funzionalita a rischio e preservare esplicitamente: Listone/Modifica/export, rose e pagina squadra, Dashboard Presidente, trattative, Admin Richieste/Diagnostica/Converti listone, Archivio/Statistiche/Confronta, news share WhatsApp, mobile nav, `competition.html` e `player.html`.

## Aggiornamento V292 - Pulizia CSS Light sospeso

V292 prosegue il refactor CSS senza cambiare comportamento visibile. I CSS attivi diventano `assets/css/refactor/mobile-controls-v292.css` e `assets/css/refactor/rosters-tables-v292.css`; le patch Light recenti V285-V288 vengono conservate in `assets/css/refactor/theme-light-suspended-v292.css`, non importato finche la Light mode non sara ricostruita e testata. Funzionalita da preservare: Listone Modifica/export, rose/pagina squadra, Dashboard Presidente, bottom navigation mobile e Dark mode unico V289. Documento: `docs/zonaorientale/refactor/CSS_CLEANUP_V292.md`. Diagnostica: `window.ZonaOrientaleCssCleanupV292`.

## Aggiornamento V291 - Refactor CSS prudente

V291 separa i blocchi CSS mobile/rose/tabelle V285-V289 da `assets/styles.css` nei file `assets/css/refactor/mobile-controls-v291.css` e `assets/css/refactor/rosters-tables-v291.css`. Il caricamento avviene dopo i CSS storici per preservare gli override. Non cambia logiche JS, Firebase, EmailJS o dati. Prima di ulteriori pulizie verificare che non si perdano: Listone Modifica/export, rose e pagina squadra, Dashboard Presidente, bottom navigation mobile e Dark mode unico V289. Documento: `docs/zonaorientale/refactor/CSS_REFACTOR_V291.md`. Diagnostica: `window.ZonaOrientaleCssRefactorV291`.

## Aggiornamento V290 - Audit styles.css e app.js

V290 aggiunge un audit conservativo di `assets/styles.css` e `assets/app.js` prima di qualunque refactor reale. Non cambia comportamento runtime: aggiorna versione/cache-buster, aggiunge diagnostica `window.ZonaOrientaleStylesAppAuditV290` e documenta funzionalita a rischio da preservare in `docs/zonaorientale/refactor/AUDIT_STYLES_APP_V290.md`. Regola operativa: ogni refactor successivo deve dichiarare cosa rischia di perdere e come lo preserva.

## Aggiornamento V289 - Dark mode e rose mobile

V289 sospende temporaneamente la modalita Light: il sito forza il tema Dark anche se nel browser era salvato Light e il pulsante cambio tema viene nascosto. Corregge inoltre le tabelle Rosa da mobile in modalita Dark, compattando le righe e centrando verticalmente la prima colonna nelle rose pubbliche e nella pagina squadra. Documento: `docs/zonaorientale/audit/DARK_MODE_ROSE_MOBILE_V289.md`. Diagnostica: `window.ZonaOrientaleDarkModeOnlyV289`.

## Aggiornamento V288 - Fix rose mobile Light

V288 corregge un problema residuo nella pagina squadra/rose in modalita Light mobile: la prima colonna sticky poteva mostrare il nome giocatore nero su sfondo scuro. La patch CSS e' specifica per `team-profile-roster-table` e compatta leggermente le righe, aumentando la leggibilita' del nome e centrando verticalmente il contenuto. Non modifica Firebase, EmailJS, dati JSON o logiche runtime. Diagnostica: `window.ZonaOrientaleRosterMobileLightV288`. Documento: `docs/zonaorientale/audit/FIX_ROSE_MOBILE_LIGHT_V288.md`.

## Aggiornamento V287 - Rifinitura controlli mobile

V287 migliora usabilita' e leggibilita' dei controlli mobile: target touch, input/select/textarea, filtri, bottoni, pill, bottom navigation, menu mobile e aree tabellari scrollabili. Intervento solo CSS/UI, senza modifiche a dati, Firebase, EmailJS o logiche runtime. Diagnostica: `window.ZonaOrientaleMobileControlsV287`. Documento: `docs/zonaorientale/audit/RIFINITURA_CONTROLLI_MOBILE_V287.md`.

## Aggiornamento V286 - Fix prima colonna mobile Light

V286 corregge il problema segnalato in modalita Light/mobile in cui il nome giocatore poteva apparire nero su sfondo scuro nella prima colonna sticky del Listone e delle tabelle rose. La patch e' solo CSS, piu' specifica e finale rispetto alle regole V285, e forza testo chiaro su sfondo scuro per celle, link e bottoni della prima colonna. Non modifica dati, Firebase, EmailJS o logiche runtime. Diagnostica: `window.ZonaOrientaleStickyColumnContrastV286`. Documento: `docs/zonaorientale/audit/FIX_PRIMA_COLONNA_MOBILE_LIGHT_V286.md`.

## Aggiornamento V285 - Fix mirati mobile

V285 applica correzioni CSS mirate alla UI mobile, soprattutto in tema Light: testi secondari piu' leggibili, pannelli piu' solidi, tabelle con indicazione `Scorri`, prima colonna sticky rafforzata, bottoni secondari/pill/badge piu' contrastati e menu mobile piu' leggibile. Non modifica dati, Firebase, EmailJS o logiche runtime. Diagnostica: `window.ZonaOrientaleMobileFixesV285`. Documento: `docs/zonaorientale/audit/FIX_MOBILE_MIRATI_V285.md`.

## Aggiornamento V284 - Audit mobile completo

V284 aggiunge `docs/zonaorientale/audit/AUDIT_MOBILE_COMPLETO_V284.md`, checklist operativa per test mobile su Home, News, Listone, Competizioni, Archivio, Statistiche, Confronta, Dashboard Presidente e Admin. Aggiorna lo script pre-push per segnalare la presenza dell'audit. Nessuna modifica funzionale a Firebase, EmailJS o dati runtime. Diagnostica: `window.ZonaOrientaleMobileAuditV284`.

## Aggiornamento V283 - Pulizia file macOS/residui

V283 aggiunge lo script `static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh`, con dry-run di default e opzioni `--apply` / `--git-rm`, per individuare e rimuovere metadata macOS (`.DS_Store`, `._*`, `__MACOSX`, `.AppleDouble`, `.LSOverride`). Aggiorna anche `.gitignore` locale e lo script pre-push V282. Nessuna modifica funzionale a Firebase, EmailJS o dati runtime. Diagnostica: `window.ZonaOrientaleMacOsCleanupV283`. Documento operativo: `release/PULIZIA_MACOS_V283.md`.

## Aggiornamento V282 - Controlli pre-push

V282 aggiunge lo script `static/zonaorientale/tools/check-zonaorientale.sh` per centralizzare i controlli tecnici prima di commit/push: sintassi JS, validita JSON, footer/cache-buster/versione e file macOS indesiderati. Nessuna modifica funzionale a Firebase, EmailJS o dati runtime. Diagnostica: `window.ZonaOrientalePrePushChecksV282`. Documento operativo: `release/CONTROLLI_PRE_PUSH_V282.md`.

## Nota V275 - Registro funzionalita V271-V274

V275 aggiunge `docs/zonaorientale/FUNZIONALITA'V271-274.md`, registro funzionale aggiuntivo per le modifiche recenti: handoff/pre-merge V272, test reale listone V273 e codici squadra canonici V274. Nessuna modifica funzionale al runtime; diagnostica `window.ZonaOrientaleFunctionLedgerV275`.

## Nota V274 - Test end-to-end listone reale

V274 verifica il nuovo flusso listoni con il file Excel reale `lista_calciatori_lista calciatori_classic_zonaorientale-salerno.xlsx`. Esito: 663 giocatori convertibili, 532 in listone, 131 asteriscati, 299 con FantaSquadra, confronto con `2026-05-15` con 2 nuovi, 0 usciti, 96 aumenti e 120 diminuzioni di quotazione. V274 corregge anche i falsi cambi squadra nel confronto tra sigle storiche (`ATA`, `BOL`, ...) e nomi estesi del nuovo Excel (`Atalanta`, `Bologna`, ...). Diagnostica: `window.ZonaOrientaleListoneE2ETestV274`.

# Aggiornamento V272 - Handoff, audit funzionalita e preparazione merge master

V272 aggiorna lo stato corrente del branch `refactor/260528-zonaorientale-next`, aggiunge una documentazione organizzata in sottocartelle (`handoff`, `audit`, `pianificazione`, `release`) e registra i controlli statici sulle funzionalita a rischio regressione. Non modifica `FUNZIONALITA'.md`. Diagnostica runtime: `window.ZonaOrientalePreMergeAuditV272`.

# Aggiornamento V266 - Email deliverability EmailJS

V266 rende piu' pulite e coerenti le mail operative inviate via EmailJS: aggiunge parametri comuni di mittente logico (`Lega ZonaOrientale Salerno`), Reply-To dell'utente loggato quando disponibile, oggetti piu' sobri e firma standard del gestionale. I flussi aggiornati sono: comunicato avvenuto scambio e informativa svincolo giocatori. Non modifica `FUNZIONALITA'.md`. Diagnostica: `window.ZonaOrientaleEmailJsDeliverabilityV266`.

# Aggiornamento V265 - Pulizia asset sicuri

V265 e' una pulizia fisica controllata: rimuove dai comandi di release i duplicati/inutilizzati sicuri gia' identificati nell'audit, mantiene come canonico il simulatore trattative `assets/js/dev/trade-notification-simulator-v255.js` e aggiunge/rafforza `.gitignore` per impedire il ritorno di file macOS. Non modifica `FUNZIONALITA'.md` e non cambia comportamento runtime. Diagnostica: `window.ZonaOrientaleCleanupV265`.

# Aggiornamento V263 - Funzionalita V256-262

V263 aggiunge `FUNZIONALITA'V256-262.md`, registro incrementale delle funzionalita introdotte o consolidate tra V256 e V262. Non modifica `FUNZIONALITA'.md` e non cambia il comportamento runtime. Diagnostica: `window.ZonaOrientaleFeaturesDocV263`.

# Aggiornamento V262 - Audit pulizia codice

V262 aggiunge `AUDIT_CODICE_260528_V262.md` e una `.gitignore` locale in `static/zonaorientale/`. Non cambia funzionalita': fotografa file duplicati/non importati, file macOS e candidati a pulizia controllata. Diagnostica runtime: `window.ZonaOrientaleAuditV262`.

# AI Handoff ZonaOrientale - Current V264

## Nota V261 - Svincola Giocatori presidente

V261 aggiunge in `Dashboard Presidente` la sottosezione `Svincola Giocatori`. Il presidente seleziona uno o piu giocatori dalla propria rosa; il sistema costruisce una email indirizzata a `caparrotti86@yahoo.it` con testo standard, elenco giocatori e Qt.A tra parentesi. La quotazione viene cercata partendo dal listone piu recente della stagione corrente che contiene il giocatore. Il flusso non scrive su Firebase e usa EmailJS dal browser. Diagnostica: `window.ZonaOrientalePlayerReleaseV261`.

## Nota V257 - Firebase Rules notifiche trattative multi-dispositivo

V257 aggiunge `docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules` e `FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules`. Le rules consentono al presidente mittente di una trattativa conclusa di aggiornare solo i campi di lettura esito (`outcomeSeenByFromUid`, `outcomeSeenByUid`, `outcomeSeenAtByFromUid`, `outcomeSeenMarkerByFromUid`) su `transferNegotiations/{id}`. Obiettivo: se un esito viene letto da smartphone, il badge non deve riapparire da desktop. Il codice runtime V246 era gia predisposto; V257 fornisce la regola deployabile.


## Nota V256 - Documento funzionalita V240-255

V256 aggiunge `FUNZIONALITA'V240-255.md`, documento separato che riepiloga le funzionalita introdotte o consolidate tra V240 e V255. Non sostituisce e non modifica `FUNZIONALITA'.md`, che resta il registro funzionale principale da aggiornare solo su richiesta esplicita dell'utente.

## Nota V255 - Comandi standard test trattative

V255 aggiorna il simulatore notifiche trattative a `assets/js/dev/trade-notification-simulator-v255.js` e aggiunge `help()`, `getTestCommands()` e `runLocalSmokeTest()` sull'API `window.ZonaOrientaleTradeSimulatorV255`. Resta disponibile l'alias `window.ZonaOrientaleTradeSimulatorV254` per compatibilita' con i comandi gia' annotati. Le simulazioni locali non scrivono in Firebase; `createFirebaseSentProposal({ confirm: true })` scrive davvero in `transferNegotiations`.

## Nota V254 - Simulatore notifiche trattative

V254 aggiunge `assets/js/dev/trade-notification-simulator-v254.js` e l'API runtime `window.ZonaOrientaleTradeSimulatorV254`. Le funzioni locali non scrivono in Firebase e servono per simulare badge/card delle trattative da console browser; la scrittura reale e' disponibile solo con `createFirebaseSentProposal({ confirm: true })`.



## Nota V253 - Estrazione modulare Richieste presidenti

V253 e' il primo estratto modulare prudente da `assets/app.js`: il pannello `Admin -> Richieste presidenti` viene installato da `assets/js/admin/team-requests-panel-v253.js`. Il blocco inline V249 resta come fallback, ma il comportamento canonico usa attributi V253 e diagnostica `window.ZonaOrientaleTeamRequestsV253`. Funzionalita preservate: Aggiorna richieste, Approva, Rifiuta, Elimina da Firebase per comunicati approvati/rifiutati. `FUNZIONALITA'.md` non e' stato modificato.

## Nota V252 - Pulizia asset inutilizzati

V252 e' una release di cleanup controllato: aggiunge `.gitignore` locale in `static/zonaorientale/`, marca come rimovibili i metadati macOS (`.DS_Store`, `__MACOSX`, `._*`) e i CSS `mobile-hotfix-v166.css`/`mobile-hotfix-v167.css`, gia inglobati in `mobile-suite-v168.css` e non referenziati dagli HTML. Diagnostica runtime: `window.ZonaOrientaleCleanupV252`. Le eliminazioni fisiche vanno eseguite con i comandi `git rm` della consegna V252.
Ultimo aggiornamento documentale: 27/05/2026.

## Stato corrente in una frase

Il sito ZonaOrientale e' una webapp statica HTML/CSS/JS puro, attualmente funzionante in **V264**, con dati pubblici prioritariamente serviti da JSON statici, Firebase usato per live/fallback/admin, UI mobile uniformata, Archivio/Statistiche/Confronta ripristinati, hotfix V227 sui saldi FM in Archivio, primo ciclo refactor tecnico V220-V225 chiuso e preview WhatsApp dinamica dei comunicati via Netlify Function, hotfix routing V235 per aprire i comunicati dopo redirect, pulsante account presidente personalizzato in header V240 con sync live trattative presidente, notifiche persistenti e hotfix permission-denied sul comunicato scambio, V241 con flusso Accetta utenti stabile anti-duplicati, V243 con consolidamento canonico del comunicato avvenuto scambio, V244 con eliminazione da Firebase dei comunicati rifiutati, V245 con eliminazione anche dei comunicati approvati dal registro richieste e V246 con lettura esiti trattative sincronizzata su Firebase, V247 con checklist regressioni canonica e V248 con pulizia handler legacy del comunicato scambio e V249 con pannello Admin Richieste presidenti canonico e V250 con ripristino del Generatore comunicati automatici in Admin e V251 con ripristino del workflow pubblicazione Admin V213, V252 con pulizia asset inutilizzati, V253 con estrazione modulare di Admin -> Richieste presidenti e V254 con simulatore notifiche trattative e V255 con comandi standard/smoke test trattative e V256 con documento funzionalita V240-255 separato e V257 con Firebase Rules per notifiche trattative multi-dispositivo, V259/V260 con anteprima home generica e pulizia preview/tag tecnici, V261 con informativa svincolo giocatori in Dashboard Presidente.


## Nota V251 - Workflow pubblicazione Admin ripristinato

In V251 il workflow pubblicazione inline V190/V191/V203 viene reso canonico senza reimportare il modulo esterno V213, evitando doppi listener. Restano attivi i pannelli Admin `Stato Firebase / JSON` e `Procedura guidata Pubblica aggiornamenti`. Il workflow non scrive su Firebase: legge preflight asset pubblici, promemoria locali e modalita admin, genera checklist e comandi Git copiabili. Diagnostica disponibile: `window.ZonaOrientalePublicationWorkflowV251`, oltre a `window.ZonaOrientalePublicationStatus` e `window.ZonaOrientalePublishWizard`.

## Nota V250 - Generatore comunicati automatici ripristinato

Il modulo `assets/js/refactor/admin-communication-generator-v210.js` era importato ma non installato. In V250 viene collegato esplicitamente all'area Admin tramite `installCommunicationGeneratorRefactorV210`. Il generatore prepara solo bozze locali: puo' copiare il testo o inserirlo nel form `Admin -> Comunicati`, ma non scrive direttamente su Firebase e non pubblica automaticamente news. Diagnostica disponibile: `window.ZonaOrientaleCommunicationGeneratorV250`.

## Nota V249 - Richieste presidenti canoniche

La sezione `Admin -> Richieste presidenti` e' stata consolidata in V249: il pannello usa un solo render canonico, un refresh dedicato da Firebase, handler dedicati per Approva/Rifiuta ed eliminazione da Firebase dei soli comunicati approvati/rifiutati. I vecchi attributi V244/V245 non vengono piu' usati dal render canonico.

## Posizione e struttura progetto

Nel repository reale il sito sta sotto:

```text
static/zonaorientale/
```

La documentazione sta sotto:

```text
docs/zonaorientale/
```

Quando si consegna uno zip all'utente, usare invece le due radici:

```text
zonaorientale/
docs/
```

Lo zip deve contenere **solo i file effettivamente modificati**.

## Regole utente da rispettare sempre

- Fornire un solo zip quando si consegnano modifiche.
- Dentro lo zip usare le cartelle `zonaorientale/` e `docs/`.
- Inserire solo i file modificati.
- Dare sempre i comandi Git, con messaggio di commit coerente.
- Dare sempre i comandi locali quando si tocca il sito.
- Ogni modifica UI/codice del sito deve aggiornare footer `Version` e cache-buster.
- Ogni overlay funzionale deve aggiornare l'handoff corrente e il changelog consolidato.
- Verificare sempre mobile quando si toccano tabelle, menu, pulsanti fissi o pagine lunghe.

Comandi locali richiesti dall'utente:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Poi aprire:

```text
http://localhost:1313/zonaorientale/
```











## V248 - Pulizia handler legacy comunicato scambio

V248 aggiunge un guard runtime per rimuovere eventuali vecchi form/handler V50/V79/V237 del comunicato avvenuto scambio e mantenere un solo flusso canonico V242/V243: presidente -> `teamRequests/TRANSFER_NEWS` -> EmailJS -> approvazione Admin -> News. La diagnostica e' disponibile in `window.ZonaOrientaleLegacyCleanupV248`. `FUNZIONALITA'.md` non e' stato modificato.

## V247 - Checklist regressioni

V247 aggiunge `docs/zonaorientale/REGRESSION_TESTS.md`, checklist operativa per testare pubblico, presidente, admin, mobile, Firebase e controlli tecnici prima di merge/deploy. La release non introduce modifiche funzionali runtime oltre a footer/cache-buster/diagnostica. `FUNZIONALITA'.md` non e' stato modificato, come da regola di aggiornamento solo esplicito.

## V246 - Notifiche trattative sincronizzate su Firebase

V246 rende piu' robusto il badge delle trattative: quando il presidente mittente apre la card di una proposta conclusa, il sito marca l'esito come letto anche nel documento `transferNegotiations/{id}` (`outcomeSeenByFromUid`, `outcomeSeenAtByFromUid`, `outcomeSeenMarkerByFromUid`). `localStorage` resta come fallback se le regole Firebase negano l'update, ma il comportamento atteso e' la sincronizzazione tra desktop e mobile. Quando il destinatario approva o rifiuta, il flag di lettura del mittente viene resettato. `FUNZIONALITA'.md` non e' stato modificato in questa release, come da regola di aggiornamento solo esplicito.

## V245 - Elimina comunicati approvati da Firebase

V245 estende Admin -> Richieste presidenti: il pulsante `Elimina da Firebase` compare anche sui comunicati approvati (`TEAM_NEWS` e `TRANSFER_NEWS`, inclusi topic `COMUNICATO_SQUADRA` e `COMUNICATO_AVVENUTO_SCAMBIO`), non solo sui rifiutati. La cancellazione rimuove il documento `teamRequests/{id}`; se il comunicato approvato e' gia' stato pubblicato nelle News, la news pubblicata non viene cancellata. `FUNZIONALITA'.md` non e' stato modificato in questa release, come da regola di aggiornamento solo esplicito.

## V244 - Elimina comunicati rifiutati da Firebase

V244 aggiunge in Admin -> Richieste presidenti il pulsante `Elimina da Firebase` per i soli comunicati rifiutati (`TEAM_NEWS` e `TRANSFER_NEWS`, inclusi topic `COMUNICATO_SQUADRA` e `COMUNICATO_AVVENUTO_SCAMBIO`). Il pulsante compare dopo il rifiuto, chiede conferma e cancella il documento `teamRequests/{id}`. `FUNZIONALITA'.md` non e' stato modificato in questa release, come da regola di aggiornamento solo esplicito.

## V243 - Comunicato scambio canonico

V243 consolida il flusso Presidente -> Comunicato avvenuto scambio: viene mantenuto un solo form canonico (`teamTransferCommunicationFormV243`) che salva `teamRequests` con `type: TRANSFER_NEWS`, `topic: COMUNICATO_AVVENUTO_SCAMBIO`, invia subito EmailJS a `caparrotti86@yahoo.it` e lascia la pubblicazione in News all'approvazione Admin. Gli agganci legacy V50/V79 vengono neutralizzati per evitare doppio submit o tentativi di scrittura diretta in `news` da account presidente. `FUNZIONALITA'.md` non e' stato modificato in questa release, come da regola di aggiornamento solo esplicito.

## V241 - Accetta utenti stabile

V241 corregge la ricomparsa periodica in Admin -> Accetta utenti di account gia' approvati o gia' rifiutati. Il rifiuto non cancella piu' `pendingUsers/{uid}`: imposta `status: REJECTED`, con metadati `rejectedAt/rejectedBy`, cosi' lo stesso login non puo' rigenerare una nuova richiesta. Inoltre `upsertPendingUserV34` non riscrive piu' come `PENDING` un utente gia' presente in `teamUsers`, e il pannello admin nasconde eventuali vecchi duplicati pending di utenti gia' approvati. `FUNZIONALITA'.md` non e' stato modificato in questa release, come da regola di aggiornamento solo esplicito.

## V240 - Sync live trattative presidente

V240 corregge il disallineamento tra badge notifiche e sottosezione `Trattative`: il loader lazy ora rispetta `force: true`, rilegge da Firebase quando si entra nella Dashboard Presidente o si apre il riquadro Trattative da mobile, e ridisegna le liste Inviate/Ricevute con la stessa sorgente live usata dai badge. `FUNZIONALITA'.md` non e' stato modificato in questa release, come da regola di aggiornamento solo esplicito.

## V239 - Notifiche trattative presidente e hotfix permission-denied

V239 corregge il permission-denied visto dal presidente sul submit del comunicato avvenuto scambio: dopo il salvataggio in `teamRequests`, il flusso non forza piu' il caricamento completo admin e quindi non tenta la lettura non consentita di `teamUsers`.

Inoltre aggiunge le notifiche trattative presidente: badge rosso con punto esclamativo bianco su `Dashboard Presidente` e sul pulsante header `Pres. Cognome` quando ci sono proposte ricevute in attesa o esiti di proposte inviate da leggere. Il riepilogo resta nella sottosezione `Trattative`, sotto Inviate/Ricevute, con proposta compatta ed esito.

## V237 - Hotfix comunicato scambio presidente e permessi Firebase

V237 corregge il flusso introdotto in V236: con le regole Firestore correnti i presidenti approvati possono creare documenti in `teamRequests`, mentre `news` resta scrivibile solo dagli admin. Il form "Comunicato avvenuto scambio" registra una richiesta `TRANSFER_NEWS`, invia subito la mail EmailJS a `caparrotti86@yahoo.it` e rende la richiesta approvabile dall'Admin, che pubblica poi in News con topic `COMUNICATO_AVVENUTO_SCAMBIO`.

## V236 - Ripristino comunicato avvenuto scambio presidente

V236 ripristina nella Dashboard Presidente il secondo tipo di comunicato che era ancora presente in parte nel codice legacy V50/V79, ma non veniva piu' montato dopo il refactor V119 dell'area squadra.

Funzionamento attuale:

- `Comunicato squadra`: resta il flusso ordinario con richiesta admin `TEAM_NEWS` e approvazione.
- `Comunicato avvenuto scambio`: nuovo pannello reinserito sotto il comunicato squadra; pubblica subito in Firebase `news` e invia EmailJS a `caparrotti86@yahoo.it`.
- Topic News usato: `COMUNICATO_AVVENUTO_SCAMBIO`.
- Oggetto email: `Comunicato avvenuto scambio NOME_SQUADRA`.
- Corpo email: titolo, testo, giocatori/contropartite coinvolti e squadra coinvolta, quando compilati.
- Mobile: l'hub Dashboard Presidente riceve anche l'azione rapida `Scambio` che scrolla al form.

File toccati: `assets/app.js`, `assets/js/domain/labels.js`, footer/cache-buster HTML e documentazione canonica.

## V235 - Hotfix routing comunicati condivisi

V235 corregge il comportamento post-preview della V231: la Netlify Function reindirizza a `/zonaorientale/#news-<id>`, ma il router legacy interpretava hash non statici come slug squadra. Il risultato era una pagina vuota con solo header/footer. Ora gli hash `news-<id>` attivano esplicitamente la pagina News, renderizzano i comunicati e aprono/scorrono il comunicato target.

## V231 - Comunicati WhatsApp dinamici Netlify

V231 supera il flusso statico V228/V230. I comunicati condivisibili non devono piu' essere generati come file HTML in `comunicati/` dopo ogni pubblicazione.

Endpoint attivo:

```text
/zonaorientale/share/news/<id-comunicato>
```

`netlify.toml` lo riscrive verso:

```text
/.netlify/functions/news-share?id=<id-comunicato>
```

La funzione `netlify/functions/news-share.js` legge `news/<id>` da Firestore, genera HTML con meta Open Graph e reindirizza il browser a `/zonaorientale/#news-<id>`. Il pulsante `Copia link WhatsApp` ora usa questo endpoint dinamico e il comunicato e' condivisibile subito dopo il salvataggio.

Il vecchio generatore `tools/generate-news-share-pages.mjs` e la cartella `comunicati/` restano legacy: non usarli per il flusso ordinario.

## Legacy V230 - Link WhatsApp/preview comunicati statici

V230 corregge i 404 dei link WhatsApp/preview comunicati introdotti dalla V228. La causa era l'uso hardcoded del dominio `https://www.silviobarra.com/zonaorientale/`, mentre il sito pubblico corretto usa `https://silviobarra.com/zonaorientale/` senza `www`.

Regole V230 legacy:

- `NEWS_SHARE_DEFAULT_BASE_URL_V228` ora punta a `https://silviobarra.com/zonaorientale/`;
- i link copiati dal browser non usano piu' un host fisso: `getNewsShareBaseUrlV230()` calcola la base dal path corrente;
- le pagine statiche `comunicati/*.html` hanno canonical/OG non-`www`;
- le pagine statiche reindirizzano con path relativo (`../#news-id` o `./#news-id`) per evitare 404 se cambia host;
- da V231 non bisogna piu' rigenerare e committare `news.html`, `index.html` e `comunicati/*.html` per ogni comunicato.

## Fix V229 - Account presidente in header

Quando un presidente approvato effettua login, il pulsante `#openLoginBtn` non deve mostrare il testo generico `Account`. La V229 lo trasforma in un pulsante compatto con logo squadra e label `Pres. Cognome`, usando il presidente approvato collegato a `teamUsers/{uid}` e, quando possibile, l'anagrafica in `presidents`.

Comportamento atteso:

```text
utente anonimo/non approvato -> Accedi / Registrati o Account legacy
presidente approvato -> logo squadra + Pres. Cognome
click presidente -> Dashboard Presidente (#teamarea)
admin -> comportamento Admin invariato
```

Implementazione in `assets/app.js`:

```text
getPresidentNameForAccountButtonV229
getPresidentSurnameForAccountButtonV229
renderPresidentAccountButtonContentV229
updatePresidentAccountButtonV229
openPresidentDashboardFromHeaderV229
```

CSS in `assets/styles.css`, blocco `V229 - Header account presidente`.

## Legacy V228 - Comunicati condivisibili WhatsApp statici

V228 introduce pagine statiche dedicate ai comunicati per risolvere le anteprime WhatsApp. WhatsApp non esegue il JavaScript della webapp: legge solo i meta tag Open Graph presenti nell'HTML scaricato.

File/parti rilevanti:

```text
assets/js/domain/news-share-v228.js
tools/generate-news-share-pages.mjs
comunicati/*.html
news.html
```

Flusso corretto dopo un nuovo comunicato:

```bash
cd static/zonaorientale
node tools/generate-news-share-pages.mjs
cd ../..

git add static/zonaorientale/news.html static/zonaorientale/comunicati static/zonaorientale/index.html
git commit -m "data: aggiorna anteprime comunicati whatsapp"
git push
```

Il pannello Admin mostra per ogni comunicato il pulsante `Copia link WhatsApp`, che punta a `https://silviobarra.com/zonaorientale/comunicati/<slug>.html?v=<id>`. Le pagine `comunicati/*.html` contengono `og:title`, `og:description`, `og:image`, `og:url` e poi reindirizzano alla news nella webapp.

Nota V231: questa limitazione valeva solo per il flusso statico. Con Netlify Function, il comunicato salvato su Firebase e' subito condivisibile se la funzione riesce a leggere Firestore.

## Fix V227 - FM Archivio

Il bug rilevato in Archivio era causato dal rendering delle card squadra: veniva letto solo `seasonTeam.fmBalance`, ma gli snapshot pubblici non salvano quel campo dentro `seasonTeams`.

La V227 introduce una risoluzione robusta del saldo FM Archivio:

1. campo diretto su `seasonTeams`, se presente (`fmBalance`, `balance`, `remainingCredits`, ecc.);
2. snapshot statici `assets/rose/*.json`, abbinati per stagione e nome squadra, usando `remainingCredits`;
3. somma dei `fmMovements` della stagione come fallback.

Se nessuna sorgente contiene il dato, l'Archivio mostra `-` invece di un falso `0 FM`.

## Versione corrente codice

Versione sito: **V248 pulizia handler legacy**.

Footer corrente atteso:

```text
ZonaOrientale Salerno · V248 pulizia handler legacy · Ultimo aggiornamento 26/05/2026
```

Cache-buster HTML principali attesi: `?v=248`.

Nota tecnica: in `assets/app.js` la costante diagnostica `DEPLOY_EXPECTED_VERSION_V181` e allineata a `265`. Dopo ogni overlay codice/UI va aggiornata insieme a footer e cache-buster.

## File principali del sito

```text
zonaorientale/index.html
zonaorientale/competition.html
zonaorientale/player.html
zonaorientale/news.html
zonaorientale/assets/app.js
zonaorientale/assets/styles.css
zonaorientale/assets/css/*.css
zonaorientale/assets/js/**/*.js
zonaorientale/assets/snapshots/**/*.json
zonaorientale/assets/rose/*.json
zonaorientale/assets/listoni/*.json
zonaorientale/assets/competitions/**/*.json
```

`assets/app.js` e' ancora il bundle principale e contiene molta logica storica Vxxx. Non rimuovere helper storici solo perche sembrano duplicati: diversi override successivi li richiamano direttamente.

## Moduli refactor attivi

Questi moduli sono presenti e rilevanti:

```text
assets/js/refactor/live-data-archive-v209.js
assets/js/refactor/admin-communication-generator-v210.js
assets/js/refactor/historical-stats-compare-v211.js
assets/js/refactor/president-dashboard-rosters-v212.js
assets/js/refactor/admin-publication-workflow-v213.js
assets/js/refactor/public-admin-render-orchestrator-v221.js
assets/js/data/repository-v222.js
assets/js/refactor/refactor-stability-v225.js
```

Stato effettivo:

- **V209 live-data/archive**: attivo. Gestisce comunicati live, mercato/trattative live/lazy e Archivio stagioni.
- **V210 generatore comunicati admin**: attivo. Compila bozze comunicati da dati gia presenti; non deve scrivere automaticamente su Firebase.
- **V211 statistiche/confronta**: presente e, dopo V218/V219, installato realmente nel bootstrap. In V224 esclude `NON_DISPUTATA` dai titoli e pre-carica snapshot statici per calcolare i presidenti vincenti su tutte le stagioni. In V226 legge sempre lo snapshot honor statico normalizzato quando disponibile, cosi Club piu vincenti, Podi Campionato e Ultimi titoli assegnati mostrano i nomi storici invece di `-`; inoltre Top FIFA Ranking non stampa piu la nota ripetitiva `FIFA Ranking` su ogni riga. Gestisce `#stats` e `#compare`.
- **V212 dashboard presidente/rose**: attivo. Gestisce dashboard presidente, helper rose e hub mobile presidente.
- **V213 admin-publication-workflow**: file presente ma **non reinserire nel bootstrap senza test browser**. Era stato disattivato in V214 perche poteva bloccare la visualizzazione dei dati. Se ripreso, installarlo lazy/con try-catch e verificare tutto il bootstrap.
- **V225 refactor-stability**: attivo. Espone `window.ZonaOrientaleRefactorStatus` con controlli runtime leggeri sui moduli V220-V224; non cambia UI/dati e non blocca il bootstrap.

## Stato funzionale recente

### V227 - Hotfix FM Archivio

V227 corregge Archivio -> Squadre della stagione: i saldi FM non vengono piu' mostrati tutti a `0 FM` quando lo snapshot stagione non contiene `seasonTeams.fmBalance`.

La risoluzione ora usa, in ordine:

1. campi diretti su `seasonTeams`;
2. `assets/rose/*.json` / `remainingCredits`, abbinati per stagione e nome squadra;
3. somma di `fmMovements` come fallback.

Se nessuna sorgente contiene il dato, viene mostrato `-` invece di un falso `0 FM`.

### V226 - Hotfix statistiche storiche

V226 corregge regressioni visive nella pagina `#stats` dopo V224/V225:

- `Club più vincenti` non deve mostrare solo `-`;
- `Podi Campionato` non deve mostrare solo `-`;
- `Ultimi titoli assegnati` deve mostrare i vincitori storici, non solo quelli dell'ultima stagione;
- `Top FIFA Ranking` non deve ripetere `FIFA Ranking` accanto a ogni squadra.

Causa tecnica: in alcuni flussi `state.publicHonorSnapshot` poteva arrivare da Firebase/raw senza `honorRows` normalizzati, facendo ricadere le statistiche su `raw.honorRoll` con soli ID `seasonTeamId`; per le stagioni storiche non ancora caricate il nome non era risolvibile e veniva visualizzato `-`. Il modulo ora preferisce sempre lo snapshot honor statico normalizzato (`assets/snapshots/honor.json`, anche in forma wrapper `{ snapshot: ... }`) quando disponibile.


### V225 - Stabilizzazione finale post-refactor

V225 chiude il primo ciclo di refactor tecnico V220-V224 senza cambiare comportamento visibile.

File toccati lato codice:

```text
assets/app.js
assets/js/refactor/refactor-stability-v225.js
index.html
competition.html
player.html
```

Cosa fa:

- aggiorna footer/cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a 225;
- aggiunge un controllo runtime non bloccante per verificare la presenza dei moduli V220-V224;
- espone il report in `window.ZonaOrientaleRefactorStatus`;
- non modifica dati, Firebase, UI o logiche Admin.

Test specifico consigliato:

```text
Console browser:
window.ZonaOrientaleRefactorStatus.ok deve essere true.
Home, Archivio, Statistiche e Confronta devono continuare a caricarsi.
Admin > Risultati competizioni deve continuare a mostrare classifica campionato completa.
Mobile: bottom menu solo smartphone e pulsante Su solo dopo scroll.
```


### V224 - Hardening statistiche storiche

V224 corregge due problemi reali della pagina `#stats`:

- `Non disputata` non deve essere trattata come club vincitore. Le celle Albo con `kind: "status"`, `status: "NON_DISPUTATA"` o label equivalente vengono ignorate nei conteggi titoli/podi.
- `Presidenti piu vincenti` non deve limitarsi all'ultima stagione. Il modulo ora pre-carica gli snapshot stagione statici mancanti, recuperando `seasonTeams` e `presidents` storici per calcolare i titoli dei presidenti su tutto l'archivio.

File toccati lato codice:

```text
assets/app.js
assets/js/refactor/historical-stats-compare-v211.js
index.html
competition.html
player.html
```

Test specifico consigliato:

```text
Home -> Statistiche
- Club piu vincenti: Non disputata non deve comparire.
- Presidenti piu vincenti: devono comparire presidenti di tutte le stagioni storiche, non solo quelli dell'ultima stagione.
Home -> Confronta
- La pagina deve continuare a caricarsi.
Archivio
- Le stagioni devono continuare a vedersi.
```

### V216/V217 - Classifica campionato completa

Le competizioni di tipo campionato/classifica devono inserire e visualizzare le colonne in questo ordine:

```text
POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT
```

Campi canonici salvati/attesi nei risultati:

```text
position
teamId/teamName
points
played
wins
draws
losses
goalsFor
goalsAgainst
goalDifference
fantapoints
```

Compatibilita: molte funzioni leggono anche alias legacy, quindi non rompere questa tolleranza.

V217 ha aggiunto cache-buster agli import critici, in particolare `admin-competitions.js?v=219` nella versione corrente, per evitare cache vecchia del modulo Admin.



### V222 - Data repository facade

V222 e' il terzo overlay tecnico del percorso di refactor. Non cambia UI, dati, Firebase o flussi Admin.

Cosa e' stato fatto:

```text
assets/js/data/repository-v222.js
assets/js/refactor/refactor-stability-v225.js
```

Il nuovo modulo introduce una facciata unica per:

```text
loadCollections(COLLECTIONS)
loadLeagueConfigFromFirebase()
loadStaticAssets() -> listoni, rose, calendari competizioni statici
loadPublicConfig() -> config statica con fallback Firebase
```

`app.js` continua a mantenere la logica di merge, snapshot e render, ma i punti di accesso ai dati sono ora instradati da `window.ZonaOrientaleDataRepository`. Questo prepara il per futuri refactor senza cambiare comportamento visibile.

Test minimi dopo V222:

```text
Home pubblica e selettore stagione
Admin login e refresh dati
Admin > Risultati competizioni
Competizione campionato con classifica completa
Archivio, Statistiche, Confronta
Listone e Rose
Mobile bottom menu e pulsante Su
competition.html e player.html
```


### V221 - Separazione rendering public/admin

V221 e' il secondo overlay tecnico del percorso di refactor. Non cambia UI, dati, Firebase o flussi Admin.

Cosa e' stato fatto:

```text
assets/js/refactor/public-admin-render-orchestrator-v221.js
assets/js/data/repository-v222.js
assets/js/refactor/refactor-stability-v225.js
```

Il nuovo modulo centralizza il ciclo di rendering principale in tre gruppi:

```text
publicRenderers  -> header, selettori, dashboard, competizioni, placeholder, squadre, stadi
adminRenderers   -> area Admin
afterRenderers   -> sezioni collassabili e post-render
```

In `app.js`, il `renderAll()` base non chiama piu direttamente ogni renderer uno per uno, ma delega all'orchestratore V221. Gli override storici successivi restano compatibili perche continuano ad agganciarsi a `renderAll` come prima.

Test minimi dopo V221:

```text
Home pubblica
Admin visibile solo per admin
Dashboard e competizioni
Archivio, Statistiche, Confronta
Classifica campionato completa
Mobile bottom menu e pulsante Su
competition.html e player.html
```

### V220 - Safety refactor mobile chrome

V220 e' un overlay tecnico a basso rischio: non cambia dati, flussi Admin o UI visibile.

Cosa e' stato fatto:

```text
assets/js/mobile/mobile-chrome-v220.js
```

Il nuovo modulo centralizza:

- rilevamento smartphone `<= 900px` con rispetto di `zonaOrientaleDisplayMode=desktop`;
- setup/visibilita del pulsante globale `Su`;
- classe `body.is-mobile-ux`;
- chiusura bottom menu/sheet quando si torna desktop.

`app.js`, `competition.html` e `player.html` usano ora lo stesso helper. Sono state rimosse duplicazioni inline dalle pagine standalone, mantenendo ID/classe legacy del pulsante (`globalScrollTopBtnV218`, `zo-scroll-top-v218`) per non cambiare CSS o markup gia stabile.

Test minimi dopo V220:

```text
Home desktop/mobile
competition.html desktop/mobile
player.html desktop/mobile
bottom menu desktop nascosto
pulsante Su visibile solo smartphone dopo scroll
Archivio, Statistiche, Confronta
Admin > Risultati competizioni
```

### V218/V219 - UI mobile e pagine storiche

Il pulsante globale "Su" e' mobile-only:

- appare solo su smartphone;
- appare dopo scroll verso il basso;
- scompare in cima;
- usa markup `#globalScrollTopBtnV218` e classe `.zo-scroll-top-v218`.

Il bottom menu deve apparire solo da smartphone. Non deve comparire su desktop, nemmeno su laptop touch.

`competition.html` non deve partire con `body.is-mobile-ux` gia settata: la classe mobile viene decisa a runtime.

`stats`, `archive` e `compare` sono hash statici e non devono essere interpretati come slug squadra.

V219 ha ripristinato gli helper mancanti necessari all'Archivio:

```text
HISTORICAL_COMPETITIONS_V193
getSeasonSortValueV193
getSeasonLabelV193
```

Senza questi, l'Archivio fallisce con:

```text
ReferenceError: getSeasonSortValueV193 is not defined
```

## Architettura dati in breve

Ordine pubblico preferito:

1. JSON statici in `assets/public`, `assets/snapshots`, `assets/rose`, `assets/listoni`, `assets/competitions`.
2. Snapshot Firebase pubblici come fallback.
3. Collection Firebase granulari solo Admin o live/lazy quando serve.

Dati live:

- comunicati/news: Firebase in background;
- trasferibili/trattative: Firebase lazy/live quando un presidente apre mercato/dashboard;
- admin completo: solo dopo `Admin -> Carica dati amministrazione`.

Regola importante: se un dato esiste anche nei JSON statici, modificarlo solo in Firebase non basta. Dopo refresh/logout il sito puo tornare a leggere il JSON statico vecchio.

## Flusso Admin dati da ricordare

Dopo modifiche dati pubblici da Admin:

1. salvare la modifica in Admin;
2. `Admin -> Snapshot pubblici -> Aggiorna tutto`;
3. scaricare gli overlay/static JSON necessari;
4. applicarli nella repo;
5. commit + push.

Esempi:

- classifiche/risultati/squadre/competizioni: aggiornare snapshot stagioni;
- Albo/Palmares/FIFA: aggiornare `assets/snapshots/honor.json`;
- rose Excel: aggiornare `assets/rose/*`, poi reinizializzare e rigenerare snapshot;
- listone Excel: aggiornare `assets/listoni/*`;
- config/stagioni: aggiornare `assets/public/config.json`.

## Test minimi dopo codice

Da root `static/zonaorientale` o equivalente:

```bash
find assets -name '*.js' -type f -print0 | xargs -0 -n1 node --check
find assets -name '*.json' -type f -print0 | xargs -0 -n1 jq empty
```

Se `jq` non e' disponibile:

```bash
find assets -name '*.json' -type f -print0 | xargs -0 -n1 python3 -m json.tool >/dev/null
```

Test manuali consigliati:

- home/dashboard pubblica;
- Albo d'Oro;
- Competizioni e pagina singola competizione;
- classifica campionato completa da desktop e mobile;
- `#archive` con cambio stagione;
- `#stats`;
- `#compare`;
- login presidente: dashboard, rose, mercato lazy/live;
- login admin: risultati competizioni, snapshot pubblici, checklist online;
- mobile: bottom menu solo smartphone, pulsante Su solo dopo scroll.

## Rischi noti

- Cache browser/GitHub Pages: quando si modifica un modulo importato da `app.js`, aggiungere cache-buster anche nello static import.
- Funzioni Vxxx storiche: possono sembrare morte ma essere usate da override successivi. Prima di rimuovere usare `grep` e test browser.
- `admin-publication-workflow-v213.js`: non riattivare senza test completi.
- Archivio: dipende dalla catena V193/V196/V204/V209/V218/V219.
- Mobile: non usare solo `pointer: coarse`; usare anche width/viewport per evitare UI mobile su desktop touch.
- Gli errori DevTools del tipo `A listener indicated an asynchronous response...` spesso vengono da estensioni browser, non dal sito.

## Come consegnare la prossima modifica

1. Applicare la modifica.
2. Aggiornare footer/cache-buster se e' codice/UI sito.
3. Aggiornare questi docs se cambia architettura/stato.
4. Creare zip unico con sole modifiche:

```text
zonaorientale/...
docs/...
```

5. Dare comandi Git:

```bash
git status
git add ...
git commit -m "messaggio coerente"
```

## Stato refactor V223

La V223 e' un overlay tecnico senza cambi funzionali visibili. Ha centralizzato il chrome mobile globale nel nuovo file:

```text
assets/css/mobile-chrome-v223.css
```

Il file assorbe i blocchi duplicati V218 relativi a pulsante `Su`, vecchi pulsanti `listone/competition` e guard desktop del bottom menu. I blocchi corrispondenti sono stati rimossi da `assets/styles.css` e `assets/css/mobile-suite-v168.css` per iniziare la pulizia CSS senza alterare il layout.

Versione runtime attesa: **238**. Dopo modifiche successive aggiornare sempre footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181`.


## Update V235
- Hotfix pre-checkpoint: filtri stato Listone corretti, dashboard presidente mobile a due colonne per le metriche, tema light rafforzato su Archivio/Statistiche/Confronta.
- Il flusso comunicati dinamici Netlify rimane quello della V231/V232 e risulta funzionante sul master.


## Update V235 - Hotfix filtri Listone

Corretto il comportamento dei filtri stato nella sezione pubblica `#listone`. La semantica richiesta e' ora:

- `In listone`: filtra solo giocatori con stato `In listone` / `IN_LISTONE`;
- `Asteriscato`: filtra solo giocatori con stato `Asteriscato` / `ASTERISCATO`;
- `Svincolati`: filtra solo giocatori non associati ad alcuna rosa (`fantasyRoster` vuoto o `Svincolati`).

Le categorie non sono rese mutuamente esclusive a livello dati: un giocatore puo' avere stato `In listone` ed essere anche svincolato perche' non presente in alcuna rosa. I filtri funzionano quindi come unione delle categorie selezionate. Se nessun filtro stato e' selezionato, la tabella resta vuota.

## V235 - Stato corrente
Hotfix Listone: le checkbox sono ora coerenti con le colonne visibili. `In listone`/`Asteriscato` operano sulla colonna Stato, `Svincolati` opera sulla colonna Rosa.

## Update V236 - Comunicati scambio presidente

- Ripristinato il form presidente `Comunicato avvenuto scambio` perso dal render V119.
- Il form V236 tentava pubblicazione diretta in `news` e invio EmailJS a `caparrotti86@yahoo.it`; V239 corregge il problema permessi spostando la pubblicazione in approvazione Admin.
- Aggiunto topic `COMUNICATO_AVVENUTO_SCAMBIO` nelle label.
- Aggiornati footer/cache-buster, diagnostica versione e documentazione a V236.

## V267 - Audit competizioni

- Versione runtime: `V267 audit competizioni`.
- Aggiunto `docs/zonaorientale/AUDIT_COMPETIZIONI_V267.md`.
- Aggiornata la guida `ISTRUZIONI_NUOVO_ASSISTENTE_260528.md`.
- Nessuna funzionalita rimossa e nessun file competizioni eliminato.
- Diagnostica: `window.ZonaOrientaleCompetitionsAuditV267`.
- Il modulo `assets/js/domain/competitions.js` resta sotto osservazione: sembra legacy/scollegato, ma non va rimosso senza test di Dashboard, Competizioni, `competition.html`, Archivio e Admin Competizioni.


## V268 - Convertitore listone flessibile

- Versione runtime: `V268 convertitore listone flessibile`.
- `Admin -> Converti listone Excel` mantiene il formato storico con fogli `Tutti`/`Ceduti`.
- Aggiunto supporto al formato Classic a foglio singolo, per esempio `Lista calciatori` con colonne `Nome`, `Fuori lista`, `Sq.`, `R.`, `R.MANTRA`, `QUOT.`, `FVM/1000`.
- Il report Admin mostra formato riconosciuto e fogli usati.
- Diagnostica: `window.ZonaOrientaleListoneConverterV268`.
- Dettagli: `docs/zonaorientale/LISTONE_CONVERTER_V268.md`.


## V269 - Storico e confronto listoni

- Aggiunto confronto automatico tra listone selezionato e listone precedente della stessa stagione.
- Il convertitore listone arricchisce il JSON generato con campi `previous`, `diff`, `previousQuotationCurrent`, `quotationDiffFromPrevious`, `statusChange` e riepilogo `history`.
- La sezione pubblica `Listone` mostra un pannello `Storico listoni` con nuovi, usciti, variazioni quotazione e ricerca negli altri listoni.
- Il campo ricerca puo' trovare giocatori presenti in listoni passati anche quando non sono nel listone selezionato.
- Diagnostica: `window.ZonaOrientaleListoneHistoryV269`.
- Non sono state rimosse funzionalita' esistenti; il formato storico Tutti/Ceduti e il formato Classic a foglio singolo restano supportati.

## V271 - funzionalita V263-270

Versione corrente documentata: V271 funzionalita V263-270.

Nuovo documento rilevante:

- `docs/zonaorientale/FUNZIONALITA'V263-270.md`

Il documento principale `FUNZIONALITA'.md` non e' stato modificato.


## V274 - Codici squadra canonici nel Listone

Il convertitore listone accetta sia sigle sia nomi estesi per la squadra reale, ma salva/visualizza la sigla canonica a 3 lettere. Questo evita falsi cambi squadra nei confronti storici e rende stabile la colonna `Modifica`.

## Aggiornamento V276-V277

- V276 introduce `Admin -> Diagnostica dati` come pannello non distruttivo di controllo pre-deploy.
- V277 introduce il filtro `Modifiche` nella sezione Listone.
- Non sono state rimosse funzionalita'.
- Restano da preservare: ricerca storica listoni, colonna Modifica, usciti storici, normalizzazione squadre V274.

## V278 - Export modifiche listone

Aggiunto export CSV non distruttivo delle modifiche del Listone. Il pulsante `Esporta modifiche CSV` rispetta il filtro `Modifiche` e include nuove righe, usciti storici, variazioni quotazione/stato/squadra/ruolo. Documento tecnico: `docs/zonaorientale/listoni/LISTONE_EXPORT_MODIFICHE_V278.md`.


## V280 - UI Listone semplificata

V280 rimuove/nasconde dalla UI pubblica il pannello `Storico listoni`, mantenendo intatte le logiche V269-V278 che alimentano colonna `Modifica`, filtro `Modifiche`, usciti storici ed export CSV. Diagnostica: `window.ZonaOrientaleListoneUiV280`. Documento tecnico: `docs/zonaorientale/listoni/LISTONE_UI_SEMPLIFICATA_V280.md`.

V280 aggiunge anche un primo audit statico sulla leggibilita mobile in modalita Light: `docs/zonaorientale/audit/AUDIT_MOBILE_LIGHT_CONTRAST_V280.md`. L'audit segnala come prossima uscita consigliata una patch dedicata al contrasto mobile Light.


## V281 - Contrasto mobile Light

V281 migliora la leggibilita in modalita Light da smartphone: testi secondari piu' scuri, card/pannelli con sfondo piu' solido, tabelle mobile con corpo piu' leggibile e badge/stati con colori ad alto contrasto. Non cambia dati, Firebase, EmailJS o logiche Listone. Diagnostica: `window.ZonaOrientaleMobileLightContrastV281`. Documento tecnico: `docs/zonaorientale/audit/AUDIT_MOBILE_LIGHT_CONTRAST_V281.md`.

## V294 - Helper puri app.js

V294 introduce `assets/js/utils/shared-helpers-v294.js`, un modulo piccolo di helper puri per preparare il refactor di `assets/app.js`. Il modulo espone normalizzazione testo, slug, numeri, CSV e deduplicazione, ma non sostituisce ancora i call-site storici. Nessuna funzionalita runtime viene rimossa o riscritta.

Funzionalita da preservare nei prossimi refactor JS: Listone con `Modifica`/export, rose e pagina squadra, Dashboard Presidente, Admin Richieste/Diagnostica/Converti listone, news share WhatsApp, mobile nav/pulsante Su, `competition.html`, `player.html` e Dark mode unico V289. Documento tecnico: `docs/zonaorientale/refactor/APP_HELPERS_EXTRACTION_V294.md`. Diagnostica: `window.ZonaOrientaleAppHelpersExtractionV294`.


## V297 - Pulizia helper V294 obsoleto

V297 rimuove il file helper non piu' importato `assets/js/utils/shared-helpers-v294.js`. Il file attivo resta `assets/js/utils/shared-helpers-v295.js`. Prima e dopo la rimozione verificare sempre che l'export CSV modifiche Listone resti admin-only e funzionante. Nessuna logica Firebase, EmailJS, Rose, Admin o mobile viene toccata.

## V300 - Audit CSS e pulizia controllata styles.css

V300 aggiunge `tools/audit-css-v300.sh` e il documento `docs/zonaorientale/refactor/CSS_AUDIT_V300.md`. La release non rimuove CSS e non cambia UI: serve a individuare import, residui e duplicati potenziali prima di qualunque pulizia di `assets/styles.css`. Funzionalita da preservare in ogni futura pulizia CSS: Listone con `Modifica`/export admin-only, rose e pagina squadra, Dashboard Presidente, mobile navigation, Dark mode unico V289, `competition.html`, `player.html` e Admin.

## V301 - Pulizia controllata CSS refactor residui

V301 aggiunge `static/zonaorientale/tools/cleanup-css-refactor-v301.sh` e `docs/zonaorientale/refactor/CSS_CLEANUP_V301.md`. Lo script rimuove solo vecchi CSS refactor versionati V291/V292, e solo dopo aver verificato che non siano referenziati dagli HTML principali o da `assets/app.js`. Non cambia UI o runtime.

Funzionalita da preservare in ogni pulizia CSS: Listone con `Modifica`/export admin-only, rose e pagina squadra, Dashboard Presidente, mobile navigation, Dark mode unico V289, Admin, `competition.html` e `player.html`.

## V302 - Helper CSV condiviso e Calciomercato messo in backlog

V302 collega il CSV export del Listone a `ZonaOrientaleSharedHelpersV295.rowsToCsv`, preservando fallback legacy, BOM UTF-8, separatore `;` e restrizione Admin-only V296.

Diagnostica:

```js
window.ZonaOrientaleAppHelperRewireV302
```

Funzionalita' a rischio preservate: Listone pubblico, colonna `Modifica`, filtro `Modifiche`, usciti storici, export CSV solo Admin, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.

La Light mode resta sospesa; il piano di recupero Light non fa parte della roadmap corrente.

La sezione `Calciomercato` e' stata valutata in `docs/zonaorientale/pianificazione/CALCIOMERCATO_AGGREGATORE_V302.md`, ma non implementata.

## V303 - Diagnostica dati Admin estesa

- Versione runtime: `V303 diagnostica admin dati`.
- `Admin -> Diagnostica dati` aggiunge controlli su qualità Listoni, Rose, Competizioni e News.
- La diagnostica è solo lettura: nessuna scrittura Firebase e nessuna modifica ai dati.
- Funzionalità protette: Listone pubblico/admin, export CSV solo Admin V296, Rose/pagina squadra, Dashboard Presidente, Richieste presidenti, mobile nav e Dark mode unico.
- Diagnostica: `window.ZonaOrientaleAdminDiagnosticsV303`.



## V304 - Mobile review finale e pre-Calciomercato

V304 chiude la fase di stabilizzazione prima di iniziare la feature Calciomercato. Non introduce funzionalita runtime: aggiunge il documento `docs/zonaorientale/audit/MOBILE_REVIEW_FINALE_V304.md` e la diagnostica `window.ZonaOrientaleMobileFinalReviewV304`.

La Light mode resta sospesa. Ogni prossima modifica deve dichiarare esplicitamente quali funzionalita rischia di scollegare e come le preserva. Per Calciomercato, partire con una V1 isolata e statica/configurabile, senza scraping diretto dal browser.

Funzionalita da non perdere: Listone con `Modifica`/`Modifiche`/usciti storici/export admin-only, Rose e pagina squadra, Dashboard Presidente, Admin Diagnostica/Richieste/Converti listone, mobile bottom nav/menu Altro/pulsante Su, Dark mode unico, News share, `competition.html` e `player.html`.

## V305 - Calciomercato base statico

V305 introduce la prima sezione pubblica `Calciomercato`, isolata dal Fantamercato interno. La sezione legge dati statici/manuali da `assets/calciomercato/links.json`, mostra fonti e articoli con filtri squadra/topic e ricerca. Non effettua scraping, non usa Netlify Function e non scrive su Firebase. Prima di evolvere verso recupero automatico preservare Listone, Rose, Dashboard Presidente, Admin e mobile navigation.

## V306 - Calciomercato: giocatori interessati

V306 estende `Calciomercato` aggiungendo il campo `players`/`giocatori` agli articoli statici in `assets/calciomercato/links.json`. I nomi vengono mostrati come chip nelle card e inclusi nella ricerca. Non introduce recupero automatico da siti esterni e non tocca Firebase, EmailJS, Fantamercato interno, Listone, Rose, Admin o Dashboard Presidente. Documento tecnico: `docs/zonaorientale/calciomercato/CALCIOMERCATO_GIOCATORI_V306.md`.
## V307 - Calciomercato nome sezione

V307 rinomina la sezione da `Calcio mercato` a `Calciomercato`. Il cambio e solo UI/documentale: resta invariata la logica statica V305/V306, inclusi articoli, fonti, filtri e giocatori interessati. La route interna resta `#calciomercato`. Documento: `docs/zonaorientale/calciomercato/CALCIOMERCATO_NOME_SEZIONE_V307.md`.



## V308 - Calciomercato squadre multiple e stato trattativa

- La sezione `Calciomercato` resta statica/manuale e non recupera automaticamente dati dai siti esterni.
- Ogni articolo puo essere collegato a piu squadre tramite `teams`, `teamNames` o `squadre`.
- Ogni articolo puo mostrare uno stato trattativa tramite `marketStatus`, `status` o `stato`.
- Funzionalita preservate: Fantamercato interno, Listone, export CSV solo Admin, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, mobile navigation e Dark mode unico.

## V309 - Calciomercato automatico RSS

Aggiunta Netlify Function `netlify/functions/calciomercato-feed.js` per recuperare automaticamente articoli dalle fonti configurate in `assets/calciomercato/links.json`. La sezione Calciomercato prova prima `/.netlify/functions/calciomercato-feed` e poi usa `links.json` come fallback statico. Fonti iniziali: TuttoMercatoWeb, SOS Fanta, Gianluca Di Marzio; `Fantacalcio.it` resta fonte suggerita da verificare. Funzionalita preservate: Fantamercato interno, Listone/export admin-only, Rose, Admin, Presidente, Firebase/Auth/EmailJS, mobile navigation. Diagnostica: `window.ZonaOrientaleCalciomercatoV309`.


## V310 - Calciomercato layout orizzontale

V310 migliora la leggibilita' della nuova sezione `Calciomercato`: le card articolo vengono rese orizzontali/lista, evitando card strette con testo quasi verticale.

Non cambia il recupero automatico RSS V309, non cambia il formato di `assets/calciomercato/links.json` e non tocca Fantamercato interno, Listone, Rose, Admin, Presidente, Firebase o EmailJS.

Documento tecnico: `docs/zonaorientale/calciomercato/CALCIOMERCATO_LAYOUT_ORIZZONTALE_V310.md`.

## V311 - Ora pubblicazione Calciomercato

La sezione Calciomercato visualizza data e ora di pubblicazione degli articoli quando disponibili dai feed RSS. Diagnostica: `window.ZonaOrientaleCalciomercatoDateTimeV311`. Funzionalita preservate: RSS automatico V309, fallback statico, layout orizzontale V310, giocatori/squadre/stato, Fantamercato interno, Listone, Rose, Admin e Firebase.

## V312 - Fuso orario Calciomercato

La sezione Calciomercato usa `Europe/Rome` per mostrare data/ora degli articoli RSS e del timestamp di aggiornamento feed. Diagnostica: `window.ZonaOrientaleCalciomercatoTimeZoneV312`. Funzionalita preservate: RSS automatico V309, fallback statico, layout V310, Fantamercato interno, Listone, Rose, Admin e Firebase.
