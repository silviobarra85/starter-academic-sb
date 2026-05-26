## V233 - Hotfix listone, dashboard mobile e tema light
- Corretto filtro stato nella sezione Listone: In listone, Asteriscato e Svincolati ora sono mutuamente coerenti e non si sovrappongono.
- Rimossa duplicazione interna delle checkbox dei campi visibili del Listone.
- Dashboard Presidente mobile: le schede Saldo/Rosa e In vendita/Trattative restano su due colonne anche sugli schermi stretti.
- Rafforzato tema light per Archivio, Statistiche e Confronta con sfondi chiari e testi scuri.
- Aggiornati footer/cache-buster a V233.

## V232 - Hotfix routing comunicati condivisi

- Corretto il redirect utenti della preview dinamica comunicati: gli hash `#news-<id>` ora aprono la sezione News invece di lasciare la webapp senza pagina attiva.
- Il comunicato target viene espanso e scrollato dopo il caricamento dati.
- Aggiornati footer/cache-buster a V232.

## V231 - Preview WhatsApp comunicati dinamica Netlify

- Sostituito il flusso operativo basato su pagine statiche `comunicati/*.html` con una Netlify Function.
- Nuovo endpoint condivisibile: `https://silviobarra.com/zonaorientale/share/news/<id-comunicato>`.
- Il pulsante `Copia link WhatsApp` usa subito l'ID Firebase del comunicato, senza generare file HTML in repo.
- Aggiunta redirect Netlify in `netlify.toml` verso `netlify/functions/news-share.js`.
- L'Admin ora chiarisce che non serve piu' rigenerare/committare preview statiche dopo ogni comunicato.
- Aggiornati footer/cache-buster a V231.

## V230 - Hotfix link WhatsApp comunicati

- Corretto dominio hardcoded dei link comunicati da `www.silviobarra.com` a `silviobarra.com`.
- Il pulsante `Copia link WhatsApp` calcola la base dall'URL corrente.
- Le pagine statiche `comunicati/*.html` ora usano canonical/OG non-`www`.
- I redirect delle preview sono relativi, cosi' non portano a 404 se cambia host.
- Aggiornati footer/cache-buster a V230.

# Changelog consolidato ZonaOrientale

Questo file sostituisce i molti `REFACTOR_Vxxx.md` e `AI_HANDOFF_ZONAORIENTALE_Vxxx.md` storici. Mantiene una vista sintetica di cosa conta davvero per proseguire lo sviluppo.

## V229 - Account presidente in header

- Quando un utente presidente approvato effettua il login, il pulsante header `Account` non viene piu mostrato.
- Al suo posto il pulsante mostra logo squadra e label `Pres. Cognome`.
- Il click sul pulsante porta direttamente alla Dashboard Presidente (`#teamarea`) invece di riaprire il dialog di login.
- Per utenti non approvati resta il comportamento precedente; per admin resta la logica Admin esistente.
- Aggiornati footer/cache-buster a V229.

## V228 - Comunicati condivisibili WhatsApp

- aggiunto `assets/js/domain/news-share-v228.js`;
- aggiunto `tools/generate-news-share-pages.mjs`;
- generate pagine statiche in `comunicati/*.html` per i comunicati presenti negli snapshot;
- `news.html` ora contiene i meta Open Graph dell'ultimo comunicato e reindirizza alla relativa news;
- `index.html` riceve meta Open Graph aggiornati all'ultimo comunicato dal generatore;
- News pubbliche e Admin mostrano pulsanti `Copia link WhatsApp`;
- Admin permette anche di scaricare l'HTML preview di un singolo comunicato;
- aggiornati footer/cache-buster a V228.

## V227 - Hotfix FM Archivio

- Corretto Archivio -> Squadre della stagione: il saldo FM non viene piu' letto solo da `seasonTeams.fmBalance`.
- Aggiunta risoluzione saldo da snapshot rose statiche (`remainingCredits`) e fallback su `fmMovements`.
- Se il dato FM non esiste davvero per una stagione storica, viene mostrato `-` invece di un falso `0 FM`.
- Aggiornati footer/cache-buster a V227.

## V226 - Hotfix statistiche storiche

Correzione mirata della pagina `#stats` dopo segnalazione utente:

- ripristinati i nomi in `Club più vincenti`;
- ripristinati i nomi in `Podi Campionato`;
- `Ultimi titoli assegnati` usa i nomi storici dallo snapshot honor statico quando disponibili;
- `Top FIFA Ranking` non mostra piu la nota ripetitiva `FIFA Ranking` accanto a ogni squadra;
- footer/cache-buster e `DEPLOY_EXPECTED_VERSION_V181` aggiornati a V226.

## V225 - Stabilizzazione finale post-refactor

