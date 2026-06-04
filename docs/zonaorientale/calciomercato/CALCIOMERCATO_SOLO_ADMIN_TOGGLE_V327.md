# Calciomercato Solo Admin toggle V327

Data: 04/06/2026

## Obiettivo

Correggere in modo mirato il pannello Solo Admin della sezione Calciomercato senza impattare feed, archivio statico, filtri o altre sezioni del sito.

## Modifiche

- Rimosso il testo non destinato alla UI dal label del pannello: resta soltanto `Solo Admin`.
- Il pulsante `Espandi`/`Riduci` aggiorna direttamente stato, attributo `aria-expanded`, testo del bottone, classe della card e attributo `hidden` del body.
- Aggiunta una regola CSS dedicata per garantire che il body del pannello rimanga realmente nascosto quando ridotto.

## Funzionalita preservate

- Feed RSS automatico tramite Netlify Function.
- Archivio statico giornaliero e manifest V323/V324.
- Download JSON giorno/intervallo Solo Admin.
- Diagnostica archivio Calciomercato.
- Ricerca e filtri Calciomercato.
- Fallback immagine fonte per articoli senza anteprima.
- Mobile menu, Listone, Fantamercato interno, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.

## File modificati

- `assets/app.js`
- `assets/css/refactor/calciomercato.css`
- `index.html`, `competition.html`, `player.html` per cache-buster/footer V327.

## Diagnostica runtime

- `window.ZonaOrientaleCalciomercatoAdminToggleV327`
