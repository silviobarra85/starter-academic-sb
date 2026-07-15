# Overlay ioSudo V684

Aggiornamento ioSudo dal file Excel v33.

## Applicazione manuale

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v684_globale_v33
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v684_globale_v33.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v684_globale_v33/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v684_globale_v33/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v684.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v684.js
node --check static/iosudo/sw.js
```

## Commit

```bash
git status
git add static docs
git commit -m "Aggiorna ioSudo V684"
git push origin master
```
