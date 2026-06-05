# Handoff nuovo assistente - V345

## Stato corrente

La versione corrente e' V345. La release rimuove in modo controllato il vecchio helper `assets/js/utils/shared-helpers-v294.js`, gia superato da `assets/js/utils/shared-helpers-v295.js` e dal bridge `assets/js/utils/shared-helper-bridge-v341.js`.

## File principali V345

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/audit-shared-helpers-v345.mjs`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `docs/zonaorientale/FUNZIONALITAV345.md`
- `docs/zonaorientale/audit/SHARED_HELPER_LEGACY_CLEANUP_MATRIX_V345.md`
- `docs/zonaorientale/refactor/SHARED_HELPER_LEGACY_CLEANUP_V345.md`
- `docs/zonaorientale/release/RELEASE_V345_SHARED_HELPER_LEGACY_CLEANUP.md`

## Regola importante

Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita dell'utente.

## Wrapper da non rinominare automaticamente

Anche se hanno suffissi vecchi, questi nomi sono ancora API interne compatibili e vanno preservati:

- `csvEscapeV278`
- `buildListoneChangeExportCsvV278`
- `normalizeListoneSearchKeyV269`
- `normalizeDiagnosticKeyV303`
- `normalizeCalciomercatoValueV306`

## Funzionalita da preservare nei prossimi interventi

- Calciomercato completo: feed, archivi, TMW squadra, fallback immagini, card, tag giocatore, timeline modal, filtri, pannello Solo Admin.
- Listone: ricerca, ruoli, filtro Modifiche, export CSV Admin, usciti storici.
- Admin: Diagnostica dati, timestamp refresh V343, richieste presidenti, convertitore listone.
- Rose, pagina squadra, pagina giocatore, Dashboard Presidente e Fantamercato interno.
- Firebase/Auth/EmailJS, Netlify Functions, share News/WhatsApp e mobile navigation.

## Applicazione locale

Lo zip non puo cancellare file gia presenti. Dopo il `cp -R`, se `shared-helpers-v294.js` e' ancora tracciato, serve:

```bash
git rm static/zonaorientale/assets/js/utils/shared-helpers-v294.js
```

Poi eseguire:

```bash
static/zonaorientale/tools/audit-shared-helpers-v345.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

## Prossimo passo consigliato

V346: audit controllato dei candidati legacy minori rimasti, senza cancellazioni automatiche. Eventuale rimozione solo un gruppo alla volta dopo verifica.
