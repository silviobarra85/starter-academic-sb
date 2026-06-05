# Release V332 - Card Calciomercato piu compatte

## Sintesi

V332 compatta ulteriormente le schede articolo della sezione `Calciomercato`, riducendo soprattutto l'immagine di anteprima.

## Cosa cambia

- Card articolo meno alte e meno ingombranti.
- Immagine di anteprima piu piccola su desktop.
- Miniatura piu compatta su mobile.
- Titolo, metadati, link articolo e fallback immagini restano invariati.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V332.

## Non modificato

- Netlify Functions.
- `assets/calciomercato/links.json`.
- Archivio statico Calciomercato.
- Listone dati/manifest.
- Firebase/Auth/EmailJS.
- Rose, Fantamercato interno, Dashboard Presidente, Admin generale.
- `docs/zonaorientale/FUNZIONALITA'.md`.

## Test consigliati

- Aprire `Calciomercato` da desktop: le card devono apparire piu compatte e con immagine piu piccola.
- Aprire `Calciomercato` da mobile: le card devono avere miniatura ridotta, titolo leggibile e nessun pulsante `Apri articolo`.
- Verificare che titolo e immagine continuino ad aprire l'articolo.
- Eseguire `static/zonaorientale/tools/check-zonaorientale.sh`.
