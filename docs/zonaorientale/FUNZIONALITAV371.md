# Funzionalita V371 - Soccer Data protetto

> Nota: questo file e' un riepilogo additivo V371. Non sostituisce e non modifica `FUNZIONALITA'.md`.

## Nuova sezione: Soccer Data

La V371 aggiunge una sezione pubblica `Soccer Data` raggiungibile da:

- navigazione desktop;
- menu mobile `Altro`.

La sezione mostra solo i giocatori attivi nel listone corrente (`statusCode: IN_LISTONE`). Gli asteriscati non vengono mostrati nella V371.

## Funzioni disponibili

- Riepilogo giocatori attivi, mappati, da associare e risultati filtro.
- Filtro ruolo.
- Filtro squadra reale.
- Filtro mapping: tutti, mappati, da associare.
- Ricerca testuale.
- Link `Cerca FBref` per aprire una ricerca esterna del singolo giocatore.
- Copia CSV associazioni.
- Scarica mapping base JSON.

## Dati statici aggiunti

```text
assets/soccer-data/manifest.json
assets/soccer-data/fbref-player-map.v371.json
assets/soccer-data/fbref-player-map.v371.csv
```

## Garanzie

- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessuna modifica a rose, listone, trattative, admin, competizioni, calciomercato o area presidente.
- Feature additiva e reversibile.
