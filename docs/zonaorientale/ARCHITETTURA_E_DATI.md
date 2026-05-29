## Nota V261 - Informativa svincolo giocatori

Il flusso `Dashboard Presidente -> Svincola Giocatori` non introduce nuove collection Firebase. Legge la rosa del presidente dalle fonti gia caricate, cerca la Qt.A nei listoni della stagione corrente ordinati dal piu recente, genera una preview testuale e invia EmailJS a `caparrotti86@yahoo.it`. Diagnostica runtime: `window.ZonaOrientalePlayerReleaseV261`.

## Nota V257 - Stato lettura notifiche trattative

Le notifiche trattative non sono una collection separata: sono derivate da `transferNegotiations`. Da V246 il codice salva la lettura dell'esito nel documento trattativa; da V257 le Firebase Rules permettono al mittente di aggiornare solo i campi `outcomeSeenByFromUid`, `outcomeSeenByUid`, `outcomeSeenAtByFromUid` e `outcomeSeenMarkerByFromUid`. Il fallback `localStorage` resta attivo solo se le rules non sono ancora deployate o negano la scrittura.

## Nota V256 - Registro funzionalita incrementale

Il file `FUNZIONALITA'V240-255.md` documenta separatamente le funzionalita introdotte o consolidate nel ciclo V240-V255. Il documento principale `FUNZIONALITA'.md` resta invariato e va aggiornato solo su richiesta esplicita.

## Comandi standard test trattative V255

Il modulo `assets/js/dev/trade-notification-simulator-v255.js` installa `window.ZonaOrientaleTradeSimulatorV255` e mantiene alias V254. Le funzioni `help()` e `getTestCommands()` stampano i comandi standard; `runLocalSmokeTest()` esegue un ciclo locale senza scrivere in Firebase.

# Architettura e dati ZonaOrientale


## Simulatore notifiche trattative V254

Il modulo `assets/js/dev/trade-notification-simulator-v254.js` installa `window.ZonaOrientaleTradeSimulatorV254`. Le funzioni locali inseriscono righe simulate in `state.raw.transferNegotiations` e ridisegnano Dashboard Presidente/badge senza scrivere in Firebase. La funzione `createFirebaseSentProposal({ confirm: true })` puo' creare una proposta reale in `transferNegotiations` dal presidente corrente verso un'altra squadra per test end-to-end.

Stato: V254.

## Tipo applicazione

ZonaOrientale e' una webapp statica:

- HTML/CSS/JS puro;
- nessun build system;
- Firebase usato lato browser;
- dati pubblici pesanti serviti soprattutto da JSON statici.

Percorso in repo:

```text
static/zonaorientale/
```

## Entry point e pagine

```text
index.html          pagina principale / SPA con hash route
competition.html    pagina singola competizione
player.html         scheda giocatore
news.html           pagina comunicati/news
assets/app.js       bundle principale
assets/styles.css   CSS principale
```

## CSS principali

```text
assets/styles.css
assets/css/components-v130.css
assets/css/admin-v130.css
assets/css/transfer-market-v130.css
assets/css/competition-detail-v130.css
assets/css/mobile-suite-v168.css
assets/css/mobile-chrome-v223.css
```

La UI mobile e' stata stratificata da molte versioni: prima di cambiare un componente mobile controllare sia `styles.css` sia `mobile-suite-v168.css`. I vecchi `mobile-hotfix-v166.css` e `mobile-hotfix-v167.css` sono stati inglobati in `mobile-suite-v168.css` e in V252 sono marcati per rimozione dalla repo.

## Moduli JavaScript principali

Core:

```text
assets/js/core/state.js
assets/js/core/dom.js
assets/js/core/utils.js
assets/js/core/formatters.js
assets/js/core/ui.js
assets/js/core/constants.js
```

Data:

```text
assets/js/data/firestore-service.js
assets/js/data/static-files-service.js
assets/js/data/repository-v222.js
```

Domain:

```text
assets/js/domain/competitions.js
assets/js/domain/entities.js
assets/js/domain/fm-movements.js
assets/js/domain/labels.js
assets/js/domain/listone.js
assets/js/domain/matches.js
assets/js/domain/news.js
assets/js/domain/rosters.js
assets/js/domain/team-logos.js
```

