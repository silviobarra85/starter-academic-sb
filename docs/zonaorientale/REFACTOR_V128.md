# Refactor V128 - Fantamercato e trattative

Data: 2026-05-20
Branch consigliato: feature/zonaorientale-competizioni-statiche

## Obiettivo

Ridurre la crescita di `static/zonaorientale/assets/app.js` spostando funzioni pure e renderer leggeri del Fantamercato in un modulo dedicato, senza cambiare il comportamento utente.

## File nuovo

```text
static/zonaorientale/assets/js/market/transfer-market.js
```

Il modulo espone `createTransferMarketHelpersV128(ctx)` e contiene helper per:

- riconoscere squadra/presidente approvati;
- calcolare giocatori trasferibili;
- rendering badge `TRASF`;
- rendering card trattative;
- validazione proposta;
- costruzione opzioni giocatori per la form trattativa.

## Cosa resta in app.js

Restano nell'orchestratore le parti che toccano direttamente Firebase o lo stato UI globale:

- caricamento raccolte;
- salvataggio/rimozione listing;
- invio trattative;
- update/accept/reject/cancel trattative;
- override rendering pagina squadra;
- listener globali.

## Note

Questo step non cambia dati, rules o struttura Firestore. E un refactor prudente: nessuna modifica funzionale prevista.
