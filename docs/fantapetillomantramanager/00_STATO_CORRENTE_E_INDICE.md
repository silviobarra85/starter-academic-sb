## V569 - Prima colonna rosa Area Squadra mobile compatta

La V569 applica anche a FantaMantraManager il CSS mobile separato per rendere piu' compatta la prima colonna sticky della tabella rosa in Area Squadra / profilo squadra. Rose espanse e Listone restano separati e governati da V568, cosi' le future modifiche non si influenzano a vicenda. La patch e' solo presentazionale e non modifica dati, Firebase, EmailJS, Admin, permessi o snapshot.

## V568 - Tabelle giocatori mobile adattive e separate

La V568 corregge il layout mobile delle tabelle con giocatori: Area Squadra, Rose espanse e Listone hanno regole CSS separate. La prima colonna della rosa in Area Squadra resta sticky/opaca e non tronca piu' il nome giocatore; tutti i contenuti delle celle sono allineati a sinistra; le colonne si adattano al contenuto piu' lungo grazie al layout automatico e allo scroll orizzontale mobile. La V567 resta attiva per mantenere lo sfondo opaco della prima colonna. Sono preservati dati, snapshot, Firebase, EmailJS, Admin, permessi e Calciomercato disattivato. `FUNZIONALITA'.md` non e' stato modificato.

## V567 - Prima colonna Rose/Area Squadra opaca da mobile

La V567 applica anche a FantaMantraManager il CSS comune mobile-only per rendere opaca la prima colonna sticky nelle tabelle Rose e Area Squadra. L'intervento e' solo presentazionale e non modifica dati, Firebase, EmailJS, Admin, permessi o snapshot.

## V560 - Boot preloader interactive-ready

La V560 corregge la V559 anche su FantaMantraManager: il preloader si chiude solo dopo render app, `window.load`, controlli DOM essenziali e quiet frame del main thread. La percentuale non ruota; ruota solo l'anello della rotellina. Firebase, EmailJS, Admin, Presidente, router e dati restano invariati.

## V559 - Boot preloader multi-lega

La V559 aggiunge un preloader visivo comune con rotellina e percentuale progressiva su entrambe le leghe. Il runtime resta quello nativo ripristinato in V558: nessun preload/autoload pesante viene reintrodotto, Firebase/EmailJS/Admin/Presidente non cambiano.

## V494 - Cleanup readiness duplicati locali

La V494 aggiunge un piano e un audit per le copie locali duplicate centralizzate in V485-V491. Non cancella file: i fallback locali restano obbligatori fino a test reali post-merge e richiesta esplicita. Runtime e footer avanzano a V494.

## V493 - Merge readiness branch V480-V493

La V493 chiude il ciclo di stabilizzazione V480-V493: aggiunge checklist finale, audit merge readiness e documenta lo stato del motore comune. Non vengono cancellate copie locali e non vengono modificati Firebase/Admin/EmailJS.

## V492 - Audit regressione runtime esteso

La V492 aggiunge `static/fanta-engine/tools/audit-runtime-regression-v492.mjs`, un audit statico unico che controlla asset HTML, fallback locali, footer/cache-buster, separazione EmailJS, centralizzazioni V480-V491 e preservazione dei flussi presidente FantaMantraManager. Non vengono spostati altri asset e non vengono cancellate copie locali.

## V491 - Centralizzazione selettiva moduli JS

La V491 centralizza selettivamente 12 moduli JS comuni e identici in `static/fanta-engine/js/shared/v491/`. Solo 11 moduli sono usati come import runtime primari da `assets/app.js`; `calciomercato-players-v340.js` viene copiato nel motore ma non viene ancora agganciato perché il runtime usa una versione diversa. Le copie locali restano in entrambe le leghe e nella copia annidata ZonaOrientale: non sono stati cancellati fallback/rollback locali. Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra, news, regolamenti, bilanci, listoni e calciomercato dati non sono stati modificati.


## V490 - Data path adapter comune

La V490 introduce `static/fanta-engine/js/core/data-paths-v490.js`, un adapter comune e senza dipendenze per risolvere i path dati (`dataPaths.*`) e per caricare JSON con catena primary/fallback. I loader `static-files-service.js` delle due leghe e della copia annidata ZonaOrientale usano l'adapter con import dinamico e fallback locale: se il motore comune non si carica, restano attive le funzioni locali V446/V485. Non sono stati spostati ulteriori dati e non sono state cancellate copie locali.


