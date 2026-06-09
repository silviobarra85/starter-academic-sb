## Changelog V434 - Badge dispositivo

- Aggiunto badge diagnostico in alto a destra con modello/famiglia del dispositivo rilevato localmente.
- Il badge usa User-Agent Client Hints quando disponibili e fallback su user-agent/viewport quando il modello esatto non e' esposto dal browser.
- Il badge non intercetta tap/click e non invia dati a servizi esterni.
- Nessuna funzionalita esistente viene modificata o staccata.

## Changelog V433 - Area Squadra mobile piu lineare

- Rimossa dalla vista mobile la card separata Notifiche presidente, ritenuta non necessaria nella UI compatta.
- Mantenuta Dashboard Presidente in alto, con metriche e azioni compatte.
- Spostati in fondo i pannelli `Comunicato avvenuto scambio` e `Svincola Giocatori`, entrambi richiudibili.
- Nessuna funzionalita staccata: form, pulsanti, handler e permessi restano invariati.

## Changelog V432 - Riordino Area Squadra mobile

- Dashboard Presidente effettivamente prima card della sezione Area Squadra mobile.
- Metriche `Saldo FM`, `Giocatori`, `Valore rosa`, trattative/richieste/mercato organizzate in righe da 2 elementi.
- Pulsanti `Vai alle trattative`, `Nuova proposta`, `Comunicato`, `Apri pagina squadra` organizzati in griglia 2x2.
- Pannelli `Comunicato avvenuto scambio` e `Svincola Giocatori` chiusi di default con toggle Apri/Riduci, senza rimuovere funzionalita.

## Changelog V431 - Compattazione Area Squadra mobile

- Area Squadra mobile resa piu ordinata e compatta.
- Dashboard Presidente V369 viene mantenuta sopra a tutto.
- Centro notifiche presidente V370 e scheda con nome squadra sono compattati: metriche, badge e azioni usano griglie piu dense.
- I form di trattative e comunicati restano agganciati agli stessi id e handler, senza perdita funzionale.

## Changelog V429 - Titoli Admin mobile leggibili

- Sistemata la disposizione mobile degli header nei pannelli Admin e nelle sotto-sezioni con pulsante Apri/Riduci.
- Su mobile i titoli non vengono piu' compressi in colonne troppo strette; sotto i 420px il bottone passa sotto il titolo.
- Le etichette dei pannelli Admin collassati usano `Apri/Riduci`, piu' compatte rispetto a `Ingrandisci/Riduci`.
- Nessuna variazione a funzionalita, dati, permessi, Firebase, admin workflow, routing o Netlify.

## Changelog V428 - Pre-merge cleanup finale

- Aggiornata versione a V428 senza introdurre nuove feature.
- Consolidati i guardrail V407-V427: home con 4 comunicati, Calciomercato mobile compatto, tabelle dense, Archivio mobile, scala tipografica e warning legacy riclassificati.
- Aggiunto audit finale pre-merge per verificare runtime, cache-buster, footer, docs consolidati, assenza pagine standalone e assenza asset sperimentali.
- Nessuna modifica a dati, ordinamenti, filtri, Firebase, auth, admin, routing o Netlify.

## Changelog V427 - Warning legacy riclassificati

- Riclassificati come advisory alcuni residui storici gia' noti: CSS mobile hotfix V166/V167 non collegati, helper V294 non importato, duplicati storici del simulatore trade e audit Soccer Data V371-V382 non piu' nel gate runtime.
- Nessuna modifica a funzionalita utente, mobile navigation, dati, filtri, admin, auth o Firebase.
- V427 prepara il pre-merge riducendo i falsi allarmi nei controlli automatici.

## Changelog V426 - Checklist mobile finale

- Consolidata la fase mobile V407-V425 senza introdurre nuove feature.
- Preservate home con 4 comunicati, Calciomercato mobile compatto, tabelle giocatori compatte, Archivio mobile, Area Squadra/Admin mobile e scala tipografica globale.
- Aggiunto un audit finale che controlla le dipendenze principali e blocca il ritorno del refactor pagine standalone.
- Nessuna modifica a dati, ordinamenti, filtri, Firebase, auth, admin, routing o Netlify.

---

# Funzionalita e changelog

## Changelog V424 - Scala mobile uniforme sezioni residue

- Uniformata la tipografia mobile anche in News/Comunicati, Competizioni, Albo d'Oro, Rose/Club e Fantamercato.
- Le card residue sono piu' compatte e coerenti con Archivio, Listone, Confronta e Statistiche.
- Le tabelle residue usano celle piu' dense, label piu' piccole e contenuti allineati alla scala scelta.
- Nessuna modifica a dati, ordinamenti, filtri, Firebase, auth, admin, routing o Netlify.
- Preservate V407-V423.

---


## Changelog V423 - Scala mobile estesa al sito

- Estesa la scala mobile compatta anche a Confronta Squadre e Statistiche storiche, che avevano titoli, metriche e sotto-card ancora troppo grandi.
- Le informazioni affiancabili in Confronta/Statistiche vengono compattate in griglia da mobile quando possibile.
- Le tabelle Rosa e Listone usano la stessa dimensione per il nome giocatore; la prima colonna resta sticky e colorata per ruolo.
- Nessuna modifica a dati, ordinamenti, filtri, Firebase, auth, admin, routing o Netlify.
- Preservate V407-V422.

---


## Changelog V422 - Scala mobile completa e Archivio Stagioni

- Applicata in modo piu' esteso la scala mobile scelta: titolo/nome `0.78rem`, sottotesto `0.66rem`, label `0.62rem`, valore/contenuto `0.73rem`.
- I contenuti delle card e delle sotto-card mobile vengono ridotti in modo coerente, inclusi Archivio, Timeline, Competizioni, comunicati, card compatte e pannelli principali.
- In Archivio Stagioni, le schede delle squadre restano in griglia a 2 colonne anche da mobile, con padding e loghi piu' compatti.
- La Timeline dati dell'Archivio ora prende come riferimento gli stessi 4 comunicati visibili in dashboard (`getVisibleNewsForSeasonV79(4)`) e li unisce con i comunicati archivio senza duplicati.
- Corretto il renderer live V209 che poteva lasciare l'Archivio fermo ai 3 comunicati dello snapshot anche dopo il refresh live.
- Preservate V407-V421.

---


## Changelog V421 - Archivio mobile e Timeline comunicati

- Ridotti da mobile anche i contenuti interni delle sotto-card di Archivio Stagioni, usando la scala V420 scelta dall'utente.
- Uniformati testi di Albo, Competizioni, Partite recenti e Timeline dati: label `0.62rem`, valori `0.73rem`, nomi/titoli `0.78rem`, meta `0.66rem`.
- La Timeline dati dell'Archivio non dipende piu' solo dalle news nello snapshot: unisce snapshot e comunicati runtime, elimina duplicati e ordina temporalmente.
- Preservate V407-V420.

---

## Changelog V420 - Tipografia mobile coerente

- Applicata al sito mobile la scala scelta dall'utente: `0.78rem` per nomi/titoli card, `0.66rem` per sottotesti, `0.62rem` per label e `0.73rem` per valori/contenuti.
- Uniformata la resa mobile di Archivio, dashboard, Calciomercato, Listone, La mia squadra, Area Squadra e Admin senza cambiare dati o flussi.
- Le tabelle dense mantengono sticky column/header e compattezza, ma usano la stessa scala per header/celle/link giocatore.
- I titoli principali di pagina restano piu' evidenti per gerarchia visiva e accessibilita.
- Preservate V407-V419.

---


## Changelog V418 - Accessibilita mobile e focus

- Migliorati focus visibili e feedback touch da mobile su link, bottoni, campi, bottom navigation e sheet Altro.
- Aggiunti guardrail CSS per ridurre overflow orizzontali imprevisti su pannelli, card e wrapper scrollabili.
- Rispettata la preferenza utente `prefers-reduced-motion: reduce` riducendo animazioni/transizioni da mobile.
- Le tabelle dense giocatori restano compatte: non viene reintrodotto il tap target globale da 44px dentro Listone/Rose.
- Nessuna modifica a dati, routing, Firebase, auth, admin o funzioni operative.

---

## Changelog V417 - Pulizia CSS legacy sicura

- Rimossi dal pacchetto i file CSS refactor obsoleti V291/V292 non collegati agli HTML attivi.
- Preservate tutte le funzionalita V407-V416: 4 comunicati, Calciomercato mobile, tabelle Listone/Rose, Area Squadra e Admin mobile.
- Nessun cambiamento visibile previsto: la patch riduce rumore e rischio di confusione futura sugli asset CSS.
- Aggiunto guardrail per verificare che i riferimenti locali CSS/JS caricati da HTML e `assets/app.js` esistano davvero.

---


## Changelog V416 - Admin mobile compatto

- L'area Admin su mobile ha pannelli, intestazioni, form, liste e tabelle piu compatti.
- I form admin mantengono gli stessi campi e submit, con layout mobile a una colonna e due colonne solo su viewport intermedi.
- Liste e tabelle amministrative hanno scroll controllato per ridurre overflow e rendere piu stabile la consultazione da smartphone.
- Nessuna modifica a permessi, import, pubblicazioni, Firebase, EmailJS, auth, routing o dati.
- Preservate le funzionalita V407-V415.

---

## Changelog V415 - Home mobile e tabella La mia squadra

- La card Comunicati della home mobile viene riordinata come prima card del blocco mobile, subito dopo il titolo Home mobile.
- La pagina La mia squadra applica alla tabella Rosa la skin Listone: stesso font compatto, stesso ritmo delle celle e colonne piu leggibili da mobile.
- La prima colonna resta sticky su Listone, Svincolati e La mia squadra e ora mantiene il colore ruolo anche sulla cella sticky.
- Nessuna modifica a dati, colonne, ordinamenti, Firebase, auth, admin o routing.
- Preservate le funzionalita V407-V414.

---

---

## Changelog V414 - Area Squadra mobile compatta

- Ottimizzata da mobile l'Area Squadra: pannelli, metriche, form richiesta FM, richiesta acquisto/svincolo e comunicato squadra sono piu compatti.
- Incluso lo scope della dashboard presidente V369: metriche, azioni, box e tabella movimenti hanno ingombro mobile piu controllato.
- Nessuna modifica a campi, validazioni, submit, permessi, Firebase, admin o navigazione.
- Preservate le funzionalita V407-V413.

---

## Changelog V413 - filtri mobile Listone/Calciomercato

- Ottimizzati da mobile i filtri del Listone: controlli piu compatti, stato e ruolo disposti a griglia, tap target ancora leggibili.
- Ottimizzati da mobile i filtri del Calciomercato: gruppi squadra/topic/fonte, ricerca, date e azioni piu ordinati e con layout adattivo.
- Nessuna modifica a dati, funzioni di filtro, ordinamenti, feed Calciomercato, admin, Firebase o navigazione.
- Preservate le funzionalita V407-V412.

---

## Changelog V412 - menu mobile Altro compatto

- Ottimizzato il foglio mobile Altro: altezza massima controllata, scroll interno, layout a due colonne dove lo schermo lo consente e fallback a una colonna su telefoni molto stretti.
- I link del menu Altro restano gli stessi e continuano a usare la navigazione hash esistente.
- Migliorata la densita dei link senza ridurre i tap target principali della bottom navigation.
- Nessuna modifica a dati, routing, admin, auth, Firebase o logiche applicative.
- Preservate le funzionalita V407-V411.



## Changelog V411 - dashboard mobile compatta

- Ottimizzata la dashboard da mobile con pannelli, metriche e comunicati piu compatti e leggibili.
- I titoli e le anteprime dei comunicati in dashboard vengono limitati a due righe per ridurre scroll verticale.
- I pulsanti dei comunicati in dashboard restano usabili ma leggermente piu compatti.
- Nessuna modifica a dati, ordine comunicati, navigazione, admin, auth, Firebase o Calciomercato desktop.
- Preservate le funzionalita V407-V410.


## Changelog V410 - Calciomercato mobile compatto

- Ottimizzate da mobile le card Calciomercato senza modificare fonti, feed, archivio, matching giocatori o desktop.
- Titoli e descrizioni vengono contenuti con clamp mobile per ridurre scroll verticale e migliorare la scansione delle notizie.
- Meta, chip squadre/giocatori e pulsanti articolo sono piu compatti solo su viewport piccoli.
- Preservate le funzionalita V407, V408 e V409.


---

## Changelog V409 - tabelle giocatori mobile compatte

- Ottimizzata da mobile la densita delle tabelle giocatori Listone/Rose.
- I link dei calciatori dentro le tabelle dense non ereditano piu il tap-target globale da 44px, evitando righe troppo alte.
- Preservate le funzionalita V407 e V408: 4 comunicati in home, immagini Calciomercato nascoste solo mobile, tabella Rosa con stile Listone.
- Nessuna modifica a dati, filtri, ordinamenti, ruoli, colori ruolo, admin o navigazione.


---

## Changelog V406 - baseline mobile pulita

- Allineati cache-buster e footer a V406.
- Rimossi dal runtime i riferimenti agli asset sperimentali `role-backgrounds-v405r2.css/js`.
- Consolidata la colorazione ruolo giocatore dentro `assets/app.js` e `assets/styles.css`, mantenendo compatibilita con le classi `player-role-*` e `zo-role-bg-v405-*`.
- Nessuna funzionalita rimossa: listone, rose, fantamercato, calciomercato, admin, area squadra e navigazione restano sulla struttura esistente.


Contiene lo storico delle funzionalita, file FUNZIONALITA per versione e changelog consolidati.

> Documento generato da accorpamento per categoria. I contenuti originali sono riportati integralmente sotto il rispettivo percorso originale.

File originali accorpati: **66**.

## Indice dei file originali in questa categoria

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

---

## 1. `CHANGELOG_CONSOLIDATO.md`

- Percorso originale: `CHANGELOG_CONSOLIDATO.md`
- Dimensione originale: 8003 byte
- SHA-256: `1a4d56698b5f5b1476c73a68ba7b6ba81d76ddc32ed6f5c56dbf46630c055835`

```markdown
# Changelog consolidato - ZonaOrientale

Questo file contiene la cronologia sintetica corrente. Da V400 i dettagli storici sono accorpati nei file `STORICO_*.md`.

## Stato corrente

- Runtime corrente: **V405r2**, con base V405 preservata.
- Docs correnti: **V405r2 documentazione accorpata aggiornata**.
- Base runtime precedente preservata: **V398 - Soccer Data rimossa**.
- Data aggiornamento: 2026-06-07.


## V405r2 - Ripristino colori ruolo giocatore

- Ripristinata la colorazione tenue delle righe giocatore dalle regole V404/V405 originali.
- Portieri arancione, difensori verde, centrocampisti blu/azzurro, attaccanti rosso.
- Aggiunti `assets/role-backgrounds-v405r2.css` e `assets/role-backgrounds-v405r2.js`.
- `index.html` carica i due nuovi asset con cache-buster `?v=405r2` e aggiorna il footer visibile.
- Aggiunto audit `tools/audit-role-backgrounds-v405r2.mjs`.
- Nessuna modifica a Firebase, auth, admin, dati, snapshot, navigazione mobile o refactor pagine standalone.
- `FUNZIONALITA'.md` non modificato.

## V405 - Archivio stagioni modulare

- Estratto il template della sezione Archivio stagioni in `assets/js/sections/archive-section-v405.js`.
- Aggiunto `assets/js/core/section-registry-v405.js`, con alias V401/V402/V403/V404 per compatibilita con `assets/app.js`.
- `index.html` mantiene solo il placeholder `data-section-template="archive-v405"`.
- Conservati gli ID runtime `archiveTitle`, `seasonArchiveControlsV196` e `seasonArchiveContentV196`.
- Aggiornato `assets/app.js` con marker/smoke test `ZonaOrientaleSectionRefactorV405`.
- Nessuna modifica a Firebase, dati, snapshot, comunicati, listone, rose, fantamercato, calciomercato, competizioni o admin.
- Soccer Data resta rimossa/inattiva come in V398.

## V404 - Statistiche modulari e colori ruolo giocatore

- Estratto il template della sezione Statistiche storiche in `assets/js/sections/stats-section-v404.js`.
- Aggiunto `assets/js/core/section-registry-v404.js`, con alias V401/V402/V403 per compatibilita con `assets/app.js`.
- `index.html` mantiene solo placeholder `data-section-template="stats-v404"` per `#stats`.
- Conservati gli ID `historicalStatsSummaryV193` e `historicalStatsContentV193` per non staccare la logica esistente.
- Aggiunta colorazione tenue per righe giocatore in tabelle Listone/Rose/Area squadra/schede: portieri arancione, difensori verde chiaro, centrocampisti azzurro/blu, attaccanti rosso.
- Nessuna modifica a Firebase, snapshot, comunicati, listone dati, rose dati, fantamercato, calciomercato, competizioni o admin.
- `FUNZIONALITA'.md` non modificato.

## V403 - Confronta estratto in modulo dedicato

- Secondo refactor di sezione dopo Regolamento.
- Spostato il template della sezione Confronta da `index.html` a `assets/js/sections/compare-section-v403.js`.
- `index.html` mantiene solo l'host `data-section-template="compare-v403"`.
- Aggiunto `assets/js/core/section-registry-v403.js`, con alias V401/V402 per compatibilita con `assets/app.js`.
- Aggiunto audit `tools/audit-compare-section-v403.mjs`.
- Conservati gli ID runtime `teamCompareControlsV195` e `teamCompareContentV195`.
- Nessuna modifica a Firebase, snapshot, comunicati, rose, listone, fantamercato, calciomercato, competizioni o admin.

## V402 - Regolamento estratto in modulo dedicato

- Primo refactor di sezione effettivo dopo il registry V401.
- Spostato il template della sezione Regolamento da `index.html` a `assets/js/sections/regolamento-section-v402.js`.
- `index.html` conserva solo host/placeholder `data-page="regolamento"` con `data-section-template="regolamento-v402"`.
- Aggiunto `assets/js/core/section-registry-v402.js`, con alias V401 per compatibilita con `assets/app.js`.
- Aggiunto audit `tools/audit-regolamento-section-v402.mjs`.
- Nessuna modifica a Firebase, snapshot, comunicati, rose, listone, fantamercato, calciomercato, competizioni o Admin.
- Soccer Data resta rimossa/inattiva.
- `FUNZIONALITA'.md` non modificato.

## V401 - Section registry e avvio refactor modulare

- Aggiunto `assets/js/core/section-registry-v401.js`.
- Aggiunto `window.ZonaOrientaleSectionRegistryV401` con pagine attive, metadati e fallback per pagine rimosse.
- Aggiornato `index.html` per caricare il registry prima di `assets/app.js`.
- Aggiornato `assets/app.js` per usare il registry in normalizzazione pagina/hash e controllo admin-only.
- Aggiunto smoke object `window.ZonaOrientaleSectionRefactorV401`.
- Aggiunto audit `tools/audit-section-registry-v401.mjs`.
- Nessuna sezione attiva spostata o rimossa.
- Nessuna modifica a Firebase, snapshot, comunicati, listone, rose, fantamercato, calciomercato o competizioni.
- Soccer Data resta rimossa/inattiva come in V398.
- `FUNZIONALITA'.md` non modificato.

## V400 - Riduzione docs tramite accorpamento

- Accorpati i file `FUNZIONALITAVxxx.md` in `STORICO_FUNZIONALITA_VERSIONI.md`.
- Accorpati handoff, release e pianificazione in `STORICO_HANDOFF_RELEASE.md`.
- Accorpati audit, test e refactor in `STORICO_AUDIT_TEST_REFACTOR.md`.
- Accorpati documenti sezionali/operativi in `STORICO_SEZIONI_OPERATIVE.md`.
- Accorpate Firebase rules storiche in `STORICO_FIREBASE_RULES.md`.
- Accorpati/indicizzati i mapping raw Soccer Data in `STORICO_SOCCER_DATA_MAPPING.md` e `STORICO_SOCCER_DATA_MAPPING_RAW.zip`.
- Aggiornati i documenti canonici allo stato attuale: runtime V398, Soccer Data rimossa.
- Nessuna modifica runtime intenzionale.
- `FUNZIONALITA'.md` copiato invariato.

## V399 - Consolidamento documentazione senza cancellare storici

- Accorpata e aggiornata la documentazione corrente nei file canonici.
- Creato `00_START_HERE.md` come ingresso operativo per assistenti futuri.
- Creato `DOCUMENTATION_POLICY.md` per fissare la regola: non cancellare storici, aggiornare documenti canonici.
- Aggiornati `README.md`, `AI_HANDOFF_ZONAORIENTALE_CURRENT.md`, `CURRENT_STATE.md`, `ARCHITETTURA_E_DATI.md`, `OPERATIVITA_ADMIN_E_RELEASE.md`, `REGRESSION_TESTS.md` e questo changelog.
- Nessuna modifica runtime intenzionale.
- `FUNZIONALITA'.md` non modificato.

## V398 - Rimozione sezione Soccer Data

- Rimossi link desktop/mobile a Soccer Data.
- Rimossa la sezione `data-page="soccerdata"` da `index.html`.
- Aggiunto guard in `assets/app.js`: accesso diretto a `#soccerdata` reindirizzato al Listone.
- Soccer Data disattivata perche il flusso dati FBref/API-Football non e sostenibile con i limiti attuali.
- Preservate le altre sezioni: Dashboard, News, Rose, Listone, Fantamercato, Calciomercato, Competizioni, Snapshot, Admin.
- `FUNZIONALITA'.md` non modificato.

## V397 - Diagnostica API-Football

- Aggiunta diagnostica admin API-Football dentro Soccer Data.
- Verificato che la chiave API e il piano Free funzionano, ma il piano Free non consente la stagione corrente utile.
- Esito: API-Football non sostenibile per Soccer Data corrente senza piano diverso.

## V396 - Mapping API-Football da rose

- Aggiunto flusso per scaricare rose Serie A API e generare mapping nome+squadra.
- Riduzione prevista delle richieste API rispetto alla ricerca giocatore per giocatore.
- Bloccato dal piano Free sulla stagione corrente.

## V395 - Mapping API-Football assistito

- Tolti dalla UI operativa molti riferimenti al vecchio flusso FBref.
- Aggiunto mapping API-Football assistito con `Trova ID API`, `Inserisci ID API`, `Scarica mapping API`.
- Il link giocatore restava cliccabile verso il profilo esterno gia associato.

## V394 - Cache API-Football/Firebase

- Aggiunta function API-Football server-side con chiave in variabile ambiente Netlify.
- Aggiunta logica di salvataggio/cache su Firebase e export JSON statico.
- Aggiunta colonna `Aggiornato` in Soccer Data.
- Chiarito che l'API va usata solo per aggiornare cache, non per lettura pubblica.

## V393 - Fallback locale per stats Soccer Data

- Gestito errore Firebase `Missing or insufficient permissions` sulla collection stats.
- Aggiunto fallback locale browser per non perdere import HTML.
- Documentate rules possibili per `soccerDataPlayerStats`.
```

---

## 2. `FUNZIONALITA'.md`

- Percorso originale: `FUNZIONALITA'.md`
- Dimensione originale: 32606 byte
- SHA-256: `d0f142342bf9ed5726b50461d6cd20c9e5b5a5351aea81df0dde0a475a1a3950`

```markdown
# FUNZIONALITA' - ZonaOrientale Salerno

> Documento di controllo funzionale. Va aggiornato solo su richiesta esplicita del referente del progetto.
>
> Versione iniziale: V239 - 26/05/2026.

## Utente pubblico

### Dashboard
- Visualizza riepilogo stagione corrente.
- Visualizza metriche principali della stagione.
- Visualizza accessi rapidi alle sezioni principali.
- Visualizza comunicati recenti.
- Visualizza competizioni e partite principali.
- Usa layout mobile con card e scorciatoie rapide.

### News e comunicati
- Visualizza elenco comunicati pubblici.
- Apre e legge il dettaglio dei comunicati.
- Accede a un comunicato tramite link diretto/hash.
- Copia link WhatsApp dei comunicati.
- Visualizza anteprima WhatsApp dinamica tramite Netlify Function per gli URL di condivisione.

### Rose
- Visualizza elenco squadre della stagione.
- Visualizza rosa squadra con ruoli, squadra reale, costo e quotazioni.
- Visualizza movimenti di mercato FM.
- Filtra e cerca nei movimenti.
- Consulta snapshot statici delle rose pubblicate.
- Apre la pagina profilo squadra.

### Fantamercato
- Visualizza giocatori dichiarati trasferibili.
- Visualizza condizioni richieste dalle squadre proprietarie.
- Filtra per squadra.
- Cerca giocatori o squadre.
- Usa layout tabellare desktop e card mobile.

### Listone
- Visualizza listone giocatori.
- Cambia versione listone quando disponibili più snapshot.
- Cerca per giocatore, squadra reale, ruolo o rosa.
- Filtra per ruolo.
- Filtra per stato: in listone, asteriscato, svincolato/free agent.
- Visualizza giocatori in rosa e svincolati.
- Ordina e consulta colonne tecniche, quotazioni e FVM.
- Apre scheda giocatore esterna.

### Competizioni
- Visualizza competizioni della stagione corrente.
- Consulta calendario, risultati, classifiche e stato competizione.
- Apre pagina dettaglio competizione.
- Visualizza classifiche campionato con punti, partite, vittorie, pareggi, sconfitte, gol e fanta-punti.
- Usa layout mobile dedicato.

### Albo d'oro e FIFA Ranking
- Consulta albo storico.
- Consulta palmares.
- Consulta FIFA Ranking.
- Visualizza vincitori e piazzamenti storici.
- Esclude competizioni non disputate dai conteggi storici quando previsto dallo snapshot.

### Statistiche
- Consulta statistiche storiche aggregate.
- Visualizza club piu vincenti.
- Visualizza podi campionato.
- Visualizza ultimi titoli assegnati.
- Visualizza presidenti piu vincenti.
- Visualizza ranking storici.

### Archivio
- Seleziona stagioni storiche.
- Consulta squadre storiche.
- Consulta competizioni, partite e risultati storici.
- Consulta dati albo collegati alla stagione.
- Consulta rose e movimenti se disponibili.
- Visualizza saldi FM storici con fallback su piu fonti dati.

### Confronta squadre
- Seleziona squadre per confronto storico.
- Confronta risultati, dati storici e snapshot disponibili.
- Usa layout mobile dedicato.

### Regolamento
- Consulta regolamento interno della lega.
- Consulta sezioni su partecipanti, rose, mercato, svincoli, scambi, finanze, stadio, calendario, coppe, montepremi e Oscar.

### Navigazione, tema e mobile
- Naviga tramite menu principale desktop.
- Naviga tramite bottom navigation mobile.
- Usa menu mobile "Altro".
- Usa pulsante globale per tornare in alto.
- Usa tema chiaro/scuro.
- Consulta tabelle ottimizzate per mobile.

## Presidente

### Accesso e identita'
- Accede con account Firebase email/password o Google.
- Viene riconosciuto come presidente se approvato.
- Visualizza pulsante account personalizzato con logo squadra e dicitura "Pres. Cognome".
- Accede alla Dashboard Presidente.

### Dashboard Presidente
- Visualizza riepilogo squadra collegata.
- Visualizza ruolo e stato account.
- Apre pagina squadra.
- Usa azioni rapide mobile.
- Visualizza badge rosso con punto esclamativo quando riceve nuove trattative o esiti da leggere.

### Trattative
- Propone scambi/svincoli ad altre squadre attive.
- Seleziona giocatori offerti dalla propria rosa.
- Seleziona giocatori richiesti dalla rosa destinataria.
- Inserisce FM offerti o richiesti.
- Inserisce messaggio di trattativa.
- Invia proposta diretta o precompilata dal Fantamercato.
- Visualizza trattative inviate.
- Visualizza trattative ricevute.
- Visualizza storico con proposta, contropartite, FM, messaggio e stato.
- Visualizza le ultime 5 trattative subito e scorre nel riquadro per vedere le altre.
- Approva o rifiuta le proposte ricevute.
- Annulla le proprie proposte ancora in attesa.
- Mantiene visibile la notifica ricevuta fino ad approvazione o rifiuto.
- Mantiene visibile la notifica di esito per chi ha inviato fino all'apertura della card relativa.

### Comunicati squadra
- Inserisce titolo comunicato squadra.
- Inserisce testo comunicato squadra.
- Invia richiesta comunicato squadra verso admin.
- Il comunicato viene pubblicato nelle News dopo approvazione admin.

### Comunicati avvenuto scambio
- Inserisce titolo comunicato scambio.
- Inserisce testo comunicato scambio.
- Inserisce giocatori/contropartite coinvolti.
- Inserisce squadra coinvolta.
- Invia richiesta comunicato scambio verso admin.
- Invia contestualmente email tramite EmailJS a caparrotti86@yahoo.it.
- Dopo approvazione admin, il comunicato viene pubblicato nelle News come COMUNICATO_AVVENUTO_SCAMBIO.

### Fantamercato presidente
- Mette giocatori della propria rosa sul mercato.
- Modifica condizioni di trasferibilita'.
- Rimuove giocatori dal mercato.
- Avvia proposta dalla scheda di un giocatore trasferibile.

## Admin

### Accesso admin
- Accede con account admin Firebase.
- Visualizza area Admin completa.
- Carica dati pesanti solo quando necessario.
- Usa strumenti di diagnostica letture Firebase.

### Gestione stagioni
- Crea e modifica stagioni.
- Imposta stagione corrente.
- Gestisce date e metadati stagione.
- Esegue rollover stagione quando previsto.

### Gestione club e presidenti
- Gestisce club e identita' stagionali.
- Gestisce presidenti collegati.
- Approva o rifiuta richieste utenti/presidenti.
- Consulta storico utenti approvati.

### Gestione rose
- Carica e modifica rose.
- Importa rose da Excel quando previsto.
- Genera overlay statici per GitHub.
- Inizializza rose da snapshot statici.
- Gestisce movimenti FM.

### Gestione listone
- Carica listone da Excel.
- Converte listone in JSON statico.
- Aggiorna manifest listoni.
- Integra listone con rose.
- Genera overlay statico pronto per commit.

### Acquisti e asta
- Registra acquisti asta.
- Collega acquisto a giocatore, club, ruolo, prezzo e data.
- Aggiorna rose e movimenti collegati quando previsto dal flusso.

### Stadi
- Gestisce stadio per squadra/stagione.
- Gestisce livelli stadio.
- Visualizza e pubblica informazioni stadio nelle aree pubbliche.

### Comunicati e richieste presidenti
- Visualizza richieste presidenti.
- Approva o rifiuta comunicati squadra.
- Approva o rifiuta comunicati avvenuto scambio.
- Pubblica comunicati approvati nella collection News.
- Gestisce titolo, corpo, topic e metadati comunicato.
- Copia link WhatsApp comunicati.

### Competizioni
- Crea e modifica competizioni.
- Gestisce tipo e formato competizione.
- Gestisce stato competizione e vincitore.
- Gestisce calendario.
- Gestisce risultati.
- Gestisce classifiche Regular Season.
- Importa o pubblica competizioni statiche.

### Albo, palmares e FIFA Ranking
- Inserisce e modifica voci albo.
- Gestisce piazzamenti, punti, presidente, logo e note.
- Aggiorna palmares e FIFA Ranking.
- Genera snapshot pubblico honor.

### Snapshot pubblici e pubblicazione
- Aggiorna snapshot Firebase pubblici.
- Scarica config pubblica.
- Scarica honor JSON.
- Scarica overlay snapshot stagioni.
- Controlla asset pubblici.
- Verifica cosa committare nella repo.
- Usa procedura guidata pubblicazione.

### Backup e diagnostica
- Esporta backup JSON delle raccolte Firebase.
- Usa modalita' admin leggera o completa.
- Esegue preflight asset pubblici.
- Esegue checklist online finale.
- Consulta diagnostica runtime e stato refactor.

## Infrastruttura e dati

### Dati statici pubblici
- Usa config pubblica JSON.
- Usa snapshot stagioni.
- Usa snapshot honor.
- Usa manifest listoni.
- Usa manifest rose.
- Usa manifest competizioni.
- Usa asset statici sotto static/zonaorientale.

### Firebase
- Usa Firebase Auth per login.
- Usa Firestore per news live, richieste, utenti, admin, fantamercato e trattative.
- Usa dati statici come fonte pubblica principale e Firebase come sorgente live/fallback.

### Netlify
- Usa netlify.toml per redirect e funzioni.
- Usa funzione news-share per generare preview dinamiche dei comunicati.

### Versioning operativo
- Footer e cache-buster devono essere aggiornati a ogni overlay funzionale.
- Il deploy avviene tramite commit e push su branch master della repo starter-academic-sb.


---

# Aggiornamento funzionale V240-V278

> Sezione aggiunta su richiesta esplicita del referente del progetto. Le sezioni precedenti del documento non sono state rimosse o sostituite.
>
> Scopo: incorporare nel registro principale le funzionalita' introdotte, consolidate o corrette nei cicli V240-V278, mantenendo memoria delle funzioni critiche prima di refactor o pulizie.

## Utente pubblico - aggiornamenti

### News, comunicati e anteprime WhatsApp
- La home `/zonaorientale/` usa metadati Open Graph generici del sito, evitando che la condivisione della home mostri l'ultima news.
- Le anteprime specifiche delle news restano legate ai link dedicati `/zonaorientale/share/news/<id>` gestiti dalla Netlify Function.
- Il pulsante `Apri preview` e' stato rimosso dall'interfaccia; resta il pulsante `Copia link WhatsApp`.
- I badge/tag tecnici `Firebase`, `JSON`, `JSON statico`, `Solo JSON` sono stati nascosti dall'interfaccia utente finale dove non utili.

### Listone - storico, confronto e ricerca
- Il Listone supporta piu' versioni/snapshot e puo' confrontare il listone selezionato con listoni precedenti della stessa stagione.
- E' disponibile il pannello `Storico listoni` con riepilogo di nuovi, usciti, variazioni quotazione, variazioni stato, squadra e ruolo.
- La ricerca puo' includere anche giocatori presenti in listoni diversi da quello selezionato.
- La tabella Listone include la colonna opzionale `Modifica`, attivabile dai `Campi visibili`.
- La colonna `Modifica` puo' indicare `Nuovo`, `Uscito`, variazione quotazione `+N`/`-N`, cambio stato, cambio squadra, cambio ruolo, piu' variazioni o invariato.
- E' disponibile il filtro `Mostra usciti storici`, che mostra giocatori non presenti nel listone selezionato ma trovati in listoni precedenti.
- Per i giocatori usciti viene indicato l'ultimo listone che li conteneva.
- E' disponibile il filtro `Modifiche`, con opzioni per visualizzare solo modificati, nuovi, usciti, aumentati, diminuiti, cambi stato, cambi squadra o cambi ruolo.
- E' disponibile il pulsante `Esporta modifiche CSV`, che esporta le modifiche del listone rispettando il filtro `Modifiche` selezionato.
- Il Listone accetta squadre reali sia come sigle sia come nomi estesi, ma usa e visualizza il codice canonico a tre lettere.
- Esempi di normalizzazione: `Atalanta -> ATA`, `Bologna -> BOL`, `Inter -> INT`, `Milan -> MIL`, `Hellas Verona -> VER`.
- Il confronto storico deve usare i codici canonici per evitare falsi cambi squadra.

### Accesso riservato
- Il campo `Nome visualizzato` e' stato rimosso dall'Accesso Riservato per evitare confusione: il nome/presidente viene assegnato dall'admin.
- Il pulsante `Accedi con Google` mostra il logo Google.

## Presidente - aggiornamenti

### Trattative e notifiche
- Le trattative vengono rilette in modo piu' coerente entrando nella Dashboard Presidente e nella sottosezione `Trattative`.
- Lo storico delle trattative inviate e ricevute resta visibile, con ultime 5 subito consultabili e le altre tramite scroll.
- Il badge rosso con punto esclamativo segnala proposte ricevute ancora in attesa.
- Il badge del destinatario resta visibile finche' la proposta non viene approvata o rifiutata.
- Il badge del mittente segnala l'esito di una proposta inviata approvata/rifiutata.
- La notifica di esito per il mittente sparisce solo dopo apertura/lettura della card relativa.
- La lettura degli esiti puo' essere salvata su Firebase nei campi `outcomeSeen...` quando le Firebase Rules V257 sono pubblicate.
- Se Firebase non consente l'update, resta un fallback locale tramite `localStorage`.

### Comunicati presidente
- Il flusso canonico `Comunicato avvenuto scambio` e': presidente -> `teamRequests` con tipo `TRANSFER_NEWS` -> EmailJS immediata -> approvazione Admin -> pubblicazione in News.
- Il presidente non deve scrivere direttamente nella collection `news`.
- La mail EmailJS dell'avvenuto scambio viene inviata a `caparrotti86@yahoo.it`.
- Sono stati neutralizzati i vecchi handler legacy V50/V79/V237 che potevano causare doppi submit o tentativi di scrittura diretta in `news`.

### Svincola Giocatori
- In Dashboard Presidente e' presente la sottosezione `Svincola Giocatori`.
- Il presidente puo' selezionare uno o piu' giocatori dalla propria rosa.
- Il sistema genera automaticamente una mail indirizzata a `caparrotti86@yahoo.it`.
- Oggetto email: `<Nome Squadra> - Svincolo giocatori - <Data odierna>`.
- Il corpo email comunica i giocatori che il presidente intende svincolare.
- Per ogni giocatore selezionato viene indicata l'ultima quotazione attuale recuperata dal listone piu' recente disponibile.
- La mail indica il listone o i listoni usati per recuperare le quotazioni.
- La mail si chiude con `Cordiali Saluti` e il nome del presidente.
- Il flusso usa EmailJS, non crea richieste Admin e non scrive su Firebase.

### Test trattative
- E' disponibile il simulatore notifiche trattative da console browser.
- API corrente: `window.ZonaOrientaleTradeSimulatorV255`.
- Comando rapido: `await ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()`.
- Le simulazioni locali non scrivono su Firebase.

## Admin - aggiornamenti

### Accetta utenti
- Il flusso `Accetta utenti` e' stato stabilizzato.
- Gli utenti gia' approvati non vengono rigenerati come richieste `PENDING` al login Google/email.
- Gli utenti rifiutati restano marcati come `REJECTED`, evitando ricomparsa automatica come nuove richieste.
- Il pannello nasconde vecchi duplicati `pendingUsers` quando esiste gia' un utente approvato in `teamUsers`.

### Richieste presidenti
- Il pannello `Admin -> Richieste presidenti` include il pulsante `Aggiorna richieste` per rileggere `teamRequests` da Firebase.
- Le richieste `TRANSFER_NEWS` generate dai comunicati avvenuto scambio sono visibili nel pannello.
- Restano disponibili approvazione e rifiuto delle richieste.
- E' disponibile `Elimina da Firebase` per comunicati rifiutati, approvati o accepted.
- L'eliminazione cancella il documento `teamRequests/{id}` ma non cancella eventuali news gia' pubblicate.
- Il pannello e' stato estratto nel modulo `assets/js/admin/team-requests-panel-v253.js`, mantenendo un fallback storico in `app.js`.

### Comunicati Admin
- Il Generatore comunicati automatici e' stato ripristinato.
- Il generatore produce bozze per risultati, vincitori, mercato, focus squadra, albo/palmares e aggiornamenti dati pubblici.
- Il generatore non scrive direttamente su Firebase.
- Azioni disponibili: copia testo e inserisci bozza nel form Comunicati.

### Diagnostica dati Admin
- E' presente il pannello `Admin -> Diagnostica dati`.
- Il pannello mostra controlli/semafori su versione deploy, listoni, rose, competizioni, news, richieste presidenti, trattative ed EmailJS.
- Il pannello e' non distruttivo e non scrive su Firebase.

### Converti listone Excel
- Il convertitore listone supporta il formato storico con fogli `Tutti` e `Ceduti`.
- Il convertitore supporta anche il formato Classic a foglio singolo, per esempio `Lista calciatori`.
- Nel formato Classic riconosce colonne come `#`, `Nome`, `Fuori lista`, `Sq.`, `R.`, `R.MANTRA`, `FVM/1000`, `QUOT.`, `FantaSquadra`, `Costo`.
- La colonna `Sq.` viene normalizzata a codice squadra canonico a tre lettere.
- Il report conversione indica formato riconosciuto, fogli usati, giocatori totali, in listone e asteriscati.
- Il convertitore puo' arricchire il JSON generato con dati di confronto storico quando trova un listone precedente.
- Nel test reale V273 il file Excel Classic `Lista calciatori` e' stato riconosciuto con 663 giocatori convertibili, 532 in listone, 131 asteriscati e 299 con `FantaSquadra` valorizzata.

