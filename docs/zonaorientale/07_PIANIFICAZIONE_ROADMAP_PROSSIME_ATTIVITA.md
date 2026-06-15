## Roadmap aggiornata dopo V447

- V447 ha creato il clone sandbox `FantaPetilloMantraManager`, con Firebase disabilitato e dati placeholder.
- Prossimo passo consigliato V448: audit runtime/manuale del clone su home, menu mobile, Listone vuoto, Rose vuote, Bilanci vuoti e pagine standalone.
- Passo successivo V449: decidere Firebase dedicato, creare configurazione credenziali separata e definire security rules della nuova lega.
- Poi V450: sostituire i placeholder con dati reali o import iniziale della nuova lega.
- Solo dopo questi passaggi il clone puo' diventare una seconda lega pubblica.

## Roadmap aggiornata dopo V446

- La parametrizzazione dei percorsi dati statici e' stata introdotta in modo additivo con `dataPaths` in `assets/league-config.json`.
- Prossimo passo consigliato V447: creare un clone sandbox minimo per `FantaPetilloMantraManager`, senza ancora toccare il sito pubblico ZonaOrientale e preferendo Firebase separato.
- Prima del clone, decidere slug/cartella provvisoria e dati minimi: nome lega, loghi, squadre, stagione corrente, config pubblica e almeno uno snapshot di test.
- Continuare a non rinominare i namespace runtime storici `ZonaOrientale*` finche' il clone non e' verificabile.
- Restano da parametrizzare in una fase successiva Netlify `news-share`, redirect pubblici e feed calciomercato server-side.

## Roadmap aggiornata dopo V445

- Prossima patch consigliata V446: parametrizzare gradualmente i percorsi dati statici da config (`assets/public/config.json`, snapshot stagioni, honor, listoni, rose, competizioni, calciomercato archive, loghi) senza cambiare i file letti da ZonaOrientale.
- Dopo V446, valutare V447 come clone sandbox `FantaPetilloMantraManager`, preferibilmente con Firebase separato e dati minimi di prova.
- Non rinominare ancora i namespace runtime storici `ZonaOrientale*`: prima bisogna completare path dati e share/Netlify.
- Continuare a preservare Bilanci mobile V438, badge dispositivo V434, Admin, Area Squadra e snapshot generator.

## Roadmap aggiornata dopo V444

- Prossima patch consigliata V445: usare la mappa V444 per spostare gradualmente su `assets/league-config.json` metadata, titoli pagina, nome lega, base URL e link share WhatsApp, sempre con fallback ZonaOrientale.
- Non rinominare ancora i namespace runtime `ZonaOrientale*`: sono numerosi e collegati a funzioni storiche/wrapper; vanno lasciati stabili finche' non esiste un clone sandbox testabile.
- Dopo V445, V446 dovra' preparare i percorsi dati statici da config (`assets/public`, `assets/snapshots`, `assets/listoni`, `assets/rose`, `assets/calciomercato`, `assets/logos`) senza cambiare i file letti da ZonaOrientale.
- Solo dopo V445/V446 creare una cartella clone per `FantaPetilloMantraManager`, preferibilmente con Firebase separato.
- Qualunque riduzione dei riferimenti hard-coded deve essere verificata contro la baseline V444 per evitare di perdere share link, menu, Admin, snapshot o viste pubbliche.

## Roadmap aggiornata dopo V443

- Non creare ancora `static/fantapetillo...`: prima completare la parametrizzazione progressiva su ZonaOrientale.
- Prossima patch consigliata V444: audit/mappa dei riferimenti hard-coded a `zonaorientale`, `ZonaOrientale`, `silviobarra.com/zonaorientale`, `/share/news`, `bilanci.html`, path asset e `DEPLOY_EXPECTED_VERSION`.
- Dopo V444, V445 puo' spostare gradualmente menu, metadata, share URL, titoli pagina e base URL verso la config.
- V446 dovra' preparare i percorsi dati statici da config senza cambiare i file letti da ZonaOrientale.
- Solo dopo queste fasi creare un clone sandbox per `FantaPetilloMantraManager` con config, dati, loghi e preferibilmente Firebase separato.

## Roadmap aggiornata dopo V440

- Testare da smartphone il pulsante `Copia link WhatsApp` nella sezione Bilanci.
- Incollare il link in WhatsApp e verificare che l'anteprima mostri `Bilanci FM · ZonaOrientale Salerno`.
- Non usare questa patch per modificare i dati dei Bilanci: i valori restano dipendenti dagli snapshot stagione pubblicati.

## Roadmap aggiornata dopo V439

- Testare da mobile `competition.html` e `player.html`: il menu `Altro` deve mostrare tutte le voci presenti nella home.
- Continuare a usare la V438 come riferimento estetico per la tabella Bilanci; eventuali nuove modifiche alla colonna `Voce` vanno fatte solo se richieste esplicitamente.
- Prima di altre patch, verificare che la navigazione standalone non perda link verso Bilanci, Calciomercato, Statistiche, Archivio e Confronta.

## Roadmap aggiornata dopo V438

- Testare su smartphone reale la sezione Bilanci: i menu devono comparire sotto `Bilancio stagione`, la colonna `Voce` deve restare bloccata nello scroll orizzontale e le card mensili devono partire chiuse.
- Proseguire solo con micro-rifiniture CSS se emergono problemi reali; evitare refactor della logica Bilanci finche' la vista da snapshot e' stabile.

## Roadmap aggiornata dopo V437

- Verificare la sezione Bilanci su smartphone reale dopo applicazione overlay: selettori sotto titolo, tabella scrollabile, colonna `Voce` sticky.
- Proseguire solo con micro-rifiniture CSS mirate, evitando refactor JS della logica Bilanci finche' non emergono problemi funzionali.

## Roadmap aggiornata dopo V436

- Consolidare il flusso Admin Rose e movimenti FM con test manuale su modifica di budget, bonus, acquisti, svincoli e scambi.
- Valutare in una patch futura un ricalcolo esplicito degli effetti rosa per modifiche avanzate, ma solo dopo audit dedicato per non staccare funzionalita esistenti.
- Mantenere Bilanci come vista derivata dagli snapshot stagione.

## Roadmap aggiornata dopo V435

