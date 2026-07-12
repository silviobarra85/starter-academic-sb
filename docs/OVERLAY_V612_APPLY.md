# Overlay V612 - Applicazione

## Copia file

```bash
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v612_team_card_colors/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v612_team_card_colors/docs/* docs/
```

## Verifica

```bash
node static/fanta-engine/tools/audit-iosudo-v612.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v612.js
node --check static/iosudo/sw.js
```
