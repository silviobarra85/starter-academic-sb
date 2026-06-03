# CSS_REFACTOR_STABLE_V299 - Consolidamento CSS refactor

## Scopo

V299 stabilizza i nomi dei CSS estratti nelle release V291/V292. L'obiettivo e' evitare una crescita infinita di file con suffisso versione, mantenendo comunque il cache-buster negli HTML.

## File attivi

```text
assets/css/refactor/mobile-controls.css
assets/css/refactor/rosters-tables.css
```

Questi file sostituiscono rispettivamente:

```text
assets/css/refactor/mobile-controls-v292.css
assets/css/refactor/rosters-tables-v292.css
```

## File conservato ma non attivo

```text
assets/css/refactor/theme-light-suspended.css
```

Sostituisce:

```text
assets/css/refactor/theme-light-suspended-v292.css
```

Il file Light resta parcheggiato: la modalita Light e' ancora disattivata dalla V289 e non va riattivata senza un ciclo dedicato di audit/test.

## Funzionalita a rischio e preservazione

### Listone

Rischio: perdere stili di filtri, colonna `Modifica`, export admin-only o layout mobile.

Preservazione: le regole attive V292 sono state copiate nei nuovi file stabili senza cambiare selettori o proprieta. Testare Listone pubblico e Admin.

### Rose e pagina squadra

Rischio: regressione sulla prima colonna sticky, righe troppo alte o testo non centrato.

Preservazione: `rosters-tables.css` conserva gli override mobile/rose V288-V289. Testare pagina squadra e Dashboard Presidente.

### Mobile navigation

Rischio: alterare bottom nav, menu Altro o pulsante Su.

Preservazione: `mobile-controls.css` conserva gli override mobile senza toccare `mobile-chrome-v223.css` o JS.

### Dark mode unico

Rischio: riattivare accidentalmente Light o mostrare il toggle tema.

Preservazione: `theme-light-suspended.css` non viene importato; la logica V289 resta in `app.js`.

### Pagine standalone

Rischio: `competition.html` e `player.html` potrebbero restare con import vecchi.

Preservazione: entrambi gli HTML sono aggiornati agli stessi CSS stabili e cache-buster V299.

## Comandi di pulizia richiesti

Dopo applicazione overlay, rimuovere i CSS versionati V292 sostituiti:

```bash
git rm static/zonaorientale/assets/css/refactor/mobile-controls-v292.css \
  static/zonaorientale/assets/css/refactor/rosters-tables-v292.css \
  static/zonaorientale/assets/css/refactor/theme-light-suspended-v292.css
```

## Test minimi

```bash
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh --quiet
```

Test manuali:

```text
Home mobile
Listone pubblico
Listone Admin con export CSV
Pagina squadra -> Rosa
Dashboard Presidente
Bottom nav/menu Altro/pulsante Su
competition.html
player.html
```

## Diagnostica

```js
window.ZonaOrientaleCssStableRefactorV299
```
