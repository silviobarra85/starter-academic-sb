# Funzionalita V384 - Soccer Data table cleanup

Documento additivo di release. Non sostituisce e non modifica `FUNZIONALITA'.md`.

## Soccer Data

- Sezione sempre read-only.
- Mapping dati invariato: `fbref-player-map.v383.json`.
- La tabella usa ora `FBref / Giocatore` come prima colonna.
- Il nome FBref, quando disponibile, e il link cliccabile principale.
- Il nome del listone resta visibile come dettaglio secondario per tracciabilita.
- La vecchia colonna `Azione` e stata rimossa dalla tabella principale.
- I pulsanti `Cerca FBref` e `Copia riga` restano disponibili solo dentro la cella dei giocatori da associare/needs-review.
- Aggiunta colonna `Stato mapping` per distinguere rapidamente confermati e da associare.

## Garanzie di non regressione

- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessun cambio al caricamento listoni.
- Nessun cambio al mapping V383.
- Nessuna modifica a `FUNZIONALITA'.md`.
- Le funzioni di export/copia CSV restano attive.
