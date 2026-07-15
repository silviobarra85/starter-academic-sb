# Overlay V672 - rollback sfondo Listone mobile

Overlay solo sito. Non tocca ioSudo, dati, rose, listoni JSON o Sudatori.

## Scopo

Riporta lo sfondo/comportamento della cella legacy `td.fpt-v584-col-player` alla resa stabile della V667, rimuovendo i fix aggressivi V670/V671 che restringevano le card del Listone mobile.

## Note tecniche

- `site-performance-v672.css` riparte dalla base stabile `site-performance-v667.css`.
- Il renderer mobile V668 viene mantenuto per non perdere le rifiniture sul Listone/Rose.
- V672 rimuove il runtime V671 che rimuoveva la classe `fpt-v584-col-player` e forzava celle fullwidth.

## Controlli

```bash
node static/fanta-engine/tools/audit-site-mobile-cards-v672.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```
