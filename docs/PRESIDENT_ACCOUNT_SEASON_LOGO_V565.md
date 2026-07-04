# V565 - Logo account presidente per stagione selezionata

## Problema
Il pulsante account presidente in alto era legato al `seasonTeamId` salvato nel documento `teamUsers`. Dopo il cambio logo nella stagione `2026-2027`, selezionando la stagione `2025-2026` il pulsante poteva continuare a usare il riferimento della stagione corrente oppure perdere il contesto squadra.

## Soluzione
La V565 risolve il `seasonTeam` del pulsante account in base alla stagione selezionata:

1. prova il `seasonTeamId` approvato se appartiene alla stagione selezionata;
2. cerca la stessa squadra tramite `teamId` nella stagione selezionata;
3. in fallback cerca la squadra associata allo stesso `presidentId` nella stagione selezionata;
4. solo se non trova nulla torna al record approvato.

In questo modo i loghi stagionali restano indipendenti: il logo nuovo `2026-2027` non sovrascrive quello storico `2025-2026` nella vista del presidente.

## Note dati
La patch funziona correttamente se gli snapshot storici conservano i loghi corretti. Se un export futuro sovrascrive il logo storico dentro `2025-2026.json`, va ripristinato lo snapshot storico, non il runtime.
