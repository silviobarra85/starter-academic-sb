# Refactor V131 - Admin competizioni

Data: 2026-05-20

Obiettivo: ridurre il peso di `assets/app.js` spostando renderer Admin isolati in un modulo dedicato, senza cambiare logica Firebase, salvataggi o import.

## File nuovo

```text
static/zonaorientale/assets/js/admin/admin-competitions.js
```

## Cosa contiene

- rendering pannello `Competizioni`;
- rendering pannello `Risultati competizioni`;
- editor risultati/classifiche;
- rendering pannello `Partite competizioni` con badge JSON/Firebase/deleted.

## Cosa resta in app.js

- salvataggio competizioni;
- salvataggio partite;
- soft delete/restore partite Firebase;
- import calendario statico;
- snapshot;
- listener Admin.

## Nota sicurezza

Questo step non modifica raccolte Firestore, rules o dati statici. `app.js` resta orchestratore e passa al modulo solo dipendenze gia esistenti.
