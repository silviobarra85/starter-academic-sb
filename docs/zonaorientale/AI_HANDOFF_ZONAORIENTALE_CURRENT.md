# AI Handoff ZonaOrientale Current - V370

Versione corrente: V370.

## Stato generale

La V370 segue V364, V365, V366, V367, V368 e V369. V364 ha corretto la persistenza dell'esito Accetta/Rifiuta per simulazioni target local-only; V365 ha riallineato runtime/cache-buster/documentazione; V366 ha rafforzato stati trattative/notifiche; V367 ha aggiunto smoke test automatici anti-regressione; V368 ha aggiunto un cruscotto Admin pre-deploy read-only; V369 ha aggiunto una Dashboard Presidente read-only; V370 aggiunge un Centro notifiche presidente protetto.

## Vincoli fondamentali

- Preservare tutte le funzionalita' esistenti.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Ogni release deve aggiornare footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181`.
- Le simulazioni trade devono restare local-only; il flusso reale Firebase non va alterato se non esplicitamente richiesto.
- Ogni rimozione di file legacy deve avere audit dedicato, elenco file e comandi di rimozione espliciti.
- Prima di consegnare uno zip, verificare sempre che contenga sia `zonaorientale` sia `docs`.
- Quando si indicano comandi di applicazione zip, mostrare solo le due righe `cp -R .../zonaorientale static/` e `cp -R .../docs/zonaorientale docs/`.

## Marker recenti

```js
window.ZonaOrientaleManualQaPanelV358
window.ZonaOrientaleCalciomercatoPlayerDiagnosticsV359
window.ZonaOrientaleTradeSimulatorPanelV361
window.ZonaOrientaleTradeSimulatorTargetPanelV362
window.ZonaOrientaleTradeSimulatorTargetResolutionV364
window.ZonaOrientaleProtectedStabilizationV365
window.ZonaOrientaleTradeDomainHardeningV366
window.ZonaOrientaleProtectedRegressionSuiteV367
window.ZonaOrientaleAdminPublicationDashboardV368
window.ZonaOrientalePresidentDashboardV369
window.ZonaOrientalePresidentNotificationCenterV370
```

## Stato V370

- Footer e cache-buster portati a V370 su `index.html`, `competition.html` e `player.html`.
- `DEPLOY_EXPECTED_VERSION_V181` portato a `370`.
- Aggiunto Centro notifiche presidente sopra le sezioni operative dell'Area squadra e dopo la Dashboard Presidente quando disponibile.
- Il centro notifiche mostra trattative ricevute da rispondere, trattative inviate in attesa, esiti trattative, richieste Admin recenti e giocatori sul mercato.
- La feature e' read-only rispetto a Firebase: non crea nuove collection e non modifica lo schema dati.
- L'unica persistenza introdotta e' localStorage per acknowledge locale degli esiti trade gia' visualizzati.
- Le sezioni esistenti di Area squadra non vengono sostituite: proposta trattativa, liste trattative, comunicato squadra e profilo squadra restano attivi.
- Aggiunto `tools/audit-president-notification-center-v370.mjs`.
- Aggiornato `tools/check-zonaorientale.sh` per richiamare l'audit V370.
- Reso version-tolerant l'audit V369.
- `FUNZIONALITA'.md` non modificato.

## Test rapidi

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
node static/zonaorientale/tools/audit-protected-regression-v367.mjs
node static/zonaorientale/tools/audit-publication-dashboard-v368.mjs
node static/zonaorientale/tools/audit-president-dashboard-v369.mjs
node static/zonaorientale/tools/audit-president-notification-center-v370.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```

Da console browser:

```js
ZonaOrientaleProtectedRegressionSuiteV367.runSmokeTest()
ZonaOrientaleAdminPublicationDashboardV368.runSmokeTest()
ZonaOrientalePresidentDashboardV369.runSmokeTest()
ZonaOrientalePresidentNotificationCenterV370.runSmokeTest()
```

## Prossimo passo consigliato

Fermarsi e testare sul browser reale l'intera catena V364-V370. La prossima release dovrebbe essere correttiva/manutentiva in base a quello che emerge dai test, non una nuova feature ampia.
