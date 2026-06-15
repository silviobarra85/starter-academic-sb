## Nota architetturale V446 - Percorsi dati statici parametrizzati

- V446 aggiunge `dataPaths` in `static/zonaorientale/assets/league-config.json` per config pubblica, snapshot stagioni, honor snapshot, listoni, rose, competizioni, loghi e calciomercato.
- I reader pubblici risolvono i path da config con fallback identici ai percorsi ZonaOrientale storici: non cambia il contenuto letto e non nasce ancora una seconda cartella lega.
- Firebase, Admin, generator snapshot, Area Squadra presidenti, Bilanci mobile V438 e badge dispositivo V434 restano invariati.
- Il clone `FantaPetilloMantraManager` puo' essere valutato dalla V447 come sandbox, preferibilmente con Firebase separato e dati minimi.

## Nota architetturale V445 - Presentazione parametrica senza refactor dati

- V445 sposta su config solo il layer di presentazione: metadata, titoli runtime, footer, menu mobile Altro e base URL share.
- I path dati (`assets/public`, `assets/snapshots`, `assets/listoni`, `assets/rose`, `assets/competitions`, `assets/logos`) restano invariati e saranno affrontati in una patch successiva.
- Firebase resta completamente invariato: nessun cambio a bootstrap, collezioni, utenti, Admin, Area Squadra, movimenti FM o snapshot generator.
- Il clone `FantaPetilloMantraManager` resta pianificato ma non viene ancora creato: prima bisogna parametrizzare i path dati e decidere Firebase separato.

## Nota architetturale V444 - Mappa hard-coded prima del refactor multi-lega

- V444 non sposta logiche e non rinomina namespace runtime: e' una patch di inventario.
- La baseline `tools/hardcoded-league-refs-v444.json` fotografa dove sono ancora presenti riferimenti a `zonaorientale`, `ZonaOrientale`, URL pubblici, path share/news, landing `bilanci.html`, path `assets/logos` e guardrail `DEPLOY_EXPECTED_VERSION`.
- La distinzione importante e':
  - branding e metadata pubblici potranno passare a `assets/league-config.json` in V445;
  - path dati statici e loghi potranno passare a config in V446;
  - namespace runtime `ZonaOrientale*` vanno mantenuti finche' il clone sandbox non e' pronto, per non staccare funzioni storiche;
  - Netlify `news-share` e redirect richiedono una parametrizzazione dedicata, idealmente dopo metadata/share.
- La futura lega `FantaPetilloMantraManager` non deve ancora avere una cartella: prima bisogna ridurre i riferimenti hard-coded ad alto impatto.

## Nota architetturale V443 - Primo layer configurazione lega

- `assets/league-config.json` e' un layer descrittivo/additivo: non sostituisce ancora i loader dati esistenti e non cambia il modello dati.
- Il sito resta `static-first`: dati statici, snapshot pubblici e Firebase mantengono gli stessi percorsi e le stesse collection di prima.
- Il loader `assets/js/core/league-config-v443.js` non importa Firebase e non esegue letture/scritture: effettua solo fetch del JSON locale e pubblica una config normalizzata con fallback.
- Per ora la config e' usata solo in un punto a basso rischio, il link WhatsApp Bilanci, e sempre con fallback hard-coded storico.
- Il clone `FantaPetilloMantraManager` non va creato finche' non sono completate le prossime fasi di audit hard-coded, metadata/share e path dati statici.

## Nota architetturale V440 - Link Bilanci senza nuovi dati

- V440 non introduce nuove fonti dati: i Bilanci continuano a leggere solo `assets/snapshots/seasons/*.json`, campo `fmMovements`.
- `bilanci.html` e' una landing statica solo per anteprima social/WhatsApp e redirect alla sezione `#bilanci`; non legge ne' scrive Firebase.
- Nessuna modifica a snapshot generator, Admin, collection Firebase o dataset paralleli.

## Nota architetturale V438 - Bilanci resta vista da snapshot

- V438 e' solo una correzione UI della sezione Bilanci: non introduce collection, non crea file `assets/bilanci` e non scrive su Firebase.
- La fonte dei dati resta `assets/snapshots/seasons/*.json`, campo `fmMovements`.

## Nota architetturale V437 - Bilanci invariati come vista da snapshot

- V437 cambia solo UI/test della sezione Bilanci: nessuna nuova collection, nessun file `assets/bilanci`, nessuna scrittura Firebase.
- La fonte dati resta `assets/snapshots/seasons/*.json`, campo `fmMovements`; viene solo rimossa l'indicazione tecnica visibile all'utente.

## Nota architetturale V436 - Editing ledger FM

- V436 non aggiunge collection e non cambia la struttura dati: resta centrale la collection Firebase `fmMovements`.
- Il pannello Admin consente ora anche `updateDoc` sui movimenti esistenti.
- Per non introdurre effetti collaterali distruttivi, l'editing aggiorna il record del movimento ma non prova a ricostruire automaticamente tutti gli effetti pregressi sulla rosa.
- I nuovi movimenti mantengono invece il comportamento precedente: inserimento del movimento e side effect su `rosterEntries` quando previsto.
- Dopo modifiche operative a movimenti/budget resta necessario rigenerare gli snapshot pubblici e pubblicare i JSON statici.

## Nota architetturale V435 - Bilanci derivati dagli snapshot

- V435 non aggiunge collection Firebase e non introduce un dataset parallelo `assets/bilanci`.
- La sezione Bilanci e' una vista static-first e solo-lettura che carica `assets/snapshots/seasons/manifest.json` e i JSON stagione in `assets/snapshots/seasons/*.json`.
- I dati economici vengono derivati da `fmMovements`; per renderli permanenti resta necessario il workflow gia' previsto: Admin -> Snapshot pubblici -> Aggiorna tutto -> scarica overlay snapshot stagioni -> commit/push.
- Le sezioni Admin Rose e Movimenti FM continuano a essere la fonte operativa di scrittura; Bilanci e' solo consultazione pubblica.

## Nota architetturale V434 - Rilevazione dispositivo locale

- V434 aggiunge solo asset statici `device-badge-v434.css/js` e marker runtime in `app.js`.
- La rilevazione dispositivo avviene interamente nel browser, senza chiamate Firebase, Netlify Functions o servizi esterni.
- User-Agent Client Hints puo' restituire il modello su alcuni browser Android/Chromium; iOS/Safari espongono normalmente solo famiglia dispositivo.

## Nota architetturale V433 - Solo DOM/CSS mobile

- V433 non modifica Firebase, auth, permessi, snapshot, Netlify Functions, Soccer Data o sorgenti dati.
- La card Notifiche presidente V370 viene nascosta solo da mobile tramite classe/attributo, non rimossa dal modello dati.
- I form canonici `teamTransferCommunicationFormV242` e `teamPlayerReleaseFormV261` restano agganciati agli stessi handler.

## Nota architetturale V432 - Nessuna modifica dati

- V432 e' una patch DOM/CSS mobile: non modifica Firebase, auth, permessi, snapshot, Netlify Functions, Soccer Data o sorgenti dati.
- I form canonici restano `teamTransferCommunicationFormV242` e `teamPlayerReleaseFormV261`; vengono solo racchiusi in pannelli collassabili da mobile.
- Gli handler esistenti di Dashboard Presidente V369, Notifiche V370, comunicato scambio V242 e svincolo V261 restano preservati.

## Nota architetturale V431 - Solo layout Area Squadra

- V431 non modifica Firebase, regole, snapshot, Soccer Data, Netlify Functions o sorgenti dati.
- L'intervento aggiunge solo un helper DOM di ordinamento mobile e regole CSS per compattare Area Squadra.
- Gli id dei form e i listener esistenti restano invariati: `teamNewsRequestForm`, `tradeProposalForm`, pannelli trattative e pulsanti Dashboard/Notifiche.

## Nota architetturale V429 - Solo layout mobile Admin

- Nessuna modifica a Firebase, regole, snapshot, feed, Soccer Data, Netlify Functions o sorgenti dati.
- V429 interviene solo su CSS mobile e label UI dei pannelli Admin collassabili.
- I guardrail dati/runtime V407-V428 restano invariati.

## Nota architetturale V428 - Nessuna variazione dati/runtime

- Nessuna modifica a Firebase, regole, snapshot, feed Calciomercato, Soccer Data, Netlify Functions o sorgenti dati.
- V428 aggiunge solo un marker runtime e un audit di pre-merge.
- La rimozione Soccer Data dal runtime resta protetta dai gate precedenti; gli audit storici Soccer Data restano advisory.

## Nota architetturale V427 - Soccer Data storico fuori gate runtime

- Nessuna modifica a Firebase, Soccer Data, snapshot, feed o Netlify Functions.
- Gli audit storici Soccer Data V371-V382 mancanti vengono trattati come storico documentale/advisory perche' Soccer Data e' stata rimossa dal runtime in V398.
- Il controllo attivo resta la rimozione Soccer Data e la preservazione dei dati runtime correnti.

## Nota architetturale V426 - Guardrail finale mobile

- Nessuna modifica a Firebase, regole, dati, snapshot, feed Calciomercato, Soccer Data o Netlify Functions.
- La patch aggiunge solo un marker runtime e audit di checklist finale.
- La scala tipografica V420-V425 rimane il riferimento; V426 non cambia renderer o sorgenti dati.

---

# Architettura, dati, Firebase e Soccer Data

## Nota architetturale V424 - Scala mobile CSS-only sulle sezioni residue

- Nessuna modifica a Firebase, regole, dati, snapshot, feed Calciomercato, Soccer Data o Netlify Functions.
- La patch e' CSS-only per il comportamento runtime, con marker `ZonaOrientaleMobileTypographyV424` per audit/tracciabilita'.
- Gli ID DOM e i renderer di News, Competizioni, Honor, Clubs e Fantamercato restano invariati; la compattezza deriva da regole CSS in `assets/css/refactor/mobile-controls.css`.

---


## Nota architetturale V423 - Tipografia mobile CSS-only

- Nessuna modifica a Firebase, regole, dati, snapshot, feed Calciomercato, Soccer Data o Netlify Functions.
- La patch e' CSS-only per il comportamento runtime, con marker `ZonaOrientaleMobileTypographyV423` per audit/tracciabilita'.
- Gli ID DOM e i renderer di Confronta, Statistiche e Rosa restano invariati; la compattezza deriva da regole CSS in `assets/css/refactor/mobile-controls.css`.

---


## Nota architetturale V422 - Timeline Archivio e refresh live

- Nessuna nuova collezione, nessuna modifica alle regole Firebase e nessun cambio al modello dati.
- `renderSeasonArchiveTimelineV196` e' stato aggiornato con `getSeasonArchiveTimelineNewsV422`: sorgente primaria `getVisibleNewsForSeasonV79(4)`, merge con `archive.news`, deduplica e ordinamento temporale.
- `assets/js/refactor/live-data-archive-v209.js` richiama il render dell'Archivio dopo il refresh live dei comunicati quando l'utente e' nella pagina `archive`.
- Questo evita che Archivio Stagioni resti ai 3 comunicati dello snapshot statico se dashboard/comunicati hanno gia' 4 comunicati runtime.
- La card duplicata `Albo della stagione` viene rimossa dal renderer live, mantenendo le informazioni vincitore dentro `Competizioni`.

---


## Nota architetturale V421 - Merge comunicati Archivio

- Nessuna nuova lettura Firebase e nessun cambio alle regole dati.
- `buildSeasonArchiveV196` usa ora `getSeasonArchiveMergedNewsV421(snapshot, seasonId)` per comporre i comunicati dell'Archivio Stagioni.
- La funzione fonde `snapshot.news` e `state.raw.news`, filtra per stagione quando `seasonId` e' presente, deduplica per id/slug/link/titolo+data e ordina dal piu' recente.
- Obiettivo: evitare che la Timeline dati perda l'ultimo comunicato quando lo snapshot statico contiene meno news rispetto alla dashboard.

---

## Nota architetturale V420 - Scala mobile CSS

- Nessuna modifica a Firebase, regole, dati, snapshot, feed Calciomercato, Soccer Data o Netlify Functions.
- La modifica e' presentazionale: aggiunge variabili CSS V420 in `assets/css/refactor/mobile-controls.css` e un marker runtime `ZonaOrientaleMobileTypographyV420` per audit/tracciabilita.
- Nessun nuovo fetch, nessuna nuova dipendenza e nessun cambio agli ID DOM usati dalle funzioni esistenti.

---


## Nota architetturale V418

- Nessuna modifica a Firebase, regole, dati, snapshot, feed Calciomercato, Soccer Data o Netlify Functions.
- La patch agisce solo sul layer CSS mobile e aggiunge un marker runtime `ZonaOrientaleMobileAccessibilityV418` per audit e tracciabilita.
- Non vengono introdotti nuovi moduli dati, nuove chiamate di rete o cambiamenti agli ID DOM usati dalle funzioni esistenti.

---

## Nota architetturale V417

- Nessuna modifica a Firebase, regole, snapshot, dati, feed Calciomercato, Soccer Data, Netlify Functions o struttura delle collezioni.
- La pulizia riguarda solo asset CSS non runtime e controlli di coerenza dei riferimenti locali.
- I file CSS stabili restano gli unici collegati dal runtime; i riferimenti storici in `assets/app.js` restano come metadata di audit/rollback, non come import attivi.

---


## Nota architetturale V416

- Nessuna modifica a Firebase, regole, dati, snapshot, Netlify Functions, import Excel, feed Calciomercato o Soccer Data.
- La patch agisce solo su CSS mobile, audit, versionamento runtime/cache-buster e documentazione.
- Gli ID DOM e i workflow admin restano invariati: la modifica riguarda solo densita visiva, overflow e leggibilita mobile.

---

## Nota architetturale V415

- Nessuna modifica a Firebase, regole, dati, snapshot, Netlify Functions, feed Calciomercato o Soccer Data.
- La patch aggiunge solo un post-processing UI in `assets/app.js` per riordinare la card Comunicati mobile e applicare classi CSS alla tabella Rosa della pagina squadra.
- Le colonne della rosa restano quelle esistenti; il rendering dati non viene cambiato.

---

---

## Nota architetturale V414

- Nessuna modifica a Firebase, regole, dati, snapshot, Netlify Functions, feed Calciomercato o Soccer Data.
- La patch agisce solo su CSS mobile, audit, versionamento runtime/cache-buster e documentazione.
- Gli ID DOM e i form dell'Area Squadra restano invariati: `teamFmRequestForm`, `teamMarketRequestForm`, `teamNewsRequestForm`.

---

## Nota architetturale V413

- Nessuna modifica a Firebase, regole, dati, snapshot, Netlify Functions, feed Calciomercato o Soccer Data.
- La patch agisce solo su CSS mobile, audit, versionamento runtime/cache-buster e documentazione.
- I filtri Listone e Calciomercato mantengono gli stessi ID DOM e le stesse logiche JS esistenti.

