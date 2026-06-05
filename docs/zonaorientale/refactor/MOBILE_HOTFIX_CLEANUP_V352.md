# MOBILE_HOTFIX_CLEANUP_V352

## Sintesi

La V352 rimuove i due CSS legacy `mobile-hotfix-v166.css` e `mobile-hotfix-v167.css` come file separati. Le relative regole risultano gia incluse in `mobile-suite-v168.css`, che resta importato dagli HTML principali.

## Perche e sicuro

- Gli HTML non linkavano piu direttamente i due hotfix.
- `mobile-suite-v168.css` dichiara e contiene le sezioni consolidate V166/V167.
- La navigazione mobile continua a dipendere da `mobile-suite-v168.css`, `mobile-chrome-v223.css` e `mobile-controls.css`.
- Nessuna classe HTML o funzione JS e stata rinominata.

## File modificati

- `assets/app.js`: marker runtime V352 e versione deploy.
- `index.html`, `competition.html`, `player.html`: cache-buster/footer V352.
- `tools/check-zonaorientale.sh`: controlli V352.
- `tools/audit-mobile-hotfix-v352.mjs`: nuovo audit dedicato.
- Documentazione V352.

## File da rimuovere via git rm

```bash
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v166.css   static/zonaorientale/assets/css/mobile-hotfix-v167.css
```

## Regressioni da evitare

- Perdita menu mobile `Altro`.
- Perdita bottom navigation.
- Rottura tabelle mobile Rose/Listone.
- Rottura card Calciomercato mobile.
- Problemi contrasto light/dark.
