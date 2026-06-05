# Refactor V350 - Cleanup simulatore trade dev V254

## Obiettivo

Eliminare il vecchio modulo dev `trade-notification-simulator-v254.js`, mantenendo il modulo canonico `trade-notification-simulator-v255.js` e la compatibilita console.

## Motivazione

Dopo V348 e V349:

- il runtime importa solo V255;
- V255 mantiene alias console V254;
- V349 gestisce localmente `Accetta` / `Rifiuta` sulle simulazioni;
- V254 non e piu necessario come file fisico.

## Rischio e mitigazione

Area a rischio: Fantamercato interno/notifiche trade.

Mitigazione:

- nessun cambio al flusso reale Firebase;
- nessun cambio al modulo V255;
- alias `ZonaOrientaleTradeSimulatorV254` preservato da V255;
- audit V350 dedicato;
- test manuale consigliato su `simulateIncomingProposal()` e azioni locali.

## File rimovibile

```text
static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js
```

Applicazione nella repo utente:

```bash
git rm --ignore-unmatch static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js
```
