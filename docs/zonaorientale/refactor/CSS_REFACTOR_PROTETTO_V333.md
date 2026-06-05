# V333 - Refactor CSS protetto Listone/Calciomercato

Data: 05/06/2026

## Obiettivo

Avviare la pulizia del codice senza cambiare comportamento runtime. La V333 separa le regole CSS specifiche del Listone dal CSS mobile generico e aggiunge documentazione/guard diagnostici per le prossime estrazioni.

## Modifiche tecniche

### CSS

- Creato `assets/css/refactor/listone.css`.
- Spostate in `listone.css` solo le regole gia presenti per:
  - altezza mobile del select `Modifiche`;
  - stile etichetta `Modifiche`.
- Rimosse le stesse regole da `assets/css/refactor/mobile-controls.css`.
- Collegato `listone.css?v=333` solo in `index.html`, dove il Listone e' renderizzato.

### Runtime

- Aggiunta diagnostica `window.ZonaOrientaleRefactorCssProtettoV333`.
- Aggiornato `DEPLOY_EXPECTED_VERSION_V181` a `333`.
- Aggiornati cache-buster/footer a V333.

### Tool

- Aggiornato `tools/check-zonaorientale.sh` per verificare:
  - presenza di `assets/css/refactor/listone.css`;
  - diagnostica V333;
  - documenti V333 principali.

## Funzionalita preservate

- Calciomercato V332: card compatte, anteprima testo nascosta, fallback immagini favicon/TMW testuale.
- Calciomercato V329: feed TMW squadra, parser RSS/HTML, download archivio a limiti alti.
- Calciomercato V327: pannello Solo Admin espandibile/riducibile.
- Listone: filtro `Modifiche`, colonna `Modifica`, usciti storici, export CSV solo Admin.
- Mobile: bottom navigation, menu `Altro`, icone stabili, nessun toggle mobile/desktop.
- Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, News/share WhatsApp.

## Funzionalita potenzialmente impattate e mitigazione

### Listone filtro Modifiche

Rischio: spostando CSS, il filtro avrebbe potuto perdere stile o altezza mobile.  
Mitigazione: non sono cambiate classi HTML/ID; le stesse regole sono state spostate in file dedicato e caricate da `index.html`.

### Mobile controls

Rischio: rimuovere regole da `mobile-controls.css` poteva alterare il menu mobile o altri form.  
Mitigazione: sono state rimosse solo regole con selettore `.listone-change-filter-v277`; il resto del CSS mobile resta invariato.

### Cache/versione

Rischio: browser poteva mantenere CSS vecchio in cache.  
Mitigazione: tutti i cache-buster principali sono passati a `?v=333`.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/css/refactor/mobile-controls.css`
- `static/zonaorientale/assets/css/refactor/listone.css`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`
- `docs/zonaorientale/CHANGELOG_CONSOLIDATO.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md`
- `docs/zonaorientale/FUNZIONALITAV333.md`
- `docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V333.md`
- `docs/zonaorientale/release/RELEASE_V333_REFACTOR_CSS_PROTETTO.md`

## Prossima estrazione consigliata

V334: estrarre le funzioni di immagine/fallback Calciomercato in un modulo dedicato, lasciando alias/fallback in `app.js` finche i test non confermano che il rendering resta invariato.
