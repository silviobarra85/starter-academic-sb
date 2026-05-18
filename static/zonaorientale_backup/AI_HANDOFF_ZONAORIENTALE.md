# Handoff AI - ZonaOrientale Salerno

Questo documento serve per passare il progetto a un altro assistente AI senza perdere contesto.

## Frase da dare al nuovo assistente

Sto costruendo un gestionale fantacalcio manageriale per la Lega ZonaOrientale Salerno. Il sito è dentro una repo Hugo/Wowchemy, nella cartella `static/zonaorientale`. Il frontend è statico HTML/CSS/JS, usa Firebase Authentication e Firestore. Il sito pubblico deve leggere soprattutto snapshot pubblici per ridurre le letture Firebase. L'area Admin modifica i dati ufficiali, genera snapshot e approva utenti/presidenti e richieste. Devo ricevere sempre uno zip overlay da copiare nella repo e i comandi Git aggiornati.

## File principali da inviare al nuovo assistente

Dalla repo GitHub o dal computer locale:

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/styles.css`
- `static/zonaorientale/assets/firebase.js`
- `static/zonaorientale/FIREBASE_RULES.rules`, se presente
- `static/zonaorientale/assets/listoni/manifest.json`
- ultimo file in `static/zonaorientale/assets/listoni/`
- `static/zonaorientale/assets/rose/manifest.json`
- ultimo file in `static/zonaorientale/assets/rose/`
- eventuali loghi in `static/zonaorientale/assets/logos/`

## Cosa esportare da Firebase

Dall'area Admin del sito usa la funzione di backup/esportazione Firestore, se disponibile. In alternativa crea manualmente un export JSON con queste raccolte:

- `leagueSettings`
- `seasons`
- `presidents`
- `teams`
- `seasonTeams`
- `stadiums`
- `competitions`
- `competitionMatches`
- `competitionResults`
- `honorRoll`
- `fifaRankings`
- `rosterEntries`
- `fmMovements`
- `news`
- `pendingUsers`
- `teamUsers`
- `teamRequests`
- `publicSeasonSnapshots`
- `publicSnapshots`
- `publicTeamSnapshots`

Non condividere password o chiavi private. La configurazione Firebase web dentro `firebase.js` non è una password, ma le regole Firestore sono fondamentali.

## Architettura dati

### File statici in Git

- Listoni: `static/zonaorientale/assets/listoni/`
- Rose importate/snapshot iniziali: `static/zonaorientale/assets/rose/`
- Loghi: `static/zonaorientale/assets/logos/`

I loghi non vanno più salvati in Firebase come base64: in Firestore si salva solo il path o il nome file.

### Firestore dati ufficiali

- `seasons`: stagioni
- `presidents`: anagrafica presidenti
- `teams`: squadre madri/storiche
- `seasonTeams`: squadra associata a una stagione, con nome stagionale, logo e presidenti
- `stadiums`: stadio per squadra/stagione
- `competitions`: competizioni stagionali
- `competitionMatches`: calendario e risultati partite
- `competitionResults`: classifiche o vincitori
- `honorRoll`: albo d'oro
- `fifaRankings`: ranking manuale
- `rosterEntries`: rose dinamiche ufficiali
- `fmMovements`: movimenti fantamilioni
- `news`: comunicati pubblicati

### Utenti e richieste

- `admins/{uid}`: utenti admin
- `pendingUsers/{uid}`: utenti registrati in attesa
- `teamUsers/{uid}`: utenti presidenti approvati; più utenti possono avere lo stesso `seasonTeamId`
- `teamRequests`: richieste inviate dai presidenti, da approvare in Admin

## Snapshot pubblici

Per ridurre le letture Firebase il sito pubblico deve leggere soprattutto:

- `publicSeasonSnapshots/{seasonId}`
- `publicSnapshots/honor`
- `publicTeamSnapshots/{seasonId}_{teamId}`

Dopo modifiche Admin importanti, bisogna andare in:

`Admin -> Snapshot pubblici -> Aggiorna tutto`

Gli snapshot non devono contenere immagini base64 o file pesanti.

## Flusso utenti presidenti

1. L'utente si registra con email/password o Google.
2. Con email/password deve verificare l'email.
3. Viene creato/aggiornato `pendingUsers/{uid}`.
4. L'admin va in `Admin -> Accetta utenti`.
5. L'admin approva e associa utente a presidente, squadra madre e squadra stagionale.
6. Viene creato `teamUsers/{uid}` con `status: ACTIVE`.
7. Il presidente può inviare richieste, ma non modifica dati ufficiali.

## Richieste dei presidenti

I presidenti approvati possono proporre:

- movimento FM
- comunicato squadra
- acquisto/svincolo/scambio

Le richieste vanno in `teamRequests`. Solo l'admin approva. Dopo approvazione, il sistema crea i dati ufficiali in `news`, `fmMovements` o `rosterEntries`.

## Nuova stagione

Usare `Admin -> Riversa stagione` per copiare da una stagione origine alla nuova stagione:

- squadre stagionali
- presidenti collegati
- loghi/path
- stadi, se selezionato
- rose e giocatori attivi, se selezionato
- opzionalmente aggiornare gli utenti presidenti alla nuova stagione

I movimenti FM non vengono copiati automaticamente.

## Convenzioni importanti

- Dopo ogni modifica alla repo, fornire sempre:
  - zip overlay
  - comandi Git
  - messaggio commit aggiornato
- Non usare Supabase in questo progetto.
- Non salvare immagini base64 in Firebase.
- Non far leggere raccolte granulari al pubblico se si può usare uno snapshot.
- Mantenere mobile-first e attenzione alle tabelle su smartphone.

## Comandi Git tipici

```bash
git add static/zonaorientale
git commit -m "Messaggio coerente con la modifica"
git push origin master
```

Se ci sono divergenze:

```bash
git pull --rebase origin master
```

Se ci sono modifiche locali non salvate:

```bash
git stash push -m "Work in progress before rebase"
git pull --rebase origin master
git stash pop
```
