# HANDOFF_NUOVO_ASSISTENTE_V352

## Stato corrente

Versione runtime: V352.

La V352 completa il cleanup controllato dei CSS `mobile-hotfix-v166.css` e `mobile-hotfix-v167.css`, mantenendo attiva la suite mobile consolidata V168.

## Vincolo principale

Preservare tutte le funzionalita esistenti. Non rimuovere file legacy senza una V dedicata, audit e istruzioni `git rm` esplicite.

## File rimossi nella V352

- `static/zonaorientale/assets/css/mobile-hotfix-v166.css`
- `static/zonaorientale/assets/css/mobile-hotfix-v167.css`

## File mobile da preservare

- `static/zonaorientale/assets/css/mobile-suite-v168.css`
- `static/zonaorientale/assets/css/mobile-chrome-v223.css`
- `static/zonaorientale/assets/css/refactor/mobile-controls.css`
- `static/zonaorientale/assets/js/mobile/mobile-chrome-v220.js`
- `static/zonaorientale/assets/js/mobile/mobile-viewport.js`
- `static/zonaorientale/assets/js/mobile/mobile-tables.js`

## Diagnostica

Console browser:

```js
window.ZonaOrientaleMobileHotfixCleanupV352.runSmokeTest()
```

CLI:

```bash
static/zonaorientale/tools/audit-mobile-hotfix-v352.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

## Prossimo step consigliato

V353: audit di `theme-light-suspended.css` e `assets/js/domain/competitions.js`, senza rimozioni automatiche.
