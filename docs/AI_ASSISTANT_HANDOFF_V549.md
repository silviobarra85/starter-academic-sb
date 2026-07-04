# AI Assistant Handoff V549

Overlay: V549 - Calciomercato live 3 giorni + archivio statico per storico.

## Intento

Correggere la regressione post-cleanup fallback: la pagina Calciomercato deve scaricare dagli URL live configurati gli articoli recenti degli ultimi 3 giorni e usare l archivio statico centrale solo per andare indietro nel tempo o quando il live non restituisce risultati.

## File toccati

- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- entrypoint HTML/config delle due leghe per cache-buster V549
- `netlify/functions/calciomercato-feed.js`
- `static/fanta-engine/tools/audit-calciomercato-live-static-split-v549.mjs`
- docs V549 + handoff corrente

## Guardrail

- Non ripristinare fallback locali Calciomercato.
- Non toccare Firebase/EmailJS/Admin/Presidente.
- Listoni e Calciomercato restano centralizzati in `fanta-engine/data/shared-assets/current`.
- `FUNZIONALITA'.md` non modificato.
