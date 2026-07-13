# Overlay V636 - Applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v636_giocatori_alias_fantasy/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v636_giocatori_alias_fantasy/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-sudatori-section-v636.mjs
node static/fanta-engine/tools/audit-iosudo-v636.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v636.js
node --check static/iosudo/sw.js
```