Overlay tecnico conclusivo del primo ciclo di pulizia V220-V224.

- aggiunto `assets/js/refactor/refactor-stability-v225.js`;
- il sito espone `window.ZonaOrientaleRefactorStatus` per verificare a runtime la presenza dei moduli estratti;
- controllati repository dati V222, orchestrator V221, chrome mobile V220, statistiche storiche V224 e helper Archivio V215/V218/V219;
- nessun cambio UI, nessun cambio dati, nessun cambio Firebase;
- footer/cache-buster e `DEPLOY_EXPECTED_VERSION_V181` aggiornati a V225.

## V224 - Hardening statistiche storiche

Correzioni funzionali e refactor prudente:

- le celle Albo con stato `NON_DISPUTATA`/status non-team non vengono piu conteggiate come titoli;
- `Non disputata` non puo piu comparire tra i club piu vincenti;
- la classifica `Presidenti piu vincenti` pre-carica gli snapshot stagione statici mancanti, cosi usa presidenti e squadre storiche di tutte le stagioni archiviate e non solo l'ultima stagione caricata;
- `historical-stats-compare-v211.js` resta il modulo storico, ma viene rinforzato senza cambiare UI generale o schema dati;
- footer/cache-buster aggiornati a V224.

## Linea storica fino a V188

Le versioni V127-V188 hanno costruito la base del sito: refactor progressivi, UI mobile, componenti admin, asset pubblici, checklist e stabilizzazione. I dettagli granulari sono stati accorpati e non vanno piu mantenuti come file separati salvo recupero storico da Git.

Punti permanenti ereditati:

- sito statico senza build system;
- `assets/app.js` come bundle principale con molte patch storiche;
- CSS mobile stratificato;
- Admin con workflow snapshot/preflight;
- Firebase lato browser;
- preferenza per JSON statici pubblici.

## V189-V198 - Pubblicazione dati e stabilizzazione JSON

Aree consolidate:

- stato pubblicazione Firebase/JSON;
- procedura guidata pubblicazione aggiornamenti;
- miglioramenti a snapshot pubblici;
- helper per Archivio e statistiche storiche;
- validazione asset pubblici;
- riduzione letture Firebase tramite JSON statici.

Documenti vecchi accorpati:

- `RELEASE_NOTES_V187_V198.md`;
- `VALIDAZIONE_AGGIORNAMENTO_V187_V198.md`;
- `changelog/CHANGELOG_REFACTOR_V127_V188.md`;
- handoff/refactor storici in `archive/`.

## V199-V208 - Live data, comunicati e mercato

Aree consolidate:

- comunicati/news live da Firebase in background;
- mercato/trattative live e lazy;
- ottimizzazioni per non caricare dati pesanti a visitatori pubblici;
- integrazione di snapshot e Archivio;
- compatibilita con dashboard presidente e rose.

## V209 - Refactor live data / archivio

Estratta logica in:

```text
assets/js/refactor/live-data-archive-v209.js
```

Gestisce:

- comunicati live Firebase;
- refresh comunicati;
- trasferibili/trattative lazy/live;
- Archivio stagioni da snapshot statici.

Regola: non rendere bloccante il bootstrap pubblico.

## V210 - Refactor generatore comunicati admin

Estratta logica in:

```text
assets/js/refactor/admin-communication-generator-v210.js
```

Il generatore:

- usa dati gia caricati in `state.raw`;
- non scrive automaticamente su Firebase;
- compila il form Comunicati solo quando l'admin conferma;
- mantiene `window.ZonaOrientaleCommunicationGenerator`.

## V211 - Refactor statistiche storiche e confronta

Estratta logica in:

```text
assets/js/refactor/historical-stats-compare-v211.js
```

Gestisce:

- `#stats`;
- `#compare`;
- titoli, podi, FIFA da `honor.json` o fallback;
- layout mobile delle sezioni storiche.

Nota: in seguito e' stato necessario installarlo davvero nel bootstrap con V218.

## V212 - Refactor dashboard presidente / rose

Estratta logica in:

```text
assets/js/refactor/president-dashboard-rosters-v212.js
```

Gestisce:

- dashboard presidente;
- conteggio rosa da raw/snapshot/static rosters;
- helper robusti per rose;
- hub mobile presidente;
- hook renderUserArea/renderAll.

## V213 - Refactor workflow pubblicazione admin

Creato modulo:

```text
assets/js/refactor/admin-publication-workflow-v213.js
```

Contieneva logiche storiche V190/V191/V203:

- stato Firebase/JSON;
- procedura guidata pubblicazione;
- sync preflight asset pubblici.

## V214 - Hotfix stabilizzazione post V213

Il modulo V213 e' stato rimosso dal bootstrap perche poteva impedire la visualizzazione dati. La logica inline stabile e' stata preservata.