Admin:

```text
assets/js/admin/admin-competitions.js
assets/js/admin/admin-users.js
assets/js/admin/listone-converter.js
assets/js/admin/public-snapshots.js
```

Mobile:

```text
assets/js/mobile/mobile-viewport.js
assets/js/mobile/mobile-chrome-v220.js
assets/js/mobile/mobile-scrollbar.js
assets/js/mobile/mobile-tables.js
assets/js/mobile/mobile-rosters.js
```

Refactor recenti:

```text
assets/js/refactor/live-data-archive-v209.js
assets/js/refactor/admin-communication-generator-v210.js
assets/js/refactor/historical-stats-compare-v211.js
assets/js/refactor/president-dashboard-rosters-v212.js
assets/js/refactor/admin-publication-workflow-v213.js
assets/js/refactor/public-admin-render-orchestrator-v221.js
```

## Repository dati V222

Da V222 esiste una facciata dati leggera:

```text
assets/js/data/repository-v222.js
```

Espone anche in browser:

```text
window.ZonaOrientaleDataRepository
```

Metodi principali:

```text
loadCollection(name)
loadCollections(names)
loadLeagueConfigFromFirebase()
loadStaticAssets()
loadPublicConfig(loadStaticPublicConfig, getDefaultSeasonIdFromRaw)
diagnose()
```

La V222 non cambia ancora il modello dati: centralizza solo le chiamate esistenti verso Firebase e file statici. I merge di snapshot, calendari statici, Archivio e render restano in `app.js` o nei moduli refactor gia presenti.

## Ordine di lettura dati pubblici

All'avvio pubblico il sito prova prima a leggere i file statici:

```text
1. assets/public/config.json
2. assets/snapshots/seasons/manifest.json
3. assets/snapshots/seasons/<stagione>.json
4. assets/snapshots/honor.json
5. assets/listoni/manifest.json + file listone
6. assets/rose/manifest.json + file rose
7. assets/competitions/manifest.json + competizioni statiche
```

Queste sono letture HTTP, quindi non consumano letture Firebase.

Se un JSON statico manca o non e' valido, il sito puo usare Firebase come fallback.

## `assets/public/config.json`

Contiene:

```text
- stagione corrente
- stagioni disponibili
- impostazioni pubbliche base
```

Se esiste ed e' valido, evita letture Firebase per `leagueSettings` e `seasons`.

## Snapshot stagione

Percorsi:

```text
assets/snapshots/seasons/manifest.json
assets/snapshots/seasons/2025-2026.json
```

Contengono dati pubblici della stagione:

```text
squadre
presidenti
stadi
competizioni
partite
risultati
rose
movimenti FM
news pubbliche
```

Fallback Firebase:

```text
publicSeasonSnapshots/{seasonId}
```

## Honor / Albo / Palmares / FIFA

Percorso statico:

```text
assets/snapshots/honor.json
```

Fallback Firebase:

```text
publicSnapshots/honor
```

## Listone

Percorsi:

```text
assets/listoni/manifest.json
assets/listoni/<file>.json
```

E' pensato come dato statico.

## Rose

Percorsi:

```text
assets/rose/manifest.json
assets/rose/<file>.json
```

Le rose pubbliche sono statiche. Dopo import Excel bisogna aggiornare anche gli snapshot stagione se i dati pubblici devono riflettere le nuove rose.

## Competizioni statiche

Percorsi:

```text
assets/competitions/manifest.json
assets/competitions/<stagione>/<competizione>.json
```

Usate per calendario/dettaglio competizioni quando disponibili.

## Firebase live/lazy

Firebase resta necessario per:

- comunicati/news live;
- trasferibili e trattative mercato;
- richieste e utenti presidente;
- admin completo;
- fallback snapshot quando manca JSON statico.

Il caricamento admin completo non deve partire per i visitatori pubblici: va avviato solo da Admin tramite `Carica dati amministrazione`.

## Classifica competizione di campionato

Formato visuale richiesto:

```text
POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT
```

Campi canonici consigliati:

