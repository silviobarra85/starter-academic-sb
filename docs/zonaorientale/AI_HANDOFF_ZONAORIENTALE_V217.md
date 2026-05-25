# AI Handoff ZonaOrientale - V217

## Obiettivo

Correggere la consegna V216 perché in produzione potevano restare visibili i vecchi campi della classifica campionato:

- in Admin → Risultati competizioni non comparivano i nuovi input V/N/P/GF/GS/DR;
- aprendo una competizione di tipo Campionato si poteva vedere ancora la vecchia tabella con le sole colonne già presenti.

## Causa individuata

`app.js` era versionato con `?v=216`, ma lo static import del modulo Admin restava:

```js
import { createAdminCompetitionHelpersV131 } from "./js/admin/admin-competitions.js";
```

Il browser poteva quindi usare una copia cache del vecchio `admin-competitions.js`.

Inoltre i link verso `competition.html` non aggiungevano un parametro di versione, quindi la pagina singola competizione poteva restare servita in cache con il vecchio markup.

## Modifiche V217

- Aggiornato import Admin in `assets/app.js`:

```js
import { createAdminCompetitionHelpersV131 } from "./js/admin/admin-competitions.js?v=217";
```

- Aggiornato `getCompetitionOpenUrlV111()` per aggiungere sempre `v=217` alla query di `competition.html`.
- Aggiornati cache-buster e footer in `index.html` e `competition.html`.
- Reincluso `assets/js/admin/admin-competitions.js` nella patch V217, così l'editor Admin contiene sicuramente tutti gli input.
- Aggiunti rinforzi CSS V217 per evitare che CSS mobile legacy nasconda/collassi colonne della classifica completa.

## Colonne classifica campionato

Ordine definitivo:

1. POS
2. SQUADRA
3. PUNTI
4. PG
5. V
6. N
7. P
8. GF
9. GS
10. DR
11. FPT

## File modificati

- `zonaorientale/index.html`
- `zonaorientale/competition.html`
- `zonaorientale/assets/app.js`
- `zonaorientale/assets/js/admin/admin-competitions.js`
- `zonaorientale/assets/styles.css`
- `zonaorientale/assets/css/admin-v130.css`
- `zonaorientale/assets/css/competition-detail-v130.css`
- `zonaorientale/assets/css/mobile-suite-v168.css`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V217.md`
- `docs/zonaorientale/REFACTOR_V217.md`
