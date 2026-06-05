# Release V331 - Card Calciomercato compatte e Listone uniforme

## Sintesi

V331 riduce l'ingombro delle schede articolo Calciomercato e uniforma la label `Modifiche` del Listone.

## Cosa cambia

- Rimosso il rendering dell'anteprima/testo articolo dalle card Calciomercato su desktop e mobile.
- Nascosto da mobile il pulsante `Apri articolo`; il titolo resta il link principale all'articolo.
- Mantenuti metadati articolo: squadra, topic, stato, fonte e data.
- Uniformata l'etichetta `Modifiche` del filtro Listone.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V331.

## Non modificato

- Netlify Functions.
- `assets/calciomercato/links.json`.
- Archivio statico Calciomercato.
- Listoni JSON e manifest.
- Firebase/Auth/EmailJS.
- Rose, Fantamercato interno, Dashboard Presidente, Admin generale.
- `docs/zonaorientale/FUNZIONALITA'.md`.

## Test consigliati

- Aprire `Calciomercato` da desktop: le card devono mostrare titolo/metadati/fonte/data senza anteprima testo.
- Aprire `Calciomercato` da mobile: il pulsante `Apri articolo` non deve comparire, ma il titolo deve aprire l'articolo.
- Aprire `Listone`: la label `Modifiche` deve risultare coerente con gli altri controlli.
- Eseguire `static/zonaorientale/tools/check-zonaorientale.sh`.
