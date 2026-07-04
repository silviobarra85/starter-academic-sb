# Data path adapter V490

La V490 introduce `static/fanta-engine/js/core/data-paths-v490.js`, un adapter comune e senza dipendenze per risolvere i path dati (`dataPaths.*`) e per caricare JSON con catena primary/fallback. I loader `static-files-service.js` delle due leghe e della copia annidata ZonaOrientale usano l'adapter con import dinamico e fallback locale: se il motore comune non si carica, restano attive le funzioni locali V446/V485. Non sono stati spostati ulteriori dati e non sono state cancellate copie locali.

## Guardrail

- Nessuna funzionalita' rimossa.
- Nessuna copia locale cancellata.
- Listoni e calciomercato restano centralizzati come primary V485 con fallback locale.
- Rose e competizioni restano lega-specifiche locali.
- Firebase, EmailJS, Admin e Dashboard Presidente non sono stati modificati.

## Verifiche

Da `static`:

```bash
node fanta-engine/tools/audit-data-path-adapter-v490.mjs
node fanta-engine/tools/audit-multileague-contamination-v490.mjs
```