---

## Nota architetturale V412

- Nessuna modifica a Firebase, regole, dati, snapshot, Netlify Functions, feed Calciomercato o Soccer Data.
- La patch agisce solo su CSS mobile del menu Altro, audit, versionamento runtime e documentazione.



## Nota architetturale V411

- Nessuna modifica a Firebase, regole, dati, snapshot, Netlify Functions, feed Calciomercato o Soccer Data.
- La patch agisce solo su CSS mobile della dashboard, audit, versionamento runtime e documentazione.


## Nota architetturale V410

- Nessuna modifica a Firebase, regole, dati, snapshot, Netlify Functions, feed Calciomercato o Soccer Data.
- La patch agisce solo su CSS mobile, audit, versionamento runtime e documentazione.


---

## Nota architetturale V409

- Nessuna modifica a Firebase, regole, dati, snapshot, Netlify Functions o Soccer Data.
- La patch V409 agisce solo su presentazione mobile CSS, audit e versionamento runtime.


---

## Nota architetturale V406

- Nessuna modifica a Firebase, regole, storage dati, snapshot pubblici o integrazioni Netlify.
- I moduli sezione stabili V402-V405 vengono mantenuti come dipendenze runtime, ma la versione deploy e V406.
- Soccer Data resta nello stato corrente documentato: nessuna reintroduzione nella UI.


Contiene architettura, modelli dati, regole Firebase, asset dati e storico Soccer Data/API Football.

> Documento generato da accorpamento per categoria. I contenuti originali sono riportati integralmente sotto il rispettivo percorso originale.

File originali accorpati: **54**.

## Indice dei file originali in questa categoria

- `ARCHITETTURA_E_DATI.md`
- `audit/SOCCER_DATA_ASSOCIAZIONE_FBREF_V385.md`
- `audit/SOCCER_DATA_FBREF_BATCH_01_MATRIX_V373.md`
- `audit/SOCCER_DATA_FBREF_BATCH_02_MATRIX_V374.md`
- `audit/SOCCER_DATA_FBREF_BATCH_03_MATRIX_V375.md`
- `audit/SOCCER_DATA_FBREF_BATCH_04_MATRIX_V376.md`
- `audit/SOCCER_DATA_FBREF_BATCH_05_MATRIX_V377.md`
- `audit/SOCCER_DATA_FBREF_BATCH_06_MATRIX_V378.md`
- `audit/SOCCER_DATA_FBREF_BATCH_07_MATRIX_V379.md`
- `audit/SOCCER_DATA_FBREF_BATCH_08_MATRIX_V380.md`
- `audit/SOCCER_DATA_FBREF_BATCH_09_MATRIX_V381.md`
- `audit/SOCCER_DATA_FBREF_BATCH_10_MATRIX_V382.md`
- `audit/SOCCER_DATA_FBREF_BATCH_11_MATRIX_V383.md`
- `audit/SOCCER_DATA_MAPPING_MATRIX_V372.md`
- `audit/SOCCER_DATA_MATRIX_V371.md`
- `firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules`
- `firebase/FIREBASE_RULES_PATCH_V393_SOCCER_DATA_STATS.rules`
- `firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules`
- `firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V393.rules`
- `HANDOFF_V393_SOCCER_DATA_FIREBASE_RULES_FALLBACK.md`
- `HANDOFF_V394_SOCCER_DATA_API_FOOTBALL.md`
- `HANDOFF_V395_SOCCER_DATA_API_FOOTBALL_MAPPING.md`
- `HANDOFF_V396_SOCCER_DATA_API_FOOTBALL_SQUADS_MAPPING.md`
- `HANDOFF_V398_SOCCER_DATA_REMOVED.md`
- `release/RELEASE_V371_SOCCER_DATA_PROTETTO.md`
- `release/RELEASE_V372_SOCCER_DATA_MAPPING_ASSISTITO.md`
- `release/RELEASE_V373_SOCCER_DATA_FBREF_BATCH_01.md`
- `release/RELEASE_V374_SOCCER_DATA_FBREF_BATCH_02.md`
- `release/RELEASE_V375_SOCCER_DATA_FBREF_BATCH_03.md`
- `release/RELEASE_V376_SOCCER_DATA_FBREF_BATCH_04.md`
- `release/RELEASE_V377_SOCCER_DATA_FBREF_BATCH_05.md`
- `release/RELEASE_V378_SOCCER_DATA_FBREF_BATCH_06.md`
- `release/RELEASE_V379_SOCCER_DATA_FBREF_BATCH_07.md`
- `release/RELEASE_V380_SOCCER_DATA_FBREF_BATCH_08.md`
- `release/RELEASE_V381_SOCCER_DATA_FBREF_BATCH_09.md`
- `release/RELEASE_V382_SOCCER_DATA_FBREF_BATCH_10.md`
- `release/RELEASE_V385_SOCCER_DATA_ASSOCIAZIONE_FBREF.md`
- `release/RELEASE_V389_SOCCER_DATA_ASSETS_CLEANUP.md`
- `SOCCER_DATA_API_FOOTBALL_V397.md`
- `test/SOCCER_DATA_API_FOOTBALL_SQUADS_MAPPING_V396.md`
- `test/SOCCER_DATA_ASSETS_CLEANUP_V389.md`
- `test/SOCCER_DATA_FBREF_BATCH_01_V373.md`
- `test/SOCCER_DATA_FBREF_BATCH_02_V374.md`
- `test/SOCCER_DATA_FBREF_BATCH_03_V375.md`
- `test/SOCCER_DATA_FBREF_BATCH_04_V376.md`
- `test/SOCCER_DATA_FBREF_BATCH_05_V377.md`
- `test/SOCCER_DATA_FBREF_BATCH_06_V378.md`
- `test/SOCCER_DATA_FBREF_BATCH_07_V379.md`
- `test/SOCCER_DATA_FBREF_BATCH_08_V380.md`
- `test/SOCCER_DATA_FBREF_BATCH_09_V381.md`
- `test/SOCCER_DATA_FBREF_BATCH_10_V382.md`
- `test/SOCCER_DATA_MAPPING_V372.md`
- `test/SOCCER_DATA_STATIC_STATS_TEMPLATE_V390.md`
- `test/SOCCER_DATA_V371.md`

---

## 1. `ARCHITETTURA_E_DATI.md`

- Percorso originale: `ARCHITETTURA_E_DATI.md`
- Dimensione originale: 7519 byte
- SHA-256: `e52c2f09fa96e794e34345b41fb6d9303e5ef5a7ea73b592449aa97de26d325a`

````markdown
# Architettura e dati - ZonaOrientale

## Struttura runtime

Il sito vive principalmente in:

```text
static/zonaorientale/
```

File e cartelle principali:

```text
index.html
competition.html
news.html
player.html
comunicati/
assets/app.js
assets/js/core/section-registry-v403.js
assets/js/core/section-registry-v402.js
assets/js/core/section-registry-v401.js  # legacy/compatibilita se presente
assets/js/sections/regolamento-section-v402.js
assets/js/sections/compare-section-v403.js
assets/css/
assets/js/
assets/listoni/
assets/rose/
assets/snapshots/
assets/news/
```

Le funzioni server-side Netlify vivono in:

```text
netlify/functions/
```

La configurazione Netlify sta in:

```text
netlify.toml
```

## Shell e sezioni

`index.html` resta la shell principale dell'app. Le sezioni attive sono ancora contenute nella shell tramite `data-page`.

Da V405 il refactor modulare ha due livelli:

1. registry centrale delle sezioni;
2. template di sezioni estratti in moduli dedicati (`regolamento`, `compare`).

Il registry corrente e:

```text
assets/js/core/section-registry-v403.js
assets/js/core/section-registry-v402.js
assets/js/core/section-registry-v401.js  # legacy/compatibilita se presente
assets/js/sections/regolamento-section-v402.js
assets/js/sections/compare-section-v403.js
```

Espone:

```text
window.ZonaOrientaleSectionRegistryV405
window.ZonaOrientaleSectionRegistryV404
window.ZonaOrientaleSectionRegistryV403
window.ZonaOrientaleSectionRegistryV402
window.ZonaOrientaleSectionRegistryV401  # alias compatibilita
```

con elenco pagine e metadati:

- `dashboard`
- `news`
- `clubs`
- `fantamercato`
- `calciomercato`
- `listone`
- `competitions`
- `honor`
- `stats`
- `archive`
- `compare`
- `regolamento`
- `admin`
- `teamarea`
- `teamprofile`

Il registry contiene anche `removedPages.soccerdata` con fallback al Listone.

Scopo V404: proseguire lo spostamento controllato dei template. Dopo Regolamento e Confronta, anche Statistiche storiche viene estratta in modulo dedicato mantenendo invariati ID DOM, routing e logica esistente. Il comportamento pubblico resta invariato. V404 aggiunge anche una colorazione tenue delle righe giocatore basata sul ruolo, applicata da CSS/helper senza modificare i dati.

## Sezioni gia estratte

### Archivio stagioni - V405

Template estratto in:

```text
assets/js/sections/archive-section-v405.js
```

`index.html` mantiene solo:

```html
<section class="app-page" data-page="archive" data-section-template="archive-v405">
```

ID conservati per non scollegare la logica esistente in `assets/app.js`:

```text
archiveTitle
seasonArchiveControlsV196
seasonArchiveContentV196
```

La logica di caricamento archivio resta in `assets/app.js`; V405 sposta solo il template.

### Statistiche storiche - V404

- Host in `index.html`: `data-page="stats" data-section-template="stats-v404"`.
- Template completo: `assets/js/sections/stats-section-v404.js`.
- Registry: `stats.source = assets/js/sections/stats-section-v404.js`.
- ID preservati: `statsTitle`, `historicalStatsSummaryV193`, `historicalStatsContentV193`.
- Logica dati/render storica: resta in `assets/app.js`, senza nuove letture Firebase.

### Colori ruolo giocatore - V404

`assets/app.js` espone `window.ZonaOrientaleRoleBackgroundsV404` e applica classi non distruttive alle righe delle tabelle giocatori:

- `player-role-gk`: portieri, sfondo arancione tenue;
- `player-role-def`: difensori, sfondo verde chiaro;
- `player-role-mid`: centrocampisti, sfondo azzurro/blu tenue;
- `player-role-fwd`: attaccanti, sfondo rosso tenue.

La logica legge celle con `data-label="Ruolo"`, `data-label="R (RM)"`, `.listone-col-classicRole`, `.roster-col-role`, `.team-profile-role-cell` o `data-player-role`. Non cambia contenuti, ordinamenti o dati.

### Confronta - V403

La sezione `compare` e stata estratta da `index.html` in:

```text
assets/js/sections/compare-section-v403.js
```

`index.html` contiene solo l'host:

```html
<section class="app-page" data-page="compare" aria-label="Confronta squadre" data-section-template="compare-v403">
```

Il modulo conserva gli ID runtime:

```text
teamCompareControlsV195
teamCompareContentV195
compareTitle
```

La logica di confronto squadre resta in `assets/app.js`; V403 sposta solo il template.

### Regolamento - V402

- Host shell: `index.html`, sezione `data-page="regolamento"`.
- Template: `assets/js/sections/regolamento-section-v402.js`.
- Dati/Firebase: nessuno.
- Rischio funzionale: basso, testo statico.
- Test dedicato: `tools/audit-regolamento-section-v402.mjs`.

## Strategia refactor consigliata

Ordine prudente:

1. Mantenere `index.html` come shell.
2. Spostare prima solo metadati/registry.
3. Estrarre una sezione semplice in `assets/js/sections/...`.
4. Solo dopo valutare template HTML o pagine dedicate per sezioni specifiche.
5. Admin va spacchettato per ultimo o per pannelli isolati, non in un unico batch.

Non fare subito una pagina HTML separata per ogni sezione: rischia di duplicare auth, navbar, mobile nav, Firebase init e snapshot.

## Firebase

Firebase e usato per dati dinamici/admin/presidenti/trattative, con snapshot statici pubblici come fallback/lettura pubblica.

Collections principali:

```text
admins
pendingUsers
teamUsers
teamRequests
publicSeasonSnapshots
publicSnapshots
publicTeamSnapshots
transferListings
transferNegotiations
leagueSettings
seasons
presidents
teams
seasonTeams
stadiums
competitions
competitionMatches
competitionResults
honorRoll
fifaRankings
rosterEntries
fmMovements
news
```

## Snapshot statici

Il sito usa dati statici pubblicati nella repo per ridurre dipendenze runtime da Firebase e rendere stabile la lettura pubblica.

Flusso generale:

```text
Admin/Firebase
  -> Snapshot pubblici
  -> Download JSON/overlay
  -> Commit in repo
  -> Deploy Netlify
  -> Lettura pubblica statica
```

## Comunicati

Per pubblicare un comunicato in modo stabile:

1. Creare/salvare o approvare il comunicato in Admin.
2. Aggiornare snapshot comunicati/pubblici.
3. Scaricare snapshot/overlay.
4. Applicare alla repo.
5. Commit e push su `master` per produzione.

## Netlify Functions

Le funzioni Netlify servono per logiche server-side specifiche. In locale con `python3 -m http.server` non vengono eseguite. Per testarle serve Netlify Dev o deploy online.

## Soccer Data

Stato corrente: rimossa in V398.

Motivo:

- FBref non e sostenibile come fonte automatica per blocchi/fragilita scraping.
- API-Football Free non consente stagione corrente utile.
- L'utente ha scelto di eliminare la sezione.

In V401 il registry ne conserva solo lo stato di pagina rimossa con fallback a `listone`. Riferimenti e tentativi storici sono nei file `STORICO_*`, ma non vanno considerati runtime attivo.

## Documentazione

Da V400 i documenti storici sono accorpati. Da V401-V405 ogni modifica runtime/refactor deve aggiornare i canonici e gli storici tematici rilevanti. Non creare nuovi file per ogni micro-release salvo richiesta esplicita.


## Colori ruolo giocatore V405r2

La colorazione delle righe giocatore e gestita da due asset dedicati caricati da `index.html`:

```text
assets/role-backgrounds-v405r2.css
assets/role-backgrounds-v405r2.js
```

Il CSS conserva la palette V404/V405 originale. Il JS scansiona le righe delle tabelle, riconosce il ruolo da celle `Ruolo`, `R (RM)`, classi storiche e attributi `data-*`, poi applica classi legacy `player-role-*` e classi V405r2 `zo-role-bg-v405r2-*`.

La feature non modifica dati, Firebase, auth, admin o navigazione mobile.
````

---

## 2. `audit/SOCCER_DATA_ASSOCIAZIONE_FBREF_V385.md`

- Percorso originale: `audit/SOCCER_DATA_ASSOCIAZIONE_FBREF_V385.md`
- Dimensione originale: 759 byte
- SHA-256: `680409dd533e4ef3cef1ab295290c2ea1d6203d8cf539aaca64a7dfda0cd8d14`

