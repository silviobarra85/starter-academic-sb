# AI Handoff - ZonaOrientale Salerno V149

Documento per aggiornare un nuovo assistente AI sullo stato attuale del progetto.

Ultimo aggiornamento: 2026-05-20
Branch di lavoro corrente: `feature/zonaorientale-competizioni-statiche`
Sito pubblico: `https://www.silviobarra.com/zonaorientale/`
Cartella webapp: `static/zonaorientale/`

---

## 1. Contesto

ZonaOrientale Salerno e una webapp statica per gestione di una lega di fantacalcio manageriale.
Vive dentro una repo Hugo/Wowchemy ma la webapp e autonoma sotto:

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

Frontend statico HTML/CSS/JS, senza npm/build system. Usa Firebase Authentication e Firestore dal browser.

---

## 2. Regole operative dell'utente

L'utente vuole sempre:

1. zip overlay applicabile dalla root della repo;
2. elenco file modificati;
3. cosa cambia;
4. comandi di copia sicura da `/Users/admin/Downloads` file-per-file;
5. test consigliati;
6. comandi Git;
7. commit message coerente;
8. modifiche piccole e testabili;
9. massima attenzione a non rompere desktop/pubblico.

Gli overlay devono contenere la struttura completa, per esempio:

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
```

L'utente spesso applica overlay che vengono decompressi automaticamente in:

```text
/Users/admin/Downloads
```

Per questo fornire sempre anche comandi `cp` singoli, evitando copie di cartelle che possano cancellare contenuti.

---

## 3. Stato branch e merge

Branch principale di sviluppo attuale:

```bash
git checkout feature/zonaorientale-competizioni-statiche
```

Per pushare:

```bash
git push origin feature/zonaorientale-competizioni-statiche
```

Per merge su master solo dopo test:

```bash
git checkout master
git pull origin master
git merge feature/zonaorientale-competizioni-statiche
git push origin master
git checkout feature/zonaorientale-competizioni-statiche
```

---

## 4. Test locale

Da root repo:

```bash
cd static
python3 -m http.server 1313 --bind 0.0.0.0
```

Desktop:

```text
http://localhost:1313/zonaorientale/
```

Smartphone stessa Wi-Fi:

```bash
ipconfig getifaddr en0
```

Poi:

```text
http://IP_DEL_MAC:1313/zonaorientale/
```

Pagine da testare:

```text
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
```

---

## 5. Stato funzionale importante fino a V149

### Competizioni statiche

La fonte primaria per calendari consolidati e JSON statico:

```text
static/zonaorientale/assets/competitions/manifest.json
static/zonaorientale/assets/competitions/<stagione>/<competizione>-<stagione>.json
```

Firebase/snapshot sono fallback.
Le card competizione mostrano badge fonte JSON/Firebase.
`competition.html` apre il dettaglio completo della competizione.

### Admin

Admin e diviso in sottosezioni:

```text
Utenti e comunicazioni
Stagioni e club
Rose e mercato
Competizioni
Snapshot e backup
```

In `Admin -> Accetta utenti`:

- Rifiuta elimina definitivamente `pendingUsers/{uid}`;
- la richiesta rifiutata non deve piu comparire;
- gli utenti approvati restano visibili sotto `Accessi approvati`;
- viene mostrato il conteggio dei presidenti approvati/registrati.

In `Admin -> Comunicati`:

- tutti i comunicati sono visualizzati;
- l'admin puo cancellarli;
- la cancellazione rimuove il documento da `news/{id}`.

### Fantamercato e trattative

Raccolte Firebase:

```text
transferListings
transferNegotiations
```

`transferListings` e ottimizzata per leggere solo:

```text
seasonId == stagione corrente
status == ACTIVE
```

`transferNegotiations` legge solo trattative dove la squadra utente e coinvolta; admin puo leggere tutte.

In Area squadra:

- sottosezione `Proponi svincolo` per trattative/scambi;
- trattative inviate/ricevute;
- chi invia puo annullare una proposta pendente eliminandola da Firebase;
- chi riceve puo accettare/rifiutare.

### Mobile UI V140-V149

La versione desktop non deve essere toccata.
Il ciclo mobile ha aggiunto:

```text
V140 Mobile Home a blocchi
V141 Mobile UI unificata + bottom nav
V142 navigazione mobile role-aware
V143 Rose mobile a card
V144 Area squadra mobile operativa
V145 Competizioni mobile compatte
V146 Listone mobile migliorato
V147 Admin mobile a blocchi
V148 contenuti mobile: News, Albo, Regolamento
V149 rifinitura finale mobile
```

CSS mobile attuali:

```text
assets/css/mobile-block-ui-v140.css
assets/css/mobile-unified-ui-v141.css
assets/css/mobile-rosters-v143.css
assets/css/mobile-teamarea-v144.css
assets/css/mobile-competitions-v145.css
assets/css/mobile-listone-v146.css
assets/css/mobile-admin-v147.css
assets/css/mobile-content-v148.css
assets/css/mobile-final-polish-v149.css
```

Sono caricati da `index.html` con cache busting `v=149`.

---

## 6. Moduli/refactor presenti

Moduli principali introdotti:

```text
assets/js/domain/team-logos.js
assets/js/market/transfer-market.js
assets/js/admin/admin-users.js
assets/js/admin/public-snapshots.js
assets/js/admin/admin-competitions.js
```

CSS separati:

```text
assets/css/components-v130.css
assets/css/admin-v130.css
assets/css/transfer-market-v130.css
assets/css/competition-detail-v130.css
```

`assets/app.js` resta ancora orchestratore principale.
Non fare refactor grandi su `loadData`, `renderAll`, auth o stato globale senza test mirati.

---

## 7. File da dare al prossimo assistente

Per supportare l'utente esattamente da questo punto, chiedere sempre:

### Minimo indispensabile

Uno zip di:

```text
static/zonaorientale/
```

che includa:

```text
index.html
competition.html
news.html
player.html
assets/app.js
assets/styles.css
assets/firebase.js
assets/emailjs.js
assets/css/
assets/js/
assets/competitions/
assets/listoni/
assets/rose/
assets/logos/
assets/icons/
```

### Documentazione

Uno zip di:

```text
docs/zonaorientale/
```

in particolare:

```text
AI_HANDOFF_ZONAORIENTALE_REFACTOR_V149.md
FIREBASE_RULES_ZONAORIENTALE_FULL_V124C.rules
REFACTOR_*.md
```

### Stato Git

Output di:

```bash
git branch --show-current
git status
```

### Se c'e un bug

Anche:

```text
- screenshot
- messaggi console DevTools
- pagina/hash interessata
- utente/ruolo con cui si testa: admin, presidente, visitatore
```

---

## 8. Attenzioni importanti

- Non committare cartelle backup dentro `static/`.
- Spostare backup fuori repo o fuori `static`, per esempio in `../zonaorientale-backups/`.
- Non inserire `?v=` negli import JS interni.
- Aggiornare cache busting in `index.html` quando si modificano asset CSS/JS principali.
- Non cancellare funzioni apparentemente duplicate senza verificare catena di override storici Vxx.
- Se si cambia Admin, testare sia desktop sia mobile.
- Se si cambia mobile, verificare che desktop resti identico.

---

## 9. Comandi backup consigliati

Dalla root repo:

```bash
mkdir -p ../zonaorientale-backups
BACKUP_NAME="zonaorientale_backup_$(date +%Y%m%d_%H%M%S)"
zip -r "../zonaorientale-backups/${BACKUP_NAME}.zip" static/zonaorientale docs/zonaorientale -x "*.DS_Store" "*/__MACOSX/*"
```

---

## 10. Stato consigliato prossimo step

Dopo V149, chiedere all'utente uno zip aggiornato e fare audit finale:

```text
- dimensioni app.js/styles.css/CSS mobile
- file non referenziati
- .DS_Store/__MACOSX
- sintassi JS
- verifica cache busting
- pagine principali desktop/mobile
```

Solo dopo test completo valutare merge su `master`.
