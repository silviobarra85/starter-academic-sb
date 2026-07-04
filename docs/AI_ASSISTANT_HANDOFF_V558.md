# AI Assistant handoff V558

## Stato

Overlay: V558 - Native runtime restore.

## Decisione principale

La lentezza di ZonaOrientale non e dovuta ai dati ma agli strati runtime aggiunti dopo la baseline online veloce. V558 rimuove dal percorso ordinario i wrapper sperimentali/diagnostici e torna al router locale storico.

## File runtime principali

- static/zonaorientale/assets/app.js
- static/fantapetillomantramanager/assets/app.js
- static/zonaorientale/index.html
- static/fantapetillomantramanager/index.html
- static/zonaorientale/assets/js/core/league-config-v443.js
- static/fantapetillomantramanager/assets/js/core/league-config-v443.js
- static/zonaorientale/assets/league-config.json
- static/fantapetillomantramanager/assets/league-config.json

## Guardrail

- Non reintrodurre public-data-autoload/navigation-data-refresh senza una prova misurata.
- Non riattivare dashboard migration/enforce nel runtime ordinario.
- I moduli rimossi in V557 non devono tornare negli import/preload.
- Non modificare FUNZIONALITA'.md senza richiesta esplicita.

## Test consigliati

node static/fanta-engine/tools/audit-native-runtime-restore-v558.mjs

Poi test manuale su entrambe le leghe.
