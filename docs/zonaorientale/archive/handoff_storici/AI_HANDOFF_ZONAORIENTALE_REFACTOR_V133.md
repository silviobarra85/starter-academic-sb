# AI Handoff - ZonaOrientale Salerno V133

Documento da consegnare a un nuovo assistente AI prima di lavorare sul progetto.

Ultimo aggiornamento: 2026-05-20
Branch di lavoro corrente/consigliato: `feature/zonaorientale-competizioni-statiche`
Cartella progetto dentro repo Hugo/Wowchemy: `static/zonaorientale/`
Sito pubblico: `https://www.silviobarra.com/zonaorientale/`

---

## 1. Contesto del progetto

ZonaOrientale Salerno è una webapp statica per una lega di fantacalcio manageriale.

Il sito vive dentro una repo Hugo/Wowchemy, ma la webapp è autonoma:

```text
static/zonaorientale/
  index.html
  competition.html
  news.html
  player.html
  assets/
    app.js
    styles.css
    firebase.js
    emailjs.js
    css/
    js/
    competitions/
    listoni/
    rose/
    logos/
    icons/
```

Il frontend è HTML/CSS/JS statico, senza npm e senza build system. Usa Firebase Authentication e Firestore direttamente dal browser. I listoni, le rose storiche e i calendari competizione consolidati sono JSON statici versionati in Git.

Principio architetturale importante: il pubblico deve leggere soprattutto snapshot pubblici e JSON statici per ridurre le letture Firestore. L'area Admin modifica i dati ufficiali, genera snapshot, approva utenti/presidenti e gestisce competizioni/rose/mercato.

---

## 2. Regole di lavoro richieste dall'utente

L'utente vuole sempre, quando si modifica il progetto:

1. zip overlay applicabile dalla root della repo;
2. elenco file modificati;
3. cosa cambia;
4. come applicarlo;
5. test consigliati;
6. comandi Git;
7. messaggio commit coerente;
8. comandi di copia sicura da `/Users/admin/Downloads` file-per-file, senza copiare intere cartelle in modo distruttivo.

Overlay da preparare sempre con struttura completa, per esempio:

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/styles.css
```

Applicazione classica da root repo:

```bash
unzip -o nome_overlay.zip -d .
```

Applicazione preferita dall'utente quando lo zip viene decompresso automaticamente in Download:

```bash
cp /Users/admin/Downloads/static/zonaorientale/index.html static/zonaorientale/index.html
cp /Users/admin/Downloads/static/zonaorientale/assets/app.js static/zonaorientale/assets/app.js
```

Non usare comandi tipo `cp -R cartella cartella` se rischiano di cancellare/sovrascrivere contenuti non inclusi nell'overlay. Preferire `mkdir -p` + `cp` dei singoli file.

---

## 3. Branch e Git

Branch corrente usato in questa fase:

```bash
git checkout feature/zonaorientale-competizioni-statiche
```

Prima di applicare overlay:

```bash
git status
```

Dopo overlay e test:

```bash
git status
git add <file modificati>
git commit -m "Messaggio commit"
git push origin feature/zonaorientale-competizioni-statiche
```

Non fare push su `master` finché non è stato testato tutto.

---

## 4. Test locale

Per testare solo ZonaOrientale, servire la cartella `static`:

```bash
cd static
python3 -m http.server 1313
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

Per test da smartphone sulla stessa Wi-Fi:

```bash
cd static
python3 -m http.server 1313 --bind 0.0.0.0
```

In un altro terminale:

```bash
ipconfig getifaddr en0
```

Se non restituisce nulla:

```bash
ipconfig getifaddr en1
```

Da smartphone:

```text
http://IP_DEL_MAC:1313/zonaorientale/
```

Pagine da testare spesso:

```text
/zonaorientale/
/zonaorientale/#dashboard
/zonaorientale/#news
/zonaorientale/#clubs
/zonaorientale/#listone
/zonaorientale/#competitions
/zonaorientale/competition.html
/zonaorientale/#honor
/zonaorientale/#regolamento
/zonaorientale/#fantamercato
/zonaorientale/#teamarea
/zonaorientale/#admin
/zonaorientale/news.html
/zonaorientale/player.html
```

