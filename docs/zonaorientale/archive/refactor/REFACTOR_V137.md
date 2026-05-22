# Refactor V137 - Admin utenti e handoff aggiornato

Data: 2026-05-20
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Consolidare il comportamento di `Admin -> Accetta utenti` e aggiornare il file di handoff per un eventuale nuovo assistente AI.

## Modifiche

- In `Admin -> Accetta utenti`, il rifiuto di una richiesta elimina definitivamente il documento da Firebase:
  - `pendingUsers/{uid}`
- Dopo il rifiuto, la richiesta viene rimossa anche dallo stato locale prima del refresh dati, cosi non resta visibile nel pannello.
- In `Admin -> Accetta utenti`, quando il pannello viene espanso, sotto `Richieste in attesa` compare sempre la lista `Accessi approvati`.
- Gli approvati vengono ricostruiti da:
  - `pendingUsers` con `status: APPROVED`
  - `teamUsers` non disabilitati
- Aggiornato cache busting a `v=137`.
- Aggiornato footer a `V137 admin utenti e handoff`.
- Aggiunto nuovo handoff:
  - `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_REFACTOR_V137.md`

## File modificati

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/admin/admin-users.js
```

## File nuovi

```text
docs/zonaorientale/REFACTOR_V137.md
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_REFACTOR_V137.md
```

## Test consigliati

```bash
cd static
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
/zonaorientale/#admin
```

Verificare:

1. `Admin -> Utenti e comunicazioni -> Accetta utenti`.
2. Le richieste in attesa sono nella prima sottosezione.
3. Gli accessi approvati sono sotto le richieste.
4. Rifiutare una richiesta di test.
5. Verificare che sparisca dalla UI.
6. Verificare in Firebase che `pendingUsers/{uid}` sia stato eliminato.
7. Approvare un utente di test.
8. Verificare che resti in `Accessi approvati`.
