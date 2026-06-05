# Handoff nuovo assistente AI - ZonaOrientale V333

Data: 05/06/2026  
Versione corrente: V333 - refactor CSS protetto

## Contesto essenziale

Il sito e' una webapp statica in `static/zonaorientale/`, con documentazione in `docs/zonaorientale/`. La regola assoluta e': nessuna funzionalita esistente deve essere cancellata, scollegata o persa durante pulizia/refactor.

La V333 parte dall'ultimo stato master con Calciomercato evoluto fino a V332 e introduce un refactor a rischio basso: separa il CSS Listone dal CSS mobile generico.

## Cosa ha fatto la V333

- Creato `assets/css/refactor/listone.css`.
- Spostate da `mobile-controls.css` a `listone.css` solo le regole Listone del filtro `Modifiche`.
- Collegato `listone.css?v=333` in `index.html`.
- Aggiornati cache-buster/footer a V333.
- Aggiornata diagnostica runtime con `window.ZonaOrientaleRefactorCssProtettoV333`.
- Aggiornato `check-zonaorientale.sh` per controllare la presenza del refactor V333.
- Aggiunto `FUNZIONALITAV333.md`, lista estesa delle funzionalita da preservare nei prossimi refactor.

## Cosa NON ha fatto la V333

- Non ha modificato Firebase/Auth/EmailJS.
- Non ha modificato Netlify Function.
- Non ha modificato `links.json`, manifest, JSON archivio Calciomercato, listoni o rose.
- Non ha modificato rendering, filtri o parser Calciomercato.
- Non ha modificato logiche Listone/export, solo CSS.
- Non ha modificato `FUNZIONALITA'.md`.

## File principali del sito

- `static/zonaorientale/index.html`: app principale, include CSS e `app.js`.
- `static/zonaorientale/assets/app.js`: runtime principale, ancora molto grande; non riscrivere in blocco.
- `static/zonaorientale/assets/styles.css`: CSS base globale.
- `static/zonaorientale/assets/css/refactor/calciomercato.css`: CSS Calciomercato.
- `static/zonaorientale/assets/css/refactor/mobile-controls.css`: controlli mobile generici.
- `static/zonaorientale/assets/css/refactor/listone.css`: CSS Listone introdotto in V333.
- `netlify/functions/calciomercato-feed.js`: feed Calciomercato RSS/HTML TMW.
- `netlify/functions/news-share.js`: preview WhatsApp comunicati.

## Funzionalita critiche da preservare

Leggere `docs/zonaorientale/FUNZIONALITAV333.md` prima di ogni refactor. In sintesi:

- News e share WhatsApp.
- Rose, pagina squadra e snapshot storici.
- Fantamercato interno.
- Listone con filtro `Modifiche`, colonna `Modifica`, usciti storici ed export CSV solo Admin.
- Competizioni e pagina `competition.html`.
- Archivio, statistiche, confronto squadre, albo, palmares, FIFA Ranking.
- Dashboard Presidente, trattative, comunicati, svincoli, EmailJS.
- Area Admin, pubblicazione, diagnostica, backup, richieste presidenti.
- Calciomercato: feed RSS/HTML, TMW squadre, archivio statico, filtri, range, card compatte, fallback immagini, pannello Solo Admin.
- Mobile bottom nav, menu Altro, icone, assenza toggle mobile/desktop.

## Regole operative per prossimi refactor

1. Fare una sola area per versione.
2. Non rinominare ID/classi DOM usate da JS.
3. Non cancellare file legacy solo perche sembrano inutilizzati: usare audit e grep.
4. Prima di rimuovere duplicati, cercare tutti i riferimenti in HTML, JS, CSS e docs.
5. Ogni versione deve aggiornare cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181`.
6. Ogni versione deve avere handoff, release doc e, se richiesta, documento funzionalita separato.
7. `FUNZIONALITA'.md` si modifica solo su richiesta esplicita.
8. Lo zip di consegna deve contenere solo file modificati e le radici `zonaorientale/` e `docs/`.

## Comandi test minimi

```bash
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
node --check static/zonaorientale/assets/app.js
```

Se viene toccata Netlify Function:

```bash
node --check netlify/functions/calciomercato-feed.js
node --check netlify/functions/news-share.js
```

## Prossima versione consigliata

V334: estrarre la gestione immagini/fallback Calciomercato in un modulo dedicato, senza cambiare il rendering delle card. Procedere con alias temporanei in `app.js` e diagnostica runtime.
