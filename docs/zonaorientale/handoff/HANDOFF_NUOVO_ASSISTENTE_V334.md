# Handoff nuovo assistente AI - V334

Data: 05/06/2026
Versione corrente: V334
Branch operativo utente: `refactor/260528-zonaorientale-next`

## Sintesi

La V334 e' un refactor protetto del codice Calciomercato. Non introduce nuove funzionalita visibili: estrae gli helper immagini/testi da `assets/app.js` nel modulo:

```text
static/zonaorientale/assets/js/calciomercato/calciomercato-images-v334.js
```

Il rendering delle card articolo rimane in `app.js`, ma chiama wrapper con nomi storici per mantenere compatibilita con diagnostiche e codice esistente.

## Regola principale

Preservare tutte le funzionalita esistenti. Non cancellare funzioni, CSS o JSON perche sembrano legacy senza prima fare grep, controlli e verifica browser.

`docs/zonaorientale/FUNZIONALITA'.md` non va modificato salvo richiesta esplicita dell'utente.

## File toccati dalla V334

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/calciomercato/calciomercato-images-v334.js
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
static/zonaorientale/tools/check-zonaorientale.sh
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md
docs/zonaorientale/CHANGELOG_CONSOLIDATO.md
docs/zonaorientale/FUNZIONALITAV334.md
docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V334.md
docs/zonaorientale/refactor/CALCIOMERCATO_IMAGES_REFACTOR_V334.md
docs/zonaorientale/release/RELEASE_V334_CALCIOMERCATO_IMAGES_REFACTOR.md
```

## Stato Calciomercato dopo V334

Funzionano e vanno preservati:

- feed RSS automatici;
- parser HTML TMW squadra introdotto in V329;
- archivio statico giornaliero;
- fallback favicon fonte V328;
- tile testuale `TMW - <NomeSquadra>` V330;
- card compatte V332;
- pannello `Solo Admin` con toggle V327;
- filtri `Cerca`, `Fonte`, `Squadra`, `Da`, `A`.

## Come e' stato fatto il refactor

In `app.js` e' stato aggiunto l'import:

```js
import { createCalciomercatoImageHelpersV334 } from "./js/calciomercato/calciomercato-images-v334.js?v=334";
```

Poi e' stato creato:

```js
const CalciomercatoImageHelpersV334 = createCalciomercatoImageHelpersV334({
  normalizeValue: normalizeCalciomercatoValueV306,
  normalizeList: normalizeCalciomercatoListV308,
  getSources: getCalciomercatoSourcesV306,
  getSourceLabel: getCalciomercatoSourceLabelV314
});
```

I nomi storici come `decodeCalciomercatoTextV328` e `getCalciomercatoArticleImageInfoV325` restano disponibili come alias/wrapper.

## Diagnostica

La V334 espone:

```js
window.ZonaOrientaleCalciomercatoImagesV334
```

Il check obbligatorio verifica:

- marker V334 in `app.js`;
- presenza del modulo `calciomercato-images-v334.js`;
- presenza della factory `createCalciomercatoImageHelpersV334`.

## Prossima attivita consigliata

La prossima V335 puo estrarre il rendering delle card Calciomercato in un modulo dedicato, ma solo dopo aver preservato i wrapper e senza cambiare HTML generato.

Proposta V335:

```text
assets/js/calciomercato/calciomercato-render-v335.js
```

Strategia consigliata:

1. creare factory con dipendenze (`escapeHtml`, formatter, renderer chips);
2. spostare solo `renderCalciomercatoArticleCardV306` e funzioni strettamente collegate;
3. mantenere in `app.js` un wrapper con lo stesso nome;
4. aggiornare test/check e docs.

