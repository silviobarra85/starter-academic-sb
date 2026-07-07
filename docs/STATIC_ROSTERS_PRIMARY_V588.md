# V588 - Rose GitHub come fonte primaria

## Flusso consigliato
1. Area Admin -> Editor rose GitHub.
2. Modifica la rosa.
3. Scarica JSON rosa e `manifest.json`.
4. Copiali in `static/<lega>/assets/rose/`.
5. Commit e push su `master`.
6. Dopo il deploy, il sito visualizza la nuova rosa da GitHub.
7. Solo se vuoi allineare anche Firestore, premi `Sincronizza rosterEntries dalla rosa GitHub`.

## Priorita' dati
```text
Visualizzazione sito:
assets/rose manifest + JSON
-> fallback rosterEntries Firestore
```

```text
Scrittura Firestore:
solo pulsante Admin esplicito
nessuna sincronizzazione automatica
```

## Perche' non sincronizzare automaticamente
Un JSON sbagliato, non deployato o letto da cache potrebbe sovrascrivere dati live. Per questo V588 separa visualizzazione e sincronizzazione.

## Audit
```bash
node static/fanta-engine/tools/audit-static-rosters-primary-v588.mjs
```
