# AI Assistant Handoff V625 - ioSudo click dettaglio giocatore

## Stato
Overlay V625 per ioSudo. Parte dalla V624 e corregge la vista globale **GIOCATORI**: le card create in quella vista ora aprono sempre il dettaglio giocatore.

## Problema risolto
Nella vista GIOCATORI le card venivano renderizzate correttamente con `data-player-id`, ma dopo il rendering della vista globale non veniva rieseguito il binding dei click. Di conseguenza card come Caprile o Danilho Doekhi sembravano cliccabili ma non aprivano nulla.

## Modifiche
- `renderGlobalView()` richiama ora `bindCards()` dopo aver scritto la lista in pagina.
- Le card nella vista GIOCATORI aprono `renderPlayerDetail()` sia per giocatori reali sia per giocatori virtuali generati da trattative/ufficialita.
- Il dettaglio giocatore continua a mostrare informazioni disponibili, link/fonti mercato, ufficialita, rumors e SOS/infortuni.
- Nessuna modifica ai dati Sudatori/Excel: e una correzione solo runtime ioSudo.

## File principali
- static/fanta-engine/js/apps/iosudo-app-v625.js
- static/fanta-engine/css/iosudo-app-v625.css
- static/iosudo/index.html
- static/iosudo/sw.js
- static/fanta-engine/tools/audit-iosudo-v625.mjs