### Workflow pubblicazione Admin
- Il workflow pubblicazione Admin inline resta il flusso canonico.
- Restano i pannelli `Stato Firebase / JSON` e `Procedura guidata Pubblica aggiornamenti`.
- Il vecchio modulo esterno V213 resta da valutare come legacy prima di eventuale rimozione.

## Sviluppo, test e manutenzione - aggiornamenti

### Firebase Rules notifiche trattative
- Sono presenti le Firebase Rules V257 per consentire al mittente di aggiornare solo i campi di lettura esito `outcomeSeen...`.
- Le rules non vengono applicate automaticamente da Netlify: vanno pubblicate da Firebase Console o Firebase CLI.

### EmailJS e deliverability
- I flussi EmailJS attivi sono `Comunicato avvenuto scambio` e `Svincola Giocatori`.
- Le email operative hanno oggetti piu' sobri, firma standard, mittente logico `Lega ZonaOrientale Salerno` e `reply_to` quando disponibile.
- La deliverability reale dipende dal servizio collegato a EmailJS e dalla configurazione del dominio mittente con SPF, DKIM e DMARC.

### Documentazione e handoff
- Sono stati creati registri incrementali delle funzionalita' recenti e documenti di handoff per nuovo assistente.
- Il nuovo handoff canonico raccomandato e' `docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE.md`.
- La checklist di regressione resta in `REGRESSION_TESTS.md`.

### Asset e pulizie
- E' stato aggiunto/aggiornato `.gitignore` per evitare file macOS come `.DS_Store`, `__MACOSX`, `._*`.
- Sono stati identificati/rimossi asset duplicati o obsoleti solo dopo audit, mantenendo le posizioni canoniche.

## Funzionalita' e moduli da non eliminare senza audit

- `assets/js/admin/listone-converter.js`.
- Colonna `Modifica` del Listone.
- Filtro `Mostra usciti storici`.
- Filtro `Modifiche`.
- Pulsante `Esporta modifiche CSV`.
- Ricerca storica negli altri listoni.
- Normalizzazione codici squadra V274.
- `assets/js/domain/competitions.js`, da verificare prima di rimozione.
- `assets/js/refactor/admin-publication-workflow-v213.js`, da verificare prima di rimozione.
- `news.html`, `comunicati/*.html`, `tools/generate-news-share-pages.mjs`, da mantenere per compatibilita' finche' non deciso diversamente.
- Fallback inline delle Richieste presidenti e vecchi blocchi legacy comunicato scambio, da rimuovere solo con test dedicati.

## Diagnostiche runtime utili

- `window.ZonaOrientaleTradeSimulatorV255`.
- `window.ZonaOrientalePlayerReleaseV261`.
- `window.ZonaOrientaleListoneConverterV268`.
- `window.ZonaOrientaleListoneHistoryV269`.
- `window.ZonaOrientaleListoneChangesV270`.
- `window.ZonaOrientaleListoneTeamCodesV274`.
- `window.ZonaOrientaleAdminDiagnosticsV276`.
- `window.ZonaOrientaleListoneChangeFilterV277`.
- `window.ZonaOrientaleListoneExportV278`.

---

# Aggiornamento funzionale completo V313

> Sezione aggiunta su richiesta esplicita del referente del progetto. Non sostituisce le sezioni precedenti: le integra come indice funzionale completo aggiornato alla V313.
>
> Regola principale: ogni futura modifica, pulizia o refactor deve preservare le funzionalita elencate qui sotto, dichiarando cosa rischia di perdere e come viene testato.

## Utente pubblico

### Navigazione generale
- Usa menu desktop per accedere a Dashboard, News, Rose, Fantamercato, Calciomercato, Listone, Competizioni, Albo/FIFA, Statistiche, Archivio, Confronta e Regolamento.
- Usa bottom navigation mobile e menu `Altro`.
- Usa pulsante globale `Su` da smartphone dopo scroll.
- Naviga con hash/route interne senza ricaricare la webapp.
- Usa Dark mode unico; la Light mode e' sospesa temporaneamente.

### Dashboard
- Visualizza stagione corrente.
- Visualizza riepiloghi e metriche principali.
- Visualizza comunicati recenti.
- Visualizza competizioni e partite principali.
- Usa scorciatoie rapide verso sezioni principali.
- Usa layout mobile a card.

### News e comunicati
- Visualizza elenco comunicati pubblici.
- Apre dettaglio comunicato.
- Accede a comunicati tramite hash diretto.
- Copia link WhatsApp dei comunicati.
- Usa anteprime WhatsApp dinamiche tramite Netlify Function `/zonaorientale/share/news/<id>`.
- La home usa anteprima generica e non l'ultima news.

### Rose e squadre
- Visualizza elenco squadre della stagione.
- Apre pagina squadra.
- Visualizza rosa con ruoli, squadra reale, costo, quotazioni e dati disponibili.
- Visualizza movimenti FM collegati.
- Consulta snapshot statici delle rose.
- Usa tabelle scrollabili e prima colonna sticky da mobile.
- In Dashboard Presidente e pagina squadra le tabelle rose restano leggibili e compatte.

### Fantamercato interno
- Visualizza giocatori dichiarati trasferibili.
- Visualizza condizioni richieste dalle squadre proprietarie.
- Filtra per squadra.
- Cerca giocatori o squadre.
- Usa layout desktop tabellare e mobile ottimizzato.
- Resta distinto dalla sezione pubblica `Calciomercato`, che riguarda notizie/articoli esterni.

### Calciomercato notizie
- Accede alla sezione pubblica `Calciomercato`.
- Recupera articoli automaticamente da fonti RSS tramite Netlify Function `calciomercato-feed`.
- Usa fallback statico da `assets/calciomercato/links.json` se la funzione non e' disponibile.
- Visualizza card orizzontali con immagine, fonte, titolo, descrizione, data e ora Europe/Rome.
- Visualizza squadre coinvolte, topic, stato trattativa e giocatori interessati.
- Filtra per squadra.
- Filtra per topic.
- Cerca per titolo, fonte, squadra, giocatore, topic o stato.
- Apre l'articolo originale in nuova scheda.
- Supporta fonti multiple configurabili con `feedUrl` o `feedUrls`.
- Deduplica gli articoli per URL.

### Listone
- Visualizza listone giocatori.
- Cambia versione/snapshot listone.
- Cerca per giocatore, squadra reale, ruolo, rosa e altri campi indicizzati.
- Filtra per ruolo.
- Filtra per stato: in listone, asteriscato, svincolato/free agent.
- Visualizza giocatori in rosa e svincolati.
- Visualizza colonna opzionale `Modifica`.
- Visualizza nuovi, usciti, aumenti/diminuzioni quotazione, cambi stato, squadra e ruolo.
- Usa filtro `Modifiche`.
- Usa filtro `Mostra usciti storici`.
- Ricerca anche giocatori presenti in listoni precedenti quando previsto dalla logica storica.
- Normalizza squadre reali a codice canonico a tre lettere.
- Non mostra al pubblico il pulsante `Esporta modifiche CSV`, riservato agli Admin.

### Competizioni
- Visualizza competizioni della stagione corrente.
- Consulta calendario, risultati, classifiche e stato.
- Apre pagina dettaglio `competition.html`.
- Visualizza classifiche campionato con POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT.
- Usa layout mobile dedicato e tabelle scrollabili.

### Albo d'Oro, palmares e FIFA Ranking
- Consulta albo storico.
- Consulta palmares.
- Consulta FIFA Ranking.
- Visualizza vincitori, piazzamenti, presidenti e loghi quando disponibili.
- Esclude competizioni non disputate dai conteggi storici quando previsto.

### Statistiche
- Consulta statistiche storiche aggregate.
- Visualizza club piu' vincenti.
- Visualizza podi campionato.
- Visualizza ultimi titoli assegnati.
- Visualizza presidenti piu' vincenti.
- Visualizza ranking storici.

### Archivio
- Seleziona stagioni storiche.
- Consulta squadre storiche.
- Consulta competizioni, partite e risultati storici.
- Consulta dati albo collegati alla stagione.
- Consulta rose e movimenti se disponibili.
- Visualizza saldi FM storici con fallback su piu' fonti.

### Confronta squadre
- Seleziona squadre per confronto storico.
- Confronta risultati, dati storici e snapshot disponibili.
- Usa layout mobile dedicato.

### Regolamento
- Consulta regolamento interno della lega.
- Consulta sezioni su partecipanti, rose, mercato, svincoli, scambi, finanze, stadio, calendario, coppe, montepremi e Oscar.

## Presidente

### Accesso e identita'
- Accede con Firebase email/password.
- Accede con Google.
- Viene riconosciuto come presidente se approvato dall'Admin.
- Visualizza pulsante account personalizzato con logo squadra e dicitura `Pres. Cognome`.
- Accede alla Dashboard Presidente.

### Dashboard Presidente
- Visualizza squadra collegata.
- Visualizza ruolo e stato account.
- Apre pagina squadra.
- Usa azioni rapide mobile.
- Visualizza badge rosso per nuove trattative o esiti da leggere.

### Trattative
- Propone scambi ad altre squadre attive.
- Seleziona giocatori offerti dalla propria rosa.
- Seleziona giocatori richiesti dalla rosa destinataria.
- Inserisce FM offerti o richiesti.
- Inserisce messaggio di trattativa.
- Invia proposta diretta o precompilata dal Fantamercato.
- Visualizza trattative inviate e ricevute.
- Approva o rifiuta proposte ricevute.
- Annulla proprie proposte in attesa.
- Visualizza storico con proposta, contropartite, FM, messaggio e stato.
- Mantiene notifiche fino alla lettura/azione prevista.
- Sincronizza lettura esiti su Firebase quando le rules lo permettono, con fallback localStorage.

### Comunicati squadra
- Inserisce titolo e testo comunicato squadra.
- Invia richiesta verso Admin.
- Il comunicato viene pubblicato nelle News dopo approvazione.

### Comunicati avvenuto scambio
- Inserisce titolo e testo comunicato scambio.
- Inserisce giocatori/contropartite coinvolti.
- Inserisce squadra coinvolta.
- Invia richiesta `TRANSFER_NEWS` in `teamRequests`.
- Invia contestualmente email tramite EmailJS a `caparrotti86@yahoo.it`.
- Dopo approvazione Admin viene pubblicato nelle News come `COMUNICATO_AVVENUTO_SCAMBIO`.
- Non scrive direttamente nella collection `news` da account presidente.

### Svincola Giocatori
- Seleziona uno o piu' giocatori dalla propria rosa.
- Genera email a `caparrotti86@yahoo.it`.
- Include quotazione recuperata dal listone piu' recente disponibile.
- Indica il listone usato per le quotazioni.
- Usa EmailJS.
- Non scrive su Firebase e non crea richiesta Admin.

### Fantamercato presidente
- Mette giocatori sul mercato.
- Modifica condizioni di trasferibilita'.
- Rimuove giocatori dal mercato.
- Avvia proposta dalla scheda trasferibile.

## Admin

### Accesso e caricamento dati
- Accede con account Admin Firebase.
- Usa modalita Admin leggero all'avvio.
- Visualizza titolo `Admin` sopra tutti i pannelli.
- Visualizza il pannello `Carica dati amministrazione` aperto finche i dati completi non vengono caricati.
- Carica dati amministrazione solo quando servono modifiche, snapshot o backup.
- Dopo il caricamento completo, le sezioni Admin partono ridotte e sono apribili con `Apri` / `Riduci`.

### Accetta utenti
- Visualizza richieste utenti/presidenti.
- Approva o rifiuta utenti.
- Evita ricomparsa automatica di utenti gia' approvati o rifiutati.
- Nasconde duplicati pending quando esiste gia' utente approvato.

### Richieste presidenti
- Visualizza richieste presidenti.
- Aggiorna richieste da Firebase.
- Approva comunicati squadra.
- Rifiuta comunicati squadra.
- Approva comunicati avvenuto scambio.
- Rifiuta comunicati avvenuto scambio.
- Elimina da Firebase comunicati approvati/rifiutati/accepted dal registro `teamRequests`.
- Non cancella news gia' pubblicate quando elimina la richiesta.

### Comunicati e News
- Crea e modifica news/comunicati.
- Pubblica comunicati approvati nella collection News.
- Gestisce titolo, corpo, topic e metadati.
- Copia link WhatsApp comunicati.
- Usa generatore comunicati automatici per bozze locali senza scrittura diretta.

### Gestione stagioni
- Crea e modifica stagioni.
- Imposta stagione corrente.
- Gestisce date, numero partecipanti e metadati.
- Esegue rollover stagione quando previsto.

### Presidenti, squadre e squadre stagionali
- Gestisce anagrafica presidenti.
- Gestisce club/squadre.
- Gestisce squadre stagionali.
- Collega presidenti a squadre e stagioni.
- Gestisce loghi e note.

### Stadi
- Gestisce stadio per squadra/stagione.
- Gestisce livelli e informazioni stadio.
- Pubblica dati stadio nelle aree pubbliche.

### Rose e movimenti FM
- Carica e modifica rose.
- Importa rose da Excel quando previsto.
- Gestisce movimenti FM.
- Genera overlay statici per GitHub.
- Inizializza rose da snapshot statici.

### Listone
- Carica listone da Excel.
- Converte listone in JSON statico.
- Supporta formato storico `Tutti/Ceduti`.
- Supporta formato Classic a foglio singolo.
- Normalizza squadre reali a codici canonici.
- Confronta listoni con storico e produce dati modifica.
- Gestisce manifest listoni.
- Integra listone con rose.
- Esporta CSV modifiche solo per Admin.

### Competizioni
- Crea e modifica competizioni.
- Gestisce tipo, formato, stato, vincitore e metadati.
- Gestisce calendario.
- Gestisce risultati.
- Gestisce classifiche Regular Season.
- Importa/pubblica competizioni statiche.
- Gestisce soft delete/restore match e tombstone quando previsto.

### Albo, palmares e FIFA Ranking
- Inserisce e modifica voci albo.
- Gestisce piazzamenti, punti, presidente, logo e note.
- Aggiorna palmares e FIFA Ranking.
- Genera snapshot pubblico honor.

### Snapshot pubblici e pubblicazione
- Aggiorna snapshot Firebase pubblici.
- Scarica config pubblica.
- Scarica honor JSON.
- Scarica overlay snapshot stagioni.
- Controlla asset pubblici.
- Usa promemoria di pubblicazione.
- Usa Stato Firebase / JSON.
- Usa Procedura guidata Pubblica aggiornamenti.
- Usa checklist online finale.

### Backup e diagnostica
- Esporta backup JSON delle collection Firebase.
- Usa diagnostica dati Admin.
- Controlla qualita' listoni, rose, competizioni e news.
- Usa script pre-push locali.
- Usa audit asset/import e audit CSS.

## Infrastruttura

### Dati statici
- Usa `assets/public/config.json`.
- Usa snapshot stagioni.
- Usa snapshot honor.
- Usa manifest listoni.
- Usa manifest rose.
- Usa manifest competizioni.
- Usa asset statici sotto `static/zonaorientale`.

### Firebase
- Usa Firebase Auth.
- Usa Firestore per news live, richieste, utenti, admin, fantamercato e trattative.
- Usa dati statici come fonte pubblica principale e Firebase come sorgente live/fallback.

### Netlify
- Usa `netlify.toml` per redirect e funzioni.
- Usa `news-share` per preview WhatsApp news.
- Usa `calciomercato-feed` per feed RSS Calciomercato server-side.

### Strumenti locali
- `tools/check-zonaorientale.sh` per controlli pre-push.
- `tools/audit-assets-v298.sh` per audit asset/import.
- `tools/audit-css-v300.sh` per audit CSS.
- `tools/cleanup-css-refactor-v301.sh` per pulizia CSS refactor controllata.
- `tools/cleanup-macos-artifacts-v283.sh` per metadata macOS.

## Funzionalita da non rimuovere senza audit

- `assets/app.js` helper e override storici Vxxx.
- `assets/js/admin/listone-converter.js`.
- `assets/js/admin/team-requests-panel-v253.js`.
- `assets/js/refactor/admin-publication-workflow-v213.js`.
- `assets/js/domain/competitions.js`.
- `assets/js/utils/shared-helpers-v295.js`.
- CSS refactor `mobile-controls.css`, `rosters-tables.css`, `calciomercato.css`.
- `news.html`, `comunicati/*.html`, `tools/generate-news-share-pages.mjs`.
- Vecchi fallback Richieste presidenti e comunicato scambio finche non rimossi con audit dedicato.
- Netlify Functions `news-share.js` e `calciomercato-feed.js`.

## Aggiornamento funzionale V314 - Calciomercato fonti

### Utente pubblico - Calciomercato
- Filtra gli articoli per fonte tramite menu `Tutte le fonti`.
- Nel filtro squadra visualizza `Generale` subito dopo `Tutte le squadre`, prima della lista alfabetica delle squadre.
- Consulta articoli recuperati automaticamente da piu' fonti RSS configurate.
- Usa ricerca combinata su titolo, descrizione, fonte, squadra, topic, stato e giocatori interessati.
- Continua a visualizzare articoli con squadre multiple, stato trattativa, data/ora in fuso Europe/Rome e giocatori interessati.

### Sviluppo futuro - AI Calciomercato
- E' prevista come possibile evoluzione una scheda AI per riepilogare gli articoli relativi a un giocatore o a una squadra.
- La prima implementazione dovra' essere server-side, senza chiavi AI esposte nel browser, e dovra' usare solo metadati/descrizioni RSS o contenuti autorizzati.

### Funzionalita' da non perdere
- Il nuovo Calciomercato non sostituisce il Fantamercato interno della lega.
- Restano invariati Listone, Rose, Dashboard Presidente, Admin, Firebase, EmailJS, mobile navigation e News/share WhatsApp.
```

---

## 3. `funzionalita/FUNZIONALITA'V240-255.md`

- Percorso originale: `funzionalita/FUNZIONALITA'V240-255.md`
- Dimensione originale: 6845 byte
- SHA-256: `c58e072ebcd75d691446fc5bb38ab55296e011e286fe2cb94b644df4970a709f`

```markdown
# FUNZIONALITA' V240-255

Documento incrementale creato in V256.

Questo file riepiloga le funzionalita introdotte, ripristinate o consolidate tra V240 e V255. Non sostituisce `FUNZIONALITA'.md`, che resta il registro funzionale principale e deve essere aggiornato solo su richiesta esplicita.

## 1. Pubblico

### News e comunicati

- Mantenuto il flusso pubblico dei comunicati nella sezione News.
- Consolidato il supporto ai comunicati generati da richieste presidente approvate dall'Admin.
- Confermata la compatibilita' con preview/condivisione comunicati gia' presente nel sito.

### Navigazione, cache e versione

- Aggiornati progressivamente footer, cache-buster e diagnostica di deploy per tutte le versioni V240-V255.
- Preservati i percorsi pubblici principali: Dashboard, News, Rose, Fantamercato, Listone, Competizioni, Albo, Statistiche, Archivio, Confronta, Regolamento.

## 2. Presidente

### Dashboard Presidente

- Le trattative vengono rilette in modo piu' coerente quando si entra nella Dashboard Presidente e nella sottosezione Trattative.
- Il badge rosso con punto esclamativo segnala proposte ricevute ancora in attesa.
- Il badge destinatario resta visibile finche' la proposta non viene approvata o rifiutata.
- Il badge del mittente segnala l'esito di una proposta inviata approvata/rifiutata.
- La lettura dell'esito viene salvata su Firebase quando consentito dalle regole, con fallback locale.

### Trattative

- Ripristinata la visibilita' dello storico delle trattative inviate e ricevute.
- Le ultime 5 trattative sono visibili subito; le altre restano consultabili tramite scorrimento nel riquadro.
- Ogni card trattativa mantiene proposta ed esito.
- La notifica mittente sparisce solo dopo apertura/lettura della card relativa all'esito.

### Comunicati presidente

- Consolidato il flusso canonico `Comunicato avvenuto scambio`.
- Il comunicato avvenuto scambio non scrive piu' direttamente in `news` dal profilo presidente.
- Il flusso corretto e': presidente -> `teamRequests` con `TRANSFER_NEWS` -> invio EmailJS -> approvazione Admin -> pubblicazione News.
- Neutralizzati i vecchi handler legacy V50/V79/V237 che potevano agganciarsi al form storico.
- La mail EmailJS dell'avvenuto scambio resta inviata subito a `caparrotti86@yahoo.it`.

### Test presidente/trattative

- Aggiunto il simulatore notifiche trattative da console browser.
- API corrente: `window.ZonaOrientaleTradeSimulatorV255`.
- Alias compatibile: `window.ZonaOrientaleTradeSimulatorV254`.
- Comando rapido consigliato: `await ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()`.
- Le simulazioni locali non scrivono su Firebase.
- Il test reale puo' creare una proposta in Firebase con `await ZonaOrientaleTradeSimulatorV255.createFirebaseSentProposal({ confirm: true })`.

## 3. Admin

### Accetta utenti

- Stabilizzato il flusso `Accetta utenti`.
- Gli utenti gia' approvati non vengono piu' rigenerati come richieste `PENDING` al login Google/email.
- Gli utenti rifiutati restano marcati come `REJECTED`, evitando ricomparsa automatica come nuove richieste.
- Il pannello nasconde vecchi duplicati `pendingUsers` quando esiste gia' un utente approvato in `teamUsers`.

### Richieste presidenti

- Consolidato il pannello `Admin -> Richieste presidenti`.
- Aggiunto/normalizzato il pulsante `Aggiorna richieste` per rileggere `teamRequests` da Firebase.
- Le richieste `TRANSFER_NEWS` generate dai comunicati avvenuto scambio sono visibili nel pannello.
- Mantenute azioni di approvazione e rifiuto.
- Aggiunto `Elimina da Firebase` per comunicati rifiutati.
- Esteso `Elimina da Firebase` anche ai comunicati approvati/accepted.
- L'eliminazione cancella il documento da `teamRequests/{id}` ma non cancella eventuali news gia' pubblicate.
- Il pannello e' stato estratto in modulo dedicato: `assets/js/admin/team-requests-panel-v253.js`, con fallback storico ancora presente in `app.js`.

### Comunicati Admin

- Ripristinato il Generatore comunicati automatici.
- Il generatore produce bozze per risultati, vincitori, mercato, focus squadra, albo/palmares e aggiornamenti dati pubblici.
- Il generatore non scrive direttamente su Firebase.
- Azioni disponibili: copia testo e inserisci bozza nel form Comunicati.

### Workflow pubblicazione

- Consolidato il workflow pubblicazione Admin gia' presente inline.
- Mantenuti pannelli `Stato Firebase / JSON` e `Procedura guidata Pubblica aggiornamenti`.
- Aggiornati comandi del wizard, rimuovendo riferimenti a branch storici obsoleti.
- Il vecchio modulo esterno V213 resta da valutare come legacy per eventuale rimozione futura.

## 4. Sviluppo, test e manutenzione

### Checklist regressioni

- Aggiunto `REGRESSION_TESTS.md` come checklist stabile pre-merge/pre-deploy.
- La checklist copre aree pubbliche, presidente, admin, mobile, Firebase, comunicati e trattative.

### Pulizia asset

- Aggiunto `.gitignore` locale per evitare `.DS_Store`, `__MACOSX` e file AppleDouble.
- Identificati come rimovibili i CSS mobile hotfix V166/V167, gia' inglobati in `mobile-suite-v168.css`.

### Refactor progressivo

- Avviata estrazione modulare da `app.js`.
- Primo modulo estratto: `Admin -> Richieste presidenti`.
- Il fallback storico non e' stato rimosso per ridurre il rischio di regressioni.

## 5. Funzionalita rispetto a FUNZIONALITA'.md

Rispetto a `FUNZIONALITA'.md`, il ciclo V240-V255 aggiunge o dettaglia soprattutto:

- aggiornamento e stabilizzazione notifiche trattative presidente;
- lettura esiti trattative sincronizzabile su Firebase;
- simulatore notifiche trattative da console;
- flusso canonico comunicato avvenuto scambio;
- gestione Admin piu' completa delle richieste presidente;
- eliminazione da Firebase delle richieste comunicato approvate/rifiutate;
- generatore comunicati automatici Admin ripristinato;
- checklist regressioni e strumenti di test.

Alla data V256 non risulta volutamente rimossa alcuna funzionalita' gia' tracciata in `FUNZIONALITA'.md`. Le modifiche V240-V255 sono additive o di consolidamento.

## 6. Funzionalita/moduli da verificare ancora

- `assets/js/refactor/admin-publication-workflow-v213.js`: modulo esterno ancora non collegato; il workflow inline e' quello canonico. Candidato a rimozione futura o archiviazione come legacy.
- `assets/js/domain/competitions.js`: modulo domain non importato direttamente da `app.js` nella baseline analizzata; va verificato prima di eventuale rimozione perche' la logica competizioni potrebbe essere duplicata inline.
- `tools/generate-news-share-pages.mjs`, `news.html` e `comunicati/*.html`: strumenti/pagine legacy per share statiche; da mantenere finche' serve compatibilita' con vecchi link, oppure dichiarare legacy.
- `assets/css/mobile-hotfix-v166.css` e `assets/css/mobile-hotfix-v167.css`: candidati a rimozione se gia' rimossi dalla repo o dopo conferma visuale mobile.
```

---

## 4. `funzionalita/FUNZIONALITA'V256-262.md`

- Percorso originale: `funzionalita/FUNZIONALITA'V256-262.md`
- Dimensione originale: 6801 byte
- SHA-256: `bbee2d58f8d95aab6e701a8f4452a737cc2b4c0045bfa9a4338848426812e0ee`

````markdown
# FUNZIONALITA' V256-262 - ZonaOrientale Salerno

Documento aggiuntivo creato in **V263** per tracciare le funzionalita' introdotte, consolidate o documentate tra **V256** e **V262**.

Questo file **non sostituisce** `FUNZIONALITA'.md`: e' un registro incrementale del ramo `refactor/260528-zonaorientale-next`.

## Regola di manutenzione

- `FUNZIONALITA'.md` resta il documento principale e va modificato solo su richiesta esplicita.
- Questo file registra le modifiche funzionali e tecniche del blocco V256-V262.
- Prima di merge su `master`, verificare se trasferire alcune voci nel file principale.

---

## Pubblico

### Home e anteprima WhatsApp

**Versioni:** V259, V260

- La home `/zonaorientale/` usa metadati Open Graph generici del sito.
- La condivisione della home non deve mostrare l'ultima news come anteprima.
- Le anteprime specifiche delle news restano limitate ai link news dedicati:

```text
/zonaorientale/share/news/<id>
```

- Il pulsante `Apri preview` non e' piu' mostrato nell'interfaccia news.
- Resta il pulsante `Copia link WhatsApp`.

### Tag tecnici Firebase/JSON

**Versione:** V260

- Sono stati nascosti/rimossi dall'interfaccia utente i badge tecnici `Firebase`, `JSON`, `JSON statico`, `Solo JSON` dove non utili all'utente finale.
- La rimozione e' solo visiva: non modifica il funzionamento dei dati statici, Firebase, snapshot o fallback.

---

## Presidente

### Trattative e notifiche multi-dispositivo

**Versioni:** V257, con predisposizione runtime V246

- Le notifiche trattative continuano a derivare dalla collection Firebase:

```text
transferNegotiations
```

- Per il presidente destinatario, il badge resta visibile finche' una trattativa ricevuta e' `PENDING`.
- Per il presidente mittente, il badge dell'esito resta visibile finche' la card della proposta conclusa non viene aperta.
- Le Firebase Rules V257 consentono al mittente di aggiornare solo i campi di lettura esito:

```text
outcomeSeenByFromUid
outcomeSeenByUid
outcomeSeenAtByFromUid
outcomeSeenMarkerByFromUid
```

- Obiettivo: se una notifica esito viene letta da smartphone, non deve riapparire da desktop.
- Se le rules non sono state pubblicate, il sito puo' usare ancora `localStorage` come fallback locale.

### Svincola Giocatori

**Versione:** V261

Nuova sottosezione in **Dashboard Presidente** accanto a:

```text
Invia comunicato squadra
Comunicato avvenuto scambio
```

Funzioni:

- Il presidente seleziona uno o piu' giocatori dalla propria rosa.
- Il sistema genera automaticamente una mail indirizzata a:

```text
caparrotti86@yahoo.it
```

- Oggetto email:

```text
<Nome Squadra> - Svincolo giocatori - <Data odierna>
```

- Corpo email standard:

```text
Presidente Caparrotti, con la presente comunico i giocatori che intendo svincolare:
```

- I giocatori selezionati vengono allegati in forma di lista, con tra parentesi l'ultima quotazione attuale recuperata dal listone piu' recente disponibile.
- La mail indica il listone/listoni da cui sono state recuperate le quotazioni.
- Chiusura:

```text
Cordiali Saluti
<nome presidente>
```

- Il flusso invia email tramite EmailJS.
- Non crea richieste in `teamRequests`.
- Non scrive su Firebase.
- Diagnostica runtime:

