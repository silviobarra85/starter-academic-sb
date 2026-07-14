# Overlay V664 - Card mobile sito rifinite

Scope: solo sito pubblico.

Non modifica ioSudo, dati, rose JSON, listoni o Sudatori.

## Correzioni

- Listone mobile: rimossa la squadra duplicata dentro la card.
- Tutte le Rose mobile: rimossi ruolo e squadra duplicati dentro la card.
- Contenitore esterno delle card neutralizzato: niente sfondo verde dietro le card.
- Badge `Modifica/Invariato`: diventa solo `Invariato`, piccolo e blu, in basso a destra della card.
- Card colorate per ruolo: P giallo, D verde, C blu, A rosso.
- Card responsive alla larghezza dello smartphone e al ridimensionamento finestra.
- Card applicate anche alla rosa dentro la scheda/profilo squadra.
- Footer sito aggiornato a V664.

## Applicazione manuale

```bash
cp -R static/* static/
cp -R docs/* docs/
```

## Controlli

```bash
node static/fanta-engine/tools/audit-site-mobile-cards-v664.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```
