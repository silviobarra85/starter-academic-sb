# Istruzioni per nuovo assistente - ZonaOrientale 260528

Documento creato in V258 per permettere a un nuovo assistente di ripartire dal punto esatto raggiunto nello sviluppo del sito del fantacalcio **ZonaOrientale Salerno**.

## 1. Contesto generale

Il progetto è nella repo GitHub/Hugo:

```text
starter-academic-sb
```

La webapp del fantacalcio è statica e vive in:

```text
static/zonaorientale/
```

La documentazione del progetto vive in:

```text
docs/zonaorientale/
```

Il sito è già online. L'utente chiede supporto per modifiche, refactor, correzioni e nuove funzionalità. L'utente vuole essere guidato per commit e push, soprattutto su `master`, ma per lavori di refactor importanti preferisce branch dedicati.

Versione runtime corrente dopo questo overlay:

```text
V258 handoff nuovo branch
```

Branch consigliato da aprire per la prossima fase:

```text
refactor/260528-zonaorientale-next
```

## 2. Regole operative da rispettare sempre

1. Quando si consegna una modifica al progetto, fornire **un solo file zip**.
2. Lo zip deve contenere le radici:

```text
zonaorientale/
docs/
```

3. Nella repo reale, `zonaorientale/` dello zip va copiato in:

```text
static/zonaorientale/
```

4. Nella repo reale, `docs/` dello zip va copiato in:

```text
docs/
```

5. Dopo ogni modifica a codice o UI aggiornare:

```text
footer Version negli HTML
cache-buster ?v=...
DEPLOY_EXPECTED_VERSION_V181 in assets/app.js
AI_HANDOFF_ZONAORIENTALE_CURRENT.md
CHANGELOG_CONSOLIDATO.md
README/ROADMAP/OPERATIVITA se utile
```

6. Il documento seguente è protetto e va modificato **solo quando l'utente lo chiede esplicitamente**:

```text
docs/zonaorientale/FUNZIONALITA'.md
```

7. Il documento seguente contiene solo le funzioni aggiunte/consolidate tra V240 e V255:

```text
docs/zonaorientale/FUNZIONALITA'V240-255.md
```

8. Non eliminare funzionalità durante refactor. Prima di rimuovere codice legacy, verificare se esiste ancora un percorso UI/runtime che lo usa.

## 3. File da chiedere/passare a un nuovo assistente

L'utente dovrebbe fornire sempre questi file o zip aggiornati:

```text
zonaorientale.zip
```

Contiene la webapp da `static/zonaorientale/`.

```text
docs.zip
```

Contiene la documentazione da `docs/zonaorientale/`.

Se si lavora su regole Firebase, passare anche il file rules più recente:

```text
docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules
```

e, se serve solo la patch notifiche:

```text
docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules
```

Per debug di errori runtime, chiedere all'utente:

```text
screenshot console DevTools
messaggio errore completo
browser/dispositivo usato
utente loggato: pubblico / presidente / admin
sezione e azione esatta
versione footer visibile
```

## 4. Comandi locali standard

Dalla repo:

```bash
cd starter-academic-sb
```

Per avviare il sito locale:

