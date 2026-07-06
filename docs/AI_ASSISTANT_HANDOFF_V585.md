# AI Assistant Handoff V585 - Dashboard Presidente mobile compatta

## Obiettivo
Pulire e rendere coerente la Dashboard Presidente mobile, evitando duplicazioni di pulsanti e rendendo i pannelli operativi richiudibili.

## Modifiche
- Nuovo CSS: `static/fanta-engine/css/president-teamarea-mobile-v585.css`.
- Nuovo runtime: `static/fanta-engine/js/ui/president-teamarea-mobile-v585.js`.
- Nuovo audit: `static/fanta-engine/tools/audit-teamarea-dashboard-v585.mjs`.
- Nuovo cleanup: `static/fanta-engine/tools/cleanup-teamarea-dashboard-v585.sh`.
- Link CSS/JS inseriti negli `index.html` delle due leghe.
- Cache-buster/footer/config aggiornati a V585.
- `Proponi svincolo` rinominato in `Proponi trattativa` in entrambe le app.

## Comportamento mobile
- I pulsanti duplicati nella card Dashboard Presidente vengono nascosti.
- Il quick hub viene ricostruito in modo canonico con:
  - Tutte le rose;
  - Mercato;
  - Proponi trattativa;
  - Trattative;
  - Comunicato;
  - Scambio;
  - Svincoli;
  - Pagina squadra.
- I pannelli operativi hanno il tasto `Apri/Riduci` a destra.
- I pannelli operativi partono chiusi.
- Cliccando una quick action, il pannello corrispondente viene aperto e portato in vista.

## Preservato
- Firebase/Auth.
- EmailJS.
- Area Admin.
- Dashboard Presidente.
- Svincola Giocatori.
- Comunicati squadra/scambio.
- Trattative.
- Calciomercato disattivato.
- Tabelle giocatori mobile V584.

## Audit
```bash
node static/fanta-engine/tools/audit-teamarea-dashboard-v585.mjs
node --check static/fanta-engine/js/ui/president-teamarea-mobile-v585.js
```
