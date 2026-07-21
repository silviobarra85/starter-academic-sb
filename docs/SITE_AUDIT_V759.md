# Audit tecnico del sito Fantacalcio - V759

Data audit: 21/07/2026.

## Sintesi

Il mancato caricamento iniziale non dipendeva dall'assenza dei dati: il sito contiene già configurazione pubblica e snapshot JSON completi. Il problema era l'ordine di bootstrap.

`assets/app.js` importava Firebase nel grafo JavaScript iniziale e avviava il caricamento dei dati quasi esclusivamente dentro `onAuthStateChanged`. Di conseguenza una lentezza, un blocco di rete, un problema del CDN Firebase o una risposta tardiva di Auth potevano impedire anche la visualizzazione dei dati pubblici locali. La V758 aveva aggiunto timer, timeout e override runtime, ma non eliminava la dipendenza strutturale e non poteva intervenire se il modulo Firebase non veniva scaricato.

La V759 rende il sito **static-first per costruzione**:

1. carica `assets/public/config.json`;
2. carica lo snapshot della stagione e `honor.json`;
3. carica gli asset statici condivisi e renderizza il sito;
4. solo dopo il primo render importa Firebase dinamicamente;
5. Firebase resta necessario per login, ruoli e funzioni amministrative, non per aprire il sito pubblico.

## Causa principale del blocco

### Prima della V759

- `app.js` importava `firebase.js` al top level.
- `repository-v222.js` importava staticamente `firestore-service.js`, che a sua volta importava Firebase.
- l'avvio effettivo dei dati era collegato a `onAuthStateChanged`;
- `index.html` caricava anche SheetJS da un CDN esterno prima del modulo principale;
- V756, V757 e V758 aggiungevano timer/watchdog e override per nascondere i sintomi.

Questo produceva un single point of failure esterno: dati locali presenti, ma applicazione non avviata.

### Dopo la V759

- nessun import Firebase statico nel grafo di avvio pubblico;
- `firebase.js` viene importato con `import()` soltanto dopo il render pubblico o quando l'utente usa il login;
- Firestore nel repository è lazy;
- SheetJS è caricato soltanto quando l'admin usa il convertitore del listone;
- il bootstrap è coordinato da `fanta-engine/js/core/static-first-bootstrap-v759.js`;
- rimossi gli override emergenziali V756/V757/V758 relativi al boot;
- errore Auth/Firebase non rende inutilizzabile il sito pubblico.

## Ruolo corretto di FantaEngine

`static/fanta-engine/` deve essere il livello comune della piattaforma multi-lega:

- coordinatori di bootstrap e componenti infrastrutturali riutilizzabili;
- moduli JS/CSS condivisi;
- risoluzione dei path comuni;
- asset condivisi come listoni e archivio calciomercato;
- dataset normalizzati utilizzati da applicazioni autonome come ioSudo.

Non deve contenere logica specifica di ZonaOrientale. Il nuovo coordinatore V759 non conosce Firebase, stagioni o path: riceve callback dalla lega e gestisce solo la sequenza `dati pubblici -> render -> servizi remoti`.

### Problema ancora presente nel FantaEngine

Il motore è anche diventato un archivio di versioni: 858 file, 214 JavaScript e 205 CSS. Sono presenti 110 copie versionate dell'app ioSudo e 110 fogli CSS ioSudo. Questo aumenta il peso del repository e rende difficile distinguere runtime corrente, rollback e storico.

La soluzione duratura successiva è introdurre:

- una cartella `current/` o alias stabili per gli asset effettivamente pubblicati;
- storico release fuori dal percorso di deploy;
- un manifest unico dei moduli runtime;
- regola di retention delle versioni precedenti.

Questa pulizia non è inclusa in V759 perché cancellare versioni senza un audit dei riferimenti può creare regressioni.

## Ruolo corretto di ioSudo

ioSudo è una PWA autonoma e principalmente read-only. Non deve dipendere dal bootstrap di ZonaOrientale né da Firebase per mostrare i dati calcistici.

Flusso corretto:

1. legge `fanta-engine/data/sudatori/current/manifest.json`;
2. il manifest indica il file dati runtime;
3. legge rose live della lega e listone centralizzato solo come arricchimenti;
4. il service worker usa network-first per i dataset mutabili.

### Ottimizzazione V759

Prima ioSudo scaricava `sudatori-data.json` da 12.432.411 byte, contenente anche log, audit e cronologia di decine di overlay. L'app usa soltanto otto chiavi:

- `meta`;
- `teams`;
- `playersByTeam`;
- `formationsByTeam`;
- `marketSummaryByTeam`;
- `injuriesByTeam`;
- `friendliesByTeam`;
- `friendlyPlayerStatsByMatch`.

V759 aggiunge `sudatori-runtime.json` da 3.684.800 byte e aggiorna il manifest. Riduzione non compressa: **70,4%**. Il dataset completo resta disponibile come archivio tecnico e non viene eliminato.

