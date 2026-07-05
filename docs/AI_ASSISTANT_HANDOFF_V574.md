# AI Assistant Handoff V574 - Tabelle giocatori mobile stile Listone

## Obiettivo

Uniformare da mobile la visualizzazione delle tre tabelle giocatori:

- Area Squadra / Dashboard Presidente.
- Rose.
- Listone.

Il Listone e' stato considerato il riferimento per font, colori, dimensioni e comportamento sticky.

## Intervento

- Nuovo CSS `static/fanta-engine/css/player-tables-mobile-v574.css`.
- Le tabelle Area Squadra e Rose ora ereditano lo stesso trattamento mobile del Listone:
  - font compatto;
  - padding coerente;
  - intestazione sticky e opaca;
  - prima colonna sticky/opaca;
  - nome giocatore non troncato;
  - allineamento a sinistra;
  - righe colorate per ruolo.
- Il resize colonne V570/V571 resta non caricato.

## Preservato

- Link giocatore a Fantagazzetta/Fantacalcio.
- Firebase, EmailJS, Admin, Presidente.
- Svincola Giocatori ZonaOrientale.
- Calciomercato disattivato.
- Snapshot e dati statici.
- FantaPetilloMantraManager incluso nella stessa patch, come overlay whole-site.

## Audit

```bash
node static/fanta-engine/tools/audit-player-tables-mobile-v574.mjs
```
