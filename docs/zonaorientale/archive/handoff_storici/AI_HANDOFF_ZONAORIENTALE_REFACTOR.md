# AI Handoff - ZonaOrientale Salerno

Documento da consegnare a un nuovo assistente prima di lavorare sul progetto.

Ultimo aggiornamento: 2026-05-20
Branch di lavoro consigliato: `feature/zonaorientale-competizioni-statiche`
Cartella progetto dentro repo Hugo/Wowchemy: `static/zonaorientale/`
Sito pubblico: `https://www.silviobarra.com/zonaorientale/`

---

## 1. Contesto del progetto

ZonaOrientale Salerno è un gestionale statico per una lega di fantacalcio manageriale.

Il sito vive dentro una repo Hugo/Wowchemy, ma la webapp ZonaOrientale è sostanzialmente autonoma:

```text
static/zonaorientale/
  index.html
  news.html
  assets/
    app.js
    styles.css
    firebase.js
    emailjs.js
    js/
    listoni/
    rose/
    logos/
    icons/
```

Il frontend è statico HTML/CSS/JS, senza build system e senza npm. Usa Firebase Authentication e Firestore direttamente dal browser. I listoni e alcune rose storiche sono file JSON statici versionati in Git.

Principio architetturale importante: il pubblico deve leggere soprattutto snapshot pubblici per ridurre le letture Firestore. L'area Admin modifica i dati ufficiali, genera snapshot e approva utenti/presidenti/richieste.

---

## 2. Regole di lavoro richieste dall'utente

L'utente vuole sempre:

1. uno zip overlay da copiare nella repo;
2. elenco file modificati;
3. comandi Git aggiornati;
4. messaggio commit coerente con la modifica;
5. modifiche piccole e testabili;
6. attenzione massima a non rompere il sito pubblico.

Quando si lavora su file della repo, preparare overlay con struttura completa, per esempio:

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/styles.css
```

Lo zip va applicato dalla root della repo con:

```bash
unzip -o nome_overlay.zip -d .
```

L'utente lavora spesso dal branch:

```bash
git checkout refactor/zonaorientale-moduli
```

Non fare push su `master` finché non è stato testato tutto.

---

## 3. Flusso Git consigliato

Prima di modifiche importanti:

```bash
git status
git checkout -b refactor/zonaorientale-moduli
cp -R static/zonaorientale static/zonaorientale_backup_pre_modifica
```

Dopo overlay e test:

```bash
git status
git add <file modificati>
git commit -m "Messaggio commit"
git push origin refactor/zonaorientale-moduli
```

Solo quando tutto è stabile:

```bash
git checkout master
git pull origin master
git merge refactor/zonaorientale-moduli
git push origin master
```

---

## 4. Test locale

Hugo/Wowchemy della repo può dare errori con versioni recenti di Hugo. Per testare solo ZonaOrientale conviene servire la cartella `static`:

```bash
cd static
python3 -m http.server 1313
```

Poi aprire:

```text
http://localhost:1313/zonaorientale/
```

Pagine da testare dopo ogni modifica:

```text
/zonaorientale/#dashboard
/zonaorientale/#news
/zonaorientale/#clubs
/zonaorientale/#listone
/zonaorientale/#competitions
/zonaorientale/#honor
/zonaorientale/#regolamento
/zonaorientale/#admin
```

Su mobile si può testare con Chrome DevTools:

1. tasto destro > Ispeziona;
2. icona telefono/tablet;
3. scegliere iPhone SE, iPhone 12 Pro o Pixel;
4. fare refresh forzato.

Oppure da telefono sulla stessa Wi-Fi:

```bash
cd static
python3 -m http.server 1313 --bind 0.0.0.0
```

Trovare IP del Mac:

```bash
ipconfig getifaddr en0
```

Aprire da telefono:

```text
http://IP_DEL_MAC:1313/zonaorientale/
```

---

## 5. Stato attuale del refactor

Il refactor è stato fatto a piccoli step, evitando grandi riscritture.

Struttura modulare introdotta:

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

  admin/
    listone-converter.js

  mobile/
    mobile-scrollbar.js
    mobile-tables.js
    mobile-viewport.js
```

