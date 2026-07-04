# AI Assistant Handoff V555

## Sintesi

V555 aggiunge un eager data preload in `fanta-engine` per scaldare la cache dei JSON statici principali dopo il primo paint.

## File chiave

- `static/fanta-engine/js/ui/eager-data-preload-v555.js`
- `static/fanta-engine/tools/audit-performance-eager-preload-v555.mjs`
- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/zonaorientale/index.html`
- `static/fantapetillomantramanager/index.html`
- `docs/PERFORMANCE_EAGER_PRELOAD_V555.md`

## Cosa preservare

- Non bloccare il primo paint.
- Non sostituire router o render locali.
- Non caricare moduli diagnostici in produzione senza debug flag.
- Non ripristinare fallback locali di Listoni/Calciomercato.
- Non toccare Firebase, EmailJS, Admin, Presidente.
- Non modificare `FUNZIONALITA'.md` salvo richiesta esplicita.

## Verifica

```bash
node static/fanta-engine/tools/audit-performance-eager-preload-v555.mjs
```

## Nota performance

Se l'utente chiede un caricamento completamente bloccante all'avvio, sconsigliarlo: su ZonaOrientale peggiorerebbe il primo caricamento. Preferire sempre warm-cache in background con concorrenza limitata.
