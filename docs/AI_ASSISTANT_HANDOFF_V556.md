# AI Assistant Handoff V556 - Lean runtime restore

## Obiettivo

Riportare ZonaOrientale a una navigazione piu' vicina alla baseline online veloce, senza tornare indietro con i fix funzionali introdotti dopo V473.

## Cosa cambia

V556 rimuove dal runtime ordinario i layer che si erano stratificati tra V534 e V555:

- `navigation-active-singleton-v534`;
- `navigation-fluidity-v535`;
- `navigation-performance-guard-v536`;
- `performance-profiler-lazy-render-v552`;
- `application-cache-chunked-tables-v553`;
- `eager-data-preload-v555`.

I file restano nella repo se gia' presenti, ma `app.js` e `index.html` non li importano/precaricano piu'.

## Cosa resta attivo

- Router locale storico delle leghe.
- `navigation-actions-v510`.
- `navigation-data-refresh-v511`.
- `public-data-autoload-v526`.
- `season-data-adapter-v526`.
- `season-path-resolver-v537`.
- Calciomercato live/static split V549.
- Stile Listone/Rose V550/V551.
- Isolamento tabelle Regolamento V540.
- Dashboard cards/renderer helpers gia' stabilizzati.

## Rischi controllati

Possibile ritorno di qualche imperfezione visuale minore sullo stato attivo dei pulsanti, perche' V534 viene disattivato. La priorita' di V556 e' pero' ripristinare la fluidita'. Se il problema del pulsante attivo ricompare, correggerlo con una patch CSS/minima, non riattivando observer pesanti.

## File principali

- `static/zonaorientale/index.html`
- `static/fantapetillomantramanager/index.html`
- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/zonaorientale/assets/league-config.json`
- `static/fantapetillomantramanager/assets/league-config.json`
- `static/zonaorientale/assets/js/core/league-config-v443.js`
- `static/fantapetillomantramanager/assets/js/core/league-config-v443.js`
- `static/fanta-engine/tools/audit-lean-runtime-restore-v556.mjs`

## Verifica

```bash
node static/fanta-engine/tools/audit-lean-runtime-restore-v556.mjs
```

## Note operative

Non modificare `FUNZIONALITA'.md` senza richiesta esplicita.
