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
