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
