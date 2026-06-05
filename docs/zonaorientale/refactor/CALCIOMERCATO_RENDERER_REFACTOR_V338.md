# Refactor Calciomercato Renderer V338

## Tipo intervento

Refactor protetto, senza cambio comportamento intenzionale.

## Motivazione

Il rendering delle card articolo Calciomercato era ancora dentro `assets/app.js`. Dopo l'estrazione degli helper immagini V334 e dei player helper V337, il passo piu sicuro era isolare la costruzione HTML delle card in un modulo puro.

## Modulo introdotto

```text
assets/js/calciomercato/calciomercato-render-v338.js
```

Factory esportata:

```js
createCalciomercatoArticleRendererV338(deps)
```

Metodi principali:

```js
renderArticleCard(article)
renderTeamChips(teams)
renderStatusChip(status)
renderArticleThumb(imageInfo, safeUrl)
```

## Dipendenze iniettate

Il modulo riceve da `app.js`:

- `escapeHtml`
- `decodeCalciomercatoTextV328`
- `getCalciomercatoTeamsV308`
- `getCalciomercatoTopicLabelV306`
- `getCalciomercatoStatusV308`
- `getCalciomercatoSourceLabelV314`
- `getCalciomercatoArticleImageInfoV325`
- `formatCalciomercatoArticleDateTimeV311`
- `renderCalciomercatoPlayerTagsV335`

## Compatibilita

Il nome storico `renderCalciomercatoArticleCardV306(article)` resta in `app.js` e delega al modulo V338. Questo evita regressioni nella lista articoli e nella timeline giocatore V336, che usa ancora quel nome.

## Cosa non e' stato cambiato

- Nessun CSS.
- Nessun JSON.
- Nessuna Netlify Function.
- Nessun filtro.
- Nessun archivio statico.
- Nessun matching giocatore.
- Nessun fallback immagine.
- Nessuna modifica a Firebase/Auth/EmailJS.

## Rischi considerati

- Perdita dei tag giocatore nelle card: mitigata iniettando `renderCalciomercatoPlayerTagsV335`.
- Perdita fallback immagini: mitigata iniettando `getCalciomercatoArticleImageInfoV325`.
- Rottura timeline modal: mitigata mantenendo `renderCalciomercatoArticleCardV306`.
- Rottura layout card: mitigata mantenendo identiche classi CSS e markup equivalente.

## Diagnostica runtime

```js
window.ZonaOrientaleCalciomercatoRendererV338
```

## Test richiesti

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-render-v338.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```