---

## 5. File da chiedere all'utente per aggiornarsi

Per una nuova sessione o un nuovo assistente AI, chiedere sempre almeno uno zip della cartella:

```text
static/zonaorientale/
```

Oppure questi file/cartelle:

```text
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/news.html
static/zonaorientale/player.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/styles.css
static/zonaorientale/assets/firebase.js
static/zonaorientale/assets/emailjs.js
static/zonaorientale/assets/css/
static/zonaorientale/assets/js/
static/zonaorientale/assets/competitions/
static/zonaorientale/assets/listoni/
static/zonaorientale/assets/rose/
static/zonaorientale/assets/logos/
```

Chiedere anche lo zip di:

```text
docs/zonaorientale/
```

In particolare sono utili:

```text
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_REFACTOR_V133.md
docs/zonaorientale/FIREBASE_RULES_ZONAORIENTALE_FULL_V124C.rules
docs/zonaorientale/REFACTOR_V127.md
docs/zonaorientale/REFACTOR_V128.md
docs/zonaorientale/REFACTOR_V129.md
docs/zonaorientale/REFACTOR_V130.md
docs/zonaorientale/REFACTOR_V131.md
docs/zonaorientale/REFACTOR_V132.md
docs/zonaorientale/REFACTOR_V133.md
```

Chiedere inoltre:

```bash
git branch --show-current
git status
```

Se c'è un problema specifico, chiedere screenshot, errore console DevTools e URL/hash della pagina.

---

## 6. Stato refactor modulare

Struttura modulare già presente:

```text
static/zonaorientale/assets/js/
  core/
    constants.js
    dom.js
    formatters.js
    state.js
    ui.js
    utils.js

  data/
    firestore-service.js
    static-files-service.js

  domain/
    competitions.js
    entities.js
    fm-movements.js
    labels.js
    listone.js
    matches.js
    news.js
    rosters.js
    team-logos.js

  admin/
    admin-competitions.js
    admin-users.js
    listone-converter.js
    public-snapshots.js

  market/
    transfer-market.js

  mobile/
    mobile-scrollbar.js
    mobile-tables.js
    mobile-viewport.js
```

`assets/app.js` resta ancora il file orchestratore principale. Non fare refactor grandi di stato globale, auth, `loadData`, `renderAll`, `buildMaps`, `sortData` senza test molto mirati.

Attenzione storica: un vecchio tentativo di estrarre troppi selector in `assets/js/data/selectors.js` ha rotto l'app. Non ripetere estrazioni grosse di funzioni dipendenti dallo stato globale.

---

## 7. Stato versioni recenti

### V119 - Fantamercato e trattative

- Aggiunta sezione `#fantamercato`.
- Aggiunte raccolte Firebase:
  - `transferListings`
  - `transferNegotiations`
- Dalla rosa propria si può mettere un giocatore in vendita.
- Badge `TRASF` per giocatori trasferibili.
- Area squadra: sottosezione `Proponi svincolo` usata come trattativa/scambio tra squadre.
- Trattative inviate/ricevute, riepilogo, annulla/accetta/rifiuta.
- Limite massimo 30 giocatori validato lato UI.

### V120-V121

- Link Fantacalcio anche nella scheda squadra.
- Possibilità di mettere in vendita dalla propria scheda squadra.
- Rules di riferimento per mercato.
- Se il mittente annulla una trattativa, viene eliminata da Firebase.

### V122

- Admin -> Accetta utenti:
  - rifiuto cancella `pendingUsers/{uid}`;
  - lista richieste in attesa;
  - lista accessi approvati.

### V123

- Pulizia file pubblicati.
- Corretto import interno mobile senza `?v`.

### V124

