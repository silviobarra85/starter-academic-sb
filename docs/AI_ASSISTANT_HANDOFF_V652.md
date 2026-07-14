# AI Assistant Handoff V652

## Contesto

Dopo V651 l'app ioSudo e diventata veloce nel passaggio tra sezioni, ma il click sul dettaglio di un giocatore risultava lento.

## Diagnosi

V651 aveva alleggerito le liste `GIOCATORI`, `RUMOR` e `UFFICIALITA` spostando il calcolo approfondito nel dettaglio giocatore. Il dettaglio, pero, continuava a chiamare `attachMarketRowsForPlayer`, che scansionava tutte le righe mercato e per ogni riga cercava il giocatore corrispondente con `findPlayerForMarketRow`. Su smartphone questo diventava costoso: righe mercato moltiplicate per molti giocatori.

## Cosa e stato fatto

Creato overlay V652 solo performance dettaglio giocatore, senza aggiornamento dataset.

### Modifiche tecniche

- Nuovo JS `iosudo-app-v652.js`.
- Nuovo CSS `iosudo-app-v652.css` derivato da V651.
- `index.html` aggiornato a V652.
- `sw.js` aggiornato a cache `iosudo-shell-v652`.
- Aggiunta cache `playerDetailCache` per il modello del dettaglio giocatore.
- Aggiunta cache `playerMarketRowsCache` per le righe mercato associate al singolo giocatore.
- `attachMarketRowsForPlayer` non usa piu la ricerca pesante `findPlayerForMarketRow` su ogni riga: ora filtra direttamente le righe mercato con il giocatore gia noto.
- Il dettaglio calcola una sola volta ufficialita, rumor, SOS, formazione e ultimo aggiornamento.
- Le liste veloci di V651 restano invariate.

## Cosa NON e stato fatto

- Non sono stati modificati i dati V649/V23.
- Non e stata riattivata la sezione pubblica Per i SUDATORI.
- Non sono stati cambiati listoni, rose, manifest o dataset Sudatori.
- Non e stata ridotta la quantita di informazioni nel dettaglio giocatore.

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v652.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v652.js
node --check static/iosudo/sw.js
```

## Possibile step futuro

Se su dispositivi molto lenti il primo click resta percepibile, il passo successivo e precompilare un indice JSON lato build `player -> righe mercato`, evitando completamente il matching nel browser.
