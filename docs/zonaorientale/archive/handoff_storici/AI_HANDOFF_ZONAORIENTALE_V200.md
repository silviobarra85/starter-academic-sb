# AI Handoff ZonaOrientale - V200

## Stato

Branch di lavoro previsto: `feature/zonaorientale-v187-next`.

Versione corrente sito: **V200 fix confronta da honor snapshot**.

## Contesto

Dalla V171 in poi il sito privilegia JSON/static snapshot per ridurre letture Firebase. In particolare, Albo/Palmarès/FIFA vengono caricati da:

- `static/zonaorientale/assets/snapshots/honor.json`
- runtime: `state.publicHonorSnapshot`

Le collection granulari `honorRoll` e `fifaRankings` possono restare vuote in modalità pubblica leggera.

## Bug corretto in V200

La pagina V195 `Confronta squadre` usava ancora principalmente:

- `state.raw.honorRoll`
- `state.raw.fifaRankings`

Per questo, senza `Carica dati amministrazione`, il confronto mostrava metriche a zero/vuote per:

- Titoli
- Podi Campionato
- FIFA Ranking
- Ultimi titoli
- breakdown titoli per competizione

## Soluzione V200

Nel blocco V200 di `assets/app.js` è stato aggiunto un override:

- `getCompareProfileMapV195 = function getCompareProfileMapV200() { ... }`

che mantiene la logica V195 e poi arricchisce i profili con:

- `state.publicHonorSnapshot.honorRows`
- `state.publicHonorSnapshot.palmares`
- `state.publicHonorSnapshot.fifaRanking`

La corrispondenza squadra viene fatta in ordine:

1. `teamId`
2. `seasonTeamId`
3. nome normalizzato

## Vincoli importanti

- Non aggiungere nuove letture Firebase per `#compare`.
- Non caricare il full-load admin per correggere metriche pubbliche.
- Usare prima gli snapshot statici già caricati.
- Mantenere mobile-first e niente tabelle larghe.
- A ogni overlay aggiornare sempre footer Version, cache-buster e checklist expected version.

## Verifiche consigliate

Senza premere `Carica dati amministrazione`:

1. Aprire `/zonaorientale/#compare`.
2. Selezionare due squadre storiche.
3. Verificare che titoli e podi siano valorizzati.
4. Verificare posizione/punteggio FIFA se presente in `honor.json`.
5. Verificare ultimi titoli e chip competizioni.
6. Testare da mobile.
7. Eseguire `Checklist online finale`.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `docs/zonaorientale/REFACTOR_V200.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V200.md`
