# FantaMantraManager - sandbox multi-lega V448

Questo documento descrive il clone sandbox creato in V447 e auditato in V448.

## Stato

- Percorso sito: `static/fantapetillomantramanager/`
- Percorso docs: `docs/fantapetillomantramanager/`
- Nome provvisorio: `FantaMantraManager`
- Il nome puo' cambiare.
- Stato: sandbox statico, non produzione.

## Protezioni

- Firebase e' disabilitato in `static/fantapetillomantramanager/assets/firebase.js`.
- Le scritture Firebase lanciano errore esplicito.
- Le letture Firebase ritornano vuote.
- Non viene usato il progetto Firebase ZonaOrientale.

## Dati inclusi

Il clone contiene solo dati placeholder minimi:

- `assets/public/config.json`
- `assets/snapshots/seasons/manifest.json`
- `assets/snapshots/seasons/2025-2026.json`
- `assets/snapshots/honor.json`
- manifest vuoti per listoni, rose, competizioni e calciomercato.

## Prima della produzione

1. Decidere il nome definitivo della lega.
2. Creare/configurare Firebase dedicato.
3. Aggiornare `assets/firebase.js` con credenziali nuove.
4. Definire security rules della nuova lega.
5. Sostituire i placeholder con dati reali.
6. Configurare eventuali redirect Netlify per share news se necessari.

## Test

Dalla root del clone:

```bash
bash tools/check-fantapetillomantramanager.sh
```

Dal sito ZonaOrientale, il gate principale controlla anche il clone:

```bash
bash tools/check-zonaorientale.sh
```


## Aggiornamento V448

- Aggiunto audit clone runtime `tools/audit-clone-runtime-qa-v448.mjs`.
- Aggiunto guard runtime `assets/js/core/fanta-petillo-sandbox-v448.js` con banner sandbox, `noindex,nofollow` e hiding degli entrypoint Admin/Area Squadra.
- Firebase project creato ma non collegato: il runtime continua a usare lo stub `assets/firebase.js`.
- Nessuna credenziale/config Firebase reale e' presente nel clone V448.

## Firebase dedicato

Il progetto Firebase dedicato da usare in V449 e' `fantapetillomantramanager`. La configurazione web e' stata raccolta fuori dal runtime, ma non va inserita manualmente in V448: verra' applicata con una patch dedicata e audit anti-contaminazione.


## V449 - Firebase reale dedicato

Il clone ora punta al progetto Firebase dedicato `fantapetillomantramanager` tramite:

```text
static/fantapetillomantramanager/assets/firebase.js
```

Stato operativo:

- Firebase reale collegato in modalita bootstrap protetta.
- Admin e Area Squadra ancora nascosti dal guard V449.
- Produzione non pronta: dati placeholder, noindex attivo, rules Firestore da applicare.
- Firebase ZonaOrientale non e' importato nel clone.

File rules da copiare nella console Firebase:

```text
static/fantapetillomantramanager/tools/firestore-rules-v449.rules
```

Documento operativo:

```text
docs/fantapetillomantramanager/FIREBASE_SETUP_V449.md
```


## V450 - Admin bootstrap

Il clone ora permette l'accesso Admin per inizializzare dati e configurazione, dopo la creazione manuale dell'utente admin e del documento `admins/{uid}`.

Stato operativo:

- Firebase dedicato: `fantapetillomantramanager`.
- Rules consigliate: `static/fantapetillomantramanager/tools/firestore-rules-v450.rules`.
- Admin bootstrap: abilitato.
- Area Squadra presidenti: ancora protetta.
- Produzione: non pronta, dati ancora placeholder e `noindex` attivo.


## V451 - Onboarding dati

Aggiunta una checklist nell'Admin del clone per guidare il primo inserimento dati: stagione, presidenti, squadre, squadre stagione, stadi e snapshot pubblici.

Il helper V451 e' read-only: non scrive su Firebase e non sblocca Area Squadra presidenti.

## V452 - Favicon e icone stagione 2026-2027

