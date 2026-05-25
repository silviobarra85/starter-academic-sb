# REFACTOR V209 - Estrazione modulo dati live e archivio

## Obiettivo

Ridurre il debito tecnico accumulato nella parte finale di `assets/app.js`, senza modificare il comportamento funzionale del sito.

V209 estrae il blocco V208 relativo a:

- comunicati live Firebase non bloccanti;
- Fantamercato live/lazy per presidente;
- render Archivio stagioni da snapshot statici;
- wiring debug `ZonaOrientaleLiveData` e `ZonaOrientaleSeasonArchive`.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/refactor/live-data-archive-v209.js`
- `docs/zonaorientale/REFACTOR_V209.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V209.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md`

## Dettaglio tecnico

Il nuovo modulo:

```text
assets/js/refactor/live-data-archive-v209.js
```

esporta:

```js
createLiveDataArchiveRefactorV209(deps)
```

Il modulo non importa direttamente Firebase né lo stato globale: riceve le dipendenze da `app.js`. Questo riduce il rischio di side effect e permette di mantenere compatibilità con le funzioni storiche V205/V208.

`app.js` ora contiene solo:

- import del modulo;
- wiring delle dipendenze;
- override compatibili;
- esposizione debug su `window`;
- avvio finale `startZonaOrientaleAppV173()`.

## Comportamento confermato

Restano invariati:

- caricamento JSON/static snapshot per dati storici;
- comunicati live Firebase caricati in background;
- mercato/trattative live solo quando servono;
- Archivio senza sottosezione Partite recenti;
- pagina Archivio basata su snapshot statici della stagione selezionata;
- nessun blocco del bootstrap se Firebase live e' lento o non disponibile.

## Versione

Footer e cache-buster aggiornati a V209.

La checklist online finale ora si aspetta la versione 209.

## Test

Eseguiti:

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/refactor/live-data-archive-v209.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
python3 validazione JSON assets/**/*.json
```

Esito: OK.
