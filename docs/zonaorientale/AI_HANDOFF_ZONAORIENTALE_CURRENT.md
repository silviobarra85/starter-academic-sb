# AI Handoff ZonaOrientale - Current V230

Ultimo aggiornamento documentale: 25/05/2026.

## Stato corrente in una frase

Il sito ZonaOrientale e' una webapp statica HTML/CSS/JS puro, attualmente funzionante in **V230**, con dati pubblici prioritariamente serviti da JSON statici, Firebase usato per live/fallback/admin, UI mobile uniformata, Archivio/Statistiche/Confronta ripristinati, hotfix V227 sui saldi FM in Archivio, primo ciclo refactor tecnico V220-V225 chiuso e pagine statiche per anteprime WhatsApp dei comunicati e pulsante account presidente personalizzato in header e hotfix V230 sui link comunicati/WhatsApp.

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




## Hotfix V230 - Link WhatsApp/preview comunicati

V230 corregge i 404 dei link WhatsApp/preview comunicati introdotti dalla V228. La causa era l'uso hardcoded del dominio `https://www.silviobarra.com/zonaorientale/`, mentre il sito pubblico corretto usa `https://silviobarra.com/zonaorientale/` senza `www`.

Regole V230:

- `NEWS_SHARE_DEFAULT_BASE_URL_V228` ora punta a `https://silviobarra.com/zonaorientale/`;
- i link copiati dal browser non usano piu' un host fisso: `getNewsShareBaseUrlV230()` calcola la base dal path corrente;
- le pagine statiche `comunicati/*.html` hanno canonical/OG non-`www`;
- le pagine statiche reindirizzano con path relativo (`../#news-id` o `./#news-id`) per evitare 404 se cambia host;
- dopo un nuovo comunicato bisogna sempre rigenerare e committare `news.html`, `index.html` e `comunicati/*.html`.

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

## Fix V228 - Comunicati condivisibili WhatsApp

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

Nota: se il comunicato e' stato salvato solo su Firebase ma non sono stati rigenerati/deployati snapshot e pagine statiche, WhatsApp continuera a vedere la preview precedente o generica.

## Fix V227 - FM Archivio

Il bug rilevato in Archivio era causato dal rendering delle card squadra: veniva letto solo `seasonTeam.fmBalance`, ma gli snapshot pubblici non salvano quel campo dentro `seasonTeams`.

La V227 introduce una risoluzione robusta del saldo FM Archivio:

1. campo diretto su `seasonTeams`, se presente (`fmBalance`, `balance`, `remainingCredits`, ecc.);
2. snapshot statici `assets/rose/*.json`, abbinati per stagione e nome squadra, usando `remainingCredits`;
3. somma dei `fmMovements` della stagione come fallback.

Se nessuna sorgente contiene il dato, l'Archivio mostra `-` invece di un falso `0 FM`.

## Versione corrente codice

Versione sito: **V230 hotfix link comunicati**.

Footer corrente atteso:

```text
ZonaOrientale Salerno · V230 hotfix link comunicati · Ultimo aggiornamento 25/05/2026
```

Cache-buster HTML principali attesi: `?v=229`.

Nota tecnica: in `assets/app.js` la costante diagnostica `DEPLOY_EXPECTED_VERSION_V181` e allineata a `229`. Dopo ogni overlay codice/UI va aggiornata insieme a footer e cache-buster.

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

Versione runtime attesa: **226**. Dopo modifiche successive aggiornare sempre footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181`.