- Verificare la nuova sezione Bilanci su smartphone: selettori, tabella larga, sticky column e leggibilita' del dettaglio movimenti.
- Dopo ogni modifica a budget o movimenti FM, ricordare che Bilanci si aggiorna stabilmente solo dopo `Snapshot pubblici -> Aggiorna tutto` e commit degli snapshot.
- Prossimo intervento consigliato solo dopo test: eventuale micro-rifinitura mobile CSS della tabella Bilanci, senza cambiare la sorgente dati.

## Roadmap aggiornata dopo V434

- Verificare su dispositivo reale il badge in alto a destra: leggibilita', posizione e assenza di interferenze con pulsanti.
- Se il badge e' utile, mantenerlo come diagnostica; se diventa invasivo, si puo' disattivare rimuovendo i due asset V434 dagli HTML.
- Prima del merge resta consigliato il test manuale mobile completo.

## Roadmap aggiornata dopo V433

- Dopo V433 ripetere test manuale Area Squadra mobile su dispositivo reale.
- Verificare che la sezione risulti meno confusionaria: Dashboard prima, Notifiche assenti, azioni compatte, pannelli email in basso.
- Se il check passa, procedere con commit V433 e merge verso `master`.

## Roadmap aggiornata dopo V432

- Dopo V432 ripetere test manuale Area Squadra mobile prima del merge.
- Verificare in particolare: Dashboard prima card, metriche 2xN, pulsanti 2x2, pannelli Comunicato scambio/Svincola chiusi e riapribili.
- Se il check passa, procedere con commit V432 e merge verso `master`.

## Roadmap aggiornata dopo V431

- Dopo V431 resta consigliato un test manuale completo su dispositivo reale prima del merge verso `master`.
- Evitare nuove feature finche non sono validati Area Squadra mobile, Admin, Archivio, Listone/Rose, Calciomercato e Dashboard.
- Se i test passano, procedere con commit della V431 e merge del branch refactor su `master`.

## Roadmap aggiornata dopo V429

- La fase mobile resta chiusa, con una correzione puntuale aggiunta per Admin.
- Prossimo passo consigliato: test manuale completo su dispositivo reale prima del merge verso `master`.
- Evitare nuove feature fino alla validazione mobile di Admin, Dashboard, Archivio, Listone/Rose, Calciomercato, Confronta e Statistiche.

## Roadmap aggiornata dopo V427

- Fase mobile UX conservativa chiusa dal punto di vista funzionale.
- Prossimo passaggio consigliato: V428 pre-merge cleanup/checklist finale con istruzioni di test manuale e merge.
- Non introdurre nuove feature prima del pre-merge: solo verifica, docs e correzioni puntuali se emergono regressioni.

## Roadmap aggiornata dopo V426

- Fase mobile UX conservativa quasi chiusa.
- Prossimi passaggi consigliati: V427 pulizia warning legacy selettiva e V428 pre-merge cleanup/checklist finale.
- Evitare nuove riduzioni font generalizzate finche' non vengono validate su dispositivo reale.
- Continuare a evitare refactor invasivi su Firebase/auth/admin e pagine standalone.

---

# Pianificazione, roadmap e prossime attivita

## Roadmap aggiornata dopo V424

- Verificare visivamente da mobile News/Comunicati, Competizioni, Albo d'Oro, Rose/Club e Fantamercato.
- Se la scala V424 viene confermata, passare a una patch di consolidamento pre-merge con checklist manuale, invece di continuare a ridurre font.
- Prossimi interventi consigliati: controllo contrasto/spaziature su dispositivo reale e pulizia dei warning legacy rimanenti solo se non impattano funzionalita.
- Continuare a evitare refactor invasivi su Firebase/auth/admin e pagine standalone finche' la UX mobile non e' stabile.

---


## Roadmap aggiornata dopo V423

- Verificare visivamente da mobile Confronta Squadre, Statistiche storiche, Listone, Rose e La mia squadra.
- Prossimi interventi consigliati: rifinitura finale su eventuali sezioni ancora fuori scala, poi consolidamento pre-merge.
- Continuare a evitare refactor invasivi su Firebase/auth/admin e pagine standalone finche' la UX mobile non e' stabile.

---


## Roadmap dopo V422

1. Validare su dispositivo reale Archivio Stagioni: griglia squadre 2 per riga, testi card coerenti e Timeline dati con 4 comunicati.
2. Se la scala V422 e' confermata, passare a una patch di consolidamento pre-merge con checklist manuale mobile.
3. Evitare ulteriori riduzioni tipografiche globali senza riscontro visivo, per non compromettere leggibilita.
4. Continuare a non introdurre pagine standalone, refactor invasivi di `app.js` o modifiche a Firebase/auth/admin.

---


## Roadmap dopo V421

1. Validare su dispositivo reale l'Archivio Stagioni: sotto-card, Competizioni, Timeline dati e leggibilita dei testi.
2. Verificare che la Timeline mostri i comunicati piu' recenti in ordine cronologico inverso e che non perda l'ultimo comunicato visibile in dashboard.
3. Evitare nuove modifiche strutturali finche' la scala mobile V420/V421 non e' confermata stabile.
4. Prossima candidata: consolidamento pre-merge con checklist manuale mobile, senza refactor invasivi.

---

## Roadmap dopo V420

1. Validare su dispositivo reale la nuova scala mobile globale, con particolare attenzione ad Archivio, Listone/La mia squadra e Calciomercato.
2. Evitare nuove ottimizzazioni grafiche finche' la tipografia V420 non e' confermata stabile.
3. Prossima candidata: consolidamento pre-merge con checklist manuale V421, senza refactor strutturali.
4. Continuare a non introdurre pagine standalone, refactor invasivi di `app.js` o modifiche a Firebase/auth/admin.

---


## Roadmap dopo V418

1. Prossima candidata: V419 consolidamento pre-merge con checklist manuale e audit riepilogativo delle modifiche V407-V418.
2. Valutare una piccola rifinitura finale su contrasto/leggibilita solo se emergono problemi reali nei test mobile.
3. Evitare ancora refactor multipagina e modifiche a Firebase/auth/admin.
4. Le future pulizie devono restare piccole, reversibili e protette da audit dedicato.

---

## Roadmap dopo V417

1. Prossima candidata: controllo accessibilita mobile V418 su focus, contrasto, tap target e overflow, senza cambiare layout strutturale.
2. Poi eventuale consolidamento pre-merge: checklist V419 con smoke test manuali.
3. Evitare ancora refactor multipagina e modifiche a Firebase/auth/admin.
4. Le future pulizie devono continuare a essere piccole, reversibili e accompagnate da audit.

---


