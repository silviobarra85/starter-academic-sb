# Handoff nuovo assistente - V359

## Stato corrente

Versione runtime: V359.

V359 migliora il matching giocatori Calciomercato e aggiunge diagnostica articoli associati/non associati.

## Cosa non rompere

- Non rimuovere `renderCalciomercatoPlayerTagsV335` e funzioni V335/V336: sono wrapper di compatibilita ancora usati dal renderer card e dalla timeline modal.
- Non cambiare `links.json`, archivi JSON o Netlify Function per interventi sul matching giocatore.
- Non modificare `FUNZIONALITA'.md` senza richiesta esplicita.

## File chiave

- `assets/js/calciomercato/calciomercato-players-v359.js`
- `assets/app.js`
- `tools/audit-calciomercato-player-diagnostics-v359.mjs`
- `docs/zonaorientale/audit/CALCIOMERCATO_PLAYER_DIAGNOSTICS_MATRIX_V359.md`

## Diagnostica rapida

Da browser Admin:

```js
window.ZonaOrientaleCalciomercatoPlayerMatchingV359.runSmokeTest()
window.ZonaOrientaleCalciomercatoPlayerDiagnosticsV359.generateCurrentReport()
```

Dalla checklist QA Admin premere `Report giocatori` sul controllo Calciomercato player diagnostics.

## Prossimo passo consigliato

Usare la diagnostica V359 per identificare articoli non associati e valutare solo in seguito una lista alias controllata, senza fuzzy matching aggressivo.
