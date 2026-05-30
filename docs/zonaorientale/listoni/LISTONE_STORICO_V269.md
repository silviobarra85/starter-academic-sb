# Storico e confronto listoni - V269

La V269 aggiunge due funzioni al sistema listoni senza rimuovere il supporto V268 ai due formati Excel:

- formato storico con fogli `Tutti` e `Ceduti`;
- formato Classic a foglio singolo con colonna `Nome` e quotazione `QUOT.`.

## Confronto con listone precedente

Quando l'admin usa `Admin -> Converti listone Excel`, il sito cerca il listone precedente della stessa stagione gia' presente in `state.listoni`. Se lo trova, il JSON scaricato viene arricchito con:

```json
{
  "meta": {
    "parserVersion": "V269",
    "comparedWith": "2026-05-21",
    "changeSummary": {
      "newPlayers": 3,
      "removedPlayers": 2,
      "quotationUp": 10,
      "quotationDown": 8,
      "statusChanged": 1
    }
  },
  "history": {
    "removedSincePrevious": []
  }
}
```

Ogni giocatore del listone corrente puo' includere campi come:

```json
{
  "previousQuotationCurrent": 18,
  "quotationDiffFromPrevious": 2,
  "previousStatus": "In listone",
  "statusChange": "QUOTATION_CHANGED",
  "previous": {},
  "diff": {}
}
```

## Ricerca storica

Nella sezione pubblica `Listone` compare il pannello `Storico listoni`. Il campo ricerca continua a filtrare il listone selezionato, ma con la checkbox `Cerca anche negli altri listoni` cerca lo stesso testo anche nei listoni precedenti della stagione corrente.

Questo permette di trovare un giocatore che non e' piu' nel listone attuale ma era presente in un listone passato.

## Matching giocatori

La priorita' di matching e':

1. `fantacalcioId` / colonna `#`;
2. nome normalizzato + squadra reale;
3. nome normalizzato + ruolo;
4. solo nome normalizzato.

In caso di omonimie il risultato va controllato manualmente confrontando squadra e ruolo.

## Diagnostica

In console browser:

```js
window.ZonaOrientaleListoneHistoryV269
window.ZonaOrientaleListoneHistoryV269.getSelectedComparison()
window.ZonaOrientaleListoneHistoryV269.searchHistorical("nome giocatore")
```

## Regressioni da evitare

Non rimuovere:

- supporto al formato `Tutti`/`Ceduti`;
- supporto al formato Classic a foglio singolo;
- ricerca base sul listone selezionato;
- integrazione rose/listone per distinguere giocatori in rosa e svincolati.