## Roadmap dopo V416

1. Continuare con interventi piccoli e reversibili.
2. Prossima candidata: audit/inventario CSS duplicati e file non collegati, in sola modalita osservazione e senza cancellare.
3. Poi eventuale pulizia CSS mirata solo su elementi dimostrabilmente non usati e protetti da audit.
4. Evitare ancora refactor multipagina, modifiche a Firebase/auth/admin e rimozioni aggressive.

---

## Roadmap dopo V415

1. Continuare con interventi mobile-first piccoli e reversibili.
2. Prossima candidata: rifiniture Admin mobile solo CSS, con audit dedicato e senza cambiare workflow/permessi.
3. Poi inventario CSS duplicati/non collegati in sola modalita audit, senza cancellare.
4. Evitare ancora refactor multipagina, modifiche a Firebase/auth/admin e rimozioni aggressive.

---

---

## Roadmap dopo V414

1. Continuare con interventi mobile-first piccoli e reversibili.
2. Prossima candidata: rifiniture Admin mobile solo CSS, con audit dedicato e senza cambiare workflow/permessi.
3. Poi audit CSS duplicati/non collegati, prima in sola modalita inventario e senza cancellare.
4. Evitare ancora refactor multipagina, modifiche a Firebase/auth/admin e rimozioni aggressive.

---

## Roadmap dopo V413

1. Continuare con interventi mobile-first piccoli e reversibili.
2. Prossima candidata: Area Squadra mobile, con rifinitura card, sezioni e bottoni senza toccare auth/Firebase.
3. Dopo Area Squadra, valutare rifiniture Admin mobile solo CSS e audit CSS duplicati/non collegati.
4. Evitare ancora refactor multipagina, modifiche a Firebase/auth/admin e rimozioni aggressive.

---

## Roadmap dopo V412

1. Restano circa 5-7 passaggi conservativi prima di valutare refactor piu strutturali.
2. Prossime candidate: filtri mobile di Listone/Calciomercato, leggibilita Area Squadra mobile, piccoli consolidamenti CSS per componenti.
3. Evitare ancora refactor multipagina, modifiche a Firebase/auth/admin e rimozioni aggressive.
4. Ogni patch deve mantenere numerazione progressiva, audit dedicato e documentazione consolidata aggiornata.



## Roadmap dopo V411

1. Continuare con interventi mobile-first piccoli e reversibili.
2. Prossima candidata: rifinitura dei filtri mobile di Listone/Calciomercato senza cambiare logiche o dati.
3. Valutare una pulizia CSS per componenti solo dopo aver consolidato dashboard, tabelle e card mobile.
4. Evitare ancora refactor multipagina, modifiche a Firebase/auth/admin e rimozioni aggressive.


## Roadmap dopo V410

1. Continuare con interventi mobile-first piccoli e reversibili.
2. Prossima candidata: rifinitura dei filtri Calciomercato/Listone da mobile, senza cambiare logiche di filtro o dati.
3. Valutare poi una pulizia CSS per componenti, mantenendo audit dedicati e nessuna modifica a Firebase/auth/admin.
4. Evitare ancora refactor multipagina e rimozioni aggressive di codice legacy.


---

## Roadmap dopo V409

1. Continuare con micro-refactor CSS conservativi e misurabili.
2. Prossima candidata: pulizia CSS dei filtri mobile e dei pannelli dashboard, senza cambiare markup o logiche.
3. Evitare ancora refactor multipagina e modifiche a Firebase/auth/admin.
4. Mantenere un audit dedicato per ogni patch numerata progressiva.


---

## Roadmap dopo V406

1. Continuare con pulizie CSS conservative, una categoria alla volta.
2. Ottimizzare mobile con interventi misurabili: tap target, overflow, leggibilita card/tabelle, senza cambiare routing.
3. Refactor JS solo dopo audit dedicati e solo su helper puri.
4. Evitare per ora pagine HTML standalone, routing multipagina, auth/admin/Firebase e rimozioni aggressive.


Contiene roadmap, prossime attivita e pianificazioni storiche.

> Documento generato da accorpamento per categoria. I contenuti originali sono riportati integralmente sotto il rispettivo percorso originale.

File originali accorpati: **3**.

## Indice dei file originali in questa categoria

- `pianificazione/PROSSIME_ATTIVITA_V272.md`
- `pianificazione/ROADMAP.md`
- `PROSSIME_ATTIVITA_260528.md`

---

## 1. `pianificazione/PROSSIME_ATTIVITA_V272.md`

- Percorso originale: `pianificazione/PROSSIME_ATTIVITA_V272.md`
- Dimensione originale: 2029 byte
- SHA-256: `9dc7352b98afffb33941464b5bf4fc0021d65d2bd08736e098a76b2c245712ec`

```markdown
# Prossime attivita V272

Backlog organizzato dopo le modifiche V258-V271.

## Priorita alta

### 1. Test end-to-end listoni V268-V270

Usare l'Excel reale `Lista calciatori` e verificare:

- convertitore formato Classic;
- report giocatori > 0;
- confronto con listone precedente;
- colonna `Modifica`;
- righe `Uscito`;
- indicazione ultimo listone.

### 2. Test EmailJS operativo

Verificare su ambiente reale:

- comunicato avvenuto scambio;
- svincola giocatori;
- oggetti email V266;
- Reply-To;
- spam/inbox.

Possibile sviluppo futuro: migrazione da EmailJS a Netlify Function + provider transazionale.

### 3. Verifica Firebase Rules V257

Confermare che le rules siano pubblicate e che la lettura esiti trattative sia multi-dispositivo.

## Priorita media

### 4. Audit `domain/competitions.js`

Obiettivo: capire se il modulo e' ancora utile, da reintegrare o da archiviare.

### 5. Audit `admin-publication-workflow-v213.js`

Obiettivo: decidere se rimuovere modulo legacy o conservarlo come archivio.

### 6. Pulizia fisica asset residui

Se non gia fatta in repo:

- rimuovere duplicati simulatori;
- rimuovere hotfix CSS non linkati;
- rimuovere file macOS.

## Nuove funzionalita possibili

### Listoni

- filtro dedicato per `Nuovo`, `Uscito`, `+/- quotazione`, `Stato`, `Squadra`, `Ruolo`.
- confronto manuale tra due listoni scelti dall'utente, non solo precedente automatico.
- export CSV/JSON delle differenze listone.

### Presidente

- storico Firebase/Admin per informative `Svincola Giocatori` inviate.
- download PDF/testo della mail svincolo.
- conferma visuale piu' dettagliata dopo invio comunicazioni EmailJS.

### Admin

- dashboard diagnostica piu' pulita, separando strumenti tecnici da funzioni operative.
- log azioni Admin su richieste presidenti/comunicati.
- controllo automatico disallineamenti rosa/listone.

### Dati esterni

- provider mail transazionale con Netlify Function.
- import listoni piu' robusto con anteprima colonne riconosciute.
- validatore Excel prima della conversione.
```