```bash
cd static/zonaorientale
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

## 5. Flusso Git standard

Per aprire il nuovo branch richiesto il 28/05/2026:

```bash
cd starter-academic-sb
git checkout master
git pull origin master
git checkout -b refactor/260528-zonaorientale-next
```

Per applicare uno zip overlay:

```bash
mkdir -p /tmp/zo_overlay
unzip ~/Downloads/NOME_OVERLAY.zip -d /tmp/zo_overlay
rsync -av /tmp/zo_overlay/zonaorientale/ static/zonaorientale/
rsync -av /tmp/zo_overlay/docs/ docs/
```

Per committare:

```bash
git status
git add <file modificati>
git commit -m "tipo: descrizione modifica"
git push origin refactor/260528-zonaorientale-next
```

Per merge futuro su master, solo dopo test:

```bash
git checkout master
git pull origin master
git merge --no-ff refactor/260528-zonaorientale-next -m "merge: integra aggiornamenti zonaorientale 260528"
git push origin master
```

## 6. Stato funzionale recente V240-V258

### Comunicati presidente

I presidenti hanno due tipi principali di comunicato:

```text
COMUNICATO SQUADRA
COMUNICATO AVVENUTO SCAMBIO
```

Il comunicato avvenuto scambio è stato ripristinato e consolidato nel ciclo V242-V248.

Flusso canonico attuale:

```text
Presidente
→ Dashboard Presidente
→ Comunicato avvenuto scambio
→ salvataggio in teamRequests con type TRANSFER_NEWS
→ invio immediato EmailJS a caparrotti86@yahoo.it
→ Admin approva in Richieste presidenti
→ pubblicazione in News
```

Non deve più esistere un vecchio flusso che scrive direttamente in `news` da presidente.

### Admin - Richieste presidenti

Consolidato in V249 e poi estratto parzialmente in modulo V253.

Funzioni da preservare:

```text
Aggiorna richieste
Approva comunicato/richiesta
Rifiuta comunicato/richiesta
Elimina da Firebase comunicati APPROVED / ACCEPTED / REJECTED
```

Il pulsante `Elimina da Firebase` elimina solo il documento in:

```text
teamRequests/{id}
```

Non cancella una news già pubblicata.

### Generatore comunicati automatici

Ripristinato in V250. Deve stare in Admin e deve solo generare/copiare/inserire bozze nel form Comunicati. Non deve scrivere direttamente in Firebase.

### Workflow pubblicazione Admin

V251 ha reso canonico il workflow inline già presente in `app.js`, evitando di ricollegare il vecchio modulo V213 esterno per non creare doppi listener.

### Notifiche trattative

Le trattative reali sono in:

```text
transferNegotiations
```

La notifica proposta ricevuta è calcolata da:

```text
toSeasonTeamId = squadra del presidente loggato
status = PENDING
```

La notifica esito per il mittente è calcolata da:

```text
fromSeasonTeamId = squadra del presidente loggato
status = ACCEPTED o REJECTED
campi outcomeSeen... non ancora valorizzati
```

V246 ha predisposto il salvataggio della lettura su Firebase. V257 ha aggiunto le rules necessarie.

## 7. Firebase Rules

Le rules correnti da usare sono:

```text
docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules
```

Nota importante: il deploy Netlify/GitHub non pubblica automaticamente le Firebase Rules, a meno che la repo non abbia una pipeline Firebase CLI configurata.

Dopo merge/deploy, pubblicare manualmente da Firebase Console o Firebase CLI.

Test atteso dopo deploy rules:

```text
Presidente A invia proposta a Presidente B
Presidente B approva/rifiuta
Presidente A vede badge esito
Presidente A apre la card da smartphone
Presidente A entra da desktop
Il badge non deve tornare
```

Se compare in console:

```text
Lettura esito trattativa salvata solo localmente
```

le rules non sono state pubblicate o non concedono il permesso previsto.

## 8. Comandi test notifiche trattative

Dopo login presidente, aprire DevTools -> Console.

Mostra guida:

```js
ZonaOrientaleTradeSimulatorV255.help()
```

Controlla contesto:

```js
ZonaOrientaleTradeSimulatorV255.getContext()
```

Smoke test locale completo:

```js
await ZonaOrientaleTradeSimulatorV255.runLocalSmokeTest()
```

Simula proposta ricevuta:

```js
ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()
```

Risolvi localmente proposta ricevuta:

```js
ZonaOrientaleTradeSimulatorV255.resolveLocalIncomingProposal("ACCEPTED")
```

oppure:

```js
ZonaOrientaleTradeSimulatorV255.resolveLocalIncomingProposal("REJECTED")
```

Simula esito su proposta inviata:

```js
ZonaOrientaleTradeSimulatorV255.simulateResolvedSentProposal({ status: "ACCEPTED" })
```

Marca esiti come letti:

```js
await ZonaOrientaleTradeSimulatorV255.markAllOutcomeSeen()
```

Pulisce simulazioni locali:

```js
ZonaOrientaleTradeSimulatorV255.clearLocalSimulations()
```

Test reale Firebase, da usare solo se si vuole scrivere davvero:

```js
await ZonaOrientaleTradeSimulatorV255.createFirebaseSentProposal({ confirm: true })
```

## 9. Diagnostiche runtime utili

```js
window.ZonaOrientaleTeamRequestsV253
window.ZonaOrientaleTradeSimulatorV255
window.ZonaOrientaleFirebaseRulesV257
window.ZonaOrientaleHandoffV258
```

Per versione/cache:

```js
window.checkDeployVersionV181 && window.checkDeployVersionV181()
```

## 10. Attenzione ai punti fragili

1. `assets/app.js` è ancora molto grande e stratificato.
2. Alcuni fallback legacy sono lasciati apposta per sicurezza.
3. Non rimuovere i fallback inline V249 finché il modulo V253 non è stato testato bene in produzione.
4. Non cancellare pagine statiche `comunicati/*.html` senza verificare se vecchi link WhatsApp le usano ancora.
5. Non modificare Firebase Rules senza confrontarle con il file attualmente pubblicato.
6. Non trasformare test/dev simulator in funzionalità visibile agli utenti.

## 11. Cosa chiedere all'utente prima di modifiche rischiose

Chiedere conferma solo per:

```text
rimozione definitiva di codice legacy
modifiche Firebase Rules
modifiche a FUNZIONALITA'.md
merge su master
cancellazione di asset/pagine storiche
```

Per fix piccoli o overlay richiesti esplicitamente, preparare direttamente lo zip e i comandi Git.
