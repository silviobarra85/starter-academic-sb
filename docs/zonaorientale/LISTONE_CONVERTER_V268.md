# Convertitore listone Excel - V268

## Obiettivo

La V268 rende il convertitore `Admin -> Converti listone Excel` compatibile con due formati Excel:

1. **Formato storico Fantacalcio** con fogli `Tutti` e `Ceduti`.
2. **Formato Classic a foglio singolo**, per esempio il file `Lista calciatori` con intestazioni:

```text
#, Nome, Fuori lista, Sq., Under, R., R.MANTRA, PGv, MV, FM, FVM/1000, QUOT., FantaSquadra, Costo
```

## Formato storico mantenuto

Se il workbook contiene i fogli `Tutti` e/o `Ceduti`, il convertitore continua a usare il comportamento precedente:

- `Tutti` -> `statusCode: IN_LISTONE`
- `Ceduti` -> `statusCode: ASTERISCATO`

## Nuovo formato supportato

Se i fogli `Tutti`/`Ceduti` non esistono o non producono righe valide, il convertitore cerca automaticamente il foglio con piu' righe riconoscibili e colonna `Nome`.

Mappatura principale:

| Colonna Excel | Campo JSON |
| --- | --- |
| `#` | `fantacalcioId` |
| `Nome` | `playerName` |
| `Sq.` | `realTeam` |
| `R.` | `classicRole` |
| `R.MANTRA` | `mantraRoles` |
| `QUOT.` | `quotationCurrent` |
| `FVM/1000` | `fvm` |
| `FantaSquadra` | `fantasyRoster` |
| `Costo` | `rosterCost` |
| `Fuori lista` | stato giocatore |

## Stato giocatore

Nel formato a foglio singolo:

- `Fuori lista` vuoto, `0`, `no`, `false`, `-` -> `IN_LISTONE`
- `Fuori lista` valorizzato -> `ASTERISCATO`

## Report Admin

Dopo la conversione il pannello mostra:

- formato riconosciuto;
- fogli usati;
- numero giocatori totali;
- numero in listone;
- numero asteriscati;
- voce manifest da copiare.

## Diagnostica

In console e' disponibile:

```js
window.ZonaOrientaleListoneConverterV268
```

## Note operative

La conversione resta browser-only:

- non scrive su Firebase;
- scarica un JSON locale;
- richiede ancora di copiare il file in `static/zonaorientale/assets/listoni/`;
- richiede ancora di aggiornare `static/zonaorientale/assets/listoni/manifest.json`.

## Test consigliato

1. Admin -> Converti listone Excel.
2. Caricare un vecchio file con fogli `Tutti`/`Ceduti`.
3. Verificare righe > 0.
4. Caricare un file Classic con foglio `Lista calciatori`.
5. Verificare righe > 0.
6. Verificare report formato e fogli usati.
7. Scaricare JSON e aprirlo per controllare `players`.


## Aggiornamento V269

Il convertitore resta compatibile con i formati V268, ma quando e' disponibile un listone precedente arricchisce il JSON con storico e confronto. Dettagli in `LISTONE_STORICO_V269.md`.
