# Firebase adapter comune V499 - FantaMantraManager

## Scopo

La V499 centralizza l'infrastruttura Firebase nel motore comune `static/fanta-engine/js/firebase/firebase-adapter-v499.js` senza cambiare dati, rules o path.

## Cosa cambia

- `assets/firebase.js` importa `createFirebaseLeagueRuntimeV499` dal motore comune.
- `db`, `auth` e tutte le primitive Firestore/Auth restano esportate con gli stessi nomi.
- `assets/app.js` continua a importare da `./firebase.js` senza riscrittura dei flussi.
- Viene esposto `firebaseLeagueRuntimeV499` per futuri helper comuni.

## Cosa resta specifico di lega

- `firebaseConfig`;
- `projectId`;
- `authDomain`;
- eventuali regole operative e path collection storici.

## Guardrail

- Nessuna migrazione a `/leagues/{leagueId}/...`.
- Nessuna modifica alle Firestore rules.
- Nessuna cancellazione o rinomina collection.
- Nessuna contaminazione tra progetti Firebase delle due leghe.

## Verifica

Da `static`:

```bash
node fanta-engine/tools/audit-firebase-adapter-v499.mjs
node fanta-engine/tools/audit-runtime-regression-v499.mjs
node fanta-engine/tools/audit-multileague-contamination-v499.mjs
```
