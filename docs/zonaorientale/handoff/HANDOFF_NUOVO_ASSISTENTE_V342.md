# Handoff nuovo assistente AI - V342

## Stato versione

Versione corrente: V342  
Data: 05/06/2026  
Branch di lavoro tipico: `refactor/260528-zonaorientale-next`  
Obiettivo: refactor progressivo e protetto senza perdere funzionalita.

## Modifica V342

La V342 introduce un audit dedicato ai file legacy/candidati orfani:

```text
assets/tools: non usare, il tool corretto e' in:
static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs
```

Il tool scansiona HTML, JS, MJS e CSS del sito e segnala:

- riferimenti locali mancanti;
- file versionati superati;
- altri JS/CSS non referenziati direttamente.

La modifica e' audit-only. Non rimuove file e non cambia UI o comportamento runtime.

## Diagnostica runtime

In console browser:

```js
window.ZonaOrientaleLegacyDependencyAuditV342
```

Deve esporre:

```js
{
  version: "V342",
  tool: "tools/audit-legacy-dependencies-v342.mjs",
  safeMode: true
}
```

## Tool da usare prima di ogni rimozione futura

```bash
node static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs --quiet
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
static/zonaorientale/tools/check-zonaorientale.sh
```

## Candidati emersi

La matrice di rischio e' in:

```text
docs/zonaorientale/audit/LEGACY_DEPENDENCIES_MATRIX_V342.md
```

Punti da trattare con massima cautela:

- `assets/js/calciomercato/calciomercato-players-v335.js` e `v337.js`: sembrano superati da V340, ma sono storici della timeline/tag giocatore.
- `assets/js/utils/shared-helpers-v294.js`: superato da V295/V341, ma va verificato con grep.
- CSS `mobile-controls-v291/v292`, `rosters-tables-v291/v292`, `theme-light-suspended-v292`: sembrano superati dagli alias stabili, ma vanno verificati su mobile.
- Simulatori trade notification duplicati: verificare Admin/dev prima di rimuovere.

## Funzionalita da preservare

- Calciomercato feed RSS/HTML, fonti TMW squadra, archivio statico e download Admin.
- Fallback immagini/favicon/TMW testuale.
- Card compatte, filtri, renderer, matching giocatore e modal timeline.
- Listone, filtro Modifiche, colonna Modifica, export CSV solo Admin.
- Rose, Fantamercato interno, Dashboard Presidente, Admin.
- Firebase/Auth/EmailJS.
- News/share WhatsApp.
- Mobile bottom nav e menu Altro.

## Prossima modifica consigliata

V343: pulizia controllata di un solo gruppo di candidati, preferibilmente CSS refactor versionati vecchi, ma solo dopo conferma. Non fare rimozioni multiple insieme.

## File da non toccare senza richiesta esplicita

```text
docs/zonaorientale/FUNZIONALITA'.md
```
