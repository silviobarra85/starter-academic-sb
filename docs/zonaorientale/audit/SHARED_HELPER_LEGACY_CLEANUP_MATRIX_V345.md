# Audit matrix V345 - Shared helper legacy

| File/elemento | Stato V345 | Azione |
| --- | --- | --- |
| `assets/js/utils/shared-helpers-v294.js` | legacy, non importato | rimosso con `git rm` |
| `assets/js/utils/shared-helpers-v295.js` | attivo | preservare |
| `assets/js/utils/shared-helper-bridge-v341.js` | attivo | preservare |
| `csvEscapeV278` | wrapper compatibile | preservare |
| `buildListoneChangeExportCsvV278` | wrapper compatibile | preservare |
| `normalizeListoneSearchKeyV269` | wrapper compatibile | preservare |
| `normalizeDiagnosticKeyV303` | wrapper compatibile | preservare |
| `normalizeCalciomercatoValueV306` | wrapper compatibile | preservare |

## Esito audit

La rimozione del file V294 e' considerata sicura solo se il tool V345 passa:

```bash
static/zonaorientale/tools/audit-shared-helpers-v345.mjs
```

## Note

I riferimenti documentali storici a V294 possono restare nei documenti vecchi. Il vincolo V345 riguarda il runtime, gli HTML e i file attivi.