---

## 2. `pianificazione/ROADMAP.md`

- Percorso originale: `pianificazione/ROADMAP.md`
- Dimensione originale: 12139 byte
- SHA-256: `ae8e1ac2f1e938a89b7bcda79cd54877c6cc217cf76b2040ac3dc3268cbe6df9`

````markdown
## Nota V275

V275 chiude il ciclo documentale V271-V274. La roadmap resta prudente: prima test con dati reali e audit mirati, poi eventuali rimozioni o refactor.

## Nota V273

Completato test guidato Listone con Excel reale. Prossimi passi: eventuale test browser manuale del download JSON, poi audit EmailJS reale e audit legacy mirati.

# Aggiornamento V272 - Roadmap corrente

Le prossime attivita sono riorganizzate in `pianificazione/PROSSIME_ATTIVITA_V272.md`. La roadmap tecnica resta prudente: prima test e audit mirati, poi eventuali rimozioni/refactor.

# Aggiornamento V266 - Email deliverability EmailJS

V266 rende piu' pulite e coerenti le mail operative inviate via EmailJS: aggiunge parametri comuni di mittente logico (`Lega ZonaOrientale Salerno`), Reply-To dell'utente loggato quando disponibile, oggetti piu' sobri e firma standard del gestionale. I flussi aggiornati sono: comunicato avvenuto scambio e informativa svincolo giocatori. Non modifica `FUNZIONALITA'.md`. Diagnostica: `window.ZonaOrientaleEmailJsDeliverabilityV266`.

# Aggiornamento V265 - Pulizia asset sicuri

V265 e' una pulizia fisica controllata: rimuove dai comandi di release i duplicati/inutilizzati sicuri gia' identificati nell'audit, mantiene come canonico il simulatore trattative `assets/js/dev/trade-notification-simulator-v255.js` e aggiunge/rafforza `.gitignore` per impedire il ritorno di file macOS. Non modifica `FUNZIONALITA'.md` e non cambia comportamento runtime. Diagnostica: `window.ZonaOrientaleCleanupV265`.

# Aggiornamento V263 - Funzionalita V256-262

V263 aggiunge `FUNZIONALITA'V256-262.md`, registro incrementale delle funzionalita introdotte o consolidate tra V256 e V262. Non modifica `FUNZIONALITA'.md` e non cambia il comportamento runtime. Diagnostica: `window.ZonaOrientaleFeaturesDocV263`.

# Aggiornamento V262 - Audit pulizia codice

V262 aggiunge `AUDIT_CODICE_260528_V262.md` e una `.gitignore` locale in `static/zonaorientale/`. Non cambia funzionalita': fotografa file duplicati/non importati, file macOS e candidati a pulizia controllata. Diagnostica runtime: `window.ZonaOrientaleAuditV262`.

## Nota V261 - Svincolo giocatori presidente

Aggiunta funzionalita presidente `Svincola Giocatori` con invio email EmailJS e quotazioni da listone recente. Prossimo miglioramento possibile: decidere se registrare anche uno storico in Firebase/Admin oppure mantenere il flusso solo email.

## Nota V257 - Rules notifiche trattative

V257 chiude il punto notifiche trattative multi-dispositivo: la lettura dell'esito viene salvata in Firebase quando le rules deployate consentono l'update controllato dei campi `outcomeSeen...`.

# Roadmap ZonaOrientale

Documento consolidato dalle vecchie note sulle nuove funzionalita.


## Roadmap refactor codice

Percorso consigliato dopo V219/V220:

```text
V220 safety refactor mobile chrome - fatto
V221 separazione public/admin rendering - fatto
V222 data repository unico per JSON/Firebase - fatto
V223 CSS cleanup progressivo - fatto
V224 hardening statistiche storiche + avvio rimozione legacy - fatto
V225 stabilizzazione finale post-refactor - fatto
V227 hotfix FM archivio - fatto
V249 richieste presidenti canoniche - fatto
V252 pulizia asset inutilizzati - fatto
V253 modulo richieste presidenti - fatto
V254 simulatore notifiche trattative - fatto
V255 comandi test trattative - fatto
V256 funzionalita V240-255 - fatto
V257 rules notifiche trattative - fatto
V261 svincolo giocatori presidente - fatto
```

Regola: ogni step deve preservare il comportamento visibile della versione precedente, salvo richiesta esplicita di nuova feature.

Nota V225: il primo ciclo refactor tecnico e' concluso. La rimozione legacy pesante resta un lavoro futuro separato e va fatta solo con test browser completi.

## Priorita alta

### 1. Avvisi post-modifica Admin

Dopo una modifica Admin, il sito dovrebbe indicare quali JSON scaricare e quali snapshot aggiornare.

Esempi:

```text
Hai modificato dati stagione: dopo Aggiorna tutto scarica overlay snapshot stagioni.
Hai modificato Albo/Palmares/FIFA: scarica anche honor.json.
```

### 2. Stato pubblicazione dati

Dashboard con semafori:

```text
Firebase aggiornato
Snapshot Firebase aggiornati
JSON statici aggiornati
Ultimo honor.json
Ultimo snapshot stagione
Ultima rosa statica
Ultimo listone
```

Obiettivo: evitare dubbi del tipo "ho aggiornato Firebase ma dopo refresh vedo vecchio?".

### 3. Procedura guidata Pubblica aggiornamenti

Un flusso Admin che guidi:

```text
1. Aggiorna snapshot Firebase
2. Scarica config pubblica
3. Scarica honor JSON
4. Scarica overlay snapshot stagioni
5. Controlla asset pubblici
6. Checklist online finale
```

Non puo fare push GitHub dal browser, ma puo produrre comandi e checklist.

## Funzioni per presidenti

### Dashboard Presidente piu ricca

Mostrare:

```text
saldo FM
numero giocatori in rosa
ultimi movimenti
prossime partite
risultati recenti
posizione competizioni
trattative aperte
giocatori sul mercato
```

