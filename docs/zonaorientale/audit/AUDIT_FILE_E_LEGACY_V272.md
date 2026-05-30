# Audit file e legacy V272

Questo documento organizza i file sospetti/legacy e indica cosa fare senza rischiare perdita funzionalita.

## File da mantenere per ora

### `assets/js/domain/competitions.js`

Stato: sotto audit.  
Motivo: competizioni, classifiche e calendario sono funzionalita centrali. Il file puo' essere parzialmente sostituito da logiche inline, ma non va rimosso senza test mirato su:

- `#competitions`
- `competition.html`
- Archivio competizioni
- Admin -> Competizioni
- Albo/Statistiche collegate

### `assets/js/refactor/admin-publication-workflow-v213.js`

Stato: legacy/scollegato probabile.  
Motivo: il workflow pubblicazione attivo e' inline in `app.js`, ma il modulo esterno va rimosso solo dopo conferma che non sia usato da import dinamici o vecchi flussi.

### `news.html`, `comunicati/*.html`, `tools/generate-news-share-pages.mjs`

Stato: compatibilita legacy.  
Motivo: il flusso moderno delle preview e' `/zonaorientale/share/news/<id>` via Netlify Function, ma i file statici possono ancora servire per link vecchi.

## File candidati a pulizia sicura se ancora presenti

- `assets/js/trade-notification-simulator-v255.js` duplicato non canonico.
- `assets/js/dev/trade-notification-simulator-v254.js` sostituito da V255 con alias V254.
- `assets/css/mobile-hotfix-v166.css` e `mobile-hotfix-v167.css`, contenuti inglobati in `mobile-suite-v168.css`.
- `.DS_Store`, `__MACOSX`, `._*`.

Prima di rimuovere, verificare:

```bash
git status
ls static/zonaorientale/assets/js/dev/trade-notification-simulator-v255.js
```

La posizione canonica del simulatore e':

```text
static/zonaorientale/assets/js/dev/trade-notification-simulator-v255.js
```

## Organizzazione documenti consigliata

La documentazione corrente resta compatibile nella cartella principale, ma i nuovi documenti V272 sono organizzati in cartelle:

```text
docs/zonaorientale/handoff/
docs/zonaorientale/audit/
docs/zonaorientale/pianificazione/
docs/zonaorientale/release/
```

Non spostare automaticamente i documenti storici finche' non si decide una migrazione completa, per evitare riferimenti rotti nei messaggi/guide precedenti.