```text
position
teamId
teamName
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

La resa pubblica deve supportare alias legacy per evitare regressioni su vecchi snapshot.

Da mobile la tabella non deve perdere colonne: usare scroll orizzontale, non conversione a card che nasconde dati.

## Hash route importanti

Questi hash sono pagine statiche/route note e non slug squadra:

```text
#stats
#archive
#compare
#competitions
#listone
#rosters
#admin
#market
```

In V218/V219 sono stati aggiunti `stats`, `archive`, `compare` alla logica degli hash statici.

## Catene di compatibilita da non rompere

Archivio:

```text
V193 helper stagioni
V196 helper archivio base
V204 snapshot stagione selezionata
V209 modulo live-data/archive
V218 renderAll richiama Archivio
V219 ripristino helper mancanti
```

Statistiche/Confronta:

```text
V193/V195 helper storici
V211 modulo historical-stats-compare
V218 installazione effettiva nel bootstrap
```

Dashboard Presidente/Rose:

```text
V192/V201 logiche storiche
V212 modulo president-dashboard-rosters
```

Admin pubblicazione:

```text
V190/V191/V203 logiche storiche inline
V213 modulo estratto ma disattivato in V214
```

## Orchestrazione rendering V221

Da V221 il ciclo base `renderAll()` e' organizzato tramite:

```text
assets/js/refactor/public-admin-render-orchestrator-v221.js
```

Il modulo riceve renderer gia definiti in `app.js` e li esegue in gruppi logici:

```text
publicRenderers
adminRenderers
afterRenderers
```

Questo e' un refactor strutturale, non funzionale: gli override storici continuano ad agganciarsi a `renderAll`, quindi non rimuovere il wrapper finale senza verificare Archivio, Statistiche e Confronta.

### CSS V223

`assets/css/mobile-chrome-v223.css` e' il primo estratto del cleanup CSS. Contiene esclusivamente regole globali di chrome mobile:

- pulsante `Su` globale `zo-scroll-top-v218`;
- nascondimento vecchi pulsanti `listone-scroll-top-v175` e `competition-scroll-top-v166`;
- guard desktop per bottom menu, sheet mobile e subnav mobile.

Non spostare altre regole in questo file senza test mobile/desktop.

## Note statistiche storiche V224

La pagina `#stats` usa `assets/js/refactor/historical-stats-compare-v211.js`. In V224 il modulo:

- esclude celle Albo di stato, per esempio `NON_DISPUTATA`, dai conteggi titoli/podi;
- pre-carica gli snapshot stagione statici mancanti tramite `loadStaticPublicSeasonSnapshotV172` per calcolare i presidenti vincenti su tutte le stagioni archiviate;
- non deve introdurre letture Firebase extra per le statistiche storiche pubbliche.



## Note stabilizzazione V225

V225 chiude il primo ciclo di refactor tecnico V220-V224 senza cambiare UI, dati o Firebase.

Nuovo modulo:

```text
assets/js/refactor/refactor-stability-v225.js
```

Il modulo esegue controlli runtime leggeri sui componenti estratti:

```text
V220 mobile chrome
V221 public/admin render orchestrator
V222 data repository facade
V224 historical stats hardening
V215/V218/V219 archive helpers
```

Il risultato viene esposto in:

```js
window.ZonaOrientaleRefactorStatus
```

Non blocca il bootstrap e non modifica il comportamento visibile: in caso di dipendenze mancanti produce solo un warning console.

## Note statistiche storiche V226

V226 rende piu robusto `assets/js/refactor/historical-stats-compare-v211.js`:

- `getHonorRows()` e `getFifaRows()` leggono lo snapshot honor normalizzato anche quando il JSON statico e' caricato come wrapper `{ snapshot: ... }`;
- se `state.publicHonorSnapshot` non contiene `honorRows`, il modulo usa `state.staticHonorSnapshotV173` prima di ricadere su `raw.honorRoll`;
- le celle Albo usano `label/teamName/name` dello snapshot come fallback primario per evitare nomi `-` nei ranking storici;
- Top FIFA Ranking mostra solo eventuali note reali, non la stringa generica `FIFA Ranking` per ogni squadra.

## Note Archivio FM V227

Le card `Archivio -> Squadre della stagione` non devono leggere solo `seasonTeams.fmBalance`, perche gli snapshot stagione storici/correnti possono non contenere quel campo.

