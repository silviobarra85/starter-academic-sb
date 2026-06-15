## Aggiornamento V447 - Clone sandbox FantaPetilloMantraManager (15/06/2026)

- Creato il clone sandbox `static/fantapetillomantramanager/` a partire dal motore ZonaOrientale gia' parametrizzato.
- Il clone usa `assets/league-config.json` con `leagueId`, `slug`, `basePath`, `siteUrl`, branding e metadata dedicati a `FantaPetilloMantraManager`.
- Firebase e' disabilitato nel clone tramite stub `assets/firebase.js`: nessuna lettura o scrittura puo' finire nel progetto Firebase ZonaOrientale.
- I dati del clone sono placeholder statici minimi: config pubblica, snapshot stagione 2025-2026, honor snapshot, manifest listoni/rose/competizioni/calciomercato vuoti.
- ZonaOrientale resta funzionante e avanza a V447 senza toccare Admin, snapshot generator, Area Squadra, Bilanci mobile V438 o badge dispositivo V434.

## Aggiornamento V445 - Metadata, menu e share da config (15/06/2026)

- Runtime avanzato a V445 con footer e cache-buster coerenti.
- `assets/league-config.json` ora contiene `branding`, metadata pagina, immagine pubblica e definizione del menu mobile "Altro".
- Il loader `league-config-v443.js` resta compatibile ma aggiunge helper V445 per applicare titoli, meta runtime, footer e voci mobile da config, con fallback ZonaOrientale.
- I link share comunicati usano `siteUrl` da config; il link WhatsApp Bilanci continua a usare `whatsapp.bilanciUrl` con fallback storico.
- Nessuna modifica a Firebase, Admin, snapshot loader, dati statici, routing principale, layout Bilanci mobile V438 o badge dispositivo V434.

## Aggiornamento V444 - Audit hard-coded multi-lega (15/06/2026)

- Runtime avanzato a V444 con footer e cache-buster coerenti.
- Aggiunto `tools/audit-hardcoded-league-refs-v444.mjs`, audit osservativo che mappa i riferimenti ancora legati a identita', URL pubblici, share route, landing Bilanci, path loghi e guardrail versione.
- Aggiunta la baseline `tools/hardcoded-league-refs-v444.json` con conteggi e categorie correnti: runtime, pagine pubbliche, tools/audit, docs e Netlify.
- La mappa rileva, tra gli altri, `zonaorientale`, `ZonaOrientale`, `silviobarra.com/zonaorientale`, `/zonaorientale/`, `share/news`, `bilanci.html`, `assets/logos` e `DEPLOY_EXPECTED_VERSION`.
- Nessun refactor applicato su Firebase, snapshot, Admin, Area Squadra, Listone, Rose/Movimenti FM, Calciomercato, routing principale, Bilanci V438 o badge dispositivo V434.
- Nessun clone nuova lega creato: `FantaPetilloMantraManager` resta il candidato provvisorio da usare solo dopo la parametrizzazione graduale.

## Aggiornamento V443 - Configurazione lega base multi-lega (15/06/2026)

- Runtime avanzato a V443 con footer e cache-buster coerenti.
- Aggiunto `assets/league-config.json` come primo layer descrittivo della lega: id, slug, nome, URL pubblici, stagione corrente, path asset/snapshot/loghi, feature abilitate e guardrail.
- Aggiunto `assets/js/core/league-config-v443.js`, loader leggero con default ZonaOrientale e fallback sicuro: se il JSON non e' disponibile, il sito continua a usare i valori attuali.
- Il link WhatsApp Bilanci puo' leggere `whatsapp.bilanciUrl` dalla config, mantenendo fallback hard-coded a `https://silviobarra.com/zonaorientale/bilanci.html`.
- Tracciato il nome provvisorio della futura seconda lega: `FantaPetilloMantraManager`; il nome puo' cambiare prima della creazione del clone.
- Nessun clone nuova lega creato in questa patch. Nessuna modifica a Firebase bootstrap, snapshot loader, Admin, Area Squadra, Listone, Rose/Movimenti FM, Calciomercato, routing principale, Bilanci V438 o badge dispositivo V434.

## Aggiornamento V440 - Link WhatsApp dedicato ai Bilanci (11/06/2026)

- Runtime avanzato a V440 con footer e cache-buster coerenti.
- Nella sezione pubblica `Bilanci` e' stato aggiunto il pulsante `Copia link WhatsApp`.
- Il link copiato punta a `https://silviobarra.com/zonaorientale/bilanci.html`, landing statica con metadati Open Graph specifici per mostrare in anteprima che si entra nei Bilanci FM.
- La landing reindirizza automaticamente a `./#bilanci`, quindi l'utente arriva alla sezione Bilanci della home.
- Nessuna modifica a dati, snapshot, Firebase, Admin, Rose/Movimenti FM, menu Altro V439 o badge dispositivo V434.

## Aggiornamento V439 - Menu Altro allineato sulle pagine standalone (11/06/2026)

- Runtime avanzato a V439 con footer e cache-buster coerenti.
- Le pagine standalone `competition.html` e `player.html` hanno ora il menu mobile `Altro` allineato alla home: News, Rose, Bilanci, Albo, Statistiche, Archivio, Confronta, Regolamento, Fantamercato, Calciomercato, Listone e Admin.
- `player.html` riceve anche bottom nav e sheet `Altro`, cosi' chi arriva dalla scheda giocatore puo' tornare a tutte le sezioni senza passare dal solo link `Torna al Listone`.
- Nessuna modifica a Bilanci V438, Admin, Rose/Movimenti FM, Firebase, snapshot o badge dispositivo V434.

## Aggiornamento V438 - Fix mobile effettivi sezione Bilanci (11/06/2026)

- Runtime avanzato a V438 con footer e cache-buster coerenti.
- Nella sezione pubblica `Bilanci`, i selettori `Stagione` e `Squadra` sono ora inseriti strutturalmente sotto il titolo `Bilancio stagione`, cosi' il layout mobile non dipende solo da CSS di allineamento.
- La colonna `Voce` della tabella Bilanci usa uno sticky piu' robusto con `border-collapse: separate`, `left: 0 !important` e `position: -webkit-sticky` per mobile.
- Le card di dettaglio mensile partono chiuse e si aprono solo al tap/click.
- Confermati: Bilanci da snapshot V435, editing movimenti FM V436, rimozione fonte V437, badge dispositivo V434, nessuna modifica a Firebase/Admin.

## Aggiornamento V437 - Rifiniture sezione Bilanci (11/06/2026)

- Runtime avanzato a V437 con footer e cache-buster coerenti.
- Nella sezione pubblica `Bilanci` e' stata rimossa la card/indicazione tecnica `Fonte`, non utile all'utente finale.
- Da mobile i selettori `Stagione` e `Squadra` sono stati posizionati sotto il titolo `Bilancio stagione`.
- Rinforzato lo sticky mobile della prima colonna `Voce`, senza cambiare la sorgente dati: i bilanci restano derivati dagli snapshot stagione.
- Confermati: Bilanci da snapshot V435, editing movimenti FM V436, badge dispositivo V434, nessuna modifica a Firebase/Admin.

## Aggiornamento V436 - Modifica movimenti FM esistenti (11/06/2026)

- Runtime avanzato a V436 con footer e cache-buster coerenti.
- Il pannello Admin -> Rose e movimenti FM ora consente di modificare un movimento gia registrato dalla lista della squadra selezionata.
- Il pulsante `Modifica` carica stagione, rosa, tipo, data, giocatore, squadra reale, ruolo, destinazione, FM e note nel form esistente.
- `Annulla modifica` riporta il form in modalita nuovo inserimento.
- La creazione dei nuovi movimenti mantiene gli effetti esistenti sulla rosa; la modifica aggiorna il record `fmMovements` senza cancellare/reinserire. Se si cambiano tipo, giocatore o squadra dopo effetti gia applicati, va verificata la rosa prima di aggiornare gli snapshot.
- Sezione Bilanci da snapshot V435 e badge dispositivo V434 mantenuti.

## Aggiornamento V435 - Bilanci squadre da snapshot (11/06/2026)

- Runtime avanzato a V435 con footer e cache-buster coerenti.
- Aggiunta sezione pubblica `Bilanci` per consultare, per stagione e squadra, i movimenti FM gia' presenti negli snapshot in `assets/snapshots/seasons/*.json`.
- La vista calcola entrate, uscite, saldo mensile e saldo progressivo direttamente dal campo `fmMovements`, senza introdurre file o cartelle `assets/bilanci`.
- Badge dispositivo V434 mantenuto; nessuna modifica a Firebase, auth, Admin, Rose, Movimenti FM o workflow di scrittura.

## Aggiornamento V434 - Badge dispositivo diagnostico (09/06/2026)

- Runtime avanzato a V434 con footer e cache-buster coerenti.
- Aggiunto un badge fisso in alto a destra su index, competition e player per mostrare localmente il dispositivo rilevato.
- La rilevazione e' best-effort: quando il browser non espone il modello esatto, il badge mostra famiglia/piattaforma come iPhone, iPad, Android, Mac o Windows PC.
- Nessuna modifica a Firebase, auth, admin, dati, routing o Netlify.

## Aggiornamento V433 - Area Squadra mobile semplificata (09/06/2026)

- Runtime avanzato a V433 con footer e cache-buster coerenti.
- Da mobile la card Notifiche presidente viene nascosta per ridurre duplicazioni; i dati e gli handler V370 restano nel runtime.
- Dashboard Presidente resta prima card della sezione Area Squadra; la scheda squadra e l'hub azioni restano subito dopo.
- I pannelli Comunicato avvenuto scambio e Svincola Giocatori vengono spostati piu in basso e restano chiusi con Apri/Riduci.

## Aggiornamento V432 - Area Squadra mobile ordinata (09/06/2026)

- Runtime avanzato a V432 con footer e cache-buster coerenti.
- Corretto l'ordinamento reale della Dashboard Presidente: ora il selector usa `.president-dashboard-v369` e la card viene portata effettivamente in cima ad Area Squadra mobile.
- Da mobile la card Dashboard nasconde il badge tecnico V369, compatta metriche 2 per riga e mostra i 4 pulsanti principali in griglia 2x2.
- I pannelli "Comunicato avvenuto scambio" e "Svincola Giocatori" restano agganciati agli stessi form/handler ma partono chiusi con pulsante Apri/Riduci.

## Aggiornamento V431 - Area Squadra mobile compatta (08/06/2026)

- Runtime avanzato a V431 con footer e cache-buster coerenti.
- Da mobile la sezione Dashboard Presidente/Area Squadra viene riordinata: Dashboard Presidente in cima, Notifiche presidente subito dopo, poi scheda squadra, hub azioni e moduli operativi.
- Le card principali sono compattate con la scala mobile consolidata, accorpando metriche e azioni su piu colonne quando lo spazio lo consente.
- Nessuna modifica a Firebase, auth, permessi, dati o routing.

## Aggiornamento V429 - Fix titoli Admin mobile (08/06/2026)

- Runtime avanzato a V429 con footer e cache-buster coerenti.
- Corretto un problema mobile nell'area Admin: i titoli dei pannelli/sotto-sezioni potevano essere compressi dal pulsante Apri/Riduci fino a spezzarsi lettera per lettera.
- Aggiunto marker runtime `ZonaOrientaleAdminMobileHeaderFixV429` e audit `tools/audit-admin-mobile-header-v429.mjs`.
- Nessuna modifica a dati, Firebase, auth, routing, Netlify o workflow Admin.

## Aggiornamento V428 - Pre-merge cleanup finale (08/06/2026)

- Runtime avanzato a V428 con footer e cache-buster coerenti.
- Nessuna nuova funzionalita': la patch consolida la fase mobile/refactor conservativa e prepara il ramo al test manuale prima del merge.
- Aggiunto marker runtime `ZonaOrientalePreMergeCleanupV428` e audit `tools/audit-premerge-cleanup-v428.mjs`.
- Preservati guardrail V407-V427, scala tipografica mobile globale, assenza del refactor `sezioni/` e documentazione consolidata in 8 file.

## Aggiornamento V427 - Pulizia warning legacy selettiva (08/06/2026)

- Runtime avanzato a V427 con footer e cache-buster coerenti.
- Nessuna nuova funzionalita': la patch riduce il rumore dei warning legacy senza cancellare asset storici o fallback.
- Aggiunto marker runtime `ZonaOrientaleLegacyWarningCleanupV427` per documentare i residui storici noti e non collegati al runtime.
- Rimangono preservati i guardrail mobile V407-V426, la scala tipografica mobile e l'assenza del refactor pagine standalone.

## Aggiornamento V426 - Checklist mobile finale (08/06/2026)

- Runtime avanzato a V426 con footer e cache-buster coerenti.
- Nessuna nuova funzionalita': la patch chiude la fase mobile V407-V425 con un guardrail finale.
- Aggiunto marker runtime `ZonaOrientaleMobileChecklistV426` per preservare: scala mobile globale, navigazione mobile, tabelle sticky, colori ruolo e ottimizzazioni mobile precedenti.
- Aggiunto audit `tools/audit-mobile-final-checklist-v426.mjs`, che verifica presenza degli audit V407-V425, docs consolidati e assenza del refactor standalone `sezioni/`.
- Firebase, auth, admin, routing, dati e Netlify restano invariati.

---

# Indice consolidamento documentazione ZonaOrientale

## Aggiornamento V424 - Scala mobile uniforme sulle sezioni residue (08/06/2026)

- Runtime avanzato a V424 con footer e cache-buster coerenti.
- Estesa la scala mobile compatta anche alle sezioni residue che potevano restare fuori scala: News/Comunicati, Competizioni, Albo d'Oro, Rose/Club e Fantamercato.
- Le card e tabelle residue usano la stessa scala: nome/titolo `0.78rem`, sottotesto `0.66rem`, label `0.62rem`, valore/contenuto `0.73rem`.
- Le tabelle di Honor/Competizioni/Rose/Fantamercato restano scrollabili e non perdono sticky/leggibilita mobile.
- Aggiunto audit `tools/audit-mobile-typography-residue-v424.mjs`.

---


## Aggiornamento V423 - Scala mobile estesa a Confronta, Statistiche e Rose (08/06/2026)

- Runtime avanzato a V423 con footer e cache-buster coerenti.
- La scala mobile scelta dall'utente viene estesa alle sezioni che erano rimaste fuori scala: `Confronta squadre`, `Statistiche storiche` e tabelle Rosa.
- I titoli principali mobile vengono ridotti in modo coerente senza perdere gerarchia visiva.
- Confronta e Statistiche compattano metriche, ranking e score sulla stessa riga quando lo spazio lo consente.
- Il font del nome giocatore nelle tabelle Rosa viene riallineato al Listone; sticky column e colori ruolo restano preservati.
- Aggiunto audit `tools/audit-mobile-typography-global-v423.mjs`.

