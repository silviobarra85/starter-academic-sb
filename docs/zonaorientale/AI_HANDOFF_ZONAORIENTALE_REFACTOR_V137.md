# AI Handoff - ZonaOrientale Salerno V137

Documento da consegnare a un nuovo assistente AI prima di continuare il lavoro sul progetto.

Ultimo aggiornamento: 2026-05-20
Branch principale di lavoro recente: `feature/zonaorientale-competizioni-statiche`
Sito pubblico: `https://www.silviobarra.com/zonaorientale/`
Cartella progetto nella repo Hugo/Wowchemy: `static/zonaorientale/`

---

## 1. Contesto del progetto

ZonaOrientale Salerno e un gestionale statico per una lega di fantacalcio manageriale.

Il sito vive dentro una repo Hugo/Wowchemy, ma la webapp e autonoma:

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

Frontend statico HTML/CSS/JS, senza build system e senza npm. Usa Firebase Authentication e Firestore dal browser. I dati storici consolidati sono progressivamente spostati in JSON statici versionati in Git per ridurre letture Firebase.

Principio architetturale: il pubblico deve leggere soprattutto snapshot pubblici e JSON statici; l'Admin modifica dati ufficiali, snapshot e richieste.

---

## 2. Regole di lavoro richieste dall'utente

L'utente vuole sempre:

1. zip overlay applicabile dalla root repo;
2. elenco file modificati;
3. cosa cambia;
4. istruzioni di applicazione;
5. test consigliati;
6. comandi Git;
7. messaggio commit coerente;
8. quando si copiano cartelle da Download, usare comandi file-per-file e non sovrascrivere intere cartelle.

Gli overlay devono avere struttura completa, per esempio:

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/styles.css
docs/zonaorientale/REFACTOR_VXXX.md
```

Comando overlay standard:

```bash
unzip -o nome_overlay.zip -d .
```

Ma spesso l'utente preferisce comandi sicuri da `/Users/admin/Downloads`, per esempio:

```bash
cp /Users/admin/Downloads/static/zonaorientale/index.html static/zonaorientale/index.html
cp /Users/admin/Downloads/static/zonaorientale/assets/app.js static/zonaorientale/assets/app.js
```

---

## 3. Branch e flusso Git

Branch usato per gli ultimi lavori:

```bash
git checkout feature/zonaorientale-competizioni-statiche
```

Prima di lavorare, chiedere o verificare:

```bash
git branch --show-current
git status
```

Comandi tipici dopo overlay:

```bash
git status
git add <file modificati>
git commit -m "Messaggio commit"
git push origin feature/zonaorientale-competizioni-statiche
```

Per merge su master, dopo test:

```bash
git status
git checkout master
git pull origin master
git merge feature/zonaorientale-competizioni-statiche
git push origin master
git checkout feature/zonaorientale-competizioni-statiche
```

---

## 4. Test locale

Per testare ZonaOrientale senza Hugo:

```bash
cd static
python3 -m http.server 1313 --bind 0.0.0.0
```

Desktop:

```text
http://localhost:1313/zonaorientale/
```

Smartphone sulla stessa Wi-Fi:

```bash
ipconfig getifaddr en0
```

Se non restituisce nulla:

```bash
ipconfig getifaddr en1
```

Poi aprire dal telefono:

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
/zonaorientale/#fantamercato
/zonaorientale/#teamarea
/zonaorientale/#honor
/zonaorientale/#regolamento
/zonaorientale/#admin
/zonaorientale/news.html
/zonaorientale/player.html
```

---

## 5. File da chiedere a un nuovo utente/assistente

Per continuare esattamente da questo punto, chiedere all'utente:

### Minimo indispensabile

Uno zip di:

```text
static/zonaorientale/
```

Uno zip di:

```text
docs/zonaorientale/
```

Output di:

```bash
git branch --show-current
git status
```

### Se il problema riguarda Firebase/permessi

Chiedere anche:

```text
docs/zonaorientale/FIREBASE_RULES_ZONAORIENTALE_FULL_V124C.rules
```