La V452 aggiorna favicon e icone PWA/social del clone con sigla `FPMM` e stagione `2026-2027`. Sono stati aggiornati `favicon.ico`, le PNG in `assets/icons/` e aggiunto il sorgente `fantapetillo-favicon-source.svg`.

La modifica non tocca Firebase, Admin, rules o Area Squadra. L'Admin onboarding V451 resta attivo e Area Squadra resta guardata fino a inserimento dati reali e `teamUsers`.


## V453 - Regolamento 2026-2027

La sezione `Regolamento` del clone e' stata sostituita con una struttura dedicata al regolamento ufficiale `Fantacalcio MANTRA® Manageriale 2026-2027`.

Sono stati aggiunti:

- PDF pubblico scaricabile in `assets/regolamento/regolamento-fantapetillo-mantra-manager-2026-2027.pdf`;
- pulsanti `Scarica PDF` e `Apri PDF` nella sezione `/#regolamento`;
- riepilogo navigabile degli articoli e dei parametri principali;
- audit `tools/audit-regolamento-v453.mjs`.

La modifica non tocca Firebase, Admin, rules, snapshot o Area Squadra.

## V454 - Selettore card Admin e QA opzionale

La V454 aggiunge nell'Admin del clone un menu di visibilita' sotto il titolo della sezione.

Comportamento:

- tutte le card Admin partono deselezionate e non visibili;
- l'admin puo' mostrare solo le card necessarie;
- sono disponibili i pulsanti `Mostra tutte` e `Nascondi tutte`;
- la `Checklist QA Admin` in basso e' nascosta di default e si abilita dal checkbox dedicato nello stesso menu;
- la preferenza e' salvata nel browser tramite localStorage, separata per slug della lega.

La modifica non tocca Firebase, rules, dati statici, snapshot o Area Squadra presidenti.

## V455 - Fix selettore Admin e favicon cache-proof

- Il selettore Admin V455 sostituisce il runtime V454.
- Nessuna card Admin e visibile di default finche non viene spuntata dal menu.
- La Checklist QA Admin in basso resta nascosta di default e si mostra dal checkbox dedicato.
- Le favicon ora usano file con nome V455 per aggirare la cache del browser.

Documento tecnico: `ADMIN_UI_V455.md`.

## V456 - Hotfix selettore card Admin

Il selettore card Admin usa ora il runtime V456. I pulsanti sono sempre cliccabili e il Generatore comunicati automatici e incluso nella lista delle card selezionabili. La Checklist QA Admin resta nascosta di default e si mostra solo dal checkbox dedicato.

## V457 - Dati placeholder 2026-2027

La V457 porta la stagione corrente del clone a `2026-2027` e aggiunge 10 club placeholder per testare le sezioni pubbliche senza usare dati reali. I dati sono statici, marcati come placeholder e non scrivono su Firebase.

File guida: `docs/fantapetillomantramanager/PLACEHOLDER_DATA_V457.md`.

Area Squadra resta protetta fino a inserimento di dati reali e `teamUsers`.


## V458 - Kit setup dati reali FantaMantra

- Aggiunto kit Admin FantaMantra per scaricare template CSV/JSON dei dati reali 2026-2027.
- Il kit non scrive su Firebase: serve a compilare presidenti, squadre, budget, stadi, loghi e UID prima del seed definitivo.
- Area Squadra FantaMantra resta protetta fino a teamUsers e snapshot reali.

## V459 - Validatore dati reali

Aggiunta card Admin `Validatore dati reali 2026-2027` per caricare o incollare il CSV/JSON compilato dai template V458, validarlo localmente e scaricare un seed JSON revisionabile. La card non scrive su Firebase e non sblocca Area Squadra.

Documento tecnico: `REAL_DATA_VALIDATOR_V459.md`.

## V460 - Preview seed Firestore

Aggiunta la card Admin `Preview seed Firestore 2026-2027`, utile dopo il validatore V459. La card trasforma il seed JSON validato in una preview dei documenti Firestore e in una checklist per import manuale nel progetto Firebase `fantapetillomantramanager`. Non scrive automaticamente su Firebase.

