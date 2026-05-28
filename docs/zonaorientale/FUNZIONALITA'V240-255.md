# FUNZIONALITA' V240-255

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

