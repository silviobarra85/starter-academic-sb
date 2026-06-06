# Handoff V393 - Soccer Data rules Firebase + fallback locale

## Obiettivo
Correggere il blocco `Missing or insufficient permissions` durante l'import HTML FBref in Soccer Data, senza toccare le altre sezioni del sito.

## Causa
La V391/V392 usa la collection Firestore `soccerDataPlayerStats`, ma le rules pubblicate storicamente non includono ancora un match dedicato per questa collection. Il parsing HTML funziona, ma `setDoc()` viene rifiutato da Firestore.

## Modifiche V393
- Soccer Data resta pubblica in sola lettura.
- I comandi admin restano solo dentro Soccer Data e solo per admin.
- L'import HTML prova ancora a salvare su Firebase.
- Se Firebase risponde `permission-denied` / `Missing or insufficient permissions`, il payload viene conservato localmente nel browser.
- Il pulsante `Scarica stats JSON` esporta sia i dati Firebase sia eventuali import locali V393.
- Aggiunte rules Firestore V393:
  - `FIREBASE_RULES_PATCH_V393_SOCCER_DATA_STATS.rules`
  - `FIREBASE_RULES_ZONAORIENTALE_FULL_V393.rules`

## Rules da pubblicare in Firebase
Aggiungere dentro `match /databases/{database}/documents`:

```rules
match /soccerDataPlayerStats/{docId} {
  allow read: if true;
  allow write: if isAdmin();
}
```

## Flusso operativo consigliato
1. Pubblicare la V393 sul sito.
2. Aggiornare le Firestore Rules con il blocco V393.
3. Riprovare `Importa HTML FBref` da Soccer Data.
4. Se le rules non sono ancora aggiornate, usare comunque `Scarica stats JSON`: il payload locale viene incluso nell'export.
5. Quando il JSON esportato e' verificato, inserirlo negli asset statici della repo.

## Vincoli rispettati
- Nessuna modifica a Comunicati, Rose, Calciomercato, Snapshot, Competizioni.
- Nessuna modifica al mapping FBref V383.
- Nessuna modifica a `FUNZIONALITA'.md`.
- Nessuno scraping pubblico live.
- Fallback locale solo admin.
