# AI Assistant Handoff Current - V575

Versione corrente overlay: V575 - Tabelle giocatori mobile con classi runtime dedicate.

## Stato
- Calciomercato resta disattivato.
- Svincola Giocatori ZonaOrientale resta attivo.
- Logo account presidente per stagione resta preservato.
- Resize colonne V570/V571 resta non caricato.
- Tabelle mobile giocatori gestite da CSS/JS V575.

## Nota tecnica
V574 era solo CSS e poteva non agganciare correttamente tabelle generate dopo il render o con classi/strutture diverse. V575 aggiunge un micro-script che marca runtime le tre famiglie di tabelle:
- Area Squadra / Dashboard Presidente: `fanta-player-table-v575-teamarea`
- Rose: `fanta-player-table-v575-rose`
- Listone: `fanta-player-table-v575-listone`

Ogni famiglia ha stile separato ma identico alla resa Listone mobile.
