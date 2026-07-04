# Merge checklist V495 - ZonaOrientale

## Prima del merge

- Applicare overlay V495.
- Eseguire:

```bash
git rm -r static/zonaorientale/static
```

- Eseguire audit V495 da `static`:

```bash
node fanta-engine/tools/audit-zona-nested-static-cleanup-v495.mjs
node fanta-engine/tools/audit-runtime-regression-v495.mjs
node fanta-engine/tools/audit-multileague-contamination-v495.mjs
node fanta-engine/tools/audit-merge-readiness-v495.mjs
```

## Verifica manuale ZonaOrientale

- Home, competition e player senza errori console.
- Footer V495.
- Menu desktop/mobile funzionante.
- Listone e scheda Player da Listone funzionanti.
- Calciomercato/Fantamercato senza 404.
- Admin e Area Squadra come prima.
- Nessun riferimento visibile a FantaMantraManager.

## Nota

`static/zonaorientale/static` non deve più esistere dopo il cleanup.
