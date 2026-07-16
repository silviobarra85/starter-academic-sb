# AI Assistant Handoff V702

Ambito: ioSudo.

Correzione: modulo e allenatore erano `n.d.` perché venivano cercati nel record `teams`, mentre il dataset li conserva nelle righe di `formationsByTeam`. La V702 aggiunge `teamFormationMeta`, `teamModuleText` e `teamCoachText` e li usa nelle card squadra, nel pannello squadra e nel pitch.

Non sono stati modificati `sudatori-data.json`, sito, rose o listoni.
