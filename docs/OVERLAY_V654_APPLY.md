# Applicazione overlay V654

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v654_globale_v24_short_sources
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v654_globale_v24_short_sources.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v654_globale_v24_short_sources/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v654_globale_v24_short_sources/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v654.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v654.js
node --check static/iosudo/sw.js
```

## Commit

```bash
git status
git add static docs
git commit -m "Aggiorna ioSudo V654"
git push origin master
```
