# FUNZIONALITAV345 - ZonaOrientale

Versione: V345 cleanup helper legacy condivisi  
Data: 05/06/2026

## Obiettivo della release

La V345 completa una pulizia controllata del refactor helper iniziato nelle versioni V294/V295 e consolidato in V341. Il file legacy `assets/js/utils/shared-helpers-v294.js` viene rimosso perche non e' piu importato dal runtime; restano attivi `assets/js/utils/shared-helpers-v295.js` e `assets/js/utils/shared-helper-bridge-v341.js`.

## Funzionalita preservate

- Home pubblica con sezioni principali, navigazione desktop/mobile e footer versione.
- Calciomercato con feed RSS/HTML, fonti TMW squadra, archivio statico, filtri, card compatte, fallback immagini/favicon/TMW, tag giocatore, timeline giocatore in modal e pannello Solo Admin.
- Listone con stagione selezionata, ricerca, ruoli, filtro `Modifiche`, colonna `Modifica`, usciti storici ed export CSV riservato Admin.
- Rose, pagina squadra e pagina giocatore standalone.
- Fantamercato interno e gestione mercato.
- Dashboard Presidente.
- Area Admin generale, Diagnostica dati con timestamp ultimo refresh, richieste presidenti e convertitore listone.
- Firebase/Auth/EmailJS.
- Netlify Functions e share News/WhatsApp.
- Mobile bottom navigation, menu `Altro`, pulsante Su e viewport mobile adattivo.

## Modifica tecnica

- Rimozione controllata di `assets/js/utils/shared-helpers-v294.js`.
- Preservati i wrapper storici in `assets/app.js`:
  - `csvEscapeV278()`;
  - `buildListoneChangeExportCsvV278()`;
  - `normalizeListoneSearchKeyV269()`;
  - `normalizeDiagnosticKeyV303()`;
  - `normalizeCalciomercatoValueV306()`.
- Helper attivi:
  - `assets/js/utils/shared-helpers-v295.js`;
  - `assets/js/utils/shared-helper-bridge-v341.js`.
- Nuovo tool:
  - `static/zonaorientale/tools/audit-shared-helpers-v345.mjs`.
- Nuova diagnostica runtime:
  - `window.ZonaOrientaleSharedHelperLegacyCleanupV345`.

## Funzionalita a rischio e mitigazione

| Area | Rischio | Mitigazione |
| --- | --- | --- |
| Export CSV Listone | perdita escape CSV o formato righe | wrapper storici preservati e bridge V341 attivo |
| Filtro Modifiche Listone | normalizzazione testo diversa | `normalizeListoneSearchKeyV269` resta wrapper compatibile |
| Diagnostica dati Admin | chiavi normalizzate diversamente | `normalizeDiagnosticKeyV303` resta wrapper compatibile |
| Calciomercato filtri | ricerca e normalizzazione diversa | `normalizeCalciomercatoValueV306` resta wrapper compatibile |
| Refactor futuri | confusione tra file rimosso e wrapper storici | documentazione e audit V345 |

## Cosa non e' stato modificato

- `docs/zonaorientale/FUNZIONALITA'.md`.
- Netlify Functions.
- `assets/calciomercato/links.json`.
- Archivi JSON Calciomercato.
- JSON Listone.
- CSS.
- Logiche Firebase/Auth/EmailJS.
- Rendering card Calciomercato, filtri, Admin, Listone, Rose e Dashboard Presidente.

## Verifiche consigliate dopo applicazione

```bash
static/zonaorientale/tools/audit-shared-helpers-v345.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

Prima dei controlli, se il file esiste ancora nella repo locale, rimuoverlo con:

```bash
git rm static/zonaorientale/assets/js/utils/shared-helpers-v294.js
```
