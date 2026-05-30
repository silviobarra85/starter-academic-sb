# Istruzioni per nuovo assistente - ZonaOrientale 260528

Documento aggiornato in **V267** per permettere a un nuovo assistente AI di ripartire dal punto esatto raggiunto nello sviluppo del sito del fantacalcio **ZonaOrientale Salerno**.

## 1. Contesto generale

Repo reale:

```text
starter-academic-sb
```

Webapp:

```text
static/zonaorientale/
```

Documentazione:

```text
docs/zonaorientale/
```

Branch corrente della nuova fase:

```text
refactor/260528-zonaorientale-next
```

Versione runtime corrente dopo questo overlay:

```text
V267 audit competizioni
```

## 2. Regole operative obbligatorie

1. Consegnare sempre un solo zip overlay.
2. Lo zip deve contenere le radici:

```text
zonaorientale/
docs/
```

3. Nella repo, copiare:

```text
zonaorientale/ -> static/zonaorientale/
docs/ -> docs/
```

4. Dopo ogni modifica a codice o UI aggiornare sempre:

```text
footer Version negli HTML
cache-buster ?v=...
DEPLOY_EXPECTED_VERSION_V181 in assets/app.js
AI_HANDOFF_ZONAORIENTALE_CURRENT.md
CHANGELOG_CONSOLIDATO.md
README/ROADMAP/OPERATIVITA/REGRESSION_TESTS se necessario
```

5. Il documento principale delle funzionalita e' protetto:

```text
docs/zonaorientale/FUNZIONALITA'.md
```

Va modificato solo se l'utente lo chiede esplicitamente. Per nuove funzioni incrementali, usare documenti separati come:

```text
FUNZIONALITA'V240-255.md
FUNZIONALITA'V256-262.md
```

6. Non eliminare codice legacy senza audit e test. Questo progetto ha molte patch storiche Vxx: una funzione apparentemente vecchia puo essere ancora agganciata a UI o fallback.

## 3. File da passare a un nuovo assistente

Chiedere sempre all'utente gli zip aggiornati:

```text
zonaorientale.zip
docs.zip
```

Se si lavora su Firebase Rules, chiedere anche:

```text
docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules
docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules
```

File da leggere subito:

```text
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md
docs/zonaorientale/PROSSIME_ATTIVITA_260528.md
docs/zonaorientale/REGRESSION_TESTS.md
docs/zonaorientale/FUNZIONALITA'.md
docs/zonaorientale/FUNZIONALITA'V240-255.md
docs/zonaorientale/FUNZIONALITA'V256-262.md
docs/zonaorientale/AUDIT_COMPETIZIONI_V267.md
```

## 4. Comandi locali standard

Dalla repo:

```bash
cd starter-academic-sb
cd static/zonaorientale
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

## 5. Comandi Git branch corrente

```bash
cd starter-academic-sb
git checkout refactor/260528-zonaorientale-next
git pull origin refactor/260528-zonaorientale-next
```

Applicazione overlay:

```bash
mkdir -p /tmp/zo_overlay
unzip ~/Downloads/NOME_OVERLAY.zip -d /tmp/zo_overlay
rsync -av /tmp/zo_overlay/zonaorientale/ static/zonaorientale/
rsync -av /tmp/zo_overlay/docs/ docs/
```

Commit:

```bash
git status
git add <file modificati>
git commit -m "tipo: descrizione"
git push origin refactor/260528-zonaorientale-next
```

Merge futuro su master solo dopo test completi:

```bash
git checkout master
git pull origin master
git merge --no-ff refactor/260528-zonaorientale-next -m "merge: integra aggiornamenti zonaorientale 260528"
git push origin master
```

## 6. Funzioni recenti da non perdere

### Comunicati presidente

Flusso canonico comunicato avvenuto scambio:

```text
Presidente -> Dashboard Presidente -> Comunicato avvenuto scambio
-> teamRequests type TRANSFER_NEWS
-> EmailJS immediata a caparrotti86@yahoo.it
-> Admin approva in Richieste presidenti
-> pubblicazione in News
```

Non deve tornare il vecchio flusso presidente -> scrittura diretta in `news`.

### Svincola Giocatori

Aggiunto in V261 in Dashboard Presidente.

```text
Presidente -> Svincola Giocatori
-> selezione multipla dalla rosa
-> quotazione da listone piu recente disponibile
-> email EmailJS a caparrotti86@yahoo.it
```

Non scrive su Firebase e non crea richiesta Admin.

### Trattative e notifiche

Badge e notifiche derivano da `transferNegotiations`. Da V257, se le Firebase Rules sono pubblicate, la lettura esito e' sincronizzabile tra dispositivi. Fallback: localStorage.

Comandi test console:

```js
ZonaOrientaleTradeSimulatorV255.help()
await ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()
```

### Admin -> Richieste presidenti

Funzioni da preservare:

```text
Aggiorna richieste
Approva
Rifiuta
Elimina da Firebase per comunicati APPROVED/ACCEPTED/REJECTED
```

Il pulsante elimina solo `teamRequests/{id}`, non cancella news gia pubblicate.

### Admin -> Comunicati

Generatore comunicati automatici ripristinato in V250. Deve solo generare/copiare/inserire bozze nel form Comunicati, senza scrivere direttamente su Firebase.

### News / anteprime WhatsApp

Home: meta generici.
News: anteprime specifiche solo tramite:

```text
/zonaorientale/share/news/<id>
```

Il pulsante `Apri preview` e' stato rimosso; resta `Copia link WhatsApp`.

### EmailJS

V266 ha normalizzato oggetti, footer, `from_name` logico e `reply_to`. La deliverability reale dipende da configurazione EmailJS/provider/DNS SPF-DKIM-DMARC.

## 7. Stato audit V267 competizioni

V267 non rimuove nulla. Documenta che:

```text
assets/js/domain/competitions.js
```

sembra un modulo legacy/scollegato, ma non va eliminato senza test di:

```text
Dashboard pubblica
Sezione Competizioni
competition.html
Archivio stagioni
Admin -> Competizioni
Albo/Statistiche collegate
```

Diagnostica:

```js
window.ZonaOrientaleCompetitionsAuditV267
```

## 8. Cose da evitare

Non eliminare senza audit:

```text
assets/js/domain/competitions.js
assets/js/refactor/admin-publication-workflow-v213.js
news.html
comunicati/*.html
vecchi fallback inline di Richieste presidenti
resti legacy V50/V79 dei comunicati scambio
```

Non modificare `FUNZIONALITA'.md` salvo richiesta esplicita dell'utente.

## 9. Quando l'utente segnala un bug

Chiedere sempre:

```text
versione footer visibile
sezione esatta
ruolo: pubblico/presidente/admin
browser/dispositivo
output DevTools console
se Firebase/EmailJS e' coinvolto
```

Poi proporre overlay piccolo, testabile e con comandi Git.