---


## Aggiornamento V422 - Scala mobile estesa e Archivio compatto (08/06/2026)

- Runtime avanzato a V422 con footer e cache-buster coerenti.
- Estesa la scala mobile scelta dall'utente anche ai contenuti interni delle card/sotto-card del sito, non solo ai titoli.
- Archivio Stagioni mobile: le card `Squadre della stagione` restano compatte e vengono forzate in due card per riga quando la UX mobile e' attiva.
- Timeline dati Archivio: usa gli stessi 4 comunicati visibili della dashboard come sorgente primaria, poi fonde eventuali comunicati dello snapshot senza duplicati.
- Il renderer live dell'Archivio viene aggiornato dopo il refresh live dei comunicati, cosi' non resta fermo ai soli 3 comunicati dello snapshot statico.
- Rimossa dal renderer live la card duplicata `Albo della stagione`, gia' coperta da `Competizioni`.
- Aggiunto audit `tools/audit-mobile-scale-archive-v422.mjs`.

---


## Aggiornamento V421 - Archivio mobile leggibile (08/06/2026)

- Runtime avanzato a V421 con footer e cache-buster coerenti.
- Estesa la scala tipografica mobile anche alle sotto-card interne dell'Archivio Stagioni: Albo, Competizioni, Partite recenti e Timeline dati.
- La Timeline dati ora fonde i comunicati dello snapshot statico con quelli runtime (`state.raw.news`), deduplicandoli e ordinandoli dal piu' recente.
- Nessuna modifica a Firebase, auth, admin, routing, Netlify o pagine standalone.
- Aggiunto audit `tools/audit-archive-mobile-typography-v421.mjs`.

---

## Aggiornamento V420 - Scala tipografica mobile globale (08/06/2026)

- Runtime avanzato a V420 con footer e cache-buster coerenti.
- Introdotta una scala tipografica mobile globale basata sulla card `Squadre della Stagione`:
  - nome/titolo: `0.78rem`;
  - sottotesto/meta: `0.66rem`;
  - label/etichette: `0.62rem`;
  - valore/contenuto: `0.73rem`.
- La scala e' applicata a card, metriche, liste, timeline, tabelle e contenuti mobile del sito, mantenendo distinguibili i titoli principali di pagina.
- Nessuna modifica a dati, routing, Firebase, auth, admin, Netlify Functions o pagine standalone.
- Aggiunto audit `tools/audit-mobile-typography-v420.mjs` e aggiornato `tools/check-zonaorientale.sh`.

---


## Aggiornamento V418 - Accessibilita mobile e focus (08/06/2026)

- Versione operativa avanzata a V418.
- Intervento conservativo e CSS-only: focus visibili, tap feedback, overflow orizzontale controllato e rispetto di `prefers-reduced-motion`.
- Nessuna modifica a routing, Firebase, auth, admin, Netlify Functions, dati o funzionalita utente.
- Preservate le modifiche V407-V417, inclusa la pulizia CSS legacy V417.
- Aggiunto audit `tools/audit-mobile-accessibility-v418.mjs` e aggiornato `tools/check-zonaorientale.sh`.
- Documentazione mantenuta negli 8 file consolidati per categoria.

---

## Aggiornamento V417 - Pulizia CSS legacy sicura (08/06/2026)

- Versione operativa avanzata a V417.
- Intervento conservativo: rimozione dal pacchetto dei CSS refactor versionati V291/V292 gia non caricati dal runtime.
- Alias CSS stabili preservati: `mobile-controls.css`, `rosters-tables.css`, `listone.css`, `calciomercato.css`, `theme-light-suspended.css`.
- Nessuna modifica a routing, Firebase, auth, admin, Netlify Functions, dati o funzionalita utente.
- Aggiunto audit `tools/audit-css-asset-cleanup-v417.mjs` e aggiornato `tools/check-zonaorientale.sh`.
- Documentazione mantenuta negli 8 file consolidati per categoria.

---


## Aggiornamento V416 - Admin mobile compatto (08/06/2026)

- Versione operativa avanzata a V416.
- Patch conservativa e mobile-first: non cambia routing, Firebase, auth, permessi admin, dati, import Excel, EmailJS o Netlify Functions.
- Obiettivo: rendere piu compatta e scansionabile da mobile l'area Admin, riducendo ingombro di pannelli, form, liste e tabelle amministrative.
- Mantiene tutte le funzionalita V407-V415: 4 comunicati, Calciomercato mobile compatto, tabelle giocatori compatte, Area Squadra mobile e home/squadra V415.
- Documentazione mantenuta negli 8 file consolidati per categoria.

---

## Aggiornamento V415 - home mobile e squadra stile Listone (08/06/2026)

- Versione operativa avanzata a V415.
- Patch conservativa e mobile-first: non cambia routing, Firebase, auth, admin, dati, richieste presidente o Netlify Functions.
- Obiettivo 1: nella dashboard mobile, la scheda dell'ultimo comunicato pubblicato viene mostrata subito sotto il titolo Home mobile.
- Obiettivo 2: la tabella Rosa della pagina La mia squadra eredita font, densita, dimensione celle e sticky column del Listone, mantenendo le colonne esistenti.
- In Listone e La mia squadra la prima colonna resta sticky e viene colorata in base al ruolo insieme alla riga.
- Documentazione mantenuta negli 8 file consolidati per categoria.

---

---

## Aggiornamento V414 - Area Squadra mobile compatta (08/06/2026)

- Versione operativa avanzata a V414.
- Patch conservativa e mobile-first: non cambia routing, Firebase, auth, admin, dati, richieste presidente o Netlify Functions.
- Obiettivo: rendere piu compatta e leggibile da mobile l'Area Squadra, inclusi form richiesta, metriche e dashboard presidente V369 quando presente.
- Preservate V407-V413: 4 comunicati in home, Calciomercato mobile senza immagini e compatto, stile Listone su Rose, tabelle giocatori compatte, dashboard/menu/filtri mobile compatti.
- Documentazione mantenuta negli 8 file consolidati per categoria.

---

## Aggiornamento V413 - filtri mobile compatti (08/06/2026)

- Versione operativa avanzata a V413.
- Patch conservativa e mobile-first: non cambia routing, Firebase, auth, admin, dati, feed, filtri JS o Netlify Functions.
- Obiettivo: rendere piu compatti e leggibili da mobile i controlli frequenti di Listone e Calciomercato.
- Preservate V407-V412: 4 comunicati in home, Calciomercato mobile senza immagini e compatto, stile Listone su Rose, tabelle giocatori compatte, dashboard mobile compatta e menu Altro compatto.
- Documentazione mantenuta negli 8 file consolidati per categoria.

---

## Aggiornamento V412 - menu mobile Altro compatto (08/06/2026)

- Versione operativa avanzata a V412.
- La patch e conservativa: non cambia routing, Firebase, auth, admin, dati, feed o Netlify Functions.
- Obiettivo: rendere piu usabile da mobile il menu Altro della bottom navigation, riducendo ingombro e aggiungendo altezza controllata/scroll interno.
- Preservate V407-V411: 4 comunicati in home, Calciomercato mobile senza immagini e compatto, stile Listone su Rose, tabelle giocatori compatte e dashboard mobile compatta.
- Documentazione mantenuta negli 8 file consolidati per categoria.



## Aggiornamento V411 - dashboard mobile compatta (07/06/2026)

- Versione operativa avanzata a V411.
- La patch e conservativa: non cambia routing, Firebase, auth, admin, dati, feed o Netlify Functions.
- Obiettivo: ridurre ingombro verticale e migliorare scansione della dashboard da mobile, intervenendo solo su CSS.
- Preservate V407, V408, V409 e V410: 4 comunicati in home, Calciomercato mobile compatto, stile Listone su Rose e tabelle giocatori mobile compatte.
- Documentazione mantenuta negli 8 file consolidati per categoria.


## Aggiornamento V410 - Calciomercato mobile compatto (07/06/2026)

- Versione operativa avanzata a V410.
- La patch e conservativa: non cambia routing, Firebase, auth, admin, dati, feed o Netlify Functions.
- Obiettivo: rendere piu compatte e leggibili da mobile le card Calciomercato dopo la rimozione delle immagini anteprima in V407.
- Preservate V407, V408 e V409: 4 comunicati in home, stile Listone su Rose e tabelle giocatori mobile compatte.
- Documentazione mantenuta nei file consolidati per categoria.


---

## Aggiornamento V409 - tabelle giocatori mobile compatte (07/06/2026)

- Versione operativa avanzata a V409.
- La patch e conservativa: non cambia routing, Firebase, auth, admin, dati o struttura delle sezioni.
- Obiettivo: migliorare la fruizione mobile delle tabelle giocatori dense dopo V408, preservando stile Listone su Rose e Listone.
- Documentazione mantenuta nei file consolidati per categoria.


---

## Aggiornamento V406 - baseline mobile pulita (07/06/2026)

- Nuova numerazione operativa: da questa patch si procede con V406.
- Documentazione canonica mantenuta in 8 file consolidati per categoria.
- La patch V406 non introduce pagine HTML standalone e non cambia routing, Firebase, auth, admin o dati.
- Obiettivo della baseline: runtime ordinato, cache-buster coerenti, colori ruolo consolidati e micro-ottimizzazioni mobile conservative.


Questo pacchetto accorpa la documentazione in file per categoria. Nessun contenuto documentale e stato rimosso: ogni file originale e riportato integralmente nella categoria indicata, con percorso originale e hash SHA-256.

Artefatti macOS esclusi: `.DS_Store`, `__MACOSX`, file `._*`.

## Categorie

- `00_STATO_CORRENTE_E_INDICE.md`: Stato corrente, indice e istruzioni operative (6 file originali)
- `01_FUNZIONALITA_E_CHANGELOG.md`: Funzionalita e changelog (66 file originali)
- `02_ARCHITETTURA_DATI_FIREBASE_SOCCER_DATA.md`: Architettura, dati, Firebase e Soccer Data (54 file originali)
- `03_ADMIN_OPERATIVITA_EMAIL.md`: Admin, operativita, release operative ed email (21 file originali)
- `04_CALCIOMERCATO_E_LISTONI.md`: Calciomercato e listoni (52 file originali)
- `05_TEST_AUDIT_REGRESSIONI.md`: Test, audit e regressioni (76 file originali)
- `06_RELEASE_HANDOFF_REFACTOR_STORICO.md`: Release, handoff, refactor e storico (137 file originali)
- `07_PIANIFICAZIONE_ROADMAP_PROSSIME_ATTIVITA.md`: Pianificazione, roadmap e prossime attivita (3 file originali)

## Mappa file originali -> categoria


### 00_STATO_CORRENTE_E_INDICE.md

- `00_START_HERE_V272.md`
- `AI_HANDOFF_ZONAORIENTALE_CURRENT.md`
- `CURRENT_STATE.md`
- `ISTRUZIONI_NUOVO_ASSISTENTE_260528.md`
- `README.md`
- `RESOCONTO_SITO_V313.md`

### 01_FUNZIONALITA_E_CHANGELOG.md

- `CHANGELOG_CONSOLIDATO.md`
- `FUNZIONALITA'.md`
- `funzionalita/FUNZIONALITA'V240-255.md`
- `funzionalita/FUNZIONALITA'V256-262.md`
- `funzionalita/FUNZIONALITA'V263-270.md`
- `funzionalita/FUNZIONALITA'V271-274.md`
- `funzionalita/FUNZIONALITA_INCREMENTALI_V240-274.md`
- `FUNZIONALITAV333.md`
- `FUNZIONALITAV334.md`
- `FUNZIONALITAV335.md`
- `FUNZIONALITAV336.md`
- `FUNZIONALITAV337.md`
- `FUNZIONALITAV338.md`
- `FUNZIONALITAV339.md`
- `FUNZIONALITAV340.md`
- `FUNZIONALITAV341.md`
- `FUNZIONALITAV342.md`
- `FUNZIONALITAV343.md`
- `FUNZIONALITAV344.md`
- `FUNZIONALITAV345.md`
- `FUNZIONALITAV346.md`
- `FUNZIONALITAV347.md`
- `FUNZIONALITAV348.md`
- `FUNZIONALITAV349.md`
- `FUNZIONALITAV350.md`
- `FUNZIONALITAV351.md`
- `FUNZIONALITAV352.md`
- `FUNZIONALITAV353.md`
- `FUNZIONALITAV354.md`
- `FUNZIONALITAV355.md`
- `FUNZIONALITAV356.md`
- `FUNZIONALITAV357.md`
- `FUNZIONALITAV358.md`
- `FUNZIONALITAV359.md`
- `FUNZIONALITAV360.md`
- `FUNZIONALITAV361.md`
- `FUNZIONALITAV362.md`
- `FUNZIONALITAV363.md`
- `FUNZIONALITAV367.md`
- `FUNZIONALITAV368.md`
- `FUNZIONALITAV369.md`
- `FUNZIONALITAV370.md`
- `FUNZIONALITAV371.md`
- `FUNZIONALITAV372.md`
- `FUNZIONALITAV373.md`
- `FUNZIONALITAV374.md`
- `FUNZIONALITAV375.md`
- `FUNZIONALITAV376.md`
- `FUNZIONALITAV377.md`
- `FUNZIONALITAV378.md`
- `FUNZIONALITAV379.md`
- `FUNZIONALITAV380.md`
- `FUNZIONALITAV381.md`
- `FUNZIONALITAV382.md`
- `FUNZIONALITAV383.md`
- `FUNZIONALITAV384.md`
- `FUNZIONALITAV385.md`
- `FUNZIONALITAV386.md`
- `FUNZIONALITAV387.md`
- `FUNZIONALITAV388.md`
- `FUNZIONALITAV389.md`
- `FUNZIONALITAV391.md`
- `FUNZIONALITAV392.md`
- `FUNZIONALITAV393.md`
- `FUNZIONALITAV394.md`
- `FUNZIONALITAV395.md`

### 02_ARCHITETTURA_DATI_FIREBASE_SOCCER_DATA.md

