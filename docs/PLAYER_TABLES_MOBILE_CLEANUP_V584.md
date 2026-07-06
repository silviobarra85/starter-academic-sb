# V584 - Cleanup tabelle giocatori mobile

La V584 pulisce i tentativi precedenti sulle tabelle giocatori mobile e mantiene una sola sorgente attiva.

## Perché
Tra V567 e V583 sono stati creati più asset CSS/JS per provare diverse soluzioni su Area Squadra, Rose e Listone. Alcuni non sono più caricati, altri servivano solo al debug o al resize temporaneo. Mantenerli nel repository aumenta confusione e rischio di riagganci accidentali.

## Cosa resta attivo
- `player-tables-mobile-v584.css`
- `player-tables-mobile-v584.js`

## Cosa viene rimosso dal cleanup
- CSS V567-V583 non più attivi per le tabelle giocatori.
- JS V575-V583 non più attivi.
- Resize colonne V570/V571.
- Audit intermedi V567-V583 relativi a questi tentativi.

La documentazione storica resta nel repository.

## Comandi

```bash
bash static/fanta-engine/tools/cleanup-player-tables-mobile-v584.sh
node static/fanta-engine/tools/audit-player-tables-mobile-v584.mjs
```
