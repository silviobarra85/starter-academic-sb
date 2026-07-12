# ioSudo V615 - correzione campetto e fonti mercato

La V615 corregge l'app ioSudo senza cambiare i dati Sudatori.

## Correzioni

- I moduli con quattro valori mostrano tutte le linee previste sul campo.
- La linea `attackingMidfield` del dataset viene normalizzata e renderizzata come riga autonoma.
- Le fonti mercato aggregate in un'unica etichetta, ad esempio `Eurosport/CalcioLecce`, vengono divise in chip separati.
- Ogni chip fonte è cliccabile singolarmente quando è disponibile un URL diretto o un fallback noto.

## Impatto

Non serve reinstallare la PWA. Dopo il deploy basta chiudere e riaprire ioSudo, oppure aggiornare la pagina se resta cache vecchia.
