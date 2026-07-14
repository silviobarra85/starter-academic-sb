# AI Assistant Handoff V668

Overlay solo sito per rifinire le card mobile di Listone e Rose.

## Obiettivi

- Eliminare dai controlli del Listone i campi: Origine, Costo rosa, Diff.M, Ruolo rosa, Qt.I M e Qt.A M.
- Neutralizzare lo sfondo verde residuo generato dalle vecchie celle `td.fpt-v584-col-player`/classi legacy della tabella Listone.
- Mantenere il colore della card in base al ruolo del giocatore.
- Rendere i nomi dei giocatori in maiuscolo nelle card mobile Listone/Rose.
- Usare box fissi per le informazioni, così ogni dato resta sempre nella stessa posizione anche quando il valore è assente.
- Mantenere desktop e dati invariati.

## File principali

- `static/fanta-engine/css/site-performance-v668.css`
- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/zonaorientale/index.html`
- `static/fantapetillomantramanager/index.html`
- `static/zonaorientale/assets/league-config.json`
- `static/fantapetillomantramanager/assets/league-config.json`

## Nota tecnica sul verde

Il verde residuo non proveniva dalla nuova card, ma da CSS legacy applicato alla cella della vecchia tabella, in particolare da classi tipo `td.fpt-v584-col-player` e da regole di background sulle righe/celle ruolo. V668 forza la superficie esterna della tabella Listone a `transparent` e lascia il colore solo sulla card giocatore.

## Controlli

```bash
node static/fanta-engine/tools/audit-site-mobile-cards-v668.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```
