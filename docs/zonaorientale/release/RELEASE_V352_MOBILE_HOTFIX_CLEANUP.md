# RELEASE_V352_MOBILE_HOTFIX_CLEANUP

## Tipo

Refactor / cleanup controllato.

## Modifiche

- Rimozione controllata di `mobile-hotfix-v166.css` e `mobile-hotfix-v167.css`.
- Verifica che `mobile-suite-v168.css` contenga le sezioni consolidate V166/V167.
- Nuovo audit `audit-mobile-hotfix-v352.mjs`.
- Aggiornamento versione runtime/footer/cache-buster a V352.

## Impatto funzionale

Nessun cambio previsto. Le regole mobile restano attive tramite `mobile-suite-v168.css`.

## Comando rimozione

```bash
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v166.css   static/zonaorientale/assets/css/mobile-hotfix-v167.css
```

## Test

- `node --check static/zonaorientale/assets/app.js`
- `node --check static/zonaorientale/tools/audit-mobile-hotfix-v352.mjs`
- `static/zonaorientale/tools/audit-mobile-hotfix-v352.mjs`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-assets-v298.sh --quiet`
- `static/zonaorientale/tools/audit-css-v300.sh`
