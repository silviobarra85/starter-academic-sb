# ioSudo App V642

Correzione bug: cliccando su GIOCATORI appariva "Non riesco a mostrare la vista giocatori".

Causa: nella V640 la funzione `playerSourceText` chiamava `injuriesForPlayer(player)`, ma l'helper non era definito.

Soluzione: aggiunto helper centralizzato che recupera gli infortuni/SOS collegati al giocatore, anche per giocatori provenienti da listone o da righe mercato.