````markdown
# Audit V385 - Soccer Data associazione FBref locale

## Controlli coperti

- Runtime allineato a V385.
- Mapping corrente ancora `fbref-player-map.v383.json`.
- Manifest invariato: no Firebase writes e no live scraping.
- Tabella Soccer Data senza colonna `Azione` separata.
- Mini flusso sui soli giocatori da associare/needs-review.
- Campi link FBref e nome FBref opzionale presenti.
- Azioni `Prepara mapping`, `Copia patch`, `Rimuovi patch`, `Copia patch FBref`, `Scarica patch FBref` presenti.
- Patch JSON esportabile con metadata di sicurezza.
- Nessun file mapping V385 creato automaticamente.

## Gate

```bash
node tools/audit-soccer-data-association-patch-v385.mjs
node tools/audit-soccer-data-fbref-batch-v383.mjs
node --check assets/app.js
```
````

---

## 3. `audit/SOCCER_DATA_FBREF_BATCH_01_MATRIX_V373.md`

- Percorso originale: `audit/SOCCER_DATA_FBREF_BATCH_01_MATRIX_V373.md`
- Dimensione originale: 783 byte
- SHA-256: `d96712de232c7222ecc1c34c441e74f4d6f018abc6d17c517e13fb2bc0ebf1c0`

````markdown
# Soccer Data FBref batch-01 matrix V373

## Vincoli

| Controllo | Esito |
|---|---|
| Solo `IN_LISTONE` | OK |
| Asteriscati esclusi | OK |
| 532 giocatori nel mapping | OK |
| 50 mapping confermati batch-01 | OK |
| Nessuno scraping live | OK |
| Nessuna scrittura Firebase | OK |
| Funzionalita esistenti preservate | OK |

## Gate automatico

Script:

```bash
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v373.mjs
```

Il gate fallisce se:

- il manifest non punta a `fbref-player-map.v373.json`;
- il mapping non contiene 532 record;
- entra un giocatore non `IN_LISTONE`;
- i confermati V373 non sono esattamente 50;
- un confermato non ha `fbrefId`, `fbrefName`, `fbrefUrl` coerenti;
- manca il marker runtime `window.ZonaOrientaleSoccerDataFbrefBatchV373`.
````

---

## 4. `audit/SOCCER_DATA_FBREF_BATCH_02_MATRIX_V374.md`

- Percorso originale: `audit/SOCCER_DATA_FBREF_BATCH_02_MATRIX_V374.md`
- Dimensione originale: 605 byte
- SHA-256: `4ddbbdb0a219c54174d748974333d44699ea9168bf7950434c2a79646b65732f`

````markdown
# Audit matrix V374 - Soccer Data FBref batch-02

| Controllo | Esito atteso |
|---|---|
| Manifest punta a `fbref-player-map.v374.json` | OK |
| Mapping contiene solo `IN_LISTONE` | OK |
| Mapping contiene 532 giocatori | OK |
| Asteriscati esclusi | OK |
| Confermati totali | 100 |
| Confermati batch-02 | 50 |
| Nessun mapping V374 fuori batch-02 | OK |
| Nessuna scrittura Firebase | OK |
| Nessuno scraping live browser | OK |
| Marker V371/V372/V373 preservati | OK |
| Marker V374 presente | OK |

Comando audit:

```bash
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v374.mjs
```
````

---

## 5. `audit/SOCCER_DATA_FBREF_BATCH_03_MATRIX_V375.md`

- Percorso originale: `audit/SOCCER_DATA_FBREF_BATCH_03_MATRIX_V375.md`
- Dimensione originale: 580 byte
- SHA-256: `fd00bb868d5d83eea6f501a73d3728906f41c93a79340758b6b95e7d31eff2f3`

```markdown
# Audit matrix V375 - Soccer Data FBref batch-03

| Area | Esito | Note |
| --- | --- | --- |
| Funzionalita esistenti | Preservate | Nessuna rimozione runtime. |
| Giocatori inclusi | OK | 532 record, tutti `IN_LISTONE`. |
| Asteriscati | OK | Nessun record non `IN_LISTONE` nel mapping. |
| Mapping confermati | OK | 150 totali, 50 nuovi V375. |
| FBref URL | OK | Ogni confermato ha `fbrefId`, `fbrefName`, `fbrefUrl`. |
| Firebase | OK | Nessuna nuova scrittura. |
| Browser scraping | OK | Nessuna interrogazione live a FBref. |
| `FUNZIONALITA'.md` | OK | Non modificato. |
```

---

## 6. `audit/SOCCER_DATA_FBREF_BATCH_04_MATRIX_V376.md`

- Percorso originale: `audit/SOCCER_DATA_FBREF_BATCH_04_MATRIX_V376.md`
- Dimensione originale: 435 byte
- SHA-256: `4201619d01aef8abd9834bdcd2694a506884edd07eb96e8e0815b830156f1c2c`

```markdown
# Soccer Data FBref batch-04 matrix V376

| Controllo | Esito atteso |
|---|---|
| Mapping corrente | `fbref-player-map.v376.json` |
| Giocatori totali | 532 |
| Solo IN_LISTONE | Si |
| Asteriscati esclusi | Si |
| Mapping confermati totali | 200 |
| Mapping batch-04 | 50 |
| Duplicati fbrefId | Nessuno |
| Scritture Firebase | No |
| Scraping live browser | No |
| V371-V375 preservate | Si |
| `FUNZIONALITA'.md` invariato | Si |
```

---

## 7. `audit/SOCCER_DATA_FBREF_BATCH_05_MATRIX_V377.md`

- Percorso originale: `audit/SOCCER_DATA_FBREF_BATCH_05_MATRIX_V377.md`
- Dimensione originale: 435 byte
- SHA-256: `6d9b2087c332cf7664400f533c1e0a869e6a974b728115c6b6bdba9f76214dfe`

```markdown
# Soccer Data FBref batch-05 matrix V377

| Controllo | Esito atteso |
|---|---|
| Mapping corrente | `fbref-player-map.v377.json` |
| Giocatori totali | 532 |
| Solo IN_LISTONE | Si |
| Asteriscati esclusi | Si |
| Mapping confermati totali | 250 |
| Mapping batch-05 | 50 |
| Duplicati fbrefId | Nessuno |
| Scritture Firebase | No |
| Scraping live browser | No |
| V371-V376 preservate | Si |
| `FUNZIONALITA'.md` invariato | Si |
```

---

## 8. `audit/SOCCER_DATA_FBREF_BATCH_06_MATRIX_V378.md`

- Percorso originale: `audit/SOCCER_DATA_FBREF_BATCH_06_MATRIX_V378.md`
- Dimensione originale: 435 byte
- SHA-256: `b83097420eb916b06ff971313e583901a17c4d7415ea56dca59028de5592dd89`

```markdown
# Soccer Data FBref batch-06 matrix V378

| Controllo | Esito atteso |
|---|---|
| Mapping corrente | `fbref-player-map.v378.json` |
| Giocatori totali | 532 |
| Solo IN_LISTONE | Si |
| Asteriscati esclusi | Si |
| Mapping confermati totali | 300 |
| Mapping batch-06 | 50 |
| Duplicati fbrefId | Nessuno |
| Scritture Firebase | No |
| Scraping live browser | No |
| V371-V377 preservate | Si |
| `FUNZIONALITA'.md` invariato | Si |
```

---

## 9. `audit/SOCCER_DATA_FBREF_BATCH_07_MATRIX_V379.md`

- Percorso originale: `audit/SOCCER_DATA_FBREF_BATCH_07_MATRIX_V379.md`
- Dimensione originale: 584 byte
- SHA-256: `8d45713d508a417104a1de4512cf86025102b83e38cc0be8cd3922ea973fc332`

```markdown
# Audit matrix V379 - Soccer Data FBref batch-07

| Area | Esito | Note |
|---|---:|---|
| Runtime V379 | OK | Footer/cache-buster aggiornati. |
| Mapping corrente | OK | `fbref-player-map.v379.json`. |
| Solo IN_LISTONE | OK | 532 record, nessun asteriscato incluso. |
| Batch-07 | OK | 50 nuove associazioni confermate. |
| Totale confermati | OK | 350/532. |
| Firebase writes | OK | Nessuna nuova scrittura. |
| Live scraping browser | OK | Nessuno scraping live. |
| Funzionalita esistenti | OK | Modifica additiva su Soccer Data. |
| `FUNZIONALITA'.md` | OK | Non modificato. |
```

---

## 10. `audit/SOCCER_DATA_FBREF_BATCH_08_MATRIX_V380.md`

- Percorso originale: `audit/SOCCER_DATA_FBREF_BATCH_08_MATRIX_V380.md`
- Dimensione originale: 584 byte
- SHA-256: `1a3e2c0507d275d926828d941d531116391865b8e79372ea36b17bc2d5901f1b`

```markdown
# Audit matrix V380 - Soccer Data FBref batch-08

| Area | Esito | Note |
|---|---:|---|
| Runtime V380 | OK | Footer/cache-buster aggiornati. |
| Mapping corrente | OK | `fbref-player-map.v380.json`. |
| Solo IN_LISTONE | OK | 532 record, nessun asteriscato incluso. |
| Batch-08 | OK | 50 nuove associazioni confermate. |
| Totale confermati | OK | 400/532. |
| Firebase writes | OK | Nessuna nuova scrittura. |
| Live scraping browser | OK | Nessuno scraping live. |
| Funzionalita esistenti | OK | Modifica additiva su Soccer Data. |
| `FUNZIONALITA'.md` | OK | Non modificato. |
```

---

## 11. `audit/SOCCER_DATA_FBREF_BATCH_09_MATRIX_V381.md`

- Percorso originale: `audit/SOCCER_DATA_FBREF_BATCH_09_MATRIX_V381.md`
- Dimensione originale: 453 byte
- SHA-256: `16081bdaaea471e01cf2b7a1d1cc250d4cfffdd9aa929407e71a299e5906d166`

````markdown
# Soccer Data FBref batch-09 matrix V381

## Controlli obbligatori

- Mapping corrente: `fbref-player-map.v381.json`.
- Manifest: `V381`.
- Totale righe mapping: 532.
- Record non `IN_LISTONE`: 0.
- Mapping confermati totali: 450.
- Mapping V381 batch-09: 50.
- Duplicati `fbrefId`: 0.
- Token runtime V371-V381 presenti.

## Esito

Controlli automatizzati affidati a:

```bash
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v381.mjs
```
````

---

## 12. `audit/SOCCER_DATA_FBREF_BATCH_10_MATRIX_V382.md`

- Percorso originale: `audit/SOCCER_DATA_FBREF_BATCH_10_MATRIX_V382.md`
- Dimensione originale: 453 byte
- SHA-256: `48fe98a08cfec500c9822d9395544890d3c778a0cd856d56ce77c7901a3a71f0`

````markdown
# Soccer Data FBref batch-10 matrix V382

## Controlli obbligatori

- Mapping corrente: `fbref-player-map.v382.json`.
- Manifest: `V382`.
- Totale righe mapping: 532.
- Record non `IN_LISTONE`: 0.
- Mapping confermati totali: 500.
- Mapping V382 batch-10: 50.
- Duplicati `fbrefId`: 0.
- Token runtime V371-V382 presenti.

## Esito

Controlli automatizzati affidati a:

```bash
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v382.mjs
```
````

---

## 13. `audit/SOCCER_DATA_FBREF_BATCH_11_MATRIX_V383.md`

- Percorso originale: `audit/SOCCER_DATA_FBREF_BATCH_11_MATRIX_V383.md`
- Dimensione originale: 514 byte
- SHA-256: `d8cd03ccebf4c32ed792e968568765575b52b12b077909a7515133644aa4eb72`

````markdown
# Soccer Data FBref batch-11 finale matrix V383

## Controlli obbligatori

- Mapping corrente: `fbref-player-map.v383.json`.
- Manifest: `V383`.
- Totale righe mapping: 532.
- Record non `IN_LISTONE`: 0.
- Mapping confermati totali: 531.
- Mapping V383 batch-11 confermati: 31.
- Residui `needs-review`: 1 (`Balentien`).
- Duplicati `fbrefId`: 0.
- Token runtime V371-V383 presenti.

## Esito

Controlli automatizzati affidati a:

```bash
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v383.mjs
```
````

---

## 14. `audit/SOCCER_DATA_MAPPING_MATRIX_V372.md`

- Percorso originale: `audit/SOCCER_DATA_MAPPING_MATRIX_V372.md`
- Dimensione originale: 797 byte
- SHA-256: `9af9cb5ee5ee9e537b0467da8a9cab498e278ddd06e40575ab5f098bf24ff990`

```markdown
# Soccer Data mapping matrix V372

## Scope

| Area | Stato |
| --- | --- |
| Giocatori inclusi | Solo `statusCode: IN_LISTONE` |
| Asteriscati | Esclusi |
| Scraping live browser | No |
| Firebase writes | No |
| Sezioni esistenti | Preservate |
| FUNZIONALITA'.md | Non modificato |

## File runtime aggiunti

- `assets/soccer-data/fbref-player-map.v372.json`
- `assets/soccer-data/fbref-player-map.v372.csv`
- `assets/soccer-data/fbref-review-batch.v372.csv`
- `tools/generate-soccer-data-mapping-v372.mjs`
- `tools/audit-soccer-data-mapping-v372.mjs`

## Controlli V372

- mapping righe = giocatori attivi listone;
- nessun record non `IN_LISTONE`;
- playerKey univoci;
- query/link/batch/priorita presenti per ogni riga;
- marker runtime `window.ZonaOrientaleSoccerDataMappingAssistantV372`.
```

---

## 15. `audit/SOCCER_DATA_MATRIX_V371.md`

- Percorso originale: `audit/SOCCER_DATA_MATRIX_V371.md`
- Dimensione originale: 797 byte
- SHA-256: `c8c3680bdfc734cc7e494cfd5a1bc061a2dae8e1580487041772f433d87870dc`

````markdown
# Audit matrix V371 - Soccer Data protetto

## Controlli obbligatori

| Controllo | Esito atteso |
|---|---|
| `assets/app.js` sintassi valida | OK |
| `DEPLOY_EXPECTED_VERSION_V181` | `371` |
| Cache-buster HTML | `v=371` |
| Footer HTML | `V371 Soccer Data protetto` |
| Nav desktop Soccer Data | presente |
| Nav mobile Soccer Data | presente |
| Sezione `data-page="soccerdata"` | presente |
| Marker `window.ZonaOrientaleSoccerDataV371` | presente |
| Mapping base | presente |
| Manifest Soccer Data | presente |
| CSV mapping | presente |
| Mapping solo `IN_LISTONE` | OK |
| Asteriscati esclusi | OK |
| Firebase writes | assenti |
| Scraping live browser | assente |
| V368/V369/V370 ancora presenti | OK |

## Tool

```bash
node static/zonaorientale/tools/audit-soccer-data-v371.mjs
```
````

---

## 16. `firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules`

- Percorso originale: `firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules`
- Dimensione originale: 2895 byte
- SHA-256: `97ced73f81bc1508560091d404fd71ec173ec08245b3b4cbbad114865a8ce129`

```text
// PATCH V257 - transferNegotiations: notifiche esito trattative multi-dispositivo.
// Applicare dentro service cloud.firestore > match /databases/{database}/documents.
// Se usi il file completo, preferisci FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules.

