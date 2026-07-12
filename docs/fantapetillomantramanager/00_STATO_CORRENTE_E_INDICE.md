# Stato corrente e indice

Versione corrente: **V610**

## ioSudo

La V610 rifinisce **ioSudo**, mini app PWA installabile collegata alla sezione **Per i SUDATORI**.

- URL app: `/iosudo/`
- Redirect da lega: `/fantapetillomantramanager/iosudo/`
- Header compatto: `ioSudo - Fanta Petillo Mantra Manager - Vai al sito`
- Logo: personaggio che suda pensando alla formazione del fantacalcio.
- Origine dati: `static/fanta-engine/data/sudatori/current/manifest.json`
- Dati Sudatori: condivisi con la sezione Per i SUDATORI, senza duplicazioni.

## Sezione Per i SUDATORI

La sezione resta attiva come modulo standalone. I dati provengono da `static/fanta-engine/data/sudatori/current/` e sono condivisi fra le leghe.

## File principali

- `static/iosudo/index.html`
- `static/fanta-engine/js/apps/iosudo-app-v610.js`
- `static/fanta-engine/css/iosudo-app-v610.css`
- `static/iosudo/sw.js`
- `static/fanta-engine/tools/audit-iosudo-v610.mjs`
