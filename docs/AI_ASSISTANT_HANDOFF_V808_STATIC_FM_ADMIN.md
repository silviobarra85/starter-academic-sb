# ZonaOrientale V808 - Admin movimenti static-first

Data: 10/09/2026

## Obiettivo
La sezione Admin "Rose e movimenti FM" deve mostrare e permettere di modificare anche i movimenti presenti nello snapshot statico, inclusi i 10 svincoli del 10/09/2026.

## Contratto dati
- Snapshot statico = baseline autorevole del sito pubblico.
- `fmMovements` Firebase = delta amministrativi soltanto quando un movimento viene creato/modificato/eliminato da Admin.
- Nessuna nuova lettura Firestore nel percorso pubblico.
- In Admin completo, i movimenti statici vengono fusi con i documenti Firebase per `id`.
- Un override Firebase con lo stesso `id` prevale sulla baseline statica.
- Un documento Firebase con `status: REMOVED`/`deleted: true` nasconde il movimento statico.
- L'overlay snapshot stagionale consolida il risultato del merge nel nuovo JSON statico.

## Svincoli 10/09/2026
I 10 movimenti statici restano nello snapshot e sono ora visibili/modificabili dall'Admin. Totale accrediti: 223 FM.

## Nota release
V807 live-news NON e stata applicata. V808 parte dalla V806/hotfix password reset + aggiornamenti dati successivi.