`assets/app.js` resta il file principale/orchestratore, ma molte utility sono state estratte.

Step completati:

```text
Step 1  core constants/state/dom/utils
Step 2  servizi dati Firestore/static files
Step 3  helper UI
Step 4  mobile scrollbar
Step 5  formattatori core
Step 6  dominio movimenti FM
Step 7  dominio competizioni
Step 8  labels/stati
Step 9  converter listone
Step 10 helper news
Step 11 helper entita
Step 12 helper rose
Step 13 helper partite
Step 14 helper listone
Step 15 controlli tabelle mobile
Step 16 viewport mobile
```

Attenzione: un tentativo precedente di estrarre troppi selector in `assets/js/data/selectors.js` ha rotto l'app. È stato annullato. Non ripetere estrazioni grosse di funzioni dipendenti dallo stato globale senza test molto mirati.

---

## 6. Modifiche funzionali recenti

Sono state aggiunte o corrette queste funzioni:

- sostituita sezione pubblica `Movimenti & Stadi` con `Regolamento`;
- livelli stadio gestiti nelle rose, non in sezione pubblica separata;
- favicon reale con icone e manifest;
- logout visibile anche per presidenti, non solo admin;
- nella pagina presidente non compare più richiesta alla propria squadra;
- comunicati supportano grassetto con `**testo**`;
- dashboard mostra anteprima ultime 5 news sopra le metriche;
- competizioni ordinate: attive con partite programmate, attive, programmate, concluse;
- stessa logica di ordine in Dashboard e Competizioni;
- news partono ridotte di default, tranne la più recente;
- comunicati mostrano data e ora;
- comunicati di avvenuto scambio non richiedono approvazione e non devono comparire in Admin > Richieste presidenti;
- admin liste lunghe rese scrollabili con circa 5 elementi visibili;
- regolamento mobile scrollabile orizzontalmente;
- aggiunta `news.html` per anteprima social statica;
- footer aggiornato con versione e ultimo aggiornamento quando cambia `index.html`;
- Listone mobile reso più compatto;
- nel Listone mobile colonne secondarie nascoste di default: `Qt.I`, `Diff.`, `Qt.A M`, `FVM` e campi secondari;
- colonna Giocatore ridotta, colonna Stato allargata, R(RM) migliorata;
- rimossi i pulsanti Riduci/Espandi dalle singole tabelle mobile: resta il pulsante della sezione;
- dashboard mobile: pulsanti `Riduci` e `Vedi tutte` affiancati;
- Rose > Movimenti mobile: colonna `Rosa` allineata a sinistra e allargata.

---

## 7. Attenzione su cache e versioni

`index.html` usa cache busting sugli asset principali, per esempio:

```html
<link rel="stylesheet" href="./assets/styles.css?v=86" />
<script type="module" src="./assets/app.js?v=86"></script>
```

Quando si modifica `app.js` o `styles.css`, aggiornare la versione in `index.html`.

Non aggiungere cache busting agli import interni dei moduli JS, per esempio evitare:

```js
import { x } from "./constants.js?v=81";
```

Questo ha già causato problemi di caricamento del Listone. Gli import interni devono restare normali:

```js
import { x } from "./constants.js";
```

---

## 8. Tasto "Aggiorna dati"

Il tasto `Aggiorna dati` ricarica i dati della webapp senza refresh completo del browser. È utile se:

- un admin ha appena aggiornato snapshot o dati Firestore;
- un utente è rimasto sulla pagina aperta mentre i dati sono cambiati;
- si vuole forzare una rilettura dopo un problema temporaneo.

Però non è indispensabile in ogni pagina, perché la webapp carica già i dati all'avvio e dopo la navigazione interna. Possibile miglioramento consigliato:

- mantenere `Aggiorna dati` nel desktop header;
- su mobile nasconderlo o spostarlo in menu `Altro`;
- per utenti non admin, trasformarlo in icona piccola;
- eventualmente mostrare testo `Ultimo aggiornamento: 2026-05-20

Non eliminarlo subito senza accordo: è utile durante test e gestione Admin.

---

## 9. File che si possono spostare fuori da static

La cartella `static/` viene pubblicata online. I file documentali/debug possono stare fuori da `static`, per esempio in:

```text
docs/zonaorientale/
```

Spostabili senza influenzare il funzionamento pubblico, se non linkati direttamente:

```text
static/zonaorientale/README_ZONAORIENTALE_FIREBASE.md
static/zonaorientale/AI_HANDOFF_ZONAORIENTALE.md
static/zonaorientale/FIREBASE_RULES.rules
static/zonaorientale/debug-firestore.html
static/zonaorientale/index_old.html
```

Da non spostare:

```text
static/zonaorientale/index.html
static/zonaorientale/news.html
static/zonaorientale/favicon.ico
static/zonaorientale/site.webmanifest
static/zonaorientale/assets/
```

Dentro `assets/`, non spostare:

```text
app.js
firebase.js
emailjs.js
styles.css
js/
icons/
logos/
listoni/
rose/
```

---

## 10. Snapshot pubblici e Firebase

Le raccolte operative principali sono in Firestore. Il pubblico dovrebbe leggere soprattutto snapshot:

```text
publicSeasonSnapshots/{seasonId}
publicSnapshots/honor
publicTeamSnapshots/{seasonId}_{teamId}
```

Dopo modifiche Admin importanti bisogna rigenerare gli snapshot pubblici.

Dati statici importanti:

```text
assets/listoni/manifest.json
assets/listoni/2026-05-15.json
assets/rose/manifest.json
assets/rose/2025-2026-2026-05-12.json
```

---

## 11. Indicazioni per il prossimo assistente

Prima di modificare il progetto chiedere o verificare:

1. su quale branch sta lavorando l'utente;
2. se ha già applicato overlay precedenti;
3. se il sito funziona in locale con `python3 -m http.server 1313` dalla cartella `static`;
4. quali file sono attualmente modificati con `git status`;
5. se deve essere prodotto uno zip overlay.

Approccio consigliato:

- non fare refactor grande;
- non sovrascrivere `index.html` partendo da versioni vecchie;
- non reintrodurre `Movimenti & Stadi`;
- mantenere `Regolamento`;
- mantenere i moduli JS già creati;
- aggiornare footer e cache busting quando si tocca `index.html`;
- se un overlay rompe il sito, preparare subito hotfix o rollback mirato;
- ogni overlay deve essere applicabile dalla root repo.

Quando si dà una risposta con modifica, includere sempre:

```text
- link allo zip overlay
- file modificati
- cosa cambia
- come applicarlo
- test consigliati
- comandi Git
- commit message
```

---

## 12. Stato consigliato prima del merge finale

Prima di fondere su `master`:

```bash
git status
cd static
python3 -m http.server 1313
```

Testare:

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

Poi:

```bash
git checkout master
git pull origin master
git merge refactor/zonaorientale-moduli
git push origin master
```


---

## 15. Competizioni statiche da JSON

Nuova funzionalita sul branch `feature/zonaorientale-competizioni-statiche`:

```text
static/zonaorientale/assets/competitions/
  manifest.json
  <stagione>/
    <competizione>-<stagione>.json
