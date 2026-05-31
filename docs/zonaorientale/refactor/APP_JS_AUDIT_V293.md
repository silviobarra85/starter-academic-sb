# V293 - Audit mirato app.js

Data: 31/05/2026  
Versione runtime: **V293 audit mirato app.js**

## Scopo

Questa release non modifica il comportamento del sito e non estrae ancora codice da `assets/app.js`.

Lo scopo e' mappare le aree piu' delicate prima di un futuro refactor JS, evitando che modifiche progressive stacchino funzionalita gia' presenti.

## Stato numerico del file

Checkpoint analizzato:

```text
assets/app.js: 23.366 righe
import statici: 37
funzioni dichiarate con function: circa 884
diagnostiche window.ZonaOrientale*: circa 55
```

Il file e' un bundle storico stratificato: contiene bootstrap iniziale, override Vxx successivi, fallback legacy, moduli installati e diagnostiche runtime.

## Funzionalita a rischio da preservare

Ogni refactor JS futuro deve verificare esplicitamente queste aree:

### Pubblico

- Home e dashboard stagione.
- News e link WhatsApp dinamici `/zonaorientale/share/news/<id>`.
- Listone con colonna `Modifica`, filtro `Modifiche`, `Mostra usciti storici` ed export CSV.
- Rose pubbliche, pagina squadra e saldi/movimenti.
- Competizioni, classifica completa campionato e `competition.html`.
- Archivio, Statistiche e Confronta.
- Bottom navigation mobile, menu Altro e pulsante Su.

### Presidente

- Login e riconoscimento presidente approvato.
- Dashboard Presidente.
- Comunicati squadra e comunicati avvenuto scambio.
- `Svincola Giocatori` con EmailJS senza scrittura Firebase.
- Trattative inviate/ricevute e badge notifiche.
- Lettura esiti trattative sincronizzabile con Firebase Rules V257 quando pubblicate.

### Admin

- Accetta utenti stabile anti-duplicati.
- Richieste presidenti: aggiorna, approva, rifiuta, elimina da Firebase.
- Generatore comunicati automatici.
- Workflow pubblicazione Admin inline.
- Diagnostica dati Admin.
- Converti listone Excel storico/Classic.
- Snapshot pubblici, backup, competizioni, rose, albo, FIFA ranking e stadi.

### Infrastruttura/UI

- Dark mode unico V289 e toggle tema nascosto.
- CSS refactor V291/V292 caricato in ordine corretto.
- Pagine standalone `competition.html` e `player.html`.
- Cache-buster e `DEPLOY_EXPECTED_VERSION_V181` allineati.

## Aree da non toccare nel primo refactor JS

Non spostare ancora:

```text
renderAll e override renderAllVxx
bootstrap/initializeAppUi
setupAuth e onAuthStateChanged
Firebase/Auth/Admin
Dashboard Presidente e trattative
Listone pubblico completo
Convertitore listone Admin
Archivio/Statistiche/Confronta
workflow pubblicazione Admin
News share WhatsApp
```

Motivo: queste aree hanno override successivi, dipendenze globali e fallback storici. Una rimozione apparentemente piccola potrebbe staccare funzioni ancora vive.

## Candidati sicuri per una futura V294

Possibili estrazioni, solo dopo grep e test browser:

```text
helper di normalizzazione testo
escape HTML e sanitizzazione semplice
helper data/numero senza DOM
helper download CSV/export
costanti o diagnostiche runtime non bloccanti
utility pure senza accesso diretto a state, Firebase o DOM complesso
```

Regola: ogni funzione estratta deve mantenere un alias/fallback se esistono chiamate storiche nel file principale.

## Procedura obbligatoria prima di estrarre codice da app.js

1. Cercare tutti gli usi con `grep`.
2. Verificare se la funzione viene sovrascritta da versioni Vxx successive.
3. Verificare se e' richiamata da listener/eventi installati dopo il bootstrap.
4. Estrarre una sola famiglia di helper per release.
5. Lasciare alias compatibili quando necessario.
6. Eseguire test automatici e manuali.
7. Aggiornare handoff, changelog, regression tests e script pre-push.

## Test minimi richiesti dopo ogni refactor JS

```bash
static/zonaorientale/tools/check-zonaorientale.sh
```

Test manuali:

```text
Home pubblica
News e link WhatsApp
Listone: Modifica, filtro Modifiche, usciti storici, export CSV
Rose e pagina squadra
Competizioni e competition.html
Archivio, Statistiche, Confronta
Dashboard Presidente: rose, comunicati, trattative
Admin: Richieste presidenti, Diagnostica dati, Converti listone Excel
Mobile: bottom nav, menu Altro, pulsante Su
player.html
```

## Diagnostica runtime

```js
window.ZonaOrientaleAppJsAuditV293
```

Valori attesi:

```text
version: V293
behaviorChange: false
document: docs/zonaorientale/refactor/APP_JS_AUDIT_V293.md
```

## Decisione operativa

Il prossimo refactor consigliato e' una V294 molto piccola, dedicata solo a helper puri e non collegati a Firebase o render complessi. Evitare refactor ampi di `app.js` finche' non esiste una copertura manuale stabile delle funzionalita critiche.
