# Aggiornamento V263 - Funzionalita V256-262

V263 aggiunge `FUNZIONALITA'V256-262.md`, registro incrementale delle funzionalita introdotte o consolidate tra V256 e V262. Non modifica `FUNZIONALITA'.md` e non cambia il comportamento runtime. Diagnostica: `window.ZonaOrientaleFeaturesDocV263`.

# Aggiornamento V262 - Audit pulizia codice

V262 aggiunge `AUDIT_CODICE_260528_V262.md` e una `.gitignore` locale in `static/zonaorientale/`. Non cambia funzionalita': fotografa file duplicati/non importati, file macOS e candidati a pulizia controllata. Diagnostica runtime: `window.ZonaOrientaleAuditV262`.

# Documentazione ZonaOrientale

Documentazione consolidata al 26/05/2026, stato codice sito **V262**.

Questa cartella sostituisce la vecchia struttura con molti `AI_HANDOFF_ZONAORIENTALE_Vxxx.md`, `REFACTOR_Vxxx.md`, release note e archivi storici sparsi. Da ora la documentazione operativa va mantenuta in pochi file canonici.

## File da leggere

1. `AI_HANDOFF_ZONAORIENTALE_CURRENT.md`  
   Handoff totale per il prossimo assistente AI. Contiene stato del progetto, regole operative, moduli attivi, rischi noti e test minimi.

2. `ARCHITETTURA_E_DATI.md`  
   Struttura tecnica del sito, file principali, moduli estratti, ordine di lettura JSON/Firebase e schema dati delle classifiche campionato.

3. `OPERATIVITA_ADMIN_E_RELEASE.md`  
   Flussi pratici per modifiche dati, snapshot, JSON statici, test, overlay, cache-buster, comandi locali e Git.

4. `CHANGELOG_CONSOLIDATO.md`  
   Riassunto cronologico delle versioni storiche e delle patch recenti fino a V261.

5. `ROADMAP.md`  
   Idee e priorita future, accorpate dal vecchio documento sulle nuove funzionalita.

6. `REGRESSION_TESTS.md`  
   Checklist operativa da usare prima di merge e deploy per ridurre il rischio regressioni.

7. `firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules`  
   Regole Firestore complete aggiornate per notifiche trattative multi-dispositivo. Il file patch V257 contiene solo la sezione da integrare se non vuoi sostituire tutto il file rules.

8. `PROSSIME_ATTIVITA_260528.md`  
   Backlog e note operative del branch `refactor/260528-zonaorientale-next`, aggiornato fino alla V261.

## Regola per i prossimi aggiornamenti docs

Non creare piu un file handoff/refactor per ogni micro-versione, salvo necessita reale. Aggiornare invece:

- `AI_HANDOFF_ZONAORIENTALE_CURRENT.md` per lo stato corrente;
- `CHANGELOG_CONSOLIDATO.md` per la storia sintetica;
- `ARCHITETTURA_E_DATI.md` se cambia il codice o il flusso dati;
- `OPERATIVITA_ADMIN_E_RELEASE.md` se cambia il modo di rilasciare o aggiornare dati.

## Regola per gli zip futuri

Quando si consegna una modifica al progetto, lo zip deve essere unico e contenere solo i file modificati, mantenendo le due cartelle principali:

```text
zonaorientale/
docs/
```

Per una modifica solo documentale, e' sufficiente includere solo `docs/zonaorientale/...`.


## Nota V239

V239 aggiunge le notifiche trattative presidente e corregge il permission-denied sul submit del comunicato avvenuto scambio.


## Nota V240

V240 riallinea badge e storico trattative nella Dashboard Presidente: le liste vengono rilette live da Firebase all'apertura della sezione, anche su mobile. Il documento `FUNZIONALITA'.md` resta invariato salvo richiesta esplicita.

## Nota V241

V241 stabilizza Admin -> Accetta utenti: i rifiuti restano come `REJECTED`, gli approvati non tornano `PENDING` al login e i vecchi duplicati pending vengono nascosti. `FUNZIONALITA'.md` resta invariato salvo richiesta esplicita.


## Nota V246

V246 sincronizza su Firebase la lettura degli esiti trattative quando il presidente mittente apre la card della proposta conclusa. Il vecchio `localStorage` resta fallback locale se le regole Firebase negano l'update. Le precedenti V243-V245 restano attive: comunicato scambio canonico, EmailJS immediato e cancellazione da Firebase dei comunicati approvati/rifiutati in `teamRequests`. `FUNZIONALITA'.md` resta invariato salvo richiesta esplicita.

## Nota operativa V246

Admin -> Richieste presidenti permette di eliminare da Firebase i comunicati approvati o rifiutati. La cancellazione rimuove il documento `teamRequests`; per i comunicati approvati una eventuale News gia' pubblicata resta online. `FUNZIONALITA'.md` resta invariato salvo richiesta esplicita.


## Nota V247

V247 aggiunge `REGRESSION_TESTS.md`, una checklist di regressione per pubblico, presidente, admin, mobile e controlli tecnici pre-commit. Non introduce nuove funzionalita runtime. `FUNZIONALITA'.md` resta invariato salvo richiesta esplicita.

## Nota V248

V248 introduce una pulizia mirata degli handler legacy del comunicato avvenuto scambio, mantenendo il flusso canonico `teamRequests/TRANSFER_NEWS` + EmailJS + approvazione Admin.
Nota V252: aggiunta pulizia repository per file locali/macOS e CSS mobile hotfix duplicati, senza modifiche funzionali al sito.


Nota V253: estratto in modulo dedicato il pannello Admin -> Richieste presidenti, mantenendo fallback inline V249 e diagnostica `window.ZonaOrientaleTeamRequestsV253`.

Nota V254: aggiunto simulatore notifiche trattative `window.ZonaOrientaleTradeSimulatorV254` per test locali/Firebase da console browser.


Nota V255: il simulatore trattative espone `ZonaOrientaleTradeSimulatorV255.help()` e `runLocalSmokeTest()` per test ricorrenti da console browser.

- `FUNZIONALITA'V240-255.md`
  Riepilogo incrementale delle funzionalita introdotte o consolidate tra V240 e V255. Non sostituisce `FUNZIONALITA'.md`.

## Firebase Rules V257

Per sincronizzare le notifiche trattative tra smartphone e desktop usare:

- `firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules` per il file completo;
- `firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules` se vuoi applicare solo la patch a `transferNegotiations`.
