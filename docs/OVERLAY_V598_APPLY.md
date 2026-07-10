# Overlay V598 apply

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v598_pitch_badge_fix/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v598_pitch_badge_fix/docs/* docs/

node static/fanta-engine/tools/audit-sudatori-section-v598.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v598.js
```
