# V585 - Dashboard Presidente mobile compatta

## Sintesi
La patch V585 risolve duplicazioni e problemi di accesso rapido nella Dashboard Presidente mobile.

## Dettagli UI
- I comandi non vengono piu duplicati nella card Dashboard Presidente e nel quick hub.
- Il quick hub diventa la sorgente unica per le azioni rapide mobile.
- I pannelli operativi hanno sempre un pulsante a destra `Apri/Riduci`.
- Di default i pannelli sono chiusi.

## Azioni quick hub
- Tutte le rose.
- Mercato.
- Proponi trattativa.
- Trattative.
- Comunicato squadra.
- Scambio comunicato.
- Svincoli email.
- Pagina squadra.

## Cleanup
Lo script V585 richiama il cleanup V584, se presente, e rimuove eventuali residui dei resize colonne V570/V571.

```bash
bash static/fanta-engine/tools/cleanup-teamarea-dashboard-v585.sh
```
