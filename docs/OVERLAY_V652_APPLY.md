# Overlay V652 - Apply

## Scopo

Ottimizzare l'apertura del dettaglio giocatore in ioSudo dopo la patch V651.

## Applicazione

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v652_player_detail_perf
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v652_player_detail_perf.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v652_player_detail_perf/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v652_player_detail_perf/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v652.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v652.js
node --check static/iosudo/sw.js
```

## Commit

```bash
git status
git add static docs
git commit -m "Ottimizza dettaglio giocatore ioSudo V652"
git push origin master
```
