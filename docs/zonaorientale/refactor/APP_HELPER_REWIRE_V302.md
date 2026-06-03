# V302 - Secondo collegamento helper CSV condiviso

## Sintesi

V302 prosegue il refactor prudente di `assets/app.js` collegando un solo call-site al modulo helper condiviso V295:

```text
buildListoneChangeExportCsvV278 -> ZonaOrientaleSharedHelpersV295.rowsToCsv
```

La modifica riguarda solo la costruzione del CSV dell'export modifiche Listone. Il fallback legacy con `csvEscapeV278` resta presente se l'helper non fosse disponibile.

## Funzionalita' a rischio verificate

La modifica poteva impattare:

- Listone pubblico;
- colonna `Modifica`;
- filtro `Modifiche`;
- `Mostra usciti storici`;
- export modifiche CSV riservato Admin V296;
- helper CSV V295;
- download del file CSV con BOM UTF-8 e separatore `;`.

## Preservazione funzionale

V302 preserva le funzionalita' esistenti cosi':

- non modifica `buildListoneChangeExportRowsV278`;
- non modifica `getListoneRowsForChangeExportV278`;
- non modifica il filtro `Modifiche`;
- non modifica la visibilita' admin-only dell'export V296;
- mantiene BOM UTF-8 nel CSV;
- mantiene separatore `;`;
- mantiene fallback legacy se `rowsToCsv` non fosse disponibile;
- non tocca Firebase, EmailJS, rose, Dashboard Presidente o Admin.

## Diagnostica runtime

```js
window.ZonaOrientaleAppHelperRewireV302
```

Valori attesi:

```js
window.ZonaOrientaleAppHelperRewireV302.behaviorChange === false
window.ZonaOrientaleAppHelperRewireV302.rewiredCallSites.includes("buildListoneChangeExportCsvV278 -> ZonaOrientaleSharedHelpersV295.rowsToCsv")
```

## Test consigliati

### Pubblico

- Aprire Listone.
- Verificare che il pulsante `Esporta modifiche CSV` non compaia.
- Verificare che `Modifiche`, colonna `Modifica` e usciti storici continuino a funzionare.

### Admin

- Login Admin.
- Aprire Listone.
- Usare filtro `Modifiche`.
- Cliccare `Esporta modifiche CSV`.
- Verificare che il CSV venga scaricato e contenga le stesse colonne V278.

## Nota roadmap

Il recupero della Light mode e' escluso dalla roadmap corrente su richiesta esplicita dell'utente. La Light mode resta sospesa.
