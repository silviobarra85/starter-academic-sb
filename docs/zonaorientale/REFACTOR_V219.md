# Refactor V219 - Hotfix archivio stagioni

## Tipo
Hotfix compatibilita helper storici.

## Dettaglio tecnico
Il refactor archivio V196 ordina le stagioni con `getSeasonSortValueV193` e usa `getSeasonLabelV193` per le label. Nel bundle corrente questi helper non erano definiti, quindi il render introdotto in V218 entrava nel `catch` e lArchivio restava vuoto.

V219 aggiunge le definizioni mancanti direttamente prima del blocco V196, mantenendo compatibilita con il codice archivio esistente e senza nuove letture Firebase.

## Note
Gli errori DevTools del tipo `A listener indicated an asynchronous response...` sono tipici di estensioni browser e non provengono dal codice ZonaOrientale.