## V461 - Import controllato Firestore

Aggiunta la card Admin `Import controllato Firestore 2026-2027`. La card prende in input il file `fantapetillo-firestore-seed-preview-v460.json`, verifica target, collection e login Admin, poi consente una scrittura merge-only nel Firebase dedicato `fantapetillomantramanager` dopo conferme manuali e testo `IMPORTA FANTAPETILLO`.

Non vengono cancellati documenti e non viene toccato Firebase ZonaOrientale. Area Squadra resta protetta fino a verifica di dati reali, `teamUsers` e snapshot pubblici.

Documento tecnico: `FIRESTORE_IMPORT_V461.md`.

## V462 - Guida operativa dati reali

Aggiunta nell'Admin del clone la card `Come applicare i dati reali 2026-2027`, selezionabile dal menu Admin. La card spiega l'ordine operativo per usare V458, V459, V460 e V461 quando saranno disponibili i dati reali.

La card non scrive su Firebase e non sblocca Area Squadra: serve come guida per template, validazione, preview, import controllato, verifica Firestore, snapshot pubblici e sblocco successivo.

Documento tecnico: `REAL_DATA_WORKFLOW_V462.md`.

## V463 - Generatore snapshot pubblici

La V463 aggiunge una card Admin per generare snapshot pubblici statici a partire dalla preview Firestore V460. La card produce i JSON da applicare manualmente alla repo e non scrive su Firebase. Area Squadra resta protetta.

## V464 - Readiness sblocco Area Squadra

Aggiunta nell'Admin del clone la card `Verifica sblocco Area Squadra 2026-2027`. La card controlla Firestore live, preview V460 o snapshot V463 per verificare se esistono 10 squadre, 10 presidenti, 10 seasonTeams e 10 teamUsers con UID/email/teamId prima dello sblocco controllato dell'Area Squadra.

La card non scrive su Firebase e non sblocca ancora l'Area Squadra.

Documento tecnico: `TEAM_AREA_READINESS_V464.md`.

## V465 - Checklist pubblicazione e share

Aggiunta nell'Admin del clone la card `Checklist pubblicazione e share 2026-2027`, selezionabile dal menu Admin. La card riepiloga cosa manca prima del go-live: dati reali, snapshot pubblici, readiness Area Squadra e configurazione share/Netlify/Open Graph.

La card e' solo informativa: non scrive su Firebase, non modifica Netlify e non sblocca Area Squadra.

Documento tecnico: `LAUNCH_READINESS_V465.md`.


## V466 - Share, Netlify e Open Graph

Aggiunta nell'Admin del clone la card `Share, Netlify e Open Graph 2026-2027`. La V466 include anche `netlify.toml` e `netlify/functions/news-share.js` multi-lega per preparare la preview dinamica dei comunicati FantaMantra.

La patch non sblocca Area Squadra, non rimuove noindex e non scrive su Firebase.

Documento tecnico: `SHARE_NETLIFY_V466.md`.


## V467 - Setup standard da Admin

Il clone usa il metodo standard del gestionale per creare squadre, accettare utenti e generare snapshot. Gli strumenti massivi CSV/import/seed non sono più caricati nell’interfaccia Admin.

## V470 - Cleanup audit e setup standard Admin

La V470 riallinea il clone al flusso scelto dall'utente: inserimento dati dal normale pannello Admin, senza strumenti massivi CSV/import.

Stato operativo:

- il clone resta su Firebase dedicato `fantapetillomantramanager`;
- restano attivi Admin bootstrap, onboarding, regolamento, favicon, selettore card Admin, setup standard Admin e share Netlify;
- le card tecniche V458-V465 non vengono piu' caricate;
- il check del clone usa `tools/audit-standard-admin-cleanup-v468.mjs`;
- il cleanup fisico dei file tecnici si esegue con `tools/cleanup-standard-admin-v468.sh`.