```

Obiettivo: ridurre letture Firebase per calendari competizione consolidati, mantenendo calendario e risultati in JSON statici versionati in Git.

Il sito carica `assets/competitions/manifest.json` e poi i file JSON indicati per la stagione selezionata. Se trova una competizione Firebase corrispondente, arricchisce i dati Firebase con quelli statici; se non la trova, crea una competizione sintetica da JSON.

Le card competizione mostrano badge fonte:

```text
JSON statico
Firebase
```

Le partite sono raggruppate per fase e ordinate da finale a scendere:

```text
Finale
Semifinali ritorno
Semifinali andata
Quarti di finale ritorno
Quarti di finale andata
...
```

Ogni fase e riducibile/espandibile.

L'importatore Admin `Importa calendario competizione` legge un Excel, mostra anteprima modificabile e genera uno zip overlay con JSON competizione + manifest completo. Dalla V108 l'anteprima permette di associare Casa/Trasferta alle squadre stagionali Firebase; il JSON salva anche:

```json
{
  "homeSeasonTeamId": "...",
  "awaySeasonTeamId": "...",
  "homeTeamName": "...",
  "awayTeamName": "..."
}
```

Gli ID sono la fonte primaria; i nomi restano come fallback e per leggibilita. I vecchi JSON senza ID continuano a funzionare tramite matching per nome.

Le competizioni custom sono supportate: nome libero, slug libero e tipo `ALTRO`. Nelle schermate pubbliche mostrare sempre `competition.name` se presente, altrimenti il tipo.

---

## 15. Competizioni statiche da Excel

Nuova funzionalita su branch `feature/zonaorientale-competizioni-statiche`.

Obiettivo: ridurre accessi Firebase spostando i calendari consolidati delle competizioni in file JSON statici versionati in Git. La fonte pubblica deve essere:

```text
1. JSON statico in assets/competitions/ se presente
2. Firebase / publicSeasonSnapshots come fallback
```

Struttura prevista:

```text
static/zonaorientale/assets/competitions/
  manifest.json
  2025-2026/
    champions-league-2025-2026.json
```

`manifest.json` contiene un array `competitions` con record come:

```json
{
  "id": "2025-2026-champions-league",
  "seasonId": "2025-2026",
  "competitionId": "2025_2026_champions-league",
  "competitionName": "Champion's League",
  "competitionSlug": "champions-league",
  "file": "2025-2026/champions-league-2025-2026.json",
  "matches": 13,
  "playedMatches": 13,
  "status": "CONCLUSA"
}
```

Il JSON della competizione deve salvare sia i nomi delle squadre sia gli ID stagionali, quando disponibili:

```json
{
  "homeTeamName": "Prestige Worldwide",
  "homeSeasonTeamId": "...",
  "awayTeamName": "Real Mappine",
  "awaySeasonTeamId": "...",
  "homeGoals": 2,
  "awayGoals": 1,
  "homeScore": 73,
  "awayScore": 66.5
}
```

L'importatore Admin `Importa calendario competizione`:

- legge Excel nel browser;
- mostra sempre anteprima modificabile;
- permette di correggere fase, andata/ritorno/secca, giornate, squadre, fantapunti, risultato e stato;
- mostra select per associare Casa/Trasferta alle `seasonTeams` Firebase;
- genera zip overlay con JSON competizione e manifest completo gia aggiornato.

Nel sito pubblico:

- ogni competizione mostra badge `JSON statico` oppure `Firebase`;
- se esiste JSON statico, partite e risultati vengono da JSON;
- se manca JSON statico, si usa Firebase/snapshot;
- i fantapunti nel risultato (`FP 61.5-73`) indicano che il calendario statico sta arricchendo o sostituendo i dati Firebase;
- il nome pubblico della competizione deve preferire il nome del JSON statico;
- le fasi sono ordinate da finale a scendere: Finale, Semifinali ritorno, Semifinali andata, Semifinali secche, Quarti ritorno, Quarti andata, ecc.;
- se una fase ha solo una partita/turno secco non deve essere etichettata come andata.

Pagina dedicata:

```text
static/zonaorientale/competition.html
```

Apre il calendario completo della competizione dalla card pubblica tramite pulsante `Apri competizione`. Anche questa pagina usa prima il JSON statico e solo se assente prova lo snapshot Firebase della stagione.

### Competizioni statiche

- Nuova cartella dati: `static/zonaorientale/assets/competitions/`.
- Il sito deve leggere prima i calendari JSON statici e usare Firebase/snapshot solo come fallback.
- Se una competizione ha JSON statico, il nome pubblico viene preso dal JSON prima che da Firebase.
- I JSON competizione devono salvare anche `homeSeasonTeamId` e `awaySeasonTeamId`, oltre ai nomi squadra, per evitare matching fragile solo per nome.
- In `#competitions` le partite sono raggruppate per fase in ordine: Finale, Semifinali ritorno, Semifinali andata, Semifinali secche, Quarti di finale ritorno, Quarti di finale andata, Quarti di finale secche, fasi precedenti.
- Quando le partite sono gia raggruppate per fase, la tabella delle singole partite non deve ripetere la colonna `Fase`.
- In Admin -> Partite competizioni, le partite Firebase coperte da JSON statico mostrano un badge `JSON`, cosi l'utente puo eliminarle da Firebase dopo verifica.
- La pagina `competition.html` mostra l'intero calendario della competizione, con JSON statico come fonte primaria.

