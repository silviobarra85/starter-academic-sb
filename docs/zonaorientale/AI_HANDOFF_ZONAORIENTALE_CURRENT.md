# AI Handoff - ZonaOrientale Salerno Fantacalcio - V186

Data handoff: 21/05/2026
Versione sito: V186 - handoff finale e deploy

## Contesto generale

Il progetto e una webapp statica HTML/CSS/JavaScript puro per il sito del fantacalcio ZonaOrientale Salerno. Non usa build system, npm o bundler. La cartella pubblicata e:

```text
static/zonaorientale/
```

Il sito viene servito localmente da `static`, quindi l'URL locale corretto e:

```text
http://localhost:1313/zonaorientale/
```

Comandi locali richiesti dall'utente quando si consegna un overlay:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Questi comandi presuppongono che ci si trovi dentro `static/zonaorientale`; `cd ..` porta in `static`, da cui `/zonaorientale/` e disponibile.

## Preferenze operative dell'utente

- Ogni overlay deve aggiornare la Version nel footer.
- Ogni overlay deve includere comandi Git con messaggio commit coerente.
- Ogni overlay deve includere i comandi per lanciare in locale.
- Gli overlay devono essere piccoli, progressivi e testabili.
- Evitare modifiche massive a `app.js` se non strettamente necessarie.
- Per asset ignorati da `.gitignore`, usare `git add -f`.

