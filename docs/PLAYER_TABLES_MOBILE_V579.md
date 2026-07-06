# V579 - Tabelle giocatori mobile: Stato e palette Listone

## Obiettivo

Rifinire la resa mobile delle tre tabelle giocatori:

- Area Squadra / Dashboard Presidente;
- Rose;
- Listone.

## Modifiche

- La colonna **Stato** viene leggermente aumentata rispetto a V578.
- La palette ruolo viene allineata allo stile storico del **Listone**:
  - portieri: arancione/giallo Listone;
  - difensori: verde Listone;
  - centrocampisti: azzurro/blu Listone;
  - attaccanti: rosso Listone.
- La prima colonna usa lo stesso gradiente/indicatore laterale del Listone.
- Le righe mantengono sfondo ruolo leggero e uniforme su tutte le celle.
- Restano invariati:
  - nomi giocatore non troncati;
  - link giocatore esterni;
  - prima colonna sticky/opaca;
  - intestazione sticky/opaca;
  - stili separati per le tre tabelle;
  - resize V570/V571 non caricato.

## File principali

- `static/fanta-engine/css/player-tables-mobile-v579.css`
- `static/fanta-engine/js/ui/player-tables-mobile-v579.js`
- `static/fanta-engine/tools/audit-player-tables-mobile-v579.mjs`