- `ARCHITETTURA_E_DATI.md`
- `audit/SOCCER_DATA_ASSOCIAZIONE_FBREF_V385.md`
- `audit/SOCCER_DATA_FBREF_BATCH_01_MATRIX_V373.md`
- `audit/SOCCER_DATA_FBREF_BATCH_02_MATRIX_V374.md`
- `audit/SOCCER_DATA_FBREF_BATCH_03_MATRIX_V375.md`
- `audit/SOCCER_DATA_FBREF_BATCH_04_MATRIX_V376.md`
- `audit/SOCCER_DATA_FBREF_BATCH_05_MATRIX_V377.md`
- `audit/SOCCER_DATA_FBREF_BATCH_06_MATRIX_V378.md`
- `audit/SOCCER_DATA_FBREF_BATCH_07_MATRIX_V379.md`
- `audit/SOCCER_DATA_FBREF_BATCH_08_MATRIX_V380.md`
- `audit/SOCCER_DATA_FBREF_BATCH_09_MATRIX_V381.md`
- `audit/SOCCER_DATA_FBREF_BATCH_10_MATRIX_V382.md`
- `audit/SOCCER_DATA_FBREF_BATCH_11_MATRIX_V383.md`
- `audit/SOCCER_DATA_MAPPING_MATRIX_V372.md`
- `audit/SOCCER_DATA_MATRIX_V371.md`
- `firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules`
- `firebase/FIREBASE_RULES_PATCH_V393_SOCCER_DATA_STATS.rules`
- `firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules`
- `firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V393.rules`
- `HANDOFF_V393_SOCCER_DATA_FIREBASE_RULES_FALLBACK.md`
- `HANDOFF_V394_SOCCER_DATA_API_FOOTBALL.md`
- `HANDOFF_V395_SOCCER_DATA_API_FOOTBALL_MAPPING.md`
- `HANDOFF_V396_SOCCER_DATA_API_FOOTBALL_SQUADS_MAPPING.md`
- `HANDOFF_V398_SOCCER_DATA_REMOVED.md`
- `release/RELEASE_V371_SOCCER_DATA_PROTETTO.md`
- `release/RELEASE_V372_SOCCER_DATA_MAPPING_ASSISTITO.md`
- `release/RELEASE_V373_SOCCER_DATA_FBREF_BATCH_01.md`
- `release/RELEASE_V374_SOCCER_DATA_FBREF_BATCH_02.md`
- `release/RELEASE_V375_SOCCER_DATA_FBREF_BATCH_03.md`
- `release/RELEASE_V376_SOCCER_DATA_FBREF_BATCH_04.md`
- `release/RELEASE_V377_SOCCER_DATA_FBREF_BATCH_05.md`
- `release/RELEASE_V378_SOCCER_DATA_FBREF_BATCH_06.md`
- `release/RELEASE_V379_SOCCER_DATA_FBREF_BATCH_07.md`
- `release/RELEASE_V380_SOCCER_DATA_FBREF_BATCH_08.md`
- `release/RELEASE_V381_SOCCER_DATA_FBREF_BATCH_09.md`
- `release/RELEASE_V382_SOCCER_DATA_FBREF_BATCH_10.md`
- `release/RELEASE_V385_SOCCER_DATA_ASSOCIAZIONE_FBREF.md`
- `release/RELEASE_V389_SOCCER_DATA_ASSETS_CLEANUP.md`
- `SOCCER_DATA_API_FOOTBALL_V397.md`
- `test/SOCCER_DATA_API_FOOTBALL_SQUADS_MAPPING_V396.md`
- `test/SOCCER_DATA_ASSETS_CLEANUP_V389.md`
- `test/SOCCER_DATA_FBREF_BATCH_01_V373.md`
- `test/SOCCER_DATA_FBREF_BATCH_02_V374.md`
- `test/SOCCER_DATA_FBREF_BATCH_03_V375.md`
- `test/SOCCER_DATA_FBREF_BATCH_04_V376.md`
- `test/SOCCER_DATA_FBREF_BATCH_05_V377.md`
- `test/SOCCER_DATA_FBREF_BATCH_06_V378.md`
- `test/SOCCER_DATA_FBREF_BATCH_07_V379.md`
- `test/SOCCER_DATA_FBREF_BATCH_08_V380.md`
- `test/SOCCER_DATA_FBREF_BATCH_09_V381.md`
- `test/SOCCER_DATA_FBREF_BATCH_10_V382.md`
- `test/SOCCER_DATA_MAPPING_V372.md`
- `test/SOCCER_DATA_STATIC_STATS_TEMPLATE_V390.md`
- `test/SOCCER_DATA_V371.md`

### 03_ADMIN_OPERATIVITA_EMAIL.md

- `admin/ADMIN_DIAGNOSTICA_EXPAND_FIX_V321.md`
- `admin/ADMIN_LAYOUT_V313.md`
- `admin/DIAGNOSTICA_DATI_V276.md`
- `admin/DIAGNOSTICA_DATI_V303.md`
- `admin/DIAGNOSTICA_LISTONE_RUOLI_V322.md`
- `audit/ADMIN_FUNCTIONS_CHECK_V343.md`
- `audit/ADMIN_PUBLICATION_WORKFLOW_AUDIT_MATRIX_V351.md`
- `audit/PUBLICATION_DASHBOARD_MATRIX_V368.md`
- `calciomercato/CALCIOMERCATO_SOLO_ADMIN_TOGGLE_V327.md`
- `email/EMAIL_DELIVERABILITY_EMAILJS_V266.md`
- `OPERATIVITA_ADMIN_E_RELEASE.md`
- `refactor/ADMIN_PUBLICATION_WORKFLOW_AUDIT_V351.md`
- `refactor/CALCIOMERCATO_ARCHIVE_ADMIN_REFACTOR_V340.md`
- `refactor/CSS_LEGACY_CLEANUP_ADMIN_DIAGNOSTICS_V343.md`
- `refactor/LISTONE_EXPORT_ADMIN_ONLY_V296.md`
- `release/RELEASE_V327_SOLO_ADMIN_CALCIOMERCATO.md`
- `release/RELEASE_V340_ARCHIVE_ADMIN_PLAYER_MATCHING.md`
- `release/RELEASE_V343_CSS_LEGACY_ADMIN_DIAGNOSTICS.md`
- `release/RELEASE_V351_ADMIN_PUBLICATION_WORKFLOW_AUDIT.md`
- `release/RELEASE_V368_DASHBOARD_PUBBLICAZIONE_ADMIN.md`
- `test/PUBLICATION_DASHBOARD_ADMIN_V368.md`

### 04_CALCIOMERCATO_E_LISTONI.md

- `audit/CALCIOMERCATO_PLAYER_DIAGNOSTICS_MATRIX_V359.md`
- `calciomercato/CALCIOMERCATO_ANTEPRIME_CARD_V325.md`
- `calciomercato/CALCIOMERCATO_ARCHIVIO_STATICO_V323.md`
- `calciomercato/CALCIOMERCATO_AUTOMATICO_RSS_V309.md`
- `calciomercato/CALCIOMERCATO_BASE_V305.md`
- `calciomercato/CALCIOMERCATO_CARD_COMPATTE_LISTONE_V331.md`
- `calciomercato/CALCIOMERCATO_CARD_COMPATTE_V332.md`
- `calciomercato/CALCIOMERCATO_CARD_MOBILE_FAVICON_V328.md`
- `calciomercato/CALCIOMERCATO_FEED_V313.md`
- `calciomercato/CALCIOMERCATO_FONTI_AI_V314.md`
- `calciomercato/CALCIOMERCATO_FUSO_ORARIO_V312.md`
- `calciomercato/CALCIOMERCATO_GIOCATORI_V306.md`
- `calciomercato/CALCIOMERCATO_LAYOUT_ORIZZONTALE_V310.md`
- `calciomercato/CALCIOMERCATO_MOBILE_COMPATTO_V319.md`
- `calciomercato/CALCIOMERCATO_NOME_SEZIONE_V307.md`
- `calciomercato/CALCIOMERCATO_ORA_PUBBLICAZIONE_V311.md`
- `calciomercato/CALCIOMERCATO_RICERCA_RANGE_V316.md`
- `calciomercato/CALCIOMERCATO_RICONOSCIMENTO_V320.md`
- `calciomercato/CALCIOMERCATO_RIFINITURE_UI_V326.md`
- `calciomercato/CALCIOMERCATO_SCROLL_RANGE_V317.md`
- `calciomercato/CALCIOMERCATO_SQUADRE_MULTIPLE_V308.md`
- `calciomercato/CALCIOMERCATO_TMW_SQUADRE_V329.md`
- `calciomercato/CALCIOMERCATO_TMW_TILE_TESTUALE_V330.md`
- `listoni/LISTONE_CODICI_SQUADRA_V274.md`
- `listoni/LISTONE_CONVERTER_V268.md`
- `listoni/LISTONE_EXPORT_MODIFICHE_V278.md`
- `listoni/LISTONE_FILTRO_MODIFICHE_V277.md`
- `listoni/LISTONE_MODIFICHE_V270.md`
- `listoni/LISTONE_STORICO_V269.md`
- `listoni/LISTONE_TEST_REALE_V273.md`
- `listoni/LISTONE_UI_SEMPLIFICATA_V280.md`
- `pianificazione/CALCIOMERCATO_AGGREGATORE_V302.md`
- `refactor/CALCIOMERCATO_FILTERS_REFACTOR_V339.md`
- `refactor/CALCIOMERCATO_IMAGES_REFACTOR_V334.md`
- `refactor/CALCIOMERCATO_PLAYER_DIAGNOSTICS_V359.md`
- `refactor/CALCIOMERCATO_PLAYER_MATCHING_V337.md`
- `refactor/CALCIOMERCATO_PLAYER_MODAL_V336.md`
- `refactor/CALCIOMERCATO_PLAYER_TIMELINE_REFACTOR_V335.md`
- `refactor/CALCIOMERCATO_RENDERER_REFACTOR_V338.md`
- `refactor/JS_LEGACY_CLEANUP_CALCIOMERCATO_V344.md`
- `release/RELEASE_V323_ARCHIVIO_CALCIOMERCATO.md`
- `release/RELEASE_V324_DIAGNOSTICA_ARCHIVIO_CALCIOMERCATO.md`
- `release/RELEASE_V325_ANTEPRIME_CALCIOMERCATO.md`
- `release/RELEASE_V328_CARD_CALCIOMERCATO_MOBILE_FAVICON.md`
- `release/RELEASE_V329_TMW_SQUADRE_CALCIOMERCATO.md`
- `release/RELEASE_V331_CARD_COMPATTE_LISTONE.md`
- `release/RELEASE_V332_CARD_CALCIOMERCATO_COMPATTE.md`
- `release/RELEASE_V334_CALCIOMERCATO_IMAGES_REFACTOR.md`
- `release/RELEASE_V335_PLAYER_TIMELINE_CALCIOMERCATO.md`
- `release/RELEASE_V338_CALCIOMERCATO_RENDERER_REFACTOR.md`
- `release/RELEASE_V339_CALCIOMERCATO_FILTERS_REFACTOR.md`
- `test/CALCIOMERCATO_PLAYER_DIAGNOSTICS_V359.md`

### 05_TEST_AUDIT_REGRESSIONI.md

- `audit/AUDIT_CODICE_260528_V262.md`
- `audit/AUDIT_COMPETIZIONI_V267.md`
- `audit/AUDIT_FILE_E_LEGACY_V272.md`
- `audit/AUDIT_MOBILE_COMPLETO_V284.md`
- `audit/AUDIT_MOBILE_LIGHT_CONTRAST_V280.md`
- `audit/AUDIT_MOBILE_LIGHT_CONTRAST_V281.md`
- `audit/DARK_MODE_ROSE_MOBILE_V289.md`
- `audit/FIX_MOBILE_MIRATI_V285.md`
- `audit/FIX_PRIMA_COLONNA_MOBILE_LIGHT_V286.md`
- `audit/FIX_ROSE_MOBILE_LIGHT_V288.md`
- `audit/JS_LEGACY_CLEANUP_MATRIX_V344.md`
- `audit/LEGACY_DEPENDENCIES_MATRIX_V342.md`
- `audit/MANUAL_QA_INFO_MATRIX_V360.md`
- `audit/MANUAL_QA_PANEL_MATRIX_V357.md`
- `audit/MANUAL_QA_PANEL_MATRIX_V358.md`
- `audit/MANUAL_QA_STABILITY_MATRIX_V363.md`
- `audit/MANUAL_QA_TRACKER_MATRIX_V356.md`
- `audit/MINOR_LEGACY_CANDIDATES_V346.md`
- `audit/MOBILE_HOTFIX_CLEANUP_MATRIX_V352.md`
- `audit/MOBILE_REVIEW_FINALE_V304.md`
- `audit/PRESIDENT_DASHBOARD_MATRIX_V369.md`
- `audit/PRESIDENT_NOTIFICATION_CENTER_MATRIX_V370.md`
- `audit/PROTECTED_REGRESSION_MATRIX_V367.md`
- `audit/PULIZIA_ASSET_V265.md`
- `audit/REFACTOR_CLEANUP_CONSOLIDATION_MATRIX_V354.md`
- `audit/REGRESSION_SMOKE_MATRIX_V355.md`
- `audit/RIFINITURA_CONTROLLI_MOBILE_V287.md`
- `audit/SHARED_HELPER_LEGACY_CLEANUP_MATRIX_V345.md`
- `audit/STABILIZZAZIONE_PROTETTA_MATRIX_V365.md`
- `audit/THEME_COMPETITIONS_AUDIT_MATRIX_V353.md`
- `audit/TRADE_DOMAIN_HARDENING_MATRIX_V366.md`
- `audit/TRADE_SIMULATOR_CLEANUP_MATRIX_V347.md`
- `audit/TRADE_SIMULATOR_DEV_AUDIT_MATRIX_V348.md`
- `audit/TRADE_SIMULATOR_DEV_CLEANUP_MATRIX_V350.md`
- `audit/TRADE_SIMULATOR_LOCAL_ACTIONS_MATRIX_V349.md`
- `audit/TRADE_SIMULATOR_PANEL_MATRIX_V361.md`
- `audit/TRADE_SIMULATOR_TARGET_MATRIX_V362.md`
- `audit/VERIFICA_FUNZIONALITA_V272.md`
- `refactor/APP_JS_AUDIT_V293.md`
- `refactor/ASSET_IMPORT_AUDIT_V298.md`
- `refactor/AUDIT_STYLES_APP_V290.md`
- `refactor/CSS_AUDIT_V300.md`
- `refactor/LEGACY_DEPENDENCIES_AUDIT_V342.md`
- `refactor/MANUAL_QA_INFO_V360.md`
- `refactor/MANUAL_QA_PANEL_V357.md`
- `refactor/MANUAL_QA_PANEL_V358.md`
- `refactor/MANUAL_QA_STABILITY_V363.md`
- `refactor/MANUAL_QA_TRACKER_V356.md`
- `refactor/MINOR_LEGACY_AUDIT_V346.md`
- `refactor/REGRESSION_SMOKE_SUITE_V355.md`
- `refactor/THEME_COMPETITIONS_AUDIT_V353.md`
- `refactor/TRADE_SIMULATOR_DEV_AUDIT_V348.md`
- `REGRESSION_TESTS.md`
- `release/RELEASE_V330_TMW_TILE_TESTUALE.md`
- `release/RELEASE_V342_LEGACY_DEPENDENCIES_AUDIT.md`
- `release/RELEASE_V346_MINOR_LEGACY_AUDIT.md`
- `release/RELEASE_V348_TRADE_SIMULATOR_DEV_AUDIT.md`
- `release/RELEASE_V353_THEME_COMPETITIONS_AUDIT.md`
- `release/RELEASE_V355_REGRESSION_SMOKE_SUITE.md`
- `release/RELEASE_V356_MANUAL_QA_TRACKER.md`
- `release/RELEASE_V357_MANUAL_QA_PANEL.md`
- `release/RELEASE_V358_MANUAL_QA_PANEL.md`
- `release/RELEASE_V360_MANUAL_QA_INFO.md`
- `release/RELEASE_V363_MANUAL_QA_STABILITY.md`
- `release/RELEASE_V367_SMOKE_TEST_PROTETTI.md`
- `test/MANUAL_QA_INFO_INTERFACCIA_V360.md`
- `test/MANUAL_QA_INTERFACCIA_V357.md`
- `test/MANUAL_QA_INTERFACCIA_V358.md`
- `test/MANUAL_QA_STABILITY_INTERFACCIA_V363.md`
- `test/MANUAL_QA_TRACKER_COMANDI_V356.md`
- `test/PRESIDENT_DASHBOARD_V369.md`
- `test/PRESIDENT_NOTIFICATION_CENTER_V370.md`
- `test/SMOKE_TEST_AUTOMATICI_V367.md`
- `test/TEST_MANUALE_COMPLETO_V355.md`
- `test/TRADE_SIMULATOR_PANEL_INTERFACCIA_V361.md`
- `test/TRADE_SIMULATOR_TARGET_INTERFACCIA_V362.md`

