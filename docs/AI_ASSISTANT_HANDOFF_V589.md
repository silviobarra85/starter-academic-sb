# AI Assistant Handoff V589

## Obiettivo
Correggere la colonna `Rosa` del Listone: deve essere ricalcolata dalle rose statiche pubblicate in `assets/rose`, non dal campo `fantasyRoster` eventualmente rimasto nel JSON del listone.

## Modifica
La funzione `enrichListoneWithRosters` ora sovrascrive sempre `fantasyRoster`, `rosterRole` e `rosterCost` usando la rosa della stagione selezionata. Se il giocatore non è presente nella rosa statica, viene mostrato come `Svincolati`.

## Preservato
- Rose GitHub fonte primaria V588.
- Sync manuale rosterEntries, non automatico.
- Calciomercato disattivato.
- Svincola Giocatori attivo.
- Link giocatore e Listone invariati.