## Altri problemi individuati

### 1. Modulo di configurazione duplicato nel browser - risolto

Lo stesso `league-config-v443.js` era richiesto con cache-buster differenti (`518`, `540`, `588`, `594`, `665`). Per gli ES module questi sono URL distinti e quindi istanze distinte, con cache e stato separati.

Tutti i consumer ZonaOrientale ora usano `league-config-v443.js?v=759`. Anche `league-config.json`, il fallback JS e la diagnostica di deploy sono allineati a V759.

### 2. Cache dei JSON mutabili non esplicita - risolto

Sono state aggiunte regole Netlify `max-age=0, must-revalidate` per:

- configurazione pubblica;
- snapshot;
- dati correnti ioSudo;
- asset condivisi correnti.

Le versioni immutabili possono continuare a essere cacheate; gli entry point `current` e gli snapshot devono sempre essere rivalidati.

### 3. Monolite applicativo - aperto

`zonaorientale/assets/app.js` pesa circa 1,99 MB e contiene 41.614 righe. `styles.css` pesa circa 413 KB e contiene 14.220 righe. Nel file applicativo convivono implementazioni storiche e ridefinizioni successive di molte funzioni.

Conseguenze:

- è difficile stabilire quale implementazione sia attiva;
- patch successive possono sovrascrivere correzioni precedenti;
- parsing ed esecuzione iniziale sono più pesanti;
- i test statici possono validare una funzione che poi viene riassegnata più avanti.

Intervento consigliato: estrazione progressiva per dominio, partendo da bootstrap/auth, caricamento dati, rendering pubblico e admin. Ogni estrazione deve avere test di contratto prima della rimozione del codice storico.

### 4. Troppi asset iniziali - aperto

La home include 24 stylesheet e 15 tag script. Non tutti bloccano il rendering, ma l'insieme aumenta richieste, rischio di ordine errato e conflitti CSS.

Intervento consigliato: produrre un manifest di entrypoint e bundle per area, mantenendo lazy le funzioni admin e le sezioni non visibili.

### 5. Snapshot pubblici non aggiornati automaticamente - aperto e importante

Gli snapshot pubblici correnti risultano generati il 16/07/2026. Il bootstrap V759 li rende affidabili come disponibilità, ma non può garantire che siano aggiornati rispetto a Firestore.

Serve un processo atomico di pubblicazione:

1. modifica dati admin;
2. rigenerazione config/snapshot;
3. validazione schema e conteggi;
4. pubblicazione di tutti i file nello stesso deploy;
5. aggiornamento del manifest solo dopo il successo.

Finché questo processo resta manuale, il sito può essere disponibile ma mostrare dati meno recenti del database.

### 6. Test browser end-to-end assente dal gate corrente - aperto

È stato aggiunto un audit V759 che controlla il contratto static-first, i file pubblici, l'ordine del coordinatore, l'assenza di import Firebase eager, il payload ioSudo e le cache policy. Manca ancora un test browser in CI che simuli esplicitamente Firebase irraggiungibile e verifichi che la home venga popolata.

Scenario minimo da automatizzare con Playwright nel deploy:

- bloccare `gstatic.com` e domini Firebase;
- aprire `/zonaorientale/`;
- verificare stagione, squadre e rose visibili;
- verificare `window.ZonaOrientaleBootstrapV759.phase === "public-ready"` o `"ready"`;
- verificare assenza di overlay bloccanti.

## Verifiche eseguite

- `node --check` sui file JavaScript modificati;
- validazione JSON del manifest e del payload runtime;
- audit V759: 35/35 controlli superati;
- audit ioSudo V751 sui dati completi: nessun ID duplicato, nessun duplicato esatto, nessun rumor attivo su ufficialità;
- audit configurazione lega V443 superato;
- audit path statici V446 riallineato al resolver V537 e superato;
- audit riferimenti hard-coded V444 superato;
- verifica che tutti gli asset locali dichiarati dalle pagine HTML esistano;
- verifica HTTP locale dei principali entry point statici.

Il browser headless Chromium del sandbox non ha completato il test per limitazioni del container Linux (DBus/netlink/inotify). Per questo non viene dichiarato un E2E browser completo locale; il gate Playwright in ambiente CI resta un'attività necessaria.

## Priorità successive

1. automatizzare e rendere atomica la pubblicazione degli snapshot;
2. aggiungere il test Playwright “Firebase offline, sito pubblico operativo”;
3. estrarre bootstrap/auth/data loading dal monolite e rimuovere le vecchie ridefinizioni;
4. introdurre entrypoint `current` e retention nel FantaEngine;
5. consolidare CSS e script caricati dalla home;
6. spostare documentazione e storico molto pesanti fuori da `static/`, perché oggi vengono inclusi nel deploy pubblico.
