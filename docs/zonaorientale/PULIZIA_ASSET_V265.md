# Pulizia asset V265

Documento operativo per la pulizia fisica dei file duplicati/inutilizzati sicuri sul branch `refactor/260528-zonaorientale-next`.

## Obiettivo

Ridurre confusione e rischio di manutenzione senza cambiare funzionalita' runtime.

## File da rimuovere dalla repo

Questi file sono stati identificati come duplicati o non piu' necessari:

```text
static/zonaorientale/assets/js/trade-notification-simulator-v255.js
static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js
static/zonaorientale/assets/css/mobile-hotfix-v166.css
static/zonaorientale/assets/css/mobile-hotfix-v167.css
```

La posizione canonica del simulatore trattative resta:

```text
static/zonaorientale/assets/js/dev/trade-notification-simulator-v255.js
```

## File da mantenere

Non rimuovere senza audit specifico:

```text
static/zonaorientale/assets/js/refactor/admin-publication-workflow-v213.js
static/zonaorientale/assets/js/domain/competitions.js
static/zonaorientale/news.html
static/zonaorientale/comunicati/*.html
static/zonaorientale/tools/generate-news-share-pages.mjs
```

## Comandi di rimozione

```bash
git rm --ignore-unmatch static/zonaorientale/assets/js/trade-notification-simulator-v255.js
git rm --ignore-unmatch static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v166.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v167.css
find static/zonaorientale -name ".DS_Store" -delete
rm -rf static/zonaorientale/__MACOSX __MACOSX
```

## Test post-pulizia

- Aprire la home e verificare footer `V265 pulizia asset sicuri`.
- Eseguire da console: `window.ZonaOrientaleCleanupV265`.
- Verificare che il simulatore trattative sia ancora disponibile: `ZonaOrientaleTradeSimulatorV255.help()`.
- Verificare una navigazione mobile rapida: Dashboard, News, Rose, Competizioni, Dashboard Presidente.

## Note

`FUNZIONALITA'.md` non viene modificato in questa release. La pulizia non aggiunge o rimuove funzionalita' utente.
