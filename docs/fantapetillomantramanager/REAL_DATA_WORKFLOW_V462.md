# V462 - Guida operativa dati reali FantaPetilloMantraManager

La V462 aggiunge nell'Admin del clone la card selezionabile `Come applicare i dati reali 2026-2027`.

La card e' solo informativa: non scrive su Firebase, non cambia rules e non sblocca Area Squadra.

## Obiettivo

Dare all'admin una sequenza chiara per sostituire i dati placeholder con dati reali quando saranno disponibili presidenti, squadre, email, UID Authentication, budget, stadi e loghi.

## Sequenza consigliata

1. Raccogliere i dati reali dei 10 club.
2. Usare `Kit setup dati reali 2026-2027` introdotto in V458 per scaricare CSV/JSON.
3. Compilare il template con dati reali.
4. Usare `Validatore dati reali 2026-2027` introdotto in V459 per controllare formato, duplicati e valori.
5. Usare `Preview seed Firestore 2026-2027` introdotta in V460 per generare documenti Firestore revisionabili.
6. Usare `Import controllato Firestore 2026-2027` introdotto in V461 per importare nel progetto Firebase dedicato `fantapetillomantramanager`.
7. Confermare manualmente l'import digitando `IMPORTA FANTAPETILLO` solo dopo aver verificato project, rules, admin e payload.
8. Verificare le collection Firestore create o aggiornate.
9. Generare snapshot pubblici iniziali e sostituire i placeholder statici.
10. Solo dopo snapshot e `teamUsers`, procedere con una patch dedicata allo sblocco controllato dell'Area Squadra.

## Guardrail

- La card V462 non usa `setDoc`, `updateDoc` o `deleteDoc`.
- Non tocca Firebase ZonaOrientale.
- Non sostituisce i placeholder automaticamente.
- Non crea utenti Authentication.
- Non sblocca Area Squadra.

## File aggiunti

- `assets/js/core/fanta-petillo-real-data-workflow-v462.js`
- `assets/css/refactor/fanta-petillo-real-data-workflow-v462.css`
- `tools/audit-real-data-workflow-v462.mjs`
- `docs/fantapetillomantramanager/REAL_DATA_WORKFLOW_V462.md`
