# V190 - Stato pubblicazione Firebase/JSON

## Obiettivo

Aggiungere in Admin un pannello operativo con semafori per capire se i dati modificati in Firebase sono anche pubblicati nei JSON statici usati dal sito pubblico dopo refresh/logout.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `docs/zonaorientale/REFACTOR_V190.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V190.md`

## Funzionalita aggiunta

In Admin compare il pannello:

```text
Stato Firebase / JSON
```

Il pannello espone il bottone:

```text
Aggiorna stato pubblicazione
```

Il controllo non scrive su Firebase. Esegue un preflight dei JSON statici e mostra semafori per:

- modifiche locali da pubblicare rilevate da V189;
- modalita admin corrente, leggera o completa;
- `assets/public/config.json`;
- `assets/snapshots/seasons/manifest.json`;
- `assets/snapshots/honor.json`;
- `assets/rose/manifest.json`;
- `assets/listoni/manifest.json`;
- `assets/competitions/manifest.json`;
- letture Firebase stimate nella sessione.

## Mobile

Il report usa card responsive, non tabelle larghe. Su mobile i bottoni vanno a larghezza piena e ogni card va a capo con `overflow-wrap: anywhere`.

## API console

```js
ZonaOrientalePublicationStatus.check()
ZonaOrientalePublicationStatus.last()
ZonaOrientalePublicationStatus.rows()
```

## Versione

Footer aggiornato a:

```text
V190 stato pubblicazione dati
```

Cache-buster aggiornati a `v=190`.

## Test

Eseguiti:

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
find static/zonaorientale/assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool
```
