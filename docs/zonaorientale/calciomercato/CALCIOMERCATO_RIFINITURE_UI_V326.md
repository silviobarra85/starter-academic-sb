# Calciomercato rifiniture UI V326

Data: 04/06/2026

## Obiettivo

Rifinire in modo mirato la sezione Calciomercato e alcuni controlli mobile/Listone senza scollegare funzionalita esistenti.

## Modifiche

- Ogni articolo Calciomercato senza immagine di anteprima mostra una tile immagine della fonte.
  - Prima V325 lo faceva solo per gli articoli dell'archivio statico.
  - In V326 il fallback vale per ogni articolo senza `image`, `thumbnail`, `imageUrl` o `ogImage`, sia da feed automatico sia da archivio/statico.
- Il blocco filtri desktop della sezione Calciomercato e piu compatto: `Cerca`, `Da` e `A` sono sulla stessa riga.
- Il pannello `Solo Admin` dell'archivio statico Calciomercato e ora espandibile/riducibile con pulsante in alto a destra.
- Il menu mobile `Altro` normalizza le icone anche sui link inseriti dinamicamente da patch successive.
- Rimosso il toggle mobile per passare da vista mobile a vista desktop.
- Il filtro `Modifiche` del Listone usa le classi standard `input filter-input`, uniformandosi agli altri menu a tendina.

## Funzionalita preservate

- Feed RSS automatico tramite Netlify Function.
- Archivio statico giornaliero e manifest V323/V324.
- Download JSON giorno/intervallo Solo Admin.
- Diagnostica archivio Calciomercato.
- Ricerca e filtri Calciomercato.
- Dati giocatori/allenatori usati da ricerca e diagnostica, anche se non mostrati nelle card.
- Listone, filtro Modifiche, colonna Modifica ed export CSV solo Admin.
- Mobile bottom nav e menu Altro.
- Fantamercato interno, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.

## File modificati

- `assets/app.js`
- `assets/css/refactor/calciomercato.css`
- `assets/css/refactor/mobile-controls.css`
- `index.html`, `competition.html`, `player.html` per cache-buster/footer V326.

## Diagnostica runtime

- `window.ZonaOrientaleRifinitureUiV326`
