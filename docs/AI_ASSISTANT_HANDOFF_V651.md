# AI Assistant Handoff V651

## Contesto

L'utente ha segnalato che ioSudo resta lento soprattutto nel caricamento di `GIOCATORI`, `RUMOR` e `UFFICIALITA`.

## Cosa e stato fatto

Creato overlay V651 solo performance, senza aggiornamento dataset.

### Modifiche tecniche

- Nuovo JS `iosudo-app-v651.js`.
- Nuovo CSS `iosudo-app-v651.css`.
- `index.html` aggiornato a V651.
- `sw.js` aggiornato a cache `iosudo-shell-v651`.
- Vista `GIOCATORI` trasformata in lista compatta: evita il calcolo completo di mercato/SOS per tutti i giocatori durante il primo caricamento.
- Scheda completa del singolo giocatore mantenuta: i dettagli profondi vengono calcolati solo quando l'utente apre il giocatore.
- `RUMOR` e `UFFICIALITA` renderizzano fonti compatte e cache HTML per le righe gia costruite.
- Limiti iniziali ridotti: 36 card per `GIOCATORI`, 40 righe per `RUMOR`/`UFFICIALITA`.
- Mantenuti handler delegati e `content-visibility` introdotti nelle versioni precedenti.

## Cosa NON e stato fatto

- Non sono stati modificati i dati V649/V23.
- Non e stata riattivata la sezione pubblica Per i SUDATORI.
- Non sono stati cambiati listoni, rose, manifest o dataset Sudatori.

## Possibile step futuro

Se anche V651 risultasse lenta su smartphone datati, il prossimo step e separare fisicamente i dati per sezione oppure precompilare un indice JSON lato build per mercato e giocatori.