## V489 - Centralizzazione JS classici comuni

La V489 centralizza in `static/fanta-engine/js/shared/v489/` i soli script classici e autonomi risultati identici tra le due leghe: `admin-card-visibility-v454.js`, `admin-card-visibility-v455.js` e `admin-card-visibility-v456.js`. Le pagine `index.html` caricano ora il runtime V456 dal motore comune con fallback locale tramite `data-local-fallback`; le copie locali non vengono cancellate. Restano fuori `app.js`, Firebase, EmailJS, `league-config`, section registry e tutti i moduli ES con import relativi.


## Aggiornamento V487 - CSS comuni nel motore centrale (24/06/2026)

- Runtime avanzato a V487 con footer/cache-buster coerenti.
- I CSS comuni identici sono copiati in `static/fanta-engine/css/shared/v487/` e caricati come sorgente primaria.
- Le copie locali restano presenti e fungono da fallback.
- Nessun JS runtime viene centralizzato in questa versione.
- Nessuna modifica a Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra, news, regolamenti, bilanci, listoni o calciomercato.

## Aggiornamento V484 - Inventario asset comuni listone/calciomercato (24/06/2026)

- Runtime avanzato a V484 con footer/cache-buster coerenti su entrambe le leghe.
- Aggiunto inventario osservativo in `static/fanta-engine/data/shared-assets-inventory-v484.json`.
- Audit dedicato: `static/fanta-engine/tools/audit-shared-assets-inventory-v484.mjs`.
- Risultato: 42 file candidati e 42 identici tra ZonaOrientale e FantaMantraManager.
- Nessun file listone/calciomercato viene spostato o cancellato in V484.
- Prossimo passo consigliato: centralizzazione con fallback, mantenendo copie locali.

# FantaMantraManager - Stato corrente e indice canonico

Aggiornato alla **V561**.

Questo documento e' il punto di ingresso canonico per chi deve riprendere lo sviluppo di FantaMantraManager. I file storici V448-V482 restano conservati nella stessa cartella e vanno considerati come archivio di dettaglio; per capire lo stato corrente, partire da questi documenti consolidati.

## Identita' corrente

- Nome pubblico: **FantaMantraManager**.
- Percorso statico: `static/fantapetillomantramanager/`.
- Percorso pubblico/slug storico: `fantapetillomantramanager`.
- Il path non e' stato rinominato per non rompere link, Netlify, share news, Firebase e asset gia' pubblicati.
- ZonaOrientale e' una lega separata e non deve ricevere modifiche quando si lavora su FantaMantraManager, salvo patch multi-lega esplicitamente dichiarate.

## Stato runtime

- Versione runtime corrente dopo questa patch: **V561**.
- Motore comune presente: `static/fanta-engine/`.
- Registro sezioni comune introdotto in V480: `static/fanta-engine/js/core/unified-section-registry-v480.js`.
- Presentazione comune introdotta in V481: `static/fanta-engine/js/core/league-presentation-v481.js`.
- Audit anti-contaminazione multi-lega introdotto in V482: `static/fanta-engine/tools/audit-multileague-contamination-v482.mjs`.
- V483 consolida la documentazione e non sposta asset/dati runtime.

## Documenti canonici

1. `00_STATO_CORRENTE_E_INDICE.md` - stato corrente e indice.
2. `01_FUNZIONALITA_E_CHANGELOG.md` - funzionalita' attive e changelog consolidato.
3. `02_ARCHITETTURA_DATI_FIREBASE_EMAILJS.md` - dati, Firebase, EmailJS, rules e separazione lega.
4. `03_ADMIN_E_PRESIDENTI.md` - comportamento Admin, Area Squadra e Dashboard Presidente.
5. `04_ROADMAP_MOTORE_UNICO.md` - roadmap motore comune e centralizzazione asset condivisi.
6. `HANDOFF_V483_DOCS_CONSOLIDATE.md` - passaggio di consegne specifico V483.

## File storici importanti da consultare quando serve dettaglio

