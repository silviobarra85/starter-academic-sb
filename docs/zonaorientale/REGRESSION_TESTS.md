## Test V313 - Admin ordinato e Calciomercato feed

- Admin leggero: il titolo `Admin` deve comparire sopra tutti i pannelli.
- Admin leggero: `Carica dati amministrazione` deve restare visibile e aperto.
- Admin completo: categorie Admin ridotte al primo caricamento, apribili con pulsante `Apri`.
- Admin completo: Richieste presidenti, Diagnostica dati, Converti listone Excel, Snapshot e Backup ancora funzionanti.
- Calciomercato: feed RSS automatico ancora funzionante via Netlify Function.
- Calciomercato: `/.netlify/functions/calciomercato-feed?limit=80` restituisce JSON valido.
- Listone pubblico: export CSV non visibile.
- Listone Admin: export CSV visibile e funzionante.
- Rose, Dashboard Presidente, Competizioni, player.html e mobile nav invariati.

## Checklist V299 - CSS refactor stabile

- Eseguire `static/zonaorientale/tools/check-zonaorientale.sh`.
- Verificare che gli HTML importino `assets/css/refactor/mobile-controls.css` e `assets/css/refactor/rosters-tables.css`.
- Verificare che `theme-light-suspended.css` esista ma non sia importato.
- Verificare Listone pubblico: export CSV non visibile, `Modifiche` e `Mostra usciti storici` funzionanti.
- Verificare Listone Admin: export CSV visibile e funzionante.
- Verificare pagina squadra/Rose mobile: prima colonna sticky e righe compatte.
- Verificare Dashboard Presidente, bottom nav/menu Altro/pulsante Su, `competition.html`, `player.html` e Dark mode unico.

## Checklist V298 - Audit asset/import orfani

- Eseguire `static/zonaorientale/tools/audit-assets-v298.sh` e verificare che non segnali riferimenti locali mancanti.
- Trattare eventuali candidati orfani come warning: non cancellare senza grep, audit e test browser.
- Eseguire `static/zonaorientale/tools/check-zonaorientale.sh`.
- Verificare Listone pubblico: export CSV non visibile per non Admin, Modifiche/usciti storici funzionanti.
- Verificare Listone Admin: export CSV visibile e funzionante.
- Verificare pagina squadra/Rose mobile, Dashboard Presidente, Admin, `competition.html`, `player.html`, bottom nav e Dark mode unico.

## Aggiornamento test V296 - Export modifiche solo Admin

- Pubblico/non Admin: aprire Listone e verificare che `Esporta modifiche CSV` non compaia.
- Pubblico/non Admin: verificare che `Modifiche`, `Mostra usciti storici`, ricerca e colonna `Modifica` restino funzionanti.
- Admin: aprire Listone e verificare che `Esporta modifiche CSV` compaia e scarichi il CSV.
- Console: `window.ZonaOrientaleListoneExportAdminOnlyV296` deve essere disponibile.
- Confermare assenza regressioni su rose, pagina squadra, Dashboard Presidente, bottom nav, menu Altro e news share.

## Checklist V292 - Pulizia CSS Light sospeso

- Verificare che il sito resti in Dark mode e che il toggle tema non sia visibile.
- Verificare Listone mobile: colonna Modifica, filtro Modifiche, usciti storici, export CSV.
- Verificare pagina squadra -> Rosa mobile: righe compatte, prima colonna sticky e testo leggibile.
- Verificare Dashboard Presidente: tabelle rosa e controlli touch.
- Verificare bottom navigation, menu Altro e pulsante Su.
- Verificare `competition.html` e `player.html` da mobile.
- Eseguire `static/zonaorientale/tools/check-zonaorientale.sh`.

## Aggiornamento V290 - Test refactor styles/app

V290 non cambia comportamento runtime. Prima di procedere a refactor reali verificare che il sito resti allineato a V290 e usare `docs/zonaorientale/refactor/AUDIT_STYLES_APP_V290.md` come checklist di preservazione funzionale. Test minimi: Home, News/link WhatsApp, Listone con Modifiche/export, Rose/pagina squadra mobile, Competizioni, Archivio, Statistiche, Confronta, Dashboard Presidente, Admin Richieste presidenti, Diagnostica dati, Converti listone Excel, bottom navigation e pulsante Su.

## Aggiornamento V289 - Test dark mode e rose mobile

Dopo V289 verificare da smartphone/viewport mobile: il pulsante tema non deve comparire; anche con `localStorage.zonaOrientaleTheme = "light"` il sito deve ricaricarsi in Dark; nelle rose pubbliche e nella pagina squadra le righe della tabella Rosa devono essere compatte e il nome nella prima colonna deve essere leggibile e centrato verticalmente. Ripetere un controllo rapido su Listone, Dashboard Presidente e pagina giocatore standalone.

## Aggiornamento V288 - Test rose mobile Light

Dopo V288 verificare da smartphone/viewport mobile in tema Light: pagina squadra -> tabella Rosa, prima colonna con nome giocatore chiaro su sfondo scuro, testo leggermente piu' grande, contenuto centrato verticalmente e righe non eccessivamente alte. Ripetere un controllo rapido su Listone e tema Dark per escludere regressioni.

## Aggiornamento V287 - Test controlli mobile

Dopo V287 verificare da smartphone/viewport mobile: filtri Listone, campi visibili, filtro Modifiche, export CSV, form Dashboard Presidente, toolbar Admin, bottom navigation, menu Altro, input con focus e scroll orizzontale tabelle. Ripetere un controllo rapido in tema Dark.

