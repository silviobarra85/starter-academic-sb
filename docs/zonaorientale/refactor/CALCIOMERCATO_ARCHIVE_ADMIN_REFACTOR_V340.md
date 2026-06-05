# Refactor V340 - Pannello Solo Admin / archivio Calciomercato

## Scopo

Estrarre la parte UI del pannello `Solo Admin` della sezione Calciomercato in un modulo dedicato, senza cambiare download, diagnostica, dati o permessi.

## Nuovo modulo

```text
assets/js/calciomercato/calciomercato-admin-v340.js
```

Factory esposta:

```js
createCalciomercatoArchiveAdminV340(deps)
```

Responsabilita:

- costruzione view model dal `calciomercatoStateV306`;
- rendering HTML del box Solo Admin;
- classe collapsed/expanded;
- aggiornamento diretto del DOM per il toggle;
- mantenimento degli ID storici.

## Cosa resta in app.js

Restano in `assets/app.js`:

- logica archivio V323/V324;
- recupero manifest e JSON giornalieri;
- deduplica articoli;
- build dei file giornalieri;
- build del manifest;
- download JSON;
- diagnostica archivio;
- wrapper `renderCalciomercatoArchiveAdminToolsV323()`;
- wrapper `setCalciomercatoArchiveAdminExpandedV327()`.

## Perche non e' stata estratta tutta la logica archivio

La parte archivio contiene molte dipendenze storiche e operative:

- range `Da/A`;
- feed automatico Netlify;
- merge live + statico;
- download admin;
- diagnostica V324;
- stato globale Calciomercato.

Per preservare le funzionalita, la V340 estrae solo la UI del pannello. L'estrazione della logica di download va fatta in una versione successiva e con test dedicati.

## Matching giocatore: disambiguazione maiuscole

La V340 introduce anche `calciomercato-players-v340.js`.

Motivo: alcuni giocatori hanno nomi che coincidono con parole comuni. Esempio: `Giovane` del Napoli puo essere confuso con `giovane` aggettivo.

Regola V340:

- alias a una sola parola e lunghi almeno 5 caratteri richiedono una occorrenza capitalizzata nel testo originale;
- la punteggiatura continua a essere ignorata;
- il matching resta conservativo.

## Rischi evitati

- Nessuna modifica a Netlify Function.
- Nessuna modifica a `links.json`.
- Nessuna modifica ad archivi JSON.
- Nessuna scrittura Firebase.
- Nessun cambio di ID DOM usato dai listener storici.
- Nessun cambio alla timeline modal V336.

## Verifiche minime

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-admin-v340.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-players-v340.js
static/zonaorientale/tools/check-zonaorientale.sh
```