### Storico rosa squadra

Confrontare rose statiche nel tempo:

```text
Rosa al 12/05
Rosa al 21/05
+ entrati
- usciti
variazione costo/saldo
```

### Scheda giocatore evoluta

Su `player.html` aggiungere:

```text
squadra attuale
storico squadre ZonaOrientale
movimenti FM
competizioni vinte
presenze in rose precedenti
valore/costo storico
```

### Timeline Fantamercato

Pagina con eventi:

```text
messa sul mercato
trattativa aperta
trattativa chiusa
movimento concluso
```

Filtri: tutte, mia squadra, trattative, movimenti conclusi.

## Funzioni pubbliche

### Home piu narrativa

Aggiungere blocchi:

```text
ultimo comunicato
classifica principale
prossime partite
ultimi risultati
miglior squadra del mese
ultimi movimenti mercato
campioni in carica
```

### Hall of Fame

Vista pubblica con:

```text
presidenti piu vincenti
squadre leggendarie
record storici
stagioni memorabili
ranking all-time
```

### Archivio stagioni migliorato

Ogni stagione dovrebbe avere accesso chiaro a:

```text
squadre
competizioni
classifiche
rose
albo
movimenti mercato
```

## Funzioni mobile

### Menu mobile piu app-like

Possibili miglioramenti:

```text
badge su Mercato se ci sono trattative
badge su Admin se ci sono azioni richieste
scorciatoie presidente
subnav contestuale per pagine lunghe
```

### Modalita solo presidente

Navigazione semplificata:

```text
La mia squadra
Mercato
Comunicati
Competizioni
Rose
```

## Funzioni tecniche utili

### Validatore JSON statici

Estendere `Controlla asset pubblici` con:

```text
config.json coerente con manifest stagioni
honor.json aggiornato dopo ultima modifica
rose manifest punta al file piu recente
nessun JSON mancante
nessuna stagione nel manifest senza file
nessun file orfano non presente nel manifest
```

### Storico modifiche Admin

Registrare in Firebase o sessione:

```text
data/ora
utente admin
tipo modifica
dati impattati
snapshot aggiornati
JSON da scaricare
```

### Backup guidato

Checklist:

```text
backup Firebase scaricato
backup static JSON scaricato
repo locale aggiornata
branch pushato
master aggiornato
```

## Ordine consigliato

1. Avvisi post-modifica Admin
2. Stato pubblicazione dati / semafori Firebase-JSON
3. Procedura guidata Pubblica aggiornamenti
4. Dashboard Presidente migliorata
5. Validatore JSON statici potenziato
6. Hall of Fame / statistiche storiche avanzate

## Stato refactor corrente

V239 completata: corretto il comunicato avvenuto scambio presidente con richiesta approvabile, pubblicazione Admin in News e invio EmailJS immediato. Restano consolidati il ciclo refactor V220-V225, hotfix statistiche V226, hotfix FM Archivio V227, account presidente in header V229 e preview WhatsApp comunicati dinamica tramite Netlify Function. Prossimo passo consigliato: test reale del flusso comunicati su Netlify e poi eventuale diagnostica Admin.


## Dopo V239

- Valutare un'immagine Open Graph dedicata ai comunicati invece dell'icona app generica.
- Verificare in produzione l'endpoint `/zonaorientale/share/news/<id>` dopo deploy Netlify.
- Aggiungere una diagnostica Admin che controlli comunicati senza ID, Firestore non leggibile dalla funzione o preview fallback.


V240 completata: corretto il sync live delle trattative presidente tra badge, dashboard desktop e mobile. Il documento `FUNZIONALITA'.md` non e' stato aggiornato perche' va modificato solo su richiesta esplicita.


V241 completata: stabilizzato il flusso Accetta utenti con rifiuto persistente, blocco rigenerazione pending e filtro duplicati gia approvati. Il documento `FUNZIONALITA'.md` non e' stato aggiornato perche' va modificato solo su richiesta esplicita.


V243 completata: consolidato il flusso comunicato avvenuto scambio e neutralizzati gli handler legacy V50/V79 per evitare doppio submit o scritture dirette in news. Prossimo refactor consigliato: notifiche trattative lette/non lette persistite in Firebase.


V246 completata: la lettura degli esiti trattative viene salvata in Firebase quando il presidente mittente apre la card della proposta conclusa, con `localStorage` solo come fallback. Il documento `FUNZIONALITA'.md` non e' stato aggiornato perche' va modificato solo su richiesta esplicita. Prossimi step consigliati: checklist regressioni e pulizia mirata degli handler legacy residui.


## Stato V247

