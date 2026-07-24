# Operazioni overlay

Overlay **V784**, applicazione **V773**.

Copia `static/` e `docs/`, quindi esegui:

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v773.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v773.mjs .
```

L’overlay non modifica `.github/workflows`.
