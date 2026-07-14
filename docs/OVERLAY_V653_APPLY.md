# Overlay V653 - Applicazione

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v653_giocatori_rumor
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v653_giocatori_rumor.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v653_giocatori_rumor/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v653_giocatori_rumor/docs/* docs/
```

Controlli:

```bash
node static/fanta-engine/tools/audit-iosudo-v653.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v653.js
node --check static/iosudo/sw.js
```

Commit e push:

```bash
git status
git add static docs
git commit -m "Include giocatori rumor in ioSudo V653"
git push origin master
```
