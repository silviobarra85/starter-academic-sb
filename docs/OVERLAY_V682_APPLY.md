# Overlay V682 - Aggiornamento ioSudo globale v29

## Applicazione manuale

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v682_globale_v29
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v682_globale_v29.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v682_globale_v29/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v682_globale_v29/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v682.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v682.js
node --check static/iosudo/sw.js
```

## Commit

```bash
git status
git add static docs
git commit -m "Aggiorna ioSudo V682"
git push origin master
```
