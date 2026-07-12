# Stato corrente e indice

Versione corrente: **V609**

## ioSudo

La V609 aggiunge **ioSudo**, mini app PWA installabile collegata alla sezione **Per i SUDATORI**.

- URL app: `/iosudo/`
- Redirect da lega: `/fantapetillomantramanager/iosudo/`
- Origine dati: `static/fanta-engine/data/sudatori/current/manifest.json`
- Dati Sudatori: invariati rispetto a V608.

## Sezione Per i SUDATORI

La sezione resta attiva come modulo standalone. I dati provengono da `static/fanta-engine/data/sudatori/current/` e sono condivisi fra le leghe.

## File principali

- `static/iosudo/index.html`
- `static/fanta-engine/js/apps/iosudo-app-v609.js`
- `static/fanta-engine/css/iosudo-app-v609.css`
- `static/iosudo/sw.js`
- `static/fanta-engine/tools/audit-iosudo-v609.mjs`
