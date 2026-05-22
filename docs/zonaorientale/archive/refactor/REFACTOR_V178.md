# V178 - Admin leggero e debug letture localhost

Data: 21/05/2026

## Obiettivi

- Ridurre le letture Firebase all'avvio quando l'utente autenticato e un admin.
- Evitare il full-load automatico delle collection granulari admin se l'admin sta solo navigando il sito pubblico.
- Attivare automaticamente la diagnostica delle letture Firebase in locale, senza dover aggiungere `?debugReads=1` all'URL.

## Modifiche

### Admin leggero all'avvio

Gli admin ora avviano il sito usando il percorso dati pubblico, cioe JSON statici/snapshot pubblici quando disponibili.

Le collection granulari modificabili vengono caricate solo entrando in Admin e premendo:

```text
Carica dati amministrazione
```

Questo evita che ogni apertura del sito da admin legga subito collection come:

```text
rosterEntries
competitionResults
seasonTeams
competitions
competitionMatches
presidents
teams
fifaRankings
fmMovements
stadiums
teamUsers
```

### Admin completo su richiesta

Dopo il click su `Carica dati amministrazione`, vengono caricate le collection admin esplicite gia definite in V174/V175.
Da quel momento le azioni admin continuano a funzionare con i dati granulari Firebase.

### Debug letture automatico in locale

Su localhost la diagnostica V177 e attiva automaticamente.
Non serve piu aprire:

```text
/zonaorientale/?debugReads=1
```

Basta aprire:

```text
/zonaorientale/
```

Per disattivarla nel browser locale si puo usare:

```text
/zonaorientale/?debugReads=0
```

Per riattivarla:

```text
/zonaorientale/?debugReads=1
```

## Nota sulle 804 letture viste in V177

Le 804 letture erano il full-load admin, non il caricamento pubblico.
La tabella indicava infatti collection granulari admin come `rosterEntries`, `competitionResults`, `seasonTeams` e simili.
Con V178 quelle letture non partono piu all'avvio admin leggero: partono solo quando l'admin richiede esplicitamente i dati amministrativi.

## File modificati

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
docs/zonaorientale/REFACTOR_V178.md
```

## Test

- `node --check assets/app.js`
- validazione sintassi JS asset
- validazione JSON asset
- verifica HTTP locale asset principali
