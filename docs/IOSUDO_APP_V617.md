# V617 - ioSudo aggiornato ai dati mercato/fonti extra v2

ioSudo non ha un dataset separato: legge `static/fanta-engine/data/sudatori/current/manifest.json` e `sudatori-data.json`.

## Aggiornamenti

- Dati sincronizzati con Per i SUDATORI V617.
- Aggiunte 7 nuove fonti e 10 nuove righe trattative provenienti dal nuovo Excel.
- Mantenuti i fix già presenti: campetto con moduli a quattro linee, fonti mercato separate/cliccabili, card squadra colorate, dettaglio giocatore e colori ruolo.

Non è necessario reinstallare la PWA: dopo il deploy basta chiudere e riaprire l'app; se resta cache vecchia, fare refresh dal browser.

Le card mercato di ioSudo ricevono già i dati deduplicati per alias/cognome.
