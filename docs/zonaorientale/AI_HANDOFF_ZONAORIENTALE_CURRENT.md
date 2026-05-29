# AI Handoff ZonaOrientale - Current V261

## Nota V261 - Svincola Giocatori presidente

V261 aggiunge in `Dashboard Presidente` la sottosezione `Svincola Giocatori`. Il presidente seleziona uno o piu giocatori dalla propria rosa; il sistema costruisce una email indirizzata a `caparrotti86@yahoo.it` con testo standard, elenco giocatori e Qt.A tra parentesi. La quotazione viene cercata partendo dal listone piu recente della stagione corrente che contiene il giocatore. Il flusso non scrive su Firebase e usa EmailJS dal browser. Diagnostica: `window.ZonaOrientalePlayerReleaseV261`.

## Nota V257 - Firebase Rules notifiche trattative multi-dispositivo

V257 aggiunge `docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules` e `FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules`. Le rules consentono al presidente mittente di una trattativa conclusa di aggiornare solo i campi di lettura esito (`outcomeSeenByFromUid`, `outcomeSeenByUid`, `outcomeSeenAtByFromUid`, `outcomeSeenMarkerByFromUid`) su `transferNegotiations/{id}`. Obiettivo: se un esito viene letto da smartphone, il badge non deve riapparire da desktop. Il codice runtime V246 era gia predisposto; V257 fornisce la regola deployabile.


## Nota V256 - Documento funzionalita V240-255

V256 aggiunge `FUNZIONALITA'V240-255.md`, documento separato che riepiloga le funzionalita introdotte o consolidate tra V240 e V255. Non sostituisce e non modifica `FUNZIONALITA'.md`, che resta il registro funzionale principale da aggiornare solo su richiesta esplicita dell'utente.

## Nota V255 - Comandi standard test trattative

V255 aggiorna il simulatore notifiche trattative a `assets/js/dev/trade-notification-simulator-v255.js` e aggiunge `help()`, `getTestCommands()` e `runLocalSmokeTest()` sull'API `window.ZonaOrientaleTradeSimulatorV255`. Resta disponibile l'alias `window.ZonaOrientaleTradeSimulatorV254` per compatibilita' con i comandi gia' annotati. Le simulazioni locali non scrivono in Firebase; `createFirebaseSentProposal({ confirm: true })` scrive davvero in `transferNegotiations`.

## Nota V254 - Simulatore notifiche trattative

V254 aggiunge `assets/js/dev/trade-notification-simulator-v254.js` e l'API runtime `window.ZonaOrientaleTradeSimulatorV254`. Le funzioni locali non scrivono in Firebase e servono per simulare badge/card delle trattative da console browser; la scrittura reale e' disponibile solo con `createFirebaseSentProposal({ confirm: true })`.



## Nota V253 - Estrazione modulare Richieste presidenti

