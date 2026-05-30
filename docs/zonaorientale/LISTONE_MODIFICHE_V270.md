# LISTONE_MODIFICHE_V270

Versione: V270 modifica listone visibile  
Data: 30/05/2026

## Obiettivo

Rendere visibili direttamente nella tabella del Listone le differenze calcolate con lo storico introdotto in V269.

## Funzionalita' aggiunte

### Colonna Modifica

Nel menu `Campi visibili` della sezione Listone e' disponibile la nuova colonna:

- `Modifica`

La colonna puo' essere mostrata o nascosta come tutte le altre colonne del listone.

Valori principali:

- `Nuovo`: giocatore presente nel listone selezionato ma non nel listone precedente.
- `Uscito`: giocatore non presente nel listone selezionato ma presente in uno dei listoni precedenti della stessa stagione.
- `+N` / `-N`: variazione della quotazione attuale rispetto al listone precedente.
- `Stato`: variazione di stato, per esempio da in listone ad asteriscato o viceversa.
- `Squadra`: cambio squadra reale.
- `Ruolo`: cambio ruolo.
- `Piu' variazioni`: piu' modifiche sulla stessa riga.
- `Invariato`: nessuna modifica rilevata.

### Giocatori usciti storici

La tabella puo' includere anche i giocatori presenti in listoni precedenti della stessa stagione ma non piu' presenti nel listone selezionato.

Per questi giocatori:

- la colonna `Modifica` mostra `Uscito`;
- la colonna `Modifica` indica anche l'ultimo listone in cui il giocatore era presente;
- la colonna `Stato` mostra `Uscito`;
- la colonna `Rosa` mostra `Non presente`.

### Toggle Mostra usciti storici

Nel blocco filtri del Listone e' disponibile il controllo:

- `Mostra usciti storici`

Se disattivato, la tabella torna a mostrare solo i giocatori del listone selezionato.

## Diagnostica

In console browser e' disponibile:

```js
window.ZonaOrientaleListoneChangesV270
```

Comandi utili:

```js
ZonaOrientaleListoneChangesV270.getHistoricalRemovedRows()
ZonaOrientaleListoneChangesV270.getVisibleRows()
ZonaOrientaleListoneChangesV270.getChangeLabel(player)
```

## Note operative

La logica V270 non modifica i JSON statici gia' pubblicati. Calcola a runtime le righe storiche usando i listoni presenti nel manifest della stagione corrente.

Il confronto per i giocatori del listone selezionato resta basato sul listone immediatamente precedente; le righe `Uscito` vengono invece cercate in tutti i listoni precedenti della stessa stagione, prendendo come riferimento l'ultimo listone in cui il giocatore risulta presente.
