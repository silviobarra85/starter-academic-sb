# AI Assistant Handoff V652

## Contesto

Dopo V651 l'app ioSudo e diventata veloce nel passaggio tra sezioni, ma il click sul dettaglio di un giocatore risultava lento.

## Diagnosi

La lentezza era dovuta al fatto che V651 aveva spostato il calcolo pesante dalle liste al dettaglio. In particolare `attachMarketRowsForPlayer` scansionava tutte le righe di mercato e per ogni riga cercava il giocatore corrispondente con una ricerca globale.

## Cosa e stato fatto

- Nuovo JS `iosudo-app-v652.js`.
- Nuovo CSS `iosudo-app-v652.css`.
- `index.html` aggiornato a V652.
- `sw.js` aggiornato a cache `iosudo-shell-v652`.
- Aggiunta cache `playerDetailCache`.
- Aggiunta cache `playerMarketRowsCache`.
- Dettaglio giocatore calcolato una sola volta e poi riusato.
- Matching mercato-giocatore reso diretto e leggero nel dettaglio.

## Cosa NON e stato fatto

- Non sono stati modificati i dati.
- Non e stata riattivata la sezione pubblica Per i SUDATORI.
- Non sono stati rimossi dettagli dalle schede giocatore.

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v652.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v652.js
node --check static/iosudo/sw.js
```
