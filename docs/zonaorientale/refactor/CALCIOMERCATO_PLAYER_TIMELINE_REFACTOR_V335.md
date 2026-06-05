# Refactor V335 - Calciomercato player timeline

## Sintesi

V335 introduce un modulo JS puro per associare articoli Calciomercato ai giocatori del listone:

```text
static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js
```

Il modulo non accede al DOM, non esegue fetch e non scrive su Firebase. `assets/app.js` resta responsabile del rendering, della route hash e della timeline.

## Funzioni principali del modulo

- `createCalciomercatoPlayerHelpersV335(dependencies)`
- `getArticlePlayerMatches(article, listone, options)`
- `getArticlesForPlayer(articles, listone, playerKey, options)`
- `findPlayerBySlug(listone, slug)`
- `buildPlayerAliasIndex(listone)`

## Criterio di matching

Per ridurre falsi positivi:

- il nome completo del giocatore vale come match forte;
- il cognome vale solo se univoco nel listone e lungo almeno 5 caratteri;
- i cognomi/team/parole troppo generiche sono esclusi tramite stop word;
- i testi articolo vengono decodificati con l'helper V334 prima della normalizzazione.

## Collegamento UI

`app.js` aggiunge:

- `renderCalciomercatoPlayerTagsV335(article)` nelle card;
- route hash `#calciomercato-player-<slug>`;
- sezione dinamica `data-page="calciomercato-player"`;
- diagnostica `window.ZonaOrientaleCalciomercatoPlayersV335`.

## Timeline

La timeline usa:

1. articoli gia caricati dalla sezione Calciomercato;
2. archivio statico giornaliero se disponibile;
3. deduplica V323 per evitare doppioni.

Il caricamento dell'archivio completo avviene solo quando si clicca un tag giocatore. Non viene eseguito durante il normale rendering delle card.

## Funzionalita da non perdere

- Card compatte V332.
- Fallback immagini V334/V330/V328.
- Feed automatico e archivio statico V323/V329.
- Filtri e range Calciomercato.
- Solo Admin espandibile/riducibile.
- Listone e filtro Modifiche.
- Firebase/Auth/EmailJS, Rose, Fantamercato, Dashboard Presidente, Admin.

## Prossimo refactor consigliato

V336 dovrebbe estrarre il rendering delle card Calciomercato in un modulo dedicato, lasciando in `app.js` solo wrapper e orchestrazione. Prima di farlo, usare V335 come baseline e verificare che i tag giocatore continuino a comparire sopra il titolo.
