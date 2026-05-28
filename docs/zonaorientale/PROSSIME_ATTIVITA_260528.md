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
