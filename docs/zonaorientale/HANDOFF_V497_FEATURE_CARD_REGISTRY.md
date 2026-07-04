# Handoff V497 - Feature card registry comune

La V497 aggiunge il registry comune delle card/funzionalita'.

## File chiave

```text
static/fanta-engine/js/core/feature-card-registry-v497.js
static/fanta-engine/data/feature-card-registry-v497.json
static/fanta-engine/tools/audit-feature-card-registry-v497.mjs
```

## Impatto

- Runtime avanzato a V497.
- `league-config.json` contiene `featureCardRegistry`.
- `assets/app.js` installa `window.FantaEngineFeatureCardRegistryRuntimeV497`.
- Nessuna dashboard viene riscritta in V497: il rendering resta quello esistente.

## Prossimo passo

V498: adapter EmailJS comune multi-lega.