oppure le regole Firebase attualmente pubblicate in console.

### Se il problema riguarda un errore UI

Chiedere:

```text
- screenshot desktop/mobile
- errore console DevTools completo
- pagina/hash preciso, es. /zonaorientale/#fantamercato
- ruolo usato: admin, presidente, pubblico
```

### Se il problema riguarda competizioni statiche

Controllare anche:

```text
static/zonaorientale/assets/competitions/manifest.json
static/zonaorientale/assets/competitions/<stagione>/<competizione>.json
static/zonaorientale/competition.html
```

### Se il problema riguarda listone/rose

Controllare anche:

```text
static/zonaorientale/assets/listoni/manifest.json
static/zonaorientale/assets/listoni/*.json
static/zonaorientale/assets/rose/manifest.json
static/zonaorientale/assets/rose/*.json
```

---

## 6. Stato refactor al V137

File grandi rimasti:

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/styles.css
```

Sono ancora grandi, ma parte del codice e stata estratta in moduli.

Moduli principali gia presenti:

```text
static/zonaorientale/assets/js/core/
  constants.js
  dom.js
  formatters.js
  state.js
  ui.js
  utils.js

static/zonaorientale/assets/js/data/
  firestore-service.js
  static-files-service.js

static/zonaorientale/assets/js/domain/
  competitions.js
  entities.js
  fm-movements.js
  labels.js
  listone.js
  matches.js
  news.js
  rosters.js
  team-logos.js

static/zonaorientale/assets/js/admin/
  admin-competitions.js
  admin-users.js
  listone-converter.js
  public-snapshots.js

static/zonaorientale/assets/js/market/
  transfer-market.js

static/zonaorientale/assets/js/mobile/
  mobile-scrollbar.js
  mobile-tables.js
  mobile-viewport.js
```

CSS tematici recenti:

```text
static/zonaorientale/assets/css/components-v130.css
static/zonaorientale/assets/css/admin-v130.css
static/zonaorientale/assets/css/transfer-market-v130.css
static/zonaorientale/assets/css/competition-detail-v130.css
```

Attenzione: non fare refactor grandi e improvvisi. In passato un tentativo di estrarre troppi selector in `assets/js/data/selectors.js` ha rotto l'app ed e stato annullato.

---

## 7. Cache busting

`index.html` usa cache busting sugli asset principali. Al V137:

```html
<link rel="stylesheet" href="./assets/styles.css?v=137" />
<script type="module" src="./assets/app.js?v=137"></script>
```

Non aggiungere `?v=` agli import interni JS. Esempio da evitare:

```js
import { x } from "./js/core/constants.js?v=137";
```

Gli import interni devono restare normali:

```js
import { x } from "./js/core/constants.js";
```

---

## 8. Funzionalita principali recenti

### Competizioni statiche

La cartella dati e:

```text
static/zonaorientale/assets/competitions/
  manifest.json
  <seasonId>/<competition-slug>-<seasonId>.json