Completata la checklist regressioni canonica in `REGRESSION_TESTS.md`. Prossimo step consigliato: pulizia mirata degli handler legacy residui piu' rischiosi, senza eliminare funzionalita visibili. `FUNZIONALITA'.md` non e' stato aggiornato perche' va modificato solo su richiesta esplicita.

## Stato V248

Conclusa la prima pulizia mirata degli handler legacy del comunicato avvenuto scambio. Prossimo step consigliato: test regressione completo e merge controllato del branch di refactor su `master`.

## Roadmap post V267

1. Test runtime completo della sezione Competizioni e di `competition.html`.
2. Decidere se `assets/js/domain/competitions.js` va riattivato come modulo canonico, lasciato legacy o rimosso.
3. Audit mirato di `assets/js/refactor/admin-publication-workflow-v213.js`.
4. Aggiornare il registro funzionalita incrementale se emergono nuove funzioni da V263 in poi.


## Roadmap post V268

- Aggiungere anteprima righe convertite nel convertitore listone.
- Valutare generazione overlay zip per listoni con manifest aggiornato.
- Continuare audit prudenti prima di rimuovere moduli legacy.


## V269 - Storico e confronto listoni

- Aggiunto confronto automatico tra listone selezionato e listone precedente della stessa stagione.
- Il convertitore listone arricchisce il JSON generato con campi `previous`, `diff`, `previousQuotationCurrent`, `quotationDiffFromPrevious`, `statusChange` e riepilogo `history`.
- La sezione pubblica `Listone` mostra un pannello `Storico listoni` con nuovi, usciti, variazioni quotazione e ricerca negli altri listoni.
- Il campo ricerca puo' trovare giocatori presenti in listoni passati anche quando non sono nel listone selezionato.
- Diagnostica: `window.ZonaOrientaleListoneHistoryV269`.
- Non sono state rimosse funzionalita' esistenti; il formato storico Tutti/Ceduti e il formato Classic a foglio singolo restano supportati.

## V271

Registro incrementale funzioni V263-V270 completato. Prossimo passo suggerito: test end-to-end listone e audit moduli legacy prima di merge.


## V274 - Codici squadra canonici nel Listone

Il convertitore listone accetta sia sigle sia nomi estesi per la squadra reale, ma salva/visualizza la sigla canonica a 3 lettere. Questo evita falsi cambi squadra nei confronti storici e rende stabile la colonna `Modifica`.

## Dopo V277

- Export CSV/JSON delle differenze listone.
- Audit EmailJS reale e possibile migrazione futura a funzione server-side.
- Audit e pulizia controllata di moduli legacy ancora non rimossi.

## V278 - Export modifiche listone

Aggiunto export CSV non distruttivo delle modifiche del Listone. Il pulsante `Esporta modifiche CSV` rispetta il filtro `Modifiche` e include nuove righe, usciti storici, variazioni quotazione/stato/squadra/ruolo. Documento tecnico: `docs/zonaorientale/listoni/LISTONE_EXPORT_MODIFICHE_V278.md`.
````

---

## 3. `PROSSIME_ATTIVITA_260528.md`

- Percorso originale: `PROSSIME_ATTIVITA_260528.md`
- Dimensione originale: 14285 byte
- SHA-256: `f1b57db8a945d8fdb9f16afa20dc827eba788e4a452b39c0b97f083fc9194923`

````markdown
## Aggiornamento V275

Dopo V275 le prossime attivita consigliate sono: test con un prossimo Excel reale, eventuale consolidamento dei registri funzionali recenti solo su richiesta esplicita, audit `domain/competitions.js`, audit `admin-publication-workflow-v213.js`, verifica deliverability EmailJS e valutazione futura di invio email server-side.

## Aggiornamento V273

Test end-to-end listone reale completato. Restano consigliati: test browser del download JSON generato, audit EmailJS reale, audit `domain/competitions.js`, audit `admin-publication-workflow-v213.js`.

# Aggiornamento V272 - Backlog riorganizzato

Il backlog aggiornato e organizzato si trova in `pianificazione/PROSSIME_ATTIVITA_V272.md`. Restano prioritarie: test end-to-end listoni V268-V270, verifica EmailJS/deliverability, conferma deploy Firebase Rules V257, audit `domain/competitions.js` e audit `admin-publication-workflow-v213.js`.

# Aggiornamento V266 - Email deliverability EmailJS

V266 rende piu' pulite e coerenti le mail operative inviate via EmailJS: aggiunge parametri comuni di mittente logico (`Lega ZonaOrientale Salerno`), Reply-To dell'utente loggato quando disponibile, oggetti piu' sobri e firma standard del gestionale. I flussi aggiornati sono: comunicato avvenuto scambio e informativa svincolo giocatori. Non modifica `FUNZIONALITA'.md`. Diagnostica: `window.ZonaOrientaleEmailJsDeliverabilityV266`.

# Aggiornamento V265 - Pulizia asset sicuri

