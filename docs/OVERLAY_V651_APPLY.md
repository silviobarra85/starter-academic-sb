# Overlay V651 - Applicazione

Questo overlay aggiorna solo la shell ioSudo per migliorare il caricamento di `GIOCATORI`, `RUMOR` e `UFFICIALITA`.

## Comandi

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v651_performance_liste
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v651_performance_liste.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v651_performance_liste/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v651_performance_liste/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v651.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v651.js
node --check static/iosudo/sw.js
```

## Commit

```bash
git status
git add static docs
git commit -m "Ottimizza liste pesanti ioSudo V651"
git push origin master
```

## Dopo il deploy

Su smartphone conviene chiudere e riaprire la PWA oppure fare refresh della pagina `/iosudo/`, per evitare che il service worker precedente continui a servire la vecchia shell.
