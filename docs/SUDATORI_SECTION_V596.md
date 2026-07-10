# V596 - Sudatori: contrasto card infortunati SOS Fanta

La V596 è un fix grafico incrementale della sezione standalone **Per i SUDATORI**.

## Problema risolto

Nella V595 la sezione **Infortunati / SOS Fanta** usava card chiare ma testi derivati dalle variabili scure della pagina Sudatori. Il risultato era testo chiaro su sfondo chiaro, poco leggibile.

## Correzione

Le card infortunati sono ora allineate allo stile delle card **Trattative**:

- contenitore scuro con bordo rosso tenue;
- card interne scure;
- titoli e testi chiari ad alto contrasto;
- fonte/link leggibile;
- nota operativa su separatore scuro;
- badge stato fisico ad alto contrasto.

## Funzionalità ereditate dalla V595

Restano invariati:

- infortunati/monitorati SOS Fanta;
- colonna “Stato fisico” nella tabella rosa;
- dettaglio infortunio nella scheda giocatore;
- KPI “Infortunati / SOS”;
- campetto vincolato al modulo dichiarato;
- dati su Atalanta, Lazio, Milan, Roma e Inter già integrati.

## File principali

- `static/fanta-engine/css/sudatori-section-v596.css`
- `static/fanta-engine/js/sections/sudatori-section-v596.js`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/tools/audit-sudatori-section-v596.mjs`

## Audit

```bash
node static/fanta-engine/tools/audit-sudatori-section-v596.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v596.js
```

## Garanzie

La sezione resta standalone e non modifica Firebase, `rosterEntries`, Rose ufficiali, Listone operativo o Dashboard Presidente.
