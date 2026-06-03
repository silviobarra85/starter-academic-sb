# Handoff nuovo assistente AI - ZonaOrientale Salerno V322

## Contesto

Repo reale:

```text
starter-academic-sb
```

Webapp:

```text
static/zonaorientale/
```

Documentazione:

```text
docs/zonaorientale/
```

Netlify Functions:

```text
netlify/functions/
```

Branch di lavoro abituale:

```text
refactor/260528-zonaorientale-next
```

Branch produzione/deploy:

```text
master
```

## Regola assoluta

La priorita principale e':

```text
non perdere funzionalita gia esistenti
```

Ogni proposta, fix, refactor o nuova funzione deve dichiarare:

```text
funzionalita a rischio
come vengono preservate
test manuali richiesti
```

Non rimuovere codice legacy, fallback, moduli storici o CSS vecchi senza audit e test.

## Stato corrente

Ultima versione runtime consegnata:

```text
V322 - fix diagnostica ruoli Listone
```

V322 corregge il falso positivo in `Admin -> Diagnostica dati` dove `Listoni - qualita dati` segnalava `senza ruolo 663`. Il problema era nella diagnostica, non nei dati Listone. I JSON usano campi come `classicRole`, `rosterRole` e `mantraRoles`; ora la diagnostica li riconosce.

## Importante su V315 AI

La V315 con sintesi AI Calciomercato NON e' stata applicata. L'utente ha deciso di non introdurre ora la modalita AI. Non considerarla attiva e non proporla come gia presente.

## Stato deploy Netlify

Netlify pubblica `public` generato da Hugo:

```toml
[build]
  publish = "public"
  functions = "netlify/functions"
```

Il build moderno Netlify usava Hugo 0.161 e falliva con il progetto Wowchemy vecchio. E' stata preparata/applicata una patch per forzare Hugo 0.80 tramite:

```text
netlify/build-hugo-0.80.sh
```

Se il sito online resta vecchio, controllare i log Netlify prima di cambiare codice.

## Comandi locali

Sito statico:

```bash
cd starter-academic-sb
cd static/zonaorientale
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

Con Netlify Functions:

```bash
cd starter-academic-sb
npx netlify-cli dev \
  --command "python3 -m http.server 1314 --directory static --bind 0.0.0.0" \
  --target-port 1314 \
  --port 8888