V265 e' una pulizia fisica controllata: rimuove dai comandi di release i duplicati/inutilizzati sicuri gia' identificati nell'audit, mantiene come canonico il simulatore trattative `assets/js/dev/trade-notification-simulator-v255.js` e aggiunge/rafforza `.gitignore` per impedire il ritorno di file macOS. Non modifica `FUNZIONALITA'.md` e non cambia comportamento runtime. Diagnostica: `window.ZonaOrientaleCleanupV265`.

# Aggiornamento V263 - Funzionalita V256-262

V263 aggiunge `FUNZIONALITA'V256-262.md`, registro incrementale delle funzionalita introdotte o consolidate tra V256 e V262. Non modifica `FUNZIONALITA'.md` e non cambia il comportamento runtime. Diagnostica: `window.ZonaOrientaleFeaturesDocV263`.

# Aggiornamento V262 - Audit pulizia codice

V262 aggiunge `AUDIT_CODICE_260528_V262.md` e una `.gitignore` locale in `static/zonaorientale/`. Non cambia funzionalita': fotografa file duplicati/non importati, file macOS e candidati a pulizia controllata. Diagnostica runtime: `window.ZonaOrientaleAuditV262`.

# Aggiornamento V261 - Svincola Giocatori

V261 aggiunge in Dashboard Presidente il flusso `Svincola Giocatori`: selezione multipla dalla rosa, generazione testo email con quotazioni da listone recente e invio EmailJS a `caparrotti86@yahoo.it`.

Attivita future collegate:

- Valutare se creare anche uno storico Firebase/Admin delle informative svincolo inviate.
- Valutare un export o snapshot degli svincoli comunicati.
- Verificare se lo svincolo dovra in futuro modificare automaticamente rose/listone oppure restare solo informativa email.

# Aggiornamento V260 - Pulizia preview/tag tecnici

V260 ha rimosso `Apri preview` dalle news e ha nascosto i badge tecnici Firebase/JSON dall'interfaccia. Le fonti dati restano invariate: Firebase e JSON statici continuano a essere usati internamente.

Prossime attivita suggerite:

- Verificare se rimuovere definitivamente fallback inline V249 dopo ulteriore test del modulo V253.
- Continuare estrazione modulare Dashboard Presidente.
- Valutare una pagina Admin piu' pulita per differenziare funzioni operative da diagnostiche tecniche.

# Aggiornamento V259 - Preview WhatsApp

Aggiunta attivita completata: separare anteprima home da anteprime news. Restano da verificare in produzione eventuali cache WhatsApp/Meta e il corretto uso dei link `/share/news/<id>` per i comunicati.

# Prossime attività ZonaOrientale - 260528

Documento creato in V258 per pianificare le attività successive sul nuovo branch:

```text
refactor/260528-zonaorientale-next
```

Questo file elenca attività possibili di pulizia, refactor, correzione, nuove funzionalità e integrazione dati esterni. Non è un impegno a farle tutte: va usato come backlog ragionato.

## Priorità alta

### 1. Verificare deploy Firebase Rules V257

Obiettivo: rendere multi-dispositivo la lettura delle notifiche esito trattativa.

Azioni:

```text
- pubblicare FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules
- testare smartphone -> desktop
- verificare assenza warning "Lettura esito trattativa salvata solo localmente"
```

Criterio di successo:

```text
Se il presidente legge l'esito da smartphone, il badge non ricompare da desktop.
```

### 2. Test completo branch V242-V258 dopo merge

Usare:

```text
docs/zonaorientale/REGRESSION_TESTS.md
```

Aree obbligatorie:

```text
Dashboard pubblica
News/comunicati
Dashboard Presidente
Comunicato squadra
Comunicato avvenuto scambio
Trattative inviate/ricevute
Admin -> Richieste presidenti
Admin -> Comunicati
Admin -> Generatore comunicati automatici
Admin -> Workflow pubblicazione
```

### 3. Consolidare modulo Admin Richieste presidenti

Situazione attuale:

```text
Modulo nuovo: assets/js/admin/team-requests-panel-v253.js
Fallback inline: ancora presente in assets/app.js
```

Proposta:

```text
V259 o successiva: se il modulo V253 è stabile, rimuovere il fallback inline V249 da app.js.
```

Rischio:

```text
Medio. Tocca una sezione Admin importante.
```

Criterio di successo:

```text
Admin -> Richieste presidenti funziona con solo modulo V253.
```

## Priorità media

### 4. Estrarre Dashboard Presidente da app.js

Obiettivo: ridurre la complessità di `assets/app.js`.

Moduli candidati:

```text
assets/js/president/dashboard.js
assets/js/president/team-communications.js
assets/js/president/transfer-communication.js
assets/js/president/trade-notifications.js
assets/js/president/trade-lists.js
```

Approccio consigliato:

```text
- estrarre una sola funzionalità per overlay
- mantenere fallback finché il modulo non è testato
- non cambiare UI nello stesso overlay del refactor
```

### 5. Pulire codice legacy comunicati scambio V50/V79

Situazione:

```text
V242-V248 hanno reso canonico il flusso comunicato scambio.
Alcuni resti legacy possono essere ancora presenti in app.js.
```

Proposta:

```text
- identificare funzioni V50/V79 non più chiamate
- verificare con ricerca DOM/handler
- rimuovere solo dopo test comunicato scambio e Admin richieste
```

### 6. Verificare `assets/js/domain/competitions.js`

Possibile file scollegato.

Attività:

```text
- cercare import e riferimenti runtime
- confrontare con logica competizioni inline
- decidere se riattivare, archiviare o rimuovere
```

Rischio:

```text
Basso/medio, ma evitare cancellazioni senza test della pagina Competizioni e competition.html.
```

### 7. Chiarire destino modulo V213

File sospetto:

```text
assets/js/refactor/admin-publication-workflow-v213.js
```

V251 ha scelto di non riattivarlo perché il workflow inline era già presente e più sicuro.

Opzioni:

```text
A) lasciarlo come legacy documentato
B) spostarlo in cartella legacy
C) rimuoverlo dopo verifica completa
```

### 8. Migliorare gestione errori EmailJS

Attività possibili:

```text
- messaggio UI distinto tra richiesta salvata e mail fallita
- log diagnostico più chiaro
- indicazione all'admin se la mail non è partita
```

Criterio di successo:

```text
Il presidente capisce se il comunicato è stato salvato anche quando la mail non parte.
```

## Priorità bassa / manutenzione

### 9. Pulizia pagine comunicati statiche legacy

File/aree:

```text
news.html
comunicati/*.html
tools/generate-news-share-pages.mjs
```

Oggi il flusso moderno usa Netlify Function:

```text
/zonaorientale/share/news/<id>
```

Non cancellare senza verificare vecchi link WhatsApp.

### 10. Migliorare `.gitignore`

Verificare che non rientrino:

```text
.DS_Store
__MACOSX
._*
```

Controllare sia root repo sia `static/zonaorientale/.gitignore`.

### 11. Ridurre dimensione CSS

Situazione:

```text
assets/styles.css molto grande
mobile-suite/mobile-chrome con molte patch storiche
```

Approccio:

```text
- prima audit classi usate
- poi spostare componenti in CSS modulari
- evitare minificazione o pulizia automatica non verificata
```

### 12. Aggiungere piccoli test tecnici locali

Possibili script:

```text
tools/check-js.sh
node --check su tutti i JS
validazione JSON
controllo version/cache-buster
controllo file docs obbligatori
```

## Nuove funzionalità possibili

### 13. Registro notifiche presidente

Oggi le notifiche sono badge calcolati da `transferNegotiations`.

Possibile evoluzione:

```text
Dashboard Presidente -> Notifiche
- proposta ricevuta
- proposta accettata/rifiutata
- comunicato approvato/rifiutato
- evento admin rilevante
```

Opzioni dati:

```text
A) derivare da collection esistenti
B) creare collection notifications
```

Consiglio: iniziare derivando dai dati esistenti, evitare nuova collection finché non serve.

### 14. Storico comunicati presidente

Dashboard Presidente potrebbe mostrare:

```text
comunicati inviati
stato PENDING/APPROVED/REJECTED
motivazione rifiuto
link alla news pubblicata
```

Userebbe `teamRequests`.

### 15. Migliore audit Admin

Aggiungere campi standard:

```text
approvedAt
approvedBy
rejectedAt
rejectedBy
deletedAt/logico se non si vuole cancellare
```

Per ora `Elimina da Firebase` cancella fisicamente `teamRequests/{id}`.

### 16. Import dati esterni

Possibili supporti:

```text
Excel listone
Excel rose
CSV movimenti
export Fantacalcio.it se disponibile
```

Attenzione: ogni import deve produrre JSON statici o overlay chiari da committare.

### 17. Miglioramento preview WhatsApp

Verificare periodicamente:

```text
Netlify Function news-share.js
Open Graph dinamico
fallback per comunicati legacy
```

### 18. Modalità manutenzione Admin

Possibile funzionalità:

```text
Admin -> Pubblicazione -> stato: dati Firebase modificati ma JSON statici non aggiornati
```

Utile per evitare disallineamenti tra dati live e snapshot pubblici.

## Attività da evitare senza conferma esplicita

```text
- modificare FUNZIONALITA'.md
- cancellare pagine comunicati legacy
- rimuovere fallback inline Admin prima dei test
- riscrivere app.js in blocco unico
- cambiare Firebase Rules senza confronto con regole pubblicate
- cambiare flusso EmailJS senza test reale
```

## Sequenza consigliata prossimi overlay

```text
V259 - verifica/rimozione fallback inline Admin Richieste presidenti
V260 - estrazione modulo Dashboard Presidente: comunicati
V261 - estrazione modulo Dashboard Presidente: trattative/notifiche
V262 - audit e decisione su competitions.js
V263 - audit legacy V213 e pagine comunicati statiche
V264 - strumenti check locali JS/JSON/versioni
```

Ogni overlay deve essere piccolo, testabile e reversibile.

# Aggiornamento V267 - Audit competizioni

V267 aggiunge `AUDIT_COMPETIZIONI_V267.md` e aggiorna la guida per un nuovo assistente AI. Non rimuove codice e non modifica comportamento runtime.

Prossime attivita collegate:

```text
- Eseguire test completo sezione Competizioni.
- Decidere destino di assets/js/domain/competitions.js.
- Audit successivo consigliato: admin-publication-workflow-v213.js.
```


# Aggiornamento V268 - Convertitore listone Excel

La V268 risolve il problema del file Classic a foglio singolo che veniva convertito con 0 giocatori.

Prossimi miglioramenti possibili:

- aggiungere validazione visiva delle colonne riconosciute prima del download JSON;
- mostrare le prime 5 righe convertite come anteprima;
- generare uno zip con JSON + manifest aggiornato invece del solo JSON;
- integrare un controllo duplicati per `fantacalcioId` e `playerName`.


## V269 - Storico e confronto listoni

- Aggiunto confronto automatico tra listone selezionato e listone precedente della stessa stagione.
- Il convertitore listone arricchisce il JSON generato con campi `previous`, `diff`, `previousQuotationCurrent`, `quotationDiffFromPrevious`, `statusChange` e riepilogo `history`.
- La sezione pubblica `Listone` mostra un pannello `Storico listoni` con nuovi, usciti, variazioni quotazione e ricerca negli altri listoni.
- Il campo ricerca puo' trovare giocatori presenti in listoni passati anche quando non sono nel listone selezionato.
- Diagnostica: `window.ZonaOrientaleListoneHistoryV269`.
- Non sono state rimosse funzionalita' esistenti; il formato storico Tutti/Ceduti e il formato Classic a foglio singolo restano supportati.

## Dopo V270 - Listone modifiche visibili

Verificare in produzione:

- colonna `Modifica` nei Campi visibili;
- righe `Uscito` con ultimo listone indicato;
- filtro `Mostra usciti storici`;
- ricerca per giocatore presente solo in listoni precedenti;
- ordinamento della colonna `Modifica`.

## Dopo V271 - prossime attivita consigliate

1. Testare in modo completo V268-V270 sul listone reale: formato Classic, storico, colonna `Modifica`, usciti storici e ricerca globale.
2. Valutare se portare le voci di `FUNZIONALITA'V263-270.md` nel registro principale `FUNZIONALITA'.md`, solo su richiesta esplicita.
3. Audit mirato di `admin-publication-workflow-v213.js` prima di eventuale archiviazione o rimozione.
4. Audit mirato di `domain/competitions.js` prima di eventuale rimozione.
5. Test completo di regressione prima del merge su `master`.


## V274 - Codici squadra canonici nel Listone

Il convertitore listone accetta sia sigle sia nomi estesi per la squadra reale, ma salva/visualizza la sigla canonica a 3 lettere. Questo evita falsi cambi squadra nei confronti storici e rende stabile la colonna `Modifica`.

## Aggiornamento dopo V276-V277

- Testare il pannello Admin `Diagnostica dati` dopo ogni deploy.
- Testare il filtro `Modifiche` del Listone con un listone reale e un listone precedente.
- Prossime attivita' suggerite: export differenze listone, audit EmailJS reale, audit `domain/competitions.js`, refactor prudente del Listone in moduli dedicati.

## V278 - Export modifiche listone

Aggiunto export CSV non distruttivo delle modifiche del Listone. Il pulsante `Esporta modifiche CSV` rispetta il filtro `Modifiche` e include nuove righe, usciti storici, variazioni quotazione/stato/squadra/ruolo. Documento tecnico: `docs/zonaorientale/listoni/LISTONE_EXPORT_MODIFICHE_V278.md`.
````

---

## Dopo V407

Proseguire con refactor e pulizia a basso rischio:

1. verificare da mobile la nuova densita della sezione Calciomercato senza anteprime;
2. consolidare eventuali altre viste mobile troppo verticali con soli interventi CSS;
3. evitare refactor strutturali finche dashboard, Listone, Rose, Fantamercato, Calciomercato e Area squadra non sono state verificate manualmente;
4. mantenere una patch per volta, con audit dedicato e documenti consolidati aggiornati.


---

## Dopo V408

1. Continuare ad armonizzare le tabelle pubbliche senza cambiare routing o sorgenti dati.
2. Valutare una pulizia CSS mirata alle sole tabelle duplicate, mantenendo audit prima di rimuovere regole legacy.
3. Proseguire con ottimizzazioni mobile conservative: leggibilita, densita, scroll e tap target.
4. Evitare per ora pagine standalone, modifiche Firebase/auth/admin e rimozioni aggressive.

## Dopo V419

- Verificare manualmente Archivio Stagioni da mobile, in particolare stagione 2025-2026, card Competizioni e Timeline dati.
- Prossimi interventi consigliati: consolidamento pre-merge, audit CSS/JS non collegati, eventuali micro-rifiniture mobile su card storiche ancora troppo alte.
- Evitare refactor strutturali finche' la UX mobile V407-V419 non e' validata su dispositivo reale.

## Roadmap aggiornata dopo V425

- Restano circa 2-3 passaggi conservativi: checklist mobile finale, pulizia warning legacy selettiva, preparazione pre-merge.
- Evitare refactor strutturali fino a verifica mobile reale su dashboard, Archivio, Listone, La mia squadra, Area Squadra e Admin.
- Continuare ad aggiornare solo i documenti consolidati per categoria.

## Dopo V430

Verificare manualmente da mobile tutti i pannelli Admin con titoli lunghi. Se la correzione e confermata, riprendere solo micro-fix mirati o preparare checklist finale pre-merge.

## Dopo V441

Verificare su mobile che i gruppi checkbox Mantra restino usabili nei pannelli Listone, Rose e Area Squadra. Eventuali raffinamenti successivi devono restare CSS-only salvo bug funzionali.

## Dopo V442

Verificare da desktop stretto e mobile le sezioni con molti controlli: Listone, Rose, Fantamercato, Movimenti e Bilanci. Eventuali ulteriori interventi devono restare preferibilmente CSS-only e preservare i filtri Mantra V441.