## Test V285 - Fix mirati mobile

- Attivare tema Light e verificare da smartphone reale o viewport mobile.
- Home: card, testi secondari e menu mobile leggibili.
- Listone: `Storico listoni` non visibile; `Modifiche`, `Mostra usciti storici` ed export CSV ancora presenti e leggibili.
- Listone: tabella scrollabile, prima colonna sticky leggibile, badge modifica leggibili.
- Competizioni: classifica/calendario scrollabili, intestazioni sticky leggibili.
- Archivio, Statistiche e Confronta: card e testi secondari leggibili in Light.
- Dashboard Presidente: card, trattative e azioni rapide leggibili in Light.
- Admin -> Diagnostica dati e Richieste presidenti leggibili in Light.
- Console: `window.ZonaOrientaleMobileFixesV285.cssOnly` deve essere `true`.

## Aggiornamento V284 - Audit mobile completo

Prima di procedere con ulteriori fix UI/mobile, usare `docs/zonaorientale/audit/AUDIT_MOBILE_COMPLETO_V284.md`.

Controlli minimi V284:

```text
Home e navigazione mobile
News/comunicati
Listone con Modifica, Modifiche, Usciti storici, Export CSV
Competizioni e competition.html
Archivio
Statistiche
Confronta
Dashboard Presidente
Admin -> Diagnostica dati e Richieste presidenti
Tema Light e Dark
Viewport 390x844, 430x932, 768x1024
```

Diagnostica console:

```js
window.ZonaOrientaleMobileAuditV284
```

## Aggiornamento V283 - Pulizia file macOS/residui

Test obbligatori dopo applicazione:

```bash
static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh
static/zonaorientale/tools/check-zonaorientale.sh
```

Il primo comando deve poter essere eseguito in dry-run senza cancellare nulla. Il secondo deve confermare sintassi JS, JSON, versioni/cache-buster e assenza di file macOS indesiderati.

Verifica browser:

```js
window.ZonaOrientaleMacOsCleanupV283
window.ZonaOrientalePrePushChecksV282
```

## Aggiornamento V282 - Controlli pre-push

V282 aggiunge lo script `static/zonaorientale/tools/check-zonaorientale.sh` per centralizzare i controlli tecnici prima di commit/push: sintassi JS, validita JSON, footer/cache-buster/versione e file macOS indesiderati. Nessuna modifica funzionale a Firebase, EmailJS o dati runtime. Diagnostica: `window.ZonaOrientalePrePushChecksV282`. Documento operativo: `release/CONTROLLI_PRE_PUSH_V282.md`.

## Test V275 - Verifica registro funzionale recente

1. Controllare footer `V275 funzionalita V271-274`.
2. Verificare console: `window.ZonaOrientaleFunctionLedgerV275`.
3. Verificare presenza di `docs/zonaorientale/FUNZIONALITA'V271-274.md`.
4. Ripetere test Listone V273/V274 se vengono toccati convertitore, colonne o ricerca storica.

## Test V273 - Listone Excel reale

1. Admin -> Converti listone Excel.
2. Caricare `lista_calciatori_lista calciatori_classic_zonaorientale-salerno.xlsx`.
3. Verificare report: formato Classic a foglio singolo, 663 giocatori, 532 in listone, 131 asteriscati.
4. Aprire Listone pubblico.
5. Abilitare colonna `Modifica`.
6. Verificare che le differenze quotazione siano visibili e che non compaiano falsi cambi squadra di massa.
7. Controllare console: `window.ZonaOrientaleListoneE2ETestV273`.

# Aggiornamento V272 - Checklist pre-merge

Prima del merge su `master`, usare anche `audit/VERIFICA_FUNZIONALITA_V272.md` e `release/PUSH_MASTER_E_RITORNO_BRANCH_V272.md`. Test minimi: Home, News/share, Dashboard Presidente, Svincola Giocatori, Trattative/notifiche, Admin Richieste presidenti, Admin Converti listone Excel, Listone con colonna Modifica, Competizioni e Archivio.

# Aggiornamento V266 - Email deliverability EmailJS

V266 rende piu' pulite e coerenti le mail operative inviate via EmailJS: aggiunge parametri comuni di mittente logico (`Lega ZonaOrientale Salerno`), Reply-To dell'utente loggato quando disponibile, oggetti piu' sobri e firma standard del gestionale. I flussi aggiornati sono: comunicato avvenuto scambio e informativa svincolo giocatori. Non modifica `FUNZIONALITA'.md`. Diagnostica: `window.ZonaOrientaleEmailJsDeliverabilityV266`.

# Aggiornamento V265 - Pulizia asset sicuri

V265 e' una pulizia fisica controllata: rimuove dai comandi di release i duplicati/inutilizzati sicuri gia' identificati nell'audit, mantiene come canonico il simulatore trattative `assets/js/dev/trade-notification-simulator-v255.js` e aggiunge/rafforza `.gitignore` per impedire il ritorno di file macOS. Non modifica `FUNZIONALITA'.md` e non cambia comportamento runtime. Diagnostica: `window.ZonaOrientaleCleanupV265`.

# Aggiornamento V263 - Funzionalita V256-262

V263 aggiunge `FUNZIONALITA'V256-262.md`, registro incrementale delle funzionalita introdotte o consolidate tra V256 e V262. Non modifica `FUNZIONALITA'.md` e non cambia il comportamento runtime. Diagnostica: `window.ZonaOrientaleFeaturesDocV263`.

# Aggiornamento V262 - Audit pulizia codice

