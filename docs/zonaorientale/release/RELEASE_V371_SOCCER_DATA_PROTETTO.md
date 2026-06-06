# Release V371 - Soccer Data protetto

## Obiettivo

Creare la base della sezione Soccer Data per collegare i giocatori attivi nel listone ZonaOrientale ai profili FBref, senza introdurre scraping live e senza impattare sulle funzionalita' esistenti.

## Modifiche runtime

- Nuova voce `Soccer Data` in navigazione desktop.
- Nuova voce `Soccer Data` nel menu mobile `Altro`.
- Nuova pagina interna `data-page="soccerdata"`.
- Nuovo marker runtime:

```js
window.ZonaOrientaleSoccerDataV371
```

- Cache-buster e footer aggiornati a V371.
- `DEPLOY_EXPECTED_VERSION_V181 = "371"`.

## Dati

- Manifest statico Soccer Data.
- Mapping base JSON con 532 giocatori `IN_LISTONE` dal listone `2026-06-04`.
- CSV equivalente per lavoro di associazione.
- 131 asteriscati esclusi.

## Non modificato

- `docs/zonaorientale/FUNZIONALITA'.md`.
- Firebase schema e collection.
- Flussi trattative reali.
- Simulazioni trade local-only.
- Dashboard Admin V368.
- Dashboard Presidente V369.
- Centro notifiche Presidente V370.
- Listone pubblico esistente.
- Rose, competizioni, calciomercato, comunicati.

## Test

```bash
node --check assets/app.js
node --check assets/js/market/transfer-market.js
node tools/audit-soccer-data-v371.mjs
bash tools/check-zonaorientale.sh
```
