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
