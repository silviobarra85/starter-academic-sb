# Handoff V494 - Local duplicate cleanup readiness

## Obiettivo

Chiudere il ciclo V480-V494 con un piano sicuro di pulizia duplicati locali, senza cancellare alcuna copia locale.

## Modifiche principali

- aggiunto `static/fanta-engine/data/local-duplicate-cleanup-plan-v494.json`;
- aggiunto `static/fanta-engine/tools/audit-local-duplicate-cleanup-readiness-v494.mjs`;
- aggiornati audit runtime/contaminazione/merge readiness a V494;
- aggiornate config, footer e cache-buster a V494;
- aggiornata documentazione di entrambe le leghe;
- nessuna modifica a Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra, news, regolamenti, bilanci, listoni/calciomercato runtime;
- nessuna cancellazione di file locali.

## Guardrail

- Non rimuovere copie locali con overlay `cp -R`.
- Le copie locali restano fallback e rollback.
- Per cancellare davvero serve una patch dedicata con comandi `rm`, dopo test reali e consenso esplicito.
- `docs/zonaorientale/FUNZIONALITA'.md` non e' stato modificato.

## Audit

```bash
cd static
node fanta-engine/tools/audit-local-duplicate-cleanup-readiness-v494.mjs
node fanta-engine/tools/audit-runtime-regression-v494.mjs
node fanta-engine/tools/audit-multileague-contamination-v494.mjs
node fanta-engine/tools/audit-merge-readiness-v494.mjs
```
