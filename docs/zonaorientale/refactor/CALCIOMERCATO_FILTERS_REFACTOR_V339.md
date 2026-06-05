# Refactor V339 - Filtri Calciomercato

## Tipo intervento

Refactor protetto, senza cambio comportamento intenzionale.

## Prima

La logica dei filtri Calciomercato era concentrata in `assets/app.js`:

- `getCalciomercatoFilteredArticlesV306()`;
- rendering option select;
- binding eventi dei controlli;
- aggiornamento stato filtro.

## Dopo

La logica e' stata spostata in:

```text
assets/js/calciomercato/calciomercato-filters-v339.js
```

`app.js` mantiene wrapper e alias storici, quindi il resto del runtime continua a chiamare gli stessi nomi.

## Dipendenze iniettate

Il modulo riceve da `app.js` solo dipendenze esplicite:

- `escapeHtml`;
- `normalizeCalciomercatoValueV306`;
- getter articoli/squadre/topic/fonte/stato/player;
- getter timestamp e range;
- formatter data;
- callback `render`, `reload`, `resetRange`, `loadOlder`.

## Perimetro non toccato

- Nessun fetch.
- Nessuna scrittura Firebase.
- Nessuna modifica Netlify.
- Nessuna modifica archivi JSON.
- Nessuna modifica CSS.
- Nessuna modifica card renderer V338.
- Nessuna modifica matching giocatore V337.

## Compatibilita

Restano attivi i nomi storici:

```js
getCalciomercatoFilteredArticlesV306
renderCalciomercatoSelectOptionsV306
renderCalciomercatoTeamSelectOptionsV314
renderCalciomercatoSourceSelectOptionsV314
setupCalciomercatoControlsV306
```

Il binding continua a usare il flag storico:

```js
section.dataset.calciomercatoBoundV306
```

## Motivazione

Questa estrazione rende piu semplice la prossima pulizia del blocco Calciomercato in `app.js`, riducendo il rischio di impattare feed, card, timeline giocatori o pannello Solo Admin.

## Verifiche

- `node --check` su app e modulo.
- `check-zonaorientale.sh` aggiornato con controllo modulo V339.
- Audit asset e CSS senza errori.
