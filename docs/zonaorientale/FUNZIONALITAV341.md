# FUNZIONALITA V341 - Pulizia helper condivisi protetta

Versione: V341  
Data: 05/06/2026  
Ambito: refactor protetto helper puri e wrapper storici.

## Obiettivo

Proseguire la pulizia del codice senza perdere funzionalita, centralizzando alcuni helper duplicati gia' presenti in `assets/app.js` dietro un bridge condiviso.

La V341 non cambia UI, dati, feed, Firebase, Netlify o comportamento atteso delle sezioni. Mantiene i nomi storici delle funzioni di `app.js` come wrapper.

## Funzionalita V341

- Creato il modulo `assets/js/utils/shared-helper-bridge-v341.js`.
- Il modulo espone `createSharedHelperBridgeV341()`.
- Il bridge centralizza:
  - escape CSV;
  - generazione CSV da righe/colonne;
  - normalizzazione testuale loose per diagnostica/Calciomercato;
  - normalizzazione strict compatibile con `normalizeKey()` per Listone;
  - smoke test runtime.
- `assets/app.js` usa il bridge mantenendo attivi i wrapper storici:
  - `csvEscapeV278()`;
  - `buildListoneChangeExportCsvV278()`;
  - `normalizeListoneSearchKeyV269()`;
  - `normalizeDiagnosticKeyV303()`;
  - `normalizeCalciomercatoValueV306()`.
- Aggiunta diagnostica runtime `window.ZonaOrientaleSharedHelperBridgeV341`.

## Funzionalita preservate

- Calciomercato feed RSS/HTML.
- Fonti TMW squadra V329.
- Tile testuale `TMW - NomeSquadra` V330.
- Fallback favicon/fonte V328/V334.
- Card compatte V332.
- Renderer card V338.
- Filtri Calciomercato V339.
- Pannello Solo Admin archivio V340.
- Matching giocatore V340.
- Modal timeline giocatore V336.
- Archivio statico Calciomercato V323/V324.
- Download archivio statico giornaliero/intervallo dal pannello Admin Calciomercato.
- Listone, filtro Modifiche, colonna Modifica, usciti storici.
- Export CSV Listone solo Admin.
- Rose e pagina squadra.
- Fantamercato interno.
- Dashboard Presidente.
- Admin generale e Diagnostica dati.
- Firebase/Auth/EmailJS.
- News/share WhatsApp.
- Mobile bottom navigation e menu Altro.
- `competition.html` e `player.html`.

## File principali

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/utils/shared-helper-bridge-v341.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
docs/zonaorientale/FUNZIONALITAV341.md
docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V341.md
docs/zonaorientale/refactor/SHARED_HELPER_BRIDGE_V341.md
docs/zonaorientale/release/RELEASE_V341_SHARED_HELPER_BRIDGE.md
```

## Funzioni storiche da non rimuovere

```text
csvEscapeV278
buildListoneChangeExportCsvV278
normalizeListoneSearchKeyV269
normalizeDiagnosticKeyV303
normalizeCalciomercatoValueV306
```

Anche se delegano al bridge V341, restano necessarie per compatibilita con patch storiche e call-site interni.

## Test consigliati

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/utils/shared-helper-bridge-v341.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```

## Note

Non modificato `docs/zonaorientale/FUNZIONALITA'.md`.
