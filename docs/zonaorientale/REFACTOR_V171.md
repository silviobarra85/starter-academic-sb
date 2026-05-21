# ZonaOrientale - Refactor V171

## Obiettivo

Ridurre ulteriormente le letture Firebase pubbliche e correggere la barra azioni mobile per gli admin.

## Modifiche

### 1. Config pubblica statica

Aggiunto il file:

```text
static/zonaorientale/assets/public/config.json
```

Il sito pubblico ora prova prima a leggere questo file statico via `fetch()` e usa Firebase solo come fallback per:

```text
leagueSettings
seasons
```

Ordine di lettura pubblico:

```text
1. assets/public/config.json
2. fallback Firebase leagueSettings/seasons se il file manca o non e valido
```

La config iniziale contiene la stagione corrente `2025-2026`. Per avere una config completa con tutte le stagioni reali presenti su Firebase, entrare in admin e usare il nuovo pulsante:

```text
Admin -> Snapshot e backup -> Snapshot pubblici -> Scarica config pubblica
```

Salvare poi il file scaricato come:

```text
static/zonaorientale/assets/public/config.json
```

### 2. Admin mobile: Dark/Light, Account, Logout sulla stessa riga

Il CSS mobile aveva gia la regola per disporre i tre controlli in riga. Il problema era JS: per l'admin il pulsante account veniva nascosto.

Ora, quando un utente e loggato, `openLoginBtn` resta visibile con testo:

```text
Account
```

Anche per admin, quindi su mobile i tre pulsanti sono:

```text
Dark/Light | Account | Logout
```

Il pulsante `Aggiorna dati`, se visibile, resta su una riga separata.

### 3. Cache-buster

Aggiornati in `index.html`:

```text
assets/styles.css?v=171
assets/css/mobile-suite-v168.css?v=171
assets/app.js?v=171
```

## File modificati

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/css/mobile-suite-v168.css
static/zonaorientale/assets/public/config.json
docs/zonaorientale/REFACTOR_V171.md
```

## Test eseguiti

```bash
node --check assets/app.js
find assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
find assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool
python3 -m http.server --directory /mnt/data/v171_work/static 18133 --bind 127.0.0.1
```

Verificati HTTP 200:

```text
/zonaorientale/
/zonaorientale/assets/app.js
/zonaorientale/assets/public/config.json
/zonaorientale/assets/css/mobile-suite-v168.css
```

## Verifiche browser consigliate

1. Aprire `/zonaorientale/#dashboard` da pubblico e verificare che non partano letture Firebase per `leagueSettings` e `seasons` se `assets/public/config.json` e disponibile.
2. Accedere come admin da mobile e verificare che Dark/Light, Account e Logout stiano sulla stessa riga.
3. Aprire Admin -> Snapshot e backup -> Snapshot pubblici e provare il pulsante `Scarica config pubblica`.