V253 e' il primo estratto modulare prudente da `assets/app.js`: il pannello `Admin -> Richieste presidenti` viene installato da `assets/js/admin/team-requests-panel-v253.js`. Il blocco inline V249 resta come fallback, ma il comportamento canonico usa attributi V253 e diagnostica `window.ZonaOrientaleTeamRequestsV253`. Funzionalita preservate: Aggiorna richieste, Approva, Rifiuta, Elimina da Firebase per comunicati approvati/rifiutati. `FUNZIONALITA'.md` non e' stato modificato.

## Nota V252 - Pulizia asset inutilizzati

V252 e' una release di cleanup controllato: aggiunge `.gitignore` locale in `static/zonaorientale/`, marca come rimovibili i metadati macOS (`.DS_Store`, `__MACOSX`, `._*`) e i CSS `mobile-hotfix-v166.css`/`mobile-hotfix-v167.css`, gia inglobati in `mobile-suite-v168.css` e non referenziati dagli HTML. Diagnostica runtime: `window.ZonaOrientaleCleanupV252`. Le eliminazioni fisiche vanno eseguite con i comandi `git rm` della consegna V252.
Ultimo aggiornamento documentale: 27/05/2026.

## Stato corrente in una frase

Il sito ZonaOrientale e' una webapp statica HTML/CSS/JS puro, attualmente funzionante in **V261**, con dati pubblici prioritariamente serviti da JSON statici, Firebase usato per live/fallback/admin, UI mobile uniformata, Archivio/Statistiche/Confronta ripristinati, hotfix V227 sui saldi FM in Archivio, primo ciclo refactor tecnico V220-V225 chiuso e preview WhatsApp dinamica dei comunicati via Netlify Function, hotfix routing V235 per aprire i comunicati dopo redirect, pulsante account presidente personalizzato in header V240 con sync live trattative presidente, notifiche persistenti e hotfix permission-denied sul comunicato scambio, V241 con flusso Accetta utenti stabile anti-duplicati, V243 con consolidamento canonico del comunicato avvenuto scambio, V244 con eliminazione da Firebase dei comunicati rifiutati, V245 con eliminazione anche dei comunicati approvati dal registro richieste e V246 con lettura esiti trattative sincronizzata su Firebase, V247 con checklist regressioni canonica e V248 con pulizia handler legacy del comunicato scambio e V249 con pannello Admin Richieste presidenti canonico e V250 con ripristino del Generatore comunicati automatici in Admin e V251 con ripristino del workflow pubblicazione Admin V213, V252 con pulizia asset inutilizzati, V253 con estrazione modulare di Admin -> Richieste presidenti e V254 con simulatore notifiche trattative e V255 con comandi standard/smoke test trattative e V256 con documento funzionalita V240-255 separato e V257 con Firebase Rules per notifiche trattative multi-dispositivo, V259/V260 con anteprima home generica e pulizia preview/tag tecnici, V261 con informativa svincolo giocatori in Dashboard Presidente.


## Nota V251 - Workflow pubblicazione Admin ripristinato

In V251 il workflow pubblicazione inline V190/V191/V203 viene reso canonico senza reimportare il modulo esterno V213, evitando doppi listener. Restano attivi i pannelli Admin `Stato Firebase / JSON` e `Procedura guidata Pubblica aggiornamenti`. Il workflow non scrive su Firebase: legge preflight asset pubblici, promemoria locali e modalita admin, genera checklist e comandi Git copiabili. Diagnostica disponibile: `window.ZonaOrientalePublicationWorkflowV251`, oltre a `window.ZonaOrientalePublicationStatus` e `window.ZonaOrientalePublishWizard`.

## Nota V250 - Generatore comunicati automatici ripristinato

Il modulo `assets/js/refactor/admin-communication-generator-v210.js` era importato ma non installato. In V250 viene collegato esplicitamente all'area Admin tramite `installCommunicationGeneratorRefactorV210`. Il generatore prepara solo bozze locali: puo' copiare il testo o inserirlo nel form `Admin -> Comunicati`, ma non scrive direttamente su Firebase e non pubblica automaticamente news. Diagnostica disponibile: `window.ZonaOrientaleCommunicationGeneratorV250`.

## Nota V249 - Richieste presidenti canoniche

La sezione `Admin -> Richieste presidenti` e' stata consolidata in V249: il pannello usa un solo render canonico, un refresh dedicato da Firebase, handler dedicati per Approva/Rifiuta ed eliminazione da Firebase dei soli comunicati approvati/rifiutati. I vecchi attributi V244/V245 non vengono piu' usati dal render canonico.

## Posizione e struttura progetto

Nel repository reale il sito sta sotto:

```text
static/zonaorientale/
```

La documentazione sta sotto:

```text
docs/zonaorientale/
```

Quando si consegna uno zip all'utente, usare invece le due radici:

```text
zonaorientale/
docs/
```

Lo zip deve contenere **solo i file effettivamente modificati**.

## Regole utente da rispettare sempre

- Fornire un solo zip quando si consegnano modifiche.
- Dentro lo zip usare le cartelle `zonaorientale/` e `docs/`.
- Inserire solo i file modificati.
- Dare sempre i comandi Git, con messaggio di commit coerente.
- Dare sempre i comandi locali quando si tocca il sito.
- Ogni modifica UI/codice del sito deve aggiornare footer `Version` e cache-buster.
- Ogni overlay funzionale deve aggiornare l'handoff corrente e il changelog consolidato.
- Verificare sempre mobile quando si toccano tabelle, menu, pulsanti fissi o pagine lunghe.

Comandi locali richiesti dall'utente:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Poi aprire:

```text
http://localhost:1313/zonaorientale/
```











## V248 - Pulizia handler legacy comunicato scambio

V248 aggiunge un guard runtime per rimuovere eventuali vecchi form/handler V50/V79/V237 del comunicato avvenuto scambio e mantenere un solo flusso canonico V242/V243: presidente -> `teamRequests/TRANSFER_NEWS` -> EmailJS -> approvazione Admin -> News. La diagnostica e' disponibile in `window.ZonaOrientaleLegacyCleanupV248`. `FUNZIONALITA'.md` non e' stato modificato.

## V247 - Checklist regressioni

V247 aggiunge `docs/zonaorientale/REGRESSION_TESTS.md`, checklist operativa per testare pubblico, presidente, admin, mobile, Firebase e controlli tecnici prima di merge/deploy. La release non introduce modifiche funzionali runtime oltre a footer/cache-buster/diagnostica. `FUNZIONALITA'.md` non e' stato modificato, come da regola di aggiornamento solo esplicito.

## V246 - Notifiche trattative sincronizzate su Firebase

