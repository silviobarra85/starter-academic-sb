# FUNZIONALITAV355 - Stato funzionale consolidato

Versione: V355  
Data: 05/06/2026  
Tipo: suite regressione/smoke post cleanup e refactor.  
Impatto funzionale: nessun cambio funzionale previsto.

## Obiettivo V355

La V355 non introduce nuove funzionalita utente e non rimuove file. Serve a mettere in sicurezza il lavoro V333-V354 con una matrice di regressione manuale e un audit statico dedicato.

## Funzionalita da preservare

### Navigazione e shell del sito

- Home `index.html`.
- Navigazione desktop.
- Navigazione mobile bottom bar.
- Menu mobile `Altro`.
- Assenza dello switch mobile/desktop da mobile.
- Footer versione e cache-buster allineati.
- `competition.html` per dettaglio competizione.
- `player.html` per dettaglio giocatore.

### Autenticazione e ruoli

- Login Firebase/Auth.
- Utenti presidente approvati.
- Area Admin.
- Controlli condizionali per funzionalita Solo Admin.
- EmailJS e flussi collegati.

### Calciomercato

- Feed RSS classici.
- Feed HTML TMW squadra.
- Fonti in `assets/calciomercato/links.json`.
- Archivio statico `assets/calciomercato/archive/`.
- Manifest archivio.
- Filtri Cerca, Da, A, squadra, topic, fonte.
- Card articolo compatte.
- Titolo e immagine cliccabili.
- Nessuna anteprima testo nelle card.
- Fallback favicon fonte.
- Fallback tile testuale `TMW - NomeSquadra`.
- Tag giocatore sopra il titolo articolo.
- Matching giocatore con normalizzazione punteggiatura e disambiguazione maiuscole/minuscole.
- Timeline articoli giocatore in modal chiudibile con X/sfondo/Escape.
- Pannello Solo Admin espandibile/riducibile.
- Download archivio giornaliero e intervallo.

### Listone

- Caricamento listoni stagione.
- Ultimo listone della stagione selezionata.
- Filtri Listone.
- Filtro Modifiche uniformato.
- Colonna Modifica.
- Export CSV modifiche Solo Admin.
- Diagnostica ruoli listone.

### Rose e squadre

- Visualizzazione rose.
- Tabelle mobile e desktop.
- Dashboard Presidente.
- Dati squadra presidente.

### Competizioni

- Elenco competizioni.
- Ordinamento e gruppi competizioni.
- Dettaglio competizione.
- Admin competizioni.
- Modulo legacy `assets/js/domain/competitions.js` conservato ma non importato.

### Fantamercato interno e notifiche trade

- Trattative reali su Firebase.
- Notifiche proposte ricevute.
- Notifiche esiti proposte inviate.
- Badge notifiche.
- Fallback locale marcatura esiti.
- Simulatore notifiche trade canonico V255.
- Azioni locali V349 su simulazioni: Accetta/Rifiuta senza scrivere su Firebase.

### Admin e diagnostica

- Render area Admin.
- Diagnostica dati Admin.
- Timestamp italiano ultimo aggiornamento diagnostica V343.
- Richieste presidenti.
- Convertitore listone.
- Stato Firebase/JSON.
- Preflight asset pubblici.
- Promemoria pubblicazione dati.

### News e share

- News statiche.
- Netlify Function `news-share.js`.
- Condivisione WhatsApp/social dove prevista.

### Netlify Functions

- `calciomercato-feed.js`.
- `news-share.js`.
- Redirect Netlify esistenti.

## Moduli canonici dopo il refactor

- `assets/js/calciomercato/calciomercato-images-v334.js`
- `assets/js/calciomercato/calciomercato-players-v340.js`
- `assets/js/calciomercato/calciomercato-render-v338.js`
- `assets/js/calciomercato/calciomercato-filters-v339.js`
- `assets/js/calciomercato/calciomercato-admin-v340.js`
- `assets/js/utils/shared-helpers-v295.js`
- `assets/js/utils/shared-helper-bridge-v341.js`
- `assets/js/dev/trade-notification-simulator-v255.js`

## File ancora conservati volutamente

- `assets/js/refactor/admin-publication-workflow-v213.js`
- `assets/css/refactor/theme-light-suspended.css`
- `assets/js/domain/competitions.js`

Questi file non sono da cancellare automaticamente. Servono come riferimento/rollback/audit e vanno rimossi solo con task dedicato.

## Check V355

Nuovo tool:

```bash
static/zonaorientale/tools/audit-regression-smoke-v355.mjs
```

Uso consigliato:

```bash
static/zonaorientale/tools/audit-regression-smoke-v355.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

