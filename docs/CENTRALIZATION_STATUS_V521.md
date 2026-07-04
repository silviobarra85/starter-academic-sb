# Centralization status

## Stato corrente: V558

Il progetto resta una piattaforma multi-lega:

- fanta-engine: motore comune e asset condivisi.
- zonaorientale: lega storica.
- fantapetillomantramanager: seconda lega.
- _league-template: base per future leghe.

## Asset comuni

Listoni e Calciomercato sono centralizzati in:

- static/fanta-engine/data/shared-assets/current/assets/listoni/
- static/fanta-engine/data/shared-assets/current/assets/calciomercato/

I fallback locali duplicati sono stati rimossi dal workflow.

## Runtime

Dopo prove performance, V558 ha disattivato i layer runtime sperimentali che appesantivano ZonaOrientale. La navigazione ordinaria torna al router locale storico, mantenendo i fix funzionali recenti.

## Da non fare senza nuova approvazione

- Riattivare public-data-autoload/navigation-data-refresh nel runtime ordinario.
- Riattivare wrapper dashboard migration/enforce nel runtime ordinario.
- Spostare altri dati senza audit.
- Modificare FUNZIONALITA'.md senza richiesta esplicita.
