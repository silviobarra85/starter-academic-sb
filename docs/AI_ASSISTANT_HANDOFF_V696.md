# AI Assistant Handoff V696

V696 corregge i duplicati della sezione GIOCATORI di ioSudo dopo il file `iosudo_giocatori_duplicati(1).xlsx`.

Principio operativo:
- mantenere GIOCATORI leggero;
- non mostrare giocatori solo-rumor;
- deduplicare varianti nome/cognome tra dati squadra e listone;
- preferire la scheda reale/ufficiale alla voce solo-listone;
- mantenere SOS solo se realmente presente nel dataset infortuni/SOS.

Nota: le fonti web sono state usate solo per verifiche mirate sui casi ambigui più significativi. La regola applicata nel codice è conservativa e non fonde giocatori con iniziali discordanti nello stesso ruolo/squadra.