### Competizioni statiche e raggruppamento fasi

Per ridurre letture Firebase e rendere lo storico versionato in Git e stata introdotta la cartella:

```text
static/zonaorientale/assets/competitions/
  manifest.json
  <seasonId>/<competition-slug>-<seasonId>.json
```

La fonte e `static first`: se una competizione ha JSON statico, partite e risultati vengono letti prima dal JSON; Firebase/snapshot e fallback. Le card mostrano badge `JSON statico` o `Firebase`.

Le partite sono raggruppate cosi:

```text
Finale
Semifinali ritorno
Semifinali andata
Semifinali
Quarti di finale ritorno
Quarti di finale andata
Quarti di finale
Giornata N, per campionato/regular season
Serie A N solo come fallback
```

Per competizioni tipo Campionato/Regular Season, il calendario deve essere raggruppato per `Giornata 1`, `Giornata 2`, ecc. usando `leagueMatchday`; se manca `leagueMatchday` puo usare `serieAMatchday` come fallback. Per KO/Playoff, una partita senza fase esplicita ma successiva a semifinali/quarti puo essere inferita come `Finale`.

Nel JSON statico, quando possibile, salvare sempre anche:

```json
{
  "homeSeasonTeamId": "...",
  "awaySeasonTeamId": "...",
  "homeTeamName": "...",
  "awayTeamName": "..."
}
```

I nomi servono come fallback, ma gli ID sono la fonte piu robusta per associare squadre Firebase e JSON.


---

## 15. Stato V114 - Admin, competizioni statiche e formule

Modifiche importanti introdotte fino a V114 sul branch `feature/zonaorientale-competizioni-statiche`:

- Admin riorganizzato in categorie: Utenti e comunicazioni, Stagioni e club, Rose e mercato, Competizioni, Snapshot e backup.
- Rimosso il pulsante verde rapido `Importa calendario competizione` sopra tutto l'Admin; il pannello resta nella categoria Competizioni.
- Snapshot pubblici: il pannello deve mostrare data/ora ultimo snapshot della stagione selezionata e ultimo snapshot Albo/FIFA.
- Formule competizione supportate in Admin:
  - `UNO_VS_TUTTI` = 1 Vs Tutti
  - `FORMULA_1` = Formula 1
  - `CLASSIFICA` = A Calendario
  - `GIRONI_KO` = Ad Eliminazione Diretta
  - `GRUPPI` = A gruppi
  - `BATTLE_ROYALE` = Battle Royale
  - `HIGHLANDER` = Highlander
- Nei calendari statici il JSON e fonte primaria; Firebase/snapshot sono fallback.
- In mobile non mostrare badge fonte `JSON statico` / `Firebase` nella pagina Competizioni, per leggibilita.
- Nei risultati pubblici il punteggio deve essere in grassetto e i fantapunti tra parentesi, ad esempio: `2-1 · (72,5-68)`.
- Per utenti che sono sia admin sia presidenti: attualmente l'app privilegia il ruolo admin. Una vera scelta ruolo al login richiede una modifica dedicata dello stato UI e dei permessi; non e stata implementata in V114.


---

## 16. Stato V115 - Admin a sottosezioni

- L'Admin deve mostrare vere sottosezioni visivamente distinte dai singoli pannelli funzionali.
- Le sottosezioni attuali sono: Utenti e comunicazioni, Stagioni e club, Rose e mercato, Competizioni, Snapshot e backup.
- Ogni sottosezione usa un contenitore `admin-category-section` con titolo, descrizione e pannelli funzionali interni.
- Evitare di rendere il titolo della sottosezione uguale ai pannelli, perche l'utente ha segnalato che la gerarchia non era chiara.
