# Handoff V592

Baseline dopo V592: sezione standalone Sudatori aggiornata con matching robusto sul listone 2026-07-04, colonna Rosa fantacalcio e informazioni mercato/formazioni.

File principali:

- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/js/sections/sudatori-section-v592.js`
- `static/fanta-engine/css/sudatori-section-v592.css`

Note:

- La sezione non scrive su Firestore.
- Il listone live viene letto da `shared-assets/current/assets/listoni`; se non disponibile usa i dati incorporati nel JSON Sudatori.
- `Rosa fantacalcio` deriva dal campo `fantasyRoster` del listone.