function changedKeys() {
  return request.resource.data.diff(resource.data).affectedKeys();
}

function isTradeOutcomeStatus(status) {
  return status == 'ACCEPTED' || status == 'REJECTED';
}

function isTradeResponseUpdateByReceiver() {
  return isParticipantTeam(resource.data.toSeasonTeamId)
    && resource.data.status == 'PENDING'
    && isTradeOutcomeStatus(request.resource.data.status)
    && (
      (
        request.resource.data.status == 'ACCEPTED'
        && changedKeys().hasOnly(['status', 'updatedAt', 'acceptedAt', 'acceptedBy'])
        && request.resource.data.acceptedBy == request.auth.uid
      )
      ||
      (
        request.resource.data.status == 'REJECTED'
        && changedKeys().hasOnly(['status', 'updatedAt', 'rejectedAt', 'rejectedBy'])
        && request.resource.data.rejectedBy == request.auth.uid
      )
    );
}

function isTradeOutcomeSeenUpdateBySender() {
  return isParticipantTeam(resource.data.fromSeasonTeamId)
    && isTradeOutcomeStatus(resource.data.status)
    && changedKeys().hasOnly([
      'outcomeSeenByFromUid',
      'outcomeSeenByUid',
      'outcomeSeenAtByFromUid',
      'outcomeSeenMarkerByFromUid'
    ])
    && request.resource.data.outcomeSeenByFromUid == true
    && request.resource.data.outcomeSeenByUid == request.auth.uid
    && request.resource.data.outcomeSeenAtByFromUid is timestamp
    && request.resource.data.outcomeSeenMarkerByFromUid is string
    && request.resource.data.outcomeSeenMarkerByFromUid.size() <= 200;
}

function isTradeOutcomeResetUpdateByReceiver() {
  return isParticipantTeam(resource.data.toSeasonTeamId)
    && isTradeOutcomeStatus(resource.data.status)
    && changedKeys().hasOnly([
      'outcomeSeenByFromUid',
      'outcomeSeenMarkerByFromUid',
      'outcomeSeenByUid',
      'outcomeResetAtV246'
    ])
    && request.resource.data.outcomeSeenByFromUid == false
    && request.resource.data.outcomeSeenMarkerByFromUid == ''
    && request.resource.data.outcomeSeenByUid == ''
    && request.resource.data.outcomeResetAtV246 is timestamp;
}

match /transferNegotiations/{negotiationId} {
  allow read: if isAdmin()
    || isParticipantTeam(resource.data.fromSeasonTeamId)
    || isParticipantTeam(resource.data.toSeasonTeamId);

  allow create: if isAdmin()
    || isParticipantTeam(request.resource.data.fromSeasonTeamId);

  allow update: if isAdmin()
    || isTradeResponseUpdateByReceiver()
    || isTradeOutcomeResetUpdateByReceiver()
    || isTradeOutcomeSeenUpdateBySender();

  allow delete: if isAdmin()
    || (
      isParticipantTeam(resource.data.fromSeasonTeamId)
      && resource.data.status == 'PENDING'
    );
}
```

---

## 17. `firebase/FIREBASE_RULES_PATCH_V393_SOCCER_DATA_STATS.rules`

- Percorso originale: `firebase/FIREBASE_RULES_PATCH_V393_SOCCER_DATA_STATS.rules`
- Dimensione originale: 544 byte
- SHA-256: `21d14b04065949af12bc68bc59c34f242894d982f4a7ad5d2276a73f68a4c04e`

```text
// V393 Soccer Data stats
// Inserire questo blocco dentro:
// service cloud.firestore { match /databases/{database}/documents { ... } }
// Richiede che la funzione isAdmin() sia gia' presente nelle rules correnti.

match /soccerDataPlayerStats/{docId} {
  // Lettura pubblica: consente al sito pubblico di usare Firebase come fallback
  // quando il JSON statico stats non e' ancora stato pubblicato.
  allow read: if true;

  // Scrittura solo admin: import HTML/FBref e aggiornamenti manuali restano protetti.
  allow write: if isAdmin();
}
```

---

## 18. `firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules`

- Percorso originale: `firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules`
- Dimensione originale: 7599 byte
- SHA-256: `65ec320131ebd08e0a707de0d62998095ffee3ea3a43b52e568c6ec2d2082377`

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn()
        && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    function signedInUserDoc() {
      return get(/databases/$(database)/documents/teamUsers/$(request.auth.uid));
    }

    function hasTeamUserDoc() {
      return isSignedIn()
        && exists(/databases/$(database)/documents/teamUsers/$(request.auth.uid));
    }

    function isApprovedTeamUser() {
      return hasTeamUserDoc()
        && signedInUserDoc().data.status == 'ACTIVE';
    }

    function mySeasonTeamId() {
      return signedInUserDoc().data.seasonTeamId;
    }

    function isParticipantTeam(teamId) {
      return isApprovedTeamUser()
        && mySeasonTeamId() == teamId;
    }

    function changedKeys() {
      return request.resource.data.diff(resource.data).affectedKeys();
    }

    function isTradeOutcomeStatus(status) {
      return status == 'ACCEPTED' || status == 'REJECTED';
    }

    function isTradeResponseUpdateByReceiver() {
      return isParticipantTeam(resource.data.toSeasonTeamId)
        && resource.data.status == 'PENDING'
        && isTradeOutcomeStatus(request.resource.data.status)
        && (
          (
            request.resource.data.status == 'ACCEPTED'
            && changedKeys().hasOnly(['status', 'updatedAt', 'acceptedAt', 'acceptedBy'])
            && request.resource.data.acceptedBy == request.auth.uid
          )
          ||
          (
            request.resource.data.status == 'REJECTED'
            && changedKeys().hasOnly(['status', 'updatedAt', 'rejectedAt', 'rejectedBy'])
            && request.resource.data.rejectedBy == request.auth.uid
          )
        );
    }

    function isTradeOutcomeSeenUpdateBySender() {
      return isParticipantTeam(resource.data.fromSeasonTeamId)
        && isTradeOutcomeStatus(resource.data.status)
        && changedKeys().hasOnly([
          'outcomeSeenByFromUid',
          'outcomeSeenByUid',
          'outcomeSeenAtByFromUid',
          'outcomeSeenMarkerByFromUid'
        ])
        && request.resource.data.outcomeSeenByFromUid == true
        && request.resource.data.outcomeSeenByUid == request.auth.uid
        && request.resource.data.outcomeSeenAtByFromUid is timestamp
        && request.resource.data.outcomeSeenMarkerByFromUid is string
        && request.resource.data.outcomeSeenMarkerByFromUid.size() <= 200;
    }

    function isTradeOutcomeResetUpdateByReceiver() {
      return isParticipantTeam(resource.data.toSeasonTeamId)
        && isTradeOutcomeStatus(resource.data.status)
        && changedKeys().hasOnly([
          'outcomeSeenByFromUid',
          'outcomeSeenMarkerByFromUid',
          'outcomeSeenByUid',
          'outcomeResetAtV246'
        ])
        && request.resource.data.outcomeSeenByFromUid == false
        && request.resource.data.outcomeSeenMarkerByFromUid == ''
        && request.resource.data.outcomeSeenByUid == ''
        && request.resource.data.outcomeResetAtV246 is timestamp;
    }

    match /admins/{userId} {
      // Un utente loggato puo leggere solo il proprio eventuale documento admin.
      // Questo permette al frontend di verificare se e admin senza bloccare i presidenti.
      allow read: if isAdmin() || (isSignedIn() && request.auth.uid == userId);
      allow write: if isAdmin();
    }

    match /pendingUsers/{userId} {
      // Il presidente puo creare/leggere/aggiornare la propria richiesta.
      // L'admin puo leggere, approvare o rifiutare; dalla V241 il rifiuto resta REJECTED.
      allow create, read, update: if isSignedIn() && request.auth.uid == userId;
      allow read, write, delete: if isAdmin();
    }

    match /teamUsers/{userId} {
      allow read: if isAdmin() || (isSignedIn() && request.auth.uid == userId);
      allow write: if isAdmin();
    }

    match /teamRequests/{docId} {
      allow create: if isApprovedTeamUser();
      allow read: if isAdmin() || (isSignedIn() && resource.data.createdBy == request.auth.uid);
      allow update, delete: if isAdmin();
    }

    match /publicSeasonSnapshots/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /publicSnapshots/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /publicTeamSnapshots/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /transferListings/{listingId} {
      // Fantamercato pubblico: lista giocatori trasferibili.
      allow read: if true;

      allow create: if isAdmin()
        || isParticipantTeam(request.resource.data.seasonTeamId);

      allow update: if isAdmin()
        || isParticipantTeam(resource.data.seasonTeamId)
        || isParticipantTeam(request.resource.data.seasonTeamId);

      allow delete: if isAdmin()
        || isParticipantTeam(resource.data.seasonTeamId);
    }

    match /transferNegotiations/{negotiationId} {
      // Trattative visibili solo ad admin, mittente e destinatario.
      allow read: if isAdmin()
        || isParticipantTeam(resource.data.fromSeasonTeamId)
        || isParticipantTeam(resource.data.toSeasonTeamId);

      // Il presidente puo creare solo trattative dalla propria squadra.
      allow create: if isAdmin()
        || isParticipantTeam(request.resource.data.fromSeasonTeamId);

      // V257: update non-admin separati per sicurezza.
      // - Il destinatario puo accettare/rifiutare una proposta PENDING.
      // - Il destinatario puo resettare i flag di lettura esito dopo la risposta.
      // - Il mittente puo marcare come letto solo l'esito della propria proposta conclusa.
      allow update: if isAdmin()
        || isTradeResponseUpdateByReceiver()
        || isTradeOutcomeResetUpdateByReceiver()
        || isTradeOutcomeSeenUpdateBySender();

      // Chi invia puo annullare una proposta PENDING: viene eliminata da Firebase.
      allow delete: if isAdmin()
        || (
          isParticipantTeam(resource.data.fromSeasonTeamId)
          && resource.data.status == 'PENDING'
        );
    }

    match /leagueSettings/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /seasons/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /presidents/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /teams/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /seasonTeams/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /stadiums/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /competitions/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /competitionMatches/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /competitionResults/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /honorRoll/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /fifaRankings/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /rosterEntries/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /fmMovements/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /news/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

---

## 19. `firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V393.rules`

- Percorso originale: `firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V393.rules`
- Dimensione originale: 7798 byte
- SHA-256: `0a84b8fa630742cb1e3b6f096ee432dd84711884d6a9ff8f0693304f93853581`

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn()
        && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    function signedInUserDoc() {
      return get(/databases/$(database)/documents/teamUsers/$(request.auth.uid));
    }

    function hasTeamUserDoc() {
      return isSignedIn()
        && exists(/databases/$(database)/documents/teamUsers/$(request.auth.uid));
    }

    function isApprovedTeamUser() {
      return hasTeamUserDoc()
        && signedInUserDoc().data.status == 'ACTIVE';
    }

    function mySeasonTeamId() {
      return signedInUserDoc().data.seasonTeamId;
    }

    function isParticipantTeam(teamId) {
      return isApprovedTeamUser()
        && mySeasonTeamId() == teamId;
    }

    function changedKeys() {
      return request.resource.data.diff(resource.data).affectedKeys();
    }

    function isTradeOutcomeStatus(status) {
      return status == 'ACCEPTED' || status == 'REJECTED';
    }

    function isTradeResponseUpdateByReceiver() {
      return isParticipantTeam(resource.data.toSeasonTeamId)
        && resource.data.status == 'PENDING'
        && isTradeOutcomeStatus(request.resource.data.status)
        && (
          (
            request.resource.data.status == 'ACCEPTED'
            && changedKeys().hasOnly(['status', 'updatedAt', 'acceptedAt', 'acceptedBy'])
            && request.resource.data.acceptedBy == request.auth.uid
          )
          ||
          (
            request.resource.data.status == 'REJECTED'
            && changedKeys().hasOnly(['status', 'updatedAt', 'rejectedAt', 'rejectedBy'])
            && request.resource.data.rejectedBy == request.auth.uid
          )
        );
    }

    function isTradeOutcomeSeenUpdateBySender() {
      return isParticipantTeam(resource.data.fromSeasonTeamId)
        && isTradeOutcomeStatus(resource.data.status)
        && changedKeys().hasOnly([
          'outcomeSeenByFromUid',
          'outcomeSeenByUid',
          'outcomeSeenAtByFromUid',
          'outcomeSeenMarkerByFromUid'
        ])
        && request.resource.data.outcomeSeenByFromUid == true
        && request.resource.data.outcomeSeenByUid == request.auth.uid
        && request.resource.data.outcomeSeenAtByFromUid is timestamp
        && request.resource.data.outcomeSeenMarkerByFromUid is string
        && request.resource.data.outcomeSeenMarkerByFromUid.size() <= 200;
    }

    function isTradeOutcomeResetUpdateByReceiver() {
      return isParticipantTeam(resource.data.toSeasonTeamId)
        && isTradeOutcomeStatus(resource.data.status)
        && changedKeys().hasOnly([
          'outcomeSeenByFromUid',
          'outcomeSeenMarkerByFromUid',
          'outcomeSeenByUid',
          'outcomeResetAtV246'
        ])
        && request.resource.data.outcomeSeenByFromUid == false
        && request.resource.data.outcomeSeenMarkerByFromUid == ''
        && request.resource.data.outcomeSeenByUid == ''
        && request.resource.data.outcomeResetAtV246 is timestamp;
    }

    match /admins/{userId} {
      // Un utente loggato puo leggere solo il proprio eventuale documento admin.
      // Questo permette al frontend di verificare se e admin senza bloccare i presidenti.
      allow read: if isAdmin() || (isSignedIn() && request.auth.uid == userId);
      allow write: if isAdmin();
    }

    match /pendingUsers/{userId} {
      // Il presidente puo creare/leggere/aggiornare la propria richiesta.
      // L'admin puo leggere, approvare o rifiutare; dalla V241 il rifiuto resta REJECTED.
      allow create, read, update: if isSignedIn() && request.auth.uid == userId;
      allow read, write, delete: if isAdmin();
    }

    match /teamUsers/{userId} {
      allow read: if isAdmin() || (isSignedIn() && request.auth.uid == userId);
      allow write: if isAdmin();
    }

    match /teamRequests/{docId} {
      allow create: if isApprovedTeamUser();
      allow read: if isAdmin() || (isSignedIn() && resource.data.createdBy == request.auth.uid);
      allow update, delete: if isAdmin();
    }

    match /publicSeasonSnapshots/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /publicSnapshots/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /publicTeamSnapshots/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /transferListings/{listingId} {
      // Fantamercato pubblico: lista giocatori trasferibili.
      allow read: if true;

      allow create: if isAdmin()
        || isParticipantTeam(request.resource.data.seasonTeamId);

      allow update: if isAdmin()
        || isParticipantTeam(resource.data.seasonTeamId)
        || isParticipantTeam(request.resource.data.seasonTeamId);

      allow delete: if isAdmin()
        || isParticipantTeam(resource.data.seasonTeamId);
    }

    match /transferNegotiations/{negotiationId} {
      // Trattative visibili solo ad admin, mittente e destinatario.
      allow read: if isAdmin()
        || isParticipantTeam(resource.data.fromSeasonTeamId)
        || isParticipantTeam(resource.data.toSeasonTeamId);

      // Il presidente puo creare solo trattative dalla propria squadra.
      allow create: if isAdmin()
        || isParticipantTeam(request.resource.data.fromSeasonTeamId);

      // V257: update non-admin separati per sicurezza.
      // - Il destinatario puo accettare/rifiutare una proposta PENDING.
      // - Il destinatario puo resettare i flag di lettura esito dopo la risposta.
      // - Il mittente puo marcare come letto solo l'esito della propria proposta conclusa.
      allow update: if isAdmin()
        || isTradeResponseUpdateByReceiver()
        || isTradeOutcomeResetUpdateByReceiver()
        || isTradeOutcomeSeenUpdateBySender();

      // Chi invia puo annullare una proposta PENDING: viene eliminata da Firebase.
      allow delete: if isAdmin()
        || (
          isParticipantTeam(resource.data.fromSeasonTeamId)
          && resource.data.status == 'PENDING'
        );
    }

    match /leagueSettings/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /seasons/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /presidents/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /teams/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /seasonTeams/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /stadiums/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /competitions/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /competitionMatches/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /competitionResults/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /honorRoll/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /fifaRankings/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /rosterEntries/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /fmMovements/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /news/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }


    match /soccerDataPlayerStats/{docId} {
      // V393 Soccer Data: lettura pubblica per fallback runtime, scrittura solo admin.
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

---

## 20. `HANDOFF_V393_SOCCER_DATA_FIREBASE_RULES_FALLBACK.md`

- Percorso originale: `HANDOFF_V393_SOCCER_DATA_FIREBASE_RULES_FALLBACK.md`
- Dimensione originale: 1850 byte
- SHA-256: `1c79635fda8182c00fd2d525f0c91b454cb1cd28ade43f37559062a24736e72f`

````markdown
# Handoff V393 - Soccer Data rules Firebase + fallback locale

## Obiettivo
Correggere il blocco `Missing or insufficient permissions` durante l'import HTML FBref in Soccer Data, senza toccare le altre sezioni del sito.

## Causa
La V391/V392 usa la collection Firestore `soccerDataPlayerStats`, ma le rules pubblicate storicamente non includono ancora un match dedicato per questa collection. Il parsing HTML funziona, ma `setDoc()` viene rifiutato da Firestore.

## Modifiche V393
- Soccer Data resta pubblica in sola lettura.
- I comandi admin restano solo dentro Soccer Data e solo per admin.
- L'import HTML prova ancora a salvare su Firebase.
- Se Firebase risponde `permission-denied` / `Missing or insufficient permissions`, il payload viene conservato localmente nel browser.
- Il pulsante `Scarica stats JSON` esporta sia i dati Firebase sia eventuali import locali V393.
- Aggiunte rules Firestore V393:
  - `FIREBASE_RULES_PATCH_V393_SOCCER_DATA_STATS.rules`
  - `FIREBASE_RULES_ZONAORIENTALE_FULL_V393.rules`

## Rules da pubblicare in Firebase
Aggiungere dentro `match /databases/{database}/documents`:

```rules
match /soccerDataPlayerStats/{docId} {
  allow read: if true;
  allow write: if isAdmin();
}
```

## Flusso operativo consigliato
1. Pubblicare la V393 sul sito.
2. Aggiornare le Firestore Rules con il blocco V393.
3. Riprovare `Importa HTML FBref` da Soccer Data.
4. Se le rules non sono ancora aggiornate, usare comunque `Scarica stats JSON`: il payload locale viene incluso nell'export.
5. Quando il JSON esportato e' verificato, inserirlo negli asset statici della repo.

## Vincoli rispettati
- Nessuna modifica a Comunicati, Rose, Calciomercato, Snapshot, Competizioni.
- Nessuna modifica al mapping FBref V383.
- Nessuna modifica a `FUNZIONALITA'.md`.
- Nessuno scraping pubblico live.
- Fallback locale solo admin.
````

