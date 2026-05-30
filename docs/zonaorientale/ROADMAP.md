# Aggiornamento V266 - Email deliverability EmailJS

V266 rende piu' pulite e coerenti le mail operative inviate via EmailJS: aggiunge parametri comuni di mittente logico (`Lega ZonaOrientale Salerno`), Reply-To dell'utente loggato quando disponibile, oggetti piu' sobri e firma standard del gestionale. I flussi aggiornati sono: comunicato avvenuto scambio e informativa svincolo giocatori. Non modifica `FUNZIONALITA'.md`. Diagnostica: `window.ZonaOrientaleEmailJsDeliverabilityV266`.

# Aggiornamento V265 - Pulizia asset sicuri

V265 e' una pulizia fisica controllata: rimuove dai comandi di release i duplicati/inutilizzati sicuri gia' identificati nell'audit, mantiene come canonico il simulatore trattative `assets/js/dev/trade-notification-simulator-v255.js` e aggiunge/rafforza `.gitignore` per impedire il ritorno di file macOS. Non modifica `FUNZIONALITA'.md` e non cambia comportamento runtime. Diagnostica: `window.ZonaOrientaleCleanupV265`.

# Aggiornamento V263 - Funzionalita V256-262

V263 aggiunge `FUNZIONALITA'V256-262.md`, registro incrementale delle funzionalita introdotte o consolidate tra V256 e V262. Non modifica `FUNZIONALITA'.md` e non cambia il comportamento runtime. Diagnostica: `window.ZonaOrientaleFeaturesDocV263`.

# Aggiornamento V262 - Audit pulizia codice

V262 aggiunge `AUDIT_CODICE_260528_V262.md` e una `.gitignore` locale in `static/zonaorientale/`. Non cambia funzionalita': fotografa file duplicati/non importati, file macOS e candidati a pulizia controllata. Diagnostica runtime: `window.ZonaOrientaleAuditV262`.

## Nota V261 - Svincolo giocatori presidente

Aggiunta funzionalita presidente `Svincola Giocatori` con invio email EmailJS e quotazioni da listone recente. Prossimo miglioramento possibile: decidere se registrare anche uno storico in Firebase/Admin oppure mantenere il flusso solo email.

## Nota V257 - Rules notifiche trattative

V257 chiude il punto notifiche trattative multi-dispositivo: la lettura dell'esito viene salvata in Firebase quando le rules deployate consentono l'update controllato dei campi `outcomeSeen...`.

# Roadmap ZonaOrientale

Documento consolidato dalle vecchie note sulle nuove funzionalita.


## Roadmap refactor codice

Percorso consigliato dopo V219/V220:

```text
V220 safety refactor mobile chrome - fatto
V221 separazione public/admin rendering - fatto
V222 data repository unico per JSON/Firebase - fatto
V223 CSS cleanup progressivo - fatto
V224 hardening statistiche storiche + avvio rimozione legacy - fatto
V225 stabilizzazione finale post-refactor - fatto
V227 hotfix FM archivio - fatto
V249 richieste presidenti canoniche - fatto
V252 pulizia asset inutilizzati - fatto
V253 modulo richieste presidenti - fatto
V254 simulatore notifiche trattative - fatto
V255 comandi test trattative - fatto
V256 funzionalita V240-255 - fatto
V257 rules notifiche trattative - fatto
V261 svincolo giocatori presidente - fatto
```

Regola: ogni step deve preservare il comportamento visibile della versione precedente, salvo richiesta esplicita di nuova feature.

Nota V225: il primo ciclo refactor tecnico e' concluso. La rimozione legacy pesante resta un lavoro futuro separato e va fatta solo con test browser completi.

## Priorita alta

### 1. Avvisi post-modifica Admin

Dopo una modifica Admin, il sito dovrebbe indicare quali JSON scaricare e quali snapshot aggiornare.

Esempi:

