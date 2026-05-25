# REFACTOR V213 - Stato pubblicazione e procedura guidata in modulo dedicato

## Obiettivo

V213 prosegue il refactor corposo di `assets/app.js` estraendo la logica admin introdotta in V190, V191 e V203:

- Stato Firebase / JSON
- Procedura guidata Pubblica aggiornamenti
- sync tra preflight asset pubblici e semafori pubblicazione

Il comportamento utente non cambia: e un refactor strutturale.

## File modificati

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/refactor/admin-publication-workflow-v213.js
docs/zonaorientale/REFACTOR_V213.md
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V213.md
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md
```

## Nuovo modulo

```text
assets/js/refactor/admin-publication-workflow-v213.js
```

Contiene:

- render pannello Stato Firebase / JSON
- controllo asset statici da Admin
- semafori OK / Attenzione / Errore
- salvataggio sessione dello stato pubblicazione
- pannello Procedura guidata Pubblica aggiornamenti
- copia del flusso operativo
- copia dei comandi Git
- sync V203 dopo il preflight degli asset pubblici
- CSS responsive dei pannelli admin

## Cosa resta in app.js

`app.js` mantiene solo:

- import del modulo
- wiring delle dipendenze
- setter/getter per override di `renderAdminArea`, `renderAdminLightGateV178`, `renderAdminHelpPanelV185` e `runPublicAssetsPreflightV179`
- alias compatibili per eventuali chiamate interne o console

## Nota tecnica

Il modulo non riassegna variabili importate. Gli override vengono applicati tramite setter passati da `app.js`, seguendo lo stesso schema del refactor V212.

## Version

Footer aggiornato a:

```text
V213 refactor pubblicazione admin
```

Cache-buster aggiornati a:

```text
v=213
```

Checklist online finale aggiornata per aspettarsi la versione 213.

## Test eseguiti

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/refactor/admin-publication-workflow-v213.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
python3 validazione JSON assets/**/*.json
```

Esito: ok.

## Verifiche browser consigliate

- Login admin
- Stato Firebase / JSON -> Aggiorna stato pubblicazione
- Stato Firebase / JSON -> Controlla solo asset pubblici
- Procedura guidata Pubblica aggiornamenti -> Genera piano pubblicazione
- Copia flusso
- Copia comandi Git
- Checklist online finale
- Test mobile Admin