- Fix mobile Competizioni/Fantamercato.
- Lettura trattative più sicura:
  - admin può leggere tutte;
  - presidente legge solo inviate/ricevute dalla propria squadra.
- Aggiunti `query` e `where` in `firebase.js`.

### V125-V126

- Migliorati loghi e stile pagina `competition.html`.
- La pagina della singola competizione mostra tutte le partite, non solo ultime 5.
- Classifiche e tabelle dettagli competizione rese coerenti con sezione Competizioni.
- Colonne Campionato corrette: POS più stretta, punti/fantapunti visibili.

### V127

- Estratto CSS recente in file separato temporaneo.
- Estratto helper loghi in:

```text
assets/js/domain/team-logos.js
```

### V128

- Estratti helper Fantamercato/trattative in:

```text
assets/js/market/transfer-market.js
```

### V129

- Estratti renderer Admin utenti e snapshot:

```text
assets/js/admin/admin-users.js
assets/js/admin/public-snapshots.js
```

### V130

- Split CSS tematico:

```text
assets/css/components-v130.css
assets/css/admin-v130.css
assets/css/transfer-market-v130.css
assets/css/competition-detail-v130.css
```

### V131

- Estratti renderer Admin competizioni in:

```text
assets/js/admin/admin-competitions.js
```

### V132

- Pulizia finale refactor.
- Rimosso vecchio `refinements-v119-v126.css`.
- Cache busting a `v=132`.

### V133

- Ottimizzata lettura `transferListings`:

```text
seasonId == stagione corrente
status == ACTIVE
```

- Le trattative erano già filtrate per squadra in V124.
- Cache busting `index.html` a `v=133`.

---

## 8. Competizioni statiche da JSON

Cartella:

```text
static/zonaorientale/assets/competitions/
  manifest.json
  <seasonId>/
    <competition-slug>-<seasonId>.json
```

Fonte dati pubblica desiderata:

```text
1. JSON statico se presente
2. Firebase / publicSeasonSnapshots come fallback
```

Ogni competizione può mostrare badge:

```text
JSON
Firebase
deleted
```

Significato attuale:

- `JSON`: partita recuperata da JSON statico.
- `Firebase`: esiste record Firebase attivo.
- `deleted`: esiste marker/tombstone Firebase che indica che la copia Firebase è stata rimossa; NON deve nascondere la partita JSON pubblica.

Per partite JSON eliminate da Firebase, la partita deve rimanere visibile se è nel JSON statico, con badge `JSON` e `deleted`, e stato reale come `Giocata`.

In `Admin -> Partite competizioni`, le competizioni con stato `Non disputata` non devono essere selezionabili per inserimento/import calendario.

---

## 9. Firebase e Rules

File rules completo più aggiornato:

```text
docs/zonaorientale/FIREBASE_RULES_ZONAORIENTALE_FULL_V124C.rules
```

Raccolte importanti:

```text
admins
pendingUsers
teamUsers
teamRequests
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
publicSeasonSnapshots
publicSnapshots
publicTeamSnapshots
transferListings
transferNegotiations
```

Per il mercato:

- `transferListings` deve essere leggibile pubblicamente, ma scrivibile dal presidente della squadra o admin.
- `transferNegotiations` deve essere leggibile solo da admin o squadre coinvolte.
- L'annullamento di una trattativa `PENDING` elimina il documento da Firebase.

Se in console appaiono errori tipo:

```text
Unchecked runtime.lastError
A listener indicated an asynchronous response...
SES Removing unpermitted intrinsics
```

sono quasi sempre estensioni Chrome, non errori del sito.

Errore rilevante del sito:

```text
permission-denied
```

In quel caso controllare Firestore Rules e autenticazione/ruolo utente.

---

## 10. Snapshot e riduzione letture Firebase

Snapshot pubblici:

```text
publicSeasonSnapshots/{seasonId}
publicSnapshots/honor
publicTeamSnapshots/{seasonId}_{teamId}
```

Admin -> Snapshot pubblici deve mostrare data ultimo snapshot e pulsanti:

