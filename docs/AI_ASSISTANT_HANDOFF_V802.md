# AI Assistant Handoff - ZonaOrientale V802

## Obiettivo
V802 introduce una gestione manuale completa delle rose nell'Admin e rende le correzioni persistenti nel flusso snapshot static-first.

## Regola dati
- `assets/rose` resta la baseline pubblica GitHub.
- `rosterEntries` Firebase e' un overlay amministrativo:
  - `ACTIVE`: aggiunge, modifica o sposta un giocatore;
  - `REMOVED`: rimuove il giocatore dalla rosa effettiva senza riscrivere la baseline.
- In Admin la rosa effettiva e' `baseline statica + overlay Firebase`.
- Il pubblico continua a usare la baseline statica finche non viene applicato un nuovo overlay snapshot.

## Funzionalita Admin
Pannello `Modifica manualmente le rose`:
- selezione stagione e fantasquadra;
- ricerca nei listoni storici della stagione;
- caricamento valori da un listone storico;
- inserimento giocatore da zero;
- modifica di nome, ID Fantacalcio, squadra reale, ruoli Classic/Mantra, costo, quotazioni, FVM, stato listone e note;
- spostamento verso altra rosa cambiando `Rosa destinazione`;
- eliminazione sicura tramite tombstone `REMOVED`;
- protezione dai duplicati dello stesso giocatore nella stagione.

Le correzioni manuali NON generano movimenti FM. Acquisti, vendite, scambi e svincoli economici restano nel flusso Movimenti FM.

## Persistenza snapshot
Il comando Admin gia' esistente `Scarica overlay snapshot stagioni` e' esteso in V802:
- continua a esportare `assets/snapshots/seasons/manifest.json` e snapshot stagione;
- aggiunge anche `assets/rose/manifest.json` e un nuovo JSON rose generato dalla rosa effettiva;
- applicando lo zip alla repo, la correzione manuale diventa la nuova baseline pubblica statica.

## Carryover incluso
L'overlay V802 e' cumulativo rispetto all'hotfix non applicato del 02/09:
- Gosens -> Beetlejuice, costo 31, ASTERISCATO, ultima quotazione 11;
- Maripan -> River Plaid, costo 1, ASTERISCATO, ultima quotazione 8.

## Compatibilita svincoli
Per un giocatore assente dall'ultimo listone, la rosa continua a mostrarlo come `Asteriscato` e la quotazione di svincolo viene recuperata dall'ultimo listone storico disponibile. V802 mostra inoltre questa ultima quotazione anche nella tabella rosa quando la quotazione corrente non esiste.

## Verifiche
Eseguire:

```bash
node static/fanta-engine/tools/audit-zona-admin-rosters-v802.mjs .
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/core/league-config-v443.js
```

Audit V802 atteso: 26/26.