```

Fonte primaria pubblica:

```text
1. JSON statico in assets/competitions/
2. Firebase/snapshot come fallback
```

Le card mostrano badge:

```text
JSON statico
Firebase
deleted
```

`deleted` indica che la copia Firebase e stata rimossa/marcata, ma la partita JSON deve restare visibile se esiste nel calendario statico.

`competition.html` mostra il calendario completo della competizione e deve usare lo stesso stile della sezione Competizioni, ma con tutte le partite.

### Dashboard

Le prossime partite in Dashboard mostrano anche:

```text
- data
- giornata di Serie A se presente
```

### Fantamercato

Nuova sezione:

```text
/zonaorientale/#fantamercato
```

Raccolte Firebase:

```text
transferListings
transferNegotiations
```

Ottimizzazione V133:

```text
transferListings: legge solo seasonId corrente + status ACTIVE
transferNegotiations: legge solo trattative in cui la squadra utente e coinvolta, admin escluso
```

Un presidente puo:

```text
- mettere in vendita un giocatore dalla propria rosa
- modificare/togliere il badge TRASF
- fare una proposta da Fantamercato
- vedere trattative inviate/ricevute in Area squadra
- annullare una proposta inviata PENDING eliminandola da Firebase
```

### Area squadra

Sottosezioni importanti:

```text
Proponi svincolo
Trattative
```

La proposta supporta:

```text
- giocatori offerti
- giocatori richiesti
- FM offerti
- FM richiesti
- messaggio
```

Validazioni:

```text
- max 30 giocatori in rosa
- tasto invia disattivato finche la proposta non e valida
- i giocatori selezionati possono essere deselezionati
```

### Admin utenti

Al V137:

```text
Admin -> Utenti e comunicazioni -> Accetta utenti
```

Comportamento richiesto:

```text
- se un utente viene rifiutato, delete definitivo da pendingUsers/{uid}
- la richiesta rifiutata non deve piu comparire
- se un utente viene approvato, resta pendingUsers con status APPROVED
- gli approvati compaiono sotto le richieste in attesa nella stessa sottosezione
```

### Admin comunicati

```text
Admin -> Utenti e comunicazioni -> Comunicati
```

Comportamento:

```text
- mostra tutti i comunicati
- admin puo cancellare un comunicato
- la cancellazione elimina il documento da news/{id} in Firebase
```

---

## 9. Firebase Rules

File completo da tenere come riferimento:

```text
docs/zonaorientale/FIREBASE_RULES_ZONAORIENTALE_FULL_V124C.rules
```

Gli snippet vecchi delle rules possono creare confusione. Preferire il file completo.

Se compaiono errori `permission-denied` su `transferListings` o `transferNegotiations`, controllare:

```text
- rules pubblicate in Firebase Console
- esistenza di teamUsers/{uid} con status ACTIVE e seasonTeamId corretto
- campi fromSeasonTeamId/toSeasonTeamId sulle trattative
- campo seasonTeamId e status ACTIVE sui trasferibili
```

---

## 10. File da non pubblicare / pulizia

Da rimuovere o ignorare:

```text
.DS_Store
__MACOSX/
docs/zonaorientale/mine_not_to_push
```

Comandi:

```bash
find static/zonaorientale -name ".DS_Store" -print -delete
find docs -name ".DS_Store" -print -delete
find . -name "__MACOSX" -type d -prune -exec rm -rf {} +
git rm --ignore-unmatch docs/zonaorientale/mine_not_to_push
```

---

## 11. Backup consigliato

Prima di esperimenti grossi, dalla root repo:

```bash
mkdir -p ../zonaorientale-backups
BACKUP_NAME="zonaorientale_backup_$(date +%Y%m%d_%H%M%S)"
zip -r "../zonaorientale-backups/${BACKUP_NAME}.zip" static/zonaorientale docs/zonaorientale -x "*.DS_Store" "*/__MACOSX/*"
```

---

## 12. Nuovo branch per interfaccia mobile

Per provare una nuova interfaccia mobile senza rischiare il branch principale:

```bash
git checkout feature/zonaorientale-competizioni-statiche
git pull origin feature/zonaorientale-competizioni-statiche
git checkout -b feature/zonaorientale-mobile-block-ui
git push -u origin feature/zonaorientale-mobile-block-ui
```

Obiettivo di quel branch: sperimentare una nuova mobile view a blocchi, senza cambiare i dati e senza toccare il desktop se non necessario.

Documento mockup gia presente:

```text
docs/zonaorientale/MOBILE_MOCKUPS_V136.md
```

---

## 13. Approccio consigliato al prossimo assistente

1. Prima leggere questo handoff.
2. Chiedere zip aggiornato di `static/zonaorientale` e `docs/zonaorientale`.
3. Verificare branch e working tree.
4. Non fare grandi refactor.
5. Per ogni modifica creare overlay piccolo.
6. Aggiornare cache busting solo su asset principali.
7. Fornire sempre comandi Git.
8. Per modifiche Firebase, indicare chiaramente se servono Rules o indici.
9. Per mobile UI, lavorare su branch dedicato `feature/zonaorientale-mobile-block-ui`.

