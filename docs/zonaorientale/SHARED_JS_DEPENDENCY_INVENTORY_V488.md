# V488 - Inventario dipendenze JS comuni

Data: 24/06/2026

## Obiettivo

La V488 misura le dipendenze dei JavaScript comuni dopo la centralizzazione CSS V487, senza cambiare i path runtime e senza cancellare copie locali.

## Risultato

- 38 file JS identici tra ZonaOrientale e FantaMantraManager.
- Sono stati classificati moduli ES, script classici, import relativi e dipendenze da `league-config`/Firebase.
- I JS restano locali: questa patch non modifica i tag `<script>` verso un path centrale.

Il manifest e' in:

```text
static/fanta-engine/data/shared-js-dependency-inventory-v488.json
```

## Strategia conservativa

La centralizzazione JS verra' fatta solo dopo questa analisi, preferendo wrapper locali o import-map dove necessario. I file divergenti e lega-specifici restano locali: `app.js`, `firebase.js`, `emailjs.js`, `league-config-v443.js`, `section-registry-v405.js`, `repository-v222.js`.

## Audit

```bash
cd static
node fanta-engine/tools/audit-js-dependency-inventory-v488.mjs
node fanta-engine/tools/audit-multileague-contamination-v488.mjs
```

## Regressioni da evitare

- spostamento accidentale dei JS runtime;
- rottura degli import relativi dei moduli ES;
- perdita di fallback listone/calciomercato;
- contaminazione di testi o configurazioni tra le leghe.
