# AI Assistant Handoff - CURRENT

## Versione corrente
V585 - Dashboard Presidente mobile compatta

## Stato operativo
- ZonaOrientale e FantaPetilloMantraManager usano `player-tables-mobile-v584` come asset consolidato per le tabelle giocatori mobile.
- Il resize temporaneo colonne V570/V571 resta fuori dal runtime.
- La Dashboard Presidente mobile usa `president-teamarea-mobile-v585` per:
  - nascondere i pulsanti duplicati nella card Dashboard Presidente;
  - ricostruire il quick hub compatto con azioni canoniche;
  - aggiungere il tasto `Apri/Riduci` a destra sui pannelli operativi;
  - tenere i pannelli operativi chiusi di default.
- La card `Proponi svincolo` e rinominata `Proponi trattativa`.
- Calciomercato resta disattivato.
- Svincola Giocatori resta attivo su ZonaOrientale.
- `FUNZIONALITA'.md` non e stato toccato.

## Audit principale
```bash
node static/fanta-engine/tools/audit-teamarea-dashboard-v585.mjs
```

## Cleanup consigliato
```bash
bash static/fanta-engine/tools/cleanup-teamarea-dashboard-v585.sh
```
