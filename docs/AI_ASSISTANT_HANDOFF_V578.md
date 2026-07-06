# Handoff V578 - Colonna giocatore mobile dimezzata

Data: 06/07/2026

## Obiettivo

Ridurre da mobile la colonna del nome giocatore nelle tre tabelle giocatori:

- Area Squadra / Dashboard Presidente;
- Rose;
- Listone.

## Implementazione

File principali:

- `static/fanta-engine/css/player-tables-mobile-v578.css`
- `static/fanta-engine/js/ui/player-tables-mobile-v578.js`
- `static/fanta-engine/tools/audit-player-tables-mobile-v578.mjs`

Aggiornati anche HTML, cache-buster e versioni config delle due leghe.

## Dettaglio larghezze

- Listone: `clamp(8.5rem, 46vw, 13.5rem)`.
- Listone max: `clamp(10rem, 54vw, 15rem)`.
- Area Squadra/Rose: `clamp(5.25rem, 28vw, 7rem)`.
- Area Squadra/Rose max: `clamp(6rem, 32vw, 8rem)`.

## Preservato

- Colori righe per ruolo: P giallo, D verde, C blu, A rosso.
- Prima colonna sticky/opaca.
- Intestazione sticky/opaca.
- Link del nome giocatore alla pagina esterna.
- Calciomercato disattivato.
- Svincola Giocatori attivo su ZonaOrientale.
- Nessun resize tabelle V570/V571.

## Audit

```bash
node static/fanta-engine/tools/audit-player-tables-mobile-v578.mjs
```
