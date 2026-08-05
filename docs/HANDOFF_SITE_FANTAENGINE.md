# Handoff sito e FantaEngine

## Overlay V787

V787 corregge la visualizzazione delle rose dopo V786. Le rose continuano a usare l'ultimo listone della stagione, ma ora ogni renderer riceve esplicitamente il record sincronizzato e le schede gia aperte vengono aggiornate quando termina il caricamento asincrono dei listoni.

## Regola canonica rose/listone

- Helper condiviso: `static/fanta-engine/js/core/roster-listone-sync-v787.js`.
- Gli ID Fantacalcio non sono chiavi identita e possono cambiare tra listoni.
- Matching primario: nome normalizzato; la vecchia squadra serve solo a disambiguare omonimi e non blocca un trasferimento.
- Per i presenti vengono aggiornati a runtime: squadra reale, denominazione squadra, ruolo Classic, ruoli Mantra, quotazioni, FVM, ID e link Fantacalcio.it.
- Per gli assenti o ceduti: badge `Asteriscato`; il giocatore resta nella fantasquadra con costo e storico.
- Il listone storico selezionato nella schermata Listone non modifica le rose.

## Correzioni V787

- Gli eventi `fanta:public-core-ready-v760` e `fanta:static-assets-ready-v760` sono emessi su `window`; V787 li ascolta sullo stesso oggetto. Questo elimina schede squadra ferme ai dati dello snapshot, come Sohm ancora Bologna invece di Venezia.
- `renderRosterPlayerTable` e `renderTeamProfileContentV42` ricevono sempre copie sincronizzate dei giocatori.
- Il sort del ruolo usa un rank numerico canonico: `P=1`, `D=2`, `C=3`, `A=4`.
- Aprendo una fantasquadra o una nuova card nella pagina Rose, il sort iniziale viene riportato a ruolo crescente; l'utente puo poi usare gli ordinamenti esistenti.
- Cache-buster di `assets/app.js`, footer runtime e release ZonaOrientale sono aggiornati a V787.

## Funzionalita preservate

- Nessuna modifica ai file rosa o snapshot: i dati del listone vengono applicati a runtime.
- Nessuna modifica a costi d'asta, saldi FM, movimenti, competizioni, Firebase, EmailJS, Admin o storico listoni.
- Nessuna cancellazione di giocatori asteriscati.
- ioSudo resta in manutenzione V787; i dati V782 restano disponibili.
