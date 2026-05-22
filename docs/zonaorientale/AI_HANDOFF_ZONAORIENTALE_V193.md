# AI Handoff ZonaOrientale - V193

## Stato progetto

Versione corrente: **V193 - statistiche storiche**.

Branch di lavoro dell'utente: `feature/zonaorientale-v187-next`.

L'utente vuole che ogni overlay includa:

- zip overlay pronto
- aggiornamento Version nel footer
- cache-buster aggiornati
- comandi di test/local launch
- comandi Git
- handoff AI aggiornato

Comandi locali da includere sempre:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

URL locale:

```text
http://localhost:1313/zonaorientale/
```

## Modifica V193

Aggiunta pagina pubblica:

```text
#stats
Statistiche storiche
```

Voci aggiunte:

- nav desktop: `Statistiche`
- menu mobile Altro: `Statistiche storiche`

La pagina mostra:

- metriche storiche
- club più vincenti
- podi Campionato
- presidenti vincenti
- ultimi titoli assegnati
- Top FIFA Ranking

## Vincoli importanti

La pagina **non deve aggiungere letture Firebase**. Deve usare solo dati già caricati nello stato applicativo:

```js
state.raw.honorRoll
state.raw.seasons
state.raw.seasonTeams
state.raw.teams
state.raw.presidents
state.raw.fifaRankings
```

Il progetto usa ancora un grande `assets/app.js` con overlay incrementali `Vxxx`. Evitare refactor grossi non richiesti.

## Funzioni V193 rilevanti

Nel fondo di `assets/app.js`, prima dello startup:

- `buildHistoricalStatsV193()`
- `renderHistoricalStatsV193()`
- `injectHistoricalStatsStylesV193()`
- `window.ZonaOrientaleHistoricalStats`

Debug console:

```js
ZonaOrientaleHistoricalStats.build()
ZonaOrientaleHistoricalStats.render()
```

## Mobile

La pagina è mobile-first:

- niente tabelle larghe
- card responsive
- ranking a due colonne/una colonna in base alla larghezza
- testi lunghi con wrap

## Attenzione dati

Le statistiche storiche dipendono da `honor.json` quando il sito è in modalità pubblica leggera. Dopo modifiche ad Albo/Palmarès/FIFA o nomi storici che appaiono in Albo, l'utente deve aggiornare anche:

```text
static/zonaorientale/assets/snapshots/honor.json
```

## Prossimi sviluppi consigliati

Possibili step successivi:

- V194: estendere il tasto `Su` alle pagine lunghe mobile, incluse Statistiche, Albo, Admin e Competizioni
- V195: pagina Hall of Fame più visuale con record storici e confronto squadre
- V196: alert automatici più precisi su quali JSON scaricare dopo ciascuna modifica admin
