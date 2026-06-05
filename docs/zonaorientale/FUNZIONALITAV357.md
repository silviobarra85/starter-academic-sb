# FUNZIONALITAV357 - Checklist QA da interfaccia Admin

Versione: V357  
Data: 05/06/2026

## Obiettivo

Aggiungere una checklist grafica, visibile solo agli admin, per provare le funzionalita principali post-refactor senza dover usare la console browser.

## Nuova funzionalita V357

- Bottom area fissa **Checklist QA Admin**.
- Visibile solo quando `state.isAdmin` e attivo.
- Pannello espandibile/riducibile.
- Stato salvato in `localStorage` con la stessa chiave del tracker V356: `zonaorientale.manualQa.v356`.
- Pulsanti rapidi per aprire le sezioni da testare.
- Pulsante simulazione per il test del simulatore trade.
- Stati manuali: OK, Problema, Saltato, Reset.
- Note testuali per ogni controllo.
- Export riepilogo Markdown.

## Funzionalita preservate

Restano preservate tutte le funzionalita gia presenti fino alla V356: Calciomercato, Listone, Rose, Competizioni, Dashboard Presidente, Fantamercato, notifiche trade reali/simulate, Admin, Diagnostica dati, Firebase/Auth/EmailJS, Netlify Functions, mobile navigation, competition.html e player.html.

## File principali

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/audit-manual-qa-panel-v357.mjs`
- `docs/zonaorientale/test/MANUAL_QA_INTERFACCIA_V357.md`

## Note

`docs/zonaorientale/FUNZIONALITA'.md` non e stato modificato.