---

## 21. `HANDOFF_V394_SOCCER_DATA_API_FOOTBALL.md`

- Percorso originale: `HANDOFF_V394_SOCCER_DATA_API_FOOTBALL.md`
- Dimensione originale: 1759 byte
- SHA-256: `64c0e8667b2dc6c1863440ab5fb97a6b2d204127b9901e47df1c4d72e5dd3377`

````markdown
# Handoff V394 - Soccer Data API-Football

## Stato

Base di partenza: V393 Soccer Data Firebase rules + fallback locale.

La V394 aggiunge un provider API-Football server-side, admin-only, senza rimuovere il fallback FBref e senza toccare altre sezioni del sito.

## File principali modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `netlify/functions/api-football-player-stats.js`
- `docs/zonaorientale/FUNZIONALITAV394.md`
- `docs/zonaorientale/HANDOFF_V394_SOCCER_DATA_API_FOOTBALL.md`

## Variabile ambiente Netlify richiesta

Impostare una delle seguenti, preferibilmente la prima:

```text
ZONAORIENTALE_API_FOOTBALL_KEY
```

Fallback supportati:

```text
API_FOOTBALL_KEY
API_FOOTBALL_API_KEY
APISPORTS_API_KEY
```

## Comportamento

- La ricerca ID usa la Netlify Function con `action: search`.
- Il recupero stats usa la stessa Function con `action: stats`.
- La Function legge la API key dal server, quindi non viene esposta nel frontend.
- Il frontend salva il risultato nella collection `soccerDataPlayerStats`.
- La tabella unisce statico + Firebase + fallback locale come gia previsto.
- La nuova colonna `Aggiornato` mostra `updatedAt`/`fetchedAt` quando disponibile.

## Prossimi passi consigliati

1. Configurare la variabile ambiente su Netlify.
2. Verificare le Firestore Rules per `soccerDataPlayerStats`.
3. Testare 3-5 giocatori con `Cerca API-Football ID` e `Recupera API-Football`.
4. Usare `Scarica stats JSON`.
5. Inserire il JSON statico in `assets/soccer-data/stats/` e aggiornare il manifest in una prossima release.

## Funzionalita non toccate

- Mapping FBref V383.
- Import HTML FBref V392.
- Fallback locale V393.
- Comunicati, snapshot, rose, calciomercato, competizioni, trattative.
````

---

## 22. `HANDOFF_V395_SOCCER_DATA_API_FOOTBALL_MAPPING.md`

- Percorso originale: `HANDOFF_V395_SOCCER_DATA_API_FOOTBALL_MAPPING.md`
- Dimensione originale: 1574 byte
- SHA-256: `4cb6abc5773d2101f1e0e9b1e932b6bef77e4b1cea1a4121e8169bd33679ef71`

```markdown
# Handoff V395 - Soccer Data API-Football mapping assistito

## Stato
Base: V394. La V395 interviene solo su Soccer Data.

## File principali modificati
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/soccer-data/manifest.json`
- `static/zonaorientale/assets/soccer-data/stats/manifest.json`
- `static/zonaorientale/assets/soccer-data/providers/api-football-player-map.v001.json`
- `static/zonaorientale/tools/audit-soccer-data-api-football-mapping-v395.mjs`
- `docs/zonaorientale/FUNZIONALITAV395.md`

## Cosa verificare dopo deploy
- Soccer Data e visibile anche da non-admin.
- I comandi `Trova ID API`, `Inserisci ID API`, `Recupera statistiche`, `Scarica mapping API`, `Scarica stats JSON` compaiono solo admin.
- Il link sul nome giocatore resta cliccabile quando il profilo e presente.
- `Trova ID API` mostra candidati e permette di salvare l'ID corretto.
- `Recupera statistiche` usa l'ID salvato e salva/cache su Firebase.
- `Scarica mapping API` genera un JSON con i playerKey e gli ID API-Football associati.
- `Scarica stats JSON` continua a esportare i dati statistici.

## Attenzione
La API key non deve essere committata. Deve stare solo su Netlify come `ZONAORIENTALE_API_FOOTBALL_KEY`.

## Prossimo step consigliato
Dopo aver associato 10-20 giocatori e verificato il recupero statistiche, creare una V396 per:
- cache guard TTL 7 giorni;
- contatore richieste giornaliere;
- blocco aggiornamenti se i dati sono gia freschi;
- eventuale aggiornamento batch controllato sui soli giocatori filtrati.
```

---

## 23. `HANDOFF_V396_SOCCER_DATA_API_FOOTBALL_SQUADS_MAPPING.md`

- Percorso originale: `HANDOFF_V396_SOCCER_DATA_API_FOOTBALL_SQUADS_MAPPING.md`
- Dimensione originale: 2703 byte
- SHA-256: `f6e6ab062014c2aab5551e9591ef9800c78b4460d5ab7737fb77002fd88b96b0`

```markdown
# Handoff V396 - Soccer Data mapping API-Football da rose Serie A

## Stato
Base: V395. La V396 interviene solo su Soccer Data e sulla Netlify Function API-Football necessaria ai comandi admin.

## Obiettivo
Ridurre le ricerche singole dei giocatori su API-Football. L'admin scarica una volta squadre e rose Serie A, poi il sito genera localmente il mapping `playerKey -> apiFootballId` usando nome + squadra.

## File principali modificati
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/soccer-data/manifest.json`
- `static/zonaorientale/assets/soccer-data/stats/manifest.json`
- `static/zonaorientale/tools/audit-soccer-data-api-football-squads-v396.mjs`
- `netlify/functions/api-football-player-stats.js`
- `docs/zonaorientale/HANDOFF_V396_SOCCER_DATA_API_FOOTBALL_SQUADS_MAPPING.md`
- `docs/zonaorientale/test/SOCCER_DATA_API_FOOTBALL_SQUADS_MAPPING_V396.md`

## Cosa cambia in Soccer Data
- Aggiunto comando admin `Scarica rose Serie A API`.
- Aggiunto comando admin `Genera mapping da rose`.
- `Trova ID API` ora prova prima i candidati presenti nella cache locale delle rose; se li trova non consuma richieste API.
- `Scarica mapping API` esporta anche metadati sulla cache rose e sull'automapping V396.
- Il link profilo giocatore resta cliccabile quando disponibile.
- La sezione resta pubblica in sola lettura; tutti i comandi operativi restano admin-only.

## Flusso admin consigliato
1. Aprire Soccer Data online su deploy Netlify, non dal server statico `python3 -m http.server`.
2. Premere `Scarica rose Serie A API`.
3. Attendere il completamento: consuma circa `1 + numero squadre Serie A` richieste API.
4. Premere `Genera mapping da rose`.
5. Controllare il riepilogo: confermati, da verificare, mancanti.
6. Premere `Scarica mapping API`.
7. Pubblicare il JSON esportato in `assets/soccer-data/providers/api-football-player-map.v001.json` quando il mapping e verificato.
8. Da quel momento `Recupera statistiche` usa l'ID API statico/cacheato e le letture API restano limitate agli aggiornamenti espliciti.

## Invarianti conservati
- Nessuna modifica a Comunicati.
- Nessuna modifica a Rose.
- Nessuna modifica a Calciomercato.
- Nessuna modifica a Competizioni.
- Nessuna modifica a Snapshot.
- Nessuna modifica alle Firebase Rules.
- Nessuna modifica al mapping profili V383.
- `FUNZIONALITA'.md` non modificato.

## Note tecniche
- La API key resta solo su Netlify come `ZONAORIENTALE_API_FOOTBALL_KEY`.
- La function supporta ora anche le action `teams` e `squad`.
- Il provider usa league ID `135` per Serie A.
- I dati rose vengono salvati localmente nel browser per generare il mapping senza ulteriori richieste API.
```

---

## 24. `HANDOFF_V398_SOCCER_DATA_REMOVED.md`

- Percorso originale: `HANDOFF_V398_SOCCER_DATA_REMOVED.md`
- Dimensione originale: 1024 byte
- SHA-256: `2e10c96746f93be1d14ef96932a0fbadfd239b8487fb656b5fd6de569beaf94d`

```markdown
# Handoff V398 - Rimozione sezione Soccer Data

## Obiettivo
Rimuovere la sezione Soccer Data dalla navigazione e dall'accesso diretto, perché al momento il flusso dati/API non è sostenibile con i limiti del provider gratuito.

## Ambito modifica
- Rimossi link desktop/mobile verso Soccer Data.
- Rimossa la sezione `data-page="soccerdata"` da `index.html`.
- Aggiunto guard V398 in `assets/app.js`: eventuale accesso diretto a `#soccerdata` viene reindirizzato al Listone.
- Footer/cache-buster aggiornati a V398.

## Funzionalità preservate
- Dashboard
- News
- Rose
- Fantamercato
- Calciomercato
- Listone
- Competizioni
- Albo d'Oro/FIFA Ranking
- Statistiche
- Archivio
- Confronta
- Regolamento
- Admin

## Note
Il codice legacy Soccer Data rimane non esposto e inerte nel bundle per minimizzare il rischio di regressioni. Per una pulizia fisica della repo è possibile rimuovere da Git gli asset e le funzioni non più usate con i comandi indicati nel rilascio V398.

`FUNZIONALITA'.md` non è stato modificato.
```

---

## 25. `release/RELEASE_V371_SOCCER_DATA_PROTETTO.md`

- Percorso originale: `release/RELEASE_V371_SOCCER_DATA_PROTETTO.md`
- Dimensione originale: 1264 byte
- SHA-256: `cb14eb70308d7d20e46b983dce02b72b49624172e5711cf855576ab1f74a942d`

````markdown
# Release V371 - Soccer Data protetto

## Obiettivo

Creare la base della sezione Soccer Data per collegare i giocatori attivi nel listone ZonaOrientale ai profili FBref, senza introdurre scraping live e senza impattare sulle funzionalita' esistenti.

## Modifiche runtime

- Nuova voce `Soccer Data` in navigazione desktop.
- Nuova voce `Soccer Data` nel menu mobile `Altro`.
- Nuova pagina interna `data-page="soccerdata"`.
- Nuovo marker runtime:

```js
window.ZonaOrientaleSoccerDataV371
```

- Cache-buster e footer aggiornati a V371.
- `DEPLOY_EXPECTED_VERSION_V181 = "371"`.

## Dati

- Manifest statico Soccer Data.
- Mapping base JSON con 532 giocatori `IN_LISTONE` dal listone `2026-06-04`.
- CSV equivalente per lavoro di associazione.
- 131 asteriscati esclusi.

## Non modificato

- `docs/zonaorientale/FUNZIONALITA'.md`.
- Firebase schema e collection.
- Flussi trattative reali.
- Simulazioni trade local-only.
- Dashboard Admin V368.
- Dashboard Presidente V369.
- Centro notifiche Presidente V370.
- Listone pubblico esistente.
- Rose, competizioni, calciomercato, comunicati.

