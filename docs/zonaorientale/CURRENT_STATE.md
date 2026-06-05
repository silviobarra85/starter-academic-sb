# Stato corrente ZonaOrientale - V370

## Versione

- Runtime: V370
- Data: 05/06/2026
- Tipo release: centro notifiche presidente protetto
- Branch di lavoro dichiarato: `refactor/260528-zonaorientale-next`

## Obiettivo della V370

Aggiungere in Area squadra un Centro notifiche presidente read-only/local-ack che riassume trattative ricevute, trattative inviate, esiti trattative, richieste Admin e giocatori messi sul mercato.

La V370 non sostituisce la Dashboard Presidente V369 e non sostituisce le sezioni operative esistenti: proposta trattativa, liste trattative, comunicato squadra e scheda squadra restano attive.

## Regole operative obbligatorie

1. Nessuna funzionalita' attuale deve essere cancellata o staccata.
2. Ogni modifica deve essere mirata e reversibile.
3. Le trattative reali Firebase non vanno confuse con le simulazioni local-only.
4. `docs/zonaorientale/FUNZIONALITA'.md` non deve essere modificato senza richiesta esplicita.
5. Per gli zip di consegna, includere sempre entrambe le cartelle `zonaorientale` e `docs`.
6. Considerare che lo zip scaricato dall'utente in `Download` risulta gia' decompresso.
7. Nei comandi di applicazione zip mostrare solo le due righe `cp -R` richieste dall'utente.

## Aree da proteggere

- Home pubblica e navigazione desktop/mobile.
- Area Presidente.
- Centro notifiche presidente V370.
- Dashboard Presidente V369.
- Trattative reali Firebase.
- Simulatore trade V255 e azioni locali V349.
- Pannello QA V358/V361/V362/V363.
- Fix persistenza simulazioni target V364.
- Stabilizzazione protetta V365.
- Hardening dominio trattative/notifiche V366.
- Smoke test automatici V367.
- Dashboard pubblicazione Admin V368.
- Listone e player.html.
- Rose e snapshot statici.
- Competizioni e competition.html.
- Calciomercato e archivi statici.
- Comunicati/news.

## Modifiche V370

- `index.html`: cache-buster e footer aggiornati a V370.
- `competition.html`: cache-buster e footer aggiornati a V370.
- `player.html`: cache-buster e footer aggiornati a V370.
- `assets/app.js`: `DEPLOY_EXPECTED_VERSION_V181` aggiornato a `370`.
- `assets/app.js`: aggiunto `window.ZonaOrientalePresidentNotificationCenterV370`.
- `assets/app.js`: inserito Centro notifiche presidente in Area squadra tramite wrapper conservativo di `renderUserAreaApprovedV119`.
- `assets/app.js`: il Centro notifiche usa dati gia' disponibili e non crea nuove collection.
- `assets/app.js`: l'unica scrittura introdotta e' locale/localStorage per acknowledge di esiti gia' letti.
- `tools/audit-president-dashboard-v369.mjs`: reso compatibile con runtime V370+.
- `tools/audit-president-notification-center-v370.mjs`: nuovo audit V370.
- `tools/check-zonaorientale.sh`: aggiunto richiamo all'audit V370.
- Documentazione corrente aggiornata.

## Verifica consigliata dopo applicazione

1. Aprire la home e controllare footer V370.
2. Eseguire `bash static/zonaorientale/tools/check-zonaorientale.sh` dalla repo.
3. Login come presidente approvato.
4. Aprire `Area squadra`.
5. Verificare che appaiano Dashboard Presidente V369 e Centro notifiche V370.
6. Verificare che sotto restino presenti proposta trattativa, trattative inviate/ricevute e comunicato squadra.
7. Provare i pulsanti del Centro notifiche verso trattative e nuova proposta.
8. Rieseguire test trattativa Admin -> presidente -> Accetta/Rifiuta.
9. Login Admin e verificare che il Cruscotto pre-deploy V368 resti presente.
10. Aprire `competition.html` e `player.html`.

## Prossima fase consigliata

Pausa tecnica: testare V364-V370 nel browser reale prima di aggiungere altre feature. Dopo la verifica, la prossima release consigliata e' una manutenzione mirata su eventuali bug emersi, non una nuova funzionalita' grossa.
