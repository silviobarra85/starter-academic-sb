# Handoff sito e FantaEngine

## Overlay V786

V786 rende permanente nel FantaEngine la sincronizzazione tra rose delle fantasquadre e ultimo listone disponibile per la stagione selezionata. Preserva il listone storico, il nuovo listone del 05/08/2026 e la manutenzione ioSudo.

## Regola canonica rose/listone

- Helper condiviso: `static/fanta-engine/js/core/roster-listone-sync-v786.js`.
- Le identità vengono abbinate tramite nome normalizzato; gli ID Fantacalcio non sono chiavi identità perché possono cambiare normalmente tra listoni.
- Per ogni stagione viene scelto il listone con `loadedAt/id` più recente, indipendentemente dalla versione storica selezionata nella pagina Listone.
- Se il giocatore è presente e attivo: badge `In listone`.
- Se non è presente, oppure è marcato ceduto/asteriscato: badge `Asteriscato`.
- Un asteriscato non viene eliminato dalla rosa: conserva costo, fantasquadra e storico.
- Per i giocatori presenti vengono aggiornati a runtime squadra reale, ruolo Classic, ruoli Mantra, quotazione, FVM, ID e link Fantacalcio.it.

## Siti coperti

La regola è installata nello stesso modo in:

- `static/zonaorientale/assets/app.js`;
- `static/fantapetillomantramanager/assets/app.js`.

Vale nelle rose pubbliche, nelle schede squadra, nell'Area squadra e nelle funzioni che leggono `getRosterForSeasonTeam`. Il listone storico continua invece a mostrare i dati propri della versione scelta.

## Stato dati 2026-2027

- Listone corrente: `2026-08-05.json`, 494 giocatori.
- Listone storico: `2026-07-04.json`, ancora selezionabile.
- Rose statiche ZonaOrientale: 230 giocatori; 210 presenti nell'ultimo listone e 20 asteriscati.
- FantaMantraManager usa la stessa regola anche quando le rose arriveranno da Firebase o da futuri snapshot statici.

## Funzionalità preservate

- Nessuna cancellazione di giocatori dalle rose.
- Nessuna modifica a costi d'asta, saldi FM, movimenti, competizioni, Firebase o EmailJS.
- Selettore storico listoni, filtri, ordinamenti, ruoli e link continuano a funzionare.
- ioSudo resta in manutenzione V786; i dati V782 non vengono cancellati.