V262 aggiunge `AUDIT_CODICE_260528_V262.md` e una `.gitignore` locale in `static/zonaorientale/`. Non cambia funzionalita': fotografa file duplicati/non importati, file macOS e candidati a pulizia controllata. Diagnostica runtime: `window.ZonaOrientaleAuditV262`.

## Test V261 - Svincola Giocatori

1. Login come presidente approvato.
2. Aprire `Dashboard Presidente`.
3. Verificare la presenza della terza sottosezione `Svincola Giocatori`.
4. Selezionare uno o piu giocatori dalla rosa.
5. Verificare che il corpo email includa testo standard, lista giocatori e Qt.A tra parentesi.
6. Verificare che la chiusura riporti il listone usato per le quotazioni e la firma del presidente.
7. Cliccare `Invia informativa` e verificare ricezione EmailJS a `caparrotti86@yahoo.it`.
8. Verificare che non venga creata una richiesta in `Admin -> Richieste presidenti`, perche il flusso V261 e' solo email.

Diagnostica console:

```js
window.ZonaOrientalePlayerReleaseV261
window.ZonaOrientalePlayerReleaseV261.buildDraft()
```

## Test V257 - Notifiche trattative multi-dispositivo

Dopo deploy delle Firebase Rules V257:

1. Presidente A invia proposta a Presidente B.
2. Presidente B approva o rifiuta.
3. Presidente A vede badge rosso esito.
4. Presidente A apre la card della proposta in `Dashboard Presidente -> Trattative` da smartphone.
5. Verificare in console che non appaia `Lettura esito trattativa salvata solo localmente`.
6. Aprire da desktop con lo stesso presidente A: il badge esito non deve riapparire.

Comando utile dopo login presidente:

```js
await ZonaOrientaleTradeSimulatorV255.createFirebaseSentProposal({ confirm: true })
```

## Nota V256 - Registro incrementale funzionalita

Per verificare cosa e' stato aggiunto/consolidato tra V240 e V255 consultare `FUNZIONALITA'V240-255.md`. Il documento principale `FUNZIONALITA'.md` non viene toccato salvo richiesta esplicita.

## Comandi standard trattative V255

Da DevTools Console, dopo login come presidente:

```js
ZonaOrientaleTradeSimulatorV255.help()
ZonaOrientaleTradeSimulatorV255.getContext()
ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()
ZonaOrientaleTradeSimulatorV255.resolveLocalIncomingProposal("REJECTED")
ZonaOrientaleTradeSimulatorV255.simulateResolvedSentProposal({ status: "ACCEPTED" })
await ZonaOrientaleTradeSimulatorV255.markAllOutcomeSeen()
ZonaOrientaleTradeSimulatorV255.clearLocalSimulations()
```

Smoke test locale completo, senza scritture Firebase:

```js
await ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()
```

Test reale Firebase, da usare solo quando si vuole creare una proposta vera:

```js
await ZonaOrientaleTradeSimulatorV255.createFirebaseSentProposal({ confirm: true })
```

Alias compatibilita': i comandi `ZonaOrientaleTradeSimulatorV254.*` continuano a puntare alla stessa API V255.

# Regression tests ZonaOrientale


### Simulatore notifiche trattative V254

- Accedere come presidente e verificare `window.ZonaOrientaleTradeSimulatorV254`.
- Eseguire `ZonaOrientaleTradeSimulatorV254.simulateIncomingProposal()` e verificare badge rosso e card ricevuta locale.
- Eseguire `ZonaOrientaleTradeSimulatorV254.simulateResolvedSentProposal({ status: "ACCEPTED" })` e verificare badge esito su proposta inviata locale.
- Eseguire `ZonaOrientaleTradeSimulatorV254.clearLocalSimulations()` e verificare rimozione simulazioni locali.
- Usare `await ZonaOrientaleTradeSimulatorV254.createFirebaseSentProposal({ confirm: true })` solo per test reali su Firebase.

Stato: V254.

Questo documento e' una checklist operativa per evitare regressioni prima di fondere un branch su `master` o prima di pubblicare una modifica rilevante. Non sostituisce `FUNZIONALITA'.md`: quel file resta il registro funzionale e va modificato solo su richiesta esplicita.

## Regola generale

Per ogni overlay codice/UI verificare sempre:

1. footer con versione attesa;
2. cache-buster HTML principali allineati;
3. assenza di errori bloccanti in Console;
4. test desktop e mobile;
5. comportamento Firebase coerente con utente anonimo, presidente e admin.

## Smoke test pubblico

### Avvio

- Aprire `/zonaorientale/`.
- Verificare che il footer mostri la versione corrente.
- Verificare che la Dashboard carichi senza errori bloccanti.
- Aprire e richiudere menu mobile/bottom navigation.

### Dashboard

- Vedere riepilogo stagione corrente.
- Vedere card squadre/competizioni/news recenti.
- Da mobile, usare le azioni rapide principali.

### News

- Aprire la sezione `News`.
- Espandere un comunicato.
- Copiare/condividere link WhatsApp.
- Aprire un hash diretto `#news-...`, quando disponibile.

### Rose

- Aprire `Rose`.
- Selezionare almeno due squadre.
- Verificare giocatori, ruoli, costo e quotazione.
- Controllare tabella movimenti, ricerca e filtro squadra.

### Fantamercato pubblico

- Aprire `Fantamercato`.
- Verificare lista giocatori in vendita.
- Usare ricerca e filtro squadra.
- Da mobile, verificare card e scroll.

### Listone

