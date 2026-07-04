# AI Assistant Handoff V565 - Logo account presidente coerente con stagione

## Obiettivo
Quando un presidente ZonaOrientale e' loggato e seleziona una stagione storica, il pulsante account in alto deve mostrare il logo della squadra relativo alla stagione selezionata, non il logo della stagione corrente di approvazione. La scritta `Pres. <cognome>` deve restare sempre visibile.

## Modifiche
- `static/zonaorientale/assets/app.js`
  - aggiunto runtime V565;
  - `getPresidentAccountSeasonTeamV229` viene riagganciata per cercare prima il `seasonTeam` della stagione selezionata;
  - la ricerca avviene per `teamId` del documento `teamUsers`, con fallback per `presidentId`;
  - `renderPresidentAccountButtonContentV229` usa il `seasonTeam` risolto, quindi logo 2025-2026 e logo 2026-2027 possono essere diversi;
  - dopo ogni `renderAll` il pulsante account viene aggiornato.
- `static/zonaorientale/index.html`
  - cache-buster app a `v=565`;
  - footer a `V565`.
- `static/fanta-engine/tools/audit-president-account-season-logo-v565.mjs`
  - audit dedicato alla patch.

## Preservato
- V561 Calciomercato disattivato.
- V563 Svincola Giocatori runtime fix.
- V564 layout header Svincola Giocatori.
- Login, Firebase, `teamUsers`, permessi presidente, EmailJS, Listone e dati stagione non vengono modificati.
- `FUNZIONALITA'.md` non viene modificato.

## Audit
```bash
node static/fanta-engine/tools/audit-president-account-season-logo-v565.mjs
node --check static/zonaorientale/assets/app.js
```

## Verifica manuale
1. Login come presidente ZonaOrientale.
2. Selezionare stagione `2026-2027`: il pulsante in alto deve mostrare il nuovo logo e `Pres. <cognome>`.
3. Selezionare stagione `2025-2026`: il pulsante in alto deve mostrare il logo storico della stessa squadra e mantenere `Pres. <cognome>`.
4. Tornare a `2026-2027` e verificare che il logo nuovo ricompaia.
