# AI Handoff - ZonaOrientale Salerno

Ultimo aggiornamento: 19/05/2026  
Stato progetto: refactor modulare pubblicato su `master`; nuovo lavoro da fare sul branch `feature/zonaorientale-ui-funzionalita`.

## 1. Contesto generale

ZonaOrientale Salerno è un gestionale fantacalcio manageriale pubblicato dentro una repo Hugo/Wowchemy. La webapp si trova nella cartella:

```text
static/zonaorientale/
```

Il sito è statico: HTML, CSS e JavaScript vanilla. Non usa backend proprietario e non richiede build JS. Firebase viene usato dal frontend per Authentication e Firestore. I file JS sono caricati direttamente dal browser come ES modules.

Il sito pubblico deve leggere il più possibile da snapshot pubblici per ridurre le letture Firestore. L'area Admin modifica i dati ufficiali e poi genera gli snapshot pubblici.

URL pubblico:

```text
https://www.silviobarra.com/zonaorientale/
```

## 2. Regole di lavoro con l'assistente AI

L'utente vuole sempre ricevere:

```text
1. zip overlay pronto da copiare nella repo;
2. elenco file modificati;
3. istruzioni di applicazione/test;
4. comandi Git aggiornati;
5. messaggio commit coerente con la modifica.
```

Gli overlay devono contenere i file già nella posizione corretta, ad esempio:

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/styles.css
```

L'utente applica gli overlay dalla root della repo con:

```bash
unzip -o nome_overlay.zip -d .
```

Non proporre modifiche dirette su `master` finché non sono testate. Il flusso corretto è:

```bash
git checkout master
git pull origin master
git checkout -b feature/nome-branch
```

Poi, quando la modifica funziona:

```bash
git add ...
git commit -m "Messaggio"
git push origin feature/nome-branch
```

Solo alla fine:

```bash
git checkout master
git pull origin master
git merge feature/nome-branch
git push origin master
```

## 3. Branch attuale

Il branch di refactor già usato era:

```text
refactor/zonaorientale-moduli
```

Quel branch è stato mergeato e pushato su `master`.

Per le prossime modifiche grafiche e funzionali il branch corrente consigliato/creato è:

```text
feature/zonaorientale-ui-funzionalita
```

## 4. Test locale

Hugo/Wowchemy può dare problemi con versioni recenti di Hugo. Per testare solo ZonaOrientale è preferibile servire la cartella `static`:

```bash
cd static
python3 -m http.server 1313
```

Poi aprire:

```text
http://localhost:1313/zonaorientale/
```

Per tornare alla root della repo:

```bash
cd ..
```

Pagine da testare spesso:

```text
/zonaorientale/
/zonaorientale/#dashboard
/zonaorientale/#news
/zonaorientale/#clubs
/zonaorientale/#listone
/zonaorientale/#competitions
/zonaorientale/#honor
/zonaorientale/#regolamento
/zonaorientale/#admin
/zonaorientale/news.html
```

Da mobile si può testare con Chrome DevTools: tasto destro > Ispeziona > icona telefono/tablet > refresh forzato.

## 5. Architettura attuale

Struttura principale:

```text
static/zonaorientale/
  index.html
  news.html
  favicon.ico
  site.webmanifest

  assets/
    app.js
    emailjs.js
    firebase.js
    styles.css

    icons/
      favicon-16x16.png
      favicon-32x32.png
      apple-touch-icon.png
      android-chrome-192x192.png
      android-chrome-512x512.png

    logos/
      ... loghi squadre statici ...

    listoni/
      manifest.json
      2026-05-15.json

    rose/
      manifest.json
      2025-2026-2026-05-12.json

    js/
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

      admin/
        listone-converter.js

      mobile/
        mobile-scrollbar.js
        mobile-tables.js
        mobile-viewport.js
```

Documentazione consigliata fuori da `static`:

```text
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_REFACTOR.md
```

Backup locale ignorato:

```text
static/zonaorientale_refactor_backup/
```

## 6. File fondamentali

### Frontend

```text
static/zonaorientale/index.html
static/zonaorientale/news.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/styles.css
static/zonaorientale/assets/firebase.js
static/zonaorientale/assets/emailjs.js
```

### Moduli JS refactor

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

### Dati statici

```text
static/zonaorientale/assets/listoni/manifest.json
static/zonaorientale/assets/listoni/2026-05-15.json
static/zonaorientale/assets/rose/manifest.json
static/zonaorientale/assets/rose/2025-2026-2026-05-12.json
```

### Documenti e configurazioni utili

Se ancora presenti in repo o spostati in docs:

```text
FIREBASE_RULES.rules
README_ZONAORIENTALE_FIREBASE.md
debug-firestore.html
AI_HANDOFF_ZONAORIENTALE_REFACTOR.md
```

## 7. File da mandare all'assistente AI

Per una modifica normale al sito, mandare sempre:

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/styles.css
static/zonaorientale/assets/firebase.js
static/zonaorientale/assets/emailjs.js
static/zonaorientale/news.html
static/zonaorientale/site.webmanifest
```

