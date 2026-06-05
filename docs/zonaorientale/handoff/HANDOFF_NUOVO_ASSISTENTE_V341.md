# Handoff nuovo assistente AI - V341

## Stato versione

Versione corrente: V341  
Data: 05/06/2026  
Branch di lavoro tipico: `refactor/260528-zonaorientale-next`  
Obiettivo: refactor progressivo e protetto senza perdere funzionalita.

## Modifica V341

La V341 introduce un bridge helper condiviso in:

```text
assets/js/utils/shared-helper-bridge-v341.js
```

Il modulo non cambia il comportamento pubblico del sito. Serve a ridurre duplicazioni sicure e a rendere piu' esplicito il collegamento tra helper gia' esistenti e wrapper storici in `assets/app.js`.

## Wrapper ricollegati

I wrapper storici restano in `assets/app.js` e non devono essere eliminati senza nuova verifica:

```text
csvEscapeV278()
buildListoneChangeExportCsvV278()
normalizeListoneSearchKeyV269()
normalizeDiagnosticKeyV303()
normalizeCalciomercatoValueV306()
```

Questi wrapper delegano a `ZonaOrientaleSharedHelperBridgeV341`, che a sua volta usa `ZonaOrientaleSharedHelpersV295` quando disponibile e mantiene fallback locali.

## Diagnostica runtime

In console browser:

```js
window.ZonaOrientaleSharedHelperBridgeV341
window.ZonaOrientaleSharedHelperBridgeV341.runSmokeTest()
```

Lo smoke test deve restituire `ok: true`.

## Architettura Calciomercato attiva

```text
assets/js/calciomercato/calciomercato-images-v334.js
assets/js/calciomercato/calciomercato-players-v340.js
assets/js/calciomercato/calciomercato-render-v338.js
assets/js/calciomercato/calciomercato-filters-v339.js
assets/js/calciomercato/calciomercato-admin-v340.js
```

`assets/app.js` resta orchestratore e mantiene wrapper storici.

## Funzionalita da preservare

- Calciomercato feed RSS/HTML, fonti TMW squadra, archivio statico e download Admin.
- Fallback immagini/favicon/TMW testuale.
- Card compatte e filtri Calciomercato.
- Matching giocatore V340 e modal timeline V336.
- Listone, filtro Modifiche, colonna Modifica, export CSV solo Admin.
- Rose, Fantamercato interno, Dashboard Presidente, Admin.
- Firebase/Auth/EmailJS.
- News/share WhatsApp.
- Mobile bottom nav e menu Altro.

## Prossima modifica consigliata

V342: audit file candidati orfani e dipendenze legacy, senza cancellazioni automatiche. Concentrarsi su moduli/versioni vecchie segnalate dagli audit, ma preparare solo una matrice rischio/uso prima di rimuovere qualunque file.

## Comandi test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/utils/shared-helper-bridge-v341.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```