## Test

```bash
node --check assets/app.js
node --check assets/js/market/transfer-market.js
node tools/audit-soccer-data-v371.mjs
bash tools/check-zonaorientale.sh
```
````

---

## 26. `release/RELEASE_V372_SOCCER_DATA_MAPPING_ASSISTITO.md`

- Percorso originale: `release/RELEASE_V372_SOCCER_DATA_MAPPING_ASSISTITO.md`
- Dimensione originale: 1280 byte
- SHA-256: `af6d49143826de107b92103098613547f3d0845a487931fd936826f7a9b199d2`

```markdown
# Release V372 - Soccer Data mapping assistito

Data: 2026-06-05

## Obiettivo

Preparare il mapping controllato tra giocatori ZonaOrientale e profili FBref, mantenendo il vincolo principale: mostrare e lavorare solo sui giocatori presenti nel listone attivo.

## Cosa cambia

- La sezione Soccer Data resta read-only e additiva.
- Il manifest punta a `fbref-player-map.v372.json`.
- Ogni giocatore `IN_LISTONE` ha ora:
  - query FBref suggerita;
  - link di ricerca FBref;
  - batch di revisione;
  - priorita di revisione;
  - campi vuoti da compilare: `fbrefId`, `fbrefName`, `fbrefUrl`, `matchStatus`, `confidence`, `notes`.
- Aggiunto CSV ordinato per priorita: `fbref-review-batch.v372.csv`.
- Aggiunto tool locale: `tools/generate-soccer-data-mapping-v372.mjs`.
- Aggiunto audit: `tools/audit-soccer-data-mapping-v372.mjs`.

## Garanzie

- Nessuna funzionalita rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Gli asteriscati restano esclusi.

## Nota FBref

La ricerca FBref resta manuale e guidata. I dati storici verranno importati solo in una fase successiva tramite workflow offline/cache, rispettando rate-limit e condizioni dei siti sorgente.
```

---

## 27. `release/RELEASE_V373_SOCCER_DATA_FBREF_BATCH_01.md`

- Percorso originale: `release/RELEASE_V373_SOCCER_DATA_FBREF_BATCH_01.md`
- Dimensione originale: 1929 byte
- SHA-256: `98dc173bf5cf04a2fd98271d7ad2c62f2ec63257f786189a2f144ec4fa485e71`

````markdown
# RELEASE V373 - Soccer Data FBref batch-01

Data: 2026-06-05
Branch target: `refactor/260528-zonaorientale-next`

## Obiettivo

Aggiungere il primo batch di associazioni reali tra giocatori ZonaOrientale a listone e profili FBref, senza introdurre scraping live, senza scritture Firebase e senza modificare le funzionalita esistenti.

## Scope protetto

- Solo giocatori con `statusCode: IN_LISTONE`.
- Asteriscati esclusi.
- Mapping statico/offline.
- Nessuna nuova collection Firebase.
- Nessuna modifica a trattative, rose, competizioni, Admin, Area squadra, Dashboard Presidente o Centro notifiche.
- `docs/zonaorientale/FUNZIONALITA'.md` non modificato.

## Risultato

- 532 giocatori totali nel mapping Soccer Data.
- 50 associazioni FBref confermate nel `batch-01`.
- 482 associazioni ancora da verificare nei batch successivi.

## File principali

- `static/zonaorientale/assets/soccer-data/fbref-player-map.v373.json`
- `static/zonaorientale/assets/soccer-data/fbref-player-map.v373.csv`
- `static/zonaorientale/assets/soccer-data/fbref-review-batch.v373.csv`
- `static/zonaorientale/assets/soccer-data/manifest.json`
- `static/zonaorientale/tools/audit-soccer-data-fbref-batch-v373.mjs`
- `static/zonaorientale/assets/app.js`

## Note sui casi controllati

- `Martinez L.` e stato associato a Lautaro Martínez.
- `Paz N.` e stato associato al profilo Nicolás Paz di Como/Real Madrid, non agli omonimi argentini.
- `Konè I.` e stato associato a Ismaël Koné collegato a Sassuolo, non all'omonimo NB I.
- `Esposito F.P.` e stato associato al profilo FBref `Francesco Esposito`, usato da FBref per Francesco Pio Esposito.

## Verifiche

```bash
node --check assets/app.js
node --check assets/js/market/transfer-market.js
node tools/audit-soccer-data-v371.mjs --quiet
node tools/audit-soccer-data-mapping-v372.mjs --quiet
node tools/audit-soccer-data-fbref-batch-v373.mjs --quiet
bash tools/check-zonaorientale.sh
```
````

---

## 28. `release/RELEASE_V374_SOCCER_DATA_FBREF_BATCH_02.md`

- Percorso originale: `release/RELEASE_V374_SOCCER_DATA_FBREF_BATCH_02.md`
- Dimensione originale: 1189 byte
- SHA-256: `3b1985290238ff0b111fdccb338d3f239424ee802dc6d1f638661793c06745a8`

```markdown
# RELEASE V374 - Soccer Data FBref batch-02

Data: 2026-06-05

## Obiettivo

Aggiungere il secondo batch verificato di associazioni ZonaOrientale -> FBref per la sezione Soccer Data, mantenendo la sezione read-only e limitata ai soli giocatori presenti nel listone attivo.

## Numeri

- Giocatori IN_LISTONE inclusi: 532
- Asteriscati/non-IN_LISTONE esclusi: 131
- Mapping confermati prima della release: 50
- Mapping confermati aggiunti in V374: 50
- Mapping confermati totali: 100
- Mapping ancora da completare: 432

## File dati

- `assets/soccer-data/fbref-player-map.v374.json`
- `assets/soccer-data/fbref-player-map.v374.csv`
- `assets/soccer-data/fbref-review-batch.v374.csv`
- `assets/soccer-data/manifest.json`

## Garanzie

- Nessuna funzionalita rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Sono preservate le release V368, V369, V370, V371, V372 e V373.

## Note operative

Il batch e stato compilato in modo prudente: i match confermati hanno `fbrefId`, `fbrefName`, `fbrefUrl`, `matchStatus: confirmed`, `source: FBref` e `mappedInRelease: V374`.
```

---

## 29. `release/RELEASE_V375_SOCCER_DATA_FBREF_BATCH_03.md`

- Percorso originale: `release/RELEASE_V375_SOCCER_DATA_FBREF_BATCH_03.md`
- Dimensione originale: 1293 byte
- SHA-256: `b00c112a42137e6fd5874bde043d20158d837ee3c8dff0eaae0257e37c6ff0a9`

```markdown
# Release V375 - Soccer Data FBref batch-03

Versione: V375
Data: 2026-06-05
Branch previsto: refactor/260528-zonaorientale-next

## Obiettivo

Terzo batch controllato di associazioni ZonaOrientale -> FBref per la sezione Soccer Data.

## Scope protetto

- Solo giocatori con `statusCode: IN_LISTONE`.
- Asteriscati esclusi.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Nessuna modifica funzionale a rose, listone, trattative, admin, competizioni, schede player e calciomercato.

## Risultato

- 532 giocatori attivi nel mapping.
- 150 associazioni FBref confermate.
- 382 associazioni residue.
- Batch completati: batch-01, batch-02, batch-03.

## File principali

- `assets/soccer-data/fbref-player-map.v375.json`
- `assets/soccer-data/fbref-player-map.v375.csv`
- `assets/soccer-data/fbref-review-batch.v375.csv`
- `assets/soccer-data/manifest.json`
- `tools/audit-soccer-data-fbref-batch-v375.mjs`

## Verifiche

- `node --check assets/app.js`
- `node --check assets/js/market/transfer-market.js`
- `node tools/audit-soccer-data-v371.mjs --quiet`
- `node tools/audit-soccer-data-mapping-v372.mjs --quiet`
- `node tools/audit-soccer-data-fbref-batch-v375.mjs --quiet`
- `bash tools/check-zonaorientale.sh`
```

---

## 30. `release/RELEASE_V376_SOCCER_DATA_FBREF_BATCH_04.md`

- Percorso originale: `release/RELEASE_V376_SOCCER_DATA_FBREF_BATCH_04.md`
- Dimensione originale: 1471 byte
- SHA-256: `581f56cf0e603bbbf1da32c0bbeca3fcacf270b1f8c2169fd8d77276f0d55e4d`

````markdown
# Release V376 - Soccer Data FBref batch-04

## Obiettivo

Aggiungere il quarto batch di associazioni reali ZonaOrientale -> FBref, mantenendo la sezione Soccer Data additiva, read-only e limitata ai soli giocatori presenti nel listone.

## Modifiche

- Creato `assets/soccer-data/fbref-player-map.v376.json`.
- Creato `assets/soccer-data/fbref-player-map.v376.csv`.
- Creato `assets/soccer-data/fbref-review-batch.v376.csv`.
- Aggiornato `assets/soccer-data/manifest.json` a V376.
- Aggiornato il loader Soccer Data al mapping V376.
- Aggiunto marker runtime `window.ZonaOrientaleSoccerDataFbrefBatchV376`.
- Aggiunto audit `tools/audit-soccer-data-fbref-batch-v376.mjs`.
- Aggiornato `check-zonaorientale.sh` includendo l'audit V376.
- Aggiornati footer/cache-buster a V376.

## Numeri

- Giocatori `IN_LISTONE`: 532.
- Asteriscati esclusi: 131.
- Mapping confermati dopo V376: 200.
- Nuovi mapping batch-04: 50.
- Mapping ancora da completare: 332.

## Vincoli rispettati

- Nessuna funzionalita rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser verso FBref.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.

## Test

```bash
node --check assets/app.js
node --check assets/js/market/transfer-market.js
node tools/audit-soccer-data-v371.mjs --quiet
node tools/audit-soccer-data-mapping-v372.mjs --quiet
node tools/audit-soccer-data-fbref-batch-v376.mjs --quiet
bash tools/check-zonaorientale.sh
```
````

---

## 31. `release/RELEASE_V377_SOCCER_DATA_FBREF_BATCH_05.md`

- Percorso originale: `release/RELEASE_V377_SOCCER_DATA_FBREF_BATCH_05.md`
- Dimensione originale: 1471 byte
- SHA-256: `bafaa113532ffc9d0b555e28076edf6019f2e0327d653e00dfd213e7ea0831e9`

````markdown
# Release V377 - Soccer Data FBref batch-05

## Obiettivo

Aggiungere il quinto batch di associazioni reali ZonaOrientale -> FBref, mantenendo la sezione Soccer Data additiva, read-only e limitata ai soli giocatori presenti nel listone.

## Modifiche

- Creato `assets/soccer-data/fbref-player-map.v377.json`.
- Creato `assets/soccer-data/fbref-player-map.v377.csv`.
- Creato `assets/soccer-data/fbref-review-batch.v377.csv`.
- Aggiornato `assets/soccer-data/manifest.json` a V377.
- Aggiornato il loader Soccer Data al mapping V377.
- Aggiunto marker runtime `window.ZonaOrientaleSoccerDataFbrefBatchV377`.
- Aggiunto audit `tools/audit-soccer-data-fbref-batch-v377.mjs`.
- Aggiornato `check-zonaorientale.sh` includendo l'audit V377.
- Aggiornati footer/cache-buster a V377.

## Numeri

- Giocatori `IN_LISTONE`: 532.
- Asteriscati esclusi: 131.
- Mapping confermati dopo V377: 250.
- Nuovi mapping batch-05: 50.
- Mapping ancora da completare: 282.

## Vincoli rispettati

- Nessuna funzionalita rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser verso FBref.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.

## Test

```bash
node --check assets/app.js
node --check assets/js/market/transfer-market.js
node tools/audit-soccer-data-v371.mjs --quiet
node tools/audit-soccer-data-mapping-v372.mjs --quiet
node tools/audit-soccer-data-fbref-batch-v377.mjs --quiet
bash tools/check-zonaorientale.sh
```
````

---

## 32. `release/RELEASE_V378_SOCCER_DATA_FBREF_BATCH_06.md`

- Percorso originale: `release/RELEASE_V378_SOCCER_DATA_FBREF_BATCH_06.md`
- Dimensione originale: 1527 byte
- SHA-256: `0303db9cf2cf7cfca309f4607ec66c91d757f97fa41c9f7b0779f706e8708be4`

````markdown
# Release V378 - Soccer Data FBref batch-06

## Obiettivo

Aggiungere il sesto batch di associazioni reali ZonaOrientale -> FBref, mantenendo la sezione Soccer Data additiva, read-only e limitata ai soli giocatori presenti nel listone.

## Modifiche

- Creato `assets/soccer-data/fbref-player-map.v378.json`.
- Creato `assets/soccer-data/fbref-player-map.v378.csv`.
- Creato `assets/soccer-data/fbref-review-batch.v378.csv`.
- Aggiornato `assets/soccer-data/manifest.json` a V378.
- Aggiornato il loader Soccer Data al mapping V378.
- Aggiunto marker runtime `window.ZonaOrientaleSoccerDataFbrefBatchV378`.
- Aggiunto audit `tools/audit-soccer-data-fbref-batch-v378.mjs`.
- Aggiornato `check-zonaorientale.sh` includendo l'audit V378.
- Reso l'audit V377 compatibile con versioni successive.
- Aggiornati footer/cache-buster a V378.

## Numeri

- Giocatori `IN_LISTONE`: 532.
- Asteriscati esclusi: 131.
- Mapping confermati dopo V378: 300.
- Nuovi mapping batch-06: 50.
- Mapping ancora da completare: 232.

## Vincoli rispettati

- Nessuna funzionalita rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser verso FBref.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.

## Test

```bash
node --check assets/app.js
node --check assets/js/market/transfer-market.js
node tools/audit-soccer-data-v371.mjs --quiet
node tools/audit-soccer-data-mapping-v372.mjs --quiet
node tools/audit-soccer-data-fbref-batch-v378.mjs --quiet
bash tools/check-zonaorientale.sh
```
````

---

## 33. `release/RELEASE_V379_SOCCER_DATA_FBREF_BATCH_07.md`