```

Aprire:

```text
http://localhost:8888/zonaorientale/
http://localhost:8888/.netlify/functions/calciomercato-feed?limit=120
```

## Controlli pre-push

```bash
static/zonaorientale/tools/check-zonaorientale.sh
node --check netlify/functions/calciomercato-feed.js
```

Se ci sono file macOS:

```bash
static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh --apply
```

## Funzionalita pubbliche da preservare

### Home

- Dashboard stagione.
- Card rapide.
- Link a Listone, Rose, Competizioni, Albo, News, Archivio, Statistiche, Confronta, Regolamento, Calciomercato.
- Dark mode unica attiva.
- Light mode sospesa e toggle nascosto.

### News

- Elenco e dettaglio comunicati.
- Link WhatsApp via:

```text
/zonaorientale/share/news/:id
```

- Netlify Function:

```text
netlify/functions/news-share.js
```

### Rose / pagina squadra

- Visualizzazione rose.
- Tabella giocatori.
- Prima colonna sticky mobile.
- Righe compatte.
- Dashboard Presidente usa tabelle rosa: non rompere CSS condiviso.

### Listone

Funzioni critiche:

```text
colonna Modifica
filtro Modifiche
Mostra usciti storici
ricerca
filtro ruolo/stato
export CSV modifiche solo Admin
normalizzazione squadre reali
confronto con listone precedente
```

Non modificare convertitore o storico Listone senza test con Excel reale.

### Fantamercato interno

Distinto da Calciomercato RSS. Da preservare:

```text
giocatori trasferibili
filtri
ricerca
avvio proposta
condizioni trasferibilita
```

### Calciomercato RSS

Distinto dal Fantamercato interno.

Funzioni attive:

```text
feed RSS automatici via Netlify Function
fallback statico links.json
filtri Squadre / Topic / Fonti
ricerca libera
range Da/A
default ultime 12 ore
caricamento articoli piu vecchi senza tornare in alto
layout orizzontale desktop
layout compatto mobile
immagine quadrata mobile
data/ora Europe/Rome
riconoscimento automatico squadre/giocatori/allenatori V320
```

Funzione:

```text
netlify/functions/calciomercato-feed.js
```

Fallback/configurazione:

```text
static/zonaorientale/assets/calciomercato/links.json
```

Fonti rimosse:

```text
Virgilio Sport
La Gazzetta dello Sport
```

## Funzionalita Presidente da preservare

- Login Firebase email/password e Google.
- Dashboard Presidente.
- Badge notifiche trattative.
- Trattative inviate/ricevute.
- Approva/rifiuta trattative.
- Comunicati squadra.
- Comunicati avvenuto scambio con EmailJS.
- Svincola Giocatori con EmailJS, senza Firebase e senza richiesta Admin.

## Funzionalita Admin da preservare

- Titolo Admin sopra tutto.
- Sezione `Carica dati amministrazione` aperta.
- Altri pannelli/categorie ridotti.
- `Diagnostica dati` espandibile/riducibile.
- `Richieste presidenti` funzionante.
- `Converti listone Excel` funzionante.
- Generatore comunicati.
- Snapshot, backup, competizioni, rose, albo, FIFA ranking, stadi, club.

## Stato Diagnostica dati

V321 ha ripristinato l'espansione del pannello `Diagnostica dati`.

V322 corregge il falso positivo `senza ruolo 663` nella riga `Listoni - qualita dati` riconoscendo gli alias ruolo reali del Listone Classic.

Test prioritario:

```text
Admin -> Diagnostica dati -> Aggiorna diagnostica -> Listoni - qualita dati
```

## File da non eliminare senza audit

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/styles.css
static/zonaorientale/assets/css/refactor/mobile-controls.css
static/zonaorientale/assets/css/refactor/rosters-tables.css
static/zonaorientale/assets/css/refactor/theme-light-suspended.css
static/zonaorientale/assets/css/refactor/calciomercato.css
static/zonaorientale/assets/js/admin/listone-converter.js
static/zonaorientale/assets/js/utils/shared-helpers-v295.js
netlify/functions/news-share.js
netlify/functions/calciomercato-feed.js
news.html
comunicati/*.html
tools/generate-news-share-pages.mjs
```

Candidati a pulizia futura solo dopo controllo:

```text
assets/css/refactor/mobile-controls-v292.css
assets/css/refactor/rosters-tables-v292.css
assets/css/refactor/theme-light-suspended-v292.css
assets/js/utils/shared-helpers-v294.js
```

## Prossime funzioni desiderate

Dopo aver verificato V322:

```text
Scheda giocatore Calciomercato
Scheda squadra Calciomercato
Timeline Calciomercato
Stato trattativa automatico
```

Non introdurre AI summary finche l'utente non lo richiede di nuovo esplicitamente.

## Comandi Git

Prima di lavorare:

```bash
cd starter-academic-sb
git checkout refactor/260528-zonaorientale-next
git pull origin refactor/260528-zonaorientale-next
git status
```

Commit overlay:

```bash
git status
git add <file modificati>
git commit -m "tipo: descrizione"
git push origin refactor/260528-zonaorientale-next
```

Merge su master:

```bash
git checkout master
git pull origin master
git merge --no-ff refactor/260528-zonaorientale-next -m "merge: integra aggiornamenti zonaorientale"
git push origin master

git checkout refactor/260528-zonaorientale-next
git merge master
git push origin refactor/260528-zonaorientale-next
```
