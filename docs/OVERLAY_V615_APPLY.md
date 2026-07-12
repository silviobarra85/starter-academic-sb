# Overlay V615 - applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v615_pitch_sources_fix/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v615_pitch_sources_fix/docs/* docs/
```

Controlli:

```bash
node static/fanta-engine/tools/audit-iosudo-v615.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v615.js
node --check static/iosudo/sw.js
```
