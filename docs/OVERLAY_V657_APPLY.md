# Overlay V657 - sito più leggero

Overlay solo sito. Non modifica ioSudo, dati Sudatori, listoni, rose o JSON.

## Obiettivo

Applicare al sito lo stesso principio usato su ioSudo: non renderizzare tutte le sezioni pesanti a ogni cambio pagina.

## Modifiche

- Cache-buster `assets/app.js?v=657` su ZonaOrientale e FantaPetillo.
- CSS condiviso `site-performance-v657.css`.
- Runtime `FantaSitePerformanceV657` in `assets/app.js` delle due leghe.
- Rendering attivo per pagina: Listone, Rose, Competizioni, Albo, News, Archivio, Stats e Admin vengono disegnati solo quando la relativa sezione è aperta.
- Progressive reveal mobile per tabelle e card lunghe.
- Sezione pubblica Per i SUDATORI resta disattivata.

## Applicazione

```bash
cp -R static/* static/
cp -R docs/* docs/
```

## Audit

```bash
node static/fanta-engine/tools/audit-site-performance-v657.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```