Regola: non reinserire V213 senza test browser completi.

## V215 - Hotfix helper Archivio V196

Risolto errore:

```text
ReferenceError: buildSeasonArchiveV196 is not defined
```

Sono stati reinseriti helper base Archivio V196 necessari agli override V204/V209.

## V216 - Classifica campionato completa

Le classifiche di competizioni campionato/classifica supportano:

```text
POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT
```

Estesi:

- Admin risultati competizioni;
- salvataggio Firebase;
- vista pubblica competizioni;
- `competition.html`;
- CSS desktop/mobile.

Campi canonici:

```text
points, played, wins, draws, losses, goalsFor, goalsAgainst, goalDifference, fantapoints
```

## V217 - Cache fix classifica campionato

Corretto problema di cache:

- import `admin-competitions.js` con query versionata;
- link verso `competition.html` con query `v=217` poi evoluta a V219;
- rinforzi CSS per evitare vecchia UI tabellare incompleta.

## V218 - UI mobile globale e pagine storiche

Interventi:

- pulsante globale "Su" mobile-only;
- bottom menu solo smartphone;
- `mobile-viewport.js` basato su larghezza `<= 900px`, non solo pointer coarse;
- `competition.html` senza `body.is-mobile-ux` iniziale;
- installazione reale V211;
- `renderAll()` richiama Statistiche/Confronta e Archivio;
- `stats`, `archive`, `compare` registrati come hash statici.

## V219 - Hotfix Archivio stagioni

Risolto errore:

```text
ReferenceError: getSeasonSortValueV193 is not defined
```

Ripristinati:

```text
HISTORICAL_COMPETITIONS_V193
getSeasonSortValueV193
getSeasonLabelV193
```

Risultato: Archivio stagioni torna visibile e V218 resta attiva.

## V220 - Safety refactor mobile chrome

Primo overlay tecnico del percorso di pulizia codice. Nessuna nuova feature e nessun cambio dati.

Aggiunto:

```text
assets/js/mobile/mobile-chrome-v220.js
```

Centralizza il comportamento mobile condiviso da app principale e pagine standalone:

- pulsante globale `Su`;
- rilevamento smartphone;
- `body.is-mobile-ux`;
- chiusura bottom sheet/menu da desktop;
- rispetto della modalita display forzata desktop.

Aggiornati `app.js`, `competition.html` e `player.html` per usare il nuovo modulo condiviso, eliminando duplicazioni inline.

Cache-buster e footer portati a V220.


## V222 - Data repository facade

Creato modulo:

```text
assets/js/data/repository-v222.js
```

Scopo:

- introdurre una facciata unica per letture Firebase e asset statici;
- instradare i caricamenti statici `listoni/rose/competitions` tramite `loadStaticAssets()`;
- instradare le raccolte Firebase tramite `loadCollections()`;
- esporre `window.ZonaOrientaleDataRepository` per diagnostica e sviluppo futuro;
- non cambiare UI, dati, Firebase o comportamento Admin.

Questa versione prepara il refactor successivo senza rimuovere helper legacy o cambiare il ciclo di render.

## V221 - Separazione rendering public/admin

Secondo overlay tecnico del percorso di pulizia codice. Nessuna nuova feature e nessun cambio dati.

Aggiunto:

```text
assets/js/refactor/public-admin-render-orchestrator-v221.js
```

Il `renderAll()` base di `app.js` e' stato riorganizzato in gruppi:

```text
publicRenderers
adminRenderers
afterRenderers
```

Obiettivo: iniziare la separazione tra rendering pubblico e rendering Admin senza cambiare comportamento visibile e senza toccare i dati.

Aggiornati footer e cache-buster a V221.

## Docs consolidation - 25/05/2026

Ridotta la documentazione da molti file storici a pochi documenti canonici:

```text
README.md
AI_HANDOFF_ZONAORIENTALE_CURRENT.md
ARCHITETTURA_E_DATI.md
OPERATIVITA_ADMIN_E_RELEASE.md
CHANGELOG_CONSOLIDATO.md
ROADMAP.md
firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V124C.rules
```

I vecchi handoff/refactor per versione non vanno piu ricreati automaticamente: usare questo changelog e l'handoff current.

## V223 - CSS cleanup progressivo

Overlay tecnico senza cambio funzionale visibile.

- creato `assets/css/mobile-chrome-v223.css`;
- spostate nel nuovo file le regole globali del pulsante `Su` e del guard desktop bottom menu;
- rimossi i blocchi V218 duplicati da `assets/styles.css` e `assets/css/mobile-suite-v168.css`;
- aggiornati footer/cache-buster a V223 e runtime expected version a 223.

Scopo: iniziare la modularizzazione CSS mantenendo invariata la UI V222.
