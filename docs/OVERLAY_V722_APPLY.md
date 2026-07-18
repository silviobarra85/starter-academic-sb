# Overlay ioSudo V722

Origine: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-18_aggiornamento_globale_v78.xlsx`  
Base: V721  
Generato: 2026-07-18T16:05:00+02:00

## Applicazione

Dalla root del sito:

```bash
cp -R overlay_iosudo_v722/static/* static/
cp -R overlay_iosudo_v722/docs/* docs/
```

## Verifica

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v722.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v722.mjs
```
