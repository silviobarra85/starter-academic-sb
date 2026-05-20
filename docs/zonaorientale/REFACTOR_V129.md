# Refactor V129 - Admin helpers

Data: 2026-05-20

Obiettivo: ridurre `assets/app.js` con uno step prudente, senza modificare comportamento o permessi Firebase.

## Moduli aggiunti

```text
static/zonaorientale/assets/js/admin/admin-users.js
static/zonaorientale/assets/js/admin/public-snapshots.js
```

## Cosa e stato spostato

- Rendering del pannello Admin -> Accetta utenti:
  - righe richieste in attesa;
  - riepilogo accessi approvati;
  - costruzione elenco approvati da pendingUsers + teamUsers.
- Rendering del pannello Admin -> Snapshot pubblici:
  - formattazione date snapshot;
  - testo date ultimo snapshot;
  - markup pulsanti snapshot.

## Cosa resta in app.js

- Handler Firebase e scritture Firestore.
- Approvazione/rifiuto utenti.
- Generazione snapshot.
- Orchestrazione Admin e listener.

## Test consigliati

```text
/zonaorientale/#admin
```

Verificare:

- Accetta utenti;
- visualizzazione Accessi approvati;
- Rifiuta utente;
- Snapshot pubblici;
- pulsanti snapshot;
- date ultimo snapshot.
