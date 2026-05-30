# V280 - Confronto manuale tra due listoni

## Obiettivo

V280 aggiunge nella sezione pubblica `Listone`, dentro il pannello `Storico listoni`, un confronto manuale tra due snapshot listone qualsiasi della stagione corrente.

La funzione non scrive su Firebase, non modifica JSON statici e non sostituisce il confronto automatico V269/V270 con il listone precedente.

## Comportamento utente

Nel pannello `Storico listoni` compare la sezione `Confronto manuale tra due listoni` con due selettori:

- `Listone da analizzare`: listone base, cioe' quello su cui leggere nuovi, aumenti e diminuzioni.
- `Confronta con`: listone di riferimento.

Il riepilogo mostra:

- listone base;
- listone di confronto;
- nuovi;
- usciti;
- aumenti quotazione;
- diminuzioni quotazione;
- cambi stato;
- cambi squadra/ruolo.

La tabella mostra le differenze principali con colonne:

```text
Modifica, Giocatore, Ruolo, Sq, Qt.A, Qt.A confronto, Diff., Stato
```

Per evitare pannelli troppo pesanti, l'anteprima visualizza fino a 80 differenze e indica quando esistono ulteriori righe.

## Regole tecniche

- Usa `buildListoneComparisonV269` anche per il confronto manuale.
- Usa le normalizzazioni squadra gia' consolidate in V273/V274, quindi il confronto evita falsi cambi squadra tra nomi estesi e sigle.
- Usa `getHistoryChangeStatusV270` e `renderListoneModificationCellV270` quando disponibili, cosi' la semantica della colonna `Modifica` resta coerente.
- I giocatori usciti vengono resi come righe storiche con `historyChange: REMOVED`.
- La diagnostica runtime e' `window.ZonaOrientaleListoneManualCompareV280`.

## Test consigliati

1. Aprire `Listone`.
2. Aprire il pannello `Storico listoni`.
3. Verificare la sezione `Confronto manuale tra due listoni`.
4. Selezionare due listoni diversi.
5. Verificare riepilogo e tabella differenze.
6. Selezionare due date invertite e controllare che nuovi/usciti si invertano coerentemente.
7. Verificare che filtro `Modifiche`, ricerca, ruoli, stato, `Mostra usciti storici` ed export CSV V278 continuino a funzionare.
8. Console browser:

```js
window.ZonaOrientaleListoneManualCompareV280
window.ZonaOrientaleListoneManualCompareV280.getRows()
```

## File runtime toccati

```text
assets/app.js
assets/styles.css
index.html
competition.html
player.html
```

## Note di compatibilita'

Il confronto manuale e' solo UI/runtime: non richiede rigenerazione dei listoni e non cambia il formato JSON prodotto dal convertitore Excel.
