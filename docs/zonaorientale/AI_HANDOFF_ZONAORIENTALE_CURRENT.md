# AI Handoff ZonaOrientale - Current V222

Ultimo aggiornamento documentale: 25/05/2026.

## Stato corrente in una frase

Il sito ZonaOrientale e' una webapp statica HTML/CSS/JS puro, attualmente funzionante in **V222**, con dati pubblici prioritariamente serviti da JSON statici, Firebase usato per live/fallback/admin, UI mobile uniformata e Archivio/Statistiche/Confronta ripristinati.

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

## Versione corrente codice

Versione sito: **V222 data repository facade**.

Footer corrente atteso:

```text
ZonaOrientale Salerno · V222 data repository facade · Ultimo aggiornamento 25/05/2026
```

Cache-buster HTML principali attesi: `?v=222`.

Nota tecnica: in `assets/app.js` la costante diagnostica `DEPLOY_EXPECTED_VERSION_V181` puo risultare storicamente ferma a un valore precedente. Se si lavora sulla checklist di deploy, allinearla alla versione corrente.

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
```

Stato effettivo:

- **V209 live-data/archive**: attivo. Gestisce comunicati live, mercato/trattative live/lazy e Archivio stagioni.
- **V210 generatore comunicati admin**: attivo. Compila bozze comunicati da dati gia presenti; non deve scrivere automaticamente su Firebase.
- **V211 statistiche/confronta**: presente e, dopo V218/V219, installato realmente nel bootstrap. Gestisce `#stats` e `#compare`.
- **V212 dashboard presidente/rose**: attivo. Gestisce dashboard presidente, helper rose e hub mobile presidente.
- **V213 admin-publication-workflow**: file presente ma **non reinserire nel bootstrap senza test browser**. Era stato disattivato in V214 perche poteva bloccare la visualizzazione dei dati. Se ripreso, installarlo lazy/con try-catch e verificare tutto il bootstrap.

## Stato funzionale recente

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
```

Il nuovo modulo introduce una facciata unica per:

```text
loadCollections(COLLECTIONS)
loadLeagueConfigFromFirebase()
loadStaticAssets() -> listoni, rose, calendari competizioni statici
loadPublicConfig() -> config statica con fallback Firebase
```

`app.js` continua a mantenere la logica di merge, snapshot e render, ma i punti di accesso ai dati sono ora instradati da `window.ZonaOrientaleDataRepository`. Questo prepara il futuro V223/V224 senza cambiare comportamento visibile.

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
