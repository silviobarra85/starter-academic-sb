# Overlay V601 - Sudatori raduni e rumors

## Applicazione

```bash
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v601_raduni_rumors/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_sudatori_v601_raduni_rumors/docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-sudatori-section-v601.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v601.js
```

## File aggiornati

- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/js/sections/sudatori-section-v601.js`
- `static/fanta-engine/css/sudatori-section-v601.css`
- indici leghe e configurazioni `zonaorientale` / `fantapetillomantramanager`

## Fonte dati

`fantacalcio_serie_a_2026_27_aggiornato_raduni_rumors_2026-07-11(1).xlsx`
