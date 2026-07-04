## Aggiornamento V503 - Browser smoke tests

Aggiunti smoke test Playwright nel motore comune per intercettare errori console, 404 e problemi runtime reali prima dei prossimi refactor dashboard.

## V494 - Prossimi passi dopo motore comune

Il motore comune e' stabile come sorgente primaria per registry, presentazione, asset dati comuni, CSS e moduli JS selettivi. La pulizia fisica dei duplicati locali e' rimandata. Le prossime migliorie consigliate sono test branch deploy, fix UI Proposte regolamento, audit dinamico browser, adapter EmailJS/Firebase e template nuova lega.

## Aggiornamento V493 - Branch pronto per verifica merge

Il ciclo V480-V493 ha introdotto registry, presentazione, data paths, asset comuni, CSS e una parte sicura dei JS nel motore comune. Le copie locali restano fallback. La pulizia duplicati e' rimandata a una eventuale V494 solo su richiesta esplicita.

## Aggiornamento V492 - Stabilizzazione prima del merge

La V492 non centralizza altri file: aggiunge un audit regressione runtime esteso. Questo rende piu' sicuro procedere al consolidamento finale V493 e, se richiesto, al merge del branch su `master`.


## Aggiornamento V487 - CSS comuni nel motore centrale (24/06/2026)

- Runtime avanzato a V487 con footer/cache-buster coerenti.
- I CSS comuni identici sono copiati in `static/fanta-engine/css/shared/v487/` e caricati come sorgente primaria.
- Le copie locali restano presenti e fungono da fallback.
- Nessun JS runtime viene centralizzato in questa versione.
- Nessuna modifica a Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra, news, regolamenti, bilanci, listoni o calciomercato.

# FantaMantraManager - Roadmap motore unico multi-lega

Aggiornato alla **V485**.

## Obiettivo

Creare un motore comune che permetta di aggiungere una nuova lega con poche operazioni: config dedicata, dati dedicati, branding dedicato e pochi asset specifici. Il refactor deve essere incrementale e non deve cancellare funzionalita'.

## Stato attuale del motore comune

Gia' presente:

```text
static/fanta-engine/
```

Componenti introdotti:

- V480: `unified-section-registry-v480.js` per registro sezioni comune.
- V481: `league-presentation-v481.js` per metadata, branding, footer e menu mobile.
- V482: audit anti-contaminazione multi-lega.
- V484: inventario osservativo asset comuni listone/calciomercato, 42 candidati identici, nessuno spostamento runtime.

I siti specifici restano in:

```text
static/zonaorientale/
static/fantapetillomantramanager/
```

## Prossime estrazioni consigliate

### 1. Registry sezioni piu' dichiarativo

Rendere il registry la fonte unica per:

- hash/section id;
- titolo;
- visibilita' pubblica/presidente/admin;
- voce menu desktop;
- voce menu mobile;
- card dashboard;
- leghe abilitate.

Questo riduce il rischio di funzioni presenti nel codice ma invisibili in UI.

### 2. Bootstrap presentazione e navigazione

Rafforzare il motore V481 con:

- helper unico per caricare config lega;
- helper unico per footer;
- helper unico per meta/social;
- helper unico per mobile More;
- fallback locale per non rompere le pagine standalone.

### 3. Asset statici comuni: listoni e calciomercato

La V484 ha completato l'inventario osservativo: 42 file candidati in `assets/listoni`, `assets/calciomercato`, JS correlati e CSS risultano identici tra ZonaOrientale e FantaMantraManager. L'inventario e' salvato in:

```text
static/fanta-engine/data/shared-assets-inventory-v484.json
```

Audit dedicato:

```text
static/fanta-engine/tools/audit-shared-assets-inventory-v484.mjs
```

Decisione: non spostare ancora i path runtime e non cancellare copie locali.

Passi consigliati per V485 o successiva:

