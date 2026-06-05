# Manual QA Info Matrix V360

| Area | Controllo | Cosa verifica l'audit |
| --- | --- | --- |
| Versione | `DEPLOY_EXPECTED_VERSION_V181 = 360` | Allineamento runtime |
| QA panel | `const version = 'V360'` | Versione interna pannello |
| UI | `details.manual-qa-card-v358__info` | Presenza della `i` informativa |
| Dati test | almeno 15 campi `info` | Ogni test storico ha una spiegazione |
| Export | colonna `Cosa controllare` | Riepilogo Markdown piu' chiaro |
| Sicurezza | admin-only invariato | Il pannello resta nascosto ai non admin |

Tool:

```bash
static/zonaorientale/tools/audit-manual-qa-info-v360.mjs
```
