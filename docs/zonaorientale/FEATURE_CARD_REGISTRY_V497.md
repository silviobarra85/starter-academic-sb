# V497 - Feature card registry comune

La V497 introduce un registro comune metadata-first per card e funzionalita'.

## File principali

```text
static/fanta-engine/js/core/feature-card-registry-v497.js
static/fanta-engine/data/feature-card-registry-v497.json
```

## Obiettivo

Preparare il passaggio da logiche sparse nei singoli siti a un modello configurabile:

```text
card/funzionalita'
↓
visibilita': public / president / admin
↓
lega abilitata
↓
feature flag in league-config.json
↓
rendering futuro comune
```

## Impatto V497

In V497 il registry viene installato in runtime ma non forza ancora il rendering delle dashboard. Le dashboard esistenti restano preservate.

## Guardrail

- Nessuna modifica a Firebase o EmailJS.
- Nessuna rimozione di card o funzionalita'.
- FantaMantraManager mantiene Svincola, Comunicato avvenuto scambio e Proposte regolamento nel registry.
- ZonaOrientale resta separata e non riceve feature specifiche FantaMantraManager.

## Audit

```bash
cd static
node fanta-engine/tools/audit-feature-card-registry-v497.mjs
node fanta-engine/tools/audit-runtime-regression-v497.mjs
node fanta-engine/tools/audit-multileague-contamination-v497.mjs
```
