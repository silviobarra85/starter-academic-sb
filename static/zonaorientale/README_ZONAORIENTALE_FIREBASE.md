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
  - squadre con logo da file statico in assets/logos e fallback con iniziali;
  - associazione squadre/stagioni;
  - competizioni per stagione;
  - risultati delle competizioni concluse;
  - albo d'oro e palmarès calcolati dai risultati.
- `FIREBASE_RULES.rules`: regole Firestore da copiare in Firebase Console.

## Novità di questa versione

- Ogni scheda Admin ha il pulsante `Ingrandisci/Riduci`.
- Le squadre usano un path/logo file statico: inserisci il nome del file già presente in `assets/logos/`, ad esempio `real-pastena.png`, oppure un path tipo `assets/logos/real-pastena.png`.
- Il logo non viene più salvato come base64 in Firestore: nel campo `teams.logo` e `seasonTeams.logo` viene salvato solo un path leggero.
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

## Aggiornamento V5

Nuove raccolte usate dall'app:

- `competitionMatches`: calendario e risultati partita per ogni competizione.
- `stadiums`: nome e livello dello stadio per ogni squadra associata a una stagione.
- `fifaRankings`: punteggio manuale FIFA Ranking per ogni squadra.

Le raccolte vengono create automaticamente al primo salvataggio dall'area Admin. Resta da creare manualmente solo `admins`.

L'area Admin ora si apre con tutte le schede ridotte; usa **Ingrandisci** per aprire la scheda che vuoi modificare.

## Aggiornamento V8

- Su mobile le tabelle restano tabelle vere: intestazioni visibili e sticky, layout compatto, scroll interno al contenitore.
- Le sezioni pubbliche e le sottosezioni principali hanno il pulsante `Ingrandisci/Riduci`.
- Le schede Admin restano ridotte di default come nelle versioni precedenti.

## Listoni statici

I listoni giocatori non vengono salvati su Firebase. Sono file statici versionati in Git nella cartella:

```text
static/zonaorientale/assets/listoni/
```

Ogni snapshot ha un file JSON nominato con la data del listone, ad esempio:

```text
2026-05-15.json
```

Il file `manifest.json` indica al sito quali snapshot sono disponibili e a quale stagione appartengono. Questa scelta evita di appesantire Firestore con centinaia di documenti giocatore e conserva lo storico direttamente nella repository.

Nel listone generato da `Quotazioni_Fantacalcio_Stagione_2025_26.xlsx`:

- il foglio `Tutti` è importato con stato `In listone`;
- il foglio `Ceduti` è importato con stato `asteriscato`;
- la squadra reale è salvata come abbreviazione di 3 lettere maiuscole;
- sono conservati tutti i campi numerici del file Fantacalcio.


## V18 - Rose modificabili e movimenti FM

Da questa versione il listone resta uno snapshot statico in `assets/listoni`, mentre le rose operative e i movimenti di fantamilioni stanno in Firestore.

Nuove raccolte Firestore usate automaticamente:

- `rosterEntries`: giocatori attivi nelle rose, modificabili tramite movimenti.
- `fmMovements`: movimenti FM per budget iniziale, acquisti, vendite, svincoli, scambi, bonus, penalità e rettifiche.

La prima volta puoi usare Admin → Rose e movimenti FM → "Inizializza rose dal file statico" per copiare il file rose JSON in Firebase. Dopo questo passaggio la fonte operativa diventa Firestore.


## V33 - Snapshot Albo d'Oro compatto

La v33 evita di duplicare i loghi base64 dentro `publicSnapshots/honor`, perché Firestore blocca i documenti oltre 1 MiB. Lo snapshot pubblico dell'Albo conserva nomi, ID e piccoli path logo se presenti; per i loghi base64 usa il fallback con iniziali.

## V32 - Snapshot pubblici e riduzione letture Firebase

Questa versione introduce due raccolte per ridurre le letture Firestore del sito pubblico:

- `publicSeasonSnapshots/{seasonId}`: dati precompilati per Dashboard, Competizioni, Stadi, Rose sintetiche e Movimenti della stagione.
- `publicSnapshots/honor`: Albo d'Oro, Palmarès e FIFA Ranking già pronti.

Da Admin apri **Snapshot pubblici** e clicca **Aggiorna snapshot pubblici** dopo modifiche a stagioni, squadre, competizioni, risultati, calendario, stadi, rose, movimenti FM o FIFA Ranking.

Se gli snapshot non sono ancora presenti, il sito usa automaticamente la lettura completa come fallback.


## V35 - Loghi statici senza base64

I loghi squadra vanno inseriti come file nella repo in `static/zonaorientale/assets/logos/`. Nell'Admin, nella scheda Squadre o Squadre per stagione, inserisci solo il nome del file o il path. Se inserisci solo `real-pastena.png`, il sito lo risolve come `./assets/logos/real-pastena.png`.

È disponibile il pulsante **Rimuovi immagini base64 da Firebase** nella scheda Admin > Squadre: rimuove i vecchi loghi salvati come data URL da `teams` e `seasonTeams`, senza toccare i file statici. Dopo la pulizia, rigenera gli snapshot pubblici.
