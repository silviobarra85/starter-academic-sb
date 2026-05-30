# V273 - Test end-to-end Listone con Excel reale

## Scopo

Verificare il flusso introdotto in V268-V270 usando il file reale:

`lista_calciatori_lista calciatori_classic_zonaorientale-salerno.xlsx`

Il test riguarda:

- riconoscimento formato Excel Classic a foglio singolo;
- conversione giocatori;
- conteggi `in listone` / `asteriscati`;
- confronto con il listone statico precedente `2026-05-15`;
- colonna `Modifica` e differenze riga-per-riga;
- prevenzione regressioni nel confronto squadre reali.

## Esito test

| Controllo | Esito |
|---|---:|
| Foglio riconosciuto | `Lista calciatori` |
| Formato riconosciuto | Fantacalcio Classic a foglio singolo |
| Righe giocatore convertibili | 663 |
| Giocatori in listone | 532 |
| Giocatori asteriscati | 131 |
| Giocatori con quotazione `QUOT.` valida | 663 |
| Giocatori con `FantaSquadra` valorizzata | 299 |
| Listone precedente usato per confronto | `2026-05-15` |
| Giocatori comuni per `fantacalcioId` | 661 |
| Nuovi giocatori | 2 |
| Giocatori usciti rispetto al precedente | 0 |
| Quotazioni aumentate | 96 |
| Quotazioni diminuite | 120 |
| Quotazioni invariate | 445 |
| Cambi ruolo | 0 |
| Cambi squadra dopo normalizzazione | 0 |
| Cambi stato | 1 |

## Giocatori nuovi rilevati

- Mikolajewski - Parma - Qt.A 2
- Mosconi - Inter - Qt.A 1

## Correzione introdotta in V273

Il test ha evidenziato un possibile falso positivo: il listone precedente usa spesso sigle squadra (`ATA`, `BOL`, `INT`, ...), mentre il nuovo Excel Classic usa nomi estesi (`Atalanta`, `Bologna`, `Inter`, ...).

Senza normalizzazione, il confronto avrebbe potuto indicare falsamente molti cambi squadra.

V273 aggiunge una normalizzazione delle squadre reali nel confronto listoni, così:

- `Atalanta` = `ATA`
- `Bologna` = `BOL`
- `Inter` = `INT`
- `Milan` = `MIL`
- ecc.

La correzione riguarda solo il confronto storico/listone e non cambia la visualizzazione originaria dei dati.

## Diagnostica runtime

In console:

```js
window.ZonaOrientaleListoneE2ETestV273
```

Funzione utile:

```js
ZonaOrientaleListoneE2ETestV273.normalizeRealTeam("Atalanta")
```

Risultato atteso:

```text
ata
```

## Test browser consigliati

1. Aprire `Listone`.
2. Abilitare la colonna `Modifica` da `Campi visibili`.
3. Verificare che le variazioni `+N` / `-N` siano visibili.
4. Verificare che non compaiano cambi squadra di massa dovuti a sigle vs nomi estesi.
5. Aprire `Admin -> Converti listone Excel`.
6. Caricare il file Excel reale.
7. Verificare che il report mostri più di 0 giocatori.
8. Scaricare il JSON e verificare che contenga giocatori, meta e confronto storico quando disponibile.

## Nota funzionale

V273 non modifica `FUNZIONALITA'.md`. Se si consolida un registro unico, questa funzionalità va tracciata sotto:

- Admin -> Converti listone Excel
- Pubblico -> Listone
- Sviluppo/Test -> Test end-to-end listone
