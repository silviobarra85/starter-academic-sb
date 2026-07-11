# Overlay V602 - Sudatori mercato in tabella

## Applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v602_market_badges/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v602_market_badges/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-sudatori-section-v602.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v602.js
```

## File aggiornati

- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/js/sections/sudatori-section-v602.js`
- `static/fanta-engine/css/sudatori-section-v602.css`
- `static/fanta-engine/tools/audit-sudatori-section-v602.mjs`
- indici leghe e configurazioni `zonaorientale` / `fantapetillomantramanager`

## Nota

I dati restano quelli V601 dell'Excel `fantacalcio_serie_a_2026_27_aggiornato_raduni_rumors_2026-07-11(1).xlsx`; V602 cambia la resa della colonna **Mercato** per mostrare tutte le voci collegate al giocatore, incluse Transfermarkt.