V246 rende piu' robusto il badge delle trattative: quando il presidente mittente apre la card di una proposta conclusa, il sito marca l'esito come letto anche nel documento `transferNegotiations/{id}` (`outcomeSeenByFromUid`, `outcomeSeenAtByFromUid`, `outcomeSeenMarkerByFromUid`). `localStorage` resta come fallback se le regole Firebase negano l'update, ma il comportamento atteso e' la sincronizzazione tra desktop e mobile. Quando il destinatario approva o rifiuta, il flag di lettura del mittente viene resettato. `FUNZIONALITA'.md` non e' stato modificato in questa release, come da regola di aggiornamento solo esplicito.

## V245 - Elimina comunicati approvati da Firebase

V245 estende Admin -> Richieste presidenti: il pulsante `Elimina da Firebase` compare anche sui comunicati approvati (`TEAM_NEWS` e `TRANSFER_NEWS`, inclusi topic `COMUNICATO_SQUADRA` e `COMUNICATO_AVVENUTO_SCAMBIO`), non solo sui rifiutati. La cancellazione rimuove il documento `teamRequests/{id}`; se il comunicato approvato e' gia' stato pubblicato nelle News, la news pubblicata non viene cancellata. `FUNZIONALITA'.md` non e' stato modificato in questa release, come da regola di aggiornamento solo esplicito.

## V244 - Elimina comunicati rifiutati da Firebase

V244 aggiunge in Admin -> Richieste presidenti il pulsante `Elimina da Firebase` per i soli comunicati rifiutati (`TEAM_NEWS` e `TRANSFER_NEWS`, inclusi topic `COMUNICATO_SQUADRA` e `COMUNICATO_AVVENUTO_SCAMBIO`). Il pulsante compare dopo il rifiuto, chiede conferma e cancella il documento `teamRequests/{id}`. `FUNZIONALITA'.md` non e' stato modificato in questa release, come da regola di aggiornamento solo esplicito.

## V243 - Comunicato scambio canonico

V243 consolida il flusso Presidente -> Comunicato avvenuto scambio: viene mantenuto un solo form canonico (`teamTransferCommunicationFormV243`) che salva `teamRequests` con `type: TRANSFER_NEWS`, `topic: COMUNICATO_AVVENUTO_SCAMBIO`, invia subito EmailJS a `caparrotti86@yahoo.it` e lascia la pubblicazione in News all'approvazione Admin. Gli agganci legacy V50/V79 vengono neutralizzati per evitare doppio submit o tentativi di scrittura diretta in `news` da account presidente. `FUNZIONALITA'.md` non e' stato modificato in questa release, come da regola di aggiornamento solo esplicito.

## V241 - Accetta utenti stabile

V241 corregge la ricomparsa periodica in Admin -> Accetta utenti di account gia' approvati o gia' rifiutati. Il rifiuto non cancella piu' `pendingUsers/{uid}`: imposta `status: REJECTED`, con metadati `rejectedAt/rejectedBy`, cosi' lo stesso login non puo' rigenerare una nuova richiesta. Inoltre `upsertPendingUserV34` non riscrive piu' come `PENDING` un utente gia' presente in `teamUsers`, e il pannello admin nasconde eventuali vecchi duplicati pending di utenti gia' approvati. `FUNZIONALITA'.md` non e' stato modificato in questa release, come da regola di aggiornamento solo esplicito.

## V240 - Sync live trattative presidente

V240 corregge il disallineamento tra badge notifiche e sottosezione `Trattative`: il loader lazy ora rispetta `force: true`, rilegge da Firebase quando si entra nella Dashboard Presidente o si apre il riquadro Trattative da mobile, e ridisegna le liste Inviate/Ricevute con la stessa sorgente live usata dai badge. `FUNZIONALITA'.md` non e' stato modificato in questa release, come da regola di aggiornamento solo esplicito.

## V239 - Notifiche trattative presidente e hotfix permission-denied

V239 corregge il permission-denied visto dal presidente sul submit del comunicato avvenuto scambio: dopo il salvataggio in `teamRequests`, il flusso non forza piu' il caricamento completo admin e quindi non tenta la lettura non consentita di `teamUsers`.

Inoltre aggiunge le notifiche trattative presidente: badge rosso con punto esclamativo bianco su `Dashboard Presidente` e sul pulsante header `Pres. Cognome` quando ci sono proposte ricevute in attesa o esiti di proposte inviate da leggere. Il riepilogo resta nella sottosezione `Trattative`, sotto Inviate/Ricevute, con proposta compatta ed esito.

## V237 - Hotfix comunicato scambio presidente e permessi Firebase

V237 corregge il flusso introdotto in V236: con le regole Firestore correnti i presidenti approvati possono creare documenti in `teamRequests`, mentre `news` resta scrivibile solo dagli admin. Il form "Comunicato avvenuto scambio" registra una richiesta `TRANSFER_NEWS`, invia subito la mail EmailJS a `caparrotti86@yahoo.it` e rende la richiesta approvabile dall'Admin, che pubblica poi in News con topic `COMUNICATO_AVVENUTO_SCAMBIO`.

