# Refactor immagini Calciomercato - V334

## Obiettivo

Ridurre la responsabilita di `assets/app.js` estraendo in un modulo dedicato gli helper puri relativi a immagini e testi delle card Calciomercato.

## Nuovo modulo

```text
assets/js/calciomercato/calciomercato-images-v334.js
```

Il modulo esporta:

```js
createCalciomercatoImageHelpersV334(dependencies)
```

## Dipendenze ricevute da app.js

```js
{
  normalizeValue: normalizeCalciomercatoValueV306,
  normalizeList: normalizeCalciomercatoListV308,
  getSources: getCalciomercatoSourcesV306,
  getSourceLabel: getCalciomercatoSourceLabelV314
}
```

Questa forma evita import circolari e permette di lasciare nel file principale le logiche di stato/rendering.

## Responsabilita estratte

- `decodeText` e `decodeTextOnce` per entita HTML.
- `getArticleImageInfo` per scegliere immagine reale/fallback.
- `buildSourceFaviconUrl`.
- `buildSourceImageSvg`.
- `buildTmwTeamTextSvg`.
- `isTmwTeamSource`.
- `isTmwTeamLogoFallbackImage`.

## Compatibilita conservata in app.js

Restano disponibili i nomi storici:

```js
decodeCalciomercatoTextV328
getCalciomercatoArticleImageInfoV325
findCalciomercatoSourceConfigV326
buildCalciomercatoTmwTeamTextSvgV330
```

Questo evita regressioni in diagnostiche, funzioni successive o patch storiche che fanno riferimento ai nomi precedenti.

## Cosa non cambia

- HTML generato dalle card articolo.
- CSS delle card.
- Parser feed RSS/HTML.
- JSON archivio Calciomercato.
- `links.json`.
- Netlify Function.
- Filtri e stato Calciomercato.
- Download Admin archivio.

## Test minimi

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-images-v334.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```

## Regressioni da evitare nelle prossime versioni

- Non rimuovere i wrapper storici finche non e' verificato che nessuna diagnostica o funzione li usa.
- Non spostare anche il rendering card nella stessa release: farlo nella V335.
- Non modificare fallback immagini o SVG in un refactor puro.
- Non toccare i JSON archivio per una modifica di solo codice.

