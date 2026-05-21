# V183 - Fix wrapping colonne report pre-online

## Obiettivo
Correggere l'overflow mobile delle tabelle generate da:

- Controlla asset pubblici
- Checklist online finale

Il problema residuo di V182 era soprattutto sulla prima colonna: alcune etichette lunghe potevano sconfinare visivamente nella colonna Stato.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/styles.css`
- `static/zonaorientale/assets/css/mobile-suite-v168.css`

## Modifiche

### Report pre-online
Aggiunte regole CSS piu' forti per i report:

- tabella sempre `table-layout: fixed`
- larghezza al 100% del contenitore
- overflow orizzontale nascosto nel box del report
- celle con `min-width: 0`
- testo e tag interni `strong`, `small`, `code` forzati a capo nella stessa cella
- larghezze esplicite per colonne Asset/Controllo, Stato, Dettaglio e Tempo

### Versione e cache-buster
Aggiornati footer e cache-buster a V183.

### Checklist online
Aggiornato il valore atteso dalla checklist deploy a V183, cosi' il controllo Version/cache-buster non segnala warning dopo l'overlay.

## Test eseguiti

- `node --check assets/app.js`
- check sintassi di tutti i file JS in `assets/`
- validazione JSON degli asset statici
- test server statico locale con `python3 -m http.server`