1. Copiare, non spostare, i file comuni in `static/fanta-engine/data/`.
2. Aggiungere config per path comuni e fallback ai path locali.
3. Aggiornare loader Listone/Player/Calciomercato con fallback esplicito.
4. Mantenere le copie locali finche' audit e test manuali non sono verdi.
5. Aggiungere audit dedicato per 404/path e anti-contaminazione dati.

Non centralizzare senza fallback file che in futuro potrebbero contenere rose, roster, costi o squadre specifiche.

### 4. Wrapper Firebase e separazione leagueId

Solo dopo stabilizzazione UI:

- aggiungere helper comune per query con `leagueId`;
- garantire filtri lega in ogni query;
- documentare rules per nuove collections;
- evitare spostamenti improvvisi di schema.

### 5. EmailJS wrapper comune

Possibile estrazione sicura:

- wrapper comune di invio;
- config lega-specifica per service/template/destinatari;
- audit che vieti destinatari errati tra leghe.

## Cosa non refactorare subito

- Admin completo.
- Area Squadra.
- Import controllato Firestore.
- Rules Firebase.
- Snapshot dati reali.

Queste aree hanno alto rischio regressione e vanno toccate solo con audit mirati e verifica manuale.

## Checklist prima di centralizzare listoni/calciomercato

- Listone si apre su entrambe le leghe.
- Scheda giocatore si apre da entrambe le leghe.
- Filtri ruolo/classico/mantra funzionano.
- Calciomercato e Fantamercato caricano i manifest attesi.
- Nessun file comune contiene nomi squadra specifici di ZonaOrientale o FantaMantraManager.
- Audit anti-contaminazione V482 resta verde.


## V485 - Centralizzazione prudente completata

La V485 ha eseguito il primo passaggio operativo sugli asset comuni listone/calciomercato:

- i 42 file identici censiti in V484 sono stati copiati in `static/fanta-engine/data/shared-assets/v485/`;
- le config delle due leghe puntano al path centrale come primary;
- i path locali restano fallback e non sono stati cancellati;
- i loader Listone e Calciomercato hanno fallback esplicito;
- CSS/JS comuni restano ancora caricati dai path locali per ridurre il rischio.

Prossimo passo: non cancellare le copie locali. Prima raccogliere test manuali verdi su Listone, Player e Calciomercato.

## V486 - Asset runtime CSS/JS

La V486 censisce 60 asset CSS/JS identici tra le due leghe. I moduli divergenti restano lega-specifici. Prossimo passo consigliato: centralizzazione prudente dei soli CSS comuni prima dei moduli JS.

## Aggiornamento V488

V488 aggiunge l'inventario delle dipendenze JS comuni (`shared-js-dependency-inventory-v488.json`) senza spostare i JS runtime e senza cancellare copie locali.

## V489 - JS classici comuni centralizzati

La V489 centralizza in `static/fanta-engine/js/shared/v489/` i soli script classici e autonomi risultati identici tra le due leghe: `admin-card-visibility-v454.js`, `admin-card-visibility-v455.js` e `admin-card-visibility-v456.js`. Le pagine `index.html` caricano ora il runtime V456 dal motore comune con fallback locale tramite `data-local-fallback`; le copie locali non vengono cancellate. Restano fuori `app.js`, Firebase, EmailJS, `league-config`, section registry e tutti i moduli ES con import relativi.

## V490 - Adapter comune per path dati

La V490 introduce `static/fanta-engine/js/core/data-paths-v490.js`, un adapter comune e senza dipendenze per risolvere i path dati (`dataPaths.*`) e per caricare JSON con catena primary/fallback. I loader `static-files-service.js` delle due leghe e della copia annidata ZonaOrientale usano l'adapter con import dinamico e fallback locale: se il motore comune non si carica, restano attive le funzioni locali V446/V485. Non sono stati spostati ulteriori dati e non sono state cancellate copie locali.

## V491 - Moduli JS comuni nel motore