### 06_RELEASE_HANDOFF_REFACTOR_STORICO.md

- `archive/soccer-data/mapping-history/fbref-player-map.v371.csv`
- `archive/soccer-data/mapping-history/fbref-player-map.v371.json`
- `archive/soccer-data/mapping-history/fbref-player-map.v372.csv`
- `archive/soccer-data/mapping-history/fbref-player-map.v372.json`
- `archive/soccer-data/mapping-history/fbref-player-map.v373.csv`
- `archive/soccer-data/mapping-history/fbref-player-map.v373.json`
- `archive/soccer-data/mapping-history/fbref-player-map.v374.csv`
- `archive/soccer-data/mapping-history/fbref-player-map.v374.json`
- `archive/soccer-data/mapping-history/fbref-player-map.v375.csv`
- `archive/soccer-data/mapping-history/fbref-player-map.v375.json`
- `archive/soccer-data/mapping-history/fbref-player-map.v376.csv`
- `archive/soccer-data/mapping-history/fbref-player-map.v376.json`
- `archive/soccer-data/mapping-history/fbref-player-map.v377.csv`
- `archive/soccer-data/mapping-history/fbref-player-map.v377.json`
- `archive/soccer-data/mapping-history/fbref-player-map.v378.csv`
- `archive/soccer-data/mapping-history/fbref-player-map.v378.json`
- `archive/soccer-data/mapping-history/fbref-player-map.v379.csv`
- `archive/soccer-data/mapping-history/fbref-player-map.v379.json`
- `archive/soccer-data/mapping-history/fbref-player-map.v380.csv`
- `archive/soccer-data/mapping-history/fbref-player-map.v380.json`
- `archive/soccer-data/mapping-history/fbref-player-map.v381.csv`
- `archive/soccer-data/mapping-history/fbref-player-map.v381.json`
- `archive/soccer-data/mapping-history/fbref-player-map.v382.csv`
- `archive/soccer-data/mapping-history/fbref-player-map.v382.json`
- `archive/soccer-data/mapping-history/fbref-player-map.v383.csv`
- `archive/soccer-data/mapping-history/fbref-review-batch.v372.csv`
- `archive/soccer-data/mapping-history/fbref-review-batch.v373.csv`
- `archive/soccer-data/mapping-history/fbref-review-batch.v374.csv`
- `archive/soccer-data/mapping-history/fbref-review-batch.v375.csv`
- `archive/soccer-data/mapping-history/fbref-review-batch.v376.csv`
- `archive/soccer-data/mapping-history/fbref-review-batch.v377.csv`
- `archive/soccer-data/mapping-history/fbref-review-batch.v378.csv`
- `archive/soccer-data/mapping-history/fbref-review-batch.v379.csv`
- `archive/soccer-data/mapping-history/fbref-review-batch.v380.csv`
- `archive/soccer-data/mapping-history/fbref-review-batch.v381.csv`
- `archive/soccer-data/mapping-history/fbref-review-batch.v382.csv`
- `archive/soccer-data/mapping-history/fbref-review-batch.v383.csv`
- `archive/soccer-data/README_V389.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V313.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V322.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V333.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V334.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V335.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V336.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V337.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V338.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V339.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V340.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V341.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V342.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V343.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V344.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V345.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V346.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V347.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V348.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V349.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V350.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V351.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V352.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V353.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V354.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V355.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V356.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V357.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V358.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V359.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V360.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V361.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V362.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V363.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V365.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V366.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V367.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V368.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V369.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V370.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V371.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V372.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V373.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V374.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V375.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V376.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V377.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V378.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V379.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V380.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V381.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V382.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V383.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V385.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V389.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V390.md`
- `refactor/APP_HELPER_CLEANUP_V297.md`
- `refactor/APP_HELPER_REWIRE_V295.md`
- `refactor/APP_HELPER_REWIRE_V302.md`
- `refactor/APP_HELPERS_EXTRACTION_V294.md`
- `refactor/CONTROLLI_PRE_PUSH_V282.md`
- `refactor/CSS_CLEANUP_V292.md`
- `refactor/CSS_CLEANUP_V301.md`
- `refactor/CSS_REFACTOR_PROTETTO_V333.md`
- `refactor/CSS_REFACTOR_STABLE_V299.md`
- `refactor/CSS_REFACTOR_V291.md`
- `refactor/MOBILE_HOTFIX_CLEANUP_V352.md`
- `refactor/REFACTOR_CLEANUP_CONSOLIDATION_V354.md`
- `refactor/SHARED_HELPER_BRIDGE_V341.md`
- `refactor/SHARED_HELPER_LEGACY_CLEANUP_V345.md`
- `refactor/TRADE_SIMULATOR_CLEANUP_V347.md`
- `refactor/TRADE_SIMULATOR_DEV_CLEANUP_V350.md`
- `refactor/TRADE_SIMULATOR_LOCAL_ACTIONS_V349.md`
- `refactor/TRADE_SIMULATOR_PANEL_V361.md`
- `refactor/TRADE_SIMULATOR_TARGET_PRESIDENT_V362.md`
- `release/CONTROLLI_PRE_PUSH_V282.md`
- `release/NETLIFY_HUGO_BUILD_FIX_V318.md`
- `release/PULIZIA_MACOS_V283.md`
- `release/PUSH_MASTER_E_RITORNO_BRANCH_V272.md`
- `release/RELEASE_V326_RIFINITURE_UI.md`
- `release/RELEASE_V333_REFACTOR_CSS_PROTETTO.md`
- `release/RELEASE_V336_PLAYER_TIMELINE_MODAL.md`
- `release/RELEASE_V337_PLAYER_MATCHING.md`
- `release/RELEASE_V341_SHARED_HELPER_BRIDGE.md`
- `release/RELEASE_V344_JS_LEGACY_CLEANUP.md`
- `release/RELEASE_V345_SHARED_HELPER_LEGACY_CLEANUP.md`
- `release/RELEASE_V347_TRADE_SIMULATOR_CLEANUP.md`
- `release/RELEASE_V349_TRADE_SIMULATOR_LOCAL_ACTIONS.md`
- `release/RELEASE_V350_TRADE_SIMULATOR_DEV_CLEANUP.md`
- `release/RELEASE_V352_MOBILE_HOTFIX_CLEANUP.md`
- `release/RELEASE_V354_REFACTOR_CLEANUP_CONSOLIDATION.md`
- `release/RELEASE_V359_PLAYER_DIAGNOSTICS.md`
- `release/RELEASE_V361_TRADE_SIMULATOR_PANEL.md`
- `release/RELEASE_V362_TRADE_SIMULATOR_TARGET.md`
- `release/RELEASE_V364_FIX_SIMULAZIONI_TRADE_TARGET.md`
- `release/RELEASE_V365_STABILIZZAZIONE_PROTETTA.md`
- `release/RELEASE_V366_HARDENING_TRATTATIVE_NOTIFICHE.md`
- `release/RELEASE_V369_DASHBOARD_PRESIDENTE_PROTETTA.md`
- `release/RELEASE_V370_CENTRO_NOTIFICHE_PRESIDENTE.md`

### 07_PIANIFICAZIONE_ROADMAP_PROSSIME_ATTIVITA.md

- `pianificazione/PROSSIME_ATTIVITA_V272.md`
- `pianificazione/ROADMAP.md`
- `PROSSIME_ATTIVITA_260528.md`

---

# Stato corrente, indice e istruzioni operative

Contiene documenti di ingresso, stato corrente, istruzioni per assistenti e indice dei contenuti accorpati.

> Documento generato da accorpamento per categoria. I contenuti originali sono riportati integralmente sotto il rispettivo percorso originale.

File originali accorpati: **6**.

## Indice dei file originali in questa categoria

- `00_START_HERE_V272.md`
- `AI_HANDOFF_ZONAORIENTALE_CURRENT.md`
- `CURRENT_STATE.md`
- `ISTRUZIONI_NUOVO_ASSISTENTE_260528.md`
- `README.md`
- `RESOCONTO_SITO_V313.md`

---

## 1. `00_START_HERE_V272.md`

- Percorso originale: `00_START_HERE_V272.md`
- Dimensione originale: 18997 byte
- SHA-256: `e6cdfc5c061c011b3c940d3607af54f88108a83cc7743243ab8a85c0f78d1e0d`

````markdown
## Aggiornamento V313 - Admin ordinato, feed Calciomercato esteso e resoconto funzionale

Versione runtime corrente: **V313 admin ordinato e resoconto funzionale**. Leggere subito `RESOCONTO_SITO_V313.md`, `admin/ADMIN_LAYOUT_V313.md`, `calciomercato/CALCIOMERCATO_FEED_V313.md` e `handoff/HANDOFF_NUOVO_ASSISTENTE_V313.md`. V313 sposta il titolo Admin sopra tutti i pannelli, fa partire le categorie Admin ridotte lasciando aperto il gate `Carica dati amministrazione`, migliora la Netlify Function Calciomercato con feed multipli/limiti configurabili e aggiorna `FUNZIONALITA'.md` su richiesta esplicita. Regola principale: nessun refactor deve perdere funzionalita esistenti.

## Aggiornamento V299 - CSS refactor stabile

Versione runtime corrente: **V299 CSS refactor stabile**. Leggere anche `refactor/CSS_REFACTOR_STABLE_V299.md`. La release consolida i CSS refactor V292 usando nomi stabili: `assets/css/refactor/mobile-controls.css`, `assets/css/refactor/rosters-tables.css` e `assets/css/refactor/theme-light-suspended.css`. I primi due sono importati dagli HTML, il file Light resta sospeso e non importato. Funzionalita da preservare: Listone con Modifica/filtro/export admin-only, Rose e prima colonna sticky, Dashboard Presidente, bottom nav/menu Altro/pulsante Su, Dark mode unico, `competition.html` e `player.html`.

## Aggiornamento V298 - Audit asset/import orfani

Versione runtime corrente: **V298 audit asset/import orfani**. Leggere anche `refactor/ASSET_IMPORT_AUDIT_V298.md`. La release aggiunge lo script non distruttivo `static/zonaorientale/tools/audit-assets-v298.sh` per segnalare import/href/src/url locali mancanti, file versionati superati e possibili asset CSS/JS orfani. Non rimuove file e non cambia funzionalita'. Prima di qualsiasi `git rm` su asset CSS/JS verificare esplicitamente Listone, Rose, Dashboard Presidente, Admin, pagine standalone, mobile nav e Dark mode.

## Aggiornamento V296

Versione runtime corrente: **V296 export modifiche solo admin**. Leggere anche `refactor/LISTONE_EXPORT_ADMIN_ONLY_V296.md`. Il pulsante `Esporta modifiche CSV` del Listone e' ora riservato agli Admin. La UI pubblica mantiene Listone, colonna `Modifica`, filtro `Modifiche` e usciti storici, ma non mostra il download CSV.

## Aggiornamento V295 - Primo collegamento helper puri app.js

Versione runtime corrente: **V295 primo helper app.js**. Leggere anche `refactor/APP_HELPER_REWIRE_V295.md`. La release collega solo `csvEscapeV278` al modulo `assets/js/utils/shared-helpers-v295.js`; non sposta render, Firebase, Admin, Listone, Rose o mobile chrome. Funzionalita da preservare e testare: export CSV modifiche Listone, filtro Modifiche, usciti storici, rose/pagina squadra, Dashboard Presidente, Admin e mobile nav.

## Aggiornamento V293 - Audit mirato app.js

Versione runtime corrente: **V293 audit mirato app.js**. Leggere anche `refactor/APP_JS_AUDIT_V293.md`. La release non cambia funzionalita' e non estrae ancora codice: mappa le aree sicure/rischiose di `assets/app.js` prima di una futura V294. Regola: ogni refactor JS deve dichiarare le funzionalita a rischio, come vengono preservate e i test necessari.

## Aggiornamento V292

Versione runtime corrente: **V292 pulizia CSS Light sospeso**. Leggere anche `refactor/CSS_CLEANUP_V292.md`. La release non cambia funzionalita': sposta le regole Light recenti V285-V288 fuori dai CSS attivi e le conserva in `assets/css/refactor/theme-light-suspended-v292.css`, non importato. Restano attivi Dark mode unico, controlli mobile, rose/tabelle e fix V289.

## Aggiornamento V291

