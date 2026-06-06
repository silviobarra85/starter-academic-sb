# Handoff nuovo assistente - V371

## Contesto

Il sito ZonaOrientale e' sul branch di lavoro `refactor/260528-zonaorientale-next`. La V371 introduce una sezione Soccer Data additiva.

## Regola principale

Non perdere e non staccare funzionalita' esistenti. In particolare non toccare trattative, area presidente, admin, listone, rose, competizioni, calciomercato o comunicati salvo richiesta esplicita.

## Soccer Data

La sezione legge solo giocatori attivi del listone (`statusCode: IN_LISTONE`). Il mapping base verso FBref e' in:

```text
static/zonaorientale/assets/soccer-data/fbref-player-map.v371.json
```

Il CSV di supporto e' in:

```text
static/zonaorientale/assets/soccer-data/fbref-player-map.v371.csv
```

## Stato mapping

- 532 giocatori attivi inclusi.
- 131 asteriscati esclusi.
- I campi FBref sono vuoti in V371.
- La prossima fase deve fare matching assistito e verificabile, non automatico cieco.

## Verifiche

```bash
node static/zonaorientale/tools/audit-soccer-data-v371.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Da non fare

- Non fare scraping live lato browser.
- Non importare statistiche senza mapping verificato.
- Non includere asteriscati nella sezione Soccer Data senza nuova decisione dell'utente.
- Non modificare `FUNZIONALITA'.md`.