Dato che il progetto ora è modulare, mandare anche tutta la cartella:

```text
static/zonaorientale/assets/js/
```

oppure almeno i file del modulo interessato.

Per modifiche a Listone/Svincolati, mandare anche:

```text
static/zonaorientale/assets/listoni/manifest.json
static/zonaorientale/assets/listoni/2026-05-15.json
static/zonaorientale/assets/js/domain/listone.js
static/zonaorientale/assets/js/admin/listone-converter.js
```

Per modifiche a Rose/Movimenti, mandare anche:

```text
static/zonaorientale/assets/rose/manifest.json
static/zonaorientale/assets/rose/2025-2026-2026-05-12.json
static/zonaorientale/assets/js/domain/rosters.js
static/zonaorientale/assets/js/domain/fm-movements.js
```

Per modifiche a Competizioni/Calendario/Classifiche, mandare anche:

```text
static/zonaorientale/assets/js/domain/competitions.js
static/zonaorientale/assets/js/domain/matches.js
```

Per modifiche mobile, mandare anche:

```text
static/zonaorientale/assets/js/mobile/mobile-scrollbar.js
static/zonaorientale/assets/js/mobile/mobile-tables.js
static/zonaorientale/assets/js/mobile/mobile-viewport.js
```

Per modifiche Admin/Firebase/rules/snapshot, mandare anche:

```text
FIREBASE_RULES.rules
backup Firebase più recente in JSON
static/zonaorientale/assets/firebase.js
static/zonaorientale/assets/js/data/firestore-service.js
static/zonaorientale/assets/js/data/static-files-service.js
```

Per far capire tutto a un nuovo assistente, mandare preferibilmente:

```text
1. AI_HANDOFF_ZONAORIENTALE_REFACTOR.md
2. index.html
3. news.html
4. assets/app.js
5. assets/styles.css
6. assets/firebase.js
7. assets/emailjs.js
8. intera cartella assets/js/
9. assets/listoni/manifest.json
10. ultimo file assets/listoni/*.json
11. assets/rose/manifest.json
12. ultimo file assets/rose/*.json
13. backup Firebase più recente
14. FIREBASE_RULES.rules se devi toccare permessi/admin
```

## 8. Firebase e dati

Firebase viene usato dal frontend.

Raccolte principali usate dal gestionale:

```text
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
pendingUsers
teamUsers
teamRequests
publicSeasonSnapshots
publicSnapshots
publicTeamSnapshots
```

Il sito pubblico dovrebbe leggere soprattutto snapshot pubblici:

```text
publicSeasonSnapshots/{seasonId}
publicSnapshots/honor
publicTeamSnapshots/{seasonId}_{teamId}
```

Dopo modifiche Admin importanti bisogna rigenerare gli snapshot pubblici.

I listoni sono statici in Git, non in Firestore, per evitare centinaia di documenti giocatore.

## 9. Modifiche già fatte prima di questo handoff

### Refactor modulare

`app.js` è stato alleggerito estraendo moduli in:

```text
assets/js/core/
assets/js/data/
assets/js/domain/
assets/js/admin/
assets/js/mobile/
```

Il refactor sicuro si è fermato dopo l'estrazione di:

```text
core constants/state/dom/utils/ui/formatters
data Firestore/static files
domain FM movements, competitions, labels, news, entities, rosters, matches, listone
admin listone converter
mobile scrollbar, mobile tables, mobile viewport
```

Un tentativo di estrarre selector dati era stato fatto e poi annullato perché rompeva lo startup. Non ripetere refactor grandi di selector in un solo overlay.

### Regolamento

La vecchia sezione pubblica `Movimenti & Stadi` è stata rimossa. Al suo posto c'è la sezione:

```text
#regolamento
```

Il testo è dentro `index.html` in sezione Regolamento. Da mobile deve poter scorrere orizzontalmente se il `<pre>` è largo.

### News e comunicati

- I comunicati supportano grassetto con `**testo**`.
- La pagina News mostra i comunicati ridotti di default, tranne il più recente.
- I comunicati mostrano data e ora.
- Esiste `news.html` per anteprima social statica e redirect verso `#news`.
- Con sito statico, l'anteprima social automatica dell'ultima news Firebase non è davvero dinamica: per quello servirebbe server-side/Cloud Function.

### Admin