## V236 - Ripristino comunicato avvenuto scambio presidente

V236 ripristina nella Dashboard Presidente il secondo tipo di comunicato che era ancora presente in parte nel codice legacy V50/V79, ma non veniva piu' montato dopo il refactor V119 dell'area squadra.

Funzionamento attuale:

- `Comunicato squadra`: resta il flusso ordinario con richiesta admin `TEAM_NEWS` e approvazione.
- `Comunicato avvenuto scambio`: nuovo pannello reinserito sotto il comunicato squadra; pubblica subito in Firebase `news` e invia EmailJS a `caparrotti86@yahoo.it`.
- Topic News usato: `COMUNICATO_AVVENUTO_SCAMBIO`.
- Oggetto email: `Comunicato avvenuto scambio NOME_SQUADRA`.
- Corpo email: titolo, testo, giocatori/contropartite coinvolti e squadra coinvolta, quando compilati.
- Mobile: l'hub Dashboard Presidente riceve anche l'azione rapida `Scambio` che scrolla al form.

File toccati: `assets/app.js`, `assets/js/domain/labels.js`, footer/cache-buster HTML e documentazione canonica.

## V235 - Hotfix routing comunicati condivisi

V235 corregge il comportamento post-preview della V231: la Netlify Function reindirizza a `/zonaorientale/#news-<id>`, ma il router legacy interpretava hash non statici come slug squadra. Il risultato era una pagina vuota con solo header/footer. Ora gli hash `news-<id>` attivano esplicitamente la pagina News, renderizzano i comunicati e aprono/scorrono il comunicato target.

## V231 - Comunicati WhatsApp dinamici Netlify

V231 supera il flusso statico V228/V230. I comunicati condivisibili non devono piu' essere generati come file HTML in `comunicati/` dopo ogni pubblicazione.

Endpoint attivo:

```text
/zonaorientale/share/news/<id-comunicato>
```

`netlify.toml` lo riscrive verso:

```text
/.netlify/functions/news-share?id=<id-comunicato>
```

La funzione `netlify/functions/news-share.js` legge `news/<id>` da Firestore, genera HTML con meta Open Graph e reindirizza il browser a `/zonaorientale/#news-<id>`. Il pulsante `Copia link WhatsApp` ora usa questo endpoint dinamico e il comunicato e' condivisibile subito dopo il salvataggio.

Il vecchio generatore `tools/generate-news-share-pages.mjs` e la cartella `comunicati/` restano legacy: non usarli per il flusso ordinario.

## Legacy V230 - Link WhatsApp/preview comunicati statici

V230 corregge i 404 dei link WhatsApp/preview comunicati introdotti dalla V228. La causa era l'uso hardcoded del dominio `https://www.silviobarra.com/zonaorientale/`, mentre il sito pubblico corretto usa `https://silviobarra.com/zonaorientale/` senza `www`.

Regole V230 legacy:

- `NEWS_SHARE_DEFAULT_BASE_URL_V228` ora punta a `https://silviobarra.com/zonaorientale/`;
- i link copiati dal browser non usano piu' un host fisso: `getNewsShareBaseUrlV230()` calcola la base dal path corrente;
- le pagine statiche `comunicati/*.html` hanno canonical/OG non-`www`;
- le pagine statiche reindirizzano con path relativo (`../#news-id` o `./#news-id`) per evitare 404 se cambia host;
- da V231 non bisogna piu' rigenerare e committare `news.html`, `index.html` e `comunicati/*.html` per ogni comunicato.

## Fix V229 - Account presidente in header

Quando un presidente approvato effettua login, il pulsante `#openLoginBtn` non deve mostrare il testo generico `Account`. La V229 lo trasforma in un pulsante compatto con logo squadra e label `Pres. Cognome`, usando il presidente approvato collegato a `teamUsers/{uid}` e, quando possibile, l'anagrafica in `presidents`.

Comportamento atteso:

```text
utente anonimo/non approvato -> Accedi / Registrati o Account legacy
presidente approvato -> logo squadra + Pres. Cognome
click presidente -> Dashboard Presidente (#teamarea)
admin -> comportamento Admin invariato
```

Implementazione in `assets/app.js`:

```text
getPresidentNameForAccountButtonV229
getPresidentSurnameForAccountButtonV229
renderPresidentAccountButtonContentV229
updatePresidentAccountButtonV229
openPresidentDashboardFromHeaderV229
```

CSS in `assets/styles.css`, blocco `V229 - Header account presidente`.

## Legacy V228 - Comunicati condivisibili WhatsApp statici

V228 introduce pagine statiche dedicate ai comunicati per risolvere le anteprime WhatsApp. WhatsApp non esegue il JavaScript della webapp: legge solo i meta tag Open Graph presenti nell'HTML scaricato.

File/parti rilevanti:

```text
assets/js/domain/news-share-v228.js
tools/generate-news-share-pages.mjs
comunicati/*.html
news.html
```

