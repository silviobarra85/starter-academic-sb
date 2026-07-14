# Overlay V663 - Card mobile sito piu compatte e ordinate

Overlay solo sito. Non modifica ioSudo, dati, listoni, rose JSON o Sudatori.

## Cosa cambia

- Le card mobile di Listone e Rose restano progressive con “Mostra altre voci”.
- La card esterna/contenitore resta neutra: il colore evidente e' quello della card giocatore.
- Ogni card giocatore usa il colore del ruolo: P giallo, D verde, C blu, A rosso.
- L'intestazione della tabella e' nascosta su mobile, perche' il contenuto non e' piu' tabellare.
- La larghezza delle card si adatta allo schermo e al ridimensionamento della finestra.
- Il nome della rosa compare accanto al giocatore con logo quando disponibile.
- Se il giocatore e' svincolato compare un badge giallo scuro “Svincolato”.
- Per i giocatori in rosa, la card mostra anche il costo accanto alla quotazione attuale.
- Il badge “In listone” e' verde; il badge “Asteriscato” e' giallo.

## Applicazione manuale

```bash
cp -R static/* static/
cp -R docs/* docs/
```

## Audit

```bash
node static/fanta-engine/tools/audit-site-mobile-cards-v663.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```
