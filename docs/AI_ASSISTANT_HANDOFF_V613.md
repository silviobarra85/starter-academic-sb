# AI Assistant Handoff - V613

## Contesto
Overlay ioSudo successivo alla V612. La V613 non modifica i dati Sudatori: interviene solo sulla resa delle fonti dentro le card mercato della mini app.

## Modifiche V613
- In ioSudo, nelle card mercato di un giocatore, le fonti multiple non vengono piu renderizzate come una sola riga/link indistinto.
- Ogni fonte e ora mostrata come chip separato e cliccabile singolarmente.
- Aggiunti fallback cliccabili per fonti sintetiche come TMW, Sky, SOS Fanta e Transfermarkt quando il record contiene solo il nome fonte e non un URL esplicito.
- Le etichette fonte vengono normalizzate: TMW, Sky, Transfermarkt, SOS Fanta, con data quando disponibile.
- Mantenute tutte le modifiche V612: card squadre colorate, header compatto, dettaglio giocatore, colori ruolo, menu squadra sticky e ricerca nascosta quando una squadra e aperta.

## File principali
- `static/fanta-engine/js/apps/iosudo-app-v613.js`
- `static/fanta-engine/css/iosudo-app-v613.css`
- `static/fanta-engine/tools/audit-iosudo-v613.mjs`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`

## Verifiche
```bash
node static/fanta-engine/tools/audit-iosudo-v613.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v613.js
node --check static/iosudo/sw.js
```
