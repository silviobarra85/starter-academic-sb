# AI Assistant Handoff corrente - V570

Baseline operativa aggiornata a **V570 - Strumento resize colonne tabelle giocatori**.

## Modifica V570

- Aggiunto uno strumento opzionale per ridimensionare in pagina le colonne delle tabelle giocatori.
- Lo strumento e' caricato su entrambe le leghe ma resta inattivo per gli utenti normali.
- Si attiva solo con query string:
  - `?resizeTabelle=1`
  - oppure `?tableSizer=1`
- Si disattiva con:
  - `?resizeTabelle=0`
  - oppure console `FantaTableResizeV570.disable()`.
- Tabelle target:
  - Area Squadra / Dashboard Presidente: rosa squadra.
  - Rose: rosa espansa di una squadra.
  - Listone.
- Durante il ridimensionamento compaiono maniglie sulle intestazioni delle colonne.
- A fine drag, la console DevTools stampa:
  - tabella coinvolta;
  - larghezze in pixel per colonna;
  - snippet CSS copiabile.
- Aggiornati footer/cache-buster/config a V570 su entrambe le leghe.

## File principali

```text
static/fanta-engine/css/table-column-resizer-v570.css
static/fanta-engine/js/ui/table-column-resizer-v570.js
static/fanta-engine/tools/audit-table-column-resizer-v570.mjs
```

## Guardrail

- Il resize V570 e' opt-in: non altera layout o prestazioni in navigazione normale.
- Calciomercato resta disattivato come da V561.
- Svincola Giocatori ZonaOrientale resta attivo.
- Logo account presidente per stagione resta preservato.
- Stili Area Squadra, Rose e Listone restano separati.
- `FUNZIONALITA'.md` non e' stato modificato.

## Audit

```bash
node static/fanta-engine/tools/audit-table-column-resizer-v570.mjs
node --check static/fanta-engine/js/ui/table-column-resizer-v570.js
```

## Uso rapido

Aprire, per esempio:

```text
/zonaorientale/?resizeTabelle=1#teamarea
/fantapetillomantramanager/?resizeTabelle=1#listone
```

Poi trascinare le maniglie sulle intestazioni. Copiare dalla console i valori stampati da V570.
