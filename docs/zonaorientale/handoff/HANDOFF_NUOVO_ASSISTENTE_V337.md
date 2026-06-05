# Handoff nuovo assistente AI - ZonaOrientale V337

## Stato corrente

La versione corrente e' V337. Il sito include i refactor protetti V333-V337 e mantiene tutte le funzionalita presenti fino alla V336.

La V337 corregge il matching dei giocatori negli articoli Calciomercato: quando il titolo contiene punteggiatura subito dopo il nome, ad esempio `Kalulu, ...`, il giocatore deve essere riconosciuto se presente nell'ultimo listone della stagione selezionata.

## Regola fondamentale

Non cancellare o scollegare funzionalita esistenti. Ogni modifica deve essere mirata e testata con `static/zonaorientale/tools/check-zonaorientale.sh`.

`docs/zonaorientale/FUNZIONALITA'.md` non deve essere modificato se l'utente non lo chiede esplicitamente.

## File principali V337

- `assets/app.js`
  - importa `createCalciomercatoPlayerHelpersV337`.
  - mantiene i nomi runtime storici V335/V336 per compatibilita.
  - aggiunge `normalizeCalciomercatoPlayerMatchValueV337`.
  - espone `window.ZonaOrientaleCalciomercatoPlayerMatchingV337`.

- `assets/js/calciomercato/calciomercato-players-v337.js`
  - modulo puro senza DOM, fetch o Firebase.
  - normalizza punteggiatura, separatori e spazi multipli anche se il normalizzatore esterno non lo fa.
  - mantiene la policy conservativa: nome completo o cognome univoco.

## Cosa preservare nei prossimi refactor

- Modal timeline giocatore V336.
- Matching ultimo listone stagione selezionata V335/V337.
- Refactor immagini Calciomercato V334.
- Card compatte V332.
- Fonti TMW squadra V329/V330.
- Archivio statico Calciomercato.
- Listone, filtro Modifiche, export CSV solo Admin.
- Rose, Fantamercato interno, Dashboard Presidente, Admin.
- Firebase/Auth/EmailJS.
- Netlify Functions.
- Mobile navigation e menu Altro.
- News/share WhatsApp.

## Test minimi consigliati

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-players-v337.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```

In browser, dopo caricamento Calciomercato, si puo' provare:

```js
window.ZonaOrientaleCalciomercatoPlayerMatchingV337.runSmokeTest()
```

## Note operative

Nei prossimi step di refactor si puo' procedere con l'estrazione del rendering card Calciomercato, ma solo mantenendo gli alias runtime attuali e senza cambiare struttura dati o JSON.
