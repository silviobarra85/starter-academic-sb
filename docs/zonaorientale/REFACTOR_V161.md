# V161 - Mobile rose compatte e label Ris.

Data: 2026-05-21
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Rifinire due dettagli mobile:

1. nella tabella giocatori della rosa aperta, ridurre ulteriormente la colonna `Giocatore`;
2. nelle tabelle che mostrano partite, rinominare la colonna `Risultato` in `Ris.`.

## Modifiche

- Aggiunto `assets/css/mobile-hotfix-v161.css`.
- Aggiornati `index.html` e `competition.html` con cache busting `v=161`.
- La colonna `Giocatore` nelle rose mobile viene forzata a 54px con ellissi sul nome.
- Le tabelle partite in `app.js` e `competition.html` usano `Ris.` come intestazione e `data-label` mobile.

## Note

- La modifica CSS è racchiusa in media query mobile.
- Desktop invariato.
- Nessuna modifica a Firebase o ai dati.