```js
window.ZonaOrientalePlayerReleaseV261
window.ZonaOrientalePlayerReleaseV261.buildDraft()
```

---

## Admin

### Firebase Rules notifiche trattative

**Versione:** V257

Sono stati aggiunti i file rules:

```text
docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules
docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules
```

Funzione:

- consentire la lettura multi-dispositivo degli esiti trattativa;
- limitare l'update del presidente mittente ai soli campi `outcomeSeen...`;
- non concedere permessi generici sulla modifica delle trattative.

Nota operativa:

- le rules non vengono applicate automaticamente da Netlify;
- vanno pubblicate da Firebase Console o Firebase CLI.

### Richieste presidenti e comunicati

**Versioni precedenti consolidate nel ramo, richiamate fino a V256**

Il flusso aggiornato prevede:

- aggiornamento richieste da Firebase;
- gestione comunicati squadra;
- gestione comunicati avvenuto scambio;
- eliminazione da Firebase dei comunicati approvati/rifiutati nel registro `teamRequests`;
- la cancellazione da `teamRequests` non elimina una eventuale news gia' pubblicata.

### Generatore comunicati automatici

**Versione precedente consolidata nel ramo, richiamata fino a V256**

Il generatore comunicati Admin e' stato ripristinato e resta non distruttivo:

- genera bozze;
- copia testo;
- inserisce la bozza nel form Comunicati;
- non scrive direttamente su Firebase.

---

## Sviluppo, test e manutenzione

### Handoff nuovo branch

**Versione:** V258

Sono stati aggiunti documenti di handoff per eventuale cambio assistente:

```text
docs/zonaorientale/ISTRUZIONI_NUOVO_ASSISTENTE_260528.md
docs/zonaorientale/PROSSIME_ATTIVITA_260528.md
```

Contengono:

- contesto progetto;
- branch consigliato;
- file da passare a un nuovo assistente;
- regole operative;
- backlog tecnico e funzionale.

### Audit codice

**Versione:** V262

Aggiunto documento:

```text
docs/zonaorientale/AUDIT_CODICE_260528_V262.md
```

Contiene:

- stato tecnico post-V261;
- file duplicati o candidati alla pulizia;
- asset legacy da non eliminare senza audit;
- proposta di pulizie/refactor successive.

### Simulatore trattative

**Versioni:** V254-V255, documentato fino a V256

API disponibile in console browser:

```js
window.ZonaOrientaleTradeSimulatorV255
```

Comando smoke test rapido:

```js
await ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()
```

Il simulatore serve a verificare badge, card inviate/ricevute ed esiti senza dover coinvolgere due account reali.

---

## Funzionalita' non perse secondo audit statico

Alla creazione di questo file non risultano funzionalita' tracciate come perse nelle aree toccate dal ramo V256-V262.

Risultano ancora collegate o preservate:

- comunicato avvenuto scambio;
- invio EmailJS comunicato scambio;
- richiesta Admin per comunicato scambio;
- Admin -> Richieste presidenti;
- generatore comunicati automatici;
- workflow pubblicazione Admin inline;
- simulatore trattative V255;
- anteprima news via `/zonaorientale/share/news/<id>`;
- home con anteprima generica;
- Svincola Giocatori.

## Candidati a ulteriore verifica

Non eliminare senza audit mirato:

```text
assets/js/refactor/admin-publication-workflow-v213.js
assets/js/domain/competitions.js
news.html
comunicati/*.html
tools/generate-news-share-pages.mjs
```

Candidati a pulizia controllata:

```text
assets/js/dev/trade-notification-simulator-v254.js
assets/js/trade-notification-simulator-v255.js
assets/css/mobile-hotfix-v166.css
assets/css/mobile-hotfix-v167.css
.DS_Store
__MACOSX
```
````

---

## 5. `funzionalita/FUNZIONALITA'V263-270.md`

- Percorso originale: `funzionalita/FUNZIONALITA'V263-270.md`
- Dimensione originale: 7961 byte
- SHA-256: `a227fdfd0775ec6fa0e274e44ef1d9a4ad52c3065fd50c098ae3b08379aad718`

```markdown
# FUNZIONALITA' V263-270

Documento di tracciamento delle funzionalita' introdotte, corrette o consolidate tra V263 e V270.

Questo file non sostituisce `FUNZIONALITA'.md`: serve come registro incrementale del branch `refactor/260528-zonaorientale-next`.

Data: 30/05/2026  
Versione di riferimento: V271 funzionalita V263-270

---

## Principio operativo

Durante le modifiche V263-V270 non risultano funzionalita' rimosse intenzionalmente dal registro principale. Le modifiche sono state orientate a:

- migliorare UX e manutenzione;
- rendere piu' robusto il convertitore listone;
- tracciare differenze tra listoni;
- mantenere compatibilita' con vecchi formati e vecchi link;
- evitare rimozioni di moduli sospetti senza audit.

`docs/zonaorientale/FUNZIONALITA'.md` resta il registro principale e va modificato solo su richiesta esplicita.

---

## V263 - Documentazione funzionalita V256-V262

### Documentazione

- Aggiunto registro incrementale `FUNZIONALITA'V256-262.md`.
- Tracciate le funzioni introdotte da V256 a V262, tra cui:
  - rules Firebase notifiche trattative;
  - handoff nuovo branch;
  - preview home generica;
  - rimozione tasto `Apri preview`;
  - funzione presidente `Svincola Giocatori`;
  - audit codice e pulizie.

### Impatto funzionale

- Nessuna modifica funzionale diretta.
- Riduzione del rischio di perdere memoria sulle funzioni aggiunte.

---

## V264 - Accesso riservato pulito

### Pubblico / Accesso riservato

- Rimosso il campo `Nome visualizzato` dal form di accesso/registrazione.
- Il nome del presidente resta gestito dall'admin tramite pannello amministrativo.
- Aggiunto il logo Google nel pulsante `Accedi con Google`.

### Motivazione

Il campo `Nome visualizzato` poteva confondere gli utenti perche' il nome effettivo viene assegnato e normalizzato dall'admin.

### Funzioni preservate

- Login email/password.
- Login Google.
- Creazione richiesta utente/presidente.
- Flusso approvazione admin.

---

## V265 - Pulizia asset sicuri

### Manutenzione

- Tracciata la pulizia di asset duplicati o non piu' usati.
- Aggiunto/aggiornato `.gitignore` in `static/zonaorientale` per evitare file macOS.
- Documentata la posizione canonica del simulatore trattative V255.

### File candidati/rimossi nel branch

- `assets/js/trade-notification-simulator-v255.js` duplicato non canonico.
- `assets/js/dev/trade-notification-simulator-v254.js` superato da V255.
- `assets/css/mobile-hotfix-v166.css` e `mobile-hotfix-v167.css` se non linkati dagli HTML.
- `.DS_Store`, `__MACOSX`, `._*`.

### Funzioni preservate

- Simulatore trattative V255 nella posizione canonica:
  - `assets/js/dev/trade-notification-simulator-v255.js`.
- Alias V254 esposto dal simulatore V255.
- Layout mobile tramite CSS ancora linkati.

---

## V266 - Email deliverability

### Presidente / Comunicati operativi via EmailJS

Sono stati migliorati i parametri e i testi delle email operative inviate tramite EmailJS.

Flussi interessati:

- `Comunicato avvenuto scambio`.
- `Svincola Giocatori`.

### Migliorie

- Mittente logico piu' coerente: `Lega ZonaOrientale Salerno`.
- `reply_to` impostato, quando possibile, sull'email dell'utente loggato.
- Oggetti email piu' sobri.
- Firma standard del gestionale.
- Documentazione specifica in `EMAIL_DELIVERABILITY_EMAILJS_V266.md`.

### Nota operativa

La deliverability dipende comunque dal servizio collegato a EmailJS e dalla configurazione DNS del dominio mittente: SPF, DKIM e DMARC.

---

## V267 - Audit competizioni e handoff

### Pubblico / Competizioni

Nessuna modifica funzionale diretta alla sezione Competizioni. E' stato aggiunto un audit per evitare rimozioni rischiose.

Aree tutelate:

- Sezione pubblica `Competizioni`.
- `competition.html`.
- Calendari.
- Risultati.
- Classifiche.
- Archivio competizioni.
- Admin -> Competizioni.
- Collegamenti con Albo, statistiche e archivio.

### Moduli attenzionati

- `assets/js/domain/competitions.js` e' considerato sospetto/legacy ma non va rimosso senza ulteriore audit.

### Handoff

- Aggiornata la guida per un nuovo assistente AI.
- Ribadito di non rimuovere funzionalita' senza confronto con i documenti funzionali.

---

## V268 - Convertitore listone flessibile

### Admin / Converti listone Excel

Il convertitore listone Excel supporta due formati:

1. formato storico con fogli `Tutti` e `Ceduti`;
2. formato Classic a foglio singolo, per esempio `Lista calciatori`.

### Nuovo formato supportato

Colonne riconosciute nel file Classic:

- `#` -> id Fantacalcio;
- `Nome` -> nome giocatore;
- `Fuori lista` -> stato/listone;
- `Sq.` -> squadra reale;
- `R.` -> ruolo Classic;
- `R.MANTRA` -> ruoli Mantra;
- `FVM/1000` -> FVM;
- `QUOT.` -> quotazione attuale;
- `FantaSquadra` -> squadra fantasy proprietaria, se presente;
- `Costo` -> costo rosa, se presente.

### Funzioni preservate

- Compatibilita' con vecchi file Excel.
- Generazione JSON listone.
- Manifest/listoni statici.

---

## V269 - Storico e confronto listoni

### Pubblico / Listone

Aggiunto il pannello `Storico listoni`.

Il sistema confronta il listone selezionato con listoni precedenti della stessa stagione e calcola:

- nuovi giocatori;
- giocatori usciti;
- variazioni quotazione;
- variazioni stato;
- variazioni squadra reale;
- variazioni ruolo.

### Ricerca storica

Aggiunta la possibilita' di cercare un giocatore anche in listoni diversi da quello selezionato.

Questo copre il caso:

- giocatore non presente nel listone corrente;
- giocatore presente in un listone precedente.

### Admin / Convertitore listone

Il JSON generato puo' essere arricchito con informazioni di confronto quando un listone precedente e' disponibile.

---

## V270 - Modifica listone visibile

### Pubblico / Listone

Aggiunta la colonna opzionale `Modifica` tra i campi visibili.

La colonna puo' mostrare:

- `Nuovo`;
- `Uscito`;
- `+N` o `-N` per variazioni di quotazione;
- `Stato`;
- `Squadra`;
- `Ruolo`;
- `Piu' variazioni`;
- `Invariato`.

### Usciti storici

Aggiunto il filtro `Mostra usciti storici`.

Quando attivo, la tabella mostra anche giocatori non piu' presenti nel listone selezionato ma trovati in listoni precedenti della stagione.

Per questi giocatori viene indicato l'ultimo listone che li conteneva.

### Funzioni preservate

- Filtri ruolo/stato.
- Ricerca listone corrente.
- Ricerca storica V269.
- Campi visibili configurabili.
- Compatibilita' con listoni gia' pubblicati.

---

## Controlli da fare dopo V270/V271

### Listone

- Aprire sezione `Listone`.
- Aprire `Campi visibili` e abilitare `Modifica`.
- Attivare/disattivare `Mostra usciti storici`.
- Cercare un giocatore presente nel listone corrente.
- Cercare un giocatore presente solo in listoni precedenti.
- Verificare `Uscito` e ultimo listone.

### Admin

- Aprire `Admin -> Converti listone Excel`.
- Caricare formato storico, se disponibile.
- Caricare formato Classic `Lista calciatori`.
- Verificare che il numero giocatori sia maggiore di 0.
- Scaricare JSON e verificare meta/storico quando possibile.

### Accesso

- Aprire `Accesso Riservato`.
- Verificare assenza del campo `Nome visualizzato`.
- Verificare logo Google nel pulsante.

### Email

- Testare `Comunicato avvenuto scambio`.
- Testare `Svincola Giocatori`.
- Verificare oggetto, firma e destinatario.

---

## Funzionalita' da non eliminare senza audit

- `domain/competitions.js`.
- `admin-publication-workflow-v213.js`.
- `news.html` e `comunicati/*.html`, per compatibilita' link storici.
- fallback inline Admin Richieste presidenti V249/V253 finche' il modulo resta stabile.
- codice legacy comunicato scambio V50/V79 gia' neutralizzato, ma da rimuovere solo con test EmailJS/Admin.

---

## Stato finale V271

Non risultano funzionalita' perse rispetto ai registri funzionali esistenti. Le modifiche V263-V270 aggiungono o consolidano funzioni, soprattutto in:

- Accesso riservato;
- Email operative;
- Listone e storico listoni;
- Audit competizioni;
- Documentazione e handoff.
```

---

## 6. `funzionalita/FUNZIONALITA'V271-274.md`

- Percorso originale: `funzionalita/FUNZIONALITA'V271-274.md`
- Dimensione originale: 6142 byte
- SHA-256: `8b35f60e46a50d57d0b954c11764791dd91fa7ba22ed109c5a82310bca7ee869`

```markdown
# FUNZIONALITA' V271-V274 - ZonaOrientale

Documento aggiuntivo al registro funzionale principale. Non sostituisce `FUNZIONALITA'.md` e non deve essere usato per cancellare funzionalita esistenti.

Periodo coperto: V271, V272, V273, V274.
Versione di riferimento: V275 funzionalita V271-274.
Branch di lavoro: `refactor/260528-zonaorientale-next`.

## Regola di manutenzione

- `FUNZIONALITA'.md` resta il registro storico principale e va modificato solo su richiesta esplicita.
- Questo file registra le modifiche recenti e deve essere consultato prima di refactor, pulizie o merge.
- Prima di rimuovere codice legacy, verificare che la funzionalita non sia citata qui, nei file `FUNZIONALITA'V240-255.md`, `FUNZIONALITA'V256-262.md`, `FUNZIONALITA'V263-270.md` o in `REGRESSION_TESTS.md`.

## Pubblico

### Listone

Funzionalita consolidate tra V271 e V274:

- La colonna opzionale `Modifica`, introdotta in V270, resta parte del Listone.
- La colonna `Modifica` puo indicare: `Nuovo`, `Uscito`, variazione quotazione `+N`/`-N`, cambio stato, cambio squadra, cambio ruolo o piu variazioni.
- I giocatori usciti dal listone corrente ma presenti in listoni precedenti possono essere mostrati come righe storiche.
- Le righe storiche indicano l'ultimo listone in cui il giocatore era presente.
- La ricerca puo includere anche altri listoni, non solo quello selezionato.
- Il confronto storico non deve generare falsi cambi squadra per differenze tra sigle e nomi estesi.

### Codici squadra nel Listone

Da V274 il sistema accetta sia sigle sia nomi estesi in input, ma visualizza e usa internamente il codice canonico a tre lettere.

Esempi:

- `Atalanta` -> `ATA`
- `Bologna` -> `BOL`
- `Inter` -> `INT`
- `Milan` -> `MIL`
- `Hellas Verona` -> `VER`

Regole:

- Il valore visualizzato nella tabella deve essere il codice canonico.
- Il valore originale proveniente dall'Excel puo essere conservato come metadato, ad esempio `realTeamOriginal`.
- La ricerca deve continuare a funzionare sia con sigla sia con nome esteso.
- Il confronto storico deve usare il valore canonico, non il testo grezzo dell'Excel.

## Presidente

Nessuna nuova funzionalita presidente e' stata introdotta tra V271 e V274. Restano valide le funzionalita precedenti:

- Dashboard Presidente.
- Comunicati squadra.
- Comunicati avvenuto scambio con EmailJS e richiesta Admin.
- Svincola Giocatori con invio EmailJS.
- Trattative inviate/ricevute e notifiche.
- Lettura esiti trattative sincronizzata con Firebase quando le rules V257 sono pubblicate.

## Admin

### Converti listone Excel

Funzionalita consolidate:

- Supporto formato storico con fogli `Tutti` e `Ceduti`.
- Supporto formato Classic a foglio singolo, ad esempio `Lista calciatori`.
- Mappatura colonne Classic:
  - `#` -> identificativo Fantacalcio
  - `Nome` -> nome giocatore
  - `Sq.` -> squadra reale, normalizzata a codice canonico
  - `R.` -> ruolo classic
  - `R.MANTRA` -> ruoli mantra
  - `QUOT.` -> quotazione attuale
  - `FVM/1000` -> FVM
  - `FantaSquadra` -> rosa/squadra fantasy se presente
  - `Costo` -> costo rosa se presente
  - `Fuori lista` -> stato in listone / asteriscato
- Report conversione con numero giocatori, formato riconosciuto, fogli usati e statistiche di stato.
- Confronto automatico con il listone precedente quando disponibile.
- Normalizzazione stabile dei codici squadra per evitare falsi cambi squadra.

### Test reale V273

Il test con il file Excel reale `lista_calciatori_lista calciatori_classic_zonaorientale-salerno.xlsx` ha prodotto:

- Formato riconosciuto: Fantacalcio Classic a foglio singolo.
- Foglio usato: `Lista calciatori`.
- Giocatori convertibili: 663.
- Giocatori in listone: 532.
- Giocatori asteriscati: 131.
- Giocatori con quotazione valida: 663.
- Giocatori con FantaSquadra valorizzata: 299.
- Confronto con listone precedente `2026-05-15`:
  - giocatori comuni: 661;
  - nuovi giocatori: 2;
  - giocatori usciti: 0;
  - quotazioni aumentate: 96;
  - quotazioni diminuite: 120;
  - quotazioni invariate: 445;
  - cambi ruolo: 0;
  - cambi squadra reali dopo normalizzazione: 0;
  - cambi stato: 1.

Nuovi giocatori rilevati nel test:

- Mikolajewski - Parma - Qt.A 2.
- Mosconi - Inter - Qt.A 1.

## Sviluppo, test e manutenzione

### Handoff e documentazione

V272 ha riorganizzato la documentazione di handoff e pre-merge in cartelle:

- `docs/zonaorientale/handoff/`
- `docs/zonaorientale/audit/`
- `docs/zonaorientale/pianificazione/`
- `docs/zonaorientale/release/`
- `docs/zonaorientale/listoni/`

V275 aggiunge questo registro funzionale per V271-V274.

### Diagnostiche runtime rilevanti

- `window.ZonaOrientaleFunctionLedgerV271`
- `window.ZonaOrientalePreMergeAuditV272`
- `window.ZonaOrientaleListoneE2ETestV273`
- `window.ZonaOrientaleListoneTeamCodesV274`
- `window.ZonaOrientaleFunctionLedgerV275`

### Test da ripetere dopo modifiche al Listone

1. Aprire `Admin -> Converti listone Excel`.
2. Caricare un Excel Classic a foglio singolo.
3. Verificare che il conteggio giocatori sia maggiore di zero.
4. Verificare che le squadre siano salvate/mostrate con codice canonico a tre lettere.
5. Aprire la sezione pubblica `Listone`.
6. Abilitare la colonna `Modifica` nei campi visibili.
7. Verificare assenza di falsi cambi squadra di massa.
8. Cercare un giocatore presente in altri listoni.
9. Verificare la sezione storica e gli eventuali usciti.

## Funzionalita da non perdere

Non rimuovere senza test mirato:

- `assets/js/admin/listone-converter.js`.
- La colonna `Modifica` del Listone.
- Il filtro/controllo `Mostra usciti storici`.
- La ricerca storica negli altri listoni.
- La normalizzazione codici squadra V274.
- I documenti `docs/zonaorientale/listoni/LISTONE_TEST_REALE_V273.md` e `docs/zonaorientale/listoni/LISTONE_CODICI_SQUADRA_V274.md`.

## Prossime verifiche consigliate

- Verificare un secondo Excel reale futuro per confermare che la normalizzazione squadra resta corretta.
- Verificare eventuali omonimie tra giocatori usando identificativo Fantacalcio `#` come chiave primaria.
- Decidere se portare queste informazioni nel file principale `FUNZIONALITA'.md` quando richiesto esplicitamente.
```

---

## 7. `funzionalita/FUNZIONALITA_INCREMENTALI_V240-274.md`

- Percorso originale: `funzionalita/FUNZIONALITA_INCREMENTALI_V240-274.md`
- Dimensione originale: 28949 byte
- SHA-256: `7a5934cb1e36e2bcddb2d3a888961d8a004f10f6c25d2ca7b227656e3f03fa29`

````markdown
# FUNZIONALITA' INCREMENTALI V240-V274 - ZonaOrientale Salerno

Documento unico accorpato dai registri incrementali V240-255, V256-262, V263-270 e V271-274.

Questo file non sostituisce `FUNZIONALITA'.md`, che resta il registro funzionale principale e protetto. Serve come registro unico delle funzionalita', correzioni, consolidamenti, refactor e note operative introdotte tra V240 e V274.

## Regola di manutenzione

- `FUNZIONALITA'.md` resta il documento principale e va modificato solo su richiesta esplicita.
- Questo file va aggiornato quando si vogliono accorpare i registri incrementali recenti.
- Prima di rimuovere codice legacy, verificare che la funzionalita' non sia citata qui, in `REGRESSION_TESTS.md` o nell'handoff corrente.
- Le modifiche qui riportate sono additive, di consolidamento o di manutenzione: non risultano funzionalita' rimosse intenzionalmente nei blocchi coperti.

## Indice

