# V323 - Archivio statico giornaliero Calciomercato

## Scopo

V323 aggiunge un archivio statico giornaliero per la sezione `Calciomercato`, pensato per non perdere gli articoli recuperati dai feed RSS a partire dal 1 giugno 2026 alle 00:00.

La funzione non sostituisce il feed live: il frontend carica ancora la Netlify Function RSS e, in parallelo, legge i JSON statici presenti in:

```text
static/zonaorientale/assets/calciomercato/archive/
```

## File principali

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/css/refactor/calciomercato.css
static/zonaorientale/assets/calciomercato/archive/manifest.json
```

## Struttura archivio

```text
assets/calciomercato/archive/
  manifest.json
  2026-06-01.json
  2026-06-02.json
  2026-06-03.json
```

`manifest.json` indica i giorni disponibili. La pagina Calciomercato lo legge automaticamente e carica solo i JSON giornalieri necessari per il range Da/A selezionato.

## Download JSON solo Admin

Gli strumenti sono nella pagina pubblica `Calciomercato`, non nel pannello Admin.

Sono visibili solo quando `state.isAdmin === true`:

- `Scarica JSON giorno YYYY-MM-DD` usa il giorno del campo `Da`;
- `Scarica JSON intervallo` genera un file `YYYY-MM-DD.json` per ogni giorno del range Da/A;
- al termine viene scaricato anche `manifest.json` aggiornato.

I file scaricati vanno copiati in:

```text
static/zonaorientale/assets/calciomercato/archive/
```

poi vanno committati e pubblicati.

## Deduplica

La deduplica usa una chiave stabile:

1. URL normalizzato, rimuovendo parametri traccianti come `utm_*`, `fbclid`, `gclid`;
2. fallback su fonte + giorno + titolo normalizzato quando l'URL non e' disponibile.

Quando un JSON giornaliero esiste gia', il generatore prova a leggerlo, fonde vecchi e nuovi articoli e scarta i doppioni.

## Visualizzazione automatica

All'apertura della sezione il sito:

1. carica il feed RSS live via Netlify Function;
2. carica `archive/manifest.json`;
3. carica i JSON statici che coprono il range selezionato;
4. unisce live + statico;
5. deduplica;
6. applica i filtri esistenti.

## Funzionalita a rischio

- Calciomercato RSS automatico;
- fallback statico `assets/calciomercato/links.json`;
- filtri Squadre / Topic / Fonti;
- ricerca libera;
- range Da/A;
- caricamento articoli piu vecchi;
- layout mobile compatto;
- riconoscimento automatico squadre/giocatori/allenatori V320.

## Preservazione

- nessuna modifica al Fantamercato interno;
- nessuna scrittura Firebase;
- nessuna modifica a EmailJS;
- nessuna modifica alla Netlify Function RSS;
- archivio statico aggiunto come seconda sorgente dati, non come sostituzione;
- deduplica finale dopo merge live + statico;
- strumenti download visibili solo agli Admin nella pagina Calciomercato.

## Test manuali

```text
Calciomercato senza JSON giornalieri: deve funzionare come prima.
Admin non loggato: strumenti archivio non visibili.
Admin loggato: strumenti archivio visibili nella pagina Calciomercato.
Range Da 2026-06-01 00:00 / A 2026-06-02 00:00: download JSON giorno/intervallo.
Copiare 2026-06-01.json e manifest.json in assets/calciomercato/archive/.
Ricaricare Calciomercato: gli articoli archiviati entrano nella lista.
Live + statico con stesso URL: nessun doppione.
Filtri squadra/topic/fonte e ricerca libera funzionano anche sugli articoli statici.
Mobile: layout invariato.
```

## Diagnostica runtime

```js
window.ZonaOrientaleCalciomercatoArchiveV323
```

Valori attesi:

```js
window.ZonaOrientaleCalciomercatoArchiveV323.version === "V323"
window.ZonaOrientaleCalciomercatoArchiveV323.adminToolsLocation === "pagina Calciomercato"
window.ZonaOrientaleCalciomercatoArchiveV323.adminOnlyDownloads === true
window.ZonaOrientaleCalciomercatoArchiveV323.firebaseWrites === false
```
