# Overlay ioSudo V743

Generato: 20/07/2026 16:11 CEST
Base Excel: `v118_2026-07-20_fantacalcio_serie_a_2026_27_aggiornamento_globale_fuso_v742.xlsx`

## Applicazione
Copiare le cartelle dell'overlay nella root del sito:

```bash
cp -R overlay_iosudo_v743/static/* static/
cp -R overlay_iosudo_v743/docs/* docs/
```

## Controlli
```bash
node --check static/fanta-engine/js/apps/iosudo-app-v743.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v743.mjs
```
