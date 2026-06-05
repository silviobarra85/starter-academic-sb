# V343 - Audit funzioni Admin

## Tool

```bash
static/zonaorientale/tools/audit-admin-functions-v343.mjs
```

## Cosa verifica

Il tool controlla staticamente che nel runtime siano presenti:

- `renderAdminArea`;
- `attachAdminHandlers`;
- `renderAdminPanel`;
- pannello `adminDataDiagnosticsPanelV276`;
- pulsante `data-refresh-diagnostics-v276`;
- timestamp `data-admin-diagnostics-last-refresh-v343`;
- toggle Diagnostica dati V321;
- Richieste presidenti;
- convertitore listone Admin;
- pannello Calciomercato Solo Admin V340.

## Limiti

Il tool non sostituisce un test browser con login Admin, perche Firebase/Auth richiedono ambiente reale. Serve pero a bloccare regressioni evidenti di wiring e marker prima del deploy.

## Test browser consigliato

1. Login Admin.
2. Aprire Admin -> Diagnostica dati.
3. Premere `Aggiorna diagnostica`.
4. Verificare aggiornamento timestamp con ora italiana.
5. Espandere/ridurre il pannello.
6. Controllare Richieste presidenti e Converti listone.
