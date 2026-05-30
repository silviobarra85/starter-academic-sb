# Verifica funzionalita V272 - rischio perdita funzionalita

Data: 30/05/2026  
Branch: `refactor/260528-zonaorientale-next`  
Versione runtime: `V272 handoff e verifica pre-merge`

## Esito sintetico

Dal controllo statico sulla baseline allegata non risultano riferimenti mancanti negli HTML/import principali, e non risultano errori sintattici su `assets/app.js` o JSON pubblici.

Non risultano funzionalita perse in modo evidente rispetto alle modifiche V240-V271. Restano pero' aree legacy da non cancellare senza test mirato.

## Controlli eseguiti sul pacchetto allegato

```text
assets/app.js: node --check OK
assets/js/*.js: node --check OK
assets/**/*.json: parse OK
HTML src/href principali: nessun riferimento mancante rilevato
import JS relativi: nessun riferimento mancante rilevato
```

## Funzionalita recenti ancora da proteggere

### Comunicati presidente

- `Comunicato squadra`: resta flusso storico.
- `Comunicato avvenuto scambio`: deve restare flusso canonico presidente -> `teamRequests` -> EmailJS -> Admin approva -> News.
- `Svincola Giocatori`: deve restare solo email EmailJS, senza scrittura Firebase/Admin.

### Trattative/notifiche

- Badge proposta ricevuta finche' `status = PENDING`.
- Badge esito mittente finche' card non viene aperta.
- Lettura esito su Firebase con fallback localStorage.
- Simulatore test: `ZonaOrientaleTradeSimulatorV255.help()`.

### Listone

- Convertitore formato storico `Tutti/Ceduti`.
- Convertitore formato Classic `Lista calciatori`.
- Ricerca storica su altri listoni.
- Colonna opzionale `Modifica`.
- Righe `Uscito` con indicazione ultimo listone che conteneva il giocatore.

### Admin

- Richieste presidenti modulari V253 + fallback V249.
- Aggiorna richieste.
- Approva/rifiuta.
- Elimina da Firebase comunicati approvati/rifiutati.
- Generatore comunicati automatici.
- Workflow pubblicazione inline.

## Rischi residui

1. `domain/competitions.js` sembra potenzialmente legacy, ma le competizioni sono centrali: non eliminarlo senza test.
2. `admin-publication-workflow-v213.js` e' probabilmente scollegato, ma il workflow inline e' vivo: non eliminarlo senza audit dedicato.
3. File statici news/comunicati legacy possono servire per vecchi link WhatsApp.
4. Alcuni file duplicati/vecchi possono ancora essere presenti se la pulizia fisica V265 non e' stata applicata in repo.

## Funzionalita nuove da documentare nel registro principale, se richiesto

Non modificare `FUNZIONALITA'.md` senza richiesta esplicita. Se l'utente chiede aggiornamento del registro principale, includere almeno:

- Svincola Giocatori.
- Convertitore listone flessibile.
- Storico/confronto listoni.
- Colonna Modifica e usciti storici.
- Migliorie EmailJS/deliverability.
- Login senza Nome visualizzato e con logo Google.
