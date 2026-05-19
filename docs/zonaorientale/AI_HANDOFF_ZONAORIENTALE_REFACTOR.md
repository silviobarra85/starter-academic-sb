# AI Handoff - ZonaOrientale Salerno

Ultimo aggiornamento: 2026-05-19
Versione sito/overlay corrente: V86 - dashboard news e movimenti mobile
Branch di lavoro: `refactor/zonaorientale-moduli`
Branch pubblico/deploy previsto: `master`

## Contesto del progetto

ZonaOrientale Salerno è un gestionale fantacalcio manageriale ospitato dentro una repo Hugo/Wowchemy, nella cartella:

```text
static/zonaorientale/
```

Il sito è una webapp statica HTML/CSS/JS. Hugo/Wowchemy serve solo come contenitore della repo; la webapp funziona anche servendo direttamente la cartella `static` con un server statico locale.

Stack:

```text
Frontend: HTML, CSS, JavaScript modules
Auth: Firebase Authentication
DB: Firestore
Dati statici: JSON in assets/listoni e assets/rose
Deploy pubblico: branch master della repo GitHub
```

Il sito pubblico deve leggere soprattutto snapshot pubblici per ridurre le letture Firestore. L'area Admin modifica i dati ufficiali, genera snapshot e gestisce utenti, presidenti e richieste.

## Regola operativa fondamentale

L'utente vuole sempre ricevere:

```text
1. zip overlay da copiare nella repo
2. elenco file modificati
3. istruzioni di test
4. comandi Git aggiornati
5. messaggio commit coerente con la modifica
```

Non proporre modifiche invasive in un solo overlay. Dopo alcuni errori avvenuti durante il refactor, la regola è: piccoli overlay, test immediato, commit, poi step successivo.

## Stato attuale del refactor

Il refactor è stato eseguito sul branch:

```text
refactor/zonaorientale-moduli
```

Lo scopo era ridurre il monolite `assets/app.js` senza cambiare comportamento.

Sono stati introdotti moduli statici senza npm/build system:

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

Lo Step 4 originale che provava a estrarre molti selector in `selectors.js` era rotto ed è stato annullato. Non reintrodurre quel file senza un refactor molto più graduale.

## File principali attuali

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
    logos/
    listoni/
    rose/
    js/
```

File documentali consigliati fuori da `static`, perché tutto ciò che sta sotto `static` viene pubblicato:

```text
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_REFACTOR.md
```

Se presenti ancora dentro `static/zonaorientale`, possono essere spostati fuori da `static`:

```text
README_ZONAORIENTALE_FIREBASE.md
AI_HANDOFF_ZONAORIENTALE.md
FIREBASE_RULES.rules
debug-firestore.html
index_old.html
```

## Backup locale consigliato prima del merge su master

L'utente vuole creare un backup completo della cartella refactor prima del merge. Il backup deve stare fuori da `zonaorientale`, come cartella sorella:

```text
static/zonaorientale_refactor_backup/
```

Questa cartella deve essere ignorata da Git tramite `.gitignore`:

```text
static/zonaorientale_refactor_backup/
```

## Test locale consigliato

Hugo/Wowchemy può dare errori con versioni recenti di Hugo. Per testare solo ZonaOrientale usare:

```bash
cd static
python3 -m http.server 1313
```

Poi aprire:

```text
http://localhost:1313/zonaorientale/
```

Testare almeno:

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
```

Da mobile, senza emulatore dedicato, usare Chrome DevTools:

```text
Tasto destro > Ispeziona > icona telefono/tablet > scegli iPhone/Pixel > Cmd+Shift+R
```

Oppure da telefono reale sulla stessa rete:

```bash
cd static
python3 -m http.server 1313 --bind 0.0.0.0
```

Poi aprire da telefono l'IP locale del Mac.

## Modifiche funzionali già fatte

### Favicon

Aggiunte favicon, icone mobile e `site.webmanifest`.

### Regolamento

La vecchia sezione pubblica `Movimenti & Stadi` è stata rimossa. Al suo posto c'è `Regolamento`, con testo importato dal PDF ufficiale. I livelli stadio vengono gestiti nelle rose.

### Login/presidenti

Corretto il logout: deve comparire per ogni utente autenticato, non solo admin.

Nella pagina presidente non deve comparire il pulsante per inviare richiesta alla propria squadra.

### Comunicati/news