- Aprire `Listone`.
- Testare ricerca giocatore.
- Testare filtri ruolo.
- Testare stati: `In listone`, `Asteriscato`, `Svincolati`.
- Verificare che i filtri non si sovrappongano in modo anomalo.
- Aprire almeno una scheda giocatore.

### Competizioni

- Aprire `Competizioni`.
- Aprire una competizione in dettaglio.
- Verificare calendario, risultati e classifiche.
- Per campionato, verificare colonne POS/SQUADRA/PUNTI/PG/V/N/P/GF/GS/DR/FPT.

### Archivio

- Aprire `Archivio`.
- Cambiare stagione.
- Verificare squadre, competizioni, risultati e dati FM se presenti.

### Albo e statistiche

- Aprire `Albo d'Oro`.
- Verificare albo, palmares e FIFA Ranking.
- Aprire `Statistiche`.
- Verificare titoli, presidenti e ranking storici.

### Confronta

- Aprire `Confronta`.
- Selezionare due squadre.
- Verificare che il confronto venga renderizzato.

### Regolamento

- Aprire `Regolamento`.
- Verificare indice e contenuti principali.

## Smoke test Presidente

### Login e Dashboard Presidente

- Login con presidente approvato.
- Verificare header con logo squadra e `Pres. Cognome`.
- Aprire Dashboard Presidente.
- Verificare saldo FM, rosa, giocatori in vendita e trattative.

### Comunicati squadra

- Compilare `Comunicato squadra`.
- Inviare.
- Verificare comparsa richiesta in Admin -> Richieste presidenti.
- Approvare da admin e verificare pubblicazione in News.

### Comunicati avvenuto scambio

- Compilare `Comunicato avvenuto scambio`.
- Inviare.
- Verificare invio EmailJS a `caparrotti86@yahoo.it`.
- Verificare comparsa richiesta in Admin -> Richieste presidenti.
- Approvare da admin e verificare pubblicazione in News con topic corretto.

### Trattative

- Presidente A invia proposta a Presidente B.
- Presidente B vede badge rosso persistente.
- Presidente B apre Dashboard Presidente -> Trattative.
- Presidente B approva o rifiuta.
- Presidente B non vede piu' badge per quella proposta.
- Presidente A vede badge rosso di esito.
- Presidente A apre card proposta conclusa.
- Badge del Presidente A sparisce e resta spento dopo refresh, se Firebase consente il salvataggio lettura.
- Ripetere almeno un controllo da mobile.

### Storico trattative

- Verificare sezioni `Inviate` e `Ricevute`.
- Verificare che siano visibili le ultime 5 e che lo storico sia scrollabile.
- Verificare che proposta ed esito rimangano leggibili.

## Smoke test Admin

### Accesso admin

- Login admin.
- Aprire `Admin`.
- Caricare dati amministrazione completi solo quando serve.
- Verificare assenza di permission-denied imprevisti.

### Accetta utenti

- Aprire `Accetta utenti`.
- Verificare che utenti gia' approvati non compaiano come pending.
- Verificare che utenti rifiutati restino `REJECTED` e non tornino pending da soli.

### Richieste presidenti

- Aprire `Richieste presidenti`.
- Usare `Aggiorna richieste`.
- Approvare un comunicato squadra.
- Rifiutare un comunicato squadra.
- Approvare un comunicato avvenuto scambio.
- Rifiutare un comunicato avvenuto scambio.
- Per richieste rifiutate o approvate, verificare pulsante `Elimina da Firebase`.
- Dopo eliminazione, premere `Aggiorna richieste` e verificare che non torni.

### News admin

- Creare/modificare/eliminare comunicato admin, se in test controllato.
- Verificare preview/condivisione quando disponibile.

### Competizioni admin

- Aprire pannello competizioni.
- Verificare elenco, calendario, risultati e classifiche.
- Non salvare modifiche su produzione senza necessita'.

### Snapshot e pubblicazione

- Aprire area snapshot pubblici.
- Verificare preflight asset.
- Verificare procedure download overlay quando disponibili.
- Controllare checklist deploy online.

### Backup

- Verificare apertura area backup.
- Testare export solo se necessario e in ambiente sicuro.

## Test tecnico pre-commit

Eseguire almeno:

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -name '*.js' -print0 | xargs -0 -n1 node --check
python3 -m json.tool static/zonaorientale/assets/public/config.json >/dev/null
```

## Test Git consigliato

```bash
git status
git diff --stat
git diff -- static/zonaorientale/index.html static/zonaorientale/assets/app.js docs/zonaorientale/CHANGELOG_CONSOLIDATO.md
```

Prima del merge su `master`, verificare che `FUNZIONALITA'.md` non sia cambiato salvo richiesta esplicita.

## Nota V248

Aggiungere al test Presidente: verificare che in DevTools `window.ZonaOrientaleLegacyCleanupV248.legacyTransferCommunicationArtifacts` sia `0` dopo apertura della Dashboard Presidente.



### Admin generatore comunicati automatici V250

- Aprire Admin e verificare la presenza del pannello `Generatore comunicati automatici`.
- Scegliere tipo comunicato, stagione, eventuale competizione/squadra e tono.
- Premere `Genera bozza` e verificare titolo/testo generati.
- Premere `Copia testo` e verificare assenza di errori bloccanti.
- Premere `Inserisci nei Comunicati`: deve aprirsi il pannello `Admin -> Comunicati` e i campi titolo/testo/topic devono essere compilati.
- Salvare manualmente un comunicato solo se si sta facendo un test Firebase reale.
- Controllare in console `window.ZonaOrientaleCommunicationGeneratorV250`.

### Admin richieste presidenti V249

