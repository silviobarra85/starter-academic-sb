# V332 - Card Calciomercato piu compatte

## Obiettivo

Ridurre ulteriormente l'ingombro visivo delle schede articolo nella sezione `Calciomercato`, soprattutto tramite una miniatura piu piccola, senza cambiare dati, feed o comportamento dei link.

## Modifiche

- Ridotta la larghezza della colonna immagine su desktop.
- Ridotta l'altezza massima dell'immagine di anteprima su desktop.
- Ridotte dimensione, gap e padding delle card su mobile.
- Il titolo resta cliccabile e continua ad aprire l'articolo.
- I metadati articolo restano visibili: fonte, data, squadra/topic/status.
- Le anteprime testuali restano nascoste come in V331.
- Il pulsante `Apri articolo` resta nascosto da mobile come in V331.

## Funzionalita preservate

- Feed RSS/HTML e Netlify Function Calciomercato.
- Archivio statico giornaliero Calciomercato.
- Fallback favicon e fallback testuale `TMW - <NomeSquadra>`.
- Toggle Solo Admin Calciomercato.
- Listone, Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/css/refactor/calciomercato.css`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`

`docs/zonaorientale/FUNZIONALITA'.md` non e' stato modificato.
