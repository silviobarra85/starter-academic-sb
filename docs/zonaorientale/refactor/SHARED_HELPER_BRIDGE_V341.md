# Shared helper bridge V341

## Scopo

Ridurre duplicazioni sicure di helper puri senza cambiare comportamento runtime.

La V341 introduce:

```text
assets/js/utils/shared-helper-bridge-v341.js
```

Il bridge lavora sopra `ZonaOrientaleSharedHelpersV295` quando disponibile e fornisce fallback locali per evitare rotture se il modulo condiviso non fosse inizializzato.

## Call-site ricollegati

```text
csvEscapeV278
buildListoneChangeExportCsvV278
normalizeListoneSearchKeyV269
normalizeDiagnosticKeyV303
normalizeCalciomercatoValueV306
```

## Policy di preservazione

- Non rinominare i wrapper storici.
- Non cambiare gli ID DOM.
- Non toccare Firebase/Auth/EmailJS.
- Non modificare JSON Listone o Calciomercato.
- Non rimuovere moduli legacy durante questa release.

## Rischi controllati

| Area | Rischio | Mitigazione |
| --- | --- | --- |
| Export CSV Listone | separatori/escape diversi | bridge usa `rowsToCsv` V295 o fallback equivalente |
| Ricerca Listone | normalizzazione diversa | usa `normalizeKey` storico tramite `normalizeStrictSearchKey` |
| Diagnostica dati | chiavi normalizzate | usa normalizzazione loose uguale alla logica storica |
| Calciomercato | filtri/tag/fallback | usa normalizzazione loose e preserva wrapper V306 |

## Smoke test runtime

```js
window.ZonaOrientaleSharedHelperBridgeV341.runSmokeTest()
```

Esito atteso: `ok: true`.
