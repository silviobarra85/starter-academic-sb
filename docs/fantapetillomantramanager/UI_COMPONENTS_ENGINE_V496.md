# V496 - UI components engine comune

La V496 introduce il primo layer UI comune in `static/fanta-engine/js/ui/components-v496.js`.

## Obiettivo

Centralizzare helper DOM e UI riutilizzabili da entrambe le leghe senza toccare Firebase, EmailJS, dati, dashboard specifiche o sezioni applicative.

## Componenti introdotti

```text
safeQueryAllV496
setTextForSelectorV496
setHtmlForSelectorV496
setMetaContentV496
setCanonicalV496
formatTemplateV496
normalizeIconV496
resolveHashHrefV496
setElementVisibilityV496
showToastV496
installFantaUiV496
```

Il presentation engine comune importa questi helper e continua a offrire le API storiche usate dai loader lega-specifici.

## Guardrail

- Nessun riferimento hardcoded a ZonaOrientale o FantaMantraManager nel modulo UI.
- Nessuna modifica a Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra, news, regolamenti, bilanci, listoni o calciomercato.
- Le copie/fallback locali restano intatti.

## Audit

```bash
cd static
node fanta-engine/tools/audit-ui-components-v496.mjs
node fanta-engine/tools/audit-runtime-regression-v496.mjs
node fanta-engine/tools/audit-multileague-contamination-v496.mjs
```
