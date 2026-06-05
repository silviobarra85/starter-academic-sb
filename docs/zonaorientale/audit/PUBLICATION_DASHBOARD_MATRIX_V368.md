# Audit matrix V368 - Dashboard pubblicazione Admin

| Area | Controllo | Esito atteso |
| --- | --- | --- |
| Versione | `DEPLOY_EXPECTED_VERSION_V181 = 368` | OK |
| HTML | footer V368 su index, competition, player | OK |
| Cache | cache-buster `?v=368` allineati | OK |
| Admin | marker `ZonaOrientaleAdminPublicationDashboardV368` presente | OK |
| V189 | promemoria pubblicazione preservati | OK |
| V190 | semafori Firebase/JSON preservati | OK |
| V191 | wizard pubblicazione preservato | OK |
| V367 | smoke test protetto ancora presente | OK |
| Firebase | nessuna nuova scrittura | OK |
| File | nessun runtime cancellato | OK |
| Docs | `FUNZIONALITA'.md` non modificato | OK |

## Audit automatico

```bash
node static/zonaorientale/tools/audit-publication-dashboard-v368.mjs
```