- Aprire `Admin -> Richieste presidenti`.
- Cliccare `Aggiorna richieste` e verificare che la lista venga riletta senza errori.
- Su una richiesta `PENDING`, verificare che `Approva` e `Rifiuta` funzionino.
- Su un comunicato `APPROVED` o `REJECTED`, verificare che `Elimina da Firebase` chieda conferma e rimuova solo la richiesta da `teamRequests`.
- Controllare in console `window.ZonaOrientaleTeamRequestsV249`.

### Admin workflow pubblicazione V251

- Aprire Admin dopo login admin.
- Verificare presenza del pannello `Stato Firebase / JSON`.
- Premere `Aggiorna stato pubblicazione` e verificare che non generi errori bloccanti.
- Verificare presenza del pannello `Procedura guidata Pubblica aggiornamenti`.
- Premere `Aggiorna procedura` e `Copia comandi`, verificando che il testo copiato non contenga riferimenti a branch storici come `feature/zonaorientale-v187-next`.
- Controllare in console `window.ZonaOrientalePublicationWorkflowV251`.

### Cleanup asset V252

- Verificare che gli HTML non linkino `assets/css/mobile-hotfix-v166.css` o `assets/css/mobile-hotfix-v167.css`.
- Verificare che `assets/css/mobile-suite-v168.css` contenga i blocchi `mobile-hotfix-v166.css` e `mobile-hotfix-v167.css`.
- Verificare in console `window.ZonaOrientaleCleanupV252`.
- Dopo `git rm`, verificare `git status` e assenza di `.DS_Store` / `__MACOSX` nel commit.



### Admin Richieste presidenti V253

- Aprire Admin -> Richieste presidenti.
- Verificare presenza del pulsante `Aggiorna richieste`.
- Verificare in console `window.ZonaOrientaleTeamRequestsV253.installed` o `window.ZonaOrientaleTeamRequestsV253.api.installed`.
- Testare Approva/Rifiuta su richiesta PENDING.
- Testare `Elimina da Firebase` su comunicato APPROVED o REJECTED.
- Dopo `Aggiorna richieste`, il documento eliminato non deve ricomparire.


## Test rapido Accesso Riservato V264

- Aprire `Accedi / Registrati`.
- Verificare che il campo `Nome visualizzato` non sia presente.
- Verificare che il pulsante `Accedi con Google` mostri il logo Google e resti cliccabile.
- Registrazione email: usare solo email/password; il nome presidente va assegnato dall'admin.
- Console: `window.ZonaOrientaleLoginUiV264.displayNameFieldRemoved` deve essere `true`.

## Test aggiuntivi V267 - Competizioni

Prima di rimuovere o rifattorizzare codice competizioni, verificare:

```text
[ ] Dashboard pubblica: competizioni correnti visibili.
[ ] Sezione Competizioni: elenco, stato, vincitore e link corretti.
[ ] competition.html: calendario, risultati e classifiche visibili.
[ ] Archivio: competizioni storiche consultabili.
[ ] Mobile: card/blocchi competizioni leggibili.
[ ] Admin -> Competizioni: pannello apribile senza errori console.
[ ] Console: window.ZonaOrientaleCompetitionsAuditV267 presente.
```


## Test aggiuntivi V268 - Convertitore listone Excel

```text
[ ] Admin -> Converti listone Excel apribile.
[ ] Conversione formato storico Tutti/Ceduti restituisce giocatori > 0.
[ ] Conversione formato Classic Lista calciatori restituisce giocatori > 0.
[ ] La colonna QUOT. viene mappata come quotazione attuale.
[ ] La colonna Fuori lista valorizzata produce status ASTERISCATO.
[ ] Il report mostra formato riconosciuto e fogli usati.
[ ] Console: window.ZonaOrientaleListoneConverterV268 presente.
```


## V269 - Storico e confronto listoni

- Aggiunto confronto automatico tra listone selezionato e listone precedente della stessa stagione.
- Il convertitore listone arricchisce il JSON generato con campi `previous`, `diff`, `previousQuotationCurrent`, `quotationDiffFromPrevious`, `statusChange` e riepilogo `history`.
- La sezione pubblica `Listone` mostra un pannello `Storico listoni` con nuovi, usciti, variazioni quotazione e ricerca negli altri listoni.
- Il campo ricerca puo' trovare giocatori presenti in listoni passati anche quando non sono nel listone selezionato.
- Diagnostica: `window.ZonaOrientaleListoneHistoryV269`.
- Non sono state rimosse funzionalita' esistenti; il formato storico Tutti/Ceduti e il formato Classic a foglio singolo restano supportati.

## Addendum V271 - test listone storico

- Listone: abilitare colonna `Modifica` da `Campi visibili`.
- Listone: attivare `Mostra usciti storici`.
- Listone: cercare un giocatore presente solo in un listone precedente.
- Admin: convertire un file Excel formato Classic `Lista calciatori`.
- Admin: verificare report con formato riconosciuto e confronto, se disponibile.


## V274 - Codici squadra canonici nel Listone

Il convertitore listone accetta sia sigle sia nomi estesi per la squadra reale, ma salva/visualizza la sigla canonica a 3 lettere. Questo evita falsi cambi squadra nei confronti storici e rende stabile la colonna `Modifica`.

## Test V276-V277

- Admin -> Diagnostica dati: il pannello si apre, mostra righe e il pulsante `Aggiorna diagnostica` non genera errori.
- Listone -> campo `Modifiche`: ogni opzione filtra la tabella senza rompere ricerca, ruoli, stato, colonna `Modifica` e usciti storici.

