# V278 - Export modifiche listone

## Scopo

La V278 aggiunge al Listone un export CSV delle modifiche rilevate rispetto allo storico/listone precedente, senza modificare dati Firebase o JSON statici.

## Funzionalita'

Nella sezione `Listone`, accanto ai filtri, e' disponibile il pulsante:

```text
Esporta modifiche CSV
```

Il file esportato contiene le righe modificate secondo la logica gia' introdotta in V269/V270/V277:

- nuovi giocatori;
- giocatori usciti storici;
- variazioni di quotazione;
- cambi stato;
- cambi squadra;
- cambi ruolo;
- piu' variazioni combinate.

Se il filtro `Modifiche` e' impostato su `Tutte le modifiche`, l'export scarica solo le righe effettivamente modificate. Se invece e' selezionato un filtro specifico, ad esempio `Solo nuovi` o `Solo usciti`, l'export rispetta il filtro corrente.

## Colonne del CSV

```text
Listone
Modifica
Giocatore
Ruolo
Squadra
Stato
Qt.A
Qt.A precedente
Diff Qt.A
Ultimo/precedente listone
FantaSquadra
Costo
Fantacalcio ID
```

## Compatibilita'

La V278 usa i dati runtime gia' calcolati da:

- V269 storico/confronto listoni;
- V270 colonna `Modifica` e usciti storici;
- V277 filtro `Modifiche`.

Non richiede modifiche al formato dei JSON e non scrive su Firebase.

## Diagnostica console

```js
window.ZonaOrientaleListoneExportV278
window.ZonaOrientaleListoneExportV278.getRows()
window.ZonaOrientaleListoneExportV278.buildCsv()
window.ZonaOrientaleListoneExportV278.exportCsv()
```

## Test consigliato

1. Aprire `Listone`.
2. Abilitare la colonna `Modifica` da `Campi visibili`.
3. Usare il filtro `Modifiche`.
4. Cliccare `Esporta modifiche CSV`.
5. Verificare che il CSV scaricato contenga solo righe coerenti con il filtro selezionato.
