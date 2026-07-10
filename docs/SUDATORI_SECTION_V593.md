# Sezione standalone Per i SUDATORI - V593

La V593 aggiunge una visualizzazione grafica della probabile formazione su campetto e migliora il matching tra rose Serie A e listone.

## Campetto probabile formazione
Per ogni squadra selezionata, sotto la tabella della rosa appare una card **Probabile formazione** con:
- modulo previsto;
- allenatore;
- giocatori disposti per linee;
- clic sul giocatore per aprire la scheda dettagliata.

La disposizione usa `formationPosition` quando presente e ricade sul ruolo in caso di posizioni incomplete.

## Matching listone
Il matching usa l'ultimo listone dichiarato nei dati Sudatori:

```text
2026-07-04.json
```

La V593 gestisce differenze frequenti tra nomi:
- trattini e spazi;
- accenti;
- suffissi o iniziali;
- ordine dei token;
- confronto con squadra Serie A e ruolo.

Esempio risolto:

```text
Milinkovic-Savic -> Milinkovic-Savic V.
```

## Output dati
Nel manifest sono registrati:
- giocatori listone trovati;
- giocatori non trovati;
- metodi di matching usati.

## Standalone
La sezione resta rimovibile e non scrive dati operativi.
