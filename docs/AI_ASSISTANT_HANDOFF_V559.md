# AI Assistant handoff V559

## Stato

Overlay: V559 - Boot preloader multi-lega.

## Decisione principale

Per migliorare la percezione del caricamento iniziale, soprattutto su ZonaOrientale, e stato aggiunto un preloader visivo condiviso con rotellina e percentuale. La patch non prova a velocizzare il boot caricando piu dati in anticipo: mantiene il ripristino V558 e non reintroduce i layer runtime pesanti.

## File runtime principali

- `static/fanta-engine/css/boot-preloader-v559.css`
- `static/fanta-engine/js/ui/boot-preloader-v559.js`
- `static/zonaorientale/index.html`
- `static/fantapetillomantramanager/index.html`
- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/fanta-engine/tools/audit-boot-preloader-v559.mjs`

## Guardrail

- Preloader solo visivo: non carica dati e non cambia router.
- Firebase, EmailJS, Admin, Presidente, Netlify Functions, Listoni e Calciomercato invariati.
- Non reintrodurre `navigation-data-refresh`, `public-data-autoload`, `dashboard-enforce` o `eager-data-preload` nel runtime ordinario.
- `FUNZIONALITA'.md` non modificato.

## Test consigliati

```bash
node static/fanta-engine/tools/audit-boot-preloader-v559.mjs
```

Poi test manuale su entrambe le leghe con cache pulita.
