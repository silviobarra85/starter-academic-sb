# ZonaOrientale V813 - Auth senza timeout artificiale e comunicato acquisti

## Login

- Il timeout V812 avvolgeva erroneamente l'intera operazione `signInWithPopup`: poteva scadere mentre l'utente completava il flusso Google.
- V813 limita il timeout di 30 secondi al solo caricamento dinamico del modulo Firebase.
- `signInWithEmailAndPassword` e `signInWithPopup` attendono ora la risposta nativa di Firebase e mostrano il relativo errore reale.
- Il popup Google V812 e i messaggi specifici per popup bloccato/chiuso restano invariati.
- Nessuna modifica alle regole Firestore.

## Comunicato acquisti

- Aggiunto il comunicato `Acquisti ufficiali - asta di riparazione settembre 2026` allo snapshot pubblico.
- Riporta 49 calciatori e 436 FM, ricavati direttamente dai 49 movimenti analitici V810.
- I movimenti restano singoli, persistenti e modificabili dall'Area Admin.
- Snapshot stagione incrementato a V38.

Audit: `node static/fanta-engine/tools/audit-zona-auth-news-v813.mjs`.
