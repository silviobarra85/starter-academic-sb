# REFACTOR V204 - Archivio da snapshot statici

## Obiettivo
Correggere la pagina pubblica Archivio quando si selezionano stagioni storiche dopo un refresh/logout.

## Problema
L'Archivio V196 costruiva partecipanti, vincitori, competizioni e partite soprattutto da `state.raw`. In modalità pubblica leggera, dopo refresh, `state.raw` può contenere solo configurazione e dati della stagione corrente. Le stagioni storiche sono invece disponibili nei JSON statici `assets/snapshots/seasons/*.json`.

Quando l'admin premeva `Aggiorna tutto`, la sessione si popolava con dati granulari e l'Archivio sembrava funzionare; dopo refresh tornava vuoto perché rileggeva il flusso statico ma non caricava lo snapshot della stagione selezionata.

## Soluzione
- L'Archivio carica lo snapshot della stagione selezionata tramite `loadPublicSeasonSnapshotV32(seasonId)`.
- Se il JSON statico esiste, non vengono aggiunte letture Firebase.
- `buildSeasonArchiveV196` ora usa lo snapshot selezionato come sorgente primaria per:
  - squadre partecipanti
  - presidenti
  - stadi
  - competizioni
  - partite
  - risultati/classifiche
  - rose
  - movimenti FM
  - news
- L'Albo della stagione viene preso dallo snapshot `honor.json` già caricato.

## File modificati
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`

## Versione
Footer e cache-buster aggiornati a V204.
