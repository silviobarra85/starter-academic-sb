# AI Assistant Handoff V624 - ioSudo GIOCATORI deduplicati

## Stato
Overlay V624 per ioSudo. Parte dalla V623 e corregge la vista globale **GIOCATORI**.

## Modifiche
- Ogni giocatore compare una sola volta nella vista GIOCATORI.
- Le voci mercato su un giocatore gia presente in una squadra reale vengono agganciate alla scheda reale, anche se la trattativa e registrata sotto un'altra squadra.
- Esempio atteso: Muharemovic compare una sola volta, come giocatore del Sassuolo, con le trattative/rumors collegati nel dettaglio.
- Per le voci mercato senza scheda Serie A esistente resta la scheda virtuale, ma la chiave non dipende piu dalla squadra target: nome + ruolo.
- La card compatta mostra nome, ruolo, squadra reale attuale, squadra fantasy o trattino, badge mercato/SOS, ultimo aggiornamento e presenza nel listone recente.
- Il dettaglio giocatore mostra anche le fonti/links collegati a quel giocatore.

## File principali
- static/fanta-engine/js/apps/iosudo-app-v624.js
- static/fanta-engine/css/iosudo-app-v624.css
- static/iosudo/index.html
- static/iosudo/sw.js
- static/fanta-engine/tools/audit-iosudo-v624.mjs
