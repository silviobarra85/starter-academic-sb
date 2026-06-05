# Test V369 - Dashboard Presidente

## Test manuale presidente

1. Login come presidente approvato.
2. Aprire `Area squadra`.
3. Verificare la presenza della Dashboard presidente in alto.
4. Verificare metriche: saldo FM, giocatori, valore rosa, trattative, richieste, mercato.
5. Verificare che sotto restino le sezioni Proponi svincolo, Trattative e Invia comunicato squadra.
6. Usare i pulsanti rapidi della dashboard.
7. Creare una proposta di trattativa e verificare che il form funzioni ancora.
8. Accettare/Rifiutare una trattativa ricevuta e verificare che non torni in attesa.

## Test manuale Admin

1. Login Admin.
2. Verificare che il Cruscotto pre-deploy V368 sia ancora presente.
3. Eseguire la Checklist QA Admin.
4. Aprire home, competizione e scheda giocatore.

## Test console browser

```js
ZonaOrientalePresidentDashboardV369.runSmokeTest()
```