```text
Hai modificato dati stagione: dopo Aggiorna tutto scarica overlay snapshot stagioni.
Hai modificato Albo/Palmares/FIFA: scarica anche honor.json.
```

### 2. Stato pubblicazione dati

Dashboard con semafori:

```text
Firebase aggiornato
Snapshot Firebase aggiornati
JSON statici aggiornati
Ultimo honor.json
Ultimo snapshot stagione
Ultima rosa statica
Ultimo listone
```

Obiettivo: evitare dubbi del tipo "ho aggiornato Firebase ma dopo refresh vedo vecchio?".

### 3. Procedura guidata Pubblica aggiornamenti

Un flusso Admin che guidi:

```text
1. Aggiorna snapshot Firebase
2. Scarica config pubblica
3. Scarica honor JSON
4. Scarica overlay snapshot stagioni
5. Controlla asset pubblici
6. Checklist online finale
```

Non puo fare push GitHub dal browser, ma puo produrre comandi e checklist.

## Funzioni per presidenti

### Dashboard Presidente piu ricca

Mostrare:

```text
saldo FM
numero giocatori in rosa
ultimi movimenti
prossime partite
risultati recenti
posizione competizioni
trattative aperte
giocatori sul mercato
```

### Storico rosa squadra

Confrontare rose statiche nel tempo:

```text
Rosa al 12/05
Rosa al 21/05
+ entrati
- usciti
variazione costo/saldo
```

### Scheda giocatore evoluta

Su `player.html` aggiungere:

```text
squadra attuale
storico squadre ZonaOrientale
movimenti FM
competizioni vinte
presenze in rose precedenti
valore/costo storico
```

### Timeline Fantamercato

Pagina con eventi:

```text
messa sul mercato
trattativa aperta
trattativa chiusa
movimento concluso
```

Filtri: tutte, mia squadra, trattative, movimenti conclusi.

## Funzioni pubbliche

### Home piu narrativa

Aggiungere blocchi:

```text
ultimo comunicato
classifica principale
prossime partite
ultimi risultati
miglior squadra del mese
ultimi movimenti mercato
campioni in carica
```

### Hall of Fame

Vista pubblica con:

```text
presidenti piu vincenti
squadre leggendarie
record storici
stagioni memorabili
ranking all-time
```

### Archivio stagioni migliorato

Ogni stagione dovrebbe avere accesso chiaro a:

```text
squadre
competizioni
classifiche
rose
albo
movimenti mercato
```

## Funzioni mobile

### Menu mobile piu app-like

Possibili miglioramenti:

```text
badge su Mercato se ci sono trattative
badge su Admin se ci sono azioni richieste
scorciatoie presidente
subnav contestuale per pagine lunghe
```

### Modalita solo presidente

Navigazione semplificata:

```text
La mia squadra
Mercato
Comunicati
Competizioni
Rose
```

## Funzioni tecniche utili

### Validatore JSON statici

Estendere `Controlla asset pubblici` con:

```text
config.json coerente con manifest stagioni
honor.json aggiornato dopo ultima modifica
rose manifest punta al file piu recente
nessun JSON mancante
nessuna stagione nel manifest senza file
nessun file orfano non presente nel manifest
```

### Storico modifiche Admin

Registrare in Firebase o sessione:

```text
data/ora
utente admin
tipo modifica
dati impattati
snapshot aggiornati
JSON da scaricare
```

### Backup guidato

Checklist:

```text
backup Firebase scaricato
backup static JSON scaricato
repo locale aggiornata
branch pushato
master aggiornato
```

## Ordine consigliato

1. Avvisi post-modifica Admin
2. Stato pubblicazione dati / semafori Firebase-JSON
3. Procedura guidata Pubblica aggiornamenti
4. Dashboard Presidente migliorata
5. Validatore JSON statici potenziato
6. Hall of Fame / statistiche storiche avanzate

## Stato refactor corrente

