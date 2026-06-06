# FUNZIONALITA V394 - Soccer Data API-Football cache Firebase

## Obiettivo

Portare Soccer Data verso un flusso piu semplice e stabile rispetto allo scraping FBref: API-Football diventa il provider preferito per recuperare statistiche giocatore in JSON, salvare/cache su Firebase ed esportare poi JSON statici da pubblicare in repo.

## Vincoli rispettati

- Intervento limitato alla sezione Soccer Data.
- Nessuna modifica a Rose, Calciomercato, Comunicati, Snapshot, Competizioni o Trattative.
- Nessuna rimozione del mapping FBref V383.
- Soccer Data resta pubblica in sola lettura.
- Comandi operativi e di scrittura restano visibili/usabili solo da admin.
- Nessuna richiesta API viene fatta dal pubblico: solo admin tramite Netlify Function.

## Novita principali

- Nuova Netlify Function admin-only: `netlify/functions/api-football-player-stats.js`.
- Supporto configurazione API key via variabili ambiente Netlify:
  - `ZONAORIENTALE_API_FOOTBALL_KEY` preferita;
  - fallback: `API_FOOTBALL_KEY`, `API_FOOTBALL_API_KEY`, `APISPORTS_API_KEY`.
- Per ogni giocatore, l'admin puo:
  - cercare candidati API-Football;
  - salvare localmente l'API-Football ID;
  - recuperare le statistiche API-Football del singolo giocatore;
  - salvare il payload su Firebase nella collection gia usata `soccerDataPlayerStats`;
  - scaricare il JSON aggregato con `Scarica stats JSON`.
- Aggiunta colonna tabellare `Aggiornato` per mostrare la data dell'ultimo aggiornamento stats disponibile.
- Il fallback FBref V391/V392 resta disponibile, ma API-Football diventa il percorso consigliato.

## Flusso operativo consigliato

1. Admin apre Soccer Data.
2. Per un giocatore clicca `Cerca API-Football ID`.
3. Sceglie/salva l'ID corretto.
4. Clicca `Recupera API-Football`.
5. Il sito chiama la Netlify Function, riceve JSON API-Football e salva/cache su Firebase.
6. La tabella mostra la data nella colonna `Aggiornato`.
7. Quando ci sono abbastanza dati, l'admin clicca `Scarica stats JSON`.
8. Il JSON scaricato viene inserito nella repo come statico, cosi il sito legge prima statico e riduce le letture API.

## Firebase

La V394 usa la collection gia prevista:

```text
soccerDataPlayerStats
```

Le regole richieste restano:

```rules
match /soccerDataPlayerStats/{docId} {
  allow read: if true;
  allow write: if isAdmin();
}
```

Non viene introdotta una nuova collection Firebase.

## Note

API-Football ha un limite giornaliero sul piano gratuito: il flusso V394 usa un'azione esplicita per singolo giocatore, salva su Firebase e consente export statico proprio per non sprecare richieste API.
