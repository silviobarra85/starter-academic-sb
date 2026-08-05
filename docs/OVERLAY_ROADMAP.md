# Roadmap overlay

## Stato V786

- ioSudo resta temporaneamente disattivato tramite pagina `Site under construction` V786.
- I dati ioSudo V782 restano conservati in `static/fanta-engine/data/sudatori/current/`.
- Il listone condiviso corrente della stagione `2026-2027` resta `2026-08-05`; il `2026-07-04` resta storico e selezionabile.
- Le rose di ZonaOrientale e FantaMantraManager vengono ora sincronizzate sempre con l'ultimo listone della stagione selezionata.
- Il listone storico scelto nella schermata Listone non modifica lo stato dei giocatori delle rose.
- Un giocatore trovato nell'ultimo listone riceve il badge `In listone`; un giocatore non trovato o presente tra i ceduti/asteriscati riceve il badge `Asteriscato` e resta comunque nella rosa.
- Ruoli, ruoli Mantra, squadra reale, quotazione e link Fantacalcio.it delle rose vengono letti dall'ultimo listone della stagione; il costo d'asta e l'appartenenza alla fantasquadra restano invariati.

## Verifiche successive

- Controllare le 10 rose ZonaOrientale: 210 giocatori risultano `In listone` e 20 `Asteriscato` rispetto al listone del 05/08/2026.
- Verificare lo stesso comportamento nelle schede squadra, nell'Area squadra e nelle future rose FantaMantraManager.
- Quando viene pubblicato un nuovo listone, conservarne sempre le versioni precedenti nel manifest: la sincronizzazione delle rose userà automaticamente il più recente della stagione.
- Alla riattivazione di ioSudo, rifare il matching completo sul listone corrente senza riutilizzare alla cieca gli ID della versione precedente.
