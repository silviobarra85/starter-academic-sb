# FUNZIONALITA V342 - Audit dipendenze legacy protetto

Versione: V342  
Data: 05/06/2026  
Ambito: audit file candidati orfani e dipendenze legacy, senza cancellazioni automatiche.

## Obiettivo

Proseguire il refactor preservando tutte le funzionalita presenti all'ultimo merge su master e nelle release V333-V341. La V342 non rimuove file, non cambia UI, non cambia dati e non modifica logiche Firebase, Netlify o Calciomercato.

La V342 aggiunge uno strumento di audit per capire quali file JS/CSS sembrano non referenziati direttamente o superati da versioni piu recenti. I risultati sono solo candidati: prima di ogni `git rm` servono grep, test browser e conferma esplicita.

## Funzionalita V342

- Creato `static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs`.
- Il tool analizza HTML, JS, MJS e CSS del sito.
- Rileva riferimenti locali mancanti.
- Produce una lista di candidati versionati superati.
- Produce una lista di altri JS/CSS non referenziati direttamente.
- Inserisce una policy esplicita: nessuna cancellazione automatica.
- Aggiunta diagnostica runtime:

```js
window.ZonaOrientaleLegacyDependencyAuditV342
```

- Aggiornato `check-zonaorientale.sh` per verificare tool, marker e documentazione V342.

## Candidati emersi dall'audit

I candidati principali sono documentati in:

```text
docs/zonaorientale/audit/LEGACY_DEPENDENCIES_MATRIX_V342.md
```

Categorie emerse:

- CSS mobile/refactor versionati vecchi.
- Vecchi moduli player matching Calciomercato V335/V337, superati da V340.
- Helper condiviso V294, superato da V295/V341.
- Simulatori trade notification duplicati/versionati.
- Modulo `admin-publication-workflow-v213.js` non referenziato direttamente.

## Funzionalita preservate

- Calciomercato feed RSS/HTML.
- Fonti TMW squadra V329.
- Tile testuale `TMW - NomeSquadra` V330.
- Fallback favicon/fonte V328/V334.
- Card compatte V332.
- Renderer card V338.
- Filtri Calciomercato V339.
- Pannello Solo Admin archivio V340.
- Matching giocatore V340 con disambiguazione maiuscole/minuscole.
- Modal timeline giocatore V336.
- Archivio statico Calciomercato V323/V324.
- Download archivio statico giornaliero/intervallo dal pannello Admin Calciomercato.
- Listone, filtro Modifiche, colonna Modifica, usciti storici.
- Export CSV Listone solo Admin.
- Rose e pagina squadra.
- Fantamercato interno.
- Dashboard Presidente.
- Admin generale e Diagnostica dati.
- Firebase/Auth/EmailJS.
- News/share WhatsApp.
- Mobile bottom navigation e menu Altro.
- `competition.html` e `player.html`.

## File principali

```text
static/zonaorientale/assets/app.js
static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
docs/zonaorientale/FUNZIONALITAV342.md
docs/zonaorientale/audit/LEGACY_DEPENDENCIES_MATRIX_V342.md
docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V342.md
docs/zonaorientale/refactor/LEGACY_DEPENDENCIES_AUDIT_V342.md
docs/zonaorientale/release/RELEASE_V342_LEGACY_DEPENDENCIES_AUDIT.md
```

## Comandi utili

```bash
node static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs
node static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs --quiet
node static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs --json
static/zonaorientale/tools/check-zonaorientale.sh
```

## Regola vincolante

Non cancellare file candidati in automatico. La V342 serve a preparare una futura pulizia controllata, non a eseguirla.

Non modificato `docs/zonaorientale/FUNZIONALITA'.md`.