- Percorso originale: `release/RELEASE_V379_SOCCER_DATA_FBREF_BATCH_07.md`
- Dimensione originale: 1518 byte
- SHA-256: `c1d016b4fa59b633a00563c9a6a4b963bd02b494aeb04a16c53a16c56b798f58`

````markdown
# Release V379 - Soccer Data FBref batch-07

## Obiettivo

Aggiungere il settimo batch di associazioni reali ZonaOrientale -> FBref, mantenendo Soccer Data additiva, read-only e limitata ai soli giocatori presenti nel listone.

## Modifiche

- Creato `assets/soccer-data/fbref-player-map.v379.json`.
- Creato `assets/soccer-data/fbref-player-map.v379.csv`.
- Creato `assets/soccer-data/fbref-review-batch.v379.csv`.
- Aggiornato `assets/soccer-data/manifest.json` a V379.
- Aggiornato il loader Soccer Data al mapping V379.
- Aggiunto marker runtime `window.ZonaOrientaleSoccerDataFbrefBatchV379`.
- Aggiunto audit `tools/audit-soccer-data-fbref-batch-v379.mjs`.
- Aggiornato `check-zonaorientale.sh` includendo l'audit V379.
- Reso l'audit V378 compatibile con versioni successive.
- Aggiornati footer/cache-buster a V379.

## Numeri

- Giocatori `IN_LISTONE`: 532.
- Asteriscati esclusi: 131.
- Mapping confermati dopo V379: 350.
- Nuovi mapping batch-07: 50.
- Mapping ancora da completare: 182.

## Vincoli rispettati

- Nessuna funzionalita rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser verso FBref.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.

## Test

```bash
node --check assets/app.js
node --check assets/js/market/transfer-market.js
node tools/audit-soccer-data-v371.mjs --quiet
node tools/audit-soccer-data-mapping-v372.mjs --quiet
node tools/audit-soccer-data-fbref-batch-v379.mjs --quiet
bash tools/check-zonaorientale.sh
```
````

---

## 34. `release/RELEASE_V380_SOCCER_DATA_FBREF_BATCH_08.md`

- Percorso originale: `release/RELEASE_V380_SOCCER_DATA_FBREF_BATCH_08.md`
- Dimensione originale: 1516 byte
- SHA-256: `6ceae61a9164fff98a42efe660d045530e81d08744e05b2aaadc2a6bc601424b`

````markdown
# Release V380 - Soccer Data FBref batch-08

## Obiettivo

Aggiungere l'ottavo batch di associazioni reali ZonaOrientale -> FBref, mantenendo Soccer Data additiva, read-only e limitata ai soli giocatori presenti nel listone.

## Modifiche

- Creato `assets/soccer-data/fbref-player-map.v380.json`.
- Creato `assets/soccer-data/fbref-player-map.v380.csv`.
- Creato `assets/soccer-data/fbref-review-batch.v380.csv`.
- Aggiornato `assets/soccer-data/manifest.json` a V380.
- Aggiornato il loader Soccer Data al mapping V380.
- Aggiunto marker runtime `window.ZonaOrientaleSoccerDataFbrefBatchV380`.
- Aggiunto audit `tools/audit-soccer-data-fbref-batch-v380.mjs`.
- Aggiornato `check-zonaorientale.sh` includendo l'audit V380.
- Reso l'audit V379 compatibile con versioni successive.
- Aggiornati footer/cache-buster a V380.

## Numeri

- Giocatori `IN_LISTONE`: 532.
- Asteriscati esclusi: 131.
- Mapping confermati dopo V380: 400.
- Nuovi mapping batch-08: 50.
- Mapping ancora da completare: 132.

## Vincoli rispettati

- Nessuna funzionalita rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser verso FBref.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.

## Test

```bash
node --check assets/app.js
node --check assets/js/market/transfer-market.js
node tools/audit-soccer-data-v371.mjs --quiet
node tools/audit-soccer-data-mapping-v372.mjs --quiet
node tools/audit-soccer-data-fbref-batch-v380.mjs --quiet
bash tools/check-zonaorientale.sh
```
````

---

## 35. `release/RELEASE_V381_SOCCER_DATA_FBREF_BATCH_09.md`

- Percorso originale: `release/RELEASE_V381_SOCCER_DATA_FBREF_BATCH_09.md`
- Dimensione originale: 1351 byte
- SHA-256: `cc25351c6572c67267d55b96553da62e2e9651abcbceb32f46426f9fce1eaf3c`

```markdown
# RELEASE V381 - Soccer Data FBref batch-09

Data: 2026-06-05
Branch previsto: `refactor/260528-zonaorientale-next`

## Obiettivo

Completare il nono batch di associazioni ZonaOrientale -> FBref mantenendo la sezione Soccer Data read-only e limitata ai soli giocatori `IN_LISTONE`.

## Esito

- Giocatori a listone attivo: 532.
- Asteriscati/non `IN_LISTONE` esclusi: 131.
- Mapping confermati prima della release: 400.
- Nuovi mapping confermati V381: 50.
- Mapping confermati totali: 450.
- Mapping rimanenti: 82.

## Vincoli preservati

- Nessuna funzionalita rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser verso FBref.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Soccer Data mostra solo giocatori `IN_LISTONE`.

## File principali

- `assets/soccer-data/fbref-player-map.v381.json`
- `assets/soccer-data/fbref-player-map.v381.csv`
- `assets/soccer-data/fbref-review-batch.v381.csv`
- `assets/soccer-data/manifest.json`
- `tools/audit-soccer-data-fbref-batch-v381.mjs`
- `tools/check-zonaorientale.sh`
- `assets/app.js`

## Note mapping

Il batch include casi con iniziali/omonimi/nomi FBref diversi dal listone: Mendy P., Amorim, Patric, Bayo V., Dominguez B., Bozhinov, Vural, Faye, Pessina Mas. e altri. Le motivazioni sono tracciate nel campo `notes` del mapping.
```

---

## 36. `release/RELEASE_V382_SOCCER_DATA_FBREF_BATCH_10.md`

- Percorso originale: `release/RELEASE_V382_SOCCER_DATA_FBREF_BATCH_10.md`
- Dimensione originale: 1348 byte
- SHA-256: `077cef49dcc1dcd4abc08a95bc788e07ed56fed386a41a0c5eb1984fd96771b8`

```markdown
# RELEASE V382 - Soccer Data FBref batch-10

Data: 2026-06-05
Branch previsto: `refactor/260528-zonaorientale-next`

## Obiettivo

Completare il decimo batch di associazioni ZonaOrientale -> FBref mantenendo Soccer Data read-only e limitata ai soli giocatori `IN_LISTONE`.

## Esito

- Giocatori a listone attivo: 532.
- Asteriscati/non `IN_LISTONE` esclusi: 131.
- Mapping confermati prima della release: 450.
- Nuovi mapping confermati V382: 50.
- Mapping confermati totali: 500.
- Mapping rimanenti: 32.

## Vincoli preservati

- Nessuna funzionalita rimossa.
- Nessun file runtime cancellato.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser verso FBref.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Soccer Data mostra solo giocatori `IN_LISTONE`.

## File principali

- `assets/soccer-data/fbref-player-map.v382.json`
- `assets/soccer-data/fbref-player-map.v382.csv`
- `assets/soccer-data/fbref-review-batch.v382.csv`
- `assets/soccer-data/manifest.json`
- `tools/audit-soccer-data-fbref-batch-v382.mjs`
- `tools/check-zonaorientale.sh`
- `assets/app.js`

## Note mapping

Il batch include casi con accenti, iniziali e nomi non coincidenti fra listone e FBref: Sala A., Fofana Sa., Jean, Perez M., Mikolajewski, Albarracin, Nicolas, Christensen O., Onana J. e altri. Le motivazioni sono tracciate in `notes`.
```

---

## 37. `release/RELEASE_V385_SOCCER_DATA_ASSOCIAZIONE_FBREF.md`

- Percorso originale: `release/RELEASE_V385_SOCCER_DATA_ASSOCIAZIONE_FBREF.md`
- Dimensione originale: 871 byte
- SHA-256: `3f94e91ac1809bb22e5ffe70353c622c583692b741e5bf15aaad74705f5ae860`

```markdown
# Release V385 - Soccer Data associazione FBref locale

## Sintesi

V385 rende operativo il collegamento dei nuovi giocatori non mappati: il sito consente di incollare un link FBref e generare una patch JSON esportabile, senza scritture Firebase e senza scraping live.

## File principali

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/audit-soccer-data-association-patch-v385.mjs`
- `docs/zonaorientale/FUNZIONALITAV385.md`
- `docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V385.md`
- `docs/zonaorientale/audit/SOCCER_DATA_ASSOCIAZIONE_FBREF_V385.md`

## Invarianti

- `assets/soccer-data/manifest.json` resta su `fbref-player-map.v383.json`.
- Nessun file `fbref-player-map.v385.json` viene creato.
- `FUNZIONALITA'.md` non viene modificato.
- Firebase/Auth/EmailJS/Netlify Functions non vengono toccati.
```

---

## 38. `release/RELEASE_V389_SOCCER_DATA_ASSETS_CLEANUP.md`

- Percorso originale: `release/RELEASE_V389_SOCCER_DATA_ASSETS_CLEANUP.md`
- Dimensione originale: 472 byte
- SHA-256: `afe8d39f0a739d72aac23cb32751b576196a9ef2ec0e068c3bef173a573fe172`

```markdown
# Release V389 - Soccer Data assets cleanup

Release additiva e conservativa.

## Incluso

- Pulizia asset pubblici Soccer Data.
- Archivio storico mapping/review nei docs.
- Manifest base per futuri import statistiche statiche.
- Card di stato `Stats import` nel riepilogo Soccer Data.

## Escluso

- Nessun dato statistico reale importato.
- Nessuna interrogazione FBref live.
- Nessuna modifica Firebase.
- Nessuna modifica a comunicati, listone, rose o calciomercato.
```

---

## 39. `SOCCER_DATA_API_FOOTBALL_V397.md`

- Percorso originale: `SOCCER_DATA_API_FOOTBALL_V397.md`
- Dimensione originale: 881 byte
- SHA-256: `54ffaa346aa2302f0a35c41db53412dd94fd2e298e23b68c446709ae4e0276a3`

```markdown
# V397 - Soccer Data API-Football diagnostica rose

Intervento mirato solo su Soccer Data.

## Obiettivo

Correggere il caso in cui API-Football risponde senza squadre per `teams?league=135&season=<stagione>` e la UI mostrava solo un errore generico.

## Modifiche

- La Netlify Function ora mostra gli errori API-Football reali invece di trasformarli in `nessuna squadra`.
- Aggiunta azione `status`/diagnostica per verificare piano, sottoscrizione e richieste giornaliere.
- Il download rose prova la stagione del listone e, se vuota, anche stagione precedente e successiva.
- La UI mostra la stagione API realmente usata e avvisa se e stato usato un fallback.
- Nessuna modifica a mapping profili, comunicati, rose, calciomercato, competizioni o snapshot.

## Note operative

Se `Scarica rose Serie A API` continua a fallire, usare prima `Diagnostica API` da Soccer Data admin.
```

---

## 40. `test/SOCCER_DATA_API_FOOTBALL_SQUADS_MAPPING_V396.md`

- Percorso originale: `test/SOCCER_DATA_API_FOOTBALL_SQUADS_MAPPING_V396.md`
- Dimensione originale: 1583 byte
- SHA-256: `3a2cf418ee0f568f3d294afa145e8f5700c3b442c5421b6bb9ece1b916d78c42`

````markdown
# Test V396 - Soccer Data mapping API-Football da rose

## Test automatici
Eseguire dalla cartella `static/zonaorientale` dopo aver applicato lo zip:

```bash
node tools/audit-soccer-data-api-football-squads-v396.mjs
node tools/audit-soccer-data-api-football-mapping-v395.mjs
node tools/audit-soccer-data-api-football-v394.mjs
node --check assets/app.js
node --check ../netlify/functions/api-football-player-stats.js
find assets -name '*.js' -type f -print0 | xargs -0 -n 1 node --check
```

## Test manuale online
1. Pubblicare la V396 su Netlify production o branch deploy con function attiva.
2. Verificare che `ZONAORIENTALE_API_FOOTBALL_KEY` sia configurata su Netlify.
3. Aprire Soccer Data da admin.
4. Verificare che i non-admin vedano solo la tabella in sola lettura.
5. Premere `Scarica rose Serie A API`.
6. Confermare il warning sulle richieste API.
7. Verificare che lo stato mostri progressivamente le squadre scaricate.
8. Premere `Genera mapping da rose`.
9. Verificare che il riepilogo indichi confermati, da verificare e mancanti.
10. Su una riga senza ID confermato, premere `Trova ID API`: se la cache rose ha candidati, il prompt deve mostrarli senza chiamata API di ricerca.
11. Premere `Scarica mapping API` e controllare che il JSON contenga i `apiFootballId` confermati.

## Regressioni da controllare
- Il nome giocatore resta cliccabile verso il profilo quando il link e disponibile.
- La colonna `Aggiornato` resta presente.
- `Recupera statistiche` resta admin-only e salva/cache su Firebase o fallback locale.
- Nessun comando API compare ai non-admin.
````

---

## 41. `test/SOCCER_DATA_ASSETS_CLEANUP_V389.md`

- Percorso originale: `test/SOCCER_DATA_ASSETS_CLEANUP_V389.md`
- Dimensione originale: 731 byte
- SHA-256: `a480e297bfe20ae1c5d995c757d127964f68d93cf60c98565bfcd4f1bb296de1`

````markdown
# Test V389 - Soccer Data assets cleanup

## Verifiche automatiche

```bash
node tools/audit-soccer-data-assets-cleanup-v389.mjs
node tools/audit-soccer-data-admin-only-v386.mjs
node tools/audit-soccer-data-mobile-table-v387.mjs
node tools/audit-admin-snapshot-dates-v388.mjs
node tools/audit-soccer-data-fbref-batch-v383.mjs
node --check assets/app.js
find assets -name '*.js' -type f -print0 | xargs -0 -n 1 node --check
```

## Esito atteso

- Gli asset pubblici Soccer Data restano ridotti a `manifest.json`, `fbref-player-map.v383.json` e `stats/manifest.json`.
- Gli storici sono presenti nei docs archive.
- Il mapping V383 resta valido.
- Soccer Data resta solo admin.
- Nessuna scrittura Firebase e nessuno scraping live.
````

---

## 42. `test/SOCCER_DATA_FBREF_BATCH_01_V373.md`

- Percorso originale: `test/SOCCER_DATA_FBREF_BATCH_01_V373.md`
- Dimensione originale: 609 byte
- SHA-256: `a0ed7e63f642bc14ee599481e50f6239b22e5c4ffb80b4fc90e995326f59a6ce`

````markdown
# Test manuale Soccer Data FBref batch-01 V373

1. Verificare footer `V373`.
2. Aprire `Soccer Data`.
3. Impostare filtro mapping su `Mappati`.
4. Verificare che compaiano 50 giocatori.
5. Aprire alcuni link FBref del batch-01, per esempio Dimarco, Lautaro, Paz N., Konè I., Esposito F.P.
6. Impostare filtro mapping su `Da associare` e verificare che gli altri giocatori restino presenti.
7. Verificare che Area squadra, Admin, Listone, Rose, Competizioni, Player page e Calciomercato siano ancora funzionanti.
8. In console browser eseguire:

```js
ZonaOrientaleSoccerDataFbrefBatchV373.runSmokeTest()
```
````

---

## 43. `test/SOCCER_DATA_FBREF_BATCH_02_V374.md`

- Percorso originale: `test/SOCCER_DATA_FBREF_BATCH_02_V374.md`
- Dimensione originale: 903 byte
- SHA-256: `bd666ec15f0fabb5c9f3692c79af901235addbdf8a865de3803e60566f6bb08e`

````markdown
# Test V374 - Soccer Data FBref batch-02

## Test automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-soccer-data-v371.mjs --quiet
node static/zonaorientale/tools/audit-soccer-data-mapping-v372.mjs --quiet
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v374.mjs --quiet
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Test manuale

1. Verificare footer V374.
2. Aprire Soccer Data.
3. Filtrare su Mappati.
4. Verificare che i mappati siano 100.
5. Verificare alcuni link FBref del batch-02.
6. Filtrare su Da associare e verificare che i restanti giocatori restino visibili.
7. Controllare Admin, Area squadra, Trattative, Listone, Competizioni e Scheda giocatore.

## Console browser

```js
ZonaOrientaleSoccerDataFbrefBatchV374.runSmokeTest()
```
````

---

## 44. `test/SOCCER_DATA_FBREF_BATCH_03_V375.md`

- Percorso originale: `test/SOCCER_DATA_FBREF_BATCH_03_V375.md`
- Dimensione originale: 750 byte
- SHA-256: `b03353fe6e2b4cdfb9e6e69771afc2f6321a8217af06a1c9041392b697c1aebd`

````markdown
# Test V375 - Soccer Data FBref batch-03

## Test manuale consigliato

1. Verificare footer `V375`.
2. Aprire `Soccer Data`.
3. Filtrare su `Mappati` e verificare 150 giocatori.
4. Aprire link FBref rappresentativi del batch-03: Dumfries, Dybala, Di Lorenzo, Zaccagni, Cambiaso, Provedel, Mkhitaryan, Montipo.
5. Filtrare su `Da associare` e verificare che gli altri giocatori restino visibili.
6. Controllare Admin, Area squadra, Listone, Competizioni e Scheda giocatore.

## Test automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v375.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```
````