Versione runtime corrente: **V292 pulizia CSS Light sospeso**. Leggere anche `refactor/CSS_REFACTOR_V291.md`. La release non cambia funzionalita': sposta i blocchi CSS V285-V289 da `styles.css` in due file dedicati sotto `assets/css/refactor/`, mantenendo lo stesso ordine di override e aggiungendo controlli nello script pre-push.

## Aggiornamento V290 - Audit styles.css e app.js

V290 aggiunge un audit conservativo di `assets/styles.css` e `assets/app.js` prima di qualunque refactor reale. Non cambia comportamento runtime: aggiorna versione/cache-buster, aggiunge diagnostica `window.ZonaOrientaleStylesAppAuditV290` e documenta funzionalita a rischio da preservare in `docs/zonaorientale/refactor/AUDIT_STYLES_APP_V290.md`. Regola operativa: ogni refactor successivo deve dichiarare cosa rischia di perdere e come lo preserva.

## Aggiornamento V289 - Dark mode e rose mobile

V289 sospende temporaneamente la modalita Light: il sito forza il tema Dark anche se nel browser era salvato Light e il pulsante cambio tema viene nascosto. Corregge inoltre le tabelle Rosa da mobile in modalita Dark, compattando le righe e centrando verticalmente la prima colonna nelle rose pubbliche e nella pagina squadra. Documento: `docs/zonaorientale/audit/DARK_MODE_ROSE_MOBILE_V289.md`. Diagnostica: `window.ZonaOrientaleDarkModeOnlyV289`.

## Aggiornamento V288 - Fix rose mobile Light

Versione corrente: V288 fix rose mobile Light. Leggere anche `audit/FIX_ROSE_MOBILE_LIGHT_V288.md`. La release corregge la prima colonna della tabella Rosa nella pagina squadra da smartphone in tema Light: testo chiaro su sfondo scuro, nome giocatore leggermente piu' grande, centratura verticale e righe piu' compatte. Intervento solo CSS/UI, senza modifiche a Firebase, EmailJS, dati JSON o logiche runtime.

## Aggiornamento V287 - Rifinitura controlli mobile

Versione corrente: V287 rifinitura controlli mobile. Leggere anche `audit/RIFINITURA_CONTROLLI_MOBILE_V287.md`. La release applica una patch CSS/UI mirata a form, filtri, bottoni, menu e aree scrollabili da smartphone. Non modifica Firebase, EmailJS, dati JSON o logiche runtime.

## Aggiornamento V286 - Fix prima colonna mobile Light

Versione corrente: V286 fix prima colonna mobile. Leggere anche `audit/FIX_PRIMA_COLONNA_MOBILE_LIGHT_V286.md`. La release corregge il contrasto della prima colonna sticky in tema Light/mobile per Listone e tabelle rose, evitando il caso nome giocatore nero su sfondo scuro. Intervento solo CSS/UI, senza modifiche a Firebase, EmailJS, dati JSON o logiche runtime.

## Aggiornamento V285 - Fix mirati mobile

Versione corrente: V285 fix mirati mobile. Leggere anche `audit/FIX_MOBILE_MIRATI_V285.md`. La release applica correzioni CSS conservative per migliorare leggibilita' mobile in tema Light, tabelle scrollabili, prima colonna sticky, badge/pill/bottoni secondari e bottom navigation. Nessuna modifica funzionale a Firebase, EmailJS, dati JSON o logiche runtime.

## Aggiornamento V284 - Audit mobile completo

Versione corrente: V287 rifinitura controlli mobile. Leggere anche `audit/AUDIT_MOBILE_COMPLETO_V284.md`. La release introduce una checklist operativa per verificare mobile, tema Light/Dark, tabelle, form, Dashboard Presidente e Admin prima dei prossimi fix CSS. Nessuna modifica funzionale a Firebase, EmailJS o dati runtime.

## Aggiornamento V283 - Pulizia file macOS/residui

Versione corrente: V283 pulizia file macOS. Leggere anche `release/PULIZIA_MACOS_V283.md`. La release aggiunge lo script `static/zonaorientale/tools/cleanup-macos-artifacts-v283.sh` e aggiorna i controlli pre-push V282 per riconoscere ulteriori metadata macOS. Nessuna modifica funzionale a Firebase, EmailJS o dati runtime.

## Aggiornamento V282 - Controlli pre-push

Versione corrente: V283 pulizia file macOS. Leggere anche `release/CONTROLLI_PRE_PUSH_V282.md`. Prima di ogni commit/push usare `static/zonaorientale/tools/check-zonaorientale.sh`.

## Aggiornamento V275

Versione corrente: V275 funzionalita V271-274. Dopo i documenti V272 leggere anche `FUNZIONALITA'V271-274.md`, `listoni/LISTONE_TEST_REALE_V273.md` e `listoni/LISTONE_CODICI_SQUADRA_V274.md`.

# START HERE - ZonaOrientale V272

Questo file e' l'indice operativo aggiornato al ramo:

```text
refactor/260528-zonaorientale-next
```

Versione runtime attesa dopo l'overlay:

```text
V293 audit mirato app.js
```

## Documenti principali da leggere

1. `handoff/HANDOFF_NUOVO_ASSISTENTE_V272.md`  
   Istruzioni complete per un nuovo assistente AI.

2. `audit/VERIFICA_FUNZIONALITA_V272.md`  
   Controllo delle funzionalita che potrebbero perdersi e stato dei moduli collegati.

3. `audit/AUDIT_FILE_E_LEGACY_V272.md`  
   File legacy, duplicati e aree da non eliminare senza test mirati.

4. `pianificazione/PROSSIME_ATTIVITA_V272.md`  
   Backlog organizzato: nuove funzionalita, correzioni, pulizia, refactor e dati esterni.

5. `release/PUSH_MASTER_E_RITORNO_BRANCH_V272.md`  
   Procedura Git per fondere il branch su `master` e poi tornare al branch di lavoro.

## Documenti storici da preservare

- `FUNZIONALITA'.md` resta il registro funzionale principale e va modificato solo su richiesta esplicita dell'utente.
- `FUNZIONALITA'V240-255.md`, `FUNZIONALITA'V256-262.md`, `FUNZIONALITA'V263-270.md` sono registri incrementali.
- `REGRESSION_TESTS.md` resta la checklist da usare prima di merge/deploy.
- `AI_HANDOFF_ZONAORIENTALE_CURRENT.md` resta il file handoff storico cumulativo.

## Regola operativa

Ogni modifica deve continuare a essere consegnata come unico zip con radici:

```text
zonaorientale/
docs/
```

Nella repo reale:

```text
zonaorientale/ -> static/zonaorientale/
docs/ -> docs/
```


Nota V273: leggere anche `listoni/LISTONE_TEST_REALE_V273.md` per l'esito dei test Listone con Excel reale.


## V274 - Codici squadra canonici nel Listone

I listoni possono arrivare con sigle o nomi estesi delle squadre reali. Il sistema accetta entrambi, ma salva/visualizza la sigla canonica a 3 lettere e conserva l’originale come metadato quando disponibile.

## V276-V277

- V276: pannello Admin `Diagnostica dati`.
- V277: filtro `Modifiche` nel Listone.


## V280 - UI Listone semplificata

- La sezione pubblica `Storico listoni` e' nascosta/rimossa dalla UI.
- Restano attive le logiche di confronto storico usate da colonna `Modifica`, filtro `Modifiche`, usciti storici ed export CSV.
- Nuovo documento: `listoni/LISTONE_UI_SEMPLIFICATA_V280.md`.
- Primo audit contrasto mobile Light: `audit/AUDIT_MOBILE_LIGHT_CONTRAST_V280.md`.


## V281 - Contrasto mobile Light

- Patch grafica mirata per migliorare la leggibilita in tema Light da smartphone.
- Intervento solo CSS + diagnostica runtime, senza modifiche a Firebase, EmailJS o dati JSON.
- Nuovo documento: `audit/AUDIT_MOBILE_LIGHT_CONTRAST_V281.md`.
- Diagnostica: `window.ZonaOrientaleMobileLightContrastV281`.

## V294 - Helper puri app.js

- Aggiunto `assets/js/utils/shared-helpers-v294.js` come modulo non invasivo di helper puri.
- Nessuna funzione storica di `app.js` viene rimossa o riscritta.
- Funzionalita da preservare esplicitamente: Listone, rose, Dashboard Presidente, Admin, news share, mobile chrome e Dark mode unico.
- Documento tecnico: `refactor/APP_HELPERS_EXTRACTION_V294.md`.
- Diagnostica: `window.ZonaOrientaleAppHelpersExtractionV294`.


## Aggiornamento V297

V297 completa la pulizia del primo helper estratto: `shared-helpers-v294.js` e' obsoleto e va rimosso con `git rm`; `shared-helpers-v295.js` resta il modulo attivo. Verificare export CSV Listone admin-only prima del push.

## Aggiornamento V300

V300 introduce l'audit CSS non distruttivo `tools/audit-css-v300.sh` e il documento `refactor/CSS_AUDIT_V300.md`. Prima di pulire `styles.css`, verificare sempre le funzionalita a rischio: Listone, rose, Dashboard Presidente, mobile navigation, Dark mode unico, Admin, `competition.html` e `player.html`.

## Aggiornamento V301

V301 aggiunge la pulizia controllata dei CSS refactor residui tramite `tools/cleanup-css-refactor-v301.sh` e il documento `refactor/CSS_CLEANUP_V301.md`. Prima di rimuovere vecchi CSS V291/V292, eseguire sempre il dry-run e verificare che Listone, rose/pagina squadra, Dashboard Presidente, mobile navigation, Dark mode unico, `competition.html` e `player.html` restino collegati.

## Aggiornamento V302

- Versione runtime: `V302 helper CSV condiviso`.
- Secondo micro-collegamento helper JS: `buildListoneChangeExportCsvV278` usa `ZonaOrientaleSharedHelpersV295.rowsToCsv` con fallback legacy.
- Export modifiche Listone resta riservato agli Admin.
- La Light mode resta sospesa; non e' previsto recupero nel ciclo corrente.
- Studio fattibilita' futura sezione `Calciomercato`: `docs/zonaorientale/pianificazione/CALCIOMERCATO_AGGREGATORE_V302.md`.

## Aggiornamento V303

V303 estende il pannello `Admin -> Diagnostica dati` con controlli di qualita non distruttivi su Listoni, Rose, Competizioni e News. Non modifica Firebase, EmailJS, dati JSON o logiche runtime critiche. Prima di ulteriori refactor verificare sempre che Listone, Rose, Dashboard Presidente, Admin e mobile navigation restino agganciati.



## Aggiornamento V304

V304 aggiunge la review mobile finale e il checkpoint pre-Calciomercato: `docs/zonaorientale/audit/MOBILE_REVIEW_FINALE_V304.md`.

Prima di iniziare la nuova sezione Calciomercato verificare: check pre-push, Listone pubblico/Admin, Rose/pagina squadra, Dashboard Presidente, Admin Diagnostica/Richieste, mobile navigation, `competition.html`, `player.html` e Dark mode unico.

## Nota V305 - Calciomercato base statico

La sezione `Calciomercato` e' stata aggiunta come base statica/manuale. I dati sono in `static/zonaorientale/assets/calciomercato/links.json`. Non recupera automaticamente articoli da siti esterni e non modifica Firebase/EmailJS. Per evoluzioni automatiche usare una futura Netlify Function o altra sorgente server-side, evitando fetch diretti dal browser verso siti terzi.

## V306 - Calciomercato giocatori

La sezione `Calciomercato` supporta ora, per ogni articolo statico, l'elenco dei giocatori interessati tramite `players`/`giocatori`. La funzione e' solo statica/manuale: niente scraping, niente Netlify Function e niente Firebase. Preservare sempre Fantamercato interno, Listone, Rose, Dashboard Presidente e Admin.
## V307 - Calciomercato nome sezione

La sezione pubblica introdotta come `Calcio mercato` viene rinominata in `Calciomercato` in UI e documentazione. La route interna resta `#calciomercato` e il file dati resta `assets/calciomercato/links.json`. Nessuna modifica a Fantamercato interno, Listone, Rose, Admin, Firebase o EmailJS.



## V308 - Calciomercato squadre multiple e stato trattativa

- La sezione `Calciomercato` resta statica/manuale e non recupera automaticamente dati dai siti esterni.
- Ogni articolo puo essere collegato a piu squadre tramite `teams`, `teamNames` o `squadre`.
- Ogni articolo puo mostrare uno stato trattativa tramite `marketStatus`, `status` o `stato`.
- Funzionalita preservate: Fantamercato interno, Listone, export CSV solo Admin, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, mobile navigation e Dark mode unico.

## V309 - Nota rapida Calciomercato automatico

La sezione `Calciomercato` ora puo recuperare automaticamente articoli tramite Netlify Function. Per questa release lo zip include anche la radice `netlify/` perche la funzione vive fuori da `static/zonaorientale`. Le fonti si configurano in `static/zonaorientale/assets/calciomercato/links.json`.


## Aggiornamento V310

- Versione runtime: `V310 calciomercato layout orizzontale`.
- La sezione `Calciomercato` usa card orizzontali/lista per rendere leggibili gli articoli RSS.
- La Netlify Function RSS V309 e il fallback statico restano invariati.
- Funzionalita' da preservare: Fantamercato interno, Listone, Rose, Admin, Dashboard Presidente, mobile navigation.

## Aggiornamento V311

Calciomercato mostra data e ora di pubblicazione articolo quando il feed RSS la fornisce. Nessun cambio a recupero RSS, Firebase, Listone, Rose o Fantamercato interno.

## Aggiornamento V312

Calciomercato ora formatta in modo esplicito in `Europe/Rome` sia l'orario articoli sia il timestamp `aggiornato ...` del feed RSS. Corregge il caso in cui l'ora grezza UTC risultava due ore indietro rispetto all'Italia. Nessun cambio a RSS, Netlify Function, Fantamercato interno, Listone, Rose o Admin.

## V314 - Nota rapida

Calciomercato aggiornato con filtro fonte, fonti RSS aggiuntive e ordine corretto del filtro squadra (`Tutte le squadre`, `Generale`, squadre). Il modulo AI di riepilogo giocatore/squadra e' solo pianificato, non implementato.

## V316 - Calciomercato ricerca e range

- Rimossa l'idea di applicare ora la sintesi AI: nessuna funzione AI e nessuna chiave OpenAI richiesta.
- Rimossi dalle fonti attive Virgilio Sport e La Gazzetta dello Sport.
- Aggiunti ricerca per keyword e range temporale sui feed RSS Calciomercato.
- Default UI: ultime 12 ore; scroll/pulsante caricano articoli più vecchi.
- Limiti feed alzati a 500 articoli totali, 250 per fonte, 20 fonti.
- Funzionalita da preservare: Fantamercato interno, Listone, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, mobile navigation e fallback statico.

