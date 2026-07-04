# Template nuova lega V507

Questa cartella e' un template, non una lega di produzione.

Uso previsto:

```bash
node static/fanta-engine/tools/create-league-v507.mjs fantanuovalega --name "Fanta Nuova Lega" --short "FNL" --season "2026-2027"
```

Validazione prevista dopo la generazione:

```bash
node static/fanta-engine/tools/validate-league-config-v507.mjs fantanuovalega
```

Dopo la generazione servono revisione manuale di config, dati, Firebase, EmailJS, redirect Netlify, docs e test browser.

Guardrail:
- non riusare projectId Firebase di altre leghe;
- non riusare service/template EmailJS di altre leghe senza scelta esplicita;
- non creare redirect Netlify automatici;
- non pubblicare senza audit e test manuali;
- non ripristinare `static/static` o `static/zonaorientale/static`.


## Aggiornamento V524

Il template e' ora compatibile con il configuratore guidato `static/fanta-engine/tools/create-league-wizard-v524.mjs`.
I percorsi primari di Listoni e Calciomercato puntano a `static/fanta-engine/data/shared-assets/current/`, con fallback locali preservati.
