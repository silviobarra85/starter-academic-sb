# ZonaOrientale Firebase starter

Questo pacchetto contiene la cartella da copiare nel repository Hugo/Wowchemy:

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
  - squadre con caricamento logo e fallback con iniziali;
  - associazione squadre/stagioni;
  - competizioni per stagione;
  - risultati delle competizioni concluse;
  - albo d'oro e palmarès calcolati dai risultati.
- `FIREBASE_RULES.rules`: regole Firestore da copiare in Firebase Console.

## Novità di questa versione

- Ogni scheda Admin ha il pulsante `Ingrandisci/Riduci`.
- Le squadre non usano più un path logo manuale: puoi caricare un file immagine dal pannello Admin.
- Il logo viene salvato nel campo `teams.logo` come data URL compresso e mostrato in forma tonda.
- Se non c'è logo, viene mostrato un placeholder tondo con le prime due lettere del nome squadra.
- Le stagioni hanno il campo `participantCount`, cioè il numero previsto di squadre partecipanti.
- È stata aggiunta la gestione `seasonTeams`: qui associ una squadra a una stagione e salvi nome stagionale, presidenti stagionali e logo stagionale opzionale.
- Una squadra associata a una stagione partecipa automaticamente a tutte le competizioni di quella stagione.
- È stata aggiunta la gestione `competitions` con:
  - stagione;
  - nome;
  - tipo/trofeo;
  - formula `CLASSIFICA` oppure `GIRONI_KO`;
  - stato `ATTIVA`, `PROGRAMMATA`, `CONCLUSA`, `NON_DISPUTATA`;
  - creazione rapida delle competizioni standard: Campionato, Champion's League, Coppa Italia, Playoff.
- È stata aggiunta la gestione `competitionResults`:
  - per le competizioni a classifica inserisci dal primo all'ultimo posto;
  - per le competizioni a gironi/eliminazione inserisci vincitore e secondo;
  - il salvataggio aggiorna automaticamente `honorRoll` per Albo d'oro e Palmarès.

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

## Raccolte caricate

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

L'Admin gestisce direttamente:

```text
seasons
presidents
teams
seasonTeams
competitions
competitionResults
honorRoll
```

Nota: `honorRoll` viene aggiornato automaticamente quando salvi i risultati di una competizione conclusa.