- `REGOLAMENTO_V474.md` - aggiornamento regolamento FantaMantraManager 2026-2027.
- `BRANDING_V475_FANTAMANTRAMANAGER.md` - cambio nome/logo/favicons.
- `TEAMAREA_UNLOCK_V476.md` - sblocco Area Squadra.
- `PRESIDENT_DASHBOARD_V477.md` - dashboard presidente nascosta in sessione Admin e card non previste temporaneamente nascoste.
- `EMAILJS_PRESIDENT_TOOLS_V478.md` - riattivazione card presidente con EmailJS dedicato.
- `RULE_PROPOSALS_V479.md` - proposte regolamento in Firestore.
- `SECTION_REGISTRY_V480.md` - registry sezioni comune.
- `PRESENTATION_ENGINE_V481.md` - motore comune presentazione.
- `AUDIT_MULTILEGA_ANTI_CONTAMINAZIONE_V482.md` - audit anti-contaminazione.

## Guardrail obbligatori

- Non cancellare funzionalita' esistenti salvo richiesta esplicita.
- Non copiare contenuti ZonaOrientale in FantaMantraManager.
- Non copiare contenuti FantaMantraManager in ZonaOrientale.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` se non richiesto esplicitamente.
- Ogni overlay deve contenere solo file effettivamente modificati.
- Ogni overlay deve includere docs aggiornati e handoff.
- Ogni overlay deve indicare cosa verificare manualmente per intercettare regressioni.
- Per patch runtime, aggiornare footer/cache-buster/versione.

## Stato sulle proposte regolamento

La V479 ha aggiunto la struttura per le proposte regolamento su Firestore nella collection `ruleProposals`. La sezione e' progettata per presidenti loggati e approvati, con pannello Admin separato per gestione stato. Se la sezione non compare nella UI, trattare il tema come fix di aggancio/registry UI, non come assenza completa del codice.

## Nota su listoni e calciomercato comuni

Listoni e alcuni file statici di calciomercato sono candidati naturali per il motore centrale, perche' possono essere comuni a piu' leghe. La V483 non li sposta: la migrazione va fatta in una patch dedicata con inventario dei file, fallback sui path storici e audit sui flussi Listone, Player, Calciomercato e Fantamercato.

- `SHARED_ASSETS_CENTRALIZATION_V485.md` - centralizzazione prudente asset listone/calciomercato con fallback.
- `HANDOFF_V485_SHARED_ASSETS_CENTRALIZATION.md` - handoff centralizzazione asset comuni V485.

- **V486**: inventario asset runtime CSS/JS comuni, senza spostamenti runtime.

## Aggiornamento V488

V488 aggiunge l'inventario delle dipendenze JS comuni (`shared-js-dependency-inventory-v488.json`) senza spostare i JS runtime e senza cancellare copie locali.


## V495 - Cleanup nested static ZonaOrientale

- Dismessa la copia annidata `static/zonaorientale/static` tramite `git rm` esplicito dopo overlay.
- Audit V495 aggiornati per non dipendere più dalla copia annidata.
- Redirect Netlify di sicurezza `/zonaorientale/static/* -> /zonaorientale/:splat`.


## V499 - Firebase adapter comune

- `FIREBASE_ADAPTER_V499.md`
- `HANDOFF_V499_FIREBASE_ADAPTER.md`

## Aggiornamento V500

- Dashboard cards engine comune in `static/fanta-engine/js/ui/dashboard-cards-engine-v500.js`.
- Modalita' `observe-first`, senza cambio di rendering dashboard.


## V518 - Runtime boot whole-site export compatibility fix

- Corretto il blocco runtime causato dall'import `installPublicDataAutoloadV515` non esportato dal modulo condiviso `public-data-autoload-v512.js`.
- Aggiunti alias compatibili V515/V516/V518 nel modulo condiviso e aggiornati gli `app.js` a `?v=518`.
- Mantenuta la correzione `formValidatorsV506: true`; footer e `currentVersion` aggiornati a V518.
- Verifica consigliata: `node static/fanta-engine/tools/audit-runtime-boot-whole-site-v517.mjs`.


## Aggiornamento V518

Overlay whole-site di recovery runtime: cache-buster V518, alias autoload V518 e controllo esplicito contro residui `league-config-v443.js?v=512` su entrambe le leghe. `FUNZIONALITA'.md` non modificato.

## Aggiornamento V561 - Calciomercato disattivato

- La sezione Calciomercato non e' piu' visibile nella nav desktop/mobile e non e' presente come pagina HTML pubblica.
- Il recupero articoli e' bloccato sia lato browser sia lato Netlify Function `calciomercato-feed`.
- Gli asset/archivi Calciomercato non sono stati cancellati: la rimozione e' runtime/UI e reversibile.
- Restano attivi News/comunicati interni, Admin, Presidente, Listone, Rose, Fantamercato, Bilanci, Competizioni e preloader V560.

