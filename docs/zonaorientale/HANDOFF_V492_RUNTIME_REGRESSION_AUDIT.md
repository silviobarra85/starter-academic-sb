# Handoff V492 - Audit regressione runtime esteso

## Sintesi

V492 introduce `static/fanta-engine/tools/audit-runtime-regression-v492.mjs` e aggiorna l'audit anti-contaminazione a V492. La patch serve a consolidare il branch dopo V480-V491: non centralizza altri moduli e non cancella copie locali.

## File chiave

- `static/fanta-engine/tools/audit-runtime-regression-v492.mjs`
- `static/fanta-engine/tools/audit-multileague-contamination-v492.mjs`
- `static/*/assets/league-config.json`
- `static/*/assets/js/core/league-config-v443.js`

## Verifiche fatte

- Footer e cache-buster V492.
- Config V492 con flag `runtimeRegressionAudit`.
- Asset HTML e fallback locali risolti.
- EmailJS separati.
- Dati condivisi centralizzati con fallback.
- Nessuna contaminazione visibile tra le due leghe.

## Cosa non toccare senza richiesta esplicita

- Copie locali di listoni/calciomercato/CSS/JS: restano fallback.
- `docs/zonaorientale/FUNZIONALITA'.md`.
- Firebase rules e flussi Admin/Presidenti.
