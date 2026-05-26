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
