# FUNZIONALITA V352 - Cleanup mobile hotfix legacy

Versione: V352  
Data: 05/06/2026

## Obiettivo

Pulizia controllata dei CSS mobile legacy `mobile-hotfix-v166.css` e `mobile-hotfix-v167.css`, gia inglobati in `mobile-suite-v168.css` e non linkati dagli HTML correnti.

## Funzionalita preservate

- Navigazione mobile inferiore.
- Menu mobile `Altro`, incluse icone dinamiche.
- Vista mobile senza switch manuale desktop/mobile.
- Layout mobile delle card Calciomercato.
- Tabelle mobile Rose/Listone.
- Tema light/dark e contrasto mobile.
- `competition.html` e `player.html` con mobile chrome.
- Calciomercato feed, archivi, filtri, card compatte, tag giocatore e modal timeline.
- Listone, export admin-only, filtro Modifiche.
- Rose, Dashboard Presidente, Fantamercato interno e notifiche trade.
- Admin, Diagnostica dati, Stato Firebase/JSON e preflight pubblicazione.
- Firebase/Auth/EmailJS, Netlify Functions e share News.

## File rimossi con git rm

- `static/zonaorientale/assets/css/mobile-hotfix-v166.css`
- `static/zonaorientale/assets/css/mobile-hotfix-v167.css`

## File attivi da preservare

- `static/zonaorientale/assets/css/mobile-suite-v168.css`
- `static/zonaorientale/assets/css/mobile-chrome-v223.css`
- `static/zonaorientale/assets/css/refactor/mobile-controls.css`
- `static/zonaorientale/assets/css/refactor/rosters-tables.css`
- `static/zonaorientale/assets/css/refactor/listone.css`
- `static/zonaorientale/assets/css/refactor/calciomercato.css`

## Test obbligatori

- `static/zonaorientale/tools/audit-mobile-hotfix-v352.mjs`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-assets-v298.sh --quiet`
- `static/zonaorientale/tools/audit-css-v300.sh`
