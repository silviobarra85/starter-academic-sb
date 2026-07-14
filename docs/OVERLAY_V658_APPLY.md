# Overlay V658 - applicazione

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v658_scroll_counts
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v658_scroll_counts.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v658_scroll_counts/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v658_scroll_counts/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v658.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v658.js
node --check static/iosudo/sw.js
```

## Commit

```bash
git status
git add static docs
git commit -m "Corregge scroll e conteggi ioSudo V658"
git push origin master
```