V239 completata: corretto il comunicato avvenuto scambio presidente con richiesta approvabile, pubblicazione Admin in News e invio EmailJS immediato. Restano consolidati il ciclo refactor V220-V225, hotfix statistiche V226, hotfix FM Archivio V227, account presidente in header V229 e preview WhatsApp comunicati dinamica tramite Netlify Function. Prossimo passo consigliato: test reale del flusso comunicati su Netlify e poi eventuale diagnostica Admin.


## Dopo V239

- Valutare un'immagine Open Graph dedicata ai comunicati invece dell'icona app generica.
- Verificare in produzione l'endpoint `/zonaorientale/share/news/<id>` dopo deploy Netlify.
- Aggiungere una diagnostica Admin che controlli comunicati senza ID, Firestore non leggibile dalla funzione o preview fallback.


V240 completata: corretto il sync live delle trattative presidente tra badge, dashboard desktop e mobile. Il documento `FUNZIONALITA'.md` non e' stato aggiornato perche' va modificato solo su richiesta esplicita.


V241 completata: stabilizzato il flusso Accetta utenti con rifiuto persistente, blocco rigenerazione pending e filtro duplicati gia approvati. Il documento `FUNZIONALITA'.md` non e' stato aggiornato perche' va modificato solo su richiesta esplicita.


V243 completata: consolidato il flusso comunicato avvenuto scambio e neutralizzati gli handler legacy V50/V79 per evitare doppio submit o scritture dirette in news. Prossimo refactor consigliato: notifiche trattative lette/non lette persistite in Firebase.


V246 completata: la lettura degli esiti trattative viene salvata in Firebase quando il presidente mittente apre la card della proposta conclusa, con `localStorage` solo come fallback. Il documento `FUNZIONALITA'.md` non e' stato aggiornato perche' va modificato solo su richiesta esplicita. Prossimi step consigliati: checklist regressioni e pulizia mirata degli handler legacy residui.


## Stato V247

Completata la checklist regressioni canonica in `REGRESSION_TESTS.md`. Prossimo step consigliato: pulizia mirata degli handler legacy residui piu' rischiosi, senza eliminare funzionalita visibili. `FUNZIONALITA'.md` non e' stato aggiornato perche' va modificato solo su richiesta esplicita.

## Stato V248

Conclusa la prima pulizia mirata degli handler legacy del comunicato avvenuto scambio. Prossimo step consigliato: test regressione completo e merge controllato del branch di refactor su `master`.

## Roadmap post V267

1. Test runtime completo della sezione Competizioni e di `competition.html`.
2. Decidere se `assets/js/domain/competitions.js` va riattivato come modulo canonico, lasciato legacy o rimosso.
3. Audit mirato di `assets/js/refactor/admin-publication-workflow-v213.js`.
4. Aggiornare il registro funzionalita incrementale se emergono nuove funzioni da V263 in poi.


## Roadmap post V268

- Aggiungere anteprima righe convertite nel convertitore listone.
- Valutare generazione overlay zip per listoni con manifest aggiornato.
- Continuare audit prudenti prima di rimuovere moduli legacy.


## V269 - Storico e confronto listoni

- Aggiunto confronto automatico tra listone selezionato e listone precedente della stessa stagione.
- Il convertitore listone arricchisce il JSON generato con campi `previous`, `diff`, `previousQuotationCurrent`, `quotationDiffFromPrevious`, `statusChange` e riepilogo `history`.
- La sezione pubblica `Listone` mostra un pannello `Storico listoni` con nuovi, usciti, variazioni quotazione e ricerca negli altri listoni.
- Il campo ricerca puo' trovare giocatori presenti in listoni passati anche quando non sono nel listone selezionato.
- Diagnostica: `window.ZonaOrientaleListoneHistoryV269`.
- Non sono state rimosse funzionalita' esistenti; il formato storico Tutti/Ceduti e il formato Classic a foglio singolo restano supportati.
