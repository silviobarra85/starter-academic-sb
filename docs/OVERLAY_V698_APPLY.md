# Overlay V698 - ioSudo v45 + note movimenti sito

Aggiorna ioSudo dal file `fantacalcio_serie_a_2026_27_aggiornato_2026-07-16_aggiornamento_globale_v45(2).xlsx` e aggiunge le note nelle card movimenti della pagina squadra sul sito.

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v698.mjs
node static/fanta-engine/tools/audit-site-mobile-profile-v698.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v698.js
node --check static/iosudo/sw.js
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```

## Conteggi

```json
{
  "version": "V698",
  "players": 737,
  "talks": 608,
  "officialIncoming": 153,
  "officialOutgoing": 178,
  "officialMoves": 336,
  "friendlies": 91,
  "injuries": 16,
  "sources": 1018,
  "updateRowsV45": 7,
  "updatedAtTime": "2026-07-16T13:26:24+02:00"
}
```
