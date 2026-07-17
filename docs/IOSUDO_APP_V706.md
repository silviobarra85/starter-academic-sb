# ioSudo App V706

V706 aggiorna ioSudo con i dati dell'Excel v57 e aggiunge le schede amichevole cliccabili.

## Novita UI

- Le card amichevole sono ora cliccabili sia nella vista globale `AMICHEVOLI` sia nella scheda squadra, tab `Amichevoli`.
- Il click apre una scheda riepilogo con evento, data, luogo, stato, fonte, risultato e marcatori quando disponibili.
- Se il foglio `Amichevoli_Giocatori` contiene il tabellino, ogni giocatore ha badge per:
  - minuti giocati;
  - titolare/subentrato/non impiegato;
  - gol;
  - autogol;
  - infortunio gara.

## Dati tabellino inclusi

- `Sassuolo-Alta Anaunia`, 16/07/2026, risultato `22-1`.
- 26 righe giocatore/evento incluse nel dettaglio.
- Nessun infortunio gara rilevato dal tabellino ufficiale.

## Dati e deduplica

- Duplicati esatti giocatori non presenti.
- Un caso di stesso nome con ruoli diversi (`Genoa / Calvani`) non e stato deduplicato automaticamente: gli ID sono stati resi univoci per evitare collisioni UI.
- La riga storica/superata `Juventus / Khephren Thuram` e stata esclusa dagli infortuni attivi.
- Le varianti duplicate delle trattative sono state consolidate in modo conservativo.
