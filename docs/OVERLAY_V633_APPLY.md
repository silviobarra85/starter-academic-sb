# Overlay V633 — applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v633_fonti_recuperate/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_iosudo_v633_fonti_recuperate/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-sudatori-section-v633.mjs
node static/fanta-engine/tools/audit-iosudo-v633.mjs
```

## Commit suggerito

```bash
git commit -m "V633 recupera fonti articolo Sudatori e ioSudo"
```
