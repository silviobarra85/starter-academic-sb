# Overlay V645 - ioSudo performance e XI fantasy squadra

Applicare dalla radice del repository:

```bash
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v645_perf_xi_fantasy/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_iosudo_v645_perf_xi_fantasy/docs/* docs/
```

Controlli consigliati:

```bash
node static/fanta-engine/tools/audit-iosudo-v645.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v645.js
node --check static/iosudo/sw.js
```

Commit consigliata:

```bash
git add static docs
git commit -m "Ottimizza ioSudo GIOCATORI e XI V645"
git push origin master
```

L'overlay non contiene zip, non modifica i dati Sudatori e non rimuove informazioni gia presenti nell'app.