## V278 - Export modifiche listone

Aggiunto export CSV non distruttivo delle modifiche del Listone. Il pulsante `Esporta modifiche CSV` rispetta il filtro `Modifiche` e include nuove righe, usciti storici, variazioni quotazione/stato/squadra/ruolo. Documento tecnico: `docs/zonaorientale/listoni/LISTONE_EXPORT_MODIFICHE_V278.md`.


## Test V280 - UI Listone semplificata

- Listone pubblico: il pannello `Storico listoni` non deve essere visibile.
- Listone pubblico: il toggle `Cerca anche negli altri listoni` non deve essere visibile.
- Listone pubblico: la tabella deve caricarsi regolarmente.
- Listone pubblico: filtro `Modifiche` funzionante.
- Listone pubblico: colonna `Modifica` attivabile dai campi visibili.
- Listone pubblico: `Mostra usciti storici` funzionante.
- Listone pubblico: `Esporta modifiche CSV` funzionante.
- Console: `window.ZonaOrientaleListoneUiV280.historyPanelVisible` deve essere `false`.

## Audit V280 - Mobile Light

- Tema Light su smartphone: controllare Home, Listone, Competizioni, Archivio, Statistiche, Dashboard Presidente e Admin.
- Verificare leggibilita di testi secondari, badge, celle tabella, bottoni secondari e intestazioni sticky.
- Usare `docs/zonaorientale/audit/AUDIT_MOBILE_LIGHT_CONTRAST_V280.md` come base per la prossima patch grafica.


## Test V281 - Contrasto mobile Light

- Attivare tema Light.
- Verificare da smartphone reale o viewport mobile.
- Home: testi secondari e card leggibili.
- Listone: filtro `Modifiche`, `Mostra usciti storici`, export CSV e tabella leggibili.
- Competizioni: calendario/classifiche leggibili, intestazioni sticky corrette.
- Archivio/Statistiche/Confronta: testi secondari leggibili su card chiare.
- Presidente: dashboard e trattative leggibili in Light.
- Admin: Diagnostica dati e Richieste presidenti leggibili in Light.
- Console: `window.ZonaOrientaleMobileLightContrastV281.cssOnly` deve essere `true`.

## Test V286 - Prima colonna mobile Light

- Attivare tema Light.
- Verificare da smartphone reale o viewport mobile.
- Listone: durante lo scroll orizzontale la prima colonna sticky deve mostrare il nome giocatore leggibile.
- Listone: il nome giocatore non deve mai risultare nero su sfondo nero/scuro.
- Rose pubbliche: nomi giocatori leggibili nella prima colonna.
- Dashboard Presidente/rose: nomi giocatori leggibili nella prima colonna se la tabella e' presente.
- Tema Dark: nessuna regressione evidente su Listone e rose.
- Console: `window.ZonaOrientaleStickyColumnContrastV286.cssOnly` deve essere `true`.
## V291 - Verifiche refactor CSS prudente

Funzionalita da non perdere durante la separazione CSS:

- Listone: colonna `Modifica`, filtro `Modifiche`, `Mostra usciti storici` ed export CSV.
- Rose e pagina squadra: prima colonna sticky leggibile, righe compatte e contenuto centrato verticalmente da mobile.
- Dashboard Presidente: tabelle rose, controlli trattative e form leggibili da smartphone.
- Navigazione mobile: bottom nav, menu Altro e pulsante Su.
- Tema: Light mode resta disattivata e il toggle tema non deve comparire.
- Pagine standalone: `competition.html` e `player.html` devono caricare i nuovi CSS V291.

Controlli tecnici:

```bash
static/zonaorientale/tools/check-zonaorientale.sh
```



## Test V293 - Audit mirato app.js

La V293 non modifica comportamento runtime, ma prepara il refactor JS. Prima di qualunque estrazione da `assets/app.js`, verificare:

- Home pubblica e dashboard stagione.
- News e link WhatsApp dinamici.
- Listone: colonna `Modifica`, filtro `Modifiche`, `Mostra usciti storici`, export CSV.
- Rose pubbliche, pagina squadra e Dashboard Presidente.
- Comunicati presidente, svincoli e trattative.
- Admin: Richieste presidenti, Diagnostica dati, Converti listone Excel, workflow pubblicazione.
- Competizioni, `competition.html`, Archivio, Statistiche, Confronta.
- Mobile: bottom nav, menu Altro, pulsante Su.
- `player.html`.
- Console: `window.ZonaOrientaleAppJsAuditV293.behaviorChange` deve essere `false`.

Regola: se un refactor rischia di scollegare una funzionalita, la release deve dichiarare come viene preservata o rimandare la modifica.

## Test V294 - Helper puri app.js

La V294 introduce un modulo di helper puri senza sostituire i call-site storici. Verificare:

- `static/zonaorientale/tools/check-zonaorientale.sh` deve passare.
- Console: `window.ZonaOrientaleSharedHelpersV294.runSmokeTest().ok` deve essere `true`.
- Console: `window.ZonaOrientaleAppHelpersExtractionV294.behaviorChange` deve essere `false`.
- Home pubblica e navigazione mobile devono caricarsi.
- Listone: filtro `Modifiche`, `Mostra usciti storici`, export CSV e colonna `Modifica`.
- Rose pubbliche e pagina squadra.
- Dashboard Presidente: rosa, trattative, comunicati e svincoli.
- Admin: Richieste presidenti, Diagnostica dati, Converti listone Excel.
- News/share WhatsApp dinamico.
- `competition.html` e `player.html`.