La V491 centralizza selettivamente 12 moduli JS comuni e identici in `static/fanta-engine/js/shared/v491/`. Solo 11 moduli sono usati come import runtime primari da `assets/app.js`; `calciomercato-players-v340.js` viene copiato nel motore ma non viene ancora agganciato perché il runtime usa una versione diversa. Le copie locali restano in entrambe le leghe e nella copia annidata ZonaOrientale: non sono stati cancellati fallback/rollback locali. Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra, news, regolamenti, bilanci, listoni e calciomercato dati non sono stati modificati.


## V495 - Cleanup nested static ZonaOrientale

- Dismessa la copia annidata `static/zonaorientale/static` tramite `git rm` esplicito dopo overlay.
- Audit V495 aggiornati per non dipendere più dalla copia annidata.
- Redirect Netlify di sicurezza `/zonaorientale/static/* -> /zonaorientale/:splat`.


## Aggiornamento V496

Il motore comune ora contiene anche un primo layer UI generico (`fanta-engine/js/ui/components-v496.js`) usato dal presentation engine. Il prossimo passo consigliato e' V497: registry unico delle card/funzionalita'.

## Aggiornamento V500 - Dashboard cards engine

La V500 introduce il motore comune `static/fanta-engine/js/ui/dashboard-cards-engine-v500.js`.

Il motore usa il registry V497 per produrre snapshot delle card Admin/Presidente e per marcare gli elementi gia' presenti nel DOM. La modalita' resta `observe-first`, quindi non forza ancora la visibilita' delle card e non sostituisce il rendering locale.

Prossime tappe consigliate: V501 Tool engine comune, V502 Template nuova lega, V503 Test browser Playwright.

## Aggiornamento V502 - Template nuova lega

Aggiunti `static/_league-template`, `create-league-v502.mjs` e audit dedicato. Il template non modifica il runtime delle leghe esistenti e richiede revisione manuale prima di qualsiasi go-live.


## Aggiornamento V504

Dashboard cards engine comune in modalita' `safe-enforce`: il registry V497 governa la visibilita' delle card role-gated senza cancellare DOM, dati o fallback locali.

## Aggiornamento V505

V505 ha introdotto i dashboard renderer helpers comuni in `static/fanta-engine/js/ui/dashboard-renderer-helpers-v505.js` e ha migrato la shell `renderAdminPanel` verso il motore comune, preservando logiche locali, Firebase, EmailJS e fallback.



## Aggiornamento V506 - Tool/form validators comuni

La V506 aggiunge validatori comuni puri in `static/fanta-engine/js/core/form-validators-v506.js` e collega il Sorteggio giornate al motore `matchday-draw-engine-v506.js`, mantenendo fallback locale V473. Prossimi overlay previsti: V507 template hardening, V508 Playwright hardening, V509 renderer dashboard graduali, V510 report pre-merge.


## V507 - League template hardening

- Aggiunto generatore nuova lega V507 con controlli piu' severi.
- Aggiunto validatore config V507 e checklist go-live.
- Netlify resta manuale: nessuna modifica automatica ai redirect.
- Nessun impatto su Firebase, EmailJS o runtime delle leghe esistenti.


## V508 - Playwright hardening

- Aggiunto smoke test browser V508 con mobile/desktop.
- Report JSON/Markdown locale.
- Controlli su footer, brand, asset, navigazione e riferimenti Listone/Calciomercato.
- Nessuna mutazione Firebase/EmailJS/dati.


## V510 - Navigation actions fix

Aggiunto motore comune `fanta-engine/js/ui/navigation-actions-v510.js` per intercettare in delega pulsanti/link `[data-page-link]` e `[data-v42-page-link]`. Corregge i pulsanti dinamici che non portavano sempre alla sezione relativa. Roadmap aggiornata anche in `docs/OVERLAY_ROADMAP.md`.


## Aggiornamento V518

Hotfix runtime whole-site completato. L’obiettivo resta convergere verso motore unico mantenendo overlay applicabili da radice `static/` e `docs/`, senza patch per singola lega.


## Aggiornamento V518

Overlay whole-site di recovery runtime: cache-buster V518, alias autoload V518 e controllo esplicito contro residui `league-config-v443.js?v=512` su entrambe le leghe. `FUNZIONALITA'.md` non modificato.
