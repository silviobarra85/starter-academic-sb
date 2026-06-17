# Firebase V449 - FantaPetilloMantraManager

Stato: progetto Firebase dedicato collegato in bootstrap protetto.

## Progetto

```text
projectId: fantapetillomantramanager
authDomain: fantapetillomantramanager.firebaseapp.com
storageBucket: fantapetillomantramanager.firebasestorage.app
```

## Cosa e' collegato in V449

- `static/fantapetillomantramanager/assets/firebase.js` usa il progetto Firebase dedicato.
- Il clone non contiene riferimenti al progetto Firebase ZonaOrientale `zonaorientale-d07af`.
- Admin e Area Squadra restano nascosti dal guard runtime V449 finche non vengono applicate le rules e creato il primo admin.
- La produzione resta disabilitata: dati placeholder, noindex e banner bootstrap.

## Rules Firestore da copiare nella console

File sorgente nell'overlay:

```text
static/fantapetillomantramanager/tools/firestore-rules-v449.rules
```

Copia il contenuto in:

```text
Firestore Database -> Regole
```

Poi pubblica.

## Primo admin

Dopo aver creato l'utente con Authentication, crea manualmente in Firestore:

```text
collection: admins
document id: <UID utente admin>
```

Campi consigliati:

```json
{
  "email": "silvio.barra@unina.it",
  "role": "admin",
  "status": "ACTIVE",
  "createdByConsole": true
}
```

Solo dopo questa operazione ha senso preparare una patch successiva per sbloccare Admin/Area Squadra nel clone.

## Nota sicurezza

La configurazione web Firebase non e' una password privata. La protezione effettiva dipende da Authentication, documenti `admins/{uid}` e Security Rules.
