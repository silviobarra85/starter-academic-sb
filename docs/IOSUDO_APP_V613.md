# ioSudo - V613

La V613 corregge la visualizzazione delle fonti nelle card mercato della mini app **ioSudo**.

## Problema risolto
Quando una card mercato conteneva piu fonti, la resa era poco chiara: sembrava che solo la prima fonte fosse cliccabile oppure che l'intera riga fosse un unico link.

## Comportamento nuovo
- ogni fonte viene mostrata come chip separato;
- ogni chip e cliccabile autonomamente;
- se la fonte e riconosciuta ma non contiene un URL esplicito, ioSudo usa un link fallback coerente:
  - TMW -> Tuttomercatoweb Serie A;
  - Sky -> tabellone calciomercato Sky;
  - Transfermarkt -> pagina rumors Serie A;
  - SOS Fanta -> home SOS Fanta;
- la data della fonte viene aggiunta all'etichetta quando presente.

## File aggiornati
- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/js/apps/iosudo-app-v613.js`
- `static/fanta-engine/css/iosudo-app-v613.css`
- `static/fanta-engine/tools/audit-iosudo-v613.mjs`

## Controlli
```bash
node static/fanta-engine/tools/audit-iosudo-v613.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v613.js
node --check static/iosudo/sw.js
```