Comando consigliato dopo applicazione overlay:

```bash
bash static/fantapetillomantramanager/tools/cleanup-standard-admin-v468.sh
```

## V472 - Footer e news isolate

La V472 corregge due contaminazioni del clone:

- il footer non viene piu' riscritto dal runtime con `vecchia etichetta tecnica del clone con data 15/06/2026`;
- `news.html` non contiene piu' il comunicato playoff ZonaOrientale e resta un fallback dedicato finche' non esistono comunicati FantaMantra reali.

Documenti tecnici:

- `FOOTER_NEWS_ISOLATION_V472.md`;
- `HANDOFF_V472_FOOTER_NEWS_ISOLATION.md`.



## V473 - Tool sorteggio giornate
- Aggiunto tool pubblico `#sorteggio` anche al clone FantaMantraManager.
- Il tool e locale/client-side: non scrive su Firebase e non usa dati ZonaOrientale.
- Output riproducibile tramite seed e JSON.

## V474 - Regolamento ufficiale 2026-2027 aggiornato

La V474 aggiorna solo `static/fantapetillomantramanager` con il nuovo PDF ufficiale `FANTACALCIO_MANTRA_2026_2027-2.pdf` caricato il 19/06/2026.

Modifiche operative:

- nuovo PDF pubblico versionato: `assets/regolamento/regolamento-fantapetillo-mantra-manager-2026-2027-v474.pdf`;
- link `Scarica PDF`, `Apri PDF` e `Apri appendice nel PDF` puntano al PDF V474;
- sezione `#regolamento` aggiornata nei punti sintetici che erano diversi dal nuovo PDF, in particolare montepremi in crediti;
- `assets/league-config.json` aggiornato a `currentVersion: 474` e `regolamento.version: 474`;
- cache-buster e footer fallback FantaMantra aggiornati a V474.

ZonaOrientale non viene modificato.

Documenti tecnici:

- `REGOLAMENTO_V474.md`;
- `HANDOFF_V474_REGOLAMENTO_FANTAPETILLO.md`.


## V475 - Rename pubblico e logo FantaMantraManager
- Nome pubblico aggiornato da FantaPetilloMantraManager a FantaMantraManager.
- Slug, cartella, URL e progetto Firebase restano `fantapetillomantramanager` per non rompere link, redirect, dati e configurazioni.
- Dashboard: logo ufficiale accanto al titolo e rimozione della dicitura `Lega Fantacalcio in configurazione`.
- Favicon, manifest e immagini social puntano al nuovo logo.
- Modifica limitata a FantaMantraManager: nessun file ZonaOrientale incluso nell'overlay.

## V476 - Banner Admin bootstrap rimosso e Area Squadra visibile

- Rimosso il banner/header tecnico `FantaPetilloMantraManager - Admin bootstrap attivo. Area Squadra resta protetta fino ai dati reali e teamUsers.`
- Area Squadra resa visibile negli entrypoint del sito FantaMantraManager.
- I flussi operativi interni restano conservativi: login, account presidente e `teamUsers` non vengono rimossi.
- Modifica limitata a FantaMantraManager: nessun file ZonaOrientale incluso nell'overlay.

Documenti tecnici:

- `TEAMAREA_UNLOCK_V476.md`
- `HANDOFF_V476_TEAMAREA_UNLOCK.md`


## V477 - Dashboard presidente FantaMantraManager

Modifica solo FantaMantraManager:

- nascoste le card presidente `Svincola Giocatori` e `Comunicato avvenuto scambio`, perche non previste dal flusso di questa lega;
- la Dashboard Presidente V369 non viene renderizzata quando la sessione corrente e Admin;
- il Centro notifiche presidente non viene mostrato all'Admin insieme alla dashboard presidente;
- Area Squadra resta visibile come da V476;
- login, `teamUsers`, Admin, Firebase e dati esistenti non vengono rimossi.

Audit dedicato: `static/fantapetillomantramanager/tools/audit-president-area-v477.mjs`.
