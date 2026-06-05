# Release V364 - Fix esito simulazioni trade target presidente

## Obiettivo
Correggere il caso in cui una proposta di trattativa simulata da Admin verso un presidente restava `IN ATTESA` dopo il click su `Accetta` o `Rifiuta` quando il presidente verificava la simulazione nello stesso browser.

## Causa
Le simulazioni V362 vengono salvate in `localStorage` per poter essere reinserite in memoria dopo cambio profilo/login. Il fix V349 aggiornava correttamente la riga local-only in `state.raw.transferNegotiations` e in `state.tradeNotificationSimulatorLocalRowsV255`, ma non sincronizzava la copia persistita `zonaorientale.tradeSimulatorTargetPanel.v362.rows`.

Il merge periodico V362 poteva quindi reimportare la vecchia riga `PENDING`, facendo ricomparire la card come `In attesa`.

## Modifica
- Aggiunto helper `syncTargetTradeSimulationStorageV364` in `assets/app.js`.
- Aggiornata la chiusura locale delle simulazioni in `updateLocalTradeSimulationStatusV349` per sincronizzare anche il `localStorage` V362.
- Nessuna scrittura Firebase per righe `localOnly`.
- Nessun cambio al flusso reale delle trattative Firebase.
- Aggiornato il footer alla V364.

## Funzionalita preservate
- Simulatore trade V255.
- Azioni locali V349 su simulazioni `localOnly`.
- Pannello QA V361.
- Simulazione Admin verso presidente V362.
- Trattative reali Firebase: invio, accettazione, rifiuto, annullamento e notifiche restano sul percorso esistente.

## Test manuale consigliato
1. Accedere come Admin.
2. Aprire la Checklist QA Admin.
3. Creare una simulazione trade verso una squadra/presidente tramite il pannello V362.
4. Accedere come quel presidente nello stesso browser.
5. Aprire `Area squadra > Trattative > Ricevute`.
6. Cliccare `Accetta` oppure `Rifiuta`.
7. Verificare che la card passi a `Accettata` o `Rifiutata` e non torni `In attesa` dopo qualche secondo o dopo refresh.

## File modificati
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/index.html`
- `docs/zonaorientale/release/RELEASE_V364_FIX_SIMULAZIONI_TRADE_TARGET.md`
