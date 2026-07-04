# Handoff V480 - Registro sezioni unificato e fanta-engine

## Contesto

L'utente ha creato un nuovo branch e ha scelto di non fare il fix immediato della sezione Proposte regolamento. La priorita' e' iniziare la stabilizzazione architetturale: prima registro sezioni unico, poi motore comune graduale.

## Scope della V480

La V480 tocca entrambe le leghe per introdurre un registro sezioni omogeneo, ma non sposta le pagine e non rimuove funzionalita'.

File chiave:

```text
static/fanta-engine/js/core/unified-section-registry-v480.js
static/fanta-engine/tools/audit-unified-section-registry-v480.mjs
static/fantapetillomantramanager/assets/js/core/section-registry-v405.js
static/fantapetillomantramanager/assets/app.js
static/fantapetillomantramanager/assets/league-config.json
```

## Cosa e' stato fatto per FantaMantraManager

- Aggiunto motore comune `fanta-engine` con factory `createUnifiedSectionRegistryV480`.
- Convertito `section-registry-v405.js` in wrapper di lega.
- Esposti alias nuovi e legacy:
  - `FantaLeagueSectionRegistryV480`
  - `FantaMantraManagerSectionRegistryV480`
  - `FantaPetilloSectionRegistryV401-V405`
- `assets/app.js` ora preferisce il registry comune e usa `listNavItems('mobilePrimary')` per lo stato del menu mobile.
- `league-config.json` aggiornato con `currentVersion: 480`, `unifiedSectionRegistryVersion: 480` e `fantaEngineVersion: 480`.

## Funzionalita' da preservare

Non rimuovere o scollegare:

- Admin bootstrap e pannelli Admin.
- Area Squadra sbloccata.
- Card presidente EmailJS: Svincola Giocatori e Comunicato avvenuto scambio.
- Proposte regolamento V479.
- Regolamento PDF V474.
- Brand FantaMantraManager V475.
- Share Netlify V466.
- Sorteggio giornate V473.

## Prossimo step consigliato

V481: iniziare l'estrazione graduale del motore comune per footer/branding/navigation bootstrap, senza toccare Firebase o flussi presidente.

## Audit

```bash
cd static
node fanta-engine/tools/audit-unified-section-registry-v480.mjs
```

Esito verificato: `34 OK, 0 FAIL`.
