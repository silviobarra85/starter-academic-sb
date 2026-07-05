# AI Assistant Handoff corrente - V571

Baseline operativa aggiornata a **V571 - Indicatori resize colonne mobile**.

## Modifica V571

- Migliorato lo strumento opzionale V570 per ridimensionare colonne delle tabelle giocatori.
- Lo strumento resta opt-in e inattivo per gli utenti normali.
- Si attiva con:
  - `?resizeTabelle=1`
  - `?tableSizer=1`
  - oppure console `FantaTableResizeV571.enable()`.
- Tabelle target:
  - Area Squadra / Dashboard Presidente: tabella rosa.
  - Rose: rosa espansa di una squadra.
  - Listone.
- Aggiunti indicatori visibili stile maniglia tra le colonne, con simbolo `<>`.
- Da mobile le maniglie sono piu grandi e touch-friendly.
- Durante il drag compare un badge con tabella, colonna e larghezza corrente.
- Al rilascio, DevTools Console stampa larghezze e snippet CSS copiabile.
- Mantenuto alias `FantaTableResizeV570` verso V571 per compatibilita operativa.
- Aggiornati footer/cache-buster/config a V571 su entrambe le leghe.

## File principali

```text
static/fanta-engine/css/table-column-resizer-v571.css
static/fanta-engine/js/ui/table-column-resizer-v571.js
static/fanta-engine/tools/audit-table-column-resizer-v571.mjs
```

## Guardrail

- V571 non modifica dati, Firebase, EmailJS, Admin, Area Presidente o snapshot.
- Il resize resta disattivato in navigazione normale.
- Calciomercato resta disattivato come da V561.
- Svincola Giocatori ZonaOrientale resta attivo.
- Logo account presidente per stagione resta preservato.
- Stili Area Squadra, Rose e Listone restano separati.
- `FUNZIONALITA'.md` non e' stato modificato.

## Audit

```bash
node static/fanta-engine/tools/audit-table-column-resizer-v571.mjs
node --check static/fanta-engine/js/ui/table-column-resizer-v571.js
```

## Uso rapido mobile

Aprire, per esempio:

```text
/zonaorientale/?resizeTabelle=1#teamarea
/fantapetillomantramanager/?resizeTabelle=1#listone
```

Poi trascinare con il dito gli indicatori `<>` sulle intestazioni delle colonne. Al rilascio copiare dalla Console i valori stampati da V571.