Funzionalita da non perdere: nessun flusso esistente deve essere ricollegato al nuovo helper senza un overlay dedicato e test browser.
## Test V295 - Primo collegamento helper puri app.js

La V295 collega solo l'escape CSV dell'export modifiche Listone al modulo helper condiviso. Test obbligatori:

- `static/zonaorientale/tools/check-zonaorientale.sh` deve passare.
- Console: `window.ZonaOrientaleSharedHelpersV295.runSmokeTest().ok` deve essere `true`.
- Console: `window.ZonaOrientaleAppHelpersExtractionV295.behaviorChange` deve essere `false`.
- Console: `window.ZonaOrientaleAppHelpersExtractionV295.rewiredCallSites` deve contenere `csvEscapeV278 -> ZonaOrientaleSharedHelpersV295.csvEscape`.
- Listone: filtro `Modifiche` funzionante.
- Listone: `Esporta modifiche CSV` genera un file apribile con intestazioni e righe corrette.
- Listone: verificare almeno un caso con accenti, apostrofi, virgolette o punti e virgola se disponibile nei dati.
- Controllo rapido: Rose/pagina squadra, Dashboard Presidente, Admin -> Diagnostica dati, bottom nav e News non devono mostrare regressioni.



## Test V297 - Pulizia helper V294

- Eseguire `static/zonaorientale/tools/check-zonaorientale.sh`.
- Verificare che `shared-helpers-v294.js` sia assente.
- Listone pubblico: export CSV non visibile.
- Admin: export CSV modifiche visibile e funzionante.
- Console: `window.ZonaOrientaleSharedHelpersV295.runSmokeTest().ok === true`.
- Console: `window.ZonaOrientaleHelperCleanupV297.behaviorChange === false`.

## Test V300 - Audit CSS

- Eseguire `static/zonaorientale/tools/check-zonaorientale.sh`.
- Eseguire `static/zonaorientale/tools/audit-css-v300.sh`.
- Verificare che `theme-light-suspended.css` non sia importato dagli HTML.
- Verificare Home mobile, Listone pubblico, Listone Admin, pagina squadra -> Rosa, Dashboard Presidente, bottom navigation, `competition.html` e `player.html`.
- Nessuna funzionalita deve cambiare: V300 e' solo audit/strumentazione.

## Test V301 - Pulizia CSS refactor residui

Comandi:

```bash
static/zonaorientale/tools/cleanup-css-refactor-v301.sh
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-css-v300.sh
```

Test manuali:

- Home mobile.
- Listone pubblico: export CSV non visibile.
- Listone Admin: export CSV visibile e funzionante.
- Pagina squadra -> Rosa: prima colonna sticky e righe compatte.
- Dashboard Presidente.
- Bottom nav, menu Altro, pulsante Su.
- `competition.html` e `player.html`.
- Dark mode unico, toggle tema assente.

## Test aggiuntivi V302 - Helper CSV condiviso

- Pubblico -> Listone: il pulsante `Esporta modifiche CSV` non deve comparire.
- Pubblico -> Listone: filtro `Modifiche`, colonna `Modifica` e usciti storici devono continuare a funzionare.
- Admin -> Listone: `Esporta modifiche CSV` deve comparire e scaricare un CSV valido.
- Console: `window.ZonaOrientaleAppHelperRewireV302.behaviorChange` deve essere `false`.
- Console: `window.ZonaOrientaleSharedHelpersV295.runSmokeTest().ok` deve essere `true`.

## Test V303 - Diagnostica Admin estesa

- Login Admin -> `Admin -> Diagnostica dati`: il pannello deve aprirsi e mostrare anche righe qualità per Listoni, Rose, Competizioni e News.
- Il pulsante `Aggiorna diagnostica` deve aggiornare il pannello senza errori console.
- Pubblico -> Listone: export CSV non visibile, filtri e colonna `Modifica` invariati.
- Admin -> Listone: export CSV ancora visibile e funzionante.
- Rose/pagina squadra e Dashboard Presidente: nessuna regressione visiva o dati mancanti.



## Test V304 - Mobile review finale e pre-Calciomercato

- Eseguire `static/zonaorientale/tools/check-zonaorientale.sh`.
- Home mobile: bottom nav, menu Altro e pulsante Su.
- Listone pubblico: export CSV non visibile, filtro `Modifiche` e colonna `Modifica` funzionanti.
- Listone Admin: export CSV visibile e funzionante.
- Pagina squadra -> Rosa: prima colonna sticky leggibile, righe compatte, testo centrato verticalmente.
- Dashboard Presidente: tabelle rosa, bottoni e form senza regressioni.
- Admin -> Diagnostica dati: controlli V303 visibili e refresh funzionante.
- Admin -> Richieste presidenti: pannello renderizzato e azioni visibili.
- `competition.html` e `player.html`: layout mobile e Dark mode corretti.
- Console: `window.ZonaOrientaleMobileFinalReviewV304.behaviorChange === false`.

## V305 - Test Calciomercato

- Aprire `#calciomercato` da desktop.
- Aprire `Altro -> Calciomercato` da mobile.
- Verificare che la sezione mostri lo stato vuoto se `links.json` non contiene articoli.
- Inserire temporaneamente un articolo in `assets/calciomercato/links.json` e verificare filtri squadra/topic, ricerca e link esterno.
- Verificare che `#fantamercato` resti il mercato interno dei trasferibili.
- Verificare Listone pubblico/Admin, Rose, Dashboard Presidente, Admin Diagnostica e mobile navigation.

## Test V306 - Calciomercato giocatori

