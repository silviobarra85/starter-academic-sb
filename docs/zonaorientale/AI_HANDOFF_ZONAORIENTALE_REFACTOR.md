# AI Handoff - ZonaOrientale Salerno

Documento da consegnare a un nuovo assistente prima di lavorare sul progetto.

Ultimo aggiornamento: 2026-05-19  
Stato corrente pubblicato: fino a V95, regolamento nel tab piu compatto  
Sito pubblico: `https://www.silviobarra.com/zonaorientale/`  
Cartella webapp nella repo Hugo/Wowchemy: `static/zonaorientale/`

---

## 1. Contesto del progetto

ZonaOrientale Salerno e un gestionale statico per una lega di fantacalcio manageriale. Vive dentro una repo Hugo/Wowchemy, ma la webapp e autonoma: HTML/CSS/JS statici, Firebase Authentication e Firestore dal browser, senza build system e senza npm.

Il sito pubblico deve leggere soprattutto snapshot pubblici per ridurre le letture Firestore. L'area Admin modifica i dati ufficiali, genera snapshot pubblici, approva utenti/presidenti e gestisce richieste.

Architettura dati:

- `assets/listoni/`: listoni statici versionati in Git;
- `assets/rose/`: rose statiche/storiche importate;
- Firestore: dati operativi ufficiali;
- snapshot pubblici Firestore: fonte preferita per il pubblico.

---

## 2. Regole di lavoro richieste dall'utente

L'utente vuole sempre:

1. zip overlay da copiare nella repo;
2. elenco file modificati;
3. istruzioni di applicazione e test;
4. comandi Git aggiornati;
5. messaggio commit coerente;
6. modifiche piccole e testabili;
7. se si modifica `index.html`, aggiornare sempre il footer con versione e ultimo aggiornamento.

Gli overlay devono contenere i percorsi completi, per esempio:

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/styles.css
```

Si applicano dalla root della repo con:

```bash
unzip -o nome_overlay.zip -d .
```

Non usare `git add .` alla cieca, perche l'utente crea spesso backup locali da non committare.

---

## 3. Branch e flusso Git

`master` e la versione pubblica/stabile. Per nuove modifiche creare branch dedicati, per esempio:

```bash
git checkout master
git pull origin master
git checkout -b feature/zonaorientale-ui-funzionalita
```

Dopo overlay e test:

```bash
git status
git add <file modificati>
git commit -m "Messaggio commit"
git push origin nome-branch
```

Per pubblicare:

```bash
git checkout master
git pull origin master
git merge nome-branch
git push origin master
```

Per hotfix urgenti notati dopo pubblicazione si puo lavorare direttamente su `master`, ma solo se l'utente lo chiede esplicitamente.

---

## 4. Test locale

Hugo/Wowchemy puo fallire con versioni recenti di Hugo. Per testare solo ZonaOrientale usare server statico:

```bash
cd static
python3 -m http.server 1313
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

Pagine da testare dopo modifiche:

```text
/zonaorientale/#dashboard
/zonaorientale/#news
/zonaorientale/#clubs
/zonaorientale/#listone
/zonaorientale/#competitions
/zonaorientale/#honor
/zonaorientale/#regolamento
/zonaorientale/#admin
/zonaorientale/news.html
/zonaorientale/player.html
/zonaorientale/rules.html
```

Per test mobile usare Chrome DevTools oppure telefono reale sulla stessa Wi-Fi:

```bash
cd static
python3 -m http.server 1313 --bind 0.0.0.0
ipconfig getifaddr en0
```

Poi aprire da telefono:

```text
http://IP_DEL_MAC:1313/zonaorientale/
```

---

## 5. File che l'utente deve mandare a un nuovo assistente

Per lavorare bene, chiedere sempre questi file aggiornati:

```text
static/zonaorientale/index.html
static/zonaorientale/player.html
static/zonaorientale/news.html
static/zonaorientale/rules.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/styles.css
static/zonaorientale/assets/firebase.js
static/zonaorientale/assets/emailjs.js
```

Modulo JS, se presenti:

```text
static/zonaorientale/assets/js/core/constants.js
static/zonaorientale/assets/js/core/state.js
static/zonaorientale/assets/js/core/dom.js
static/zonaorientale/assets/js/core/utils.js
static/zonaorientale/assets/js/core/ui.js
static/zonaorientale/assets/js/core/formatters.js
static/zonaorientale/assets/js/data/firestore-service.js
static/zonaorientale/assets/js/data/static-files-service.js
static/zonaorientale/assets/js/domain/competitions.js
static/zonaorientale/assets/js/domain/entities.js
static/zonaorientale/assets/js/domain/fm-movements.js
static/zonaorientale/assets/js/domain/labels.js
static/zonaorientale/assets/js/domain/listone.js
static/zonaorientale/assets/js/domain/matches.js
static/zonaorientale/assets/js/domain/news.js
static/zonaorientale/assets/js/domain/rosters.js
static/zonaorientale/assets/js/admin/listone-converter.js
static/zonaorientale/assets/js/mobile/mobile-scrollbar.js
static/zonaorientale/assets/js/mobile/mobile-tables.js
static/zonaorientale/assets/js/mobile/mobile-viewport.js
```

Dati statici utili:

```text
static/zonaorientale/assets/listoni/manifest.json
static/zonaorientale/assets/listoni/<ultimo-listone>.json
static/zonaorientale/assets/rose/manifest.json
static/zonaorientale/assets/rose/<ultima-rosa>.json
```

Per problemi Firebase/rules/debug:

```text
backup Firestore JSON recente
FIREBASE_RULES.rules se presente in docs o backup locale
screenshot errore browser/console
```

Per problemi grafici:

- screenshot desktop/mobile;
- URL/hash della sezione;
- browser usato;
- larghezza viewport se possibile.

---

## 6. Struttura attuale della webapp

```text
static/zonaorientale/
  index.html
  news.html
  player.html
  rules.html
  favicon.ico
  site.webmanifest
  assets/
    app.js
    styles.css
    firebase.js
    emailjs.js
    icons/
    logos/
    listoni/
    rose/
    js/
      core/
      data/
      domain/
      admin/
      mobile/
```

Struttura modulare introdotta:

```text
assets/js/core/
  constants.js
  dom.js
  formatters.js
  state.js
  ui.js
  utils.js

assets/js/data/
  firestore-service.js
  static-files-service.js

assets/js/domain/
  competitions.js
  entities.js
  fm-movements.js
  labels.js
  listone.js
  matches.js
  news.js
  rosters.js

assets/js/admin/
  listone-converter.js

assets/js/mobile/
  mobile-scrollbar.js
  mobile-tables.js
  mobile-viewport.js
```

`assets/app.js` resta l'orchestratore principale. Evitare grandi estrazioni di funzioni dipendenti dallo stato globale: un tentativo di estrarre troppi selector in `assets/js/data/selectors.js` ha rotto l'app ed e stato annullato.

---

## 7. Funzionalita e modifiche gia fatte

- sezione pubblica `Movimenti & Stadi` rimossa;
- sezione `Regolamento` inserita al suo posto;
- livelli stadio gestiti nelle rose;
- favicon reale e manifest;
- logout visibile anche a presidenti/utenti autenticati;
- pagina presidente: non mostra piu richiesta alla propria squadra;
- comunicati supportano grassetto con `**testo**`;
- comunicati mostrano data e ora;
- comunicati di avvenuto scambio non richiedono approvazione e non appaiono in Admin > Richieste presidenti;
- dashboard mostra primi 3 comunicati, solo il piu recente espanso;
- dashboard: sottosezione calendario rinominata `Ultimi risultati`;
- dashboard: riepilogo competizioni mostra vincitore oppure prossima partita/giornata programmata;
- competizioni ordinate: attive con partite programmate, attive, programmate, concluse;
- Admin: liste lunghe scrollabili con circa 5 elementi visibili;
- `news.html` aggiunta per anteprima social statica;
- `player.html` aggiunta per schede giocatore Fantacalcio.it in pagina interna con fallback link esterno;
- switch Light/Dark in alto;
- tasto `Aggiorna dati` visibile solo agli admin;
- Listone integrato: rimossa sottosezione separata `Svincolati`;
- nel Listone ci sono checkbox stato: In listone, Asteriscato, Svincolati;
- filtro ruoli del Listone trasformato in checkbox P/D/C/A;
- quando si seleziona una stagione, viene scelto l'ultimo listone disponibile per quella stagione ordinando per `loadedAt`/`id`;
- nomi giocatori cliccabili nel Listone e nelle Rose quando disponibile `fantacalcioId`;
- Albo d'Oro: squadre cliccabili quando possibile risalire alla squadra;
- Regolamento riorganizzato in `rules.html` e incorporato anche nel tab `#regolamento` senza iframe;
- nel tab Regolamento e stato rimosso il titolo pagina superiore; resta il pannello `Regolamento 2024/2025`;
- pulsante `Apri pagina regolamento` ridotto;
- testo regolamento mobile va a capo, mentre le tabelle del regolamento restano scrollabili orizzontalmente.