```text
Aggiorna stagione selezionata
Aggiorna tutte le stagioni
Aggiorna Albo/FIFA
Aggiorna schede squadra
Aggiorna comunicati
Aggiorna competizioni e classifiche
Aggiorna tutto
```

Dopo modifiche Admin importanti bisogna rigenerare snapshot.

Ottimizzazioni letture già fatte:

- calendari consolidati da JSON statico;
- trattative lette solo se utente coinvolto o admin;
- trasferibili letti solo per stagione corrente e status `ACTIVE`.

Possibili ottimizzazioni future:

- lazy load Listone solo quando si apre `#listone`;
- lazy load rose statiche solo quando servono a Rose/Area squadra/Fantamercato;
- spostare tombstone partite JSON in raccolta dedicata tipo `competitionMatchDeletions`.

---

## 11. Cache busting

`index.html` usa cache busting sugli asset principali:

```html
<link rel="stylesheet" href="./assets/styles.css?v=133" />
<script type="module" src="./assets/app.js?v=133"></script>
```

Regola importante: NON aggiungere cache busting agli import interni dei moduli JS.

Corretto:

```js
import { setupMobileTables } from "./js/mobile/mobile-tables.js";
```

Sbagliato:

```js
import { setupMobileTables } from "./js/mobile/mobile-tables.js?v=85";
```

---

## 12. File da non pubblicare / pulire

Dentro `static/` non devono restare backup o file macOS:

```text
static/zonaorientale_backup/
static/zonaorientale_refactor_backup/
.DS_Store
__MACOSX/
```

Comandi:

```bash
find static/zonaorientale -name ".DS_Store" -print -delete
find docs -name ".DS_Store" -print -delete
find . -name "__MACOSX" -type d -prune -exec rm -rf {} +
```

In `docs/zonaorientale/` è stato rilevato un file locale:

```text
mine_not_to_push
```

Non deve essere committato. Se presente:

```bash
git rm --ignore-unmatch docs/zonaorientale/mine_not_to_push
```

Se va tenuto solo in locale, aggiungere a `.gitignore`:

```bash
echo "docs/zonaorientale/mine_not_to_push" >> .gitignore
```

---

## 13. Pulizia docs consigliata

Tenere il file rules completo:

```text
docs/zonaorientale/FIREBASE_RULES_ZONAORIENTALE_FULL_V124C.rules
```

Rimuovere snippet vecchi se presenti per evitare confusione:

```bash
git rm --ignore-unmatch docs/zonaorientale/FIREBASE_RULES_TRANSFER_MARKET.rules
git rm --ignore-unmatch docs/zonaorientale/FIREBASE_RULES_TRANSFER_MARKET_V124.rules
```

---

## 14. Prossimi refactor consigliati

Non fare overlay grandi. Procedere solo per step piccoli.

Possibili step futuri:

```text
V134 - estrarre competition.html in assets/js/pages/competition-detail.js
V135 - estrarre azioni Firebase Admin snapshot/utenti, se serve
V136 - lazy load listone/rose statiche
V137 - separare ulteriormente styles.css base/layout/tables/mobile
```

Priorità funzionale futura:

- verificare rules in produzione;
- test mobile reale;
- test completo Admin;
- merge su master solo dopo test.

---

## 15. Checklist pre-merge su master

```bash
git status
cd static
python3 -m http.server 1313 --bind 0.0.0.0
```

Testare:

```text
/zonaorientale/
/zonaorientale/#dashboard
/zonaorientale/#news
/zonaorientale/#clubs
/zonaorientale/#listone
/zonaorientale/#competitions
/zonaorientale/competition.html
/zonaorientale/#honor
/zonaorientale/#regolamento
/zonaorientale/#fantamercato
/zonaorientale/#teamarea
/zonaorientale/#admin
/zonaorientale/news.html
/zonaorientale/player.html
```

Poi, solo se stabile:

```bash
git checkout master
git pull origin master
git merge feature/zonaorientale-competizioni-statiche
git push origin master
```
