# V301 - Pulizia controllata CSS refactor residui

## Scopo

V301 aggiunge uno strumento di pulizia controllata per i vecchi CSS refactor versionati V291/V292 dopo il consolidamento a nomi stabili V299.

La release non cambia regole CSS attive e non modifica la UI: lo script lavora solo su residui ormai sostituiti dagli alias stabili.

## File stabili da preservare

```text
assets/css/refactor/mobile-controls.css
assets/css/refactor/rosters-tables.css
assets/css/refactor/theme-light-suspended.css
```

`theme-light-suspended.css` resta conservato ma non caricato, per un futuro recupero della Light mode.

## Candidati obsoleti

```text
assets/css/refactor/mobile-controls-v291.css
assets/css/refactor/rosters-tables-v291.css
assets/css/refactor/mobile-controls-v292.css
assets/css/refactor/rosters-tables-v292.css
assets/css/refactor/theme-light-suspended-v292.css
```

Questi file possono essere rimossi solo se non sono piu' referenziati dagli HTML o da `assets/app.js`.

## Strumento

```bash
static/zonaorientale/tools/cleanup-css-refactor-v301.sh
```

Uso consigliato:

```bash
static/zonaorientale/tools/cleanup-css-refactor-v301.sh
static/zonaorientale/tools/cleanup-css-refactor-v301.sh --git-rm
```

Senza opzioni lo script fa solo dry-run.

## Funzionalita a rischio e preservazione

Funzionalita da non perdere:

- Listone: colonna `Modifica`, filtro `Modifiche`, usciti storici, export CSV solo Admin.
- Rose e pagina squadra: prima colonna sticky, nomi leggibili, righe compatte.
- Dashboard Presidente: tabelle rosa e controlli mobile.
- Mobile: bottom navigation, menu `Altro`, pulsante `Su`.
- Dark mode unico V289, con Light mode sospesa.
- `competition.html` e `player.html`.
- Admin: Diagnostica dati e Richieste presidenti.

Preservazione V301:

- nessuna regola CSS attiva viene modificata;
- nessun file stabile viene rimosso;
- lo script blocca la rimozione se un file obsoleto e' ancora referenziato;
- nessuna logica JS, dato JSON, Firebase o EmailJS viene toccato.

## Test minimi

```bash
static/zonaorientale/tools/cleanup-css-refactor-v301.sh
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-css-v300.sh
```

Test manuali:

- Home mobile.
- Listone pubblico: export CSV non visibile.
- Listone Admin: export CSV visibile e funzionante.
- Pagina squadra -> Rosa.
- Dashboard Presidente.
- Bottom nav, menu Altro, pulsante Su.
- `competition.html` e `player.html`.