Flusso corretto dopo un nuovo comunicato:

```bash
cd static/zonaorientale
node tools/generate-news-share-pages.mjs
cd ../..

git add static/zonaorientale/news.html static/zonaorientale/comunicati static/zonaorientale/index.html
git commit -m "data: aggiorna anteprime comunicati whatsapp"
git push
```

Il pannello Admin mostra per ogni comunicato il pulsante `Copia link WhatsApp`, che punta a `https://silviobarra.com/zonaorientale/comunicati/<slug>.html?v=<id>`. Le pagine `comunicati/*.html` contengono `og:title`, `og:description`, `og:image`, `og:url` e poi reindirizzano alla news nella webapp.

Nota V231: questa limitazione valeva solo per il flusso statico. Con Netlify Function, il comunicato salvato su Firebase e' subito condivisibile se la funzione riesce a leggere Firestore.

## Fix V227 - FM Archivio

Il bug rilevato in Archivio era causato dal rendering delle card squadra: veniva letto solo `seasonTeam.fmBalance`, ma gli snapshot pubblici non salvano quel campo dentro `seasonTeams`.

La V227 introduce una risoluzione robusta del saldo FM Archivio:

1. campo diretto su `seasonTeams`, se presente (`fmBalance`, `balance`, `remainingCredits`, ecc.);
2. snapshot statici `assets/rose/*.json`, abbinati per stagione e nome squadra, usando `remainingCredits`;
3. somma dei `fmMovements` della stagione come fallback.

Se nessuna sorgente contiene il dato, l'Archivio mostra `-` invece di un falso `0 FM`.

## Versione corrente codice

Versione sito: **V248 pulizia handler legacy**.

Footer corrente atteso:

```text
ZonaOrientale Salerno · V248 pulizia handler legacy · Ultimo aggiornamento 26/05/2026
```

Cache-buster HTML principali attesi: `?v=248`.

Nota tecnica: in `assets/app.js` la costante diagnostica `DEPLOY_EXPECTED_VERSION_V181` e allineata a `256`. Dopo ogni overlay codice/UI va aggiornata insieme a footer e cache-buster.

## File principali del sito

```text
zonaorientale/index.html
zonaorientale/competition.html
zonaorientale/player.html
zonaorientale/news.html
zonaorientale/assets/app.js
zonaorientale/assets/styles.css
zonaorientale/assets/css/*.css
zonaorientale/assets/js/**/*.js
zonaorientale/assets/snapshots/**/*.json
zonaorientale/assets/rose/*.json
zonaorientale/assets/listoni/*.json
zonaorientale/assets/competitions/**/*.json
```

`assets/app.js` e' ancora il bundle principale e contiene molta logica storica Vxxx. Non rimuovere helper storici solo perche sembrano duplicati: diversi override successivi li richiamano direttamente.

## Moduli refactor attivi

Questi moduli sono presenti e rilevanti:

```text
assets/js/refactor/live-data-archive-v209.js
assets/js/refactor/admin-communication-generator-v210.js
assets/js/refactor/historical-stats-compare-v211.js
assets/js/refactor/president-dashboard-rosters-v212.js
assets/js/refactor/admin-publication-workflow-v213.js
assets/js/refactor/public-admin-render-orchestrator-v221.js
assets/js/data/repository-v222.js
assets/js/refactor/refactor-stability-v225.js
```

Stato effettivo:

- **V209 live-data/archive**: attivo. Gestisce comunicati live, mercato/trattative live/lazy e Archivio stagioni.
- **V210 generatore comunicati admin**: attivo. Compila bozze comunicati da dati gia presenti; non deve scrivere automaticamente su Firebase.
- **V211 statistiche/confronta**: presente e, dopo V218/V219, installato realmente nel bootstrap. In V224 esclude `NON_DISPUTATA` dai titoli e pre-carica snapshot statici per calcolare i presidenti vincenti su tutte le stagioni. In V226 legge sempre lo snapshot honor statico normalizzato quando disponibile, cosi Club piu vincenti, Podi Campionato e Ultimi titoli assegnati mostrano i nomi storici invece di `-`; inoltre Top FIFA Ranking non stampa piu la nota ripetitiva `FIFA Ranking` su ogni riga. Gestisce `#stats` e `#compare`.
- **V212 dashboard presidente/rose**: attivo. Gestisce dashboard presidente, helper rose e hub mobile presidente.
- **V213 admin-publication-workflow**: file presente ma **non reinserire nel bootstrap senza test browser**. Era stato disattivato in V214 perche poteva bloccare la visualizzazione dei dati. Se ripreso, installarlo lazy/con try-catch e verificare tutto il bootstrap.
- **V225 refactor-stability**: attivo. Espone `window.ZonaOrientaleRefactorStatus` con controlli runtime leggeri sui moduli V220-V224; non cambia UI/dati e non blocca il bootstrap.

