# ZonaOrientale Firebase starter

Questo pacchetto contiene solo la cartella da copiare nel repository Hugo/Wowchemy:

```text
static/zonaorientale/
```

## Cosa contiene

- `index.html`: mantiene la grafica e la struttura esistente.
- `assets/styles.css`: mantiene lo stile attuale.
- `assets/firebase.js`: inizializza Firebase senza `npm install`.
- `assets/app.js`: nuova base Firebase con area Admin per:
  - stagioni;
  - presidenti;
  - squadre.
- `FIREBASE_RULES.rules`: regole Firestore da copiare in Firebase Console.

## Come copiarlo

1. Fai backup della tua cartella attuale:

```bash
cp -R static/zonaorientale static/zonaorientale.backup
```

2. Copia la cartella `static/zonaorientale` di questo pacchetto sopra quella esistente.

3. Avvia Hugo:

```bash
hugo server
```

4. Apri:

```text
http://localhost:1313/zonaorientale/
```

## Firebase

Non serve eseguire `npm install firebase`.

Il progetto usa gli import diretti da `gstatic`, quindi funziona in una cartella statica Hugo.

## Prima configurazione in Firebase

In Firebase Console devi avere:

1. Authentication attivo con Email/Password.
2. Firestore attivo.
3. Raccolta `admins` creata manualmente.
4. Documento `admins/{UID_DEL_TUO_UTENTE}` con almeno:

```json
{
  "role": "admin",
  "email": "tua-email@example.com"
}
```

5. Regole Firestore copiate dal file `FIREBASE_RULES.rules`.

## Raccolte iniziali

L'app carica queste raccolte:

```text
leagueSettings
seasons
presidents
teams
seasonTeams
stadiums
competitions
competitionResults
honorRoll
```

Per ora l'Admin gestisce solo:

```text
seasons
presidents
teams
```

Le altre sezioni verranno aggiunte gradualmente.
