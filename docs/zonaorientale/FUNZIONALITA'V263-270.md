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
