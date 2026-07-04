# AI Assistant handoff V541

## Versione

V541 - Performance consolidation e inventario runtime.

## Stato progetto

- `fanta-engine` e' il motore comune.
- `zonaorientale` e' la lega storica 2025-2026.
- `fantapetillomantramanager` e' la seconda lega 2026-2027.
- `static/_league-template` resta la base per future leghe.
- Listoni e Calciomercato sono asset comuni e restano in `static/fanta-engine/data/shared-assets/current/`.
- Le copie locali Listoni/Calciomercato restano fallback e non vanno cancellate senza richiesta esplicita.

## Cosa cambia in V541

- Cache-buster/footer aggiornati a V541.
- `currentVersion` dei config JSON aggiornato a 541.
- Fallback `league-config-v443.js` aggiornato a V541.
- Aggiunto audit `static/fanta-engine/tools/audit-performance-consolidation-v541.mjs`.
- Aggiunto documento `docs/PERFORMANCE_CONSOLIDATION_V541.md`.
- Aggiornati `docs/OVERLAY_ROADMAP.md`, `docs/CENTRALIZATION_STATUS_V521.md` e `docs/AI_ASSISTANT_HANDOFF_CURRENT.md`.

## Cosa non cambia

- Nessun nuovo modulo runtime importato.
- Nessuna modifica Firebase.
- Nessuna modifica EmailJS.
- Nessuna cancellazione asset.
- Nessuna migrazione dati.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Verifica

```bash
node static/fanta-engine/tools/audit-performance-consolidation-v541.mjs
```

## Prossimo overlay consigliato

V542 - Safe repository cleanup.

Ambito V542 consigliato:

- `.DS_Store`;
- `__MACOSX/`;
- `scripts/init_kickstart.sh`;
- eventuale cartella `scripts/` solo se vuota.

Non fare cleanup fallback asset in V542. Quello richiede approvazione separata.
