# Refactor V344 - Cleanup JS legacy Calciomercato player

## Scopo

Rimuovere i moduli JS Calciomercato player V335/V337 ormai superati dal modulo V340, senza perdere tag giocatore o timeline modal.

## Modulo attivo

```text
assets/js/calciomercato/calciomercato-players-v340.js
```

`assets/app.js` importa `createCalciomercatoPlayerHelpersV340` e costruisce `CalciomercatoPlayerHelpersV335` come istanza compatibile. Il nome della costante rimane V335 per evitare refactor invasivi.

## File rimossi

```text
assets/js/calciomercato/calciomercato-players-v335.js
assets/js/calciomercato/calciomercato-players-v337.js
```

## Compatibilita preservata

Restano presenti in `app.js`:

```text
renderCalciomercatoPlayerTagsV335
getCalciomercatoArticlePlayerMatchesV335
activateCalciomercatoPlayerTimelineFromHashV335
normalizeCalciomercatoPlayerMatchValueV337
window.ZonaOrientaleCalciomercatoPlayersV335
window.ZonaOrientaleCalciomercatoPlayerMatchingV340
```

## Mitigazione rischio

- Nessuna modifica a dati, feed, archivio statico, Netlify Function, CSS o HTML delle card.
- Nessuna modifica a `links.json` o JSON Listone.
- Il check V344 fallisce se i file legacy sono ancora presenti o se V340 non e collegato.
- Il tool `audit-js-legacy-v344.mjs` verifica presenza moduli attivi e rimozione legacy.

## Test consigliati browser

1. Aprire Calciomercato.
2. Verificare che i tag giocatore compaiano sugli articoli riconosciuti.
3. Cliccare un tag giocatore.
4. Verificare apertura modal timeline.
5. Chiudere con X, sfondo ed Escape.
6. Provare un caso `Giovane` maiuscolo/minuscolo.