La V227 calcola il saldo con priorita':

1. campi diretti su `seasonTeams` (`fmBalance`, `balance`, `remainingCredits`, ecc.);
2. snapshot statici delle rose in `assets/rose/*.json`, usando `remainingCredits`;
3. fallback sulla somma dei `fmMovements` della stagione.

Quando nessuna sorgente contiene il saldo, visualizzare `-`, non `0 FM`.


## Legacy V228 - Anteprime comunicati WhatsApp statiche

WhatsApp e gli altri crawler social non attendono il rendering JavaScript della webapp. Per questo i comunicati condivisibili usano pagine HTML statiche dedicate:

```text
static/zonaorientale/comunicati/<slug>.html
static/zonaorientale/news.html
```

Il modulo browser `assets/js/domain/news-share-v228.js` centralizza slug, URL e HTML preview. Il generatore Node `tools/generate-news-share-pages.mjs` legge `assets/snapshots/seasons/*.json`, genera una pagina per ogni comunicato e aggiorna `news.html` e i meta Open Graph della home sull'ultimo comunicato disponibile negli snapshot.

Da V231 il sito pubblico e l'Admin mostrano pulsanti `Copia link WhatsApp` che puntano all'endpoint dinamico `/zonaorientale/share/news/<id>`. Le pagine statiche in `comunicati/` restano legacy.



## Legacy V230 - Hotfix URL comunicati condivisibili statici

V230 corregge i link WhatsApp/preview che andavano in 404 per dominio errato. Le anteprime devono usare:

```text
https://silviobarra.com/zonaorientale/comunicati/<slug>.html
```

e non il vecchio host con `www`.

In runtime `app.js` calcola la base con `getNewsShareBaseUrlV230()` a partire dall'URL corrente, cosi' il pulsante `Copia link WhatsApp` usa lo stesso host da cui l'utente sta navigando. Il generatore statico usa invece default non-`www` e redirect relativi nelle pagine HTML generate.

## V229 - Pulsante account presidente

La landing usa ancora `#openLoginBtn` come controllo principale di accesso. Dopo V229, quando `state.currentTeamUser` e' un presidente approvato (`status: ACTIVE`), l'ultimo override di `updateUserVisibilityV34` sostituisce il testo generico `Account` con logo squadra + `Pres. Cognome` e intercetta il click in capture phase per aprire `#teamarea`/Dashboard Presidente.

Helper rilevanti in `assets/app.js`:

```text
getPresidentNameForAccountButtonV229
getPresidentSurnameForAccountButtonV229
renderPresidentAccountButtonContentV229
updatePresidentAccountButtonV229
openPresidentDashboardFromHeaderV229
```

CSS in `assets/styles.css`: blocco `V229 - Header account presidente`.

## V231 - Preview comunicati dinamica con Netlify Function

Da V231 i link WhatsApp dei comunicati non richiedono piu' pagine statiche generate in repo. Il link prodotto dal sito e':

```text
https://silviobarra.com/zonaorientale/share/news/<id-comunicato>
```

`netlify.toml` intercetta questo path e lo inoltra a:

```text
/.netlify/functions/news-share?id=<id-comunicato>
```

La funzione `netlify/functions/news-share.js` legge il documento `news/<id>` da Firestore tramite REST API pubblica, costruisce un HTML con tag Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) e poi reindirizza il browser alla news nella webapp (`/zonaorientale/#news-<id>`).

Questo sostituisce il flusso V228/V230 con `tools/generate-news-share-pages.mjs` e `comunicati/*.html`, che resta legacy ma non deve piu' essere usato per nuovi comunicati.


Nota V241: il flusso Accetta utenti conserva i rifiuti come `REJECTED` e filtra i duplicati di utenti gia approvati, evitando ricomparse non volute in Admin.


Nota V243: il comunicato avvenuto scambio usa un unico flusso canonico: form V243, scrittura in `teamRequests` con `TRANSFER_NEWS`, invio EmailJS immediato e pubblicazione in News solo dopo approvazione Admin. Gli handler legacy V50/V79 sono neutralizzati per evitare doppie azioni.

