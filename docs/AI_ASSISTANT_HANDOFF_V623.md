# AI Assistant Handoff V623 - ioSudo vista Giocatori completa

## Stato
Overlay V623 per ioSudo. Parte da V622 e corregge la vista globale GIOCATORI.

## Modifiche
- La vista GIOCATORI non mostra solo i giocatori presenti nelle rose Serie A del dataset Sudatori.
- Include anche i giocatori presenti in trattative e ufficialita in entrata/uscita quando non hanno ancora una scheda giocatore nel dataset.
- I giocatori provenienti solo dal mercato sono creati come schede virtuali agganciate alla squadra e alle relative fonti.
- Il click su ogni card della vista GIOCATORI apre sempre il dettaglio giocatore.
- Il dettaglio dei giocatori virtuali mostra ufficialita/trattative/fonti disponibili.

## File principali
- static/fanta-engine/js/apps/iosudo-app-v623.js
- static/fanta-engine/css/iosudo-app-v623.css
- static/iosudo/index.html
- static/iosudo/sw.js
- static/fanta-engine/tools/audit-iosudo-v623.mjs
