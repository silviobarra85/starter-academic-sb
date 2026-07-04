# Handoff V481 — Motore comune presentazione

## Stato

Branch di stabilizzazione multi-lega. V480 ha introdotto `static/fanta-engine` e il registry sezioni unificato. V481 aggiunge il primo motore comune di presentazione runtime.

## Cosa è stato fatto

- Creato `static/fanta-engine/js/core/league-presentation-v481.js`.
- I loader `assets/js/core/league-config-v443.js` di entrambe le leghe provano a usare il motore comune V481.
- Le vecchie funzioni locali V445 restano presenti come fallback.
- Aggiornato `currentVersion` a 481 e cache-buster a `v=481`.
- Aggiornato il registry V480 per emettere l'evento `fanta-section-registry-ready-v480`, così la presentazione comune può riapplicare il menu quando il registry è disponibile.

## Vincoli da preservare

- Non cancellare funzionalità.
- Non toccare Firebase o EmailJS senza richiesta esplicita.
- Non contaminare ZonaOrientale con contenuti FantaMantraManager e viceversa.
- `FUNZIONALITA'.md` non va modificato se non richiesto esplicitamente.

## Prossimo step consigliato

V482: audit anti-contaminazione multi-lega e checklist automatica per footer, news, regolamenti, EmailJS e asset brand separati.
