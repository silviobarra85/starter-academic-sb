# Shared JS classic centralization V489

La V489 centralizza in `static/fanta-engine/js/shared/v489/` i soli script classici e autonomi risultati identici tra le due leghe: `admin-card-visibility-v454.js`, `admin-card-visibility-v455.js` e `admin-card-visibility-v456.js`. Le pagine `index.html` caricano ora il runtime V456 dal motore comune con fallback locale tramite `data-local-fallback`; le copie locali non vengono cancellate. Restano fuori `app.js`, Firebase, EmailJS, `league-config`, section registry e tutti i moduli ES con import relativi.

## Guardrail

- Nessuna funzionalita' rimossa.
- Nessuna copia locale cancellata.
- Nessun flusso Firebase/Admin/EmailJS modificato.
- I JS module-like restano locali fino a adapter/import-map dedicati.

## Verifiche

Eseguire da `static`:

```bash
node fanta-engine/tools/audit-js-classic-centralization-v489.mjs
node fanta-engine/tools/audit-multileague-contamination-v489.mjs
```
