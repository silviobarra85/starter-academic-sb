# Overlay V757 - No boot loader mobile hardfix

## Scopo
Disattiva completamente il caricamento iniziale della pagina ZonaOrientale.
Il sito deve entrare direttamente nella home senza overlay percentuale.

## File modificati
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/league-config.json`
- `docs/AI_ASSISTANT_HANDOFF_CURRENT.md`
- `docs/AI_ASSISTANT_HANDOFF_V757.md`

## Verifiche
```bash
grep -n "fantaBootPreloader" static/zonaorientale/index.html
grep -n "boot-preloader" static/zonaorientale/index.html
grep -n "app.js?v=757" static/zonaorientale/index.html
node --check static/zonaorientale/assets/app.js
```

`fantaBootPreloader` e `boot-preloader` non devono comparire come loader attivo.
