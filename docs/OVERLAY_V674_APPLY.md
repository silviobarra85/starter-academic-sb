# Overlay V674 - Aggiornamento ioSudo globale v28

## Applicazione manuale

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v674_globale_v28
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v674_globale_v28.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v674_globale_v28/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v674_globale_v28/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v674.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v674.js
node --check static/iosudo/sw.js
```

## Commit

```bash
git status
git add static docs
git commit -m "Aggiorna ioSudo V674"
git push origin master
```
