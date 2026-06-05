# FUNZIONALITA V337 - Matching giocatore Calciomercato migliorato

Versione: V337  
Data: 05/06/2026  
Ambito: sezione Calciomercato, tag giocatore e timeline in scheda/modal.

## Obiettivo

Migliorare il riconoscimento automatico del giocatore associato a un articolo, senza cambiare il comportamento delle altre sezioni del sito.

Il caso che motiva la V337 e': titoli come `Kalulu, ...` devono riconoscere correttamente `Kalulu` anche quando il normalizzatore condiviso lascia la punteggiatura nel testo.

## Funzionalita V337

- Il modulo giocatori Calciomercato passa da `calciomercato-players-v335.js` a `calciomercato-players-v337.js`.
- Il matching giocatore rimuove sempre punteggiatura, apostrofi, virgolette, tag HTML, separatori e spazi multipli prima del confronto.
- Il matching continua a usare solo l'ultimo listone della stagione selezionata.
- Il matching resta conservativo:
  - nome completo;
  - cognome solo se univoco nel listone;
  - nessun matching aggressivo su parole troppo brevi o stop word.
- Il tag giocatore nelle card articolo resta nella stessa posizione introdotta in V335.
- Il tag giocatore continua ad aprire la timeline in scheda/modal V336, chiudibile con X, sfondo o Escape.
- La timeline continua a usare articoli caricati e archivio statico quando disponibile.

## Esempi coperti

- `Kalulu, la Juventus aspetta novita` -> riconosce `Kalulu`.
- `De Bruyne: contatti in corso` -> riconosce `De Bruyne`.
- `Lookman - sirene di mercato` -> riconosce `Lookman`, se presente nell'ultimo listone.
- `Lukaku: l'agente parla` -> riconosce `Lukaku`, se presente nell'ultimo listone.

## Funzionalita preservate

- Card Calciomercato compatte V332.
- Fallback immagini/favicon/TMW V334/V330/V328.
- Fonti TMW squadra V329.
- Archivio statico Calciomercato V323/V324.
- Pannello Solo Admin espandibile/riducibile V327.
- Modal timeline giocatore V336.
- Listone e filtro Modifiche V333/V331.
- Rose.
- Fantamercato interno.
- Dashboard Presidente.
- Admin generale.
- Firebase/Auth/EmailJS.
- Netlify Functions.
- News/share WhatsApp.
- Navigazione mobile e menu Altro.
- Pagine standalone `competition.html` e `player.html`.

## File principali coinvolti

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/calciomercato/calciomercato-players-v337.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`

## File non modificati intenzionalmente

- `docs/zonaorientale/FUNZIONALITA'.md`
- `netlify/functions/calciomercato-feed.js`
- `static/zonaorientale/assets/calciomercato/links.json`
- `static/zonaorientale/assets/calciomercato/archive/*.json`
- `static/zonaorientale/assets/listoni/*.json`

## Diagnostica

Esposta diagnostica runtime:

```js
window.ZonaOrientaleCalciomercatoPlayerMatchingV337
```

La diagnostica include anche `runSmokeTest()`, utile in console browser per verificare il caso `Kalulu, ...`.