## V317 - Calciomercato scroll e range RSS

V317 corregge il caricamento progressivo del Calciomercato: quando si arriva in fondo alla sezione o si clicca `Carica articoli piu vecchi`, il sito non deve tornare in alto e deve mantenere la posizione di scroll. La lista non viene piu sostituita dal loader durante il caricamento degli articoli meno recenti.

La Netlify Function `calciomercato-feed` espone anche un riepilogo `feedRange`, cosi la UI puo spiegare quando un range molto vecchio non produce risultati perche i feed RSS non sono un archivio storico completo.

Funzionalita da preservare: Fantamercato interno, Listone pubblico/Admin, export CSV solo Admin, Rose, pagina squadra, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, mobile navigation e fallback statico Calciomercato.

## Aggiornamento V319

V319 aggiunge il layout mobile compatto per la sezione `Calciomercato`. La modifica e' solo UI/CSS/markup: nessun cambio a RSS, Netlify Function, dati, Firebase o funzioni storiche. Prima di nuove modifiche alla sezione testare filtri, ricerca, range, caricamento progressivo e mobile.


## Aggiornamento V320 - Riconoscimento Calciomercato

V320 aggiunge riconoscimento automatico prudente di squadre, giocatori e allenatori negli articoli RSS del Calciomercato. La modifica e' isolata alla sezione Calciomercato e non tocca Fantamercato interno, Listone, Rose, Admin, Presidente, Firebase/Auth/EmailJS o mobile navigation.


## V321 - Fix espansione Diagnostica dati Admin

Ripristinata l'espansione del pannello `Admin -> Diagnostica dati` con handler delegato limitato al solo pannello diagnostica. Nessuna modifica a Firebase, Listone, Rose, Calciomercato o Dashboard Presidente.


## V322 - Fix diagnostica ruoli Listone

Corretto il falso positivo nel pannello `Admin -> Diagnostica dati`, riga `Listoni - qualita dati`, che poteva segnalare `senza ruolo 663` nonostante i ruoli fossero presenti nei JSON Listone. La diagnostica ora riconosce anche `classicRole`, `rosterRole`, `mantraRoles`, `roleClassic`, `roleMantra`, `R`, `R.` e `R.MANTRA`. Nessun JSON, rendering Listone, convertitore, Firebase, EmailJS, Calciomercato o Fantamercato interno e' stato modificato.
````

---

## 2. `AI_HANDOFF_ZONAORIENTALE_CURRENT.md`

- Percorso originale: `AI_HANDOFF_ZONAORIENTALE_CURRENT.md`
- Dimensione originale: 8237 byte
- SHA-256: `0a820b66b364496e8a1c6d475353ff5fa65c0edb56e598d0a420981d6324b49e`

````markdown
# AI handoff corrente - ZonaOrientale

Data: 2026-06-07  
Runtime corrente: **V405r2 - colori ruolo ripristinati, base V405 preservata**  
Base runtime preservata: **V398 - Soccer Data rimossa**  
Docs correnti: **V405r2 documentazione accorpata aggiornata**  
Branch di lavoro: `refactor/260607-clean-from-master`  
Branch produzione Netlify: `master`


## Nota V405r2 colori ruolo

La patch V405r2 ripristina la colorazione delle righe giocatore richiesta dall'utente:

- P/portieri: arancione;
- D/difensori: verde;
- C/centrocampisti: blu/azzurro;
- A/attaccanti: rosso.

Gli asset dedicati sono `assets/role-backgrounds-v405r2.css` e `assets/role-backgrounds-v405r2.js`, caricati da `index.html` con `?v=405r2` per evitare cache vecchia. Non riprendere il refactor pagine standalone abbandonato dall'utente.

## Regole da rispettare sempre

1. Non cancellare, perdere o scollegare funzionalita esistenti.
2. Agire in modo mirato e preciso sulla richiesta dell'utente.
3. Prima di ogni refactor valutare esplicitamente le funzionalita a rischio.
4. Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
5. Mantenere i docs minimi: aggiornare i canonici e gli storici accorpati, non creare un file per ogni micro-versione.
6. Ad ogni modifica futura aggiornare la documentazione canonica rilevante.
7. Gli zip di consegna devono contenere entrambe le cartelle `zonaorientale` e `docs`.
8. Nei comandi di applicazione mostrare solo i due `cp -R` richiesti dall'utente.
9. Includere sempre comandi Git con commit message coerente.
10. L'utente applica gli zip da `~/Downloads`, gia decompressi.

## Stato funzionale attuale

Sezioni da considerare attive:

- Home/Dashboard pubblica
- Comunicati/News
- Rose e pagine squadra
- Listone
- Fantamercato e trattative
- Dashboard Presidente
- Calciomercato feed/archivio/player timeline
- Competizioni
- Albo d'Oro e FIFA Ranking
- Statistiche, Archivio, Confronta
- Regolamento
- Admin completo
- Snapshot pubblici e dati statici

Sezione rimossa:

- Soccer Data: rimossa in V398 dalla navbar desktop/mobile e dalla pagina HTML. Accesso diretto a `#soccerdata` reindirizzato al Listone. In V401 il registry la registra solo come pagina rimossa con fallback.

## V405 in breve

V405 estrae una quarta sezione a basso rischio:

- la sezione `archive` resta raggiungibile da `#archive`;
- il template Archivio vive in `assets/js/sections/archive-section-v405.js`;
- il registry corrente e `assets/js/core/section-registry-v405.js` e mantiene alias V401/V402/V403/V404;
- `index.html` mantiene solo l'host della pagina Archivio con `data-section-template="archive-v405"`;
- gli ID runtime `archiveTitle`, `seasonArchiveControlsV196` e `seasonArchiveContentV196` restano invariati;
- nessun flusso Firebase, snapshot, admin o dati e stato modificato.

Funzionalita da preservare dopo V405: `#archive`, caricamento stagioni storiche, selezione stagione, contenuto archivio completo, mobile layout, e tutte le sezioni gia modularizzate (`regolamento`, `compare`, `stats`).

## V404 in breve

V404 estrae una terza sezione a basso rischio e aggiunge una rifinitura UI globale:

- `stats` resta pagina pubblica della shell, ma il template viene montato da `assets/js/sections/stats-section-v404.js`;
- il registry corrente e `assets/js/core/section-registry-v404.js` e mantiene alias V401/V402/V403;
- gli ID `historicalStatsSummaryV193` e `historicalStatsContentV193` non sono stati rinominati;
- `assets/app.js` aggiunge `ZonaOrientaleRoleBackgroundsV404`, che evidenzia le righe delle tabelle giocatori in base al ruolo senza cambiare dati o renderer;
- colori ruoli: P/portieri arancione tenue, D/difensori verde chiaro, C/centrocampisti azzurro-blu tenue, A/attaccanti rosso tenue.

Funzionalita da preservare dopo V404: `#stats`, caricamento statistiche storiche, tabelle Listone, Svincolati, Rose, Area squadra, schede squadra, mobile table-card, Admin e snapshot.

## V403 in breve

V403 estrae la seconda sezione statica/dinamica a basso rischio:

```text
static/zonaorientale/assets/js/sections/compare-section-v403.js
```

La sezione `compare` resta una pagina della shell `index.html`, ma il suo contenuto non e piu inline: viene montato dal modulo V403 su un host con `data-section-template="compare-v403"`.

Punti di compatibilita:

- `assets/js/core/section-registry-v403.js` espone `window.ZonaOrientaleSectionRegistryV403` e mantiene alias V401/V402;
- `assets/app.js` continua a usare gli ID `teamCompareControlsV195` e `teamCompareContentV195`;
- la logica di confronto squadre non e stata spostata o riscritta;
- nessuna funzionalita runtime viene rimossa;
- Soccer Data resta rimossa dal runtime come da V398.

## V402 in breve

V402 estrae la prima sezione statica a basso rischio:

```text
static/zonaorientale/assets/js/sections/regolamento-section-v402.js
```

La sezione `regolamento` resta una pagina della shell `index.html`, ma il suo contenuto non e piu inline: viene montato dal modulo V402 su un host con `data-section-template="regolamento-v402"`.

Punti di compatibilita:

- `assets/js/core/section-registry-v402.js` espone sia `window.ZonaOrientaleSectionRegistryV402` sia l'alias `window.ZonaOrientaleSectionRegistryV401`;
- `assets/app.js` resta compatibile con gli helper V401 gia esistenti;
- nessuna funzionalita runtime viene rimossa;
- Soccer Data resta rimossa dal runtime come da V398.

## V401 in breve

V401 introduce il primo punto stabile per il refactor modulare:

```text
static/zonaorientale/assets/js/core/section-registry-v401.js
```

Il registry espone:

```text
window.ZonaOrientaleSectionRegistryV401
```

con metodi:

- `getPage(pageName)`
- `isKnownPage(pageName)`
- `normalizePage(pageName)`
- `isAdminOnlyPage(pageName)`
- `listPages()`

`assets/app.js` resta il file principale, ma da V401 legge il registry per:

- riconoscere hash/pagine statiche;
- normalizzare pagine rimosse o sconosciute;
- riconoscere pagine admin-only.

Non sono stati spostati template HTML in file separati. I prossimi batch dovranno estrarre una sezione alla volta. Dopo V402 il Regolamento e gia estratto; una prossima candidata a basso rischio puo essere `archive` o `honor`, ma prima va verificato se ci sono renderer JS dinamici collegati.

## Perche Soccer Data e rimossa

Tra V383 e V397 e stato provato un flusso di mapping e stats con FBref e API-Football.

Esito:

- FBref blocca o rende fragile il recupero automatico/server-side.
- API-Football Free funziona ma non consente la stagione corrente utile.
- Il flusso non e sostenibile al momento.
- L'utente ha chiesto di cancellare la sezione Soccer Data dalla UI.

Conclusione operativa: non riattivare Soccer Data senza richiesta esplicita e nuova fonte dati sostenibile.

## File runtime principali

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/core/section-registry-v401.js`
- `static/zonaorientale/assets/css/...`
- `static/zonaorientale/assets/js/...`
- `static/zonaorientale/assets/listoni/...`
- `static/zonaorientale/assets/rose/...`
- `static/zonaorientale/assets/snapshots/...`
- `netlify/functions/...`
- `netlify.toml`

## Firebase e dati

Collections importanti viste nelle rules correnti:

```text
admins
pendingUsers
teamUsers
teamRequests
publicSeasonSnapshots
publicSnapshots
publicTeamSnapshots
transferListings
transferNegotiations
leagueSettings
seasons
presidents
teams
seasonTeams
stadiums
competitions
competitionMatches
competitionResults
honorRoll
fifaRankings
rosterEntries
fmMovements
news
```

La collection `soccerDataPlayerStats` era stata proposta/storica per Soccer Data, ma Soccer Data non e attiva.

## Prossimo refactor consigliato

1. Prossimo refactor consigliato: estrarre una sezione pubblica ancora a basso rischio, preferibilmente `honor` oppure una parte statica di `competitions`, dopo verifica delle dipendenze JS.
2. Dopo V405: continuare con estrazioni a basso rischio e poi iniziare a separare gradualmente anche la logica JS di singole sezioni, mantenendo `index.html` come shell.
3. Solo dopo: valutare vere pagine HTML dedicate per sezioni che beneficiano di link indipendenti.

Non partire da Admin, Fantamercato o Calciomercato: sono sezioni piu sensibili.
````

---

## 3. `CURRENT_STATE.md`

- Percorso originale: `CURRENT_STATE.md`
- Dimensione originale: 5664 byte
- SHA-256: `46ff38a0b260a6d569984cc4923e2034f5a77a6b9b1d339f7504dae0618dc90f`

````markdown
# Current state ZonaOrientale

Data: 2026-06-07

## Versione corrente

- Runtime atteso: **V405r2** per il ripristino colori ruolo; base runtime V405 preservata.
- Base runtime preservata: **V398 - Soccer Data rimossa**.
- Documentazione: **V405r2 documenti accorpati aggiornati**.
- Branch di lavoro: `refactor/260607-clean-from-master`.
- Produzione Netlify: branch `master`.
- Ultima modifica runtime: ripristinata la colorazione tenue delle righe giocatore per ruolo con `assets/role-backgrounds-v405r2.css` e `assets/role-backgrounds-v405r2.js`.
- Ultima modifica docs: aggiornamento consolidati allo stato V405r2.

## Stato sezioni

Attive e da preservare:

- Home/Dashboard pubblica
- News/Comunicati
- Rose e pagine squadra
- Listone
- Fantamercato interno e trattative
- Dashboard Presidente
- Calciomercato feed/archivio/player timeline
- Competizioni
- Albo d'Oro/FIFA Ranking
- Statistiche/Archivio/Confronta
- Regolamento
- Admin e snapshot pubblici

Non attiva:

- Soccer Data: rimossa in V398, mantenuta nel registry V401 solo come pagina rimossa con fallback al Listone.


## Stato tecnico V405r2

- `index.html` carica `assets/role-backgrounds-v405r2.css?v=405r2` e `assets/role-backgrounds-v405r2.js?v=405r2`.
- La feature applica classi legacy `player-role-gk/def/mid/fwd` e classi V405r2 `zo-role-bg-v405r2-*`.
- La palette riprende la baseline V404/V405: portieri arancione, difensori verde, centrocampisti blu, attaccanti rosso.
- Il MutationObserver mantiene i colori dopo filtri, ordinamenti e render dinamici delle tabelle.
- Nessuna modifica a Firebase, auth, admin, snapshot, dati o navigazione mobile.

## Stato tecnico V405

- `index.html` carica registry V405, moduli Regolamento V402, Confronta V403, Statistiche V404, Archivio V405 e `app.js?v=405`.
- `assets/js/sections/archive-section-v405.js` monta il template Archivio sul placeholder `data-section-template="archive-v405"`.
- `assets/js/core/section-registry-v405.js` registra `archive.source` e mantiene alias V401/V402/V403/V404.
- `assets/app.js` espone `ZonaOrientaleSectionRefactorV405` con smoke test runtime.
- Footer/cache-buster aggiornati a V405.
- Nessuna modifica a Firebase, snapshot, admin, comunicati, listone, rose, fantamercato, calciomercato o competizioni.

## Stato tecnico V404

- `index.html` carica registry V404, modulo Regolamento V402, modulo Confronta V403, modulo Statistiche V404 e `app.js?v=404`.
- `assets/js/sections/stats-section-v404.js` monta il template della sezione `stats` mantenendo gli ID runtime storici.
- `assets/js/core/section-registry-v404.js` registra `stats.source` e mantiene alias V401/V402/V403.
- `assets/styles.css` aggiunge colori ruolo tenui per righe giocatore.
- `assets/app.js` aggiunge helper non distruttivi per applicare le classi `player-role-*` alle righe tabellari.
- Footer/cache-buster aggiornati a V404.

## Stato tecnico V403

Aggiunti/aggiornati:

```text
static/zonaorientale/assets/js/core/section-registry-v403.js
static/zonaorientale/assets/js/sections/compare-section-v403.js
static/zonaorientale/tools/audit-compare-section-v403.mjs
```

Dettagli:

- `index.html` carica registry V403, modulo Regolamento V402, modulo Confronta V403 e `app.js?v=403`;
- il contenuto della sezione Confronta e montato dal modulo dedicato;
- gli ID DOM usati dalla logica esistente restano invariati;
- il registry V403 mantiene alias V401/V402 per compatibilita con app.js;
- footer/cache-buster aggiornati a V403.

## Stato tecnico V402

Nuovi file/asset:

```text
static/zonaorientale/assets/js/core/section-registry-v402.js
static/zonaorientale/assets/js/sections/regolamento-section-v402.js
static/zonaorientale/tools/audit-regolamento-section-v402.mjs
```

Modifiche principali:

- `index.html` carica registry V402, modulo Regolamento V402 e `app.js?v=402`;
- la sezione `data-page="regolamento"` resta in `index.html` come host/placeholder;
- il contenuto del Regolamento e montato dal modulo dedicato;
- il registry V402 mantiene alias V401 per compatibilita con app.js;
- nessuna modifica a dati, Firebase, snapshot o sezioni operative.

## Stato tecnico V401

Nuovo file:

```text
static/zonaorientale/assets/js/core/section-registry-v401.js
```

Modifiche principali:

- `index.html` carica il registry prima di `assets/app.js`.
- `assets/app.js` usa helper V401 per normalizzare pagina/hash.
- `isAdminOnlyPageV386` legge anche il registry.
- `isKnownStaticHashV43` riconosce le pagine registrate.
- Aggiunto smoke object `window.ZonaOrientaleSectionRefactorV401`.

## Stato documentazione

Documenti correnti da aggiornare sempre quando pertinente:

- `00_START_HERE.md`
- `README.md`
- `AI_HANDOFF_ZONAORIENTALE_CURRENT.md`
- `CURRENT_STATE.md`
- `ARCHITETTURA_E_DATI.md`
- `OPERATIVITA_ADMIN_E_RELEASE.md`
- `REGRESSION_TESTS.md`
- `CHANGELOG_CONSOLIDATO.md`
- `DOCUMENTATION_POLICY.md`

`FUNZIONALITA'.md` resta documento speciale: modificarlo solo su richiesta esplicita.