## Stato funzionale recente

### V227 - Hotfix FM Archivio

V227 corregge Archivio -> Squadre della stagione: i saldi FM non vengono piu' mostrati tutti a `0 FM` quando lo snapshot stagione non contiene `seasonTeams.fmBalance`.

La risoluzione ora usa, in ordine:

1. campi diretti su `seasonTeams`;
2. `assets/rose/*.json` / `remainingCredits`, abbinati per stagione e nome squadra;
3. somma di `fmMovements` come fallback.

Se nessuna sorgente contiene il dato, viene mostrato `-` invece di un falso `0 FM`.

### V226 - Hotfix statistiche storiche

V226 corregge regressioni visive nella pagina `#stats` dopo V224/V225:

- `Club più vincenti` non deve mostrare solo `-`;
- `Podi Campionato` non deve mostrare solo `-`;
- `Ultimi titoli assegnati` deve mostrare i vincitori storici, non solo quelli dell'ultima stagione;
- `Top FIFA Ranking` non deve ripetere `FIFA Ranking` accanto a ogni squadra.

Causa tecnica: in alcuni flussi `state.publicHonorSnapshot` poteva arrivare da Firebase/raw senza `honorRows` normalizzati, facendo ricadere le statistiche su `raw.honorRoll` con soli ID `seasonTeamId`; per le stagioni storiche non ancora caricate il nome non era risolvibile e veniva visualizzato `-`. Il modulo ora preferisce sempre lo snapshot honor statico normalizzato (`assets/snapshots/honor.json`, anche in forma wrapper `{ snapshot: ... }`) quando disponibile.


### V225 - Stabilizzazione finale post-refactor

V225 chiude il primo ciclo di refactor tecnico V220-V224 senza cambiare comportamento visibile.

File toccati lato codice:

```text
assets/app.js
assets/js/refactor/refactor-stability-v225.js
index.html
competition.html
player.html
```

Cosa fa:

- aggiorna footer/cache-buster e `DEPLOY_EXPECTED_VERSION_V181` a 225;
- aggiunge un controllo runtime non bloccante per verificare la presenza dei moduli V220-V224;
- espone il report in `window.ZonaOrientaleRefactorStatus`;
- non modifica dati, Firebase, UI o logiche Admin.

Test specifico consigliato:

```text
Console browser:
window.ZonaOrientaleRefactorStatus.ok deve essere true.
Home, Archivio, Statistiche e Confronta devono continuare a caricarsi.
Admin > Risultati competizioni deve continuare a mostrare classifica campionato completa.
Mobile: bottom menu solo smartphone e pulsante Su solo dopo scroll.
```


### V224 - Hardening statistiche storiche

V224 corregge due problemi reali della pagina `#stats`:

- `Non disputata` non deve essere trattata come club vincitore. Le celle Albo con `kind: "status"`, `status: "NON_DISPUTATA"` o label equivalente vengono ignorate nei conteggi titoli/podi.
- `Presidenti piu vincenti` non deve limitarsi all'ultima stagione. Il modulo ora pre-carica gli snapshot stagione statici mancanti, recuperando `seasonTeams` e `presidents` storici per calcolare i titoli dei presidenti su tutto l'archivio.

File toccati lato codice:

```text
assets/app.js
assets/js/refactor/historical-stats-compare-v211.js
index.html
competition.html
player.html
```

Test specifico consigliato:

```text
Home -> Statistiche
- Club piu vincenti: Non disputata non deve comparire.
- Presidenti piu vincenti: devono comparire presidenti di tutte le stagioni storiche, non solo quelli dell'ultima stagione.
Home -> Confronta
- La pagina deve continuare a caricarsi.
Archivio
- Le stagioni devono continuare a vedersi.
```

### V216/V217 - Classifica campionato completa

Le competizioni di tipo campionato/classifica devono inserire e visualizzare le colonne in questo ordine:

```text
POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT
```

Campi canonici salvati/attesi nei risultati:

```text
position
teamId/teamName
points
played
wins
draws
losses
goalsFor
goalsAgainst
goalDifference
fantapoints
```

Compatibilita: molte funzioni leggono anche alias legacy, quindi non rompere questa tolleranza.

V217 ha aggiunto cache-buster agli import critici, in particolare `admin-competitions.js?v=219` nella versione corrente, per evitare cache vecchia del modulo Admin.



### V222 - Data repository facade

V222 e' il terzo overlay tecnico del percorso di refactor. Non cambia UI, dati, Firebase o flussi Admin.

Cosa e' stato fatto:

```text
assets/js/data/repository-v222.js
assets/js/refactor/refactor-stability-v225.js
```

Il nuovo modulo introduce una facciata unica per:

```text
loadCollections(COLLECTIONS)
loadLeagueConfigFromFirebase()
loadStaticAssets() -> listoni, rose, calendari competizioni statici
loadPublicConfig() -> config statica con fallback Firebase
```

