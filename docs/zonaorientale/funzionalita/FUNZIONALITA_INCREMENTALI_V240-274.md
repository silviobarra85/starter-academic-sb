# FUNZIONALITA' INCREMENTALI V240-V274 - ZonaOrientale Salerno

Documento unico accorpato dai registri incrementali V240-255, V256-262, V263-270 e V271-274.

Questo file non sostituisce `FUNZIONALITA'.md`, che resta il registro funzionale principale e protetto. Serve come registro unico delle funzionalita', correzioni, consolidamenti, refactor e note operative introdotte tra V240 e V274.

## Regola di manutenzione

- `FUNZIONALITA'.md` resta il documento principale e va modificato solo su richiesta esplicita.
- Questo file va aggiornato quando si vogliono accorpare i registri incrementali recenti.
- Prima di rimuovere codice legacy, verificare che la funzionalita' non sia citata qui, in `REGRESSION_TESTS.md` o nell'handoff corrente.
- Le modifiche qui riportate sono additive, di consolidamento o di manutenzione: non risultano funzionalita' rimosse intenzionalmente nei blocchi coperti.

## Indice

- [Blocco V240-255](#blocco-v240-255)
- [Blocco V256-262](#blocco-v256-262)
- [Blocco V263-270](#blocco-v263-270)
- [Blocco V271-274](#blocco-v271-274)

---

# Blocco V240-255

Fonte originale: `FUNZIONALITA'V240-255.md`

Documento incrementale creato in V256.

Questo file riepiloga le funzionalita introdotte, ripristinate o consolidate tra V240 e V255. Non sostituisce `FUNZIONALITA'.md`, che resta il registro funzionale principale e deve essere aggiornato solo su richiesta esplicita.

## 1. Pubblico

### News e comunicati

- Mantenuto il flusso pubblico dei comunicati nella sezione News.
- Consolidato il supporto ai comunicati generati da richieste presidente approvate dall'Admin.
- Confermata la compatibilita' con preview/condivisione comunicati gia' presente nel sito.

### Navigazione, cache e versione

- Aggiornati progressivamente footer, cache-buster e diagnostica di deploy per tutte le versioni V240-V255.
- Preservati i percorsi pubblici principali: Dashboard, News, Rose, Fantamercato, Listone, Competizioni, Albo, Statistiche, Archivio, Confronta, Regolamento.

## 2. Presidente

### Dashboard Presidente

- Le trattative vengono rilette in modo piu' coerente quando si entra nella Dashboard Presidente e nella sottosezione Trattative.
- Il badge rosso con punto esclamativo segnala proposte ricevute ancora in attesa.
- Il badge destinatario resta visibile finche' la proposta non viene approvata o rifiutata.
- Il badge del mittente segnala l'esito di una proposta inviata approvata/rifiutata.
- La lettura dell'esito viene salvata su Firebase quando consentito dalle regole, con fallback locale.

### Trattative

- Ripristinata la visibilita' dello storico delle trattative inviate e ricevute.
- Le ultime 5 trattative sono visibili subito; le altre restano consultabili tramite scorrimento nel riquadro.
- Ogni card trattativa mantiene proposta ed esito.
- La notifica mittente sparisce solo dopo apertura/lettura della card relativa all'esito.

### Comunicati presidente

- Consolidato il flusso canonico `Comunicato avvenuto scambio`.
- Il comunicato avvenuto scambio non scrive piu' direttamente in `news` dal profilo presidente.
- Il flusso corretto e': presidente -> `teamRequests` con `TRANSFER_NEWS` -> invio EmailJS -> approvazione Admin -> pubblicazione News.
- Neutralizzati i vecchi handler legacy V50/V79/V237 che potevano agganciarsi al form storico.
- La mail EmailJS dell'avvenuto scambio resta inviata subito a `caparrotti86@yahoo.it`.

### Test presidente/trattative

- Aggiunto il simulatore notifiche trattative da console browser.
- API corrente: `window.ZonaOrientaleTradeSimulatorV255`.
- Alias compatibile: `window.ZonaOrientaleTradeSimulatorV254`.
- Comando rapido consigliato: `await ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()`.
- Le simulazioni locali non scrivono su Firebase.
- Il test reale puo' creare una proposta in Firebase con `await ZonaOrientaleTradeSimulatorV255.createFirebaseSentProposal({ confirm: true })`.

## 3. Admin

### Accetta utenti

- Stabilizzato il flusso `Accetta utenti`.
- Gli utenti gia' approvati non vengono piu' rigenerati come richieste `PENDING` al login Google/email.
- Gli utenti rifiutati restano marcati come `REJECTED`, evitando ricomparsa automatica come nuove richieste.
- Il pannello nasconde vecchi duplicati `pendingUsers` quando esiste gia' un utente approvato in `teamUsers`.

### Richieste presidenti

- Consolidato il pannello `Admin -> Richieste presidenti`.
- Aggiunto/normalizzato il pulsante `Aggiorna richieste` per rileggere `teamRequests` da Firebase.
- Le richieste `TRANSFER_NEWS` generate dai comunicati avvenuto scambio sono visibili nel pannello.
- Mantenute azioni di approvazione e rifiuto.
- Aggiunto `Elimina da Firebase` per comunicati rifiutati.
- Esteso `Elimina da Firebase` anche ai comunicati approvati/accepted.
- L'eliminazione cancella il documento da `teamRequests/{id}` ma non cancella eventuali news gia' pubblicate.
- Il pannello e' stato estratto in modulo dedicato: `assets/js/admin/team-requests-panel-v253.js`, con fallback storico ancora presente in `app.js`.

### Comunicati Admin

- Ripristinato il Generatore comunicati automatici.
- Il generatore produce bozze per risultati, vincitori, mercato, focus squadra, albo/palmares e aggiornamenti dati pubblici.
- Il generatore non scrive direttamente su Firebase.
- Azioni disponibili: copia testo e inserisci bozza nel form Comunicati.

### Workflow pubblicazione

- Consolidato il workflow pubblicazione Admin gia' presente inline.
- Mantenuti pannelli `Stato Firebase / JSON` e `Procedura guidata Pubblica aggiornamenti`.
- Aggiornati comandi del wizard, rimuovendo riferimenti a branch storici obsoleti.
- Il vecchio modulo esterno V213 resta da valutare come legacy per eventuale rimozione futura.

## 4. Sviluppo, test e manutenzione

### Checklist regressioni

- Aggiunto `REGRESSION_TESTS.md` come checklist stabile pre-merge/pre-deploy.
- La checklist copre aree pubbliche, presidente, admin, mobile, Firebase, comunicati e trattative.

### Pulizia asset

- Aggiunto `.gitignore` locale per evitare `.DS_Store`, `__MACOSX` e file AppleDouble.
- Identificati come rimovibili i CSS mobile hotfix V166/V167, gia' inglobati in `mobile-suite-v168.css`.

### Refactor progressivo

- Avviata estrazione modulare da `app.js`.
- Primo modulo estratto: `Admin -> Richieste presidenti`.
- Il fallback storico non e' stato rimosso per ridurre il rischio di regressioni.

## 5. Funzionalita rispetto a FUNZIONALITA'.md

Rispetto a `FUNZIONALITA'.md`, il ciclo V240-V255 aggiunge o dettaglia soprattutto:

- aggiornamento e stabilizzazione notifiche trattative presidente;
- lettura esiti trattative sincronizzabile su Firebase;
- simulatore notifiche trattative da console;
- flusso canonico comunicato avvenuto scambio;
- gestione Admin piu' completa delle richieste presidente;
- eliminazione da Firebase delle richieste comunicato approvate/rifiutate;
- generatore comunicati automatici Admin ripristinato;
- checklist regressioni e strumenti di test.

Alla data V256 non risulta volutamente rimossa alcuna funzionalita' gia' tracciata in `FUNZIONALITA'.md`. Le modifiche V240-V255 sono additive o di consolidamento.

## 6. Funzionalita/moduli da verificare ancora

- `assets/js/refactor/admin-publication-workflow-v213.js`: modulo esterno ancora non collegato; il workflow inline e' quello canonico. Candidato a rimozione futura o archiviazione come legacy.
- `assets/js/domain/competitions.js`: modulo domain non importato direttamente da `app.js` nella baseline analizzata; va verificato prima di eventuale rimozione perche' la logica competizioni potrebbe essere duplicata inline.
- `tools/generate-news-share-pages.mjs`, `news.html` e `comunicati/*.html`: strumenti/pagine legacy per share statiche; da mantenere finche' serve compatibilita' con vecchi link, oppure dichiarare legacy.
- `assets/css/mobile-hotfix-v166.css` e `assets/css/mobile-hotfix-v167.css`: candidati a rimozione se gia' rimossi dalla repo o dopo conferma visuale mobile.

---

# Blocco V256-262

Fonte originale: `FUNZIONALITA'V256-262.md`

Documento aggiuntivo creato in **V263** per tracciare le funzionalita' introdotte, consolidate o documentate tra **V256** e **V262**.

Questo file **non sostituisce** `FUNZIONALITA'.md`: e' un registro incrementale del ramo `refactor/260528-zonaorientale-next`.

## Regola di manutenzione

- `FUNZIONALITA'.md` resta il documento principale e va modificato solo su richiesta esplicita.
- Questo file registra le modifiche funzionali e tecniche del blocco V256-V262.
- Prima di merge su `master`, verificare se trasferire alcune voci nel file principale.

---

## Pubblico

### Home e anteprima WhatsApp

**Versioni:** V259, V260

- La home `/zonaorientale/` usa metadati Open Graph generici del sito.
- La condivisione della home non deve mostrare l'ultima news come anteprima.
- Le anteprime specifiche delle news restano limitate ai link news dedicati:

```text
/zonaorientale/share/news/<id>
```

- Il pulsante `Apri preview` non e' piu' mostrato nell'interfaccia news.
- Resta il pulsante `Copia link WhatsApp`.

### Tag tecnici Firebase/JSON

**Versione:** V260

- Sono stati nascosti/rimossi dall'interfaccia utente i badge tecnici `Firebase`, `JSON`, `JSON statico`, `Solo JSON` dove non utili all'utente finale.
- La rimozione e' solo visiva: non modifica il funzionamento dei dati statici, Firebase, snapshot o fallback.

---

## Presidente

### Trattative e notifiche multi-dispositivo

**Versioni:** V257, con predisposizione runtime V246

- Le notifiche trattative continuano a derivare dalla collection Firebase:

```text
transferNegotiations
```

- Per il presidente destinatario, il badge resta visibile finche' una trattativa ricevuta e' `PENDING`.
- Per il presidente mittente, il badge dell'esito resta visibile finche' la card della proposta conclusa non viene aperta.
- Le Firebase Rules V257 consentono al mittente di aggiornare solo i campi di lettura esito:

```text
outcomeSeenByFromUid
outcomeSeenByUid
outcomeSeenAtByFromUid
outcomeSeenMarkerByFromUid
```

- Obiettivo: se una notifica esito viene letta da smartphone, non deve riapparire da desktop.
- Se le rules non sono state pubblicate, il sito puo' usare ancora `localStorage` come fallback locale.

### Svincola Giocatori

**Versione:** V261

Nuova sottosezione in **Dashboard Presidente** accanto a:

```text
Invia comunicato squadra
Comunicato avvenuto scambio
```

Funzioni:

- Il presidente seleziona uno o piu' giocatori dalla propria rosa.
- Il sistema genera automaticamente una mail indirizzata a:

```text
caparrotti86@yahoo.it
```

- Oggetto email:

```text
<Nome Squadra> - Svincolo giocatori - <Data odierna>
```

- Corpo email standard:

```text
Presidente Caparrotti, con la presente comunico i giocatori che intendo svincolare:
```

- I giocatori selezionati vengono allegati in forma di lista, con tra parentesi l'ultima quotazione attuale recuperata dal listone piu' recente disponibile.
- La mail indica il listone/listoni da cui sono state recuperate le quotazioni.
- Chiusura:

```text
Cordiali Saluti
<nome presidente>
```

- Il flusso invia email tramite EmailJS.
- Non crea richieste in `teamRequests`.
- Non scrive su Firebase.
- Diagnostica runtime:

```js
window.ZonaOrientalePlayerReleaseV261
window.ZonaOrientalePlayerReleaseV261.buildDraft()
```

---

## Admin

### Firebase Rules notifiche trattative

**Versione:** V257

Sono stati aggiunti i file rules:

```text
docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules
docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules
```

Funzione:

- consentire la lettura multi-dispositivo degli esiti trattativa;
- limitare l'update del presidente mittente ai soli campi `outcomeSeen...`;
- non concedere permessi generici sulla modifica delle trattative.

Nota operativa:

- le rules non vengono applicate automaticamente da Netlify;
- vanno pubblicate da Firebase Console o Firebase CLI.

### Richieste presidenti e comunicati

**Versioni precedenti consolidate nel ramo, richiamate fino a V256**

Il flusso aggiornato prevede:

- aggiornamento richieste da Firebase;
- gestione comunicati squadra;
- gestione comunicati avvenuto scambio;
- eliminazione da Firebase dei comunicati approvati/rifiutati nel registro `teamRequests`;
- la cancellazione da `teamRequests` non elimina una eventuale news gia' pubblicata.

### Generatore comunicati automatici

**Versione precedente consolidata nel ramo, richiamata fino a V256**

Il generatore comunicati Admin e' stato ripristinato e resta non distruttivo:

- genera bozze;
- copia testo;
- inserisce la bozza nel form Comunicati;
- non scrive direttamente su Firebase.

---

## Sviluppo, test e manutenzione

### Handoff nuovo branch

**Versione:** V258

Sono stati aggiunti documenti di handoff per eventuale cambio assistente:

```text
docs/zonaorientale/ISTRUZIONI_NUOVO_ASSISTENTE_260528.md
docs/zonaorientale/PROSSIME_ATTIVITA_260528.md
```

Contengono:

- contesto progetto;
- branch consigliato;
- file da passare a un nuovo assistente;
- regole operative;
- backlog tecnico e funzionale.

### Audit codice

**Versione:** V262

Aggiunto documento:

```text
docs/zonaorientale/AUDIT_CODICE_260528_V262.md
```

Contiene:

- stato tecnico post-V261;
- file duplicati o candidati alla pulizia;
- asset legacy da non eliminare senza audit;
- proposta di pulizie/refactor successive.

### Simulatore trattative

**Versioni:** V254-V255, documentato fino a V256

API disponibile in console browser:

```js
window.ZonaOrientaleTradeSimulatorV255
```

Comando smoke test rapido:

```js
await ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()
```

Il simulatore serve a verificare badge, card inviate/ricevute ed esiti senza dover coinvolgere due account reali.

---

## Funzionalita' non perse secondo audit statico

Alla creazione di questo file non risultano funzionalita' tracciate come perse nelle aree toccate dal ramo V256-V262.

Risultano ancora collegate o preservate:

- comunicato avvenuto scambio;
- invio EmailJS comunicato scambio;
- richiesta Admin per comunicato scambio;
- Admin -> Richieste presidenti;
- generatore comunicati automatici;
- workflow pubblicazione Admin inline;
- simulatore trattative V255;
- anteprima news via `/zonaorientale/share/news/<id>`;
- home con anteprima generica;
- Svincola Giocatori.

## Candidati a ulteriore verifica

Non eliminare senza audit mirato:

```text
assets/js/refactor/admin-publication-workflow-v213.js
assets/js/domain/competitions.js
news.html
comunicati/*.html
tools/generate-news-share-pages.mjs
```

Candidati a pulizia controllata:

```text
assets/js/dev/trade-notification-simulator-v254.js
assets/js/trade-notification-simulator-v255.js
assets/css/mobile-hotfix-v166.css
assets/css/mobile-hotfix-v167.css
.DS_Store
__MACOSX
```

---

# Blocco V263-270

Fonte originale: `FUNZIONALITA'V263-270.md`

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

---

# Blocco V271-274

Fonte originale: `FUNZIONALITA'V271-274.md`

Documento aggiuntivo al registro funzionale principale. Non sostituisce `FUNZIONALITA'.md` e non deve essere usato per cancellare funzionalita esistenti.

Periodo coperto: V271, V272, V273, V274.
Versione di riferimento: V275 funzionalita V271-274.
Branch di lavoro: `refactor/260528-zonaorientale-next`.

## Regola di manutenzione

- `FUNZIONALITA'.md` resta il registro storico principale e va modificato solo su richiesta esplicita.
- Questo file registra le modifiche recenti e deve essere consultato prima di refactor, pulizie o merge.
- Prima di rimuovere codice legacy, verificare che la funzionalita non sia citata qui, nei file `FUNZIONALITA'V240-255.md`, `FUNZIONALITA'V256-262.md`, `FUNZIONALITA'V263-270.md` o in `REGRESSION_TESTS.md`.

## Pubblico

### Listone

Funzionalita consolidate tra V271 e V274:

- La colonna opzionale `Modifica`, introdotta in V270, resta parte del Listone.
- La colonna `Modifica` puo indicare: `Nuovo`, `Uscito`, variazione quotazione `+N`/`-N`, cambio stato, cambio squadra, cambio ruolo o piu variazioni.
- I giocatori usciti dal listone corrente ma presenti in listoni precedenti possono essere mostrati come righe storiche.
- Le righe storiche indicano l'ultimo listone in cui il giocatore era presente.
- La ricerca puo includere anche altri listoni, non solo quello selezionato.
- Il confronto storico non deve generare falsi cambi squadra per differenze tra sigle e nomi estesi.

### Codici squadra nel Listone

Da V274 il sistema accetta sia sigle sia nomi estesi in input, ma visualizza e usa internamente il codice canonico a tre lettere.

Esempi:

- `Atalanta` -> `ATA`
- `Bologna` -> `BOL`
- `Inter` -> `INT`
- `Milan` -> `MIL`
- `Hellas Verona` -> `VER`

Regole:

- Il valore visualizzato nella tabella deve essere il codice canonico.
- Il valore originale proveniente dall'Excel puo essere conservato come metadato, ad esempio `realTeamOriginal`.
- La ricerca deve continuare a funzionare sia con sigla sia con nome esteso.
- Il confronto storico deve usare il valore canonico, non il testo grezzo dell'Excel.

## Presidente

Nessuna nuova funzionalita presidente e' stata introdotta tra V271 e V274. Restano valide le funzionalita precedenti:

- Dashboard Presidente.
- Comunicati squadra.
- Comunicati avvenuto scambio con EmailJS e richiesta Admin.
- Svincola Giocatori con invio EmailJS.
- Trattative inviate/ricevute e notifiche.
- Lettura esiti trattative sincronizzata con Firebase quando le rules V257 sono pubblicate.

## Admin

### Converti listone Excel

Funzionalita consolidate:

- Supporto formato storico con fogli `Tutti` e `Ceduti`.
- Supporto formato Classic a foglio singolo, ad esempio `Lista calciatori`.
- Mappatura colonne Classic:
  - `#` -> identificativo Fantacalcio
  - `Nome` -> nome giocatore
  - `Sq.` -> squadra reale, normalizzata a codice canonico
  - `R.` -> ruolo classic
  - `R.MANTRA` -> ruoli mantra
  - `QUOT.` -> quotazione attuale
  - `FVM/1000` -> FVM
  - `FantaSquadra` -> rosa/squadra fantasy se presente
  - `Costo` -> costo rosa se presente
  - `Fuori lista` -> stato in listone / asteriscato
- Report conversione con numero giocatori, formato riconosciuto, fogli usati e statistiche di stato.
- Confronto automatico con il listone precedente quando disponibile.
- Normalizzazione stabile dei codici squadra per evitare falsi cambi squadra.

### Test reale V273

Il test con il file Excel reale `lista_calciatori_lista calciatori_classic_zonaorientale-salerno.xlsx` ha prodotto:

- Formato riconosciuto: Fantacalcio Classic a foglio singolo.
- Foglio usato: `Lista calciatori`.
- Giocatori convertibili: 663.
- Giocatori in listone: 532.
- Giocatori asteriscati: 131.
- Giocatori con quotazione valida: 663.
- Giocatori con FantaSquadra valorizzata: 299.
- Confronto con listone precedente `2026-05-15`:
  - giocatori comuni: 661;
  - nuovi giocatori: 2;
  - giocatori usciti: 0;
  - quotazioni aumentate: 96;
  - quotazioni diminuite: 120;
  - quotazioni invariate: 445;
  - cambi ruolo: 0;
  - cambi squadra reali dopo normalizzazione: 0;
  - cambi stato: 1.

Nuovi giocatori rilevati nel test:

- Mikolajewski - Parma - Qt.A 2.
- Mosconi - Inter - Qt.A 1.

## Sviluppo, test e manutenzione

### Handoff e documentazione

V272 ha riorganizzato la documentazione di handoff e pre-merge in cartelle:

- `docs/zonaorientale/handoff/`
- `docs/zonaorientale/audit/`
- `docs/zonaorientale/pianificazione/`
- `docs/zonaorientale/release/`
- `docs/zonaorientale/listoni/`

V275 aggiunge questo registro funzionale per V271-V274.

### Diagnostiche runtime rilevanti

- `window.ZonaOrientaleFunctionLedgerV271`
- `window.ZonaOrientalePreMergeAuditV272`
- `window.ZonaOrientaleListoneE2ETestV273`
- `window.ZonaOrientaleListoneTeamCodesV274`
- `window.ZonaOrientaleFunctionLedgerV275`

### Test da ripetere dopo modifiche al Listone

1. Aprire `Admin -> Converti listone Excel`.
2. Caricare un Excel Classic a foglio singolo.
3. Verificare che il conteggio giocatori sia maggiore di zero.
4. Verificare che le squadre siano salvate/mostrate con codice canonico a tre lettere.
5. Aprire la sezione pubblica `Listone`.
6. Abilitare la colonna `Modifica` nei campi visibili.
7. Verificare assenza di falsi cambi squadra di massa.
8. Cercare un giocatore presente in altri listoni.
9. Verificare la sezione storica e gli eventuali usciti.

## Funzionalita da non perdere

Non rimuovere senza test mirato:

- `assets/js/admin/listone-converter.js`.
- La colonna `Modifica` del Listone.
- Il filtro/controllo `Mostra usciti storici`.
- La ricerca storica negli altri listoni.
- La normalizzazione codici squadra V274.
- I documenti `docs/zonaorientale/listoni/LISTONE_TEST_REALE_V273.md` e `docs/zonaorientale/listoni/LISTONE_CODICI_SQUADRA_V274.md`.

## Prossime verifiche consigliate

- Verificare un secondo Excel reale futuro per confermare che la normalizzazione squadra resta corretta.
- Verificare eventuali omonimie tra giocatori usando identificativo Fantacalcio `#` come chiave primaria.
- Decidere se portare queste informazioni nel file principale `FUNZIONALITA'.md` quando richiesto esplicitamente.

---
