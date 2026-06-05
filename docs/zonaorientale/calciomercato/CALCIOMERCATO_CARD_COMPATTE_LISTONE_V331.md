# V331 - Card Calciomercato compatte e label Modifiche Listone

## Obiettivo

Rendere piu' compatta la lettura degli articoli nella sezione `Calciomercato` e uniformare l'etichetta del filtro `Modifiche` nella sezione `Listone`, senza impattare feed, archivio statico o funzioni admin.

## Modifiche

- Le card articolo Calciomercato non renderizzano piu' l'anteprima/testo descrittivo, sia desktop sia mobile.
- Da mobile il pulsante `Apri articolo` viene nascosto per ridurre l'ingombro; resta cliccabile il titolo dell'articolo e, quando presente, l'immagine.
- Fonte, data, topic, status e chip squadra restano visibili.
- L'etichetta `Modifiche` del filtro Listone usa ora spaziatura, peso e colore coerenti con gli altri controlli.

## Funzionalita preservate

- Link agli articoli tramite titolo e immagine.
- Fallback favicon e fallback testuale `TMW - <NomeSquadra>`.
- Parser RSS/HTML Calciomercato e limiti download V329.
- Toggle Solo Admin Calciomercato V327.
- Filtro `Modifiche` Listone, export CSV solo Admin e ricerca Listone.
- Firebase/Auth/EmailJS, Rose, Fantamercato interno, Dashboard Presidente e Admin generale.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/css/refactor/calciomercato.css`
- `static/zonaorientale/assets/css/refactor/mobile-controls.css`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`

`docs/zonaorientale/FUNZIONALITA'.md` non e' stato modificato.
