# V295 - Primo collegamento helper puri app.js

Data: 31/05/2026
Versione runtime: `V295 primo helper app.js`

## Obiettivo

V295 avvia il refactor reale di `assets/app.js` collegando un solo call-site storico al modulo di helper puri introdotto in V294.

La modifica riguarda esclusivamente l'escape CSV usato dall'export modifiche del Listone:

```text
csvEscapeV278 -> ZonaOrientaleSharedHelpersV295.csvEscape
```

Il resto di `assets/app.js` resta agganciato alle funzioni storiche.

## File principali

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/utils/shared-helpers-v295.js
```

Il modulo V295 espone gli stessi helper puri della V294, con versione aggiornata:

```text
normalizeWhitespace
normalizeSearchKey
slugifyText
toFiniteNumber
formatSignedNumber
csvEscape
rowsToCsv
uniqueByKey
```

## Funzionalita a rischio e preservazione

### Rischio: export modifiche Listone

L'unica funzione collegata e' l'escape CSV dell'export modifiche Listone. Il rischio sarebbe generare CSV con virgolette, punti e virgola o ritorni a capo non escapati correttamente.

Preservazione:

- la regex dell'helper condiviso copre `"`, ritorni a capo, virgole e punti e virgola;
- `buildListoneChangeExportCsvV278()` continua a costruire righe e colonne come prima;
- il BOM UTF-8 e il separatore `;` restano invariati;
- il pulsante `Esporta modifiche CSV` e i filtri Listone non vengono modificati.

### Rischio: call-site storici app.js

Preservazione:

- nessuna funzione storica viene rimossa;
- nessun render pubblico/admin viene spostato;
- nessun flusso Firebase/Auth/EmailJS viene toccato;
- `window.ZonaOrientaleSharedHelpersV294` resta come alias diagnostico verso V295 per compatibilita console.

### Rischio: funzionalita da non perdere

Da verificare sempre dopo V295:

```text
Listone: Modifica, filtro Modifiche, usciti storici, export CSV
Rose pubbliche e pagina squadra
Dashboard Presidente
Admin: Richieste presidenti, Diagnostica dati, Converti listone Excel
News e share WhatsApp dinamico
Competizioni, Archivio, Statistiche, Confronta
Mobile: bottom nav, menu Altro, pulsante Su
Dark mode unico V289
```

## Diagnostica runtime

```js
window.ZonaOrientaleSharedHelpersV295
window.ZonaOrientaleSharedHelpersV295.runSmokeTest()
window.ZonaOrientaleAppHelpersExtractionV295
```

Atteso:

```js
window.ZonaOrientaleSharedHelpersV295.runSmokeTest().ok === true
window.ZonaOrientaleAppHelpersExtractionV295.behaviorChange === false
window.ZonaOrientaleAppHelpersExtractionV295.rewiredCallSites.includes("csvEscapeV278 -> ZonaOrientaleSharedHelpersV295.csvEscape")
```

## Test consigliati

```bash
static/zonaorientale/tools/check-zonaorientale.sh
```

Test manuale prioritario:

```text
Listone -> filtro Modifiche -> Esporta modifiche CSV
Aprire il CSV e verificare colonne, accenti, punti e virgola, virgolette e righe esportate.
```

