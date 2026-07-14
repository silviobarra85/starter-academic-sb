# Overlay V649 - Applicazione

Overlay conservativo per ioSudo. Non riattiva la sezione pubblica `Per i SUDATORI` nel sito.

```bash
rm -rf ~/Downloads/fantacalcio_overlay_iosudo_v649_globale_v23_perf_amichevoli
unzip -o ~/Downloads/fantacalcio_overlay_iosudo_v649_globale_v23_perf_amichevoli.zip -d ~/Downloads/

cp -R ~/Downloads/fantacalcio_overlay_iosudo_v649_globale_v23_perf_amichevoli/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v649_globale_v23_perf_amichevoli/docs/* docs/
```

Controlli:

```bash
node static/fanta-engine/tools/audit-iosudo-v649.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v649.js
node --check static/iosudo/sw.js
git status
```

Commit:

```bash
git add static docs
git commit -m "Aggiorna ioSudo V649"
git push origin master
```
