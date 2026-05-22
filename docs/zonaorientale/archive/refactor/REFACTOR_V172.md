# ZonaOrientale V172 - Snapshot stagione statici e focus mobile

## Obiettivo

Ridurre ulteriormente le letture Firestore pubbliche permettendo al sito di leggere gli snapshot stagione da file JSON statici su GitHub prima di usare `publicSeasonSnapshots/{seasonId}` come fallback.

## Modifiche

- Aggiunto manifest statico `assets/snapshots/seasons/manifest.json`.
- Il loader pubblico prova prima `assets/snapshots/seasons/manifest.json` e poi il JSON della stagione indicata dal manifest.
- Se lo snapshot statico manca o non è valido, resta il fallback Firestore su `publicSeasonSnapshots/{seasonId}`.
- In admin, nel pannello Snapshot pubblici, aggiunti i pulsanti per scaricare overlay statici delle stagioni.
- Da mobile, ogni cambio scheda/link di navigazione riporta lo scroll/focus in cima alla schermata.
- Aggiornato il footer alla Version V172 e il cache-buster di `app.js` a `v=172`.

## File statici attesi

```text
static/zonaorientale/assets/snapshots/seasons/manifest.json
static/zonaorientale/assets/snapshots/seasons/<stagione>.json
```

Esempio manifest:

```json
{
  "version": 1,
  "generatedAt": "2026-05-21T00:00:00.000Z",
  "snapshots": [
    {
      "seasonId": "2024-2025",
      "file": "2024-2025.json",
      "generatedAt": "2026-05-21T00:00:00.000Z"
    }
  ]
}
```

## Beneficio letture

Per le stagioni presenti nel manifest statico, il pubblico evita la lettura Firestore di `publicSeasonSnapshots/{seasonId}`.

La stagione corrente può continuare a usare Firestore; le stagioni passate possono essere congelate su GitHub.

## Test

- `node --check assets/app.js`
- validazione JSON degli asset
- server locale su porta 1313