## File principali

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/styles.css
static/zonaorientale/assets/css/mobile-suite-v168.css
static/zonaorientale/assets/firebase.js
static/zonaorientale/assets/emailjs.js
static/zonaorientale/assets/js/admin/public-snapshots.js
```

`assets/app.js` e ancora il file centrale e molto grande. Contiene molte patch/versioni storiche `Vxx`. Qualsiasi refactor futuro deve essere incrementale.

## Architettura dati e riduzione letture Firebase

Obiettivo centrale delle versioni V170-V186: ridurre letture Firebase usando JSON statici su GitHub e snapshot pubblici.

### JSON statici GitHub

Questi file vengono letti via `fetch()` e non consumano letture Firestore:

```text
static/zonaorientale/assets/public/config.json
static/zonaorientale/assets/snapshots/honor.json
static/zonaorientale/assets/snapshots/seasons/manifest.json
static/zonaorientale/assets/snapshots/seasons/<seasonId>.json
static/zonaorientale/assets/listoni/manifest.json
static/zonaorientale/assets/listoni/*.json
static/zonaorientale/assets/rose/manifest.json
static/zonaorientale/assets/rose/*.json
static/zonaorientale/assets/competitions/manifest.json
static/zonaorientale/assets/competitions/**/*.json
```

### `config.json`

Serve a evitare letture pubbliche di `leagueSettings` e `seasons`. Contiene dati minimi di configurazione pubblica: stagione corrente, elenco stagioni e impostazioni pubbliche. Se manca o non e valido, il sito fa fallback su Firebase.

### Snapshot Firestore ancora usati come fallback

```text
publicSeasonSnapshots/{seasonId}
publicSnapshots/honor
publicTeamSnapshots/{seasonId}_{teamId}
```

### Flusso pubblico atteso

1. Config da JSON statico.
2. Snapshot stagione da JSON statico se presente.
3. Fallback a `publicSeasonSnapshots/{seasonId}` se JSON assente.
4. Honor/FIFA da `assets/snapshots/honor.json`.
5. Fallback a `publicSnapshots/honor` se assente.
6. Listoni, rose e competizioni statiche da manifest JSON.

### Flusso admin V178+

L'admin all'avvio usa caricamento leggero. Il full-load admin non parte piu automaticamente. Per leggere le collection granulari occorre premere:

```text
Admin -> Carica dati amministrazione
```

Solo allora vengono lette collection come `rosterEntries`, `competitionResults`, `seasonTeams`, `competitions`, ecc.

## Evoluzione versioni recenti

- V170: Fantamercato lazy, niente letture mercato al caricamento pubblico.
- V171: `assets/public/config.json`; fix mobile admin Account nella stessa riga.
- V172: snapshot stagione statici; focus mobile in alto al cambio scheda.
- V173: `honor.json` statico; date ultimo aggiornamento nei bottoni snapshot.
- V174: collection admin esplicite; `publicTeamSnapshots` fuori dal full-load.
- V175: lazy load pendingUsers/teamRequests; bottone mobile `Su` nel Listone.
- V176: fix azioni mobile Squadra per presidente: `Tutte le Rose` e `Mercato`.
- V177: diagnostica letture Firebase.
- V178: admin leggero all'avvio; debug letture automatico su localhost.
- V179: preflight asset pubblici.
- V180: checklist online finale.
- V181: fix report diagnostici mobile e cache-buster.
- V182: login/logout su Dashboard; wrap celle report.
- V183: fix definitivo prima colonna report diagnostici su mobile.
- V184: stile scuro FIFA Ranking in Albo; spacing titolo Palmarès per competizione.
- V185: admin mobile con 4 tasti sulla stessa riga; testo bottoni Snapshot pubblici centrato; guida funzioni Admin.
- V186: handoff finale, footer/cache-buster/checklist allineati.

## Funzioni admin importanti

### Snapshot pubblici

Percorso: `Admin -> Snapshot pubblici`.

Bottoni principali:

- `Aggiorna stagione selezionata`: aggiorna snapshot Firebase della stagione selezionata.
- `Aggiorna tutte le stagioni`: aggiorna snapshot stagioni Firebase.
- `Aggiorna Albo/FIFA`: aggiorna `publicSnapshots/honor`.
- `Aggiorna schede squadra`: aggiorna `publicTeamSnapshots`.
- `Aggiorna tutto`: aggiorna snapshot stagione, honor/FIFA e schede squadra.
- `Scarica config pubblica`: scarica `config.json` da committare in `assets/public/config.json`.
- `Scarica snapshot stagione JSON`: scarica il JSON della stagione selezionata.
- `Scarica overlay snapshot stagioni`: scarica zip gia strutturato per `assets/snapshots/seasons/`.
- `Scarica honor JSON`: scarica `honor.json` da committare in `assets/snapshots/honor.json`.

Flusso consigliato per aggiornare dati pubblici statici:

```text
1. Admin -> Snapshot pubblici -> Aggiorna tutto
2. Scarica config pubblica
3. Scarica overlay snapshot stagioni
4. Scarica honor JSON
5. Inserisci i file nei percorsi statici corretti
6. Commit e push
```

### Controlla asset pubblici

Controlla solo i JSON statici serviti da GitHub/local statico. Non scrive su Firebase e non legge collection Firestore. Serve a verificare che siano pubblicati nel percorso corretto:

```text
assets/public/config.json
assets/snapshots/seasons/manifest.json
assets/snapshots/honor.json
assets/listoni/manifest.json
assets/rose/manifest.json
assets/competitions/manifest.json
```

### Checklist online finale

Controlla asset pubblici, Version footer, cache-buster, modalita admin leggero, letture Firebase stimate e debug locale. Non scrive su Firebase.

## Diagnostica letture Firebase

Su localhost il debug letture e automatico. Si puo forzare con:

```text
http://localhost:1313/zonaorientale/?debugReads=1
```

Disattivare con:

```text
http://localhost:1313/zonaorientale/?debugReads=0
```

Da console:

```js
ZonaOrientaleFirebaseReads.summary()
ZonaOrientaleFirebaseReads.reset()
ZonaOrientaleFirebaseReads.enable()
ZonaOrientaleFirebaseReads.disable()
```

`SES Removing unpermitted intrinsics` e `A listener indicated an asynchronous response...` sono tipicamente dovuti a estensioni browser, non al sito.

## Test da eseguire sempre dopo overlay

Dalla cartella `static/zonaorientale`:

```bash
node --check assets/app.js
find assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
find assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool
```

Poi server locale:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

URL da provare:

```text
http://localhost:1313/zonaorientale/
http://localhost:1313/zonaorientale/assets/public/config.json
http://localhost:1313/zonaorientale/assets/snapshots/honor.json
http://localhost:1313/zonaorientale/assets/snapshots/seasons/manifest.json
```

## Checklist manuale finale

- Pubblico anonimo: dashboard, rose, listone, albo, competizioni.
- Mobile: cambio scheda deve riportare in alto.
- Mobile Listone: bottone `Su` funzionante.
- Login admin: atterra su Dashboard.
- Logout admin: atterra su Dashboard.
- Login presidente: atterra su Dashboard.
- Logout presidente: atterra su Dashboard.
- Presidente mobile: `Squadra -> Tutte le Rose` e `Squadra -> Mercato` funzionano.
- Admin mobile: `Dark/Light`, `Aggiorna dati`, `Account`, `Logout` sulla stessa riga.
- Admin -> Snapshot pubblici: testo bottoni centrato e date visibili.
- Admin -> Controlla asset pubblici: tabella non sfora su mobile.
- Admin -> Checklist online finale: nessun warning su Version/cache-buster.
- Admin leggero: non deve fare full-load automatico.
- Full-load admin: parte solo con `Carica dati amministrazione`.

## Comandi Git tipici overlay

```bash
git status
git add static/zonaorientale/index.html static/zonaorientale/assets/app.js docs/zonaorientale/REFACTOR_VXXX.md
git commit -m "VXXX descrizione breve"
```

Per file statici ignorati:

```bash
git add -f static/zonaorientale/assets/public/config.json
git add -f static/zonaorientale/assets/snapshots/honor.json
git add -f static/zonaorientale/assets/snapshots/seasons/manifest.json
git add -f static/zonaorientale/assets/snapshots/seasons/*.json
```

## Note di cautela

- Non committare cartelle backup locali.
- Non fare refactor grande di `app.js` senza test intermedi.
- Non rimuovere fallback Firebase: servono se un JSON statico manca o non e aggiornato.
- Non far partire full-load admin all'avvio: e stato il principale punto di riduzione letture.
- Ogni nuova versione deve aggiornare footer, cache-buster e expected version della checklist.


---

## Addendum operativo post V186

- Branch di lavoro nuovo consigliato: `feature/zonaorientale-v187-next`.
- V187 ha introdotto il convertitore rose Excel -> JSON statico + manifest.
- V188 ha corretto il convertitore rose: i nomi squadra dell'Excel vengono preservati, senza normalizzazione o mapping automatico.
- Il flusso dati pubblico resta: JSON statici GitHub -> snapshot Firebase fallback -> collection Firebase granulari solo Admin su richiesta.
- Per ogni overlay futuro del sito aggiornare sempre anche la Version nel footer e i cache-buster.
- Per avviare in locale, da `static/zonaorientale` usare:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire poi `http://localhost:1313/zonaorientale/`.
