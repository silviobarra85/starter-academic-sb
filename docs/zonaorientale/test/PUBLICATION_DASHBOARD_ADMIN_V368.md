# Test V368 - Dashboard pubblicazione Admin

## Test automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-publication-dashboard-v368.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

## Test manuale Admin

1. Aprire la home e verificare footer V368.
2. Login Admin.
3. Verificare che in alto compaia `Cruscotto pre-deploy`.
4. Premere `Aggiorna solo riepilogo`.
5. Premere `Aggiorna cruscotto + semafori`.
6. Verificare che Promemoria pubblicazione V189 resti presente.
7. Verificare che Stato Firebase/JSON V190 resti presente.
8. Verificare che Procedura guidata V191 resti presente.
9. Premere `Copia checklist`.
10. Da console eseguire:

```js
ZonaOrientaleAdminPublicationDashboardV368.runSmokeTest()
```

## Test no-regression consigliato

1. Login Admin.
2. Checklist QA Admin.
3. Simula proposta trattativa verso presidente.
4. Login presidente destinatario.
5. Accetta/Rifiuta.
6. Verifica che non torni `IN ATTESA`.
7. Apri una competizione.
8. Apri una scheda giocatore.