`app.js` continua a mantenere la logica di merge, snapshot e render, ma i punti di accesso ai dati sono ora instradati da `window.ZonaOrientaleDataRepository`. Questo prepara il per futuri refactor senza cambiare comportamento visibile.

Test minimi dopo V222:

```text
Home pubblica e selettore stagione
Admin login e refresh dati
Admin > Risultati competizioni
Competizione campionato con classifica completa
Archivio, Statistiche, Confronta
Listone e Rose
Mobile bottom menu e pulsante Su
competition.html e player.html
```


### V221 - Separazione rendering public/admin

V221 e' il secondo overlay tecnico del percorso di refactor. Non cambia UI, dati, Firebase o flussi Admin.

Cosa e' stato fatto:

```text
assets/js/refactor/public-admin-render-orchestrator-v221.js
assets/js/data/repository-v222.js
assets/js/refactor/refactor-stability-v225.js
```

Il nuovo modulo centralizza il ciclo di rendering principale in tre gruppi:

```text
publicRenderers  -> header, selettori, dashboard, competizioni, placeholder, squadre, stadi
adminRenderers   -> area Admin
afterRenderers   -> sezioni collassabili e post-render
```

In `app.js`, il `renderAll()` base non chiama piu direttamente ogni renderer uno per uno, ma delega all'orchestratore V221. Gli override storici successivi restano compatibili perche continuano ad agganciarsi a `renderAll` come prima.

Test minimi dopo V221:

```text
Home pubblica
Admin visibile solo per admin
Dashboard e competizioni
Archivio, Statistiche, Confronta
Classifica campionato completa
Mobile bottom menu e pulsante Su
competition.html e player.html
```

### V220 - Safety refactor mobile chrome

V220 e' un overlay tecnico a basso rischio: non cambia dati, flussi Admin o UI visibile.

Cosa e' stato fatto:

```text
assets/js/mobile/mobile-chrome-v220.js
```

Il nuovo modulo centralizza:

- rilevamento smartphone `<= 900px` con rispetto di `zonaOrientaleDisplayMode=desktop`;
- setup/visibilita del pulsante globale `Su`;
- classe `body.is-mobile-ux`;
- chiusura bottom menu/sheet quando si torna desktop.

`app.js`, `competition.html` e `player.html` usano ora lo stesso helper. Sono state rimosse duplicazioni inline dalle pagine standalone, mantenendo ID/classe legacy del pulsante (`globalScrollTopBtnV218`, `zo-scroll-top-v218`) per non cambiare CSS o markup gia stabile.

Test minimi dopo V220:

```text
Home desktop/mobile
competition.html desktop/mobile
player.html desktop/mobile
bottom menu desktop nascosto
pulsante Su visibile solo smartphone dopo scroll
Archivio, Statistiche, Confronta
Admin > Risultati competizioni
```

### V218/V219 - UI mobile e pagine storiche

Il pulsante globale "Su" e' mobile-only:

- appare solo su smartphone;
- appare dopo scroll verso il basso;
- scompare in cima;
- usa markup `#globalScrollTopBtnV218` e classe `.zo-scroll-top-v218`.

Il bottom menu deve apparire solo da smartphone. Non deve comparire su desktop, nemmeno su laptop touch.

`competition.html` non deve partire con `body.is-mobile-ux` gia settata: la classe mobile viene decisa a runtime.

`stats`, `archive` e `compare` sono hash statici e non devono essere interpretati come slug squadra.

V219 ha ripristinato gli helper mancanti necessari all'Archivio:

```text
HISTORICAL_COMPETITIONS_V193
getSeasonSortValueV193
getSeasonLabelV193
```

Senza questi, l'Archivio fallisce con:

```text
ReferenceError: getSeasonSortValueV193 is not defined
```

## Architettura dati in breve

Ordine pubblico preferito:

1. JSON statici in `assets/public`, `assets/snapshots`, `assets/rose`, `assets/listoni`, `assets/competitions`.
2. Snapshot Firebase pubblici come fallback.
3. Collection Firebase granulari solo Admin o live/lazy quando serve.

Dati live:

- comunicati/news: Firebase in background;
- trasferibili/trattative: Firebase lazy/live quando un presidente apre mercato/dashboard;
- admin completo: solo dopo `Admin -> Carica dati amministrazione`.

Regola importante: se un dato esiste anche nei JSON statici, modificarlo solo in Firebase non basta. Dopo refresh/logout il sito puo tornare a leggere il JSON statico vecchio.

## Flusso Admin dati da ricordare

Dopo modifiche dati pubblici da Admin:

1. salvare la modifica in Admin;
2. `Admin -> Snapshot pubblici -> Aggiorna tutto`;
3. scaricare gli overlay/static JSON necessari;
4. applicarli nella repo;
5. commit + push.

Esempi:

