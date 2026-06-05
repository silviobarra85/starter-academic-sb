# Release V353 - Audit tema/competizioni legacy

Data: 05/06/2026

## Tipo release

Audit/refactor protetto, senza cambio comportamento.

## Modifiche

- Aggiunto `audit-theme-competitions-v353.mjs`.
- Aggiunto marker runtime `ZonaOrientaleThemeCompetitionsAuditV353`.
- Documentato stato di `theme-light-suspended.css` e `domain/competitions.js`.
- Aggiornati footer, cache-buster, `DEPLOY_EXPECTED_VERSION_V181` e check globale a V353.

## Rimozioni

Nessuna.

## Test

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/tools/audit-theme-competitions-v353.mjs
static/zonaorientale/tools/audit-theme-competitions-v353.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

## Decisione

Lasciare entrambi i file sotto osservazione. Eventuale rimozione futura solo con test manuale su tema/Competizioni.
