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