- [Blocco V240-255](#blocco-v240-255)
- [Blocco V256-262](#blocco-v256-262)
- [Blocco V263-270](#blocco-v263-270)
- [Blocco V271-274](#blocco-v271-274)

---

# Blocco V240-255

Fonte originale: `FUNZIONALITA'V240-255.md`

Documento incrementale creato in V256.

Questo file riepiloga le funzionalita introdotte, ripristinate o consolidate tra V240 e V255. Non sostituisce `FUNZIONALITA'.md`, che resta il registro funzionale principale e deve essere aggiornato solo su richiesta esplicita.

## 1. Pubblico

### News e comunicati

- Mantenuto il flusso pubblico dei comunicati nella sezione News.
- Consolidato il supporto ai comunicati generati da richieste presidente approvate dall'Admin.
- Confermata la compatibilita' con preview/condivisione comunicati gia' presente nel sito.

### Navigazione, cache e versione

- Aggiornati progressivamente footer, cache-buster e diagnostica di deploy per tutte le versioni V240-V255.
- Preservati i percorsi pubblici principali: Dashboard, News, Rose, Fantamercato, Listone, Competizioni, Albo, Statistiche, Archivio, Confronta, Regolamento.

## 2. Presidente

### Dashboard Presidente

- Le trattative vengono rilette in modo piu' coerente quando si entra nella Dashboard Presidente e nella sottosezione Trattative.
- Il badge rosso con punto esclamativo segnala proposte ricevute ancora in attesa.
- Il badge destinatario resta visibile finche' la proposta non viene approvata o rifiutata.
- Il badge del mittente segnala l'esito di una proposta inviata approvata/rifiutata.
- La lettura dell'esito viene salvata su Firebase quando consentito dalle regole, con fallback locale.

### Trattative

- Ripristinata la visibilita' dello storico delle trattative inviate e ricevute.
- Le ultime 5 trattative sono visibili subito; le altre restano consultabili tramite scorrimento nel riquadro.
- Ogni card trattativa mantiene proposta ed esito.
- La notifica mittente sparisce solo dopo apertura/lettura della card relativa all'esito.

### Comunicati presidente

- Consolidato il flusso canonico `Comunicato avvenuto scambio`.
- Il comunicato avvenuto scambio non scrive piu' direttamente in `news` dal profilo presidente.
- Il flusso corretto e': presidente -> `teamRequests` con `TRANSFER_NEWS` -> invio EmailJS -> approvazione Admin -> pubblicazione News.
- Neutralizzati i vecchi handler legacy V50/V79/V237 che potevano agganciarsi al form storico.
- La mail EmailJS dell'avvenuto scambio resta inviata subito a `caparrotti86@yahoo.it`.

### Test presidente/trattative

- Aggiunto il simulatore notifiche trattative da console browser.
- API corrente: `window.ZonaOrientaleTradeSimulatorV255`.
- Alias compatibile: `window.ZonaOrientaleTradeSimulatorV254`.
- Comando rapido consigliato: `await ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()`.
- Le simulazioni locali non scrivono su Firebase.
- Il test reale puo' creare una proposta in Firebase con `await ZonaOrientaleTradeSimulatorV255.createFirebaseSentProposal({ confirm: true })`.

## 3. Admin

### Accetta utenti

- Stabilizzato il flusso `Accetta utenti`.
- Gli utenti gia' approvati non vengono piu' rigenerati come richieste `PENDING` al login Google/email.
- Gli utenti rifiutati restano marcati come `REJECTED`, evitando ricomparsa automatica come nuove richieste.
- Il pannello nasconde vecchi duplicati `pendingUsers` quando esiste gia' un utente approvato in `teamUsers`.

### Richieste presidenti

- Consolidato il pannello `Admin -> Richieste presidenti`.
- Aggiunto/normalizzato il pulsante `Aggiorna richieste` per rileggere `teamRequests` da Firebase.
- Le richieste `TRANSFER_NEWS` generate dai comunicati avvenuto scambio sono visibili nel pannello.
- Mantenute azioni di approvazione e rifiuto.
- Aggiunto `Elimina da Firebase` per comunicati rifiutati.
- Esteso `Elimina da Firebase` anche ai comunicati approvati/accepted.
- L'eliminazione cancella il documento da `teamRequests/{id}` ma non cancella eventuali news gia' pubblicate.
- Il pannello e' stato estratto in modulo dedicato: `assets/js/admin/team-requests-panel-v253.js`, con fallback storico ancora presente in `app.js`.

### Comunicati Admin

- Ripristinato il Generatore comunicati automatici.
- Il generatore produce bozze per risultati, vincitori, mercato, focus squadra, albo/palmares e aggiornamenti dati pubblici.
- Il generatore non scrive direttamente su Firebase.
- Azioni disponibili: copia testo e inserisci bozza nel form Comunicati.

### Workflow pubblicazione

- Consolidato il workflow pubblicazione Admin gia' presente inline.
- Mantenuti pannelli `Stato Firebase / JSON` e `Procedura guidata Pubblica aggiornamenti`.
- Aggiornati comandi del wizard, rimuovendo riferimenti a branch storici obsoleti.
- Il vecchio modulo esterno V213 resta da valutare come legacy per eventuale rimozione futura.

## 4. Sviluppo, test e manutenzione

### Checklist regressioni

- Aggiunto `REGRESSION_TESTS.md` come checklist stabile pre-merge/pre-deploy.
- La checklist copre aree pubbliche, presidente, admin, mobile, Firebase, comunicati e trattative.

### Pulizia asset

- Aggiunto `.gitignore` locale per evitare `.DS_Store`, `__MACOSX` e file AppleDouble.
- Identificati come rimovibili i CSS mobile hotfix V166/V167, gia' inglobati in `mobile-suite-v168.css`.

### Refactor progressivo

- Avviata estrazione modulare da `app.js`.
- Primo modulo estratto: `Admin -> Richieste presidenti`.
- Il fallback storico non e' stato rimosso per ridurre il rischio di regressioni.

## 5. Funzionalita rispetto a FUNZIONALITA'.md

Rispetto a `FUNZIONALITA'.md`, il ciclo V240-V255 aggiunge o dettaglia soprattutto:

- aggiornamento e stabilizzazione notifiche trattative presidente;
- lettura esiti trattative sincronizzabile su Firebase;
- simulatore notifiche trattative da console;
- flusso canonico comunicato avvenuto scambio;
- gestione Admin piu' completa delle richieste presidente;
- eliminazione da Firebase delle richieste comunicato approvate/rifiutate;
- generatore comunicati automatici Admin ripristinato;
- checklist regressioni e strumenti di test.

Alla data V256 non risulta volutamente rimossa alcuna funzionalita' gia' tracciata in `FUNZIONALITA'.md`. Le modifiche V240-V255 sono additive o di consolidamento.

## 6. Funzionalita/moduli da verificare ancora

- `assets/js/refactor/admin-publication-workflow-v213.js`: modulo esterno ancora non collegato; il workflow inline e' quello canonico. Candidato a rimozione futura o archiviazione come legacy.
- `assets/js/domain/competitions.js`: modulo domain non importato direttamente da `app.js` nella baseline analizzata; va verificato prima di eventuale rimozione perche' la logica competizioni potrebbe essere duplicata inline.
- `tools/generate-news-share-pages.mjs`, `news.html` e `comunicati/*.html`: strumenti/pagine legacy per share statiche; da mantenere finche' serve compatibilita' con vecchi link, oppure dichiarare legacy.
- `assets/css/mobile-hotfix-v166.css` e `assets/css/mobile-hotfix-v167.css`: candidati a rimozione se gia' rimossi dalla repo o dopo conferma visuale mobile.

---

# Blocco V256-262

Fonte originale: `FUNZIONALITA'V256-262.md`

Documento aggiuntivo creato in **V263** per tracciare le funzionalita' introdotte, consolidate o documentate tra **V256** e **V262**.

Questo file **non sostituisce** `FUNZIONALITA'.md`: e' un registro incrementale del ramo `refactor/260528-zonaorientale-next`.

## Regola di manutenzione

- `FUNZIONALITA'.md` resta il documento principale e va modificato solo su richiesta esplicita.
- Questo file registra le modifiche funzionali e tecniche del blocco V256-V262.
- Prima di merge su `master`, verificare se trasferire alcune voci nel file principale.

---

## Pubblico

### Home e anteprima WhatsApp

**Versioni:** V259, V260

- La home `/zonaorientale/` usa metadati Open Graph generici del sito.
- La condivisione della home non deve mostrare l'ultima news come anteprima.
- Le anteprime specifiche delle news restano limitate ai link news dedicati:

```text
/zonaorientale/share/news/<id>
```

- Il pulsante `Apri preview` non e' piu' mostrato nell'interfaccia news.
- Resta il pulsante `Copia link WhatsApp`.

### Tag tecnici Firebase/JSON

**Versione:** V260

- Sono stati nascosti/rimossi dall'interfaccia utente i badge tecnici `Firebase`, `JSON`, `JSON statico`, `Solo JSON` dove non utili all'utente finale.
- La rimozione e' solo visiva: non modifica il funzionamento dei dati statici, Firebase, snapshot o fallback.

---

## Presidente

### Trattative e notifiche multi-dispositivo

**Versioni:** V257, con predisposizione runtime V246

- Le notifiche trattative continuano a derivare dalla collection Firebase:

```text
transferNegotiations
```

- Per il presidente destinatario, il badge resta visibile finche' una trattativa ricevuta e' `PENDING`.
- Per il presidente mittente, il badge dell'esito resta visibile finche' la card della proposta conclusa non viene aperta.
- Le Firebase Rules V257 consentono al mittente di aggiornare solo i campi di lettura esito:

```text
outcomeSeenByFromUid
outcomeSeenByUid
outcomeSeenAtByFromUid
outcomeSeenMarkerByFromUid
```

- Obiettivo: se una notifica esito viene letta da smartphone, non deve riapparire da desktop.
- Se le rules non sono state pubblicate, il sito puo' usare ancora `localStorage` come fallback locale.

### Svincola Giocatori

**Versione:** V261

Nuova sottosezione in **Dashboard Presidente** accanto a:

```text
Invia comunicato squadra
Comunicato avvenuto scambio
```

Funzioni:

- Il presidente seleziona uno o piu' giocatori dalla propria rosa.
- Il sistema genera automaticamente una mail indirizzata a:

```text
caparrotti86@yahoo.it
```

- Oggetto email:

```text
<Nome Squadra> - Svincolo giocatori - <Data odierna>
```

- Corpo email standard:

```text
Presidente Caparrotti, con la presente comunico i giocatori che intendo svincolare:
```

- I giocatori selezionati vengono allegati in forma di lista, con tra parentesi l'ultima quotazione attuale recuperata dal listone piu' recente disponibile.
- La mail indica il listone/listoni da cui sono state recuperate le quotazioni.
- Chiusura:

```text
Cordiali Saluti
<nome presidente>
```

- Il flusso invia email tramite EmailJS.
- Non crea richieste in `teamRequests`.
- Non scrive su Firebase.
- Diagnostica runtime:

```js
window.ZonaOrientalePlayerReleaseV261
window.ZonaOrientalePlayerReleaseV261.buildDraft()
```

---

## Admin

### Firebase Rules notifiche trattative

**Versione:** V257

Sono stati aggiunti i file rules:

```text
docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules
docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules
```

Funzione:

- consentire la lettura multi-dispositivo degli esiti trattativa;
- limitare l'update del presidente mittente ai soli campi `outcomeSeen...`;
- non concedere permessi generici sulla modifica delle trattative.

Nota operativa:

- le rules non vengono applicate automaticamente da Netlify;
- vanno pubblicate da Firebase Console o Firebase CLI.

### Richieste presidenti e comunicati

**Versioni precedenti consolidate nel ramo, richiamate fino a V256**

Il flusso aggiornato prevede:

- aggiornamento richieste da Firebase;
- gestione comunicati squadra;
- gestione comunicati avvenuto scambio;
- eliminazione da Firebase dei comunicati approvati/rifiutati nel registro `teamRequests`;
- la cancellazione da `teamRequests` non elimina una eventuale news gia' pubblicata.

### Generatore comunicati automatici

**Versione precedente consolidata nel ramo, richiamata fino a V256**

Il generatore comunicati Admin e' stato ripristinato e resta non distruttivo:

- genera bozze;
- copia testo;
- inserisce la bozza nel form Comunicati;
- non scrive direttamente su Firebase.

---

## Sviluppo, test e manutenzione

### Handoff nuovo branch

**Versione:** V258

Sono stati aggiunti documenti di handoff per eventuale cambio assistente:

```text
docs/zonaorientale/ISTRUZIONI_NUOVO_ASSISTENTE_260528.md
docs/zonaorientale/PROSSIME_ATTIVITA_260528.md
```

Contengono:

- contesto progetto;
- branch consigliato;
- file da passare a un nuovo assistente;
- regole operative;
- backlog tecnico e funzionale.

### Audit codice

**Versione:** V262

Aggiunto documento:

```text
docs/zonaorientale/AUDIT_CODICE_260528_V262.md
```

Contiene:

- stato tecnico post-V261;
- file duplicati o candidati alla pulizia;
- asset legacy da non eliminare senza audit;
- proposta di pulizie/refactor successive.

### Simulatore trattative

**Versioni:** V254-V255, documentato fino a V256

API disponibile in console browser:

```js
window.ZonaOrientaleTradeSimulatorV255
```

Comando smoke test rapido:

```js
await ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()
```

Il simulatore serve a verificare badge, card inviate/ricevute ed esiti senza dover coinvolgere due account reali.

---

## Funzionalita' non perse secondo audit statico

Alla creazione di questo file non risultano funzionalita' tracciate come perse nelle aree toccate dal ramo V256-V262.

Risultano ancora collegate o preservate:

- comunicato avvenuto scambio;
- invio EmailJS comunicato scambio;
- richiesta Admin per comunicato scambio;
- Admin -> Richieste presidenti;
- generatore comunicati automatici;
- workflow pubblicazione Admin inline;
- simulatore trattative V255;
- anteprima news via `/zonaorientale/share/news/<id>`;
- home con anteprima generica;
- Svincola Giocatori.

## Candidati a ulteriore verifica

Non eliminare senza audit mirato:

```text
assets/js/refactor/admin-publication-workflow-v213.js
assets/js/domain/competitions.js
news.html
comunicati/*.html
tools/generate-news-share-pages.mjs
```

Candidati a pulizia controllata:

```text
assets/js/dev/trade-notification-simulator-v254.js
assets/js/trade-notification-simulator-v255.js
assets/css/mobile-hotfix-v166.css
assets/css/mobile-hotfix-v167.css
.DS_Store
__MACOSX
```

---

# Blocco V263-270

Fonte originale: `FUNZIONALITA'V263-270.md`

Documento di tracciamento delle funzionalita' introdotte, corrette o consolidate tra V263 e V270.

Questo file non sostituisce `FUNZIONALITA'.md`: serve come registro incrementale del branch `refactor/260528-zonaorientale-next`.

Data: 30/05/2026  
Versione di riferimento: V271 funzionalita V263-270

---

## Principio operativo

Durante le modifiche V263-V270 non risultano funzionalita' rimosse intenzionalmente dal registro principale. Le modifiche sono state orientate a:

- migliorare UX e manutenzione;
- rendere piu' robusto il convertitore listone;
- tracciare differenze tra listoni;
- mantenere compatibilita' con vecchi formati e vecchi link;
- evitare rimozioni di moduli sospetti senza audit.

`docs/zonaorientale/FUNZIONALITA'.md` resta il registro principale e va modificato solo su richiesta esplicita.

---

## V263 - Documentazione funzionalita V256-V262

### Documentazione

- Aggiunto registro incrementale `FUNZIONALITA'V256-262.md`.
- Tracciate le funzioni introdotte da V256 a V262, tra cui:
  - rules Firebase notifiche trattative;
  - handoff nuovo branch;
  - preview home generica;
  - rimozione tasto `Apri preview`;
  - funzione presidente `Svincola Giocatori`;
  - audit codice e pulizie.

### Impatto funzionale

- Nessuna modifica funzionale diretta.
- Riduzione del rischio di perdere memoria sulle funzioni aggiunte.

---

## V264 - Accesso riservato pulito

### Pubblico / Accesso riservato

- Rimosso il campo `Nome visualizzato` dal form di accesso/registrazione.
- Il nome del presidente resta gestito dall'admin tramite pannello amministrativo.
- Aggiunto il logo Google nel pulsante `Accedi con Google`.

### Motivazione

Il campo `Nome visualizzato` poteva confondere gli utenti perche' il nome effettivo viene assegnato e normalizzato dall'admin.

### Funzioni preservate

- Login email/password.
- Login Google.
- Creazione richiesta utente/presidente.
- Flusso approvazione admin.

---

## V265 - Pulizia asset sicuri

### Manutenzione

- Tracciata la pulizia di asset duplicati o non piu' usati.
- Aggiunto/aggiornato `.gitignore` in `static/zonaorientale` per evitare file macOS.
- Documentata la posizione canonica del simulatore trattative V255.

### File candidati/rimossi nel branch

- `assets/js/trade-notification-simulator-v255.js` duplicato non canonico.
- `assets/js/dev/trade-notification-simulator-v254.js` superato da V255.
- `assets/css/mobile-hotfix-v166.css` e `mobile-hotfix-v167.css` se non linkati dagli HTML.
- `.DS_Store`, `__MACOSX`, `._*`.

### Funzioni preservate

- Simulatore trattative V255 nella posizione canonica:
  - `assets/js/dev/trade-notification-simulator-v255.js`.
- Alias V254 esposto dal simulatore V255.
- Layout mobile tramite CSS ancora linkati.

---

## V266 - Email deliverability

### Presidente / Comunicati operativi via EmailJS

Sono stati migliorati i parametri e i testi delle email operative inviate tramite EmailJS.

Flussi interessati:

- `Comunicato avvenuto scambio`.
- `Svincola Giocatori`.

### Migliorie

- Mittente logico piu' coerente: `Lega ZonaOrientale Salerno`.
- `reply_to` impostato, quando possibile, sull'email dell'utente loggato.
- Oggetti email piu' sobri.
- Firma standard del gestionale.
- Documentazione specifica in `EMAIL_DELIVERABILITY_EMAILJS_V266.md`.

### Nota operativa

La deliverability dipende comunque dal servizio collegato a EmailJS e dalla configurazione DNS del dominio mittente: SPF, DKIM e DMARC.

---

## V267 - Audit competizioni e handoff

### Pubblico / Competizioni

Nessuna modifica funzionale diretta alla sezione Competizioni. E' stato aggiunto un audit per evitare rimozioni rischiose.

Aree tutelate:

- Sezione pubblica `Competizioni`.
- `competition.html`.
- Calendari.
- Risultati.
- Classifiche.
- Archivio competizioni.
- Admin -> Competizioni.
- Collegamenti con Albo, statistiche e archivio.

### Moduli attenzionati

- `assets/js/domain/competitions.js` e' considerato sospetto/legacy ma non va rimosso senza ulteriore audit.

### Handoff

- Aggiornata la guida per un nuovo assistente AI.
- Ribadito di non rimuovere funzionalita' senza confronto con i documenti funzionali.

---

## V268 - Convertitore listone flessibile

### Admin / Converti listone Excel

Il convertitore listone Excel supporta due formati:

1. formato storico con fogli `Tutti` e `Ceduti`;
2. formato Classic a foglio singolo, per esempio `Lista calciatori`.

### Nuovo formato supportato

Colonne riconosciute nel file Classic:

- `#` -> id Fantacalcio;
- `Nome` -> nome giocatore;
- `Fuori lista` -> stato/listone;
- `Sq.` -> squadra reale;
- `R.` -> ruolo Classic;
- `R.MANTRA` -> ruoli Mantra;
- `FVM/1000` -> FVM;
- `QUOT.` -> quotazione attuale;
- `FantaSquadra` -> squadra fantasy proprietaria, se presente;
- `Costo` -> costo rosa, se presente.

### Funzioni preservate

- Compatibilita' con vecchi file Excel.
- Generazione JSON listone.
- Manifest/listoni statici.

---

## V269 - Storico e confronto listoni

### Pubblico / Listone

Aggiunto il pannello `Storico listoni`.

Il sistema confronta il listone selezionato con listoni precedenti della stessa stagione e calcola:

- nuovi giocatori;
- giocatori usciti;
- variazioni quotazione;
- variazioni stato;
- variazioni squadra reale;
- variazioni ruolo.

### Ricerca storica

Aggiunta la possibilita' di cercare un giocatore anche in listoni diversi da quello selezionato.

Questo copre il caso:

- giocatore non presente nel listone corrente;
- giocatore presente in un listone precedente.

### Admin / Convertitore listone

Il JSON generato puo' essere arricchito con informazioni di confronto quando un listone precedente e' disponibile.

---

## V270 - Modifica listone visibile

### Pubblico / Listone

Aggiunta la colonna opzionale `Modifica` tra i campi visibili.

La colonna puo' mostrare:

- `Nuovo`;
- `Uscito`;
- `+N` o `-N` per variazioni di quotazione;
- `Stato`;
- `Squadra`;
- `Ruolo`;
- `Piu' variazioni`;
- `Invariato`.

### Usciti storici

Aggiunto il filtro `Mostra usciti storici`.

Quando attivo, la tabella mostra anche giocatori non piu' presenti nel listone selezionato ma trovati in listoni precedenti della stagione.

Per questi giocatori viene indicato l'ultimo listone che li conteneva.

### Funzioni preservate

- Filtri ruolo/stato.
- Ricerca listone corrente.
- Ricerca storica V269.
- Campi visibili configurabili.
- Compatibilita' con listoni gia' pubblicati.

---

## Controlli da fare dopo V270/V271

### Listone

- Aprire sezione `Listone`.
- Aprire `Campi visibili` e abilitare `Modifica`.
- Attivare/disattivare `Mostra usciti storici`.
- Cercare un giocatore presente nel listone corrente.
- Cercare un giocatore presente solo in listoni precedenti.
- Verificare `Uscito` e ultimo listone.

### Admin

- Aprire `Admin -> Converti listone Excel`.
- Caricare formato storico, se disponibile.
- Caricare formato Classic `Lista calciatori`.
- Verificare che il numero giocatori sia maggiore di 0.
- Scaricare JSON e verificare meta/storico quando possibile.

### Accesso

- Aprire `Accesso Riservato`.
- Verificare assenza del campo `Nome visualizzato`.
- Verificare logo Google nel pulsante.

### Email

- Testare `Comunicato avvenuto scambio`.
- Testare `Svincola Giocatori`.
- Verificare oggetto, firma e destinatario.

---

## Funzionalita' da non eliminare senza audit

- `domain/competitions.js`.
- `admin-publication-workflow-v213.js`.
- `news.html` e `comunicati/*.html`, per compatibilita' link storici.
- fallback inline Admin Richieste presidenti V249/V253 finche' il modulo resta stabile.
- codice legacy comunicato scambio V50/V79 gia' neutralizzato, ma da rimuovere solo con test EmailJS/Admin.

---

## Stato finale V271

Non risultano funzionalita' perse rispetto ai registri funzionali esistenti. Le modifiche V263-V270 aggiungono o consolidano funzioni, soprattutto in:

- Accesso riservato;
- Email operative;
- Listone e storico listoni;
- Audit competizioni;
- Documentazione e handoff.

---

# Blocco V271-274

Fonte originale: `FUNZIONALITA'V271-274.md`

Documento aggiuntivo al registro funzionale principale. Non sostituisce `FUNZIONALITA'.md` e non deve essere usato per cancellare funzionalita esistenti.

Periodo coperto: V271, V272, V273, V274.
Versione di riferimento: V275 funzionalita V271-274.
Branch di lavoro: `refactor/260528-zonaorientale-next`.

## Regola di manutenzione

- `FUNZIONALITA'.md` resta il registro storico principale e va modificato solo su richiesta esplicita.
- Questo file registra le modifiche recenti e deve essere consultato prima di refactor, pulizie o merge.
- Prima di rimuovere codice legacy, verificare che la funzionalita non sia citata qui, nei file `FUNZIONALITA'V240-255.md`, `FUNZIONALITA'V256-262.md`, `FUNZIONALITA'V263-270.md` o in `REGRESSION_TESTS.md`.

## Pubblico

### Listone

Funzionalita consolidate tra V271 e V274:

- La colonna opzionale `Modifica`, introdotta in V270, resta parte del Listone.
- La colonna `Modifica` puo indicare: `Nuovo`, `Uscito`, variazione quotazione `+N`/`-N`, cambio stato, cambio squadra, cambio ruolo o piu variazioni.
- I giocatori usciti dal listone corrente ma presenti in listoni precedenti possono essere mostrati come righe storiche.
- Le righe storiche indicano l'ultimo listone in cui il giocatore era presente.
- La ricerca puo includere anche altri listoni, non solo quello selezionato.
- Il confronto storico non deve generare falsi cambi squadra per differenze tra sigle e nomi estesi.

### Codici squadra nel Listone

Da V274 il sistema accetta sia sigle sia nomi estesi in input, ma visualizza e usa internamente il codice canonico a tre lettere.

Esempi:

- `Atalanta` -> `ATA`
- `Bologna` -> `BOL`
- `Inter` -> `INT`
- `Milan` -> `MIL`
- `Hellas Verona` -> `VER`

Regole:

- Il valore visualizzato nella tabella deve essere il codice canonico.
- Il valore originale proveniente dall'Excel puo essere conservato come metadato, ad esempio `realTeamOriginal`.
- La ricerca deve continuare a funzionare sia con sigla sia con nome esteso.
- Il confronto storico deve usare il valore canonico, non il testo grezzo dell'Excel.

## Presidente

Nessuna nuova funzionalita presidente e' stata introdotta tra V271 e V274. Restano valide le funzionalita precedenti:

- Dashboard Presidente.
- Comunicati squadra.
- Comunicati avvenuto scambio con EmailJS e richiesta Admin.
- Svincola Giocatori con invio EmailJS.
- Trattative inviate/ricevute e notifiche.
- Lettura esiti trattative sincronizzata con Firebase quando le rules V257 sono pubblicate.

## Admin

### Converti listone Excel

Funzionalita consolidate:

- Supporto formato storico con fogli `Tutti` e `Ceduti`.
- Supporto formato Classic a foglio singolo, ad esempio `Lista calciatori`.
- Mappatura colonne Classic:
  - `#` -> identificativo Fantacalcio
  - `Nome` -> nome giocatore
  - `Sq.` -> squadra reale, normalizzata a codice canonico
  - `R.` -> ruolo classic
  - `R.MANTRA` -> ruoli mantra
  - `QUOT.` -> quotazione attuale
  - `FVM/1000` -> FVM
  - `FantaSquadra` -> rosa/squadra fantasy se presente
  - `Costo` -> costo rosa se presente
  - `Fuori lista` -> stato in listone / asteriscato
- Report conversione con numero giocatori, formato riconosciuto, fogli usati e statistiche di stato.
- Confronto automatico con il listone precedente quando disponibile.
- Normalizzazione stabile dei codici squadra per evitare falsi cambi squadra.

### Test reale V273

Il test con il file Excel reale `lista_calciatori_lista calciatori_classic_zonaorientale-salerno.xlsx` ha prodotto:

- Formato riconosciuto: Fantacalcio Classic a foglio singolo.
- Foglio usato: `Lista calciatori`.
- Giocatori convertibili: 663.
- Giocatori in listone: 532.
- Giocatori asteriscati: 131.
- Giocatori con quotazione valida: 663.
- Giocatori con FantaSquadra valorizzata: 299.
- Confronto con listone precedente `2026-05-15`:
  - giocatori comuni: 661;
  - nuovi giocatori: 2;
  - giocatori usciti: 0;
  - quotazioni aumentate: 96;
  - quotazioni diminuite: 120;
  - quotazioni invariate: 445;
  - cambi ruolo: 0;
  - cambi squadra reali dopo normalizzazione: 0;
  - cambi stato: 1.

Nuovi giocatori rilevati nel test:

- Mikolajewski - Parma - Qt.A 2.
- Mosconi - Inter - Qt.A 1.

## Sviluppo, test e manutenzione

### Handoff e documentazione

V272 ha riorganizzato la documentazione di handoff e pre-merge in cartelle:

- `docs/zonaorientale/handoff/`
- `docs/zonaorientale/audit/`
- `docs/zonaorientale/pianificazione/`
- `docs/zonaorientale/release/`
- `docs/zonaorientale/listoni/`

V275 aggiunge questo registro funzionale per V271-V274.

### Diagnostiche runtime rilevanti

- `window.ZonaOrientaleFunctionLedgerV271`
- `window.ZonaOrientalePreMergeAuditV272`
- `window.ZonaOrientaleListoneE2ETestV273`
- `window.ZonaOrientaleListoneTeamCodesV274`
- `window.ZonaOrientaleFunctionLedgerV275`

### Test da ripetere dopo modifiche al Listone

1. Aprire `Admin -> Converti listone Excel`.
2. Caricare un Excel Classic a foglio singolo.
3. Verificare che il conteggio giocatori sia maggiore di zero.
4. Verificare che le squadre siano salvate/mostrate con codice canonico a tre lettere.
5. Aprire la sezione pubblica `Listone`.
6. Abilitare la colonna `Modifica` nei campi visibili.
7. Verificare assenza di falsi cambi squadra di massa.
8. Cercare un giocatore presente in altri listoni.
9. Verificare la sezione storica e gli eventuali usciti.

## Funzionalita da non perdere

Non rimuovere senza test mirato:

- `assets/js/admin/listone-converter.js`.
- La colonna `Modifica` del Listone.
- Il filtro/controllo `Mostra usciti storici`.
- La ricerca storica negli altri listoni.
- La normalizzazione codici squadra V274.
- I documenti `docs/zonaorientale/listoni/LISTONE_TEST_REALE_V273.md` e `docs/zonaorientale/listoni/LISTONE_CODICI_SQUADRA_V274.md`.

## Prossime verifiche consigliate

- Verificare un secondo Excel reale futuro per confermare che la normalizzazione squadra resta corretta.
- Verificare eventuali omonimie tra giocatori usando identificativo Fantacalcio `#` come chiave primaria.
- Decidere se portare queste informazioni nel file principale `FUNZIONALITA'.md` quando richiesto esplicitamente.

---
````

---

## 8. `FUNZIONALITAV333.md`

- Percorso originale: `FUNZIONALITAV333.md`
- Dimensione originale: 18606 byte
- SHA-256: `e82cb19300580835a4ca2f6074f8cc328fc73410417b024abf5cbcc310c45d82`

```markdown
# FUNZIONALITAV333 - Lista estesa funzionalita attive all'ultimo merge master

Data: 05/06/2026  
Versione di riferimento: V333 - refactor CSS protetto  
Scopo: fotografia estesa delle funzionalita da preservare prima dei prossimi refactor.  
Nota: questo file non sostituisce e non modifica `FUNZIONALITA'.md`.

## Regola principale

Ogni refactor successivo deve preservare tutte le funzionalita elencate qui, salvo richiesta esplicita del referente. In caso di dubbio, non cancellare codice, non rinominare ID/classi DOM e non scollegare handler prima di avere fatto grep, test runtime e controllo browser.

## 1. Struttura generale del sito

### 1.1 Pagine pubbliche e standalone
- Home/app principale in `index.html`.
- Pagina dettaglio competizione in `competition.html`.
- Pagina profilo squadra/presidente in `player.html`.
- Pagina/news entrypoint separato `news.html` quando presente.
- Favicon, manifest PWA e asset statici sotto `static/zonaorientale/`.
- Cache-buster allineati con `DEPLOY_EXPECTED_VERSION_V181`.
- Footer con versione corrente e descrizione release.

### 1.2 Navigazione desktop
- Menu principale desktop.
- Link alle sezioni pubbliche principali.
- Navigazione interna tramite hash/page key.
- Stato attivo della sezione corrente.
- Link a Calciomercato, Listone, Rose, Fantamercato, Competizioni, Archivio, Statistiche, Regolamento e sezioni storiche.

### 1.3 Navigazione mobile
- Bottom navigation mobile.
- Menu mobile `Altro`.
- Icone stabili nel menu `Altro`, incluse voci dinamiche.
- Rimozione del toggle vista mobile/desktop.
- Pagine lunghe e tabelle con scrolling mobile controllato.
- Pulsanti e input con touch target adeguato.
- Pulsante globale per tornare in alto quando previsto.

### 1.4 Tema e layout
- Dark mode come tema operativo principale.
- Light mode sospesa ma documentata nei file dedicati, non da ripristinare senza richiesta esplicita.
- Layout responsive desktop/tablet/mobile.
- Card e tabelle ottimizzate per viewport stretti.
- CSS refactor stabili sotto `assets/css/refactor/`.

## 2. Dashboard pubblica

- Riepilogo della stagione corrente.
- Accessi rapidi alle sezioni principali.
- Panoramica comunicati/news recenti.
- Panoramica competizioni principali.
- Stato generale del sito e della lega quando disponibile.
- Layout mobile con card e scorciatoie.
- Dati prioritariamente da JSON statici, con Firebase come live/fallback quando previsto.

## 3. News e comunicati

### 3.1 Consultazione pubblica
- Elenco comunicati pubblici.
- Apertura dettaglio comunicato.
- Lettura tramite link diretto/hash.
- Tag/topic comunicato.
- Data pubblicazione e metadati.
- Anteprima in Home o sezioni correlate.

### 3.2 Condivisione WhatsApp
- Copia link WhatsApp dei comunicati.
- URL di share dedicati.
- Netlify Function `news-share.js` per anteprima dinamica dei comunicati.
- Redirect configurato in `netlify.toml`.
- Fallback in caso di dati mancanti.

### 3.3 Comunicati da presidente/admin
- Comunicati squadra inviati dal presidente come richieste.
- Comunicati avvenuto scambio inviati dal presidente come richieste.
- Approvazione/rifiuto da Admin.
- Pubblicazione comunicato approvato nella sezione News.
- Eliminazione dai registri richieste quando prevista dai flussi canonici.

## 4. Rose e squadre

### 4.1 Rose pubbliche
- Elenco squadre della stagione.
- Visualizzazione rosa per squadra.
- Ruolo, squadra reale, quotazioni, costo e dati tecnici quando disponibili.
- Movimenti FM collegati.
- Snapshot statici delle rose pubblicate.
- Supporto a manifest rose/snapshot storici.

### 4.2 Pagina squadra/presidente
- Apertura pagina profilo squadra.
- Identificazione squadra tramite parametri/hash.
- Dati presidente, stemma/logo e metadati club quando disponibili.
- Layout mobile dedicato.
- Tabelle rose ottimizzate.

### 4.3 Storico rose
- Consultazione rose storiche quando lo snapshot le contiene.
- Movimenti e saldi storici.
- Fallback su piu fonti dati se una chiave manca.

## 5. Fantamercato interno

- Lista giocatori dichiarati trasferibili.
- Filtri per squadra proprietaria.
- Ricerca per giocatore, squadra, ruolo o condizioni.
- Card mobile e tabella desktop.
- Visualizzazione condizioni richieste dalla squadra proprietaria.
- Avvio proposta di trattativa dalla scheda giocatore trasferibile.
- Separazione netta dal Calciomercato news/feed esterno.

## 6. Listone

### 6.1 Consultazione pubblica
- Caricamento listone da JSON statici.
- Manifest listoni.
- Selezione versione/snapshot listone.
- Ricerca per nome giocatore, squadra reale, ruolo, rosa o altri campi disponibili.
- Filtro per ruolo.
- Filtro per stato: in listone, asteriscato, svincolato/free agent.
- Filtro `Modifiche`.
- Colonna `Modifica`.
- Visualizzazione giocatori in rosa e svincolati.
- Ordinamento e consultazione colonne tecniche.
- Quote, FVM e campi economici quando presenti.
- Apertura scheda giocatore esterna quando disponibile.

### 6.2 Modifiche e usciti storici
- Evidenza dei giocatori modificati rispetto allo snapshot precedente.
- Conservazione del filtro `Modifiche`.
- Gestione usciti storici.
- Preservazione dei campi utili per confronto fra listoni.

### 6.3 Export Admin
- Export CSV modifiche disponibile solo per Admin.
- Restrizione admin-only V296.
- Uso helper CSV condiviso V302 con fallback legacy.
- Nessuna esposizione export agli utenti pubblici non admin.

### 6.4 UI Listone
- Select `Modifiche` uniformato agli altri controlli.
- Etichetta `Modifiche` uniformata.
- CSS specifico Listone estratto in `assets/css/refactor/listone.css` dalla V333.
- Touch target mobile preservati.

## 7. Competizioni

### 7.1 Elenco competizioni
- Visualizzazione competizioni stagione corrente.
- Stato competizione.
- Tipo/formato competizione.
- Vincitore quando assegnato.
- Link a dettaglio competizione.

### 7.2 Dettaglio competizione
- Pagina `competition.html`.
- Calendario/partite.
- Risultati.
- Classifiche.
- Regular Season con punti, partite, vittorie, pareggi, sconfitte, gol/fanta-gol e fanta-punti quando disponibili.
- Stato competizione e vincitore.
- Layout mobile dedicato.

### 7.3 Admin competizioni
- Creazione e modifica competizioni.
- Gestione calendario.
- Gestione risultati.
- Gestione classifiche Regular Season.
- Pubblicazione/import competizioni statiche quando previsto.

## 8. Archivio storico

- Selezione stagioni storiche.
- Consultazione dati stagione.
- Squadre storiche.
- Competizioni storiche.
- Partite e risultati storici.
- Rose e movimenti storici se presenti.
- Saldi FM storici con fallback su piu fonti dati.
- Albo collegato alla stagione quando disponibile.
- Layout responsive.

## 9. Albo d'oro, palmares e FIFA Ranking

- Consultazione albo storico.
- Visualizzazione vincitori e piazzamenti.
- Palmares club/presidenti.
- FIFA Ranking.
- Esclusione competizioni non disputate dai conteggi storici quando prevista dallo snapshot.
- Podi e dati storici aggregati.
- Gestione Admin di voci albo, piazzamenti, punti, presidente, logo e note.
- Generazione snapshot pubblico honor.

## 10. Statistiche e confronti

### 10.1 Statistiche
- Statistiche storiche aggregate.
- Club piu vincenti.
- Podi campionato.
- Ultimi titoli assegnati.
- Presidenti piu vincenti.
- Ranking storici.

### 10.2 Confronta squadre
- Selezione squadre per confronto.
- Confronto risultati e dati storici.
- Uso snapshot disponibili.
- Layout mobile dedicato.

## 11. Regolamento

- Consultazione regolamento interno.
- Sezioni su partecipanti, rose, mercato, svincoli, scambi, finanze, stadio, calendario, coppe, montepremi e Oscar.
- Visualizzazione pubblica senza login.

## 12. Dashboard Presidente

### 12.1 Accesso e identita
- Login Firebase email/password.
- Login Google quando configurato.
- Riconoscimento presidente approvato.
- Pulsante account personalizzato con logo squadra e dicitura presidente.
- Accesso Dashboard Presidente.
- Stato account e ruolo.

### 12.2 Riepilogo presidente
- Riepilogo squadra collegata.
- Azioni rapide mobile.
- Link alla pagina squadra.
- Badge rosso/notifica in presenza di trattative o esiti da leggere.

### 12.3 Trattative
- Invio proposta scambio/svincolo ad altre squadre attive.
- Selezione giocatori offerti dalla propria rosa.
- Selezione giocatori richiesti dalla rosa destinataria.
- Inserimento FM offerti o richiesti.
- Messaggio di trattativa.
- Proposta diretta o precompilata da Fantamercato.
- Elenco trattative inviate.
- Elenco trattative ricevute.
- Storico con contropartite, FM, messaggio e stato.
- Visualizzazione delle ultime 5 trattative e scroll per le altre.
- Accettazione/rifiuto proposte ricevute.
- Annullamento proposte proprie ancora in attesa.
- Notifica ricevuta persistente fino ad approvazione/rifiuto.
- Notifica esito persistente fino ad apertura card relativa.
- Sync multi-dispositivo esiti tramite Firebase rules dedicate.
- Simulatore locale notifiche/trattative per test dev quando presente.

### 12.4 Comunicati squadra
- Form titolo comunicato squadra.
- Form testo comunicato squadra.
- Invio richiesta verso Admin.
- Pubblicazione in News dopo approvazione Admin.

### 12.5 Comunicati avvenuto scambio
- Form titolo comunicato scambio.
- Form testo comunicato scambio.
- Giocatori/contropartite coinvolti.
- Squadra coinvolta.
- Invio richiesta verso Admin.
- Invio EmailJS a `caparrotti86@yahoo.it` quando previsto.
- Pubblicazione come `COMUNICATO_AVVENUTO_SCAMBIO` dopo approvazione.
- Handler legacy puliti: mantenere un solo flusso canonico.

### 12.6 Svincolo giocatori
- Sezione informativa svincolo giocatori in Dashboard Presidente.
- Selezione uno o piu giocatori dalla propria rosa.
- Costruzione email standard con elenco giocatori e Qt.A quando disponibile.
- Nessuna scrittura Firebase per questo flusso.
- Invio tramite EmailJS/browser quando configurato.

### 12.7 Fantamercato presidente
- Messa giocatori sul mercato.
- Modifica condizioni trasferibilita.
- Rimozione giocatori dal mercato.
- Avvio proposta da scheda giocatore trasferibile.

## 13. Area Admin

### 13.1 Accesso e caricamento
- Accesso account admin Firebase.
- Visualizzazione area Admin completa.
- Modalita leggera/completa quando prevista.
- Caricamento dati amministrazione solo quando necessario.
- Diagnostica letture Firebase.

### 13.2 Gestione stagioni
- Creazione stagioni.
- Modifica stagioni.
- Impostazione stagione corrente.
- Date e metadati stagione.
- Rollover stagione quando previsto.

### 13.3 Club, presidenti e utenti
- Gestione club.
- Gestione identita stagionali.
- Collegamento presidenti.
- Approvazione/rifiuto richieste utenti/presidenti.
- Storico utenti approvati.
- Pannello `Richieste presidenti` canonico con refresh Firebase.
- Eliminazione da Firebase dei registri richieste approvati/rifiutati quando prevista.

### 13.4 Rose e dati giocatori
- Caricamento/modifica rose.
- Import rose da Excel quando previsto.
- Generazione overlay statici per GitHub.
- Inizializzazione rose da snapshot statici.
- Movimenti FM.
- Diagnostica qualita dati rose/listoni/competizioni/news.

### 13.5 Listone Admin
- Caricamento listone da Excel.
- Conversione listone in JSON statico.
- Aggiornamento manifest listoni.
- Integrazione listone con rose.
- Generazione overlay statico pronto per commit.
- Diagnostica ruoli listone compatibile con piu campi (`classicRole`, `rosterRole`, `roleClassic`, `R`, ecc.).
- Export CSV modifiche solo Admin.

### 13.6 Acquisti e asta
- Registrazione acquisti asta.
- Collegamento acquisto a giocatore, club, ruolo, prezzo e data.
- Aggiornamento rose e movimenti collegati quando previsto.

### 13.7 Stadi
- Gestione stadio per squadra/stagione.
- Gestione livelli stadio.
- Pubblicazione informazioni stadio nelle aree pubbliche.

### 13.8 Comunicati e richieste
- Visualizzazione richieste presidenti.
- Approvazione/rifiuto comunicati squadra.
- Approvazione/rifiuto comunicati avvenuto scambio.
- Pubblicazione comunicati approvati nella collection News.
- Gestione titolo, corpo, topic e metadati.
- Copia link WhatsApp comunicati.
- Generatore comunicati automatici locale/refactor V210 ripristinato.

### 13.9 Pubblicazione e diagnostica
- Stato Firebase/JSON.
- Procedura guidata `Pubblica aggiornamenti`.
- Preflight asset pubblici.
- Checklist online finale.
- Comandi Git copiabili.
- Backup JSON collection Firebase.
- Diagnostica runtime e stato refactor.
- Diagnostica dati Admin estesa.
- Pannello Diagnostica dati espandibile.

## 14. Calciomercato esterno/news mercato

### 14.1 Sezione pubblica
- Sezione `Calciomercato` pubblica.
- Menu desktop e voce mobile `Altro`.
- Route interna `#calciomercato` preservata.
- Titolo e naming unificati su `Calciomercato`.

### 14.2 Fonti e configurazione
- Configurazione in `assets/calciomercato/links.json`.
- Supporto articoli statici manuali.
- Supporto feed RSS tramite Netlify Function.
- Supporto pagine HTML TMW squadra.
- Fonti attive non TMW come SOS Fanta, CalcioMercato.it e altre configurate nel JSON.
- 20 fonti TMW squadra dedicate: Atalanta, Bologna, Cagliari, Como, Fiorentina, Frosinone, Genoa, Inter, Juventus, Lazio, Lecce, Milan, Monza, Napoli, Parma, Roma, Sassuolo, Torino, Udinese, Venezia.
- Fonte generica TuttoMercatoWeb rimossa/sospesa in `removedSourcesV316`.

### 14.3 Recupero automatico
- Netlify Function `calciomercato-feed.js`.
- Parsing RSS classico.
- Parsing HTML TMW squadra.
- Limiti alzati fino a 5000 articoli globali e 500 per fonte configurata.
- Fallback su JSON statico se la funzione non risponde.
- Informazioni range/feed quando un periodo non produce risultati.

### 14.4 Archivio statico Calciomercato
- Archivio giornaliero sotto `assets/calciomercato/archive/`.
- Manifest archivio.
- Lettura articoli statici giornalieri.
- Pannello Solo Admin per download JSON giorno/intervallo.
- Pannello Solo Admin espandibile/riducibile.
- Download Admin con limiti alti V329.
- Copertura e diagnostica giorni disponibili/caricati.

### 14.5 Filtri e ricerca
- Filtro squadra, inclusa opzione `Generale`.
- Filtro topic.
- Filtro fonte.
- Ricerca keyword.
- Range temporale `Da`/`A`.
- Default range ultime ore/giorni secondo configurazione corrente.
- Caricamento progressivo articoli piu vecchi senza perdita posizione scroll.
- Inclusione entita rilevate automaticamente in filtri/ricerca.

### 14.6 Riconoscimento automatico
- Riconoscimento euristico squadre.
- Riconoscimento euristico giocatori.
- Riconoscimento euristico allenatori/persone quando previsto.
- Campi `detectedTeams`, `detectedPlayers`, `entities`.
- Filtraggio anche su entita rilevate.
- I chip `Giocatori/Allenatori` non sono mostrati nelle card, ma i dati restano utili a ricerca/diagnostica.

### 14.7 Card articolo
- Layout lista/card orizzontale desktop.
- Card compatte V332.
- Immagine anteprima ridotta.
- Da mobile miniatura compatta.
- Anteprima testo non renderizzata in card desktop/mobile.
- Titolo cliccabile.
- Immagine cliccabile quando presente.
- Pulsante `Apri articolo` nascosto da mobile.
- Fonte, data/ora e metadati essenziali visibili.
- Decodifica entita HTML nei testi (`&#8217;`, `&amp;`, ecc.).
- Data/ora normalizzate su `Europe/Rome`.

### 14.8 Fallback immagini
- Se articolo ha immagine reale, usare immagine articolo.
- Se articolo non ha immagine, usare favicon reale della fonte quando possibile.
- Per fonti TMW squadra senza immagine, usare tile testuale `TMW - <NomeSquadra>`.
- Fallback finale a tile fonte sicura.
- Gli eventuali JSON V329 con `image` uguale a `teamLogoUrl` vengono trattati come senza immagine per mostrare tile testuale TMW.

## 15. Infrastruttura dati statici

- `assets/data` e JSON pubblici per config/snapshot.
- Snapshot stagioni.
- Manifest listoni.
- Manifest rose.
- Manifest competizioni.
- Manifest archivio Calciomercato.
- Asset club/loghi/media.
- Dati statici come sorgente pubblica principale.
- Firebase come sorgente live/fallback/admin quando previsto.

## 16. Firebase, Auth ed EmailJS

### 16.1 Firebase/Auth
- Firebase Auth per login.
- Firestore per news live, richieste, utenti, admin, fantamercato e trattative.
- Rules dedicate per lettura esiti trattative multi-dispositivo.
- Guard contro permission-denied in flussi noti.

### 16.2 EmailJS
- Invio email per comunicato avvenuto scambio.
- Invio email/informativa svincolo giocatori quando previsto.
- Oggetti e corpo email standardizzati nelle release precedenti.
- Nessun invio automatico non richiesto fuori dai flussi UI.

## 17. Netlify

- `netlify.toml` con redirect/funzioni.
- `netlify/functions/news-share.js` per preview WhatsApp news.
- `netlify/functions/calciomercato-feed.js` per recupero Calciomercato.
- Parsing RSS e HTML TMW squadra nel feed Calciomercato.
- Nessuna modifica Netlify in V333.

## 18. Strumenti e controlli

- `tools/check-zonaorientale.sh` come controllo obbligatorio.
- `tools/audit-assets-v298.sh` per riferimenti asset/import.
- `tools/audit-css-v300.sh` per CSS.
- `tools/cleanup-css-refactor-v301.sh` solo per pulizia controllata, non da usare automaticamente.
- Controllo `node --check` sui JS.
- Controllo validita JSON.
- Controllo cache-buster/footer/versione.
- Controllo file macOS indesiderati.

## 19. Documentazione da preservare

- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md`.
- `docs/zonaorientale/CHANGELOG_CONSOLIDATO.md`.
- `docs/zonaorientale/REGRESSION_TESTS.md`.
- `docs/zonaorientale/FUNZIONALITA'.md`, da modificare solo su richiesta esplicita.
- Documenti release sotto `docs/zonaorientale/release/`.
- Documenti handoff sotto `docs/zonaorientale/handoff/`.
- Documenti refactor sotto `docs/zonaorientale/refactor/`.
- Documenti Calciomercato sotto `docs/zonaorientale/calciomercato/`.

## 20. Funzionalita esplicitamente non toccate in V333

- Nessuna modifica a Firebase/Auth/EmailJS.
- Nessuna modifica a Netlify Function.
- Nessuna modifica a JSON dati, listoni, rose, competizioni o archivi.
- Nessuna modifica a parsing Calciomercato.
- Nessuna modifica a filtri Calciomercato.
- Nessuna modifica a workflow Admin.
- Nessuna modifica a Dashboard Presidente.
- Nessuna modifica a Listone runtime/export.
- Nessuna modifica a News/share WhatsApp.
- Nessuna modifica a Competition/player standalone.

## 21. Candidati refactor futuri, non da cancellare ora

- Estrarre funzioni immagine Calciomercato in modulo dedicato.
- Estrarre rendering card Calciomercato in modulo dedicato.
- Estrarre filtri Calciomercato in modulo dedicato.
- Consolidare helper duplicati solo dopo grep completo.
- Rivalutare file CSS legacy V291/V292 solo con script controllato e test browser.
- Aggiornare handoff corrente con sintesi piu corta quando la V333 e' consolidata.
```

---

## 9. `FUNZIONALITAV334.md`

- Percorso originale: `FUNZIONALITAV334.md`
- Dimensione originale: 4460 byte
- SHA-256: `33a02e818ff53bbc83a88e1e19e6fd22960d4fa1663a3906abbf4725d531b906`

````markdown
# FUNZIONALITA V334 - Refactor immagini Calciomercato protetto

Data: 05/06/2026
Versione runtime: V334
Tipo intervento: refactor JS protetto, senza cambio comportamento intenzionale.

## Obiettivo V334

La V334 estrae da `assets/app.js` le funzioni di supporto per immagini e testi degli articoli Calciomercato, spostandole nel nuovo modulo:

```text
static/zonaorientale/assets/js/calciomercato/calciomercato-images-v334.js
```

Il rendering delle card resta gestito da `app.js`; il nuovo modulo fornisce solo helper puri per:

- decodifica entita HTML dei testi articolo;
- riconoscimento immagine diretta articolo;
- fallback favicon fonte;
- fallback tile SVG fonte;
- tile testuale `TMW - <NomeSquadra>` per fonti TMW squadra;
- riconoscimento del vecchio fallback logo squadra V329.

## Funzionalita preservate

La V334 deve preservare tutte le funzionalita gia presenti all'ultimo merge su master e documentate nella V333. In particolare:

### Calciomercato

- Caricamento articoli da feed RSS automatici.
- Caricamento articoli da pagine HTML TMW squadra.
- Lettura archivio statico giornaliero da `assets/calciomercato/archive/`.
- Download Admin archivio statico con limiti aumentati V329.
- Fonti TMW squadra in `links.json`.
- Esclusione fonte generica TMW tramite `removedSourcesV316`.
- Filtri `Cerca`, `Fonte`, `Squadra`, `Da`, `A`.
- Range temporale e pulsante carica articoli/archivio.
- Card compatte V332.
- Nessuna anteprima/testo descrittivo nelle card V331.
- Titolo e immagine cliccabili.
- Pulsante `Apri articolo` nascosto da mobile.
- Fallback immagini V328/V330.
- Pannello `Solo Admin` espandibile/riducibile V327.

### Listone

- Visualizzazione Listone pubblico.
- Colonna `Modifica`.
- Filtro `Modifiche`.
- Stile filtro `Modifiche` separato in `assets/css/refactor/listone.css` V333.
- Usciti storici.
- Export CSV modifiche solo Admin.
- Manifest e JSON Listoni non modificati da V334.

### Altre sezioni

- Home/Dashboard pubblica.
- News e share WhatsApp.
- Rose e pagina squadra.
- Fantamercato interno.
- Competizioni e pagina `competition.html`.
- Pagina giocatore `player.html`.
- Archivio, statistiche e confronta.
- Dashboard Presidente.
- Admin, richieste presidenti e diagnostica dati.
- Firebase/Auth/EmailJS.
- Mobile bottom navigation e menu `Altro`.
- Dark mode unico.

## File runtime modificati

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/calciomercato/calciomercato-images-v334.js
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
static/zonaorientale/tools/check-zonaorientale.sh
```

## File non modificati intenzionalmente

```text
netlify/functions/calciomercato-feed.js
static/zonaorientale/assets/calciomercato/links.json
static/zonaorientale/assets/calciomercato/archive/*.json
static/zonaorientale/assets/calciomercato/archive/manifest.json
static/zonaorientale/assets/css/refactor/calciomercato.css
static/zonaorientale/assets/css/refactor/listone.css
static/zonaorientale/assets/css/refactor/mobile-controls.css
static/zonaorientale/assets/listoni/*.json
static/zonaorientale/assets/listoni/manifest.json
docs/zonaorientale/FUNZIONALITA'.md
```

## Diagnostica runtime

La V334 aggiunge:

```js
window.ZonaOrientaleCalciomercatoImagesV334
```

Campi principali:

- `behaviorChange: false`;
- `module: "assets/js/calciomercato/calciomercato-images-v334.js"`;
- `getArticleImageInfo`;
- `decodeText`.

## Rischi controllati

| Area | Rischio | Mitigazione |
|---|---|---|
| Immagini articoli Calciomercato | fallback non mostrato | wrapper in `app.js` mantiene i nomi storici V325/V328/V330 |
| TMW squadra | tile testuale non riconosciuta | funzione `isTmwTeamSource` resta nel modulo e viene richiamata dai wrapper |
| Favicon fonte | errore immagine | resta `fallbackSrc` verso SVG fonte |
| Testi codificati | ricomparsa entita HTML | `decodeText` resta esposto e usato nel rendering card |
| Import modulo | asset mancante | `check-zonaorientale.sh` verifica modulo e marker V334 |

## Verifiche consigliate in browser

1. Aprire Calciomercato.
2. Verificare card con immagine reale articolo.
3. Verificare card senza immagine di fonte non TMW: favicon o tile fonte.
4. Verificare card TMW squadra senza immagine: tile `TMW - <NomeSquadra>`.
5. Provare filtri `Cerca`, `Squadra`, `Fonte`, `Da`, `A`.
6. Aprire/ridurre `Solo Admin`.
7. Verificare Listone e filtro `Modifiche`.
8. Verificare menu mobile `Altro`.
````

---

## 10. `FUNZIONALITAV335.md`

- Percorso originale: `FUNZIONALITAV335.md`
- Dimensione originale: 5683 byte
- SHA-256: `7230b8056b5b6d49835ebfa37d5184ca7ff25f65adc49c34267a9093520fcd1e`

````markdown
# FUNZIONALITA V335 - Tag giocatore e timeline articoli Calciomercato

Data: 05/06/2026
Versione runtime: V335
Tipo intervento: refactor JS protetto + nuova funzionalita isolata nella sezione Calciomercato.

## Obiettivo V335

La V335 continua il refactor protetto del Calciomercato aggiungendo il modulo puro:

```text
static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js
```

Il modulo associa in modo conservativo un articolo a uno o piu giocatori presenti nell'ultimo listone della stagione selezionata.

La UI mostra il tag del giocatore accanto ai tag gia presenti sopra il titolo dell'articolo. Il tag e cliccabile e apre una pagina interna di timeline con gli articoli che parlano di quel giocatore.

## Regole di associazione articolo -> giocatore

La V335 usa solo dati gia presenti nel sito:

- articoli Calciomercato caricati da feed, HTML TMW o archivio statico;
- ultimo listone disponibile per la stagione selezionata;
- campi articolo gia normalizzati (`title`, `description`, `tags`, `players`, `detectedPlayers`, ecc.).

Matching conservativo:

- match forte su nome completo normalizzato;
- match secondario su cognome solo se il cognome e univoco nel listone e lungo almeno 5 caratteri;
- massimo 3 tag giocatore mostrati nella card;
- nessuna scrittura Firebase;
- nessuna modifica a JSON Listone, archivio o feed.

## Timeline giocatore

Il click sul tag apre una route hash interna:

```text
#calciomercato-player-<slug-giocatore>
```

La pagina timeline:

- usa il giocatore riconosciuto nell'ultimo listone della stagione selezionata;
- mostra gli articoli collegati ordinati per data decrescente;
- usa gli articoli gia caricati e, quando disponibile, legge anche l'archivio statico Calciomercato;
- non modifica la navigazione principale e non aggiunge link permanenti nel menu.

## Funzionalita preservate

La V335 preserva tutte le funzionalita gia presenti all'ultimo merge su master e documentate in V333/V334.

### Calciomercato

- Caricamento articoli da feed RSS automatici.
- Caricamento articoli da pagine HTML TMW squadra.
- Lettura archivio statico giornaliero da `assets/calciomercato/archive/`.
- Download Admin archivio statico con limiti V329.
- Fonti TMW squadra in `links.json`.
- Esclusione fonte generica TMW tramite `removedSourcesV316`.
- Filtri `Cerca`, `Fonte`, `Squadra`, `Da`, `A`.
- Range temporale, carica articoli piu vecchi e fusione archivio statico.
- Card compatte V332.
- Anteprima testo nascosta V331.
- Titolo e immagine cliccabili.
- Pulsante `Apri articolo` nascosto da mobile.
- Fallback immagini/favicon/TMW testuale V328-V330.
- Pannello `Solo Admin` espandibile/riducibile V327.

### Listone

- Visualizzazione Listone pubblico.
- Ultimo listone della stagione selezionata.
- Colonna `Modifica`.
- Filtro `Modifiche`.
- Usciti storici.
- Export CSV modifiche solo Admin.
- Manifest e JSON Listoni non modificati da V335.

### Altre sezioni

- Home/Dashboard pubblica.
- News e share WhatsApp.
- Rose e pagina squadra.
- Fantamercato interno.
- Competizioni e pagina `competition.html`.
- Pagina giocatore `player.html`.
- Archivio, statistiche e confronta.
- Dashboard Presidente.
- Admin, richieste presidenti e diagnostica dati.
- Firebase/Auth/EmailJS.
- Mobile bottom navigation e menu `Altro`.
- Dark mode unico.

## File runtime modificati

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js
static/zonaorientale/assets/css/refactor/calciomercato.css
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
static/zonaorientale/tools/check-zonaorientale.sh
```

## File non modificati intenzionalmente

```text
netlify/functions/calciomercato-feed.js
static/zonaorientale/assets/calciomercato/links.json
static/zonaorientale/assets/calciomercato/archive/*.json
static/zonaorientale/assets/calciomercato/archive/manifest.json
static/zonaorientale/assets/listoni/*.json
static/zonaorientale/assets/listoni/manifest.json
docs/zonaorientale/FUNZIONALITA'.md
```

## Diagnostica runtime

La V335 aggiunge:

```js
window.ZonaOrientaleCalciomercatoPlayersV335
```

Campi/funzioni principali:

- `version: "V335"`;
- `listoneScope: "ultimo listone della stagione selezionata"`;
- `matchingPolicy: "nome completo + cognome univoco conservativo"`;
- `getLatestListone()`;
- `getArticlePlayerMatches(article)`;
- `activateTimeline()`.

## Rischi controllati

| Area | Rischio | Mitigazione |
|---|---|---|
| Tag giocatore errato | falsi positivi da cognomi comuni | match cognome solo se univoco nel listone e lungo almeno 5 caratteri |
| Navigazione hash | conflitto con pagina squadra dinamica | `isKnownStaticHashV43` viene estesa per riconoscere `calciomercato-player-*` |
| Timeline vuota | archivio non ancora esteso o range limitato | messaggio esplicativo e uso dell'archivio statico quando disponibile |
| Performance timeline | molti JSON archivio | caricamento solo su click tag, cache sessione `playerTimelinePoolV335`, massimo 370 giorni |
| Regressioni altre sezioni | refactor troppo ampio | Netlify, Firebase, Listone JSON, rose e admin non modificati |

## Verifiche consigliate in browser

1. Aprire Calciomercato.
2. Verificare che le card restino compatte come V332.
3. Cercare articoli con nomi presenti nel listone e verificare la comparsa del tag giocatore.
4. Cliccare il tag e verificare apertura pagina `Timeline <Giocatore>`.
5. Tornare al Calciomercato con il pulsante dedicato.
6. Verificare filtri `Cerca`, `Squadra`, `Fonte`, `Da`, `A`.
7. Verificare pannello `Solo Admin`.
8. Verificare Listone e filtro `Modifiche`.
9. Verificare mobile menu `Altro`.
````

---

## 11. `FUNZIONALITAV336.md`

- Percorso originale: `FUNZIONALITAV336.md`
- Dimensione originale: 3654 byte
- SHA-256: `72afc4f142b8c36d9172f6dc60b778ecee6b4d734aa27c0a4f2f0c7f522b4441`

````markdown
# FUNZIONALITAV336 - Stato funzionale da preservare

Documento operativo per V336. Non sostituisce `FUNZIONALITA'.md`, che resta protetto e non e' stato modificato.

## Novita V336

- Calciomercato: il tag giocatore introdotto in V335 non apre piu' una pagina separata.
- Il click sul tag giocatore apre una scheda/modal sovrapposta alla sezione Calciomercato.
- La scheda si chiude con:
  - tasto `X` in alto a destra;
  - click sullo sfondo;
  - tasto `Escape`.
- Rimossi dalla UI della timeline i tasti `Torna agli articoli` e `Torna al Calciomercato`, che potevano non funzionare in alcune condizioni di navigazione/hash.
- Restano invariati matching giocatore, pool articoli e lettura archivio statico.

## Funzionalita Calciomercato da preservare

- Recupero automatico articoli via Netlify Function `calciomercato-feed.js`.
- Parsing RSS classico e parsing HTML TMW squadra introdotto in V329.
- Fonti in `assets/calciomercato/links.json`.
- Archivio statico giornaliero in `assets/calciomercato/archive/`.
- `manifest.json` archivio con giorni disponibili e fonti rimosse.
- Pannello Solo Admin espandibile/riducibile.
- Download archivio giornaliero dal pannello Solo Admin.
- Filtri Cerca, Fonte, Squadra, Topic, Da, A.
- Caricamento articoli piu vecchi quando disponibile.
- Card compatte V332.
- Niente anteprima testo articolo nelle card V331.
- Da mobile niente pulsante `Apri articolo`, ma titolo/immagine restano cliccabili.
- Decodifica entita HTML V328/V334.
- Fallback immagini:
  - immagine articolo reale se presente;
  - favicon fonte se disponibile;
  - tile fonte;
  - tile testuale `TMW - NomeSquadra` per fonti TMW squadra senza immagine.
- Tag giocatore V335 basato sull'ultimo listone della stagione selezionata.
- Matching conservativo giocatore: nome completo o cognome univoco.
- Timeline articoli giocatore V336 in scheda/modal, non pagina separata.

## Funzionalita Listone da preservare

- Caricamento listoni per stagione.
- Ultimo listone della stagione selezionata.
- Ricerca giocatori.
- Filtri ruolo/squadra/status/modifiche.
- Colonna `Modifica`.
- Evidenza nuovi, rimossi, cambi ruolo/squadra/prezzo.
- Usciti storici.
- Export CSV modifiche solo Admin.
- Stile uniforme del filtro `Modifiche` V331/V333.
- `assets/css/refactor/listone.css` separato da V333.

## Funzionalita globali da preservare

- Home/dashboard pubblica.
- News e share WhatsApp.
- Rose e pagina squadra.
- Fantamercato interno/trattative.
- Dashboard Presidente.
- Admin completo e Admin leggero.
- Richieste presidenti.
- Diagnostica dati.
- Converti listone Excel.
- Competizioni e `competition.html`.
- Scheda giocatore standalone `player.html`.
- Archivio stagioni/statistiche/confronta.
- Firebase/Auth/EmailJS.
- Navigazione desktop.
- Bottom nav mobile e menu `Altro`.
- Pulsante `Su`/mobile chrome.
- Dark mode unico.

## Vincoli per futuri refactor

- Non cancellare codice legacy solo perche' sembra inutilizzato.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Non rinominare ID DOM o classi usate da JS senza grep completo.
- Ogni release deve aggiornare footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181`.
- Ogni release deve includere handoff, `FUNZIONALITAVxxx.md` e doc release/refactor utile.
- Se si tocca Netlify, includere `netlify/` nello zip e dichiararlo nella consegna.

## Test minimi

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```
````

---

## 12. `FUNZIONALITAV337.md`

- Percorso originale: `FUNZIONALITAV337.md`
- Dimensione originale: 2987 byte
- SHA-256: `0763b6762ad8aca163df07fa2ce18cf44bc546717afb956bcf3a3ab317d423ac`

````markdown
# FUNZIONALITA V337 - Matching giocatore Calciomercato migliorato

Versione: V337  
Data: 05/06/2026  
Ambito: sezione Calciomercato, tag giocatore e timeline in scheda/modal.

## Obiettivo

Migliorare il riconoscimento automatico del giocatore associato a un articolo, senza cambiare il comportamento delle altre sezioni del sito.

Il caso che motiva la V337 e': titoli come `Kalulu, ...` devono riconoscere correttamente `Kalulu` anche quando il normalizzatore condiviso lascia la punteggiatura nel testo.

## Funzionalita V337

- Il modulo giocatori Calciomercato passa da `calciomercato-players-v335.js` a `calciomercato-players-v337.js`.
- Il matching giocatore rimuove sempre punteggiatura, apostrofi, virgolette, tag HTML, separatori e spazi multipli prima del confronto.
- Il matching continua a usare solo l'ultimo listone della stagione selezionata.
- Il matching resta conservativo:
  - nome completo;
  - cognome solo se univoco nel listone;
  - nessun matching aggressivo su parole troppo brevi o stop word.
- Il tag giocatore nelle card articolo resta nella stessa posizione introdotta in V335.
- Il tag giocatore continua ad aprire la timeline in scheda/modal V336, chiudibile con X, sfondo o Escape.
- La timeline continua a usare articoli caricati e archivio statico quando disponibile.

## Esempi coperti

- `Kalulu, la Juventus aspetta novita` -> riconosce `Kalulu`.
- `De Bruyne: contatti in corso` -> riconosce `De Bruyne`.
- `Lookman - sirene di mercato` -> riconosce `Lookman`, se presente nell'ultimo listone.
- `Lukaku: l'agente parla` -> riconosce `Lukaku`, se presente nell'ultimo listone.

## Funzionalita preservate

- Card Calciomercato compatte V332.
- Fallback immagini/favicon/TMW V334/V330/V328.
- Fonti TMW squadra V329.
- Archivio statico Calciomercato V323/V324.
- Pannello Solo Admin espandibile/riducibile V327.
- Modal timeline giocatore V336.
- Listone e filtro Modifiche V333/V331.
- Rose.
- Fantamercato interno.
- Dashboard Presidente.
- Admin generale.
- Firebase/Auth/EmailJS.
- Netlify Functions.
- News/share WhatsApp.
- Navigazione mobile e menu Altro.
- Pagine standalone `competition.html` e `player.html`.

## File principali coinvolti

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/calciomercato/calciomercato-players-v337.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`

## File non modificati intenzionalmente

- `docs/zonaorientale/FUNZIONALITA'.md`
- `netlify/functions/calciomercato-feed.js`
- `static/zonaorientale/assets/calciomercato/links.json`
- `static/zonaorientale/assets/calciomercato/archive/*.json`
- `static/zonaorientale/assets/listoni/*.json`

## Diagnostica

Esposta diagnostica runtime:

```js
window.ZonaOrientaleCalciomercatoPlayerMatchingV337
```

La diagnostica include anche `runSmokeTest()`, utile in console browser per verificare il caso `Kalulu, ...`.
````

---

## 13. `FUNZIONALITAV338.md`

- Percorso originale: `FUNZIONALITAV338.md`
- Dimensione originale: 2983 byte
- SHA-256: `e07e4b69981d7fa1349db402bf01d6e0dfc62a95d81a1fb0cead74e70273c18b`

````markdown
# FUNZIONALITA V338 - Renderer card Calciomercato protetto

Versione: V338  
Data: 05/06/2026  
Ambito: refactor protetto del rendering delle schede articolo Calciomercato.

## Obiettivo

Ridurre ulteriormente la complessita di `assets/app.js` senza cambiare comportamento runtime, estraendo il rendering HTML delle card articolo Calciomercato in un modulo dedicato.

La V338 non introduce nuove funzionalita utente: e' un refactor protetto.

## Funzionalita V338

- Creato il modulo `assets/js/calciomercato/calciomercato-render-v338.js`.
- Il modulo espone `createCalciomercatoArticleRendererV338`.
- `renderCalciomercatoArticleCardV306(article)` resta disponibile in `app.js` come nome storico, ma ora delega a `CalciomercatoArticleRendererV338.renderArticleCard(article)`.
- Il rendering mantiene:
  - card compatte V332;
  - titolo cliccabile;
  - immagine/thumbnail cliccabile;
  - fonte e data;
  - bottone `Apri articolo` su desktop;
  - bottone nascosto da mobile via CSS V331;
  - tag squadra/topic/status;
  - tag giocatore V335-V337;
  - fallback immagini V334/V328/V330.
- Aggiunta diagnostica runtime `window.ZonaOrientaleCalciomercatoRendererV338`.
- Aggiornato `check-zonaorientale.sh` per verificare la presenza del modulo e della delega.

## Funzionalita preservate

- Calciomercato feed RSS/HTML.
- Fonti TMW squadra V329.
- Tile testuale TMW - NomeSquadra V330.
- Fallback favicon/fonte V328/V334.
- Card compatte V332.
- Matching giocatore V337.
- Modal timeline giocatore V336.
- Tag giocatore V335.
- Archivio statico Calciomercato V323/V324.
- Pannello Solo Admin espandibile/riducibile V327.
- Filtri Calciomercato Cerca, Squadra, Topic, Fonte, Da, A.
- Download archivio statico giornaliero dal pannello Admin Calciomercato.
- Listone e filtro Modifiche.
- Export CSV Listone solo Admin.
- Rose e pagina squadra.
- Fantamercato interno.
- Dashboard Presidente.
- Admin generale, diagnostica dati, convertitore listone.
- Firebase/Auth/EmailJS.
- Netlify Functions.
- News/share WhatsApp.
- Navigazione mobile e menu Altro.
- Pagine standalone `competition.html` e `player.html`.

## File principali coinvolti

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/calciomercato/calciomercato-render-v338.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`

## File non modificati intenzionalmente

- `docs/zonaorientale/FUNZIONALITA'.md`
- `netlify/functions/calciomercato-feed.js`
- `static/zonaorientale/assets/calciomercato/links.json`
- `static/zonaorientale/assets/calciomercato/archive/*.json`
- `static/zonaorientale/assets/listoni/*.json`
- `static/zonaorientale/assets/css/refactor/calciomercato.css`

## Diagnostica

In console browser e' disponibile:

```js
window.ZonaOrientaleCalciomercatoRendererV338
```

La diagnostica espone il renderer attivo e conferma che la card e' renderizzata dal modulo V338.
````

---

## 14. `FUNZIONALITAV339.md`

- Percorso originale: `FUNZIONALITAV339.md`
- Dimensione originale: 4103 byte
- SHA-256: `c06696499deb55bcf69b98467674cac132999f360f32ca02de34acca15e056dc`

````markdown
# FUNZIONALITA V339 - Filtri Calciomercato protetti

Versione: V339  
Data: 05/06/2026  
Ambito: refactor protetto della logica filtri Calciomercato.

## Obiettivo

Ridurre la complessita di `assets/app.js` estraendo in un modulo dedicato la gestione dei filtri Calciomercato, senza cambiare comportamento utente, dati, feed o stile delle card.

La V339 non introduce nuove funzionalita utente: e' un refactor protetto.

## Funzionalita V339

- Creato il modulo `assets/js/calciomercato/calciomercato-filters-v339.js`.
- Il modulo espone `createCalciomercatoFiltersV339`.
- Restano disponibili i nomi storici in `app.js`:
  - `getCalciomercatoFilteredArticlesV306()`;
  - `renderCalciomercatoSelectOptionsV306()`;
  - `renderCalciomercatoTeamSelectOptionsV314()`;
  - `renderCalciomercatoSourceSelectOptionsV314()`;
  - `setupCalciomercatoControlsV306()`.
- I wrapper storici ora delegano al modulo V339.
- La gestione eventi resta delegata sulla sezione `data-page="calciomercato"` e continua a usare il flag storico `data-calciomercato-bound-v306`.
- Aggiunta diagnostica runtime `window.ZonaOrientaleCalciomercatoFiltersV339`.
- Aggiornato `check-zonaorientale.sh` per verificare modulo, delega e documentazione V339.

## Filtri preservati

- Ricerca testuale `Cerca`.
- Filtro squadra.
- Filtro topic.
- Filtro fonte.
- Range temporale `Da` / `A`.
- Bottone applica periodo.
- Bottone reset periodo.
- Bottone/caricamento articoli piu vecchi.
- Infinite scroll automatico per feed RSS quando il range non e' manuale.
- Meta conteggio articoli visibili/totali.
- Avviso nessun articolo corrispondente ai filtri.

## Funzionalita preservate

- Calciomercato feed RSS/HTML.
- Fonti TMW squadra V329.
- Tile testuale TMW - NomeSquadra V330.
- Fallback favicon/fonte V328/V334.
- Card compatte V332.
- Renderer card V338.
- Matching giocatore V337.
- Modal timeline giocatore V336.
- Tag giocatore V335.
- Archivio statico Calciomercato V323/V324.
- Pannello Solo Admin espandibile/riducibile V327.
- Download archivio statico giornaliero dal pannello Admin Calciomercato.
- Listone e filtro Modifiche.
- Export CSV Listone solo Admin.
- Rose e pagina squadra.
- Fantamercato interno.
- Dashboard Presidente.
- Admin generale, diagnostica dati, convertitore listone.
- Firebase/Auth/EmailJS.
- Netlify Functions.
- News/share WhatsApp.
- Navigazione mobile e menu Altro.
- Pagine standalone `competition.html` e `player.html`.

## File principali coinvolti

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/calciomercato/calciomercato-filters-v339.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`

## File non modificati intenzionalmente

- `docs/zonaorientale/FUNZIONALITA'.md`
- `netlify/functions/calciomercato-feed.js`
- `static/zonaorientale/assets/calciomercato/links.json`
- `static/zonaorientale/assets/calciomercato/archive/*.json`
- `static/zonaorientale/assets/listoni/*.json`
- `static/zonaorientale/assets/css/refactor/calciomercato.css`
- `static/zonaorientale/assets/css/refactor/listone.css`

## Diagnostica

In console browser e' disponibile:

```js
window.ZonaOrientaleCalciomercatoFiltersV339
```

Campi utili:

```js
window.ZonaOrientaleCalciomercatoFiltersV339.getState()
window.ZonaOrientaleCalciomercatoFiltersV339.getFilteredCount()
```

## Rischi controllati

- Possibile perdita binding filtri: mitigata mantenendo il nome storico `setupCalciomercatoControlsV306()` e il flag storico di binding.
- Possibile cambio ordinamento option: mitigato copiando l'ordinamento precedente e la regola `Generale` prima delle altre squadre.
- Possibile cambio ricerca: mitigato mantenendo lo stesso haystack e lo stesso normalizzatore V306.
- Possibile cambio reload fonte/range: mitigato mantenendo la stessa chiamata a `reloadCalciomercatoDataV316()`.

## Prossimo passo consigliato

Procedere con V340: estrazione protetta del pannello `Solo Admin` / archivio Calciomercato, senza modificare Netlify Function, JSON archivio o `links.json`.
````

---

## 15. `FUNZIONALITAV340.md`

- Percorso originale: `FUNZIONALITAV340.md`
- Dimensione originale: 4143 byte
- SHA-256: `992d279d64c17d36f413d85cec0d7df4d38af998bf238fcc2d857da2a4b10651`

````markdown
# FUNZIONALITA V340 - Pannello Solo Admin e matching giocatore protetti

Versione: V340  
Data: 05/06/2026  
Ambito: refactor protetto pannello Solo Admin Calciomercato + disambiguazione matching giocatore.

## Obiettivo

Continuare il refactor della sezione Calciomercato preservando tutte le funzionalita esistenti, in particolare quelle presenti dopo l'ultimo merge su `master` e le versioni V333-V339.

La V340 interviene su due punti:

- estrazione del rendering/toggle del pannello `Solo Admin` dell'archivio Calciomercato in un modulo dedicato;
- miglioramento conservativo del matching articolo -> giocatore per evitare falsi positivi su parole minuscole usate come aggettivi, ad esempio `giovane`.

## Funzionalita V340

- Creato il modulo `assets/js/calciomercato/calciomercato-admin-v340.js`.
- Il modulo espone `createCalciomercatoArchiveAdminV340`.
- Il modulo gestisce solo:
  - view model del pannello Solo Admin;
  - rendering HTML del box archivio statico;
  - stato Espandi/Riduci;
  - aggiornamento DOM di `aria-expanded`, testo pulsante e `hidden`.
- `assets/app.js` mantiene il nome storico `renderCalciomercatoArchiveAdminToolsV323()` e lo usa come wrapper verso il modulo V340.
- `setCalciomercatoArchiveAdminExpandedV327()` resta disponibile e delega al modulo V340.
- Aggiunta diagnostica `window.ZonaOrientaleCalciomercatoArchiveAdminV340`.

## Matching giocatore V340

- Creato `assets/js/calciomercato/calciomercato-players-v340.js` come evoluzione protetta del modulo V337.
- La normalizzazione continua a rimuovere punteggiatura, separatori, apostrofi, tag HTML e spazi multipli.
- Per alias composti da una sola parola, lunghi almeno 5 caratteri, ora il match richiede anche una occorrenza capitalizzata nel testo originale.
- Esempio protetto:
  - `Giovane, il Napoli valuta il futuro` -> riconosce il giocatore `Giovane`;
  - `Il giovane talento piace al Napoli` -> non riconosce il giocatore `Giovane`.
- La logica resta conservativa:
  - nome completo;
  - cognome univoco;
  - nessun fuzzy matching aggressivo.
- Aggiunta diagnostica `window.ZonaOrientaleCalciomercatoPlayerMatchingV340` con smoke test runtime.

## Funzionalita preservate

- Calciomercato feed RSS/HTML.
- Fonti TMW squadra V329.
- Tile testuale `TMW - NomeSquadra` V330.
- Fallback favicon/fonte V328/V334.
- Card compatte V332.
- Renderer card V338.
- Filtri Calciomercato V339.
- Matching giocatore V335-V337, con policy conservativa aggiornata in V340.
- Modal timeline giocatore V336.
- Archivio statico Calciomercato V323/V324.
- Download archivio statico giornaliero dal pannello Admin Calciomercato.
- Toggle Espandi/Riduci Solo Admin V327.
- Listone e filtro Modifiche.
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
static/zonaorientale/assets/js/calciomercato/calciomercato-admin-v340.js
static/zonaorientale/assets/js/calciomercato/calciomercato-players-v340.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
docs/zonaorientale/FUNZIONALITAV340.md
docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V340.md
docs/zonaorientale/refactor/CALCIOMERCATO_ARCHIVE_ADMIN_REFACTOR_V340.md
docs/zonaorientale/release/RELEASE_V340_ARCHIVE_ADMIN_PLAYER_MATCHING.md
```

## Cose da non fare senza verifica

- Non rimuovere `calciomercato-players-v335.js` o `calciomercato-players-v337.js` solo perche sembrano legacy.
- Non rinominare ID DOM del pannello archivio, in particolare:
  - `calciomercatoArchiveAdminToolsV323`;
  - `calciomercatoArchiveToggleV326`;
  - `calciomercatoArchiveBodyV326`;
  - `calciomercatoDownloadArchiveDayV323`;
  - `calciomercatoDownloadArchiveRangeV323`.
- Non modificare `links.json`, archivi JSON o Netlify Function in questa fase.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
````

---

## 16. `FUNZIONALITAV341.md`

- Percorso originale: `FUNZIONALITAV341.md`
- Dimensione originale: 3164 byte
- SHA-256: `38b194dc0af052d9697ed5841b9f74c54dcfcc3fbb7f278e0ab939abc526bf21`

````markdown
# FUNZIONALITA V341 - Pulizia helper condivisi protetta

Versione: V341  
Data: 05/06/2026  
Ambito: refactor protetto helper puri e wrapper storici.

## Obiettivo

Proseguire la pulizia del codice senza perdere funzionalita, centralizzando alcuni helper duplicati gia' presenti in `assets/app.js` dietro un bridge condiviso.

La V341 non cambia UI, dati, feed, Firebase, Netlify o comportamento atteso delle sezioni. Mantiene i nomi storici delle funzioni di `app.js` come wrapper.

## Funzionalita V341

- Creato il modulo `assets/js/utils/shared-helper-bridge-v341.js`.
- Il modulo espone `createSharedHelperBridgeV341()`.
- Il bridge centralizza:
  - escape CSV;
  - generazione CSV da righe/colonne;
  - normalizzazione testuale loose per diagnostica/Calciomercato;
  - normalizzazione strict compatibile con `normalizeKey()` per Listone;
  - smoke test runtime.
- `assets/app.js` usa il bridge mantenendo attivi i wrapper storici:
  - `csvEscapeV278()`;
  - `buildListoneChangeExportCsvV278()`;
  - `normalizeListoneSearchKeyV269()`;
  - `normalizeDiagnosticKeyV303()`;
  - `normalizeCalciomercatoValueV306()`.
- Aggiunta diagnostica runtime `window.ZonaOrientaleSharedHelperBridgeV341`.

## Funzionalita preservate

- Calciomercato feed RSS/HTML.
- Fonti TMW squadra V329.
- Tile testuale `TMW - NomeSquadra` V330.
- Fallback favicon/fonte V328/V334.
- Card compatte V332.
- Renderer card V338.
- Filtri Calciomercato V339.
- Pannello Solo Admin archivio V340.
- Matching giocatore V340.
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
static/zonaorientale/assets/js/utils/shared-helper-bridge-v341.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
docs/zonaorientale/FUNZIONALITAV341.md
docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V341.md
docs/zonaorientale/refactor/SHARED_HELPER_BRIDGE_V341.md
docs/zonaorientale/release/RELEASE_V341_SHARED_HELPER_BRIDGE.md
```

## Funzioni storiche da non rimuovere

```text
csvEscapeV278
buildListoneChangeExportCsvV278
normalizeListoneSearchKeyV269
normalizeDiagnosticKeyV303
normalizeCalciomercatoValueV306
```

Anche se delegano al bridge V341, restano necessarie per compatibilita con patch storiche e call-site interni.

## Test consigliati

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/utils/shared-helper-bridge-v341.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```

## Note

Non modificato `docs/zonaorientale/FUNZIONALITA'.md`.
````

---

## 17. `FUNZIONALITAV342.md`

- Percorso originale: `FUNZIONALITAV342.md`
- Dimensione originale: 3603 byte
- SHA-256: `504f926925be2debcf5bf945c9f2e2859627d701ea9113334ec68ef095dfa812`

````markdown
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
````

---

## 18. `FUNZIONALITAV343.md`

- Percorso originale: `FUNZIONALITAV343.md`
- Dimensione originale: 3280 byte
- SHA-256: `18883670b77fea9da85fba5c5f7c8f3d1156b95a098efd9674f0d14b910f8440`

````markdown
# FUNZIONALITAV343 - Cleanup CSS legacy e Diagnostica Admin

Versione: V343
Data: 05/06/2026

## Obiettivo

La V343 prosegue il refactor protetto senza rimuovere o scollegare funzionalita runtime. La modifica principale e doppia:

1. preparare e verificare la rimozione controllata dei CSS refactor versionati V291/V292 ormai sostituiti dagli alias stabili;
2. rendere visibile il funzionamento del tasto Admin `Aggiorna diagnostica` mostrando data e ora italiana dell'ultimo refresh.

Il file canonico `FUNZIONALITA'.md` non e stato modificato.

## Funzionalita preservate

- Dashboard pubblica e navigazione principale.
- Menu mobile, bottom navigation, menu Altro e pulsante Su.
- Tema Dark unico e Light mode sospesa.
- News e share WhatsApp dinamico.
- Listone pubblico e Admin, filtro Modifiche, colonna Modifica, usciti storici, export CSV solo Admin.
- Rose pubbliche, pagina squadra, dettagli rosa e tabelle mobile.
- Fantamercato interno e flussi presidente.
- Dashboard Presidente.
- Admin generale: login, rendering pannelli, attach handlers, richieste presidenti, convertitore listone, diagnostica dati.
- Diagnostica dati Admin V276/V303/V321/V322.
- Calciomercato: feed RSS/HTML, TMW squadre, archivio statico, Solo Admin, download JSON, filtri, card compatte, fallback immagini, tag giocatore, timeline modal.
- Netlify Functions `news-share.js` e `calciomercato-feed.js`.
- Firebase, Auth, EmailJS.
- Pagine standalone `competition.html` e `player.html`.

## Nuovo comportamento visibile

Nel pannello Admin `Diagnostica dati`, vicino al pulsante `Aggiorna diagnostica`, appare:

```text
Ultimo aggiornamento: mai aggiornata in questa sessione
```

Dopo il click viene mostrata data/ora italiana, per esempio:

```text
Ultimo aggiornamento: 05/06/2026, 09:31:22
```

Il refresh resta locale e non scrive su Firebase.

## Pulizia CSS legacy

Sono candidati alla rimozione controllata:

```text
assets/css/refactor/mobile-controls-v291.css
assets/css/refactor/rosters-tables-v291.css
assets/css/refactor/mobile-controls-v292.css
assets/css/refactor/rosters-tables-v292.css
assets/css/refactor/theme-light-suspended-v292.css
```

Sono preservati come CSS attivi/stabili:

```text
assets/css/refactor/mobile-controls.css
assets/css/refactor/rosters-tables.css
assets/css/refactor/listone.css
assets/css/refactor/calciomercato.css
assets/css/refactor/theme-light-suspended.css
```

La pulizia e assistita da:

```bash
static/zonaorientale/tools/cleanup-css-legacy-v343.sh
```

Dry-run:

```bash
static/zonaorientale/tools/cleanup-css-legacy-v343.sh
```

Applicazione:

```bash
static/zonaorientale/tools/cleanup-css-legacy-v343.sh --apply
```

## Diagnostiche runtime

```js
window.ZonaOrientaleAdminDiagnosticsV343
window.ZonaOrientaleCssLegacyCleanupV343
```

Smoke test Admin:

```js
window.ZonaOrientaleAdminDiagnosticsV343.runSmokeTest()
```

## Test richiesti dopo applicazione

```bash
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-admin-functions-v343.mjs
static/zonaorientale/tools/cleanup-css-legacy-v343.sh
```

## Note per i prossimi refactor

Non cancellare altri JS/CSS legacy senza una release dedicata. I prossimi candidati JS, come vecchi moduli Calciomercato player matching, restano da verificare separatamente.
````

---

## 19. `FUNZIONALITAV344.md`

- Percorso originale: `FUNZIONALITAV344.md`
- Dimensione originale: 3259 byte
- SHA-256: `ac93faa172b0ae7432e2ed1eebe8ceaa8828c50722db2c422a1b949fef096003`

````markdown
# FUNZIONALITAV344 - Cleanup JS legacy Calciomercato player

Versione: V344  
Data: 05/06/2026

## Obiettivo

La V344 prosegue il refactor protetto con la rimozione controllata dei vecchi moduli JS Calciomercato player superati:

```text
assets/js/calciomercato/calciomercato-players-v335.js
assets/js/calciomercato/calciomercato-players-v337.js
```

Il runtime usa gia il modulo attivo:

```text
assets/js/calciomercato/calciomercato-players-v340.js
```

La rimozione non cambia comportamento utente: i nomi storici delle funzioni restano in `assets/app.js` come wrapper di compatibilita.

Il file canonico `FUNZIONALITA'.md` non e stato modificato.

## Funzionalita preservate

- Dashboard pubblica e navigazione principale.
- Menu mobile, bottom navigation, menu Altro e pulsante Su.
- Tema Dark unico e Light mode sospesa.
- News e share WhatsApp dinamico.
- Listone pubblico e Admin, filtro Modifiche, colonna Modifica, usciti storici, export CSV solo Admin.
- Rose pubbliche, pagina squadra, dettagli rosa e tabelle mobile.
- Fantamercato interno e flussi presidente.
- Dashboard Presidente.
- Admin generale: login, rendering pannelli, attach handlers, richieste presidenti, convertitore listone, diagnostica dati.
- Diagnostica dati Admin con timestamp ultimo refresh V343.
- Calciomercato: feed RSS/HTML, TMW squadre, archivio statico, Solo Admin, download JSON, filtri, card compatte, fallback immagini, tag giocatore, timeline modal.
- Netlify Functions `news-share.js` e `calciomercato-feed.js`.
- Firebase, Auth, EmailJS.
- Pagine standalone `competition.html` e `player.html`.

## Calciomercato player matching/timeline

Restano attivi:

```text
assets/js/calciomercato/calciomercato-players-v340.js
renderCalciomercatoPlayerTagsV335()
activateCalciomercatoPlayerTimelineFromHashV335()
normalizeCalciomercatoPlayerMatchValueV337()
window.ZonaOrientaleCalciomercatoPlayersV335
window.ZonaOrientaleCalciomercatoPlayerMatchingV340
window.ZonaOrientaleCalciomercatoPlayerModalV336
```

Il fatto che alcune funzioni mantengano suffissi V335/V337 e intenzionale: sono wrapper pubblici usati dal runtime e dai refactor successivi. Non vanno rinominati senza piano dedicato.

## File rimossi

La V344 rimuove solo questi candidati gia superati da V340:

```text
assets/js/calciomercato/calciomercato-players-v335.js
assets/js/calciomercato/calciomercato-players-v337.js
```

Se si applica lo zip con `cp -R`, la cancellazione va fatta con `git rm`, perche lo zip non puo eliminare file gia presenti nella repo locale.

## Nuovo tool

```bash
static/zonaorientale/tools/audit-js-legacy-v344.mjs
```

Verifica che:

- i moduli attivi Calciomercato siano presenti;
- i moduli player V335/V337 siano rimossi;
- `app.js` importi V340;
- i wrapper compatibili restino presenti;
- la diagnostica V344 sia esposta.

## Diagnostica runtime

```js
window.ZonaOrientaleJsLegacyCleanupV344.runSmokeTest()
```

## Regole per il prossimo assistente AI

- Non ripristinare `calciomercato-players-v335.js` o `calciomercato-players-v337.js` salvo rollback esplicito.
- Non rinominare i wrapper V335/V337 rimasti in `app.js` senza audit completo.
- Non toccare `FUNZIONALITA'.md` senza richiesta esplicita.
- Preservare tutte le funzionalita dell'ultimo merge su master.
````

---

## 20. `FUNZIONALITAV345.md`

- Percorso originale: `FUNZIONALITAV345.md`
- Dimensione originale: 3194 byte
- SHA-256: `4ee9776fb081561f74e032ab1e730bb95f063378fa771c08878620dee1c1d329`

````markdown
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
````

---

## 21. `FUNZIONALITAV346.md`

- Percorso originale: `FUNZIONALITAV346.md`
- Dimensione originale: 3787 byte
- SHA-256: `48683520bb40c934ddf9de474f446de3b1a66151cc6d3ddfaa2644619c01ed21`

````markdown
# FUNZIONALITAV346 - ZonaOrientale

Versione: V346 audit candidati legacy minori  
Data: 05/06/2026

## Obiettivo della release

La V346 e' una release di audit-only: non cancella file e non cambia UI o dati. Serve a classificare i candidati legacy minori rimasti dopo le pulizie V343-V345 e a preparare eventuali rimozioni future in versioni dedicate, una alla volta.

## Funzionalita preservate

- Home pubblica con sezioni principali, navigazione desktop/mobile e footer versione.
- Calciomercato con feed RSS/HTML, fonti TMW squadra, archivio statico, filtri, card compatte, fallback immagini/favicon/TMW, tag giocatore, matching conservativo, timeline giocatore in modal e pannello Solo Admin.
- Listone con stagione selezionata, ricerca, ruoli, filtro `Modifiche`, colonna `Modifica`, usciti storici ed export CSV riservato Admin.
- Rose, pagina squadra e pagina giocatore standalone.
- Fantamercato interno e gestione mercato.
- Dashboard Presidente.
- Area Admin generale, Diagnostica dati con timestamp ultimo refresh, richieste presidenti e convertitore listone.
- Firebase/Auth/EmailJS.
- Netlify Functions e share News/WhatsApp.
- Mobile bottom navigation, menu `Altro`, pulsante Su e viewport mobile adattivo.

## Modifica tecnica

- Aggiunto tool `static/zonaorientale/tools/audit-minor-legacy-v346.mjs`.
- Aggiunta diagnostica runtime `window.ZonaOrientaleMinorLegacyAuditV346`.
- Aggiornato `check-zonaorientale.sh` per verificare tool, marker e documentazione V346.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V346.
- Nessun file e' stato rimosso in questa versione.

## Candidati classificati ma NON rimossi

| File | Stato | Policy |
| --- | --- | --- |
| `assets/js/dev/trade-notification-simulator-v254.js` | candidato review | versione dev precedente; non rimuovere senza test notifiche trade |
| `assets/js/trade-notification-simulator-v255.js` | candidato review | possibile duplicato top-level; app importa `assets/js/dev/trade-notification-simulator-v255.js` |
| `assets/js/refactor/admin-publication-workflow-v213.js` | candidato review | storico Admin/pubblicazione; non rimuovere senza test Admin dedicato |
| `assets/css/mobile-hotfix-v166.css` | candidato review | hotfix mobile storico; verificare mobile light/dark |
| `assets/css/mobile-hotfix-v167.css` | candidato review | hotfix mobile storico; verificare mobile light/dark |
| `assets/css/refactor/theme-light-suspended.css` | candidato review | tema sospeso/storico; non rimuovere senza verifica rollback/light theme |
| `assets/js/domain/competitions.js` | candidato review | modulo dominio competizioni; non rimuovere senza verifica `competition.html` e orchestratori |

## Funzionalita a rischio e mitigazione

| Area | Rischio | Mitigazione V346 |
| --- | --- | --- |
| Notifiche trade/simulatore dev | rimuovere il file sbagliato | solo audit, nessuna rimozione |
| Admin pubblicazione/comunicati | scollegare workflow storico | solo classificazione, nessuna modifica al runtime |
| Mobile light/dark | perdere hotfix storico | nessuna rimozione CSS mobile |
| Competizioni | rimuovere modulo non importato direttamente ma utile a refactor futuri | nessuna rimozione e note in matrice |
| Calciomercato/Listone/Admin | regressioni da cleanup generico | controlli runtime V346 e check globale |

## Cosa non e' stato modificato

- `docs/zonaorientale/FUNZIONALITA'.md`.
- Netlify Functions.
- `assets/calciomercato/links.json`.
- Archivi JSON Calciomercato.
- JSON Listone.
- CSS runtime.
- Logiche Firebase/Auth/EmailJS.
- Rendering card Calciomercato, filtri, Admin, Listone, Rose e Dashboard Presidente.

## Verifiche consigliate dopo applicazione

```bash
static/zonaorientale/tools/audit-minor-legacy-v346.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```
````

---

## 22. `FUNZIONALITAV347.md`

- Percorso originale: `FUNZIONALITAV347.md`
- Dimensione originale: 4114 byte
- SHA-256: `1b255d1152c09a86408611f9d75b3c95e2c6e188f67a269fc34ab8049bbc11b6`

````markdown
# FUNZIONALITAV347 - ZonaOrientale

Versione: V347 cleanup controllato duplicato simulatore trade  
Data: 05/06/2026

## Obiettivo della release

La V347 rimuove in modo controllato il duplicato top-level `assets/js/trade-notification-simulator-v255.js`. Il runtime continua a usare la copia canonica gia importata da `assets/js/dev/trade-notification-simulator-v255.js`.

La release non cambia UI, dati, Firebase, Netlify Functions o logiche di business.

## Funzionalita preservate

- Home pubblica con sezioni principali, navigazione desktop/mobile e footer versione.
- Calciomercato con feed RSS/HTML, fonti TMW squadra, archivio statico, filtri, card compatte, fallback immagini/favicon/TMW, tag giocatore, matching conservativo, timeline giocatore in modal e pannello Solo Admin.
- Listone con stagione selezionata, ricerca, ruoli, filtro `Modifiche`, colonna `Modifica`, usciti storici ed export CSV riservato Admin.
- Rose, pagina squadra e pagina giocatore standalone.
- Fantamercato interno, inclusi flussi trade e notifiche.
- Simulatore notifiche trade dev V255 tramite `assets/js/dev/trade-notification-simulator-v255.js`.
- Dashboard Presidente.
- Area Admin generale, Diagnostica dati con timestamp ultimo refresh, richieste presidenti e convertitore listone.
- Firebase/Auth/EmailJS.
- Netlify Functions e share News/WhatsApp.
- Mobile bottom navigation, menu `Altro`, pulsante Su e viewport mobile adattivo.

## Modifica tecnica

- Rimosso il file duplicato non canonico `static/zonaorientale/assets/js/trade-notification-simulator-v255.js`.
- Preservato il file canonico `static/zonaorientale/assets/js/dev/trade-notification-simulator-v255.js`.
- Aggiunto tool `static/zonaorientale/tools/audit-trade-simulator-v347.mjs`.
- Aggiunta diagnostica runtime `window.ZonaOrientaleTradeSimulatorCleanupV347`.
- Aggiornato `check-zonaorientale.sh` per verificare assenza del duplicato, presenza della copia canonica e documentazione V347.
- Aggiornati cache-buster, footer e `DEPLOY_EXPECTED_VERSION_V181` a V347.

## Funzionalita a rischio e mitigazione

| Area | Rischio | Mitigazione V347 |
| --- | --- | --- |
| Notifiche trade dev | rimuovere il file importato davvero | audit dedicato verifica che `app.js` importi `assets/js/dev/trade-notification-simulator-v255.js?v=347` |
| Fantamercato interno | scollegare merge simulazioni locali | nessun cambio al modulo canonico o ai call-site in `app.js` |
| Workflow Admin/Fantamercato | perdere strumenti di test | il modulo dev V255 resta presente e importato |
| Link storici | eventuale link diretto al duplicato top-level | audit verifica assenza di link in `index.html`, `competition.html`, `player.html`; documentazione storica resta solo come nota |

## Candidati ancora da valutare, NON rimossi

| File | Stato | Policy |
| --- | --- | --- |
| `assets/js/dev/trade-notification-simulator-v254.js` | candidato review | vecchia versione dev; non rimuovere senza test notifiche trade dedicato |
| `assets/js/refactor/admin-publication-workflow-v213.js` | candidato review | storico Admin/pubblicazione; non rimuovere senza test Admin dedicato |
| `assets/css/mobile-hotfix-v166.css` | candidato review | hotfix mobile storico; verificare mobile light/dark |
| `assets/css/mobile-hotfix-v167.css` | candidato review | hotfix mobile storico; verificare mobile light/dark |
| `assets/css/refactor/theme-light-suspended.css` | candidato review | tema sospeso/storico; non rimuovere senza verifica rollback/light theme |
| `assets/js/domain/competitions.js` | candidato review | modulo dominio competizioni; non rimuovere senza verifica `competition.html` e orchestratori |

## Cosa non e' stato modificato

- `docs/zonaorientale/FUNZIONALITA'.md`.
- Netlify Functions.
- `assets/calciomercato/links.json`.
- Archivi JSON Calciomercato.
- JSON Listone.
- CSS runtime.
- Logiche Firebase/Auth/EmailJS.
- Rendering card Calciomercato, filtri, Admin, Listone, Rose e Dashboard Presidente.

## Verifiche consigliate dopo applicazione

```bash
static/zonaorientale/tools/audit-trade-simulator-v347.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```
````

---

## 23. `FUNZIONALITAV348.md`

- Percorso originale: `FUNZIONALITAV348.md`
- Dimensione originale: 4043 byte
- SHA-256: `11b70d29110f07bf1f265dcbb92d3ba06b5df4075441e8567d3bd8456ca96d10`

````markdown
# FUNZIONALITAV348 - ZonaOrientale

Versione: V348 audit simulatore trade dev  
Data: 05/06/2026

## Obiettivo della release

La V348 verifica in modo mirato il vecchio modulo `assets/js/dev/trade-notification-simulator-v254.js` rispetto al modulo attivo `assets/js/dev/trade-notification-simulator-v255.js`.

La release e' audit-only per questo candidato: non cancella file, non cambia UI, non cambia dati e non tocca Firebase o Netlify Functions.

## Esito tecnico

- Il runtime importa il simulatore trade canonico V255 da `assets/js/dev/trade-notification-simulator-v255.js`.
- Il modulo V254 non risulta importato dal runtime.
- Il modulo V255 mantiene l'alias console `window.ZonaOrientaleTradeSimulatorV254 = api`, quindi eventuali appunti/comandi storici V254 restano compatibili.
- Il modulo V255 contiene helper diagnostici aggiuntivi, tra cui `getTestCommands`, `help`, `printHelp` e `runLocalSmokeTest`.
- Il modulo V254 resta candidato review, ma non viene rimosso in V348.

## Funzionalita preservate

- Home pubblica con navigazione desktop/mobile e footer versione.
- Calciomercato con feed RSS/HTML, fonti TMW squadra, archivio statico, filtri, card compatte, fallback immagini/favicon/TMW, tag giocatore, matching conservativo, timeline giocatore in modal e pannello Solo Admin.
- Listone con stagione, ricerca, ruoli, filtro `Modifiche`, colonna `Modifica`, usciti storici ed export CSV Admin.
- Rose, pagina squadra e pagina giocatore standalone.
- Fantamercato interno, incluse notifiche trade, badge e simulatore dev V255.
- Dashboard Presidente.
- Area Admin generale, Diagnostica dati con timestamp ultimo refresh, richieste presidenti e convertitore listone.
- Firebase/Auth/EmailJS.
- Netlify Functions e share News/WhatsApp.
- Mobile bottom navigation, menu `Altro`, pulsante Su e viewport mobile adattivo.

## Funzionalita a rischio e mitigazione

| Area | Rischio | Mitigazione V348 |
| --- | --- | --- |
| Fantamercato interno | scollegare il simulatore trade usato dal runtime | nessuna modifica al modulo V255 e audit dedicato su import runtime |
| Notifiche trade | perdere comandi console storici V254 | V255 mantiene alias `window.ZonaOrientaleTradeSimulatorV254` |
| Cleanup legacy | cancellare V254 troppo presto | V348 non cancella file, classifica soltanto il candidato |
| Test futuri | non sapere quale modulo usare | documentata la copia attiva V255 e aggiunto tool `audit-trade-simulator-dev-v348.mjs` |

## File principali

- `static/zonaorientale/tools/audit-trade-simulator-dev-v348.mjs`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`

## Marker runtime

```js
window.ZonaOrientaleTradeSimulatorDevAuditV348
```

## Verifiche consigliate dopo applicazione

```bash
static/zonaorientale/tools/audit-trade-simulator-dev-v348.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

## Candidati ancora da valutare, NON rimossi

| File | Stato | Policy |
| --- | --- | --- |
| `assets/js/dev/trade-notification-simulator-v254.js` | candidato review | rimuovere solo con V dedicata dopo test manuale simulatore V255 e badge Fantamercato |
| `assets/js/refactor/admin-publication-workflow-v213.js` | candidato review | non rimuovere senza test Admin/pubblicazione |
| `assets/css/mobile-hotfix-v166.css` | candidato review | verificare mobile light/dark prima di cleanup |
| `assets/css/mobile-hotfix-v167.css` | candidato review | verificare mobile light/dark prima di cleanup |
| `assets/css/refactor/theme-light-suspended.css` | candidato review | non rimuovere senza verifica tema light e rollback |
| `assets/js/domain/competitions.js` | candidato review | non rimuovere senza verifica `competition.html` e orchestratori |

## Cosa non e' stato modificato

- `docs/zonaorientale/FUNZIONALITA'.md`.
- Netlify Functions.
- `assets/calciomercato/links.json`.
- Archivi JSON Calciomercato.
- JSON Listone.
- CSS runtime.
- Logiche Firebase/Auth/EmailJS.
- Rendering card Calciomercato, filtri, Admin, Listone, Rose, Dashboard Presidente e Fantamercato.
````

---

## 24. `FUNZIONALITAV349.md`

- Percorso originale: `FUNZIONALITAV349.md`
- Dimensione originale: 2664 byte
- SHA-256: `a288488860ab1cd7d468f7f2d3e7de6da61fb1c3f6dd3c59e9858b9c1d5b072c`

````markdown
# FUNZIONALITAV349 - ZonaOrientale

Versione: V349  
Data: 05/06/2026  
Tipo: fix/refactor protetto su simulatore notifiche Fantamercato.

## Obiettivo V349

La V349 corregge il comportamento delle trattative simulate create da console con:

```js
ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()
```

Prima della V349, la card simulata compariva correttamente e accendeva la notifica, ma i pulsanti reali `Accetta` / `Rifiuta` chiamavano il flusso Firebase storico e potevano generare:

```text
Missing or Insufficient permissions
```

La V349 intercetta solo le righe simulate/local-only e aggiorna stato, card e badge localmente, senza scritture Firebase.

## Funzionalita nuove o corrette

- Riconoscimento trattative simulate tramite `localOnly === true` o `source === dev-simulator-v255`.
- `Rifiuta` su una proposta simulata ricevuta aggiorna la card a `REJECTED` localmente.
- `Accetta` su una proposta simulata ricevuta aggiorna la card a `ACCEPTED` localmente.
- Il badge notifica trattative viene ricalcolato dopo la risposta simulata.
- `Annulla` su una proposta simulata inviata rimuove la riga locale senza Firebase.
- Le trattative reali continuano a usare il flusso storico Firebase.

## Regola importante: simulazione vs reale

### Simulazione locale

Per test rapidi da console:

```js
ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()
```

Poi si puo cliccare direttamente su `Accetta` o `Rifiuta` nella card. Da V349 non deve comparire errore permessi.

### Trattativa reale

Per trattative reali salvate in `transferNegotiations`:

- una notifica ricevuta si spegne quando il presidente destinatario accetta/rifiuta la trattativa;
- una notifica di esito per il mittente si spegne quando l'esito viene aperto/marcato come letto;
- se Firebase nega il salvataggio della lettura, resta il fallback locale V246.

## Funzionalita preservate

- Fantamercato interno reale.
- Notifiche trattative reali.
- Simulatore V255 e alias V254.
- Firebase/Auth/EmailJS.
- Calciomercato, feed, archivio, tag giocatore, timeline modal.
- Listone, Rose, Dashboard Presidente.
- Admin e Diagnostica dati.
- Netlify Functions.
- Navigazione mobile.

## File principali modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-trade-simulator-local-actions-v349.mjs`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`

## Marker runtime

```js
window.ZonaOrientaleTradeSimulatorLocalActionsV349
```

Smoke test browser:

```js
window.ZonaOrientaleTradeSimulatorLocalActionsV349.runSmokeTest()
```
````

---

## 25. `FUNZIONALITAV350.md`

- Percorso originale: `FUNZIONALITAV350.md`
- Dimensione originale: 1988 byte
- SHA-256: `77169e8db706d120fa098eaa1ae5c744915e6490a3e7fca31e6db739186f1234`

````markdown
# FUNZIONALITAV350 - ZonaOrientale

Versione: V350  
Data: 05/06/2026  
Tipo: cleanup/refactor protetto su simulatore notifiche Fantamercato.

## Obiettivo V350

La V350 rimuove in modo controllato il vecchio modulo:

```text
assets/js/dev/trade-notification-simulator-v254.js
```

Il runtime era gia collegato al modulo canonico:

```text
assets/js/dev/trade-notification-simulator-v255.js
```

La V349 ha inoltre corretto le azioni locali `Accetta` / `Rifiuta` sulle simulazioni, quindi V254 non e piu necessario come file fisico.

## Funzionalita preservate

- Simulatore console `ZonaOrientaleTradeSimulatorV255`.
- Alias storico console `ZonaOrientaleTradeSimulatorV254`, mantenuto dal modulo V255.
- Simulazioni locali con `simulateIncomingProposal()`.
- Azioni locali V349 su `Accetta` / `Rifiuta` senza scrittura Firebase.
- Notifiche trattative reali.
- Flusso Firebase reale del Fantamercato interno.
- Badge notifiche presidente.
- Calciomercato, tag giocatore e timeline modal.
- Listone, Rose, Dashboard Presidente.
- Admin e Diagnostica dati.
- Firebase/Auth/EmailJS.
- Netlify Functions.
- Navigazione mobile.

## File rimosso

```text
static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js
```

Nota operativa: lo zip non puo cancellare file gia presenti nella repo dell'utente. Dopo il `cp -R` serve `git rm --ignore-unmatch static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js`.

## File principali modificati

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-trade-simulator-dev-v348.mjs`
- `static/zonaorientale/tools/audit-trade-simulator-dev-cleanup-v350.mjs`
- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`

## Marker runtime

```js
window.ZonaOrientaleTradeSimulatorDevCleanupV350
```

Smoke test browser:

```js
window.ZonaOrientaleTradeSimulatorDevCleanupV350.runSmokeTest()
```
````

---

## 26. `FUNZIONALITAV351.md`

- Percorso originale: `FUNZIONALITAV351.md`
- Dimensione originale: 995 byte
- SHA-256: `0866752c1ca8503b884501875ac37a2206bc3916cc48d45f265f5bb79b23119d`

```markdown
# FUNZIONALITAV351 - Audit workflow pubblicazione Admin

Versione: V351
Tipo: audit/refactor protetto

## Obiettivo

Verificare il modulo legacy `assets/js/refactor/admin-publication-workflow-v213.js` senza rimuoverlo e senza cambiare il comportamento runtime.

## Funzionalita preservate

- Admin generale.
- Diagnostica dati Admin con timestamp V343.
- Stato Firebase / JSON V190.
- Preflight asset pubblici V179/V203.
- Promemoria pubblicazione dati V189.
- Calciomercato Solo Admin e archivio statico.
- Listone, Rose, Dashboard Presidente e Fantamercato interno.
- Firebase/Auth/EmailJS.
- Netlify Functions.
- Navigazione mobile.

## Esito audit

Il workflow pubblicazione attivo e inline in `assets/app.js`. Il file V213 resta un modulo storico non importato direttamente dal runtime corrente.

La V351 non cancella file.

## Tool

- `static/zonaorientale/tools/audit-admin-publication-workflow-v351.mjs`

## Diagnostica browser

- `window.ZonaOrientaleAdminPublicationWorkflowAuditV351`
```

---

## 27. `FUNZIONALITAV352.md`

- Percorso originale: `FUNZIONALITAV352.md`
- Dimensione originale: 1724 byte
- SHA-256: `d8d920341e9fc869d5e19112a2882ecd7ad91c536f1c95b014cf81d7bd09657d`

```markdown
# FUNZIONALITA V352 - Cleanup mobile hotfix legacy

Versione: V352  
Data: 05/06/2026

## Obiettivo

Pulizia controllata dei CSS mobile legacy `mobile-hotfix-v166.css` e `mobile-hotfix-v167.css`, gia inglobati in `mobile-suite-v168.css` e non linkati dagli HTML correnti.

## Funzionalita preservate

- Navigazione mobile inferiore.
- Menu mobile `Altro`, incluse icone dinamiche.
- Vista mobile senza switch manuale desktop/mobile.
- Layout mobile delle card Calciomercato.
- Tabelle mobile Rose/Listone.
- Tema light/dark e contrasto mobile.
- `competition.html` e `player.html` con mobile chrome.
- Calciomercato feed, archivi, filtri, card compatte, tag giocatore e modal timeline.
- Listone, export admin-only, filtro Modifiche.
- Rose, Dashboard Presidente, Fantamercato interno e notifiche trade.
- Admin, Diagnostica dati, Stato Firebase/JSON e preflight pubblicazione.
- Firebase/Auth/EmailJS, Netlify Functions e share News.

## File rimossi con git rm

- `static/zonaorientale/assets/css/mobile-hotfix-v166.css`
- `static/zonaorientale/assets/css/mobile-hotfix-v167.css`

## File attivi da preservare

- `static/zonaorientale/assets/css/mobile-suite-v168.css`
- `static/zonaorientale/assets/css/mobile-chrome-v223.css`
- `static/zonaorientale/assets/css/refactor/mobile-controls.css`
- `static/zonaorientale/assets/css/refactor/rosters-tables.css`
- `static/zonaorientale/assets/css/refactor/listone.css`
- `static/zonaorientale/assets/css/refactor/calciomercato.css`

## Test obbligatori

- `static/zonaorientale/tools/audit-mobile-hotfix-v352.mjs`
- `static/zonaorientale/tools/check-zonaorientale.sh`
- `static/zonaorientale/tools/audit-assets-v298.sh --quiet`
- `static/zonaorientale/tools/audit-css-v300.sh`
```

---

## 28. `FUNZIONALITAV353.md`

- Percorso originale: `FUNZIONALITAV353.md`
- Dimensione originale: 1799 byte
- SHA-256: `8c4c2fae4b8e9d0aa56b2f8ecfd3ea0b7c99479426196793ebe4870b93a707a2`

````markdown
# FUNZIONALITAV353 - Audit tema Light sospeso e dominio competizioni

## Scopo versione

La V353 esegue un audit mirato, senza rimozioni automatiche, su due candidati legacy rimasti dopo il cleanup V352:

- `assets/css/refactor/theme-light-suspended.css`
- `assets/js/domain/competitions.js`

## Esito funzionale

Nessuna funzionalita cambia comportamento in V353.

## Funzionalita preservate

- Dashboard pubblica e privata.
- Calciomercato, feed RSS/HTML, archivio statico e pannello Solo Admin.
- Card compatte Calciomercato, fallback immagini e timeline giocatore modal.
- Listone, filtro Modifiche, export CSV Admin e manifest Listoni.
- Rose, pagine squadra e pagina giocatore.
- Competizioni, `competition.html`, ordinamento competizioni e gruppi pubblici.
- Fantamercato interno, trattative, notifiche reali e simulatore V255.
- Admin, Diagnostica dati, Stato Firebase/JSON e preflight asset pubblici.
- Firebase/Auth/EmailJS e Netlify Functions.
- Navigazione mobile, menu Altro e tema corrente.

## File auditati

- `theme-light-suspended.css` resta conservato come archivio/rollback della Light mode. Non e importato dagli HTML.
- `domain/competitions.js` resta conservato come modulo storico non importato. Le funzioni canoniche per competizioni restano inline in `assets/app.js`.

## File nuovi

- `static/zonaorientale/tools/audit-theme-competitions-v353.mjs`
- `docs/zonaorientale/audit/THEME_COMPETITIONS_AUDIT_MATRIX_V353.md`
- `docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V353.md`
- `docs/zonaorientale/refactor/THEME_COMPETITIONS_AUDIT_V353.md`
- `docs/zonaorientale/release/RELEASE_V353_THEME_COMPETITIONS_AUDIT.md`

## Marker runtime

```js
window.ZonaOrientaleThemeCompetitionsAuditV353
```

## Decisione V353

Audit-only. Nessun `git rm` richiesto in questa versione.
````

---

## 29. `FUNZIONALITAV354.md`

- Percorso originale: `FUNZIONALITAV354.md`
- Dimensione originale: 3634 byte
- SHA-256: `1b1597ebe4cec2c58a720cf5a723795b69c1dd10dc5e605080ad3d712a791bdc`

```markdown
# FUNZIONALITAV354 - Consolidamento ciclo cleanup/refactor

Versione: V354  
Tipo: consolidamento documentale/audit  
Impatto funzionale: nessun cambio intenzionale  
File storico protetto non modificato: `docs/zonaorientale/FUNZIONALITA'.md`

## Obiettivo

La V354 chiude il ciclo di refactor e cleanup iniziato con V333 e arrivato a V353. Non rimuove file, non cambia flussi utente e non modifica dati statici o funzioni server. Serve a lasciare al futuro assistente AI una mappa chiara di cosa e stato fatto, cosa e rimasto protetto e quali interventi possono essere valutati in futuro.

## Funzionalita da preservare

- Calciomercato con feed RSS, pagine TMW squadra, archivio statico e download Solo Admin.
- Card articoli compatte, fallback favicon/fonte/TMW testuale e tag giocatore.
- Timeline giocatore in modal chiudibile con X, click sfondo ed Escape.
- Matching giocatore conservativo basato sull'ultimo Listone della stagione selezionata.
- Disambiguazione maiuscole/minuscole per evitare falsi positivi come `giovane` aggettivo vs `Giovane` giocatore.
- Filtri Calciomercato: Cerca, Da, A, squadra, topic, fonte.
- Pannello Solo Admin Calciomercato con espandi/riduci e archivio statico.
- Admin generale e Diagnostica dati con timestamp ultimo aggiornamento.
- Listone, filtro Modifiche, export CSV, manifest/listoni statici.
- Rose, Dashboard Presidente e Fantamercato interno.
- Notifiche trattative reali e simulatore locale `ZonaOrientaleTradeSimulatorV255`.
- Azioni simulate Accetta/Rifiuta senza scrittura Firebase.
- Auth, Firebase, EmailJS e Netlify Functions.
- News/share WhatsApp.
- Mobile bottom navigation, menu Altro e layout mobile forzato senza switch desktop.
- `competition.html` e `player.html`.

## Stato cleanup/refactor

Completati nel ciclo V333-V353:

- CSS Listone separato dal CSS mobile generico.
- Helper immagini Calciomercato estratti.
- Modulo player Calciomercato aggiornato fino a V340.
- Renderer card Calciomercato estratto.
- Filtri Calciomercato estratti.
- Pannello Solo Admin Calciomercato estratto.
- Bridge helper condivisi aggiunto.
- Vecchi CSS refactor e mobile hotfix rimossi in modo controllato.
- Vecchi moduli player Calciomercato rimossi in modo controllato.
- Vecchio helper condiviso V294 rimosso in modo controllato.
- Duplicati simulatori trade rimossi lasciando attivo V255.
- Audit eseguiti su workflow pubblicazione Admin, tema Light sospeso e modulo domain/competitions.

## Stato file ancora da valutare

Rimangono volutamente non rimossi:

- `assets/js/refactor/admin-publication-workflow-v213.js`: non importato, ma da rimuovere solo dopo test manuale Admin pubblicazione.
- `assets/css/refactor/theme-light-suspended.css`: archivio/rollback tema Light, non importato.
- `assets/js/domain/competitions.js`: duplicato storico non importato, ma da rimuovere solo dopo test manuale completo su Dashboard Competizioni e `competition.html`.

## Verifiche V354

- `DEPLOY_EXPECTED_VERSION_V181 = "354"`.
- Cache-buster HTML e import JS allineati a `?v=354`.
- Marker runtime `window.ZonaOrientaleRefactorConsolidationV354`.
- Tool `tools/audit-refactor-consolidation-v354.mjs`.
- Documenti V354 presenti.

## Prossime attivita consigliate

Prima di nuove rimozioni: eseguire test manuale completo su Calciomercato, Admin, Listone, Rose, Dashboard Presidente, Fantamercato, simulatore trade e pagine mobile.

Poi valutare, solo in task separati:

1. eventuale cleanup `domain/competitions.js`;
2. eventuale cleanup `theme-light-suspended.css`;
3. eventuale cleanup `admin-publication-workflow-v213.js`;
4. nuovo ciclo di refactor solo su sezioni piccole e isolate.
```

---

## 30. `FUNZIONALITAV355.md`

- Percorso originale: `FUNZIONALITAV355.md`
- Dimensione originale: 4023 byte
- SHA-256: `07e4131320e0ff5afd34a95c39c1db57726660a139ab0e0a2965c371335e67d8`

````markdown
# FUNZIONALITAV355 - Stato funzionale consolidato

Versione: V355  
Data: 05/06/2026  
Tipo: suite regressione/smoke post cleanup e refactor.  
Impatto funzionale: nessun cambio funzionale previsto.

## Obiettivo V355

La V355 non introduce nuove funzionalita utente e non rimuove file. Serve a mettere in sicurezza il lavoro V333-V354 con una matrice di regressione manuale e un audit statico dedicato.

## Funzionalita da preservare

### Navigazione e shell del sito

- Home `index.html`.
- Navigazione desktop.
- Navigazione mobile bottom bar.
- Menu mobile `Altro`.
- Assenza dello switch mobile/desktop da mobile.
- Footer versione e cache-buster allineati.
- `competition.html` per dettaglio competizione.
- `player.html` per dettaglio giocatore.

### Autenticazione e ruoli

- Login Firebase/Auth.
- Utenti presidente approvati.
- Area Admin.
- Controlli condizionali per funzionalita Solo Admin.
- EmailJS e flussi collegati.

### Calciomercato

- Feed RSS classici.
- Feed HTML TMW squadra.
- Fonti in `assets/calciomercato/links.json`.
- Archivio statico `assets/calciomercato/archive/`.
- Manifest archivio.
- Filtri Cerca, Da, A, squadra, topic, fonte.
- Card articolo compatte.
- Titolo e immagine cliccabili.
- Nessuna anteprima testo nelle card.
- Fallback favicon fonte.
- Fallback tile testuale `TMW - NomeSquadra`.
- Tag giocatore sopra il titolo articolo.
- Matching giocatore con normalizzazione punteggiatura e disambiguazione maiuscole/minuscole.
- Timeline articoli giocatore in modal chiudibile con X/sfondo/Escape.
- Pannello Solo Admin espandibile/riducibile.
- Download archivio giornaliero e intervallo.

### Listone

- Caricamento listoni stagione.
- Ultimo listone della stagione selezionata.
- Filtri Listone.
- Filtro Modifiche uniformato.
- Colonna Modifica.
- Export CSV modifiche Solo Admin.
- Diagnostica ruoli listone.

### Rose e squadre

- Visualizzazione rose.
- Tabelle mobile e desktop.
- Dashboard Presidente.
- Dati squadra presidente.

### Competizioni

- Elenco competizioni.
- Ordinamento e gruppi competizioni.
- Dettaglio competizione.
- Admin competizioni.
- Modulo legacy `assets/js/domain/competitions.js` conservato ma non importato.

### Fantamercato interno e notifiche trade

- Trattative reali su Firebase.
- Notifiche proposte ricevute.
- Notifiche esiti proposte inviate.
- Badge notifiche.
- Fallback locale marcatura esiti.
- Simulatore notifiche trade canonico V255.
- Azioni locali V349 su simulazioni: Accetta/Rifiuta senza scrivere su Firebase.

### Admin e diagnostica

- Render area Admin.
- Diagnostica dati Admin.
- Timestamp italiano ultimo aggiornamento diagnostica V343.
- Richieste presidenti.
- Convertitore listone.
- Stato Firebase/JSON.
- Preflight asset pubblici.
- Promemoria pubblicazione dati.

### News e share

- News statiche.
- Netlify Function `news-share.js`.
- Condivisione WhatsApp/social dove prevista.

### Netlify Functions

- `calciomercato-feed.js`.
- `news-share.js`.
- Redirect Netlify esistenti.

## Moduli canonici dopo il refactor

- `assets/js/calciomercato/calciomercato-images-v334.js`
- `assets/js/calciomercato/calciomercato-players-v340.js`
- `assets/js/calciomercato/calciomercato-render-v338.js`
- `assets/js/calciomercato/calciomercato-filters-v339.js`
- `assets/js/calciomercato/calciomercato-admin-v340.js`
- `assets/js/utils/shared-helpers-v295.js`
- `assets/js/utils/shared-helper-bridge-v341.js`
- `assets/js/dev/trade-notification-simulator-v255.js`

## File ancora conservati volutamente

- `assets/js/refactor/admin-publication-workflow-v213.js`
- `assets/css/refactor/theme-light-suspended.css`
- `assets/js/domain/competitions.js`

Questi file non sono da cancellare automaticamente. Servono come riferimento/rollback/audit e vanno rimossi solo con task dedicato.

## Check V355

Nuovo tool:

```bash
static/zonaorientale/tools/audit-regression-smoke-v355.mjs
```

Uso consigliato:

```bash
static/zonaorientale/tools/audit-regression-smoke-v355.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```
````

---

## 31. `FUNZIONALITAV356.md`

- Percorso originale: `FUNZIONALITAV356.md`
- Dimensione originale: 1760 byte
- SHA-256: `e9c80790aafd0aea69f8b0a8d38c69cc07ae3f327d62fec22d1c0d0cd4412a78`

````markdown
# FUNZIONALITAV356 - Stato funzionale preservato

Versione: V356
Data: 05/06/2026
Tipo: manual QA tracker post-refactor, senza cambio funzionale.

## Scopo

La V356 aggiunge un tracker console per segnare i test manuali completati dopo il ciclo di refactor/cleanup V333-V355. Non introduce nuove funzionalita utente, non rimuove file e non modifica flussi runtime esistenti.

## Funzionalita preservate

- Login Admin e Presidente.
- Dashboard Presidente.
- Calciomercato con feed RSS/HTML, fonti TMW squadra, archivio statico, filtri, card compatte e fallback immagini.
- Tag giocatore negli articoli Calciomercato e timeline in modal.
- Pannello Calciomercato Solo Admin, download archivio e diagnostica.
- Listone, filtro Modifiche, export Admin e manifest listoni.
- Rose, schede giocatore e player.html.
- Competizioni e competition.html.
- Fantamercato interno, notifiche trattative reali e simulatore trade V255/V349.
- Diagnostica dati Admin con timestamp italiano V343.
- News/share WhatsApp e Netlify Functions.
- Navigazione mobile, bottom nav e menu Altro.
- Firebase/Auth/EmailJS.

## Nuovo strumento V356

Da console browser e possibile usare:

```js
ZonaOrientaleManualQaTrackerV356.print()
ZonaOrientaleManualQaTrackerV356.mark('calciomercato-feed', 'ok', 'feed e archivio visibili')
ZonaOrientaleManualQaTrackerV356.summary()
ZonaOrientaleManualQaTrackerV356.exportMarkdown()
ZonaOrientaleManualQaTrackerV356.reset()
```

I dati sono salvati solo in `localStorage` con chiave `zonaorientale.manualQa.v356`.

## Garanzia di preservazione

La V356 non cambia HTML strutturale, JSON, Netlify Functions, Firebase rules, archivi statici, Listone, Rose, Calciomercato o Admin. Aggiorna solo versione/cache-buster, documenti e strumenti di verifica.
````

---

## 32. `FUNZIONALITAV357.md`

- Percorso originale: `FUNZIONALITAV357.md`
- Dimensione originale: 1319 byte
- SHA-256: `46bcece0d9a6130d4b7bc9b3797771267c36263328a1117e13de8d811f4ff5c2`

```markdown
# FUNZIONALITAV357 - Checklist QA da interfaccia Admin

Versione: V357  
Data: 05/06/2026

## Obiettivo

Aggiungere una checklist grafica, visibile solo agli admin, per provare le funzionalita principali post-refactor senza dover usare la console browser.

## Nuova funzionalita V357

- Bottom area fissa **Checklist QA Admin**.
- Visibile solo quando `state.isAdmin` e attivo.
- Pannello espandibile/riducibile.
- Stato salvato in `localStorage` con la stessa chiave del tracker V356: `zonaorientale.manualQa.v356`.
- Pulsanti rapidi per aprire le sezioni da testare.
- Pulsante simulazione per il test del simulatore trade.
- Stati manuali: OK, Problema, Saltato, Reset.
- Note testuali per ogni controllo.
- Export riepilogo Markdown.

## Funzionalita preservate

Restano preservate tutte le funzionalita gia presenti fino alla V356: Calciomercato, Listone, Rose, Competizioni, Dashboard Presidente, Fantamercato, notifiche trade reali/simulate, Admin, Diagnostica dati, Firebase/Auth/EmailJS, Netlify Functions, mobile navigation, competition.html e player.html.

## File principali

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/audit-manual-qa-panel-v357.mjs`
- `docs/zonaorientale/test/MANUAL_QA_INTERFACCIA_V357.md`

## Note

`docs/zonaorientale/FUNZIONALITA'.md` non e stato modificato.
```

---

## 33. `FUNZIONALITAV358.md`

- Percorso originale: `FUNZIONALITAV358.md`
- Dimensione originale: 1056 byte
- SHA-256: `aecfd4a7b6d08a290287665269ad4908b840362b40e6214daf2fa223ad6fe821`

```markdown
# FUNZIONALITAV358 - Checklist QA Admin migliorata

Versione: V358
Data: 05/06/2026

## Nuova funzionalita di supporto

- Pannello QA grafico solo Admin in bottom area.
- Raggruppamento dei controlli per area funzionale.
- Filtro per area.
- Reset per singola area.
- Marcatura rapida OK/Problema/Saltato/Reset.
- Pulsanti Apri/Simula per raggiungere rapidamente le sezioni da testare.
- Auto-check non invasivo su marker tecnici.
- Copia/esportazione riepilogo Markdown.

## Funzionalita preservate

- Calciomercato, feed, archivio, TMW, filtri, card, immagini, tag giocatore, timeline modal e Solo Admin.
- Listone, filtro Modifiche, export Admin e ricerca.
- Rose, competizioni, player.html e competition.html.
- Fantamercato interno, notifiche reali e simulatore locale V255/V349.
- Admin, Diagnostica dati, timestamp V343, Firebase/Auth/EmailJS e Netlify Functions.
- Navigazione mobile e menu Altro.

## Note

Il pannello salva solo in localStorage. Non scrive su Firebase e non modifica dati applicativi.

`FUNZIONALITA'.md` non e stato modificato.
```

---

## 34. `FUNZIONALITAV359.md`

- Percorso originale: `FUNZIONALITAV359.md`
- Dimensione originale: 1630 byte
- SHA-256: `9a6661d9eafed42f1b72016a07c9c64d2441019a3b67f1cef8b0ad352a25c2f3`

```markdown
# FUNZIONALITAV359 - Diagnostica giocatori Calciomercato

Versione: V359
Data: 2026-06-05

## Obiettivo

Migliorare in modo conservativo il riconoscimento dei giocatori negli articoli Calciomercato e aggiungere una diagnostica Admin/QA per capire quanti articoli vengono associati ai giocatori dell'ultimo listone della stagione selezionata.

## Funzionalita aggiunte

- Nuovo modulo `assets/js/calciomercato/calciomercato-players-v359.js`.
- Matching giocatore preservato da V340 e ampliato con:
  - forma compatta per nomi con apostrofi/spazi, ad esempio `N'Doye` / `Ndoye`;
  - alias configurati nei dati giocatore, se presenti (`aliases`, `nickname`, `shortName`, ecc.);
  - diagnostica articoli associati/non associati.
- Nuova diagnostica runtime:
  - `window.ZonaOrientaleCalciomercatoPlayerMatchingV359`;
  - `window.ZonaOrientaleCalciomercatoPlayerDiagnosticsV359`.
- Nuovo controllo nella Checklist QA Admin:
  - `Diagnostica articoli associati/non associati ai giocatori V359`.

## Funzionalita preservate

- Calciomercato feed RSS/HTML TMW.
- Archivio statico Calciomercato.
- Card articolo compatte.
- Tag giocatore sopra il titolo.
- Timeline giocatore in modal V336.
- Falsi positivi V340 evitati, ad esempio `Giovane` giocatore vs `giovane` aggettivo.
- Filtri Calciomercato V339.
- Pannello Solo Admin V340.
- Listone, Rose, Competizioni, Fantamercato, Admin, Firebase/Auth/EmailJS e Netlify Functions.

## Note di sicurezza

La V359 non scrive su Firebase, non modifica `links.json`, non modifica gli archivi JSON e non cambia la Netlify Function.

`docs/zonaorientale/FUNZIONALITA'.md` non e' stato modificato.
```

---

## 35. `FUNZIONALITAV360.md`

- Percorso originale: `FUNZIONALITAV360.md`
- Dimensione originale: 1609 byte
- SHA-256: `bc26fcc88a2e49f7ffc195d578dbb75df65db6138633c5c0908f67cd6eb7c29f`

```markdown
# FUNZIONALITAV360 - Checklist QA Admin con informazioni test

Versione: V360  
Data: 2026-06-05

## Obiettivo

Rendere piu' comprensibile la Checklist QA Admin introdotta nelle versioni V357/V358, aggiungendo per ogni test una icona informativa `i` che spiega cosa controllare manualmente.

## Funzionalita aggiunte

- Ogni scheda della bottom area `Checklist QA Admin` mostra una `i` informativa.
- Cliccando/toccando la `i` si apre una descrizione breve e operativa del test.
- Le informazioni coprono tutte le aree QA:
  - Auth/Admin;
  - Auth/Presidente;
  - Admin Diagnostica;
  - Calciomercato feed, filtri, timeline, diagnostica giocatori, Solo Admin;
  - Listone;
  - Rose/player;
  - Competizioni;
  - Fantamercato reale;
  - simulatore trade;
  - mobile navigation;
  - News/share.
- L'export Markdown della QA include anche la colonna `Cosa controllare`.
- Aggiunto audit tecnico `tools/audit-manual-qa-info-v360.mjs`.

## Funzionalita preservate

- La checklist resta visibile solo Admin.
- I dati QA restano solo in `localStorage` con chiave `zonaorientale.manualQa.v356`.
- I pulsanti OK, Problema, Salta, Reset, OK area, Reset area, Auto-check, Copia riepilogo ed Esporta restano invariati.
- Nessuna scrittura Firebase.
- Nessuna modifica a Netlify Functions.
- Nessuna modifica a Calciomercato, Listone, Rose, Competizioni, Fantamercato reale, Admin reale o mobile navigation.

## Note di sicurezza

La V360 e' un miglioramento di usabilita' della checklist QA. Non cambia dati, permessi, feed, archivi o funzioni di business.

`docs/zonaorientale/FUNZIONALITA'.md` non e' stato modificato.
```

---

## 36. `FUNZIONALITAV361.md`

- Percorso originale: `FUNZIONALITAV361.md`
- Dimensione originale: 1490 byte
- SHA-256: `b16de8336d5025accf3db7b70559e8391d66d32f342803b4c78a86070d6d9c64`

````markdown
# FUNZIONALITAV361 - Simulatore notifiche trade da interfaccia Admin

Versione: V361
Data: 05/06/2026

## Obiettivo

Rendere piu' semplice il test delle notifiche Fantamercato senza usare la console browser.
La Checklist QA Admin ora include un pannello operativo per simulare e pulire notifiche trade locali.

## Funzionalita' preservate

- Trattative reali Firebase invariate.
- Badge notifiche reali invariati.
- Simulatore V255 preservato.
- Azioni locali V349 preservate.
- Dashboard Presidente invariata.
- Fantamercato interno invariato.
- Admin, Calciomercato, Listone, Rose, Competizioni e mobile navigation invariati.

## Nuove funzioni QA/Admin

Nella Checklist QA Admin, area Fantamercato:

- Simula ricevuta.
- Esito accettato.
- Esito rifiutato.
- Aggiorna badge.
- Pulisci simulazioni.
- Stato simulazioni locali visibile nella card.

Le azioni sono locali e non scrivono su Firebase.

## API runtime

```js
window.ZonaOrientaleTradeSimulatorPanelV361
```

Metodi principali:

```js
getStatus()
simulateIncoming()
simulateResolved('ACCEPTED')
simulateResolved('REJECTED')
refreshBadges()
clearLocalSimulations()
runSmokeTest()
```

## Cosa controllare manualmente

1. Accedere come admin/presidente approvato.
2. Aprire la Checklist QA Admin.
3. Filtrare area Fantamercato.
4. Usare i pulsanti del pannello simulazioni.
5. Verificare che Accetta/Rifiuta sulle simulazioni non producano errore Firebase.
6. Pulire le simulazioni locali e verificare che i badge si aggiornino.
````

---

## 37. `FUNZIONALITAV362.md`

- Percorso originale: `FUNZIONALITAV362.md`
- Dimensione originale: 2174 byte
- SHA-256: `08ffb649b476a1372e225658171fac5eab7c9165e10cc8cbd5dac4f0ff750c42`

````markdown
# FUNZIONALITAV362 - Simulazione notifiche trade verso presidente da Admin

Versione: V362
Data: 05/06/2026

## Obiettivo

La Checklist QA e' visibile solo agli admin, ma una notifica trade ricevuta deve essere verificata dal punto di vista del presidente destinatario. La V362 aggiunge quindi un menu nella Checklist QA Admin per scegliere una squadra/presidente e creare una proposta ricevuta locale indirizzata a quel destinatario.

## Nuove funzioni

Nella Checklist QA Admin, area Fantamercato:

- menu `Simula ricezione per presidente/squadra`;
- elenco delle squadre della stagione corrente con presidenti associati;
- pulsante `Simula per presidente`;
- salvataggio locale delle simulazioni target in `localStorage`;
- reinserimento automatico delle simulazioni in `state.raw.transferNegotiations`;
- conteggio delle simulazioni presidente salvate;
- pulizia integrata con `Pulisci simulazioni`.

## Flusso di test consigliato

1. Accedere come admin.
2. Aprire la Checklist QA Admin.
3. Filtrare `Fantamercato`.
4. Selezionare una squadra/presidente nel menu.
5. Premere `Simula per presidente`.
6. Accedere nello stesso browser come quel presidente.
7. Verificare badge notifiche e card nella Dashboard Presidente/Fantamercato.
8. Cliccare `Accetta` o `Rifiuta`: l'azione deve restare locale e non deve produrre errori Firebase.
9. Tornare admin e usare `Pulisci simulazioni`.

## API runtime

```js
window.ZonaOrientaleTradeSimulatorTargetPanelV362
```

Metodi principali:

```js
getTeamOptions()
getStatus()
setSelectedTarget(seasonTeamId)
simulateIncomingForTarget(seasonTeamId)
clearTargetSimulations()
mergeStoredRows()
runSmokeTest()
```

## Funzionalita' preservate

- Trattative reali Firebase invariate.
- Simulatore V255 preservato.
- Azioni locali V349 preservate.
- Pannello simulatore V361 preservato.
- Badge reali invariati.
- Dashboard Presidente invariata.
- Calciomercato, Listone, Rose, Competizioni, Admin e mobile navigation invariati.

## Note di sicurezza

La simulazione V362 e' local-only. Non usa `addDoc`, non scrive in Firebase e viene salvata solo nel browser con chiave:

```text
zonaorientale.tradeSimulatorTargetPanel.v362.rows
```
````

---

## 38. `FUNZIONALITAV363.md`

- Percorso originale: `FUNZIONALITAV363.md`
- Dimensione originale: 2032 byte
- SHA-256: `2b08ace2d1dac8e81b4eac1f88181a21d3eb0592d4ed9798fd1883aeec613b21`

```markdown
# FUNZIONALITAV363 - Checklist QA stabilizzata e simulazione presidente

Versione: V363  
Data: 05/06/2026

## Obiettivo

Stabilizzare la Checklist QA Admin introdotta nelle versioni V357-V362, in particolare il box di simulazione notifiche trade verso presidente.

## Modifiche funzionali

Nessun flusso reale viene modificato. La V363 interviene solo sulla UX Admin della checklist QA.

## Correzioni

- Il box simulatore trade ora occupa tutta la riga della griglia QA e non sfora nelle schede affiancate.
- Il menu a tendina del presidente destinatario non viene piu' resettato dal refresh automatico del pannello mentre lo si sta usando.
- La `i` informativa resta aperta mentre viene letta e non scompare dopo pochi secondi.
- L'auto-refresh della checklist passa a un comportamento non distruttivo: non ridisegna il pannello quando il focus e' dentro la checklist o quando una spiegazione e' aperta.
- Le istruzioni di test della simulazione presidente sono esplicitate in interfaccia e documentazione.

## Come testare la simulazione verso presidente

1. Accedere come Admin.
2. Aprire la Checklist QA Admin.
3. Filtrare l'area Fantamercato.
4. Nel box simulatore scegliere una squadra/presidente.
5. Premere `Simula per presidente`.
6. Uscire dall'admin e accedere come quel presidente nello stesso browser/origin.
7. Verificare badge e card proposta ricevuta.
8. Premere `Accetta` o `Rifiuta`.
9. Verificare che non compaia `Missing or Insufficient permissions`.

La simulazione resta solo in localStorage e non scrive su Firebase.

## Funzionalita preservate

- Trattative reali Firebase.
- Notifiche reali Fantamercato.
- Simulatore trade V255/V349.
- Simulazione target presidente V362.
- Checklist QA Admin V357-V362.
- Calciomercato, Listone, Rose, Competizioni, Admin, Dashboard Presidente.
- Netlify Functions e Firebase/Auth/EmailJS.

## File principali

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/audit-manual-qa-stability-v363.mjs`
- `static/zonaorientale/tools/check-zonaorientale.sh`
```

---

## 39. `FUNZIONALITAV367.md`

- Percorso originale: `FUNZIONALITAV367.md`
- Dimensione originale: 712 byte
- SHA-256: `5136ec567b8391e897f1a8f3b8147c47f6f0c42fa4996f395850c3ac96caac9e`

```markdown
# Funzionalita V367 - Smoke test automatici protetti

La V367 aggiunge controlli automatici anti-regressione senza cambiare funzionalita' utente.

## Nuovo

- Audit `tools/audit-protected-regression-v367.mjs`.
- Marker runtime `window.ZonaOrientaleProtectedRegressionSuiteV367`.
- Integrazione in `tools/check-zonaorientale.sh`.
- Audit storici V358-V362 resi compatibili con versioni successive.

## Preservato

- Area Presidente.
- Trattative reali Firebase.
- Simulazioni trade local-only.
- Admin e Checklist QA.
- Listone.
- Rose.
- Competizioni.
- Player page.
- Calciomercato.
- Comunicati/news.
- Navigazione mobile.

## Documento protetto

`docs/zonaorientale/FUNZIONALITA'.md` non e' stato modificato.
```

---

## 40. `FUNZIONALITAV368.md`

- Percorso originale: `FUNZIONALITAV368.md`
- Dimensione originale: 975 byte
- SHA-256: `ff807daa80b5a8ed49562693057a08b1841194d32a34e82cbb626fbe0f29a75f`

````markdown
# Funzionalita V368 - Dashboard pubblicazione Admin protetta

## Nuova funzionalita

La V368 aggiunge in Admin un pannello `Cruscotto pre-deploy` mostrato in alto, sopra i controlli di pubblicazione esistenti.

Il pannello riassume:

- allineamento versione runtime, footer e cache-buster;
- smoke test runtime protetto V367;
- stato Firebase/JSON V190;
- promemoria locali di pubblicazione V189;
- presenza dei pannelli Promemoria, Semafori e Wizard V191;
- checklist copiabile prima del deploy.

## Cosa non cambia

- Nessuna modifica allo schema Firebase.
- Nessuna nuova scrittura Firebase.
- Nessuna rimozione file runtime.
- Nessuna modifica alle trattative reali.
- Nessuna modifica alle simulazioni trade local-only.
- Nessuna modifica alle sezioni pubbliche.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Marker runtime

```js
window.ZonaOrientaleAdminPublicationDashboardV368
```

## Test console

```js
ZonaOrientaleAdminPublicationDashboardV368.runSmokeTest()
```
````

---

## 41. `FUNZIONALITAV369.md`

- Percorso originale: `FUNZIONALITAV369.md`
- Dimensione originale: 1095 byte
- SHA-256: `ecf61cbc681bb5398160642a71d6a1411f7d3e5a676a2042f148b0088649db4c`

```markdown
# Funzionalita V369 - Dashboard Presidente protetta

## Obiettivo

Aggiungere una dashboard presidente in Area squadra, sopra le sezioni gia' esistenti, per rendere piu' leggibili saldo, rosa, trattative e richieste.

## Nuove funzioni

- Dashboard read-only in Area squadra per presidente approvato.
- Metriche: saldo FM, numero giocatori, valore rosa, trattative aperte, richieste Admin in attesa, giocatori sul mercato.
- Distribuzione ruoli della rosa.
- Alert operativi su trattative ricevute, esiti disponibili, richieste pending e rosa non disponibile.
- Richieste recenti inviate all'admin.
- Ultimi movimenti FM.
- Pulsanti rapidi verso trattative, nuova proposta, comunicato e scheda squadra.

## Funzioni preservate

- Proposta trattativa esistente.
- Liste trattative inviate/ricevute.
- Accetta/Rifiuta/Annulla trattative.
- Invio comunicato squadra.
- Scheda squadra.
- Dashboard pubblicazione Admin V368.
- Smoke test V367.
- Hardening stati trattativa V366.

## Note

La V369 non aggiunge collection, non scrive su Firebase, non modifica snapshot e non tocca `FUNZIONALITA'.md`.
```

---

## 42. `FUNZIONALITAV370.md`

- Percorso originale: `FUNZIONALITAV370.md`
- Dimensione originale: 767 byte
- SHA-256: `7f9c910c6add5677fc8530fece5ef77654448b7204e8df08b3ccf52659492eb4`

```markdown
# Funzionalita V370 - Centro notifiche presidente protetto

## Sintesi

La V370 aggiunge in Area squadra un Centro notifiche presidente read-only/local-ack.

## Funzioni aggiunte

- Riepilogo trattative ricevute da valutare.
- Riepilogo trattative inviate in attesa.
- Riepilogo esiti trattative inviate.
- Riepilogo richieste Admin recenti.
- Riepilogo giocatori messi sul mercato dalla propria squadra.
- Pulsanti rapidi verso trattative e nuova proposta.
- Acknowledge locale degli esiti trade gia' visualizzati.

## Garanzie

- Nessuna nuova collection Firebase.
- Nessuna modifica allo schema dati.
- Nessuna sostituzione della Dashboard Presidente V369.
- Nessuna sostituzione delle sezioni operative dell'Area squadra.
- Nessuna modifica a `FUNZIONALITA'.md`.
```

---

## 43. `FUNZIONALITAV371.md`

- Percorso originale: `FUNZIONALITAV371.md`
- Dimensione originale: 1152 byte
- SHA-256: `e42d0cc46e28a13e33fc9c28da9928ba8db78a332df6d6f350c26df9812cb097`

````markdown
# Funzionalita V371 - Soccer Data protetto

> Nota: questo file e' un riepilogo additivo V371. Non sostituisce e non modifica `FUNZIONALITA'.md`.

## Nuova sezione: Soccer Data

La V371 aggiunge una sezione pubblica `Soccer Data` raggiungibile da:

- navigazione desktop;
- menu mobile `Altro`.

La sezione mostra solo i giocatori attivi nel listone corrente (`statusCode: IN_LISTONE`). Gli asteriscati non vengono mostrati nella V371.

## Funzioni disponibili

- Riepilogo giocatori attivi, mappati, da associare e risultati filtro.
- Filtro ruolo.
- Filtro squadra reale.
- Filtro mapping: tutti, mappati, da associare.
- Ricerca testuale.
- Link `Cerca FBref` per aprire una ricerca esterna del singolo giocatore.
- Copia CSV associazioni.
- Scarica mapping base JSON.

## Dati statici aggiunti

```text
assets/soccer-data/manifest.json
assets/soccer-data/fbref-player-map.v371.json
assets/soccer-data/fbref-player-map.v371.csv
```

## Garanzie

- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessuna modifica a rose, listone, trattative, admin, competizioni, calciomercato o area presidente.
- Feature additiva e reversibile.
````

---

## 44. `FUNZIONALITAV372.md`

- Percorso originale: `FUNZIONALITAV372.md`
- Dimensione originale: 662 byte
- SHA-256: `de17245b0b57f5268aade0326110163ebd5c039c3ff8d73e17c6cefa56956f48`

```markdown
# Funzionalita V372 - Soccer Data mapping assistito

> Documento additivo. Non sostituisce `FUNZIONALITA'.md`.

## Soccer Data

La sezione Soccer Data ora include un workflow di associazione ZonaOrientale -> FBref:

- solo giocatori presenti nel listone attivo;
- esclusione automatica degli asteriscati;
- link di ricerca FBref per ogni riga;
- CSV completo da copiare/scaricare;
- CSV di review ordinato per priorita;
- copia rapida della singola riga mapping.

## Campi mapping

- `playerKey`
- `playerName`
- `realTeam`
- `fantacalcioId`
- `fbrefSearchQuery`
- `fbrefSearchUrl`
- `fbrefId`
- `fbrefName`
- `fbrefUrl`
- `matchStatus`
- `confidence`
- `notes`
```

---

## 45. `FUNZIONALITAV373.md`

- Percorso originale: `FUNZIONALITAV373.md`
- Dimensione originale: 594 byte
- SHA-256: `54daccc0e5c354a9b25451c2d6b1fb8c5d3a5956990b9229bc117f5c0298fe9a`

```markdown
# Funzionalita V373 - Soccer Data FBref batch-01

Documento sintetico della release V373. Non sostituisce e non modifica `FUNZIONALITA'.md`.

## Soccer Data

- Sezione read-only.
- Solo giocatori `IN_LISTONE`.
- Mapping FBref statico/offline.
- 50 associazioni confermate nel primo batch.
- Nessuno scraping live dal browser.
- Nessuna scrittura Firebase.

## Funzionalita preservate

- Admin e Dashboard pubblicazione.
- Area squadra, Dashboard Presidente e Centro notifiche.
- Trattative reali e simulazioni local-only.
- Listone, rose, competizioni, player page, calciomercato e comunicati.
```

---

## 46. `FUNZIONALITAV374.md`

- Percorso originale: `FUNZIONALITAV374.md`
- Dimensione originale: 517 byte
- SHA-256: `4c0a58948defc25e30614dadd58c8a5c2b9e631c83e4aa2cd7601d4561e3b2ca`

```markdown
# FUNZIONALITA V374 - Delta Soccer Data FBref batch-02

Nota: questo file e un delta V374. Il documento canonico `FUNZIONALITA'.md` non e stato modificato.

## Soccer Data

- La sezione continua a mostrare solo giocatori `IN_LISTONE`.
- Sono ora presenti 100 associazioni FBref confermate.
- Il batch-02 aggiunge 50 associazioni verificate.
- I giocatori non ancora associati restano visibili nello stato `needs-review`.
- Nessuna statistica viene importata automaticamente dal browser.
- Nessuna scrittura Firebase.
```

---

## 47. `FUNZIONALITAV375.md`

- Percorso originale: `FUNZIONALITAV375.md`
- Dimensione originale: 517 byte
- SHA-256: `cacc16b578629e1458bb44ca73b009f35ea719fdd12b33a672446eb9e96b3d02`

```markdown
# FUNZIONALITA V375 - Delta Soccer Data FBref batch-03

Nota: questo file e un delta V375. Il documento canonico `FUNZIONALITA'.md` non e stato modificato.

## Soccer Data

- La sezione continua a mostrare solo giocatori `IN_LISTONE`.
- Sono ora presenti 150 associazioni FBref confermate.
- Il batch-03 aggiunge 50 associazioni verificate.
- I giocatori non ancora associati restano visibili nello stato `needs-review`.
- Nessuna statistica viene importata automaticamente dal browser.
- Nessuna scrittura Firebase.
```

---

## 48. `FUNZIONALITAV376.md`

- Percorso originale: `FUNZIONALITAV376.md`
- Dimensione originale: 812 byte
- SHA-256: `132be855a8fb589129800e9bde194af5000cc48f4feaa30b4f777699f67b1839`

```markdown
# FUNZIONALITA V376 - Soccer Data FBref batch-04

Documento sintetico generato per la release V376. Il file storico `FUNZIONALITA'.md` non e stato modificato.

## Soccer Data

- La sezione Soccer Data resta additiva e read-only.
- Sono mostrati solo giocatori con `statusCode: IN_LISTONE`.
- Gli asteriscati restano esclusi.
- Il mapping FBref sale a 200 giocatori confermati.
- Il batch-04 aggiunge 50 associazioni verificate manualmente.
- Nessuno scraping live dal browser.
- Nessuna scrittura Firebase.

## Funzionalita preservate

- Dashboard Admin V368.
- Dashboard Presidente V369.
- Centro notifiche Presidente V370.
- Soccer Data shell V371.
- Mapping assistito V372.
- Batch FBref V373, V374, V375.
- Trattative reali e simulate.
- Listone, rose, competizioni, player page, calciomercato e comunicati.
```

---

## 49. `FUNZIONALITAV377.md`

- Percorso originale: `FUNZIONALITAV377.md`
- Dimensione originale: 818 byte
- SHA-256: `d9845faa0cdaf601d3ad6508c26278c6384844b817c1d87666f5890d25ddf367`

```markdown
# FUNZIONALITA V377 - Soccer Data FBref batch-05

Documento sintetico generato per la release V377. Il file storico `FUNZIONALITA'.md` non e stato modificato.

## Soccer Data

- La sezione Soccer Data resta additiva e read-only.
- Sono mostrati solo giocatori con `statusCode: IN_LISTONE`.
- Gli asteriscati restano esclusi.
- Il mapping FBref sale a 250 giocatori confermati.
- Il batch-05 aggiunge 50 associazioni verificate manualmente.
- Nessuno scraping live dal browser.
- Nessuna scrittura Firebase.

## Funzionalita preservate

- Dashboard Admin V368.
- Dashboard Presidente V369.
- Centro notifiche Presidente V370.
- Soccer Data shell V371.
- Mapping assistito V372.
- Batch FBref V373, V374, V375, V376.
- Trattative reali e simulate.
- Listone, rose, competizioni, player page, calciomercato e comunicati.
```

---

## 50. `FUNZIONALITAV378.md`

- Percorso originale: `FUNZIONALITAV378.md`
- Dimensione originale: 824 byte
- SHA-256: `71cdb286c470b1090cff2125c24820e2c6a16bd4f92f7d344dfd82370f357cdb`

```markdown
# FUNZIONALITA V378 - Soccer Data FBref batch-06

Documento sintetico generato per la release V378. Il file storico `FUNZIONALITA'.md` non e stato modificato.

## Soccer Data

- La sezione Soccer Data resta additiva e read-only.
- Sono mostrati solo giocatori con `statusCode: IN_LISTONE`.
- Gli asteriscati restano esclusi.
- Il mapping FBref sale a 300 giocatori confermati.
- Il batch-06 aggiunge 50 associazioni verificate manualmente.
- Nessuno scraping live dal browser.
- Nessuna scrittura Firebase.

## Funzionalita preservate

- Dashboard Admin V368.
- Dashboard Presidente V369.
- Centro notifiche Presidente V370.
- Soccer Data shell V371.
- Mapping assistito V372.
- Batch FBref V373, V374, V375, V376, V377.
- Trattative reali e simulate.
- Listone, rose, competizioni, player page, calciomercato e comunicati.
```

---

## 51. `FUNZIONALITAV379.md`

- Percorso originale: `FUNZIONALITAV379.md`
- Dimensione originale: 542 byte
- SHA-256: `3fa1493ab7c300c7477de2b6dbef7edbd3830d1c4fc7f9257bcc33226bc97147`

```markdown
# Funzionalita V379 - Soccer Data FBref batch-07

## Soccer Data

- Sezione additiva/read-only.
- Visibili solo giocatori `IN_LISTONE`.
- Mapping FBref corrente: V379.
- Mapping confermati: 350/532.
- Nuovi mapping: batch-07, 50 giocatori.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.

## Funzionalita preservate

- Admin e cruscotto pre-deploy.
- Area squadra, Dashboard Presidente e Centro Notifiche.
- Trattative reali e simulazioni local-only.
- Listone, rose, competizioni, player page, calciomercato e comunicati.
```

---

## 52. `FUNZIONALITAV380.md`

- Percorso originale: `FUNZIONALITAV380.md`
- Dimensione originale: 542 byte
- SHA-256: `55c571ad2ddbdbd616f0ae1e069e66986c28fc46729126d05321c8806cbe4562`

```markdown
# Funzionalita V380 - Soccer Data FBref batch-08

## Soccer Data

- Sezione additiva/read-only.
- Visibili solo giocatori `IN_LISTONE`.
- Mapping FBref corrente: V380.
- Mapping confermati: 400/532.
- Nuovi mapping: batch-08, 50 giocatori.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.

## Funzionalita preservate

- Admin e cruscotto pre-deploy.
- Area squadra, Dashboard Presidente e Centro Notifiche.
- Trattative reali e simulazioni local-only.
- Listone, rose, competizioni, player page, calciomercato e comunicati.
```

---

## 53. `FUNZIONALITAV381.md`

- Percorso originale: `FUNZIONALITAV381.md`
- Dimensione originale: 335 byte
- SHA-256: `bef151e1b29c9f78f41f7b558da932ee669d325e54bd66d0ce8be6e93e6fdaa4`

```markdown
# Funzionalita V381 - Soccer Data FBref batch-09

Documento additivo di release. Non sostituisce e non modifica `FUNZIONALITA'.md`.

## Soccer Data

- Sezione read-only.
- Solo giocatori `IN_LISTONE`.
- 450 mapping FBref confermati.
- 82 mapping ancora da completare.
- Nessuno scraping live dal browser.
- Nessuna scrittura Firebase.
```

---

## 54. `FUNZIONALITAV382.md`

- Percorso originale: `FUNZIONALITAV382.md`
- Dimensione originale: 335 byte
- SHA-256: `cd9e6507f91502e55ffac92c99ac70ba1fb48bfe1111aa5579425e6c74fbcffe`

```markdown
# Funzionalita V382 - Soccer Data FBref batch-10

Documento additivo di release. Non sostituisce e non modifica `FUNZIONALITA'.md`.

## Soccer Data

- Sezione read-only.
- Solo giocatori `IN_LISTONE`.
- 500 mapping FBref confermati.
- 32 mapping ancora da completare.
- Nessuno scraping live dal browser.
- Nessuna scrittura Firebase.
```

---

## 55. `FUNZIONALITAV383.md`

- Percorso originale: `FUNZIONALITAV383.md`
- Dimensione originale: 565 byte
- SHA-256: `4fd506bab7c4b7bcdd8c7b56e491d5cffd393434edde89240da341f4e4520a67`

```markdown
# Funzionalita V383 - Soccer Data FBref batch-11 finale

Documento additivo di release. Non sostituisce e non modifica `FUNZIONALITA'.md`.

## Soccer Data

- Sezione read-only.
- Solo giocatori `IN_LISTONE`.
- 531 mapping FBref confermati.
- 1 mapping ancora in `needs-review` per assenza di profilo FBref stabile verificabile.
- Nessuno scraping live dal browser.
- Nessuna scrittura Firebase.

## Note batch finale

- Batch-11: 31 mapping confermati su 32 residui.
- Balentien resta volutamente in review per evitare associazioni non verificate o falsi positivi.
```

---

## 56. `FUNZIONALITAV384.md`

- Percorso originale: `FUNZIONALITAV384.md`
- Dimensione originale: 995 byte
- SHA-256: `fe2d3123fbbcf001ea5670ca9ff25b8d67bf0cfd5b4238cea70554e8bad0ad36`

```markdown
# Funzionalita V384 - Soccer Data table cleanup

Documento additivo di release. Non sostituisce e non modifica `FUNZIONALITA'.md`.

## Soccer Data

- Sezione sempre read-only.
- Mapping dati invariato: `fbref-player-map.v383.json`.
- La tabella usa ora `FBref / Giocatore` come prima colonna.
- Il nome FBref, quando disponibile, e il link cliccabile principale.
- Il nome del listone resta visibile come dettaglio secondario per tracciabilita.
- La vecchia colonna `Azione` e stata rimossa dalla tabella principale.
- I pulsanti `Cerca FBref` e `Copia riga` restano disponibili solo dentro la cella dei giocatori da associare/needs-review.
- Aggiunta colonna `Stato mapping` per distinguere rapidamente confermati e da associare.

## Garanzie di non regressione

- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessun cambio al caricamento listoni.
- Nessun cambio al mapping V383.
- Nessuna modifica a `FUNZIONALITA'.md`.
- Le funzioni di export/copia CSV restano attive.
```

---

## 57. `FUNZIONALITAV385.md`

- Percorso originale: `FUNZIONALITAV385.md`
- Dimensione originale: 1337 byte
- SHA-256: `b8a40fc782be569ec6a8601295ee723648dec0dd410cffa5d057bf221c7ff609`

```markdown
# Funzionalita V385 - Soccer Data associazione FBref locale

Documento additivo di release. Non sostituisce e non modifica `FUNZIONALITA'.md`.

## Soccer Data

- Sezione sempre read-only rispetto a Firebase.
- Mapping dati invariato: `fbref-player-map.v383.json`.
- Per i giocatori `Da associare` / `needs-review` la cella `FBref / Giocatore` mostra un mini flusso di associazione.
- Il flusso consente di:
  - aprire `Cerca FBref`;
  - incollare il link profilo FBref;
  - indicare un nome FBref opzionale;
  - premere `Prepara mapping`;
  - copiare o rimuovere la patch della singola riga.
- A livello sezione sono disponibili `Copia patch FBref` e `Scarica patch FBref`.
- La patch viene generata come JSON locale, con base mapping dichiarata e metadata `firebaseWrites: false` / `liveScraping: false`.
- Le bozze patch restano solo nel browser tramite `localStorage`; non vengono salvate su Firebase e non modificano il mapping statico.

## Garanzie di non regressione

- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessun cambio al caricamento listoni.
- Nessun cambio al mapping V383.
- Nessuna modifica a `FUNZIONALITA'.md`.
- Le funzioni V371/V372/V383/V384 restano presenti.
- Il pulsante tecnico di copia riga non viene rimosso: viene rinominato in `Copia dati mapping` dentro il flusso di associazione.
```

---

## 58. `FUNZIONALITAV386.md`

- Percorso originale: `FUNZIONALITAV386.md`
- Dimensione originale: 1504 byte
- SHA-256: `bfd9d4225f0a90537614a30028b606cd53c106d22bd77ad9e3db10feb4afb380`

```markdown
# Funzionalita V386 - Soccer Data solo admin

Documento additivo di release. Non sostituisce e non modifica `FUNZIONALITA'.md`.

## Soccer Data

- La sezione `Soccer Data` viene resa disponibile solo agli admin.
- Il link desktop `Soccer Data` e il link mobile nel menu `Altro` sono nascosti ai non-admin tramite la stessa logica gia usata per i link admin.
- L'accesso diretto via hash `#soccerdata` viene bloccato se l'utente non e admin e riporta alla dashboard con richiesta di login.
- Il caricamento del manifest/mapping Soccer Data non viene avviato per utenti non-admin.
- La tabella resta invariata per gli admin: mapping V383, patch locale V385 e filtri restano disponibili.
- Il testo del link giocatore FBref nella colonna `FBref / Giocatore` e ora verde (`var(--primary)`) con hover/focus verde scuro.

## Garanzie di non regressione

- Nessuna modifica al mapping: resta `assets/soccer-data/fbref-player-map.v383.json`.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessun cambio al caricamento listoni.
- Nessun cambio alle patch locali V385.
- Nessuna modifica a `FUNZIONALITA'.md`.
- Restano presenti le funzioni V371/V372/V383/V384/V385.

## Test

- `node tools/audit-soccer-data-admin-only-v386.mjs`
- `node tools/audit-soccer-data-association-patch-v385.mjs`
- `node tools/audit-soccer-data-table-cleanup-v384.mjs`
- `node tools/audit-soccer-data-fbref-batch-v383.mjs`
- `node --check assets/app.js`
- `node --check tools/audit-soccer-data-admin-only-v386.mjs`
```

---

## 59. `FUNZIONALITAV387.md`

- Percorso originale: `FUNZIONALITAV387.md`
- Dimensione originale: 1588 byte
- SHA-256: `d1b898fd8efea98ddb6118de7baba910553bf034282a9be25ef49ff0af66c506`

```markdown
# Funzionalita V387 - Soccer Data mobile cleanup

Documento additivo di release. Non sostituisce e non modifica `FUNZIONALITA'.md`.

## Soccer Data

- La tabella Soccer Data mantiene la struttura V384/V385/V386, ma su mobile usa un layout compatto a larghezze fisse ispirato alla tabella Listone.
- Aggiunte classi dedicate alle colonne `FBref / Giocatore`, `Ruolo`, `Squadra`, `Rosa`, `Qt.A`, `FVM` e `Stato mapping`.
- Su smartphone la tabella resta una tabella orizzontale scrollabile, con header sticky e celle compatte.
- La prima colonna puo andare a capo per evitare sovrapposizioni tra link FBref, nome listone e pannello di associazione.
- Le colonne brevi e numeriche restano in larghezze controllate, con ellissi dove opportuno.
- Il pannello locale V385 per incollare link FBref viene compattato su mobile senza rimuovere pulsanti o campi.

## Garanzie di non regressione

- Nessuna modifica al mapping: resta `assets/soccer-data/fbref-player-map.v383.json`.
- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessun cambio al caricamento listoni.
- Nessun cambio al gate admin V386.
- Nessun cambio alle patch locali V385.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Test

- `node tools/audit-soccer-data-mobile-table-v387.mjs`
- `node tools/audit-soccer-data-admin-only-v386.mjs`
- `node tools/audit-soccer-data-association-patch-v385.mjs`
- `node tools/audit-soccer-data-table-cleanup-v384.mjs`
- `node tools/audit-soccer-data-fbref-batch-v383.mjs`
- `node --check assets/app.js`
- `find assets -name '*.js' -type f -print0 | xargs -0 -n 1 node --check`
```

---

## 60. `FUNZIONALITAV388.md`

- Percorso originale: `FUNZIONALITAV388.md`
- Dimensione originale: 1437 byte
- SHA-256: `9e2a1949f5984c501dbbe15374bf80a5d7b8cfcdc4f6e9de6b32d3b9f91cf25b`

```markdown
# V388 - Snapshot comunicati admin

Stato: V388.

## Obiettivo

Rendere piu chiaro e immediato il pannello `Admin -> Snapshot e backup -> Snapshot pubblici`, soprattutto dopo il salvataggio/pubblicazione di comunicati.

## Modifiche

- I pulsanti snapshot aggiornano subito la data `Ultimo:` dopo click riuscito su:
  - Aggiorna stagione selezionata
  - Aggiorna comunicati
  - Aggiorna competizioni e classifiche
  - Aggiorna tutte le stagioni
  - Aggiorna Albo/FIFA
  - Aggiorna schede squadra
  - Aggiorna tutto
  - Scarica config pubblica
  - Scarica snapshot stagione JSON
  - Scarica overlay snapshot stagioni
  - Scarica honor JSON
- Il pannello Snapshot pubblici chiarisce il flusso dei comunicati:
  - salva o approva il comunicato;
  - premi `Aggiorna comunicati`;
  - scarica/applica lo snapshot stagione se vuoi renderlo stabile anche nei JSON statici dopo logout/refresh.

## Cosa non cambia

- Nessuna modifica a Firebase Rules.
- Nessuna modifica al flusso WhatsApp dinamico.
- Nessuna modifica a Soccer Data, mapping FBref o listone.
- Nessuno scraping live.
- `FUNZIONALITA'.md` non modificato.

## Nota operativa comunicati

Il link WhatsApp dinamico puo leggere il comunicato da Firebase. Per rendere il comunicato visibile in modo stabile anche al sito pubblico che legge i JSON statici, dopo aver salvato o approvato il comunicato bisogna aggiornare lo snapshot comunicati e pubblicare lo snapshot statico stagione.
```

---

## 61. `FUNZIONALITAV389.md`

- Percorso originale: `FUNZIONALITAV389.md`
- Dimensione originale: 1973 byte
- SHA-256: `1be349bb09b0cdede6f502a77beed3b43c1892374e4c747a2844b53af216e6f6`

```markdown
# V389 - Soccer Data assets cleanup + stats import base

Stato: V389.

## Obiettivo

Ridurre gli asset pubblici della sezione Soccer Data e preparare una struttura ordinata per importare in futuro statistiche giocatore tramite JSON statici, senza scraping live e senza toccare il mapping V383.

## Modifiche

- `assets/soccer-data` contiene solo i file runtime necessari:
  - `manifest.json`
  - `fbref-player-map.v383.json`
  - `stats/manifest.json`
- Spostati nei docs archive gli storici mapping/review V371-V383 non necessari al runtime pubblico.
- Aggiunto `assets/soccer-data/stats/manifest.json` come base per futuri import statici/manuali.
- Il pannello Soccer Data mostra una card `Stats import` che indica che la struttura e pronta ma non carica ancora dataset statistici reali.
- La sezione Soccer Data torna visibile a tutti in sola lettura.
- I comandi amministrativi Soccer Data restano disponibili solo agli admin: export CSV/mapping, patch FBref e pannello associazione sui giocatori da rivedere.
- `manifest.json` mantiene il mapping corrente V383 e aggiunge metadati V389 su asset pubblici, archivio e stats.

## Cosa non cambia

- Mapping corrente invariato: `fbref-player-map.v383.json`.
- Totale mapping invariato: 531 confermati / 1 needs-review.
- La sezione Soccer Data non e piu solo admin: e pubblica in sola lettura.
- I comandi amministrativi Soccer Data restano solo admin.
- Patch locale associazione FBref V385 invariata.
- Layout mobile V387 invariato.
- Snapshot comunicati admin V388 invariato.
- Nessuna scrittura Firebase.
- Nessuno scraping live.
- `FUNZIONALITA'.md` non modificato.

## Nota operativa

Per completare davvero la pulizia nella repo, dopo aver applicato lo zip bisogna rimuovere da Git i vecchi file pubblici `assets/soccer-data/fbref-player-map.v371-v382.*`, `fbref-player-map.v383.csv` e `fbref-review-batch.v372-v383.csv`. I contenuti sono gia conservati in `docs/zonaorientale/archive/soccer-data/mapping-history/`.
```

---

## 62. `FUNZIONALITAV391.md`

- Percorso originale: `FUNZIONALITAV391.md`
- Dimensione originale: 2457 byte
- SHA-256: `753d8d0e9495408738845a6d5fe090715480707cdca4421f7b8ed69b3ce3f039`

```markdown
# FUNZIONALITA V391 - Soccer Data stats FBref/Firebase

## Obiettivo

V391 aggiunge una pipeline mirata per iniziare a popolare Soccer Data con statistiche reali, senza modificare le altre sezioni del sito e senza cambiare il mapping FBref V383.

## Perimetro modificato

- Solo sezione Soccer Data.
- Aggiunta funzione Netlify `fbref-player-stats` per recupero admin-only di un singolo profilo FBref.
- Aggiunta lettura static-first con fallback Firebase dalla collection `soccerDataPlayerStats`.
- Aggiunti comandi admin dentro Soccer Data per recuperare stats per singolo giocatore, ricaricare stats ed esportare JSON Firebase.
- Aggiornati manifest Soccer Data/stats a V391.

## Cosa resta invariato

- Mapping corrente: `fbref-player-map.v383.json`.
- Numero mapping: 531 confermati, 1 needs-review.
- Soccer Data resta pubblica in sola lettura per non-admin.
- Comandi di associazione, recupero FBref, salvataggio Firebase ed export restano solo admin.
- Nessuna modifica a comunicati, rose, calciomercato, competizioni, snapshot, admin generale o Firebase rules.
- `FUNZIONALITA'.md` non modificato.

## Flusso admin

1. Apri Soccer Data da admin.
2. Su un giocatore mappato clicca `Recupera stats FBref`.
3. La UI chiama la Netlify Function `/.netlify/functions/fbref-player-stats` passando il token Firebase admin.
4. La funzione verifica che l'utente sia admin e recupera una sola pagina giocatore FBref.
5. La funzione restituisce summary normalizzato e tutte le tabelle FBref parsate dalla pagina.
6. La UI salva il payload in Firebase nella collection `soccerDataPlayerStats`.
7. Da Soccer Data l'admin puo scaricare `player-stats-firebase-<seasonId>-v391.json`.
8. Il JSON esportato va verificato e poi pubblicato nella repo come dato statico.

## Lettura runtime

Ordine di lettura:

1. JSON statico in `assets/soccer-data/stats/`.
2. Se lo statico non ha stats compilate, fallback Firebase `soccerDataPlayerStats`.
3. Se anche Firebase non e disponibile, Soccer Data resta consultabile con mapping/listone e mostra stats assenti/template.

## Note tecniche

- La funzione Netlify non scrive direttamente su Firebase: scrive solo il client admin dopo risposta positiva.
- Il parser non si limita ai campi summary: salva anche `tables`, cioe tutte le tabelle HTML/commentate trovate nella pagina FBref.
- Il recupero e volutamente per singolo giocatore: l'aggiornamento massivo andra costruito in un batch controllato/rate-limited successivo.
```

---

## 63. `FUNZIONALITAV392.md`

- Percorso originale: `FUNZIONALITAV392.md`
- Dimensione originale: 2401 byte
- SHA-256: `b50c14891d5a6b9e66fb31b9b3527f4392adb04e05201b1e9a77986c238bec53`

```markdown
# FUNZIONALITA V392 - Soccer Data import HTML FBref fallback

Data: 06/06/2026
Versione sito: V392 Soccer Data import HTML FBref

## Scopo

La V392 interviene solo sulla sezione Soccer Data e mantiene intatte le funzionalita esistenti del sito. La modifica aggiunge un fallback admin per recuperare le statistiche FBref quando il recupero server-side della V391 riceve risposta 403 da FBref.

## Cosa cambia

- Soccer Data resta pubblica in sola lettura.
- I comandi amministrativi restano dentro Soccer Data e sono disponibili solo agli admin.
- Per ogni giocatore mappato FBref l'admin vede anche il pulsante `Importa HTML FBref`.
- Il pulsante apre un pannello locale dove incollare il sorgente HTML completo della pagina giocatore FBref.
- Il parser locale legge tutte le tabelle presenti nel sorgente, incluse quelle eventualmente commentate nell'HTML.
- Il payload viene salvato nella collection Firebase `soccerDataPlayerStats`, usando lo stesso formato compatibile con export JSON statico della V391.
- Il pulsante server `Recupera server FBref` resta disponibile, ma in caso di 403 suggerisce il fallback manuale.

## Flusso admin consigliato

1. Vai in Soccer Data.
2. Sulla riga del giocatore clicca `Recupera server FBref`.
3. Se FBref restituisce 403, clicca `Importa HTML FBref`.
4. Apri FBref dal pulsante nel pannello.
5. Usa visualizza sorgente pagina e copia tutto l'HTML.
6. Incolla nel pannello e premi `Salva su Firebase`.
7. Dopo aver importato i giocatori necessari, clicca `Scarica stats Firebase JSON`.
8. Pubblica il JSON statico nella repo nella fase successiva.

## Vincoli rispettati

- Nessuna modifica a mapping V383.
- Nessuna modifica a Comunicati, Rose, Calciomercato, Competizioni, Snapshot o Area squadra.
- Nessuna modifica a Firebase Rules.
- Nessuno scraping live pubblico.
- Nessun recupero massivo automatico.
- Nessun dato statistico inventato.
- `FUNZIONALITA'.md` non modificato.

## Test

- `node tools/audit-soccer-data-manual-html-import-v392.mjs`
- `node tools/audit-soccer-data-fbref-stats-pipeline-v391.mjs`
- `node tools/audit-soccer-data-public-readonly-v389.mjs`
- `node tools/audit-soccer-data-fbref-batch-v383.mjs`
- `node --check assets/app.js`
- `node --check ../netlify/functions/fbref-player-stats.js`
- `find assets -name '*.js' -type f -print0 | xargs -0 -n 1 node --check`
- `unzip -t zonaorientale_v392_soccer_data_import_html_fbref.zip`
```

---

## 64. `FUNZIONALITAV393.md`

- Percorso originale: `FUNZIONALITAV393.md`
- Dimensione originale: 1275 byte
- SHA-256: `3f4ddf77f6b8190f3897036a4e1c35ddfc218aa9ddb5559a642d30f4384fbd84`

````markdown
# Funzionalita V393 - Soccer Data rules Firebase e fallback locale stats

## Soccer Data
- La sezione resta pubblica in sola lettura.
- I comandi amministrativi restano visibili e azionabili solo dagli admin dentro Soccer Data.
- `Importa HTML FBref` continua a parserizzare tutte le tabelle presenti nel sorgente HTML incollato.
- Il salvataggio prova prima Firestore nella collection `soccerDataPlayerStats`.
- Se Firestore rifiuta la scrittura con `Missing or insufficient permissions`, il payload non viene perso: viene conservato come fallback locale V393.
- `Scarica stats JSON` esporta dati Firebase e dati locali V393 nello stesso payload statico.

## Firebase Rules
- Aggiunto file patch: `docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V393_SOCCER_DATA_STATS.rules`.
- Aggiunto file rules completo aggiornato: `docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V393.rules`.
- Blocco richiesto:

```rules
match /soccerDataPlayerStats/{docId} {
  allow read: if true;
  allow write: if isAdmin();
}
```

## Non modificato
- Mapping FBref V383 invariato.
- Balentien resta unico residuo needs-review.
- Nessuna modifica a Comunicati, Rose, Calciomercato, Snapshot, Competizioni.
- Nessuna modifica a `FUNZIONALITA'.md`.
- Nessuno scraping live pubblico.
````

---

## 65. `FUNZIONALITAV394.md`

- Percorso originale: `FUNZIONALITAV394.md`
- Dimensione originale: 2594 byte
- SHA-256: `ce08e35886faf34111448640fe4ff646bf22ae4f3bd1980f0264906cd30c67a0`

````markdown
# FUNZIONALITA V394 - Soccer Data API-Football cache Firebase

## Obiettivo

Portare Soccer Data verso un flusso piu semplice e stabile rispetto allo scraping FBref: API-Football diventa il provider preferito per recuperare statistiche giocatore in JSON, salvare/cache su Firebase ed esportare poi JSON statici da pubblicare in repo.

## Vincoli rispettati

- Intervento limitato alla sezione Soccer Data.
- Nessuna modifica a Rose, Calciomercato, Comunicati, Snapshot, Competizioni o Trattative.
- Nessuna rimozione del mapping FBref V383.
- Soccer Data resta pubblica in sola lettura.
- Comandi operativi e di scrittura restano visibili/usabili solo da admin.
- Nessuna richiesta API viene fatta dal pubblico: solo admin tramite Netlify Function.

## Novita principali

- Nuova Netlify Function admin-only: `netlify/functions/api-football-player-stats.js`.
- Supporto configurazione API key via variabili ambiente Netlify:
  - `ZONAORIENTALE_API_FOOTBALL_KEY` preferita;
  - fallback: `API_FOOTBALL_KEY`, `API_FOOTBALL_API_KEY`, `APISPORTS_API_KEY`.
- Per ogni giocatore, l'admin puo:
  - cercare candidati API-Football;
  - salvare localmente l'API-Football ID;
  - recuperare le statistiche API-Football del singolo giocatore;
  - salvare il payload su Firebase nella collection gia usata `soccerDataPlayerStats`;
  - scaricare il JSON aggregato con `Scarica stats JSON`.
- Aggiunta colonna tabellare `Aggiornato` per mostrare la data dell'ultimo aggiornamento stats disponibile.
- Il fallback FBref V391/V392 resta disponibile, ma API-Football diventa il percorso consigliato.

## Flusso operativo consigliato

1. Admin apre Soccer Data.
2. Per un giocatore clicca `Cerca API-Football ID`.
3. Sceglie/salva l'ID corretto.
4. Clicca `Recupera API-Football`.
5. Il sito chiama la Netlify Function, riceve JSON API-Football e salva/cache su Firebase.
6. La tabella mostra la data nella colonna `Aggiornato`.
7. Quando ci sono abbastanza dati, l'admin clicca `Scarica stats JSON`.
8. Il JSON scaricato viene inserito nella repo come statico, cosi il sito legge prima statico e riduce le letture API.

## Firebase

La V394 usa la collection gia prevista:

```text
soccerDataPlayerStats
```

Le regole richieste restano:

```rules
match /soccerDataPlayerStats/{docId} {
  allow read: if true;
  allow write: if isAdmin();
}
```

Non viene introdotta una nuova collection Firebase.

## Note

API-Football ha un limite giornaliero sul piano gratuito: il flusso V394 usa un'azione esplicita per singolo giocatore, salva su Firebase e consente export statico proprio per non sprecare richieste API.
````

---

## 66. `FUNZIONALITAV395.md`

- Percorso originale: `FUNZIONALITAV395.md`
- Dimensione originale: 2307 byte
- SHA-256: `555cd31ddc69c3dc5eeaac2d98f1c558182b522f85f042df02c05e70b7d8757c`

```markdown
# FUNZIONALITA V395 - Soccer Data mapping API-Football assistito

## Scopo
La V395 lavora solo sulla sezione Soccer Data. Mantiene la sezione pubblica in sola lettura e sposta il flusso operativo delle statistiche su API-Football.

## Modifiche principali
- La tabella Soccer Data resta visibile a tutti.
- I comandi operativi restano visibili e utilizzabili solo dagli admin.
- I riferimenti operativi al vecchio fallback HTML/manuale sono stati rimossi dalla UI principale.
- Il nome del giocatore resta cliccabile quando e disponibile il link profilo gia presente nel mapping corrente.
- La prima colonna ora e `Giocatore`.
- La colonna di stato ora e `Stato profilo`.
- Aggiunto il file bootstrap `assets/soccer-data/providers/api-football-player-map.v001.json`.
- Aggiunto il pulsante admin `Scarica mapping API`.
- Per ogni giocatore admin sono disponibili:
  - `Trova ID API`
  - `Inserisci ID API`
  - `Recupera statistiche`
- Il mapping API-Football locale viene salvato in localStorage e puo essere esportato in JSON statico.
- La colonna `Aggiornato` resta disponibile per indicare l'ultimo aggiornamento delle stats.

## Flusso operativo admin
1. Apri Soccer Data.
2. Su un giocatore premi `Trova ID API`.
3. Il sito interroga la Netlify Function API-Football e mostra i candidati.
4. Inserisci nel prompt l'ID numerico corretto tra quelli proposti.
5. Premi `Recupera statistiche`.
6. Le statistiche vengono salvate su Firebase nella collection `soccerDataPlayerStats` o nel fallback locale se le rules non sono ancora aggiornate.
7. Premi `Scarica stats JSON` per esportare i dati statistici.
8. Premi `Scarica mapping API` per esportare gli ID provider e pubblicarli come asset statico.

## Invarianti conservati
- Nessuna modifica a Comunicati.
- Nessuna modifica a Rose.
- Nessuna modifica a Calciomercato.
- Nessuna modifica a Competizioni.
- Nessuna modifica a Snapshot.
- Nessuna modifica a Firebase Rules.
- Nessuna modifica al mapping profili V383.
- `FUNZIONALITA'.md` non modificato.

## Note tecniche
- API key sempre lato Netlify, mai nel frontend.
- Il pubblico legge prima JSON statico, poi Firebase, poi nessun dato.
- L'API viene usata solo con azione admin esplicita.
- Il mapping statico API e predisposto in `assets/soccer-data/providers/api-football-player-map.v001.json`.
```

---

## V407 - Home comunicati e Calciomercato mobile

- Modificata la home: il riepilogo “Ultime news e comunicati” visualizza 4 comunicati ordinati temporalmente tramite la stessa logica esistente `getVisibleNewsForSeasonV79`, senza cambiare filtri stagione o rendering dei comunicati.
- Modificata la sezione Calciomercato solo su mobile: le immagini/anteprime articolo `.calciomercato-thumb-v306` vengono nascoste a max-width 720px; le card restano fruibili tramite titolo, metadati, fonte e link.
- Aggiornati footer e cache-buster a V407.


---

## V408 - Rosa espansa con stile Listone

- Aggiornati footer e cache-buster a V408.
- La tabella interna della Rosa squadra espansa usa la skin `roster-listone-skin-v408` e il wrapper `roster-listone-wrap-v408`.
- Colonne preservate: Giocatore, R (RM), Sq, Costo, Qt.A.
- V407 preservata: home a 4 comunicati e immagini Calciomercato nascoste solo da mobile.
- Nessuna funzionalita rimossa o scollegata.

## V419 - Archivio stagioni mobile compatto

- In Archivio Stagioni, da mobile le metriche della card stagione sono organizzate in griglia 2x2: Squadre, Competizioni, Partite, Giocatori.
- Le card di Squadre della stagione sono piu compatte su mobile, con griglia a due colonne quando lo spazio lo consente.
- Rimossa la card separata Albo della stagione per evitare duplicazione con Competizioni.
- Nella card Competizioni il campo ora e' "Vincitore" e mostra squadra con logo quando il dato e' collegato a una seasonTeam.
- La timeline dati carica tutti i comunicati della stagione e li ordina temporalmente dal piu recente.
- Preservate tutte le funzionalita V407-V418, inclusi comunicati home, UX mobile, tabelle Listone/Rose, Area Squadra, Admin e accessibilita mobile.

## Changelog V425 - Consolidamento mobile

- Consolidata la scala mobile globale: titolo/nome `0.78rem`, contenuto/valore `0.73rem`, meta/sottotesto `0.66rem`, label `0.62rem`.
- Aggiunti selettori di protezione per card, sottocard, tabelle giocatori, Area Squadra e Admin.
- Preservate tutte le funzionalita V407-V424.

## V430 - Admin mobile pulsante sopra

- Spostato il controllo Apri/Riduci dei pannelli Admin mobile sopra il titolo e allineato a sinistra.
- Preservate le funzioni Admin esistenti: permessi, Firebase, workflow di pubblicazione, caricamenti, dati e routing non cambiano.