- classifiche/risultati/squadre/competizioni: aggiornare snapshot stagioni;
- Albo/Palmares/FIFA: aggiornare `assets/snapshots/honor.json`;
- rose Excel: aggiornare `assets/rose/*`, poi reinizializzare e rigenerare snapshot;
- listone Excel: aggiornare `assets/listoni/*`;
- config/stagioni: aggiornare `assets/public/config.json`.

## Test minimi dopo codice

Da root `static/zonaorientale` o equivalente:

```bash
find assets -name '*.js' -type f -print0 | xargs -0 -n1 node --check
find assets -name '*.json' -type f -print0 | xargs -0 -n1 jq empty
```

Se `jq` non e' disponibile:

```bash
find assets -name '*.json' -type f -print0 | xargs -0 -n1 python3 -m json.tool >/dev/null
```

Test manuali consigliati:

- home/dashboard pubblica;
- Albo d'Oro;
- Competizioni e pagina singola competizione;
- classifica campionato completa da desktop e mobile;
- `#archive` con cambio stagione;
- `#stats`;
- `#compare`;
- login presidente: dashboard, rose, mercato lazy/live;
- login admin: risultati competizioni, snapshot pubblici, checklist online;
- mobile: bottom menu solo smartphone, pulsante Su solo dopo scroll.

## Rischi noti

- Cache browser/GitHub Pages: quando si modifica un modulo importato da `app.js`, aggiungere cache-buster anche nello static import.
- Funzioni Vxxx storiche: possono sembrare morte ma essere usate da override successivi. Prima di rimuovere usare `grep` e test browser.
- `admin-publication-workflow-v213.js`: non riattivare senza test completi.
- Archivio: dipende dalla catena V193/V196/V204/V209/V218/V219.
- Mobile: non usare solo `pointer: coarse`; usare anche width/viewport per evitare UI mobile su desktop touch.
- Gli errori DevTools del tipo `A listener indicated an asynchronous response...` spesso vengono da estensioni browser, non dal sito.

## Come consegnare la prossima modifica

1. Applicare la modifica.
2. Aggiornare footer/cache-buster se e' codice/UI sito.
3. Aggiornare questi docs se cambia architettura/stato.
4. Creare zip unico con sole modifiche:

```text
zonaorientale/...
docs/...
```

5. Dare comandi Git:

```bash
git status
git add ...
git commit -m "messaggio coerente"
```

## Stato refactor V223

La V223 e' un overlay tecnico senza cambi funzionali visibili. Ha centralizzato il chrome mobile globale nel nuovo file:

```text
assets/css/mobile-chrome-v223.css
```

Il file assorbe i blocchi duplicati V218 relativi a pulsante `Su`, vecchi pulsanti `listone/competition` e guard desktop del bottom menu. I blocchi corrispondenti sono stati rimossi da `assets/styles.css` e `assets/css/mobile-suite-v168.css` per iniziare la pulizia CSS senza alterare il layout.

Versione runtime attesa: **238**. Dopo modifiche successive aggiornare sempre footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181`.


## Update V235
- Hotfix pre-checkpoint: filtri stato Listone corretti, dashboard presidente mobile a due colonne per le metriche, tema light rafforzato su Archivio/Statistiche/Confronta.
- Il flusso comunicati dinamici Netlify rimane quello della V231/V232 e risulta funzionante sul master.


## Update V235 - Hotfix filtri Listone

Corretto il comportamento dei filtri stato nella sezione pubblica `#listone`. La semantica richiesta e' ora:

- `In listone`: filtra solo giocatori con stato `In listone` / `IN_LISTONE`;
- `Asteriscato`: filtra solo giocatori con stato `Asteriscato` / `ASTERISCATO`;
- `Svincolati`: filtra solo giocatori non associati ad alcuna rosa (`fantasyRoster` vuoto o `Svincolati`).

Le categorie non sono rese mutuamente esclusive a livello dati: un giocatore puo' avere stato `In listone` ed essere anche svincolato perche' non presente in alcuna rosa. I filtri funzionano quindi come unione delle categorie selezionate. Se nessun filtro stato e' selezionato, la tabella resta vuota.

## V235 - Stato corrente
Hotfix Listone: le checkbox sono ora coerenti con le colonne visibili. `In listone`/`Asteriscato` operano sulla colonna Stato, `Svincolati` opera sulla colonna Rosa.

## Update V236 - Comunicati scambio presidente

- Ripristinato il form presidente `Comunicato avvenuto scambio` perso dal render V119.
- Il form V236 tentava pubblicazione diretta in `news` e invio EmailJS a `caparrotti86@yahoo.it`; V239 corregge il problema permessi spostando la pubblicazione in approvazione Admin.
- Aggiunto topic `COMUNICATO_AVVENUTO_SCAMBIO` nelle label.
- Aggiornati footer/cache-buster, diagnostica versione e documentazione a V236.