I comunicati supportano il grassetto con `**testo**`.

Nella dashboard sono state aggiunte le anteprime delle ultime 5 news sopra le metriche.

Nella sezione News tutti i comunicati partono ridotti di default tranne il più recente.

I comunicati mostrano data e ora di pubblicazione.

`news.html` è stata aggiunta come pagina condivisibile per anteprima social statica. Con sito statico puro non è possibile avere anteprima social sempre aggiornata da Firebase senza generazione server-side o Cloud Function.

I comunicati di avvenuto scambio non devono passare da Admin > Richieste presidenti: vengono pubblicati direttamente nelle News e inviati via email.

### Admin

Le liste lunghe in Admin devono essere scrollabili con circa 5 righe visibili, per non occupare troppo spazio. Sezioni interessate: stagioni, presidenti, squadre, squadre per stagione, rose e movimenti FM, stadi, partite competizione, FIFA ranking.

### Competizioni

Ordinamento pubblico competizioni:

```text
1. attive con partite programmate
2. attive
3. programmate
4. concluse
5. altre/non disputate
```

Nelle singole competizioni, ordinare prima le partite da disputare e poi quelle già disputate.

### Mobile

Risolti vari problemi mobile:

- rose espanse che si sovrapponevano alle righe;
- una sola rosa aperta per volta su mobile;
- cursore verticale mobile opzionale per scorrere la pagina;
- rimosso il pulsante Riduci/Espandi dalle singole tabelle mobile, lasciando solo quello della sezione;
- allineamento dei pulsanti Riduci/Vedi tutte in dashboard news;
- tabella movimenti: colonna Rosa più larga e allineata a sinistra;
- Regolamento scrollabile in orizzontale su mobile.

### Listone/Svincolati mobile

La sezione Listone è stata rifinita su mobile:

- nel Listone sono nascosti/deselezionati di default campi secondari come Qt.I, Diff, Qt.A M e FVM;
- la colonna Giocatore è stata ridotta per evitare eccessivo spazio;
- la colonna R(RM) è stata allargata;
- la colonna Stato è stata allargata;
- intestazioni rese sticky dove possibile;
- scroll orizzontale mantenuto.

## Attenzione CSS

`styles.css` contiene ancora molte patch storiche e regole mobile sovrapposte. Non fare una riscrittura totale. Se si interviene sul CSS:

```text
1. aggiungere regole finali mirate
2. testare mobile subito
3. evitare di rimuovere blocchi storici senza confronto visivo
```

In futuro il CSS potrebbe essere diviso in:

```text
assets/css/00-tokens.css
assets/css/10-base.css
assets/css/20-layout.css
assets/css/30-components.css
assets/css/40-tables.css
assets/css/50-mobile.css
assets/css/60-admin.css
assets/css/70-regulation.css
```

Ma non è ancora stato fatto.

## Cose da evitare

Non usare React/Vue/NPM/build system.

Non spostare i dati statici da `assets/listoni` o `assets/rose` senza aggiornare i loader.

Non reintrodurre loghi base64 in Firestore: i loghi devono essere path statici dentro `assets/logos`.

Non generare overlay partendo da versioni vecchie di `index.html` o `app.js`: in passato questo ha fatto riapparire `Movimenti & Stadi` e sparire `Regolamento`.

Non estrarre grandi blocchi di selector in un colpo solo. Lo Step 4 originale ha rotto la navigazione e il caricamento dati.

## Flusso Git raccomandato

Durante sviluppo:

```bash
git status
git add ...
git commit -m "Messaggio coerente"
git push origin refactor/zonaorientale-moduli
```

Per pubblicare su master dopo test finale:

```bash
git checkout master
git pull origin master
git merge refactor/zonaorientale-moduli
git push origin master
```

Prima del merge creare backup locale:

```bash
rm -rf static/zonaorientale_refactor_backup
cp -R static/zonaorientale static/zonaorientale_refactor_backup
```

Assicurarsi che `.gitignore` contenga:

```text
static/zonaorientale_refactor_backup/
```

## Nota sui percorsi

L'utente spesso lavora da terminale dentro la cartella `static`. Se il terminale è in `static`, i percorsi sono:

```text
zonaorientale/index.html
zonaorientale/assets/app.js
```

Se il terminale è nella root della repo, i percorsi sono:

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
```

Controllare sempre con:

```bash
pwd
git status
```