- Aprire `Calciomercato` da desktop e mobile.
- Verificare che gli articoli con `players`/`giocatori` mostrino chip leggibili.
- Verificare che la ricerca trovi un articolo cercando il nome di un giocatore.
- Verificare che il Fantamercato interno non sia stato confuso con la nuova sezione informativa.
- Verificare Listone pubblico/Admin, Rose, Dashboard Presidente e Admin dopo la modifica.
## Test V307 - Calciomercato nome sezione

- Menu desktop: il link deve mostrare `Calciomercato`.
- Menu mobile `Altro`: il link deve mostrare `Calciomercato`.
- Aprire `#calciomercato`: titolo pagina `Calciomercato`.
- Verificare che gli articoli statici e i chip giocatori V306 continuino a funzionare.
- Verificare che `Fantamercato` interno resti invariato.



## V308 - Calciomercato squadre multiple e stato trattativa

- La sezione `Calciomercato` resta statica/manuale e non recupera automaticamente dati dai siti esterni.
- Ogni articolo puo essere collegato a piu squadre tramite `teams`, `teamNames` o `squadre`.
- Ogni articolo puo mostrare uno stato trattativa tramite `marketStatus`, `status` o `stato`.
- Funzionalita preservate: Fantamercato interno, Listone, export CSV solo Admin, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, mobile navigation e Dark mode unico.

## V309 - Test Calciomercato automatico RSS

- Aprire `#calciomercato` su ambiente Netlify: la sezione deve tentare il recupero da `/.netlify/functions/calciomercato-feed`.
- In locale con `python3 -m http.server`, la funzione non e' disponibile: la pagina deve usare il fallback statico senza bloccare il sito.
- Verificare che `links.json` resti valido JSON.
- Verificare che Fantamercato interno, Listone, Rose, Dashboard Presidente e Admin non cambino comportamento.
- Console: `window.ZonaOrientaleCalciomercatoV309.getState()` deve essere disponibile.


## Test regressione V310 - Calciomercato layout orizzontale

- Aprire `#calciomercato` e verificare card articolo orizzontali leggibili.
- Verificare titolo, descrizione, fonte, squadre, stato, giocatori e pulsante `Apri articolo`.
- Verificare funzionamento su mobile senza colonne strette.
- Verificare che `/.netlify/functions/calciomercato-feed` continui a restituire JSON in Netlify Dev/preview.
- Verificare che Fantamercato interno, Listone pubblico/Admin, Rose, Dashboard Presidente e Admin siano invariati.

## Test V311 - Ora pubblicazione Calciomercato

- Aprire Calciomercato con Netlify Dev o deploy Netlify.
- Verificare che gli articoli con timestamp completo mostrino data e ora.
- Verificare che articoli con sola data continuino a mostrarsi senza errori.
- Verificare Fantamercato interno, Listone pubblico/Admin, Rose, Dashboard Presidente e Admin.

## Test V312 - Fuso orario Calciomercato

- Aprire Calciomercato con Netlify Dev o deploy Netlify.
- Verificare che il riepilogo `aggiornato ...` mostri l'ora italiana, non l'UTC grezza.
- Esempio: `2026-06-03T08:51:00Z` deve apparire come `03/06/2026, 10:51`.
- Verificare che le card articolo continuino a mostrare data/ora.
- Verificare che Fantamercato interno, Listone pubblico/Admin, Rose, Dashboard Presidente e Admin siano invariati.

## Test aggiuntivi V314 - Calciomercato fonti

- `Calciomercato`: filtro squadra mostra `Tutte le squadre`, `Generale`, poi squadre alfabetiche.
- `Calciomercato`: filtro fonte mostra `Tutte le fonti` e le fonti recuperate/configurate.
- `Calciomercato`: filtrare per fonte senza perdere ricerca, topic, squadre e giocatori.
- Netlify Function: `/.netlify/functions/calciomercato-feed?limit=120` restituisce JSON valido.
- Verificare che Fantamercato interno, Listone, Rose, Admin, Dashboard Presidente e mobile nav restino invariati.

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

## V319 - Test Calciomercato mobile compatto

- Mobile -> Calciomercato: filtri sotto il titolo `Articoli di mercato`.
- Mobile -> select `Squadre`, `Topic`, `Fonti` affiancate e leggibili.
- Mobile -> campo `Cerca...` a tutta larghezza.
- Mobile -> campi `Da` e `A` affiancati e usabili.
- Mobile -> card articolo con immagine quadrata compatta e senza descrizione lunga.
- Desktop -> layout Calciomercato ancora leggibile.
- Verificare che ricerca, filtri, range e caricamento articoli piu vecchi funzionino.
- Verificare che Fantamercato interno, Listone, Rose, Dashboard Presidente e Admin non siano regressi.


## Test V320 - Riconoscimento Calciomercato

- Calciomercato: aprire con Netlify Dev e verificare chip squadre/giocatori rilevati.
- Calciomercato: cercare una squadra e un giocatore/allenatore presente nei titoli RSS.
- Calciomercato: filtri squadra/topic/fonte ancora funzionanti.
- Listone pubblico: export CSV non visibile.
- Listone Admin: export CSV visibile e funzionante.
- Fantamercato interno, Rose, Dashboard Presidente e Admin invariati.


## V321 - Fix espansione Diagnostica dati Admin

Ripristinata l'espansione del pannello `Admin -> Diagnostica dati` con handler delegato limitato al solo pannello diagnostica. Nessuna modifica a Firebase, Listone, Rose, Calciomercato o Dashboard Presidente.
