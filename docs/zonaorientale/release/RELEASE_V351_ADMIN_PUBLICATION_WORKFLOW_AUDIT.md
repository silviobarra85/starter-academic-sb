# Release V351 - Audit workflow pubblicazione Admin

## Tipo

Audit/refactor protetto.

## Cambiamenti

- Aggiunto audit tool `audit-admin-publication-workflow-v351.mjs`.
- Aggiunto marker runtime `ZonaOrientaleAdminPublicationWorkflowAuditV351`.
- Aggiornati footer/cache-buster/versione a V351.
- Aggiornata documentazione V351.

## Rimozioni

Nessuna.

## Test

- `node --check static/zonaorientale/assets/app.js`
- `node --check static/zonaorientale/tools/audit-admin-publication-workflow-v351.mjs`
- `static/zonaorientale/tools/audit-admin-publication-workflow-v351.mjs`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-assets-v298.sh --quiet`
- `static/zonaorientale/tools/audit-css-v300.sh`

## Note

`admin-publication-workflow-v213.js` resta candidato review, ma non viene rimosso in V351.
