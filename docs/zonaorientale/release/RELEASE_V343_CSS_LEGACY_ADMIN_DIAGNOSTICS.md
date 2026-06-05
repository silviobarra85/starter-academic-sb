# Release V343 - CSS legacy e Diagnostica Admin

Data: 05/06/2026

## Tipo

Refactor protetto + fix diagnostica UI Admin.

## Modifiche

- Aggiunto timestamp italiano al refresh di `Aggiorna diagnostica` nel pannello Admin.
- Aggiunta diagnostica runtime `window.ZonaOrientaleAdminDiagnosticsV343`.
- Aggiunto tool `audit-admin-functions-v343.mjs`.
- Aggiunto tool `cleanup-css-legacy-v343.sh` per dry-run/apply della pulizia CSS V291/V292.
- Aggiornati versioni e cache-buster a V343.

## Nessuna modifica a

- Firebase/Auth/EmailJS;
- Netlify Functions;
- `links.json`;
- archivi JSON Calciomercato;
- JSON Listone;
- card/filtri Calciomercato;
- Listone runtime;
- Rose;
- Dashboard Presidente;
- Fantamercato interno.

## Comandi test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/tools/audit-admin-functions-v343.mjs
static/zonaorientale/tools/audit-admin-functions-v343.mjs
static/zonaorientale/tools/cleanup-css-legacy-v343.sh
static/zonaorientale/tools/check-zonaorientale.sh
```
