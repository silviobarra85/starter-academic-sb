# FUNZIONALITA' V256-262 - ZonaOrientale Salerno

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

