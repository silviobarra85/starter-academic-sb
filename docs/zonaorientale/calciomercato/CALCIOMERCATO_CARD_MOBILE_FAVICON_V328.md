# V328 - Card Calciomercato mobile, testi decodificati e favicon fonte

## Obiettivo

Rifinire la lettura degli articoli Calciomercato senza impattare feed, archivio statico o altre sezioni del sito.

## Modifiche

- Da mobile le card degli articoli non mostrano piu la descrizione/anteprima lunga: restano titolo, metadati, fonte/data e link di apertura.
- Prima del rendering vengono decodificate le entita HTML nei testi delle card, ad esempio `&#8217;`, `&#124;`, `&amp;`, `&quot;`.
- Per gli articoli senza immagine di anteprima viene usata la favicon della fonte, ricavata da:
  - favicon esplicita se presente nei dati/configurazione;
  - homepage della fonte in `assets/calciomercato/links.json`;
  - dominio dell'articolo come ultimo candidato.
- Se la favicon non carica, resta un fallback sicuro alla tile della fonte gia introdotta nelle versioni precedenti.

## Funzionalita preservate

- Feed RSS automatico Calciomercato.
- Archivio statico giornaliero Calciomercato.
- Filtri `Squadra`, `Topic`, `Fonte`, `Cerca`, `Da`, `A`.
- Pannello `Solo Admin` espandibile/riducibile.
- Listone, Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.
- Mobile bottom navigation e menu Altro.

## File modificati

- `assets/app.js`
- `assets/css/refactor/calciomercato.css`
- `index.html`
- `competition.html`
- `player.html`

## Diagnostica

- `window.ZonaOrientaleCalciomercatoCardV328`
