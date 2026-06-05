# Manual QA Panel Matrix V358

| Area | Rischio | Mitigazione |
| --- | --- | --- |
| UI Admin bottom panel | Basso | Visibile solo con `state.isAdmin` |
| localStorage QA | Basso | Chiave dedicata e nessuna scrittura remota |
| Navigazione test | Basso | Usa link/pagine esistenti |
| Simulatore trade | Basso | Usa simulatore locale V255/V349 |
| Auto-check | Basso | Controlla solo marker tecnici, non cambia dati core |

## Marker

- `window.ZonaOrientaleManualQaPanelV358`
- `runAutoChecks()`
- `markArea()`
- `copyExport()`
