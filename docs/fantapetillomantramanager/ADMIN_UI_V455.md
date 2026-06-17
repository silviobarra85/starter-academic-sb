# V455 - Fix selettore card Admin e favicon cache-proof

## Perche esiste

La V454 introduceva il selettore card Admin, ma non copriva tutte le card generate dinamicamente e alcune schede di pubblicazione restavano visibili anche con selettore vuoto.

La V455 sostituisce il runtime del selettore con una versione piu robusta.

## Comportamento Admin

- Il selettore resta sotto il titolo Admin.
- Di default nessuna card e selezionata, quindi nessuna card Admin deve essere visibile.
- Sono incluse anche le card dinamiche di pubblicazione:
  - Nessun aggiornamento statico in sospeso;
  - Stato Firebase / JSON;
  - Procedura guidata Pubblica aggiornamenti.
- Sono incluse anche le sezioni `details.admin-edit-section` e i pannelli top Admin.
- La Checklist QA Admin in basso resta nascosta di default.
- La Checklist QA Admin si puo mostrare solo spuntando `Mostra Checklist QA Admin in basso`.

## Favicon FantaPetillo

Per aggirare la cache aggressiva dei browser sulle favicon, le icone principali hanno ora file dedicati V455:

```text
assets/icons/fantapetillo-favicon-v455-16.png
assets/icons/fantapetillo-favicon-v455-32.png
assets/icons/fantapetillo-apple-touch-icon-v455.png
assets/icons/fantapetillo-android-chrome-192-v455.png
assets/icons/fantapetillo-android-chrome-512-v455.png
```

Le pagine principali del clone puntano ai nuovi file con cache-buster V455.

## File runtime

```text
assets/js/core/admin-card-visibility-v455.js
assets/css/refactor/admin-card-visibility-v455.css
tools/audit-admin-card-visibility-v455.mjs
tools/audit-favicon-v455.mjs
```

## Invarianti

- Nessuna modifica a Firebase o rules.
- Nessuna modifica ai salvataggi Admin.
- Nessuna modifica ad Area Squadra.
- Nessuna modifica a Regolamento V453.
- ZonaOrientale e FantaPetillo restano separati.
