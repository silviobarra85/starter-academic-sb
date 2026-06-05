# Release V328 - Card Calciomercato mobile e favicon fonte

Data: 2026-06-04

## Sintesi

La V328 rende piu rapida la lettura mobile degli articoli Calciomercato, corregge la visualizzazione delle entita HTML nei titoli/descrizioni e sostituisce la tile fonte con la favicon del sito quando manca l'immagine di anteprima.

## Dettagli

- Mobile: nascoste le descrizioni lunghe nelle card Calciomercato.
- Testi: decodifica client-side delle entita HTML prima dell'escape del rendering.
- Immagini mancanti: fallback primario su favicon della fonte; fallback secondario sulla tile SVG fonte se la favicon non carica.
- Versione deploy aggiornata a V328 in cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181`.

## Non modificato

- Nessuna modifica a Netlify Functions.
- Nessuna modifica ai JSON di archivio statico.
- Nessuna modifica a `assets/calciomercato/links.json`.
- Nessuna modifica a Firebase/Auth/EmailJS.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Controlli richiesti

- `static/zonaorientale/tools/check-zonaorientale.sh`
- `tools/audit-assets-v298.sh`
- `tools/audit-css-v300.sh`
