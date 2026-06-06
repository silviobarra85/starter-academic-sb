# Funzionalita V393 - Soccer Data rules Firebase e fallback locale stats

## Soccer Data
- La sezione resta pubblica in sola lettura.
- I comandi amministrativi restano visibili e azionabili solo dagli admin dentro Soccer Data.
- `Importa HTML FBref` continua a parserizzare tutte le tabelle presenti nel sorgente HTML incollato.
- Il salvataggio prova prima Firestore nella collection `soccerDataPlayerStats`.
- Se Firestore rifiuta la scrittura con `Missing or insufficient permissions`, il payload non viene perso: viene conservato come fallback locale V393.
- `Scarica stats JSON` esporta dati Firebase e dati locali V393 nello stesso payload statico.

## Firebase Rules
- Aggiunto file patch: `docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V393_SOCCER_DATA_STATS.rules`.
- Aggiunto file rules completo aggiornato: `docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V393.rules`.
- Blocco richiesto:

```rules
match /soccerDataPlayerStats/{docId} {
  allow read: if true;
  allow write: if isAdmin();
}
```

## Non modificato
- Mapping FBref V383 invariato.
- Balentien resta unico residuo needs-review.
- Nessuna modifica a Comunicati, Rose, Calciomercato, Snapshot, Competizioni.
- Nessuna modifica a `FUNZIONALITA'.md`.
- Nessuno scraping live pubblico.
