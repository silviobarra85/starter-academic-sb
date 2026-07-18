# Overlay ioSudo V727

Aggiornamento da Excel V86 del 18/07/2026.

## Applicazione

Copia le radici `static/` e `docs/` dell'overlay sul progetto:

```bash
cp -R overlay_iosudo_v727/static/* static/
cp -R overlay_iosudo_v727/docs/* docs/
```

## Controlli

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v727.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v727.mjs
```
