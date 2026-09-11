# ZonaOrientale V814 - Safari Mac Auth e correzioni date movimenti

Data: 11/09/2026

## Problema login

Su smartphone il login continuava a funzionare, mentre su Safari Mac fallivano sia email/password sia Google. V812/V813 avevano gia uniformato Google su `signInWithPopup`, ma restavano due differenze rilevanti lato desktop Safari:

1. Firebase Auth veniva inizializzato con `getAuth()`, quindi con la persistenza browser predefinita, che puo coinvolgere IndexedDB. Safari desktop puo lasciare Auth bloccato quando lo storage IndexedDB entra in uno stato anomalo, soprattutto con piu schede/sessioni aperte.
2. Il click Google attendeva il bootstrap Firebase prima di invocare `signInWithPopup` e la V182 iniziava la navigazione Dashboard gia al click, cioe prima dell'esito OAuth. Su Safari questo rende il popup piu fragile e puo produrre `auth/popup-closed-by-user` anche se l'utente non lo ha chiuso volontariamente.

## Correzione Auth V814

- Solo su Safari Mac, ZonaOrientale inizializza Firebase Auth esplicitamente senza IndexedDB, usando nell'ordine `browserLocalPersistence`, `browserSessionPersistence`, `inMemoryPersistence`, con `browserPopupRedirectResolver` esplicito.
- Gli altri browser e FantaMantraManager mantengono il comportamento Firebase preesistente.
- Il popup Google parte direttamente dal gesto utente quando Auth e pronto; se il modulo non e ancora pronto, viene completato il preload e si chiede un secondo click, evitando di aprire il popup dopo un `await` di rete.
- La Dashboard non viene piu aperta preventivamente al click/submit: la navigazione avviene solo dopo login email/password o Google riuscito.
- Cache-buster del grafo Auth aggiornato a V814.

## Correzioni dati

- I 10 movimenti `SVINCOLO` di settembre precedentemente datati `2026-09-10` sono ora datati `2026-09-09`.
- Totale accrediti invariato: +223 FM.
- Il movimento `syQ6oloV2U2BFHGtzuUO` di Afc Severgas Baronissi, `ACQUISTO / MERCATO AGOSTO 2026`, passa da `2026-09-02` a `2026-08-20`.
- I 49 acquisti dell'asta di riparazione settembre restano datati `2026-09-10`, totale invariato -436 FM.
- La sezione Bilanci usa `fmMovements.date`, quindi le nuove date compaiono sia nei movimenti sia nel dettaglio bilanci senza alterare i saldi.
- Per gli Admin, V814 normalizza anche eventuali vecchi override Firebase che conservassero esattamente le date errate; non modifica altri override e non esegue scritture automatiche su Firestore.
- Snapshot stagione portato a V39.

## Verifica

```bash
node static/fanta-engine/tools/audit-zona-auth-dates-v814.mjs
node static/fanta-engine/tools/audit-zona-canonical-data-v810.mjs
node static/zonaorientale/tools/audit-static-first-v760.mjs .
node static/zonaorientale/tools/audit-admin-card-visibility-v763.mjs .
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/firebase.js
node --check static/fanta-engine/js/firebase/firebase-adapter-v499.js
```

Dopo il deploy su Safari Mac: chiudere eventuali vecchie schede di ZonaOrientale, fare un hard reload una volta, provare prima email/password e poi Google. Da V814 il normale utilizzo non richiede di svuotare manualmente cache o dati del browser a ogni accesso.
