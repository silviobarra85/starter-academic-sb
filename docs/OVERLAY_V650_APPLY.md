# Overlay V650 - Applicazione

Questo overlay aggiorna solo la shell ioSudo per migliorare la performance di navigazione.

## Comandi

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v650_performance
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v650_performance.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v650_performance/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v650_performance/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v650.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v650.js
node --check static/iosudo/sw.js
```

## Commit

```bash
git status
git add static docs
git commit -m "Ottimizza performance ioSudo V650"
git push origin master
```

## Dopo il deploy

Su smartphone può essere necessario chiudere e riaprire la PWA oppure fare un refresh della pagina `/iosudo/`, perché il service worker precedente può servire ancora la shell vecchia per una navigazione.