---

## 45. `test/SOCCER_DATA_FBREF_BATCH_04_V376.md`

- Percorso originale: `test/SOCCER_DATA_FBREF_BATCH_04_V376.md`
- Dimensione originale: 854 byte
- SHA-256: `7f1f8d4cf79d64122dd1fdf028a489bf7ed3ee5de9a4d3d2eb7a61c1f7cbd97a`

````markdown
# Test Soccer Data FBref batch-04 V376

## Test automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v376.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Test manuale

1. Verificare footer `V376`.
2. Aprire `Soccer Data`.
3. Filtrare su `Mappati`.
4. Verificare che risultino 200 mapping confermati.
5. Aprire alcuni link del batch-04: Alisson Santos, Raspadori, Tomori, Zambo Anguissa, Rensch, Carlos Augusto, Buongiorno, Lucumi, Cambiaghi.
6. Filtrare su `Da associare` e verificare che gli altri giocatori restino presenti.
7. Verificare Admin, Area squadra, Listone, Competizioni e Scheda giocatore.

## Console browser

```js
ZonaOrientaleSoccerDataFbrefBatchV376.runSmokeTest()
```
````

---

## 46. `test/SOCCER_DATA_FBREF_BATCH_05_V377.md`

- Percorso originale: `test/SOCCER_DATA_FBREF_BATCH_05_V377.md`
- Dimensione originale: 838 byte
- SHA-256: `e3b69702964992ad8facd0e6ec905de7629997a7f1f03f86060dccce87401386`

````markdown
# Test Soccer Data FBref batch-05 V377

## Test automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v377.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Test manuale

1. Verificare footer `V377`.
2. Aprire `Soccer Data`.
3. Filtrare su `Mappati`.
4. Verificare che risultino 250 mapping confermati.
5. Aprire alcuni link del batch-05: Füllkrug, Gabbia, Giménez, Maldini, Skorupski, Zapata, Neres, Dovbyk, Fabbian, Olivera.
6. Filtrare su `Da associare` e verificare che gli altri giocatori restino presenti.
7. Verificare Admin, Area squadra, Listone, Competizioni e Scheda giocatore.

## Console browser

```js
ZonaOrientaleSoccerDataFbrefBatchV377.runSmokeTest()
```
````

---

## 47. `test/SOCCER_DATA_FBREF_BATCH_06_V378.md`

- Percorso originale: `test/SOCCER_DATA_FBREF_BATCH_06_V378.md`
- Dimensione originale: 833 byte
- SHA-256: `7b82bbe6bf287eb02bd760ea99d8a137272ca48377bdf3c578970e8c207a8019`

````markdown
# Test Soccer Data FBref batch-06 V378

## Test automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v378.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Test manuale

1. Verificare footer `V378`.
2. Aprire `Soccer Data`.
3. Filtrare su `Mappati`.
4. Verificare che risultino 300 mapping confermati.
5. Aprire alcuni link del batch-06: Cheddira, Meret, Solomon, Gila, Lukaku, Acerbi, Perin, Dallinga, Camarda, Kossounou.
6. Filtrare su `Da associare` e verificare che gli altri giocatori restino presenti.
7. Verificare Admin, Area squadra, Listone, Competizioni e Scheda giocatore.

## Console browser

```js
ZonaOrientaleSoccerDataFbrefBatchV378.runSmokeTest()
```
````

---

## 48. `test/SOCCER_DATA_FBREF_BATCH_07_V379.md`

- Percorso originale: `test/SOCCER_DATA_FBREF_BATCH_07_V379.md`
- Dimensione originale: 606 byte
- SHA-256: `718e79409606e2df514bf2c58694498301ea7c75c781c6bc3113b0da58f4bd56`

````markdown
# Test V379 - Soccer Data FBref batch-07

## Automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v379.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Manuali

1. Verificare footer `V379`.
2. Aprire `Soccer Data`.
3. Filtrare `Mappati`: attesi 350 giocatori.
4. Aprire alcuni link FBref batch-07.
5. Verificare che `Da associare` mostri ancora i non completati.
6. Controllare Admin, Area squadra, Listone, Competizioni e Scheda giocatore.
````

---

## 49. `test/SOCCER_DATA_FBREF_BATCH_08_V380.md`

- Percorso originale: `test/SOCCER_DATA_FBREF_BATCH_08_V380.md`
- Dimensione originale: 606 byte
- SHA-256: `0f17b6a9b3221242765db07b157bee23a07a7f42d2a8bb219334676f11ecc363`

````markdown
# Test V380 - Soccer Data FBref batch-08

## Automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v380.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Manuali

1. Verificare footer `V380`.
2. Aprire `Soccer Data`.
3. Filtrare `Mappati`: attesi 400 giocatori.
4. Aprire alcuni link FBref batch-08.
5. Verificare che `Da associare` mostri ancora i non completati.
6. Controllare Admin, Area squadra, Listone, Competizioni e Scheda giocatore.
````

---

## 50. `test/SOCCER_DATA_FBREF_BATCH_09_V381.md`

- Percorso originale: `test/SOCCER_DATA_FBREF_BATCH_09_V381.md`
- Dimensione originale: 565 byte
- SHA-256: `117db8f50865661f86893d12dec185690d90cf274be2b69c1afcee7b0fa726db`

````markdown
# Test Soccer Data FBref batch-09 V381

1. Verificare footer `V381`.
2. Aprire `Soccer Data`.
3. Filtrare su `Mappati`.
4. Verificare che i mapping confermati siano 450.
5. Aprire link FBref campione: Suslov, Rugani, Rovella, Estupinan, Faye, Pessina Mas., Gollini.
6. Verificare che il filtro `Da associare` mostri ancora i rimanenti.
7. Verificare Admin, Area squadra, Listone, Competizioni e Scheda giocatore.
8. Eseguire:

```bash
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v381.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```
````

---

## 51. `test/SOCCER_DATA_FBREF_BATCH_10_V382.md`

- Percorso originale: `test/SOCCER_DATA_FBREF_BATCH_10_V382.md`
- Dimensione originale: 569 byte
- SHA-256: `1dcc1ea4dda8116f71e7cbb770d08cde84d12f0f58739648da7c0f54e9379477`

````markdown
# Test Soccer Data FBref batch-10 V382

1. Verificare footer `V382`.
2. Aprire `Soccer Data`.
3. Filtrare su `Mappati`.
4. Verificare che i mapping confermati siano 500.
5. Aprire link FBref campione: Iling Junior, Sala A., Fofana Sa., Jean, Nicolas, Scuffet, Padelli.
6. Verificare che il filtro `Da associare` mostri ancora 32 rimanenti.
7. Verificare Admin, Area squadra, Listone, Competizioni e Scheda giocatore.
8. Eseguire:

```bash
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v382.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```
````

---

## 52. `test/SOCCER_DATA_MAPPING_V372.md`

- Percorso originale: `test/SOCCER_DATA_MAPPING_V372.md`
- Dimensione originale: 715 byte
- SHA-256: `72ae6a57191937cb41c51f922293a7095a20dcf6e652f1cfc8e2cc9e5a0e5b74`

````markdown
# Test Soccer Data mapping assistito V372

## Test automatici

```bash
node --check static/zonaorientale/assets/app.js
node static/zonaorientale/tools/audit-soccer-data-mapping-v372.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Test manuali

1. Aprire il sito e verificare footer V372.
2. Aprire `Soccer Data`.
3. Verificare che i giocatori mostrati siano 532.
4. Usare filtro `Da associare`.
5. Aprire un link `Cerca FBref`.
6. Usare `Copia riga` su un giocatore.
7. Usare `Copia CSV da rivedere`.
8. Verificare che Listone, Area squadra, Admin, competizioni e scheda giocatore siano ancora navigabili.

## Console browser

```js
ZonaOrientaleSoccerDataMappingAssistantV372.runSmokeTest()
```
````

---

## 53. `test/SOCCER_DATA_STATIC_STATS_TEMPLATE_V390.md`

- Percorso originale: `test/SOCCER_DATA_STATIC_STATS_TEMPLATE_V390.md`
- Dimensione originale: 1050 byte
- SHA-256: `5f653e3574a87ab8b011be2bc726687e62e6c78bbdc0cc7f58aaafc3b62cc73e`

```markdown
# Soccer Data static stats template V390

## Obiettivo

Aggiungere file statici compilabili per le statistiche giocatore, senza scraping live e senza scritture Firebase.

## File runtime aggiunti

- `static/zonaorientale/assets/soccer-data/stats/player-stats-summary-2025-2026.v001.json`
- `static/zonaorientale/assets/soccer-data/stats/player-stats-summary-2025-2026.v001.template.csv`

Entrambi contengono tutti i 532 giocatori attivi del mapping `fbref-player-map.v383.json`. I campi statistici numerici sono `null`/vuoti: nessun dato inventato.

## Flusso previsto

1. Scaricare il CSV template da admin Soccer Data.
2. Compilare offline solo con dati verificati.
3. Convertire/aggiornare il JSON summary statico.
4. Aggiornare `assets/soccer-data/stats/manifest.json`.
5. Commit + deploy.

## Vincoli preservati

- Nessuno scraping live dal browser.
- Nessuna scrittura Firebase.
- Mapping V383 invariato.
- Soccer Data resta pubblico in sola lettura.
- Comandi template/export visibili e attivi solo admin.
- `FUNZIONALITA'.md` non modificato.
```

---

## 54. `test/SOCCER_DATA_V371.md`

- Percorso originale: `test/SOCCER_DATA_V371.md`
- Dimensione originale: 776 byte
- SHA-256: `7523f7cf7c38e1d438e0561e3a3155cf278ad392aa395f9dd62cda9804cc1221`

````markdown
# Test manuale V371 - Soccer Data

1. Aprire la home.
2. Verificare footer V371.
3. Aprire `Soccer Data` dalla nav desktop.
4. Aprire `Soccer Data` dal menu mobile `Altro`.
5. Verificare riepilogo giocatori attivi.
6. Provare filtro ruolo.
7. Provare filtro squadra reale.
8. Provare filtro `Da associare`.
9. Cercare un giocatore presente nel listone.
10. Cliccare `Cerca FBref`.
11. Cliccare `Copia CSV associazioni`.
12. Cliccare `Scarica mapping base`.
13. Tornare al Listone e verificare che funzioni come prima.
14. Login presidente: verificare Dashboard Presidente V369 e Centro notifiche V370.
15. Login Admin: verificare Cruscotto pre-deploy V368.
16. Aprire `competition.html` e `player.html`.

## Smoke console

```js
ZonaOrientaleSoccerDataV371.runSmokeTest()
```
````

---

---

## Nota architetturale V408

- Nessuna modifica a Firebase, regole, collezioni, snapshot pubblici, Soccer Data o Netlify.
- L'intervento V408 e solo UI/CSS/markup di tabella nel rendering della Rosa espansa.
- La sorgente dati delle rose e invariata; cambiano solo classi e regole di presentazione.

## Nota architetturale V419 - Archivio stagioni

- La modifica V419 non introduce nuove letture Firebase e non cambia i dati sorgente.
- Archivio Stagioni continua a usare lo snapshot statico della stagione quando disponibile.
- I comunicati della timeline sono ordinati lato client usando `publishedAt`, `publishAt`, `date`, `createdAt`, `updatedAt` o `timestamp`, senza alterare lo snapshot.
- Il vincitore in Competizioni usa l'identificativo `seasonTeamId` quando disponibile per mostrare anche il logo squadra.

## Nota architetturale V425

- Modifica CSS-only piu marker runtime descrittivo in `assets/app.js`.
- Nessuna modifica a repository dati, Firebase, snapshot, feed, Soccer Data, Netlify Functions o modelli applicativi.
- La scala mobile e centralizzata in `assets/css/refactor/mobile-controls.css`.

## V430 - Impatto architetturale

Nessun impatto su Firebase, auth, schema dati, Netlify Functions o sorgenti dati. La modifica e solo CSS/guardrail runtime per la view Admin mobile.

## Nota V441 - Ruoli Mantra

I filtri Mantra usano i campi gia presenti nei listoni/snapshot, in particolare `mantraRoles` e alias equivalenti, con fallback al giocatore del listone quando la rosa contiene solo ruolo standard. Non vengono introdotti nuovi dataset o nuove collection Firebase.
