# ZonaOrientale - V192

## Titolo
Dashboard presidente evoluta.

## Obiettivo
Rendere l'Area squadra piu utile per i presidenti con un riepilogo operativo immediato, senza aumentare le letture Firebase all'avvio.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `docs/zonaorientale/REFACTOR_V192.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V192.md`

## Modifiche principali

### 1. Dashboard presidente in Area squadra

In `Admin/Presidente -> Area squadra`, per utenti presidente approvati, viene inserito un nuovo pannello:

- saldo FM
- giocatori in rosa
- giocatori in vendita, se il mercato e gia stato caricato
- trattative aperte, se il mercato e gia stato caricato
- ultimi movimenti FM
- ultime partite della squadra
- ultimi comunicati squadra
- azioni rapide: Pagina squadra, Tutte le rose, Mercato

### 2. Mercato resta lazy

La dashboard non forza il caricamento di `transferListings` o `transferNegotiations`.
Se il mercato non e stato ancora aperto, le metriche mercato/trattative mostrano `lazy` con indicazione di aprire il Mercato.

### 3. Mobile-first

Il pannello usa card responsive:

- metriche a 2 colonne su mobile medio
- una colonna su schermi molto stretti
- azioni rapide compatte
- testi lunghi a capo
- nessuna tabella larga

### 4. Version e cache-buster

Aggiornati a `v=192` e footer:

`V192 dashboard presidente`

La checklist deploy si aspetta la versione `192`.

## Test eseguiti

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
find static/zonaorientale/assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool
```

Esito: ok.

## Note operative

La dashboard presidente usa solo dati gia presenti in memoria/snapshot:

- `rosterEntries` / rose statiche via helper esistenti
- `fmMovements`
- `competitionMatches`
- `news`
- `transferListings` e `transferNegotiations` solo se il mercato era gia stato caricato

Non aggiunge nuove letture Firestore in caricamento pubblico o presidente.
