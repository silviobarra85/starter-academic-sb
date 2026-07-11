# Overlay V605 - applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v605_tm_pagine_1_20/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v605_tm_pagine_1_20/docs/* docs/

node static/fanta-engine/tools/audit-sudatori-section-v605.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v605.js
```