---

## 8. Regolamento

Il regolamento ha due forme:

1. pagina autonoma: `static/zonaorientale/rules.html`;
2. contenuto incorporato direttamente in `index.html` nella sezione `#regolamento`.

Non usare iframe per mostrare `rules.html` dentro `index.html`: il browser/hosting puo mostrare `Connessione negata da silviobarra.com`. Il fix corretto e tenere il contenuto inline nel tab e lasciare `rules.html` come pagina dedicata.

Su mobile: testo normale deve andare a capo; solo le tabelle devono scorrere orizzontalmente.

---

## 9. Firebase e Google login

Il login Google usa Firebase Auth. Se compare:

```text
Firebase: Error (auth/unauthorized-domain)
```

non e un bug di codice: bisogna autorizzare il dominio in Firebase Console:

```text
Authentication -> Settings -> Authorized domains
```

Aggiungere/controllare:

```text
www.silviobarra.com
silviobarra.com
```

Controllare anche:

```text
Authentication -> Sign-in method -> Google -> Enable
```

Su mobile `signInWithPopup` puo essere piu fragile del redirect, ma per ora e rimasto il popup.

---

## 10. Cache e versioni

`index.html` usa cache busting sugli asset principali:

```html
<link rel="stylesheet" href="./assets/styles.css?v=95" />
<script type="module" src="./assets/app.js?v=...">
```

Quando si modifica `styles.css`, aggiornare `?v=` del CSS. Quando si modifica `app.js`, aggiornare `?v=` dello script.

Non aggiungere cache busting agli import interni dei moduli JS. Evitare:

```js
import { x } from "./constants.js?v=81";
```

Usare invece:

```js
import { x } from "./constants.js";
```

Gli import interni con `?v=` hanno gia causato problemi al Listone.

---

## 11. File documentali e backup

La cartella `static/` viene pubblicata. File documentali/debug andrebbero fuori da `static`, per esempio:

```text
docs/zonaorientale/
```

Backup locali da ignorare:

```text
static/zonaorientale_refactor_backup/
static/zonaorientale.backup/
static/docs/
static/docs_zonaorientale/
static/zonaorientale/docs/
```

Non committare backup locali.

---

## 12. Snapshot pubblici e dati statici

Snapshot pubblici Firestore usati/previsti:

```text
publicSeasonSnapshots/{seasonId}
publicSnapshots/honor
publicTeamSnapshots/{seasonId}_{teamId}
```

Dopo modifiche Admin importanti bisogna rigenerare gli snapshot pubblici.

Dati statici:

```text
assets/listoni/manifest.json
assets/listoni/2026-05-15.json
assets/rose/manifest.json
assets/rose/2025-2026-2026-05-12.json
```

Nel `manifest.json` dei listoni ogni entry contiene almeno:

```json
{
  "id": "2026-05-15",
  "seasonId": "2025-2026",
  "loadedAt": "2026-05-15",
  "file": "2026-05-15.json"
}
```

L'app deve selezionare l'ultimo listone della stagione scelta ordinando per `loadedAt` e poi `id`.

---

## 13. Cose da evitare

- Non reintrodurre `Movimenti & Stadi` come sezione pubblica;
- non sovrascrivere `index.html` partendo da versioni vecchie;
- non rimuovere i moduli JS creati senza motivo;
- non fare refactor grandi di funzioni dipendenti da stato globale;
- non committare backup o cartelle sotto `static` create per appoggio;
- non usare iframe per incorporare `rules.html` in `index.html`;
- non promettere che Fantacalcio.it si possa embeddare sempre: puo bloccare iframe/cross-origin.

---

## 14. Risposta standard a una richiesta di modifica

Quando prepari una modifica, rispondi sempre con:

```text
- link allo zip overlay
- file modificati
- cosa cambia
- come applicarlo
- test consigliati
- comandi Git
- messaggio commit
```

Esempio comandi:

```bash
git status
git add static/zonaorientale/index.html static/zonaorientale/assets/styles.css
git commit -m "Descrizione breve"
git push origin nome-branch
```