Nota V245: in Admin -> Richieste presidenti, i documenti `teamRequests` relativi a comunicati approvati o rifiutati possono essere eliminati definitivamente da Firebase con il pulsante `Elimina da Firebase`. La cancellazione e' limitata a richieste comunicato in stato `APPROVED`/`ACCEPTED` o `REJECTED`; una eventuale news gia' pubblicata resta nella raccolta `news`.


Nota V246: le notifiche di esito trattativa usano come stato canonico i campi nel documento `transferNegotiations/{id}`: `outcomeSeenByFromUid`, `outcomeSeenAtByFromUid`, `outcomeSeenMarkerByFromUid` e `outcomeSeenByUid`. Il vecchio `localStorage` resta solo fallback locale in caso di permessi Firebase insufficienti.


## Nota V247

Aggiunto `REGRESSION_TESTS.md` come checklist di regressione. Non cambia architettura runtime, sorgenti dati o schema Firebase.

## Nota V248

Aggiunto guard runtime per neutralizzare vecchi handler comunicato scambio V50/V79/V237. Il flusso canonico resta `teamRequests/TRANSFER_NEWS` + EmailJS + approvazione Admin.


### Admin Richieste presidenti V249

Il pannello `Admin -> Richieste presidenti` e' consolidato in un render canonico V249. Il flusso supporta refresh esplicito da Firebase, approvazione/rifiuto delle richieste pendenti e cancellazione da `teamRequests/{id}` dei soli comunicati approvati o rifiutati.


### Admin Generatore comunicati automatici V250

Il generatore comunicati automatici e' installato in V250 dal modulo `assets/js/refactor/admin-communication-generator-v210.js?v=250`. Il pannello compare in area Admin e usa i dati gia' caricati in `state.raw` per preparare bozze di comunicato su risultati, vincitori, mercato, focus squadra, Albo/Palmares e aggiornamenti dati pubblici.

Il generatore non effettua scritture Firebase: permette di copiare la bozza oppure inserirla nel form `Admin -> Comunicati`, dove l'admin puo' revisionare e salvare manualmente. Diagnostica runtime: `window.ZonaOrientaleCommunicationGeneratorV250`.

### Workflow pubblicazione Admin V251

In V251 il workflow pubblicazione inline V190/V191/V203 viene consolidato come versione canonica. Il modulo esterno `assets/js/refactor/admin-publication-workflow-v213.js` resta non importato per evitare doppi listener; il workflow canonico espone in Admin:

- `Stato Firebase / JSON`: semafori per asset statici, promemoria pendenti, modalita admin e letture Firebase stimate;
- `Procedura guidata Pubblica aggiornamenti`: checklist operativa con promemoria, preflight e comandi Git copiabili.

Il workflow non effettua scritture Firebase e non modifica dati: lavora su sessionStorage/localStorage, helper di preflight pubblici e stato runtime. In V251 sono stati aggiornati i comandi del wizard rimuovendo riferimenti a branch storici. Diagnostica runtime: `window.ZonaOrientalePublicationWorkflowV251`, `window.ZonaOrientalePublicationStatus`, `window.ZonaOrientalePublishWizard`.
## Pulizia asset V252

La V252 non cambia il comportamento runtime del sito. Introduce una pulizia controllata per evitare che file locali o legacy entrino nella repo:

- `.DS_Store`, `__MACOSX` e file AppleDouble `._*` sono ignorati da `static/zonaorientale/.gitignore`;
- `assets/css/mobile-hotfix-v166.css` e `assets/css/mobile-hotfix-v167.css` sono candidati alla rimozione, perche non linkati dagli HTML e gia inglobati in `assets/css/mobile-suite-v168.css`;
- la diagnostica `window.ZonaOrientaleCleanupV252` conferma che la release e' di solo cleanup.



## Modulo Admin Richieste presidenti V253

Da V253 il pannello `Admin -> Richieste presidenti` ha un modulo dedicato:

```text
assets/js/admin/team-requests-panel-v253.js
```

Il modulo installa il render/handler canonico del pannello e mantiene il blocco inline V249 come fallback. La diagnostica runtime e' `window.ZonaOrientaleTeamRequestsV253`. Il modulo preserva le azioni esistenti: refresh da Firebase, approvazione, rifiuto ed eliminazione da Firebase dei comunicati gia approvati o rifiutati.
