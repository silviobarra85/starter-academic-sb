# Overlay V656 - Ripristino Rosa nella scheda squadra ioSudo

## Obiettivo

Ripristinare la sottosezione **Rosa** dentro ogni scheda squadra di ioSudo, senza tornare a includere nella sezione globale **GIOCATORI** i calciatori presenti solo nei rumor.

## Cosa cambia

- `static/iosudo/index.html` carica ioSudo V656.
- `static/iosudo/sw.js` aggiorna la cache PWA a V656.
- `static/fanta-engine/js/apps/iosudo-app-v656.js` ripristina il tab **Rosa** nel pannello squadra.
- `static/fanta-engine/css/iosudo-app-v656.css` mantiene lo stile V655.
- `static/fanta-engine/tools/audit-iosudo-v656.mjs` controlla la patch.

## Cosa non cambia

- Non cambia il dataset V655/V25.
- Non riattiva la sezione pubblica **Per i SUDATORI** nel sito.
- Non reinserisce in **GIOCATORI** i giocatori presenti solo in rumor/ufficialita.

## Comandi

```bash
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v656_restore_rosa_squadra/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v656_restore_rosa_squadra/docs/* docs/

node static/fanta-engine/tools/audit-iosudo-v656.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v656.js
node --check static/iosudo/sw.js

git add static docs
git commit -m "Ripristina Rosa squadra ioSudo V656"
git push origin master
```