- Alcune liste lunghe Admin sono state rese scrollabili con circa 5 righe visibili.
- I comunicati automatici di avvenuto scambio non devono finire in Admin > Richieste presidenti e non devono richiedere approvazione.
- Il logout deve comparire anche agli account presidente.
- Nella pagina presidente non deve comparire un pulsante per inviare richiesta alla propria squadra.

### Mobile

- Bottom navigation mobile attiva.
- Scrollbar/cursore verticale custom mobile estratto in `mobile-scrollbar.js`.
- Gestione viewport mobile estratta in `mobile-viewport.js`.
- Controlli tabelle mobile estratti in `mobile-tables.js`.
- I pulsanti Riduci/Espandi delle singole tabelle mobile sono stati rimossi perché ridondanti: resta il Riduci/Espandi della sezione.
- I pulsanti Riduci/Espandi delle sezioni da mobile devono stare allineati con il titolo.

### Listone/Svincolati mobile

Modifiche recenti:

- Nel Listone mobile sono nascosti di default campi secondari come Qt.I, Diff, Qt.A M, FVM.
- Colonna Giocatore ridotta per non occupare troppo spazio.
- Colonna Stato allargata.
- Colonna R(RM) allargata rispetto alla prima prova.
- Header tabella reso sticky.
- Colonna Giocatore sticky a sinistra.

Attenzione: non usare cache-busting negli import interni ES module tipo `import ... from './constants.js?v=...'`, perché aveva causato problemi di moduli non allineati. Fare cache busting solo in `index.html` sui file principali caricati via `<script>`/`<link>`.

### Dashboard

- Sopra le metriche ci sono le anteprime delle ultime 5 news.
- Da mobile, nella sezione Ultime news e comunicati, i pulsanti `Riduci` e `Vedi tutte` devono stare affiancati e non sovrapporsi.

### Competizioni

Ordine pubblico competizioni:

```text
1. attive con partite programmate
2. attive
3. programmate
4. concluse
5. altre/non disputate
```

Dentro ogni competizione, mostrare prima le partite da disputare e poi quelle già disputate.

Nota: l'utente ha scritto “prima le partite disputate e poi quelle già disputate”, ma dal contesto intendeva “prima quelle da disputare, poi quelle già disputate”. Verificare se emergono ambiguità.

### Footer/versione

Ogni volta che viene generato un nuovo `index.html`, il footer deve includere:

```text
versione + ultimo aggiornamento fatto
```

Esempio:

```text
V86 dashboard news e movimenti mobile · Ultimo aggiornamento 19/05/2026
```

## 10. Cose da evitare

Non fare:

```text
- grandi refactor monolitici di app.js;
- riscritture complete di CSS mobile;
- spostamenti di file statici senza aggiornare i path;
- inserimento di backup dentro git;
- salvataggio loghi base64 in Firestore;
- commit diretti su master senza branch/test;
- git add . se ci sono backup o cartelle temporanee.
```

Non spostare:

```text
static/zonaorientale/index.html
static/zonaorientale/news.html
static/zonaorientale/favicon.ico
static/zonaorientale/site.webmanifest
static/zonaorientale/assets/
```

Si possono spostare fuori da `static`, in `docs/zonaorientale/`, solo documenti di supporto non necessari al runtime.

## 11. Gitignore consigliato

Il `.gitignore` dovrebbe contenere almeno:

```text
# IDEs
.idea/

# Hugo
/resources/
public/
jsconfig.json
node_modules/

# macOS
.DS_Store

# Local backups / private config
static/zonaorientale.backup/
static/zonaorientale_refactor_backup/
config_firebase
static/zonaorientale/comandi_git
mine_not_to_push
static/docs_zonaorientale/
static/docs/
static/zonaorientale/docs/
```

## 12. Comandi Git utili

Stato repo:

```bash
git status
```

Nuovo branch:

```bash
git checkout master
git pull origin master
git checkout -b feature/nome-branch
```

Commit sul branch:

```bash
git add file1 file2 cartella/
git commit -m "Messaggio commit"
git push origin feature/nome-branch
```

Merge su master:

```bash
git checkout master
git pull origin master
git merge feature/nome-branch
git push origin master
```

Backup locale fuori da `zonaorientale`:

```bash
rm -rf static/zonaorientale_refactor_backup
cp -R static/zonaorientale static/zonaorientale_refactor_backup
```

## 13. Priorità future possibili

Possibili prossime aree su cui ragionare:

```text
- restyle grafico dashboard;
- ridurre invasività del pulsante Aggiorna dati su mobile;
- migliorare UI Admin per pannelli lunghi;
- rendere news.html generabile/aggiornabile meglio;
- pulizia CSS per sezioni, ma senza riscrivere il mobile tutto insieme;
- migliorare Listone mobile con modalità Compatta/Completa;
- eventuale validatore dati per backup Firebase + listoni + rose.
```

