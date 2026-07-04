# Handoff V498 - EmailJS adapter comune - ZonaOrientale

La V498 aggiunge un adapter EmailJS comune in `fanta-engine`, ma conserva il wrapper locale `assets/emailjs.js` come punto di integrazione pubblico.

## Preservato

- Flussi email esistenti.
- Import `await import("./emailjs.js")` in `assets/app.js`.
- Service ID e template specifici.
- Fallback locali e separazione leghe.

## Prossimo step previsto

V499: Firebase adapter comune senza migrazione dati.
