# 05_TEST_AUDIT_REGRESSIONI.md

## V514 - Runtime boot whole-site fix

- Audit: `node static/zonaorientale/tools/audit-runtime-boot-whole-site-v514.mjs` dalla root repo.
- Console Chrome: assenza di `formValidatorsV506 is not defined`.
- Network: `league-config-v443.js?v=514` su ZonaOrientale e FantaMantraManager.
- Smoke manuale: cambio sezione funzionante e dati non bloccati su caricamento.