Storici accorpati:

- `STORICO_FUNZIONALITA_VERSIONI.md`
- `STORICO_HANDOFF_RELEASE.md`
- `STORICO_AUDIT_TEST_REFACTOR.md`
- `STORICO_SEZIONI_OPERATIVE.md`
- `STORICO_FIREBASE_RULES.md`
- `STORICO_SOCCER_DATA_MAPPING.md`
- `STORICO_SOCCER_DATA_MAPPING_RAW.zip`

## Rischi principali

- Non rompere funzioni Firebase/Admin e snapshot pubblici.
- Non scollegare Dashboard Presidente/trattative/notifiche.
- Non confondere dati statici pubblici con dati Firebase dinamici.
- Non riattivare Soccer Data senza nuova fonte dati sostenibile.
- Non creare nuovi file docs per ogni versione: aggiornare i consolidati.
- Nei prossimi refactor, non separare tutto in pagine HTML senza prima estrarre moduli e testare una sezione semplice.
````

---

## 4. `ISTRUZIONI_NUOVO_ASSISTENTE_260528.md`

- Percorso originale: `ISTRUZIONI_NUOVO_ASSISTENTE_260528.md`
- Dimensione originale: 9474 byte
- SHA-256: `74f82ba69f3d7ffb151c8021b677a1f1bcf0b1196792607fa1d51e18abe1124a`

````markdown
## Aggiornamento V275 per nuovo assistente

Leggere anche `docs/zonaorientale/FUNZIONALITA'V271-274.md`. Il documento registra lo stato recente del Listone: test reale V273, normalizzazione dei codici squadra V274 e regole da non perdere in eventuali refactor.

## Aggiornamento V273 per nuovo assistente

Prima di modificare ancora il Listone, leggere `docs/zonaorientale/listoni/LISTONE_TEST_REALE_V273.md`. Il test reale ha confermato il supporto Excel Classic e ha introdotto normalizzazione squadre per evitare falsi `TEAM_CHANGED`. Non rimuovere le funzioni V268-V270 senza ripetere il test con Excel reale.

# Aggiornamento V272 - Istruzioni aggiornate

Leggere prima `00_START_HERE_V272.md` e `handoff/HANDOFF_NUOVO_ASSISTENTE_V272.md`. La versione corrente e' `V274 codici squadre listone`; branch `refactor/260528-zonaorientale-next`. Il documento storico sotto resta valido, ma alcune parti possono citare versioni precedenti.

# Istruzioni per nuovo assistente - ZonaOrientale 260528

Documento aggiornato in **V267** per permettere a un nuovo assistente AI di ripartire dal punto esatto raggiunto nello sviluppo del sito del fantacalcio **ZonaOrientale Salerno**.

## 1. Contesto generale

Repo reale:

```text
starter-academic-sb
```

Webapp:

```text
static/zonaorientale/
```

Documentazione:

```text
docs/zonaorientale/
```

Branch corrente della nuova fase:

```text
refactor/260528-zonaorientale-next
```

Versione runtime corrente dopo questo overlay:

```text
V267 audit competizioni
```

## 2. Regole operative obbligatorie

1. Consegnare sempre un solo zip overlay.
2. Lo zip deve contenere le radici:

```text
zonaorientale/
docs/
```

3. Nella repo, copiare:

```text
zonaorientale/ -> static/zonaorientale/
docs/ -> docs/
```

4. Dopo ogni modifica a codice o UI aggiornare sempre:

```text
footer Version negli HTML
cache-buster ?v=...
DEPLOY_EXPECTED_VERSION_V181 in assets/app.js
AI_HANDOFF_ZONAORIENTALE_CURRENT.md
CHANGELOG_CONSOLIDATO.md
README/ROADMAP/OPERATIVITA/REGRESSION_TESTS se necessario
```

5. Il documento principale delle funzionalita e' protetto:

```text
docs/zonaorientale/FUNZIONALITA'.md
```

Va modificato solo se l'utente lo chiede esplicitamente. Per nuove funzioni incrementali, usare documenti separati come:

```text
FUNZIONALITA'V240-255.md
FUNZIONALITA'V256-262.md
```

6. Non eliminare codice legacy senza audit e test. Questo progetto ha molte patch storiche Vxx: una funzione apparentemente vecchia puo essere ancora agganciata a UI o fallback.

## 3. File da passare a un nuovo assistente

Chiedere sempre all'utente gli zip aggiornati:

```text
zonaorientale.zip
docs.zip
```

Se si lavora su Firebase Rules, chiedere anche:

```text
docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules
docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules
```

File da leggere subito:

```text
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md
docs/zonaorientale/PROSSIME_ATTIVITA_260528.md
docs/zonaorientale/REGRESSION_TESTS.md
docs/zonaorientale/FUNZIONALITA'.md
docs/zonaorientale/FUNZIONALITA'V240-255.md
docs/zonaorientale/FUNZIONALITA'V256-262.md
docs/zonaorientale/AUDIT_COMPETIZIONI_V267.md
```

## 4. Comandi locali standard

Dalla repo:

```bash
cd starter-academic-sb
cd static/zonaorientale
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

## 5. Comandi Git branch corrente

```bash
cd starter-academic-sb
git checkout refactor/260528-zonaorientale-next
git pull origin refactor/260528-zonaorientale-next
```

Applicazione overlay:

```bash
mkdir -p /tmp/zo_overlay
unzip ~/Downloads/NOME_OVERLAY.zip -d /tmp/zo_overlay
rsync -av /tmp/zo_overlay/zonaorientale/ static/zonaorientale/
rsync -av /tmp/zo_overlay/docs/ docs/
```

Commit:

```bash
git status
git add <file modificati>
git commit -m "tipo: descrizione"
git push origin refactor/260528-zonaorientale-next
```

Merge futuro su master solo dopo test completi:

```bash
git checkout master
git pull origin master
git merge --no-ff refactor/260528-zonaorientale-next -m "merge: integra aggiornamenti zonaorientale 260528"
git push origin master
```

## 6. Funzioni recenti da non perdere

### Comunicati presidente

Flusso canonico comunicato avvenuto scambio:

```text
Presidente -> Dashboard Presidente -> Comunicato avvenuto scambio
-> teamRequests type TRANSFER_NEWS
-> EmailJS immediata a caparrotti86@yahoo.it
-> Admin approva in Richieste presidenti
-> pubblicazione in News
```

Non deve tornare il vecchio flusso presidente -> scrittura diretta in `news`.

### Svincola Giocatori

Aggiunto in V261 in Dashboard Presidente.

```text
Presidente -> Svincola Giocatori
-> selezione multipla dalla rosa
-> quotazione da listone piu recente disponibile
-> email EmailJS a caparrotti86@yahoo.it
```

Non scrive su Firebase e non crea richiesta Admin.

### Trattative e notifiche

Badge e notifiche derivano da `transferNegotiations`. Da V257, se le Firebase Rules sono pubblicate, la lettura esito e' sincronizzabile tra dispositivi. Fallback: localStorage.

Comandi test console:

```js
ZonaOrientaleTradeSimulatorV255.help()
await ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()
```

### Admin -> Richieste presidenti

Funzioni da preservare:

```text
Aggiorna richieste
Approva
Rifiuta
Elimina da Firebase per comunicati APPROVED/ACCEPTED/REJECTED
```

Il pulsante elimina solo `teamRequests/{id}`, non cancella news gia pubblicate.

### Admin -> Comunicati

Generatore comunicati automatici ripristinato in V250. Deve solo generare/copiare/inserire bozze nel form Comunicati, senza scrivere direttamente su Firebase.

### News / anteprime WhatsApp

Home: meta generici.
News: anteprime specifiche solo tramite:

```text
/zonaorientale/share/news/<id>
```

Il pulsante `Apri preview` e' stato rimosso; resta `Copia link WhatsApp`.

### EmailJS

V266 ha normalizzato oggetti, footer, `from_name` logico e `reply_to`. La deliverability reale dipende da configurazione EmailJS/provider/DNS SPF-DKIM-DMARC.

## 7. Stato audit V267 competizioni

V267 non rimuove nulla. Documenta che:

```text
assets/js/domain/competitions.js
```

sembra un modulo legacy/scollegato, ma non va eliminato senza test di:

```text
Dashboard pubblica
Sezione Competizioni
competition.html
Archivio stagioni
Admin -> Competizioni
Albo/Statistiche collegate
```

Diagnostica:

```js
window.ZonaOrientaleCompetitionsAuditV267
```

## 8. Cose da evitare

Non eliminare senza audit:

```text
assets/js/domain/competitions.js
assets/js/refactor/admin-publication-workflow-v213.js
news.html
comunicati/*.html
vecchi fallback inline di Richieste presidenti
resti legacy V50/V79 dei comunicati scambio
```

Non modificare `FUNZIONALITA'.md` salvo richiesta esplicita dell'utente.

## 9. Quando l'utente segnala un bug

Chiedere sempre:

```text
versione footer visibile
sezione esatta
ruolo: pubblico/presidente/admin
browser/dispositivo
output DevTools console
se Firebase/EmailJS e' coinvolto
```

Poi proporre overlay piccolo, testabile e con comandi Git.


## Aggiornamento V268 per nuovo assistente

Il convertitore listone Excel e' stato esteso. Non rimuovere il supporto al formato storico `Tutti`/`Ceduti`: la V268 aggiunge il formato Classic a foglio singolo senza sostituire il precedente.

File da leggere se si lavora sui listoni:

```text
docs/zonaorientale/LISTONE_CONVERTER_V268.md
static/zonaorientale/assets/js/admin/listone-converter.js
```

Diagnostica runtime:

```js
window.ZonaOrientaleListoneConverterV268
```


## V269 - Storico e confronto listoni

- Aggiunto confronto automatico tra listone selezionato e listone precedente della stessa stagione.
- Il convertitore listone arricchisce il JSON generato con campi `previous`, `diff`, `previousQuotationCurrent`, `quotationDiffFromPrevious`, `statusChange` e riepilogo `history`.
- La sezione pubblica `Listone` mostra un pannello `Storico listoni` con nuovi, usciti, variazioni quotazione e ricerca negli altri listoni.
- Il campo ricerca puo' trovare giocatori presenti in listoni passati anche quando non sono nel listone selezionato.
- Diagnostica: `window.ZonaOrientaleListoneHistoryV269`.
- Non sono state rimosse funzionalita' esistenti; il formato storico Tutti/Ceduti e il formato Classic a foglio singolo restano supportati.

## Aggiornamento V271

Leggere anche:

- `docs/zonaorientale/FUNZIONALITA'V263-270.md`

Questo documento traccia le funzionalita' aggiunte o consolidate da V263 a V270, in particolare il lavoro sul listone: formato Classic, storico, ricerca globale e colonna `Modifica`.


## V274 - Codici squadra canonici nel Listone

Il convertitore listone accetta sia sigle sia nomi estesi per la squadra reale, ma salva/visualizza la sigla canonica a 3 lettere. Questo evita falsi cambi squadra nei confronti storici e rende stabile la colonna `Modifica`.

## Aggiornamento V276-V277 per nuovo assistente

Leggere anche:

- `docs/zonaorientale/admin/DIAGNOSTICA_DATI_V276.md`
- `docs/zonaorientale/listoni/LISTONE_FILTRO_MODIFICHE_V277.md`

Queste modifiche non rimuovono funzioni: aggiungono diagnostica Admin e un filtro Listone.

## V278 - Export modifiche listone

Aggiunto export CSV non distruttivo delle modifiche del Listone. Il pulsante `Esporta modifiche CSV` rispetta il filtro `Modifiche` e include nuove righe, usciti storici, variazioni quotazione/stato/squadra/ruolo. Documento tecnico: `docs/zonaorientale/listoni/LISTONE_EXPORT_MODIFICHE_V278.md`.
````

---

## 5. `README.md`

- Percorso originale: `README.md`
- Dimensione originale: 5764 byte
- SHA-256: `0e85fd71e0435c2f0dcbce2259408a4065a1d2d715062a3af75fcca715294b92`

````markdown
# Documentazione ZonaOrientale

Stato corrente consolidato: **V405r2 runtime / colori ruolo ripristinati**.  
Data aggiornamento: 2026-06-07.  
Branch di lavoro: `refactor/260607-clean-from-master`.  
Branch produzione Netlify: `master`.

## Obiettivo dei docs accorpati

Ridurre al minimo i file documentali senza perdere memoria storica utile per l'assistente AI.

La riduzione e stata fatta per **accorpamento**:

- i file `FUNZIONALITAVxxx.md` sono confluiti in `STORICO_FUNZIONALITA_VERSIONI.md`;
- handoff/release/planning sono confluiti in `STORICO_HANDOFF_RELEASE.md`;
- audit/test/refactor sono confluiti in `STORICO_AUDIT_TEST_REFACTOR.md`;
- documenti di sezioni operative sono confluiti in `STORICO_SEZIONI_OPERATIVE.md`;
- Firebase rules storiche sono confluite in `STORICO_FIREBASE_RULES.md`;
- mapping raw Soccer Data e stato impacchettato in `STORICO_SOCCER_DATA_MAPPING_RAW.zip` e indicizzato in `STORICO_SOCCER_DATA_MAPPING.md`.


## Stato V405r2

V405r2 ripristina la colorazione tenue delle righe giocatore per ruolo partendo dal comportamento V404/V405 originale:

- portieri: arancione;
- difensori: verde;
- centrocampisti: blu/azzurro;
- attaccanti: rosso;
- caricamento esplicito tramite `assets/role-backgrounds-v405r2.css` e `assets/role-backgrounds-v405r2.js`;
- `index.html` usa cache-buster `?v=405r2` sui due nuovi file;
- nessuna modifica a Firebase, auth, dati, admin, navigazione mobile o pagine standalone.

## Stato V405

V405 prosegue il refactor modulare senza cambiare esperienza utente:

- il template della sezione Archivio stagioni viene spostato in `assets/js/sections/archive-section-v405.js`;
- il registry V405 indica `archive.source = assets/js/sections/archive-section-v405.js`;
- `index.html` resta shell principale e mantiene solo il placeholder `data-section-template="archive-v405"`;
- restano invariati gli ID runtime `seasonArchiveControlsV196`, `seasonArchiveContentV196` e `archiveTitle`;
- nessun flusso dati/Firebase/Admin viene modificato;
- Soccer Data resta rimossa come da V398.

## Stato V404

V404 prosegue il refactor modulare senza cambiare esperienza utente:

- il template della sezione Statistiche storiche viene spostato in `assets/js/sections/stats-section-v404.js`;
- il registry V404 indica `stats.source = assets/js/sections/stats-section-v404.js`;
- `index.html` resta shell principale e mantiene solo il placeholder `data-section-template="stats-v404"`;
- le righe delle tabelle giocatori ricevono colori tenui in base al ruolo tramite helper non distruttivi in `assets/app.js` e CSS dedicato in `assets/styles.css`;
- nessun flusso dati/Firebase/Admin viene modificato.

## Stato V403

V403 prosegue il refactor modulare senza cambiare esperienza utente:

- la sezione Confronta resta raggiungibile da `#compare`;
- il template Confronta vive in `assets/js/sections/compare-section-v403.js`;
- `index.html` mantiene solo l'host della pagina Confronta;
- il registry V403 indica `compare.source = assets/js/sections/compare-section-v403.js`;
- gli ID `teamCompareControlsV195` e `teamCompareContentV195` restano invariati per non scollegare la logica in `assets/app.js`;
- nessun flusso dati/Firebase/Admin e stato modificato.

## Stato V402

V402 prosegue il refactor modulare senza cambiare esperienza utente:

- la sezione Regolamento resta raggiungibile da `#regolamento`;
- il template del Regolamento vive in `assets/js/sections/regolamento-section-v402.js`;
- `index.html` mantiene solo l'host della pagina Regolamento;
- il registry V402 indica `regolamento.source = assets/js/sections/regolamento-section-v402.js`;
- nessun flusso dati/Firebase/Admin e stato modificato.

## Stato V401

V401 avvia il refactor modulare senza cambiare esperienza utente:

- nuovo file runtime `assets/js/core/section-registry-v401.js`;
- registry centrale delle sezioni, incluso stato `adminOnly` e pagine rimosse;
- `assets/app.js` usa il registry per normalizzare pagine/hash e riconoscere pagine admin-only;
- nessuna sezione attiva viene spostata o cancellata;
- Soccer Data resta rimossa come da V398.

## Documenti canonici da leggere per primi

1. `00_START_HERE.md`  
   Punto di ingresso per assistenti AI.

2. `AI_HANDOFF_ZONAORIENTALE_CURRENT.md`  
   Handoff corrente e vincoli operativi.

3. `CURRENT_STATE.md`  
   Fotografia breve dello stato attuale del sito.

4. `ARCHITETTURA_E_DATI.md`  
   Struttura tecnica, dati, Firebase, Netlify, snapshot e registry sezioni.

5. `OPERATIVITA_ADMIN_E_RELEASE.md`  
   Flussi admin, zip, Git, deploy e snapshot.

6. `REGRESSION_TESTS.md`  
   Checklist minima test/regressioni.

7. `CHANGELOG_CONSOLIDATO.md`  
   Cronologia sintetica consolidata.

8. `DOCUMENTATION_POLICY.md`  
   Regole future per mantenere docs minimi.

9. `FUNZIONALITA'.md`  
   Registro funzionale principale. **Non modificarlo salvo richiesta esplicita dell'utente.**

## Regola per i prossimi aggiornamenti docs

Per ogni modifica futura aggiornare i canonici interessati. Da V405, per ogni estrazione di sezione aggiornare anche `ARCHITETTURA_E_DATI.md`, `REGRESSION_TESTS.md`, `CHANGELOG_CONSOLIDATO.md` e lo storico refactor. Evitare nuovi file `Vxxx` salvo richiesta esplicita: usare il changelog consolidato e, se serve, aggiornare uno storico accorpato.

## Stato Soccer Data

La sezione Soccer Data e stata rimossa in V398 perche il flusso dati FBref/API-Football non e sostenibile al momento con i limiti disponibili. Eventuali riferimenti storici restano negli storici accorpati, non nel runtime attivo.

## Regola per gli zip futuri

Quando viene consegnata una modifica al progetto, lo zip deve contenere entrambe le cartelle:

```text
zonaorientale/
docs/
```

Nelle istruzioni di applicazione mostrare solo i due comandi `cp -R` richiesti dall'utente.
````

---

## 6. `RESOCONTO_SITO_V313.md`

- Percorso originale: `RESOCONTO_SITO_V313.md`
- Dimensione originale: 3681 byte
- SHA-256: `c27ff14cee67d2061fed7e9bfac52d31adca2f29fc8d352412bc4950664c98cb`

````markdown
# Resoconto sito ZonaOrientale - V313

## Stato generale

ZonaOrientale Salerno e' una webapp statica HTML/CSS/JS puro sotto `static/zonaorientale/`, con documentazione in `docs/zonaorientale/` e Netlify Functions in `netlify/functions/`.

La sorgente pubblica prioritaria e' costituita da JSON statici e snapshot. Firebase resta usato per Auth, Admin, richieste, news live, trattative e dati modificabili. Netlify gestisce funzioni server-side come anteprime news e feed Calciomercato.

## Regola principale

Ogni modifica deve preservare le funzionalita esistenti. Prima di refactor o pulizie bisogna dichiarare:

- funzionalita a rischio;
- come vengono preservate;
- test da eseguire.

## Aree pubbliche

- Dashboard stagione corrente.
- News e comunicati con link diretto/hash.
- Anteprime WhatsApp news tramite Netlify Function `news-share`.
- Rose e schede squadra.
- Fantamercato interno della lega.
- Calciomercato notizie RSS automatico.
- Listone con filtri, colonna `Modifica`, usciti storici, ricerca, export solo Admin.
- Competizioni, calendari, risultati e classifiche.
- Albo d'Oro, palmares, FIFA Ranking.
- Statistiche storiche.
- Archivio stagioni.
- Confronta squadre.
- Regolamento.
- Navigazione mobile con bottom nav, menu Altro e pulsante Su.

## Presidente

- Login Firebase email/password e Google.
- Dashboard Presidente.
- Pulsante account personalizzato `Pres. Cognome`.
- Trattative inviate/ricevute con badge notifiche.
- Comunicati squadra.
- Comunicati avvenuto scambio via `teamRequests` + EmailJS + approvazione Admin.
- Svincola Giocatori via EmailJS, senza scrittura Firebase.
- Fantamercato presidente.

## Admin

- Modalita Admin leggero e caricamento completo con `Carica dati amministrazione`.
- Titolo Admin sempre in cima e sezioni ridotte da V313.
- Accetta utenti.
- Richieste presidenti.
- News/comunicati.
- Generatore comunicati automatici.
- Gestione stagioni, presidenti, squadre, squadre stagionali e stadi.
- Rose e movimenti FM.
- Listone Excel: formati storico e Classic.
- Competizioni, calendari, risultati, import statico.
- FIFA Ranking, albo e snapshot honor.
- Snapshot pubblici.
- Backup Firebase.
- Diagnostica dati.
- Stato Firebase/JSON e procedura guidata pubblicazione.

## Calciomercato

- Sezione pubblica `Calciomercato`.
- Fonti configurabili in `assets/calciomercato/links.json`.
- Recupero automatico server-side via `netlify/functions/calciomercato-feed.js`.
- Supporto feed singolo o multiplo per fonte.
- Fallback statico manuale.
- Card orizzontali con immagine, fonte, data/ora Europe/Rome, squadre, topic, stato, giocatori interessati e link articolo.

## Tema e UI

- Tema Light sospeso temporaneamente.
- Dark mode unico attivo.
- Toggle tema nascosto.
- CSS refactor stabile sotto `assets/css/refactor/`.
- Mobile/rose/tabelle isolati nei CSS refactor.

## Rischi principali da monitorare

- `assets/app.js` e' ancora un file storico molto grande con override Vxxx.
- Le funzioni legacy possono essere fallback ancora utili.
- Non eliminare moduli o CSS senza audit e test.
- Calciomercato automatico richiede Netlify Function: in locale con `python3 -m http.server` resta fallback statico.
- I dati pubblici devono essere rigenerati come JSON statici dopo modifiche Admin.

## Test minimi prima di push o merge

```bash
static/zonaorientale/tools/check-zonaorientale.sh
node --check netlify/functions/calciomercato-feed.js
```

Test browser:

- Home.
- News e link WhatsApp.
- Calciomercato.
- Listone pubblico/Admin.
- Rose e pagina squadra.
- Dashboard Presidente.
- Admin leggero e Admin completo.
- Richieste presidenti.
- Diagnostica dati.
- Competizioni.
- Mobile nav/menu Altro/pulsante Su.
````

---

## Aggiornamento V407 - Home comunicati e Calciomercato mobile

- Baseline runtime progressiva: V407.
- Home dashboard: il pannello “Ultime news e comunicati” mostra ora le ultime 4 comunicazioni della stagione invece delle ultime 3.
- Calciomercato mobile: le anteprime immagini delle card articolo sono nascoste solo sotto i 720px per ridurre spazio occupato e migliorare scorrimento/leggibilita. Desktop invariato.
- Nessuna modifica a routing, Firebase, auth, admin, dati o pagine standalone.


---

## Aggiornamento V408 - Rosa espansa con stile Listone (07/06/2026)

- Baseline runtime progressiva: V408.
- La tabella giocatori mostrata quando si espande la Rosa di una squadra mantiene le colonne esistenti, ma usa lo stesso ritmo visivo del Listone: font, densita celle, sticky header e scorrimento orizzontale controllato.
- Nessuna modifica a routing, pagine standalone, Firebase, auth, admin o dati.
- Documentazione consolidata per categoria mantenuta come fonte canonica.

## Aggiornamento V419 - Archivio stagioni mobile

- Runtime aggiornato a V419 con footer e cache-buster coerenti.
- La sezione Archivio Stagioni mantiene la struttura esistente, ma ottimizza la resa mobile della card stagione e delle card squadre.
- La card Albo della stagione non viene piu renderizzata come card separata: le informazioni equivalenti restano nella card Competizioni.
- La timeline dati include tutti i comunicati collegati alla stagione e li ordina per data decrescente.

## Aggiornamento V425 - Consolidamento scala mobile globale (08/06/2026)

- Runtime avanzato a V425 con footer e cache-buster coerenti.
- La scala mobile scelta dall'utente viene trattata come standard canonico globale per card, sottocard, contenuti e tabelle dense.
- Nessuna modifica a routing, Firebase, auth, admin, dati o pagine standalone.

## Aggiornamento V430 - Admin mobile pulsante sopra

La baseline corrente passa a V430. La modifica risolve la compressione dei titoli nelle sotto-sezioni Admin mobile spostando il pulsante Apri/Riduci in alto a sinistra, sopra il titolo, lasciando ai titoli tutta la larghezza disponibile.

## V441 - Filtri ruoli Mantra

Stato corrente aggiornato a V441: aggiunti filtri ruolo Mantra per Listone, Rose pubbliche e Area Squadra presidenti. La modifica e solo UI/runtime, non cambia Firebase, snapshot, Bilanci V440 o badge dispositivo V434. Ordine Mantra: Por, Dc, Dd, Ds, B, E, M, C, W, T, A, Pc.

## V442 - Titoli sopra filtri e controlli

Stato corrente aggiornato a V442: i pannelli/card che contengono filtri o controlli laterali impilano il titolo e la descrizione sopra i filtri, evitando la compressione del blocco titolo come visto nel Listone. Intervento solo CSS/layout: non cambia dati, Firebase, snapshot, Bilanci, Listone, Rose, Area Squadra, Admin o badge dispositivo V434.


## Aggiornamento V446 - Percorsi dati statici da configurazione

La preparazione multi-lega ora include `dataPaths` in `static/zonaorientale/assets/league-config.json`. I reader pubblici possono risolvere da configurazione i percorsi di config pubblica, snapshot stagioni, honor snapshot, listoni, rose, competizioni, loghi e calciomercato, mantenendo i path ZonaOrientale come fallback. Non sono stati modificati Firebase, Admin, generator snapshot, Area Squadra presidenti, Bilanci mobile V438 o badge dispositivo V434.
