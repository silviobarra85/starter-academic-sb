# AI Assistant Handoff V763 - Controller unico Visibilità Admin

## Scopo

V763 non modifica i dati ioSudo V752 della release V762. Corregge in modo strutturale il selettore `Visibilità Admin · V456` di ZonaOrientale e del runtime condiviso FantaEngine.

Il difetto è stato riprodotto sul codice V761:

- il click diretto su una checkbox veniva gestito sia dal comportamento nativo del browser sia dall'hardfix V761, che calcolava `!input.checked` durante la fase di attivazione e finiva per annullare il cambio;
- il runtime V456 rileggeva sempre lo stato da `localStorage`; se la persistenza non era disponibile o falliva, l'errore veniva ignorato e anche `Mostra tutte`/`Nascondi tutte` apparivano inattivi;
- il runtime base e l'hardfix avevano listener e responsabilità sovrapposti.

## Soluzione

Il file storico `admin-card-visibility-v456.js` rimane come percorso pubblico per compatibilità, ma contiene ora un solo controller V763:

- un solo listener `click` e un solo listener `change`, collegati al solo contenitore del selettore;
- nessuna inversione manuale dello stato delle checkbox;
- stato autorevole in memoria, con persistenza opzionale in `localStorage`, poi `sessionStorage`, quindi memoria;
- render del menu solo quando cambia la firma delle card;
- aggiornamento di checkbox e badge senza ricreare continuamente il DOM;
- `MutationObserver` limitato a `#adminPanel`, coalescato con `requestAnimationFrame` e inattivo sulle mutazioni interne al selettore;
- guard globale contro doppi caricamenti;
- API diagnostica e self-test interattivo.

## File runtime principali

- `static/fanta-engine/js/shared/v489/assets/js/core/admin-card-visibility-v456.js`
- `static/fanta-engine/css/shared/v487/assets/css/refactor/admin-card-visibility-v456.css`
- `static/zonaorientale/assets/js/core/admin-card-visibility-v456.js`
- `static/zonaorientale/assets/css/refactor/admin-card-visibility-v456.css`
- `static/fantapetillomantramanager/assets/js/core/admin-card-visibility-v456.js`
- `static/fantapetillomantramanager/assets/css/refactor/admin-card-visibility-v456.css`

Le copie locali restano fallback del runtime comune e devono rimanere byte-identiche.

## API e diagnostica

In Console:

```javascript
LeagueAdminCardVisibilityV456.diagnostics()
```

Self-test che prova `Mostra tutte`, una checkbox e `Nascondi tutte`, ripristinando poi lo stato iniziale:

```javascript
await LeagueAdminCardVisibilityV456.runInteractionSelfTest()
```

Il risultato atteso contiene:

```javascript
{ ok: true }
```

## Audit

```bash
node --check static/fanta-engine/js/shared/v489/assets/js/core/admin-card-visibility-v456.js
node static/zonaorientale/tools/audit-static-first-v760.mjs .
node static/zonaorientale/tools/audit-admin-card-visibility-v763.mjs .
```

Dopo il deploy:

```bash
node static/zonaorientale/tools/check-live-v763.mjs https://silviobarra.com
```

## Contratti da non rompere

- non reintrodurre listener globali `document/window` per il selettore;
- non intercettare il `click` della checkbox per invertirne manualmente `checked`;
- non rendere `localStorage` indispensabile al funzionamento della UI;
- non osservare l'intero documento;
- non aggiungere nuovi hardfix in fondo allo stesso file;
- mantenere identiche copia FantaEngine e fallback locali;
- mantenere il cache-buster del controller allineato tra le due leghe.
