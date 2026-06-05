# TEST_MANUALE_COMPLETO_V355

Versione: V355  
Scopo: checklist manuale da eseguire prima di altri cleanup/refactor.

## Avvio locale

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire il sito locale e svuotare cache se necessario.

## 1. Smoke statico

```bash
static/zonaorientale/tools/audit-regression-smoke-v355.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```

## 2. Console browser

```js
window.ZonaOrientaleRegressionSmokeSuiteV355.runSmokeTest()
```

Esito atteso: `ok: true`.

## 3. Calciomercato

- Aprire sezione Calciomercato.
- Verificare caricamento articoli.
- Provare ricerca testuale.
- Provare range Da/A.
- Provare filtri squadra/fonte/topic.
- Verificare card compatte.
- Verificare immagini/fallback TMW.
- Cliccare tag giocatore.
- Chiudere modal con X, sfondo, Escape.
- Espandere/Ridurre Solo Admin.

## 4. Listone

- Aprire Listone.
- Verificare filtro Modifiche.
- Verificare stile label/select.
- Se admin, provare export CSV modifiche.

## 5. Admin

- Aprire Area Admin.
- Aprire Diagnostica dati.
- Premere Aggiorna diagnostica.
- Verificare data/ora italiana aggiornata.
- Verificare Richieste presidenti e Converti listone.

## 6. Fantamercato e notifiche trade

Da console come presidente approvato:

```js
ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()
```

Poi cliccare Accetta/Rifiuta sulla card simulata.

Esito atteso:

- badge/notifica visibile;
- nessun errore `Missing or Insufficient permissions`;
- azione gestita localmente.

Pulizia:

```js
ZonaOrientaleTradeSimulatorV255.clearLocalSimulations()
```

## 7. Mobile

- Emulatore mobile o smartphone.
- Verificare bottom nav.
- Verificare menu Altro e icone.
- Verificare Calciomercato card compatte.
- Verificare Listone e Rose leggibili.

## 8. Pagine dettaglio

- Aprire `competition.html` da una competizione.
- Aprire `player.html` da un giocatore.
- Verificare mobile chrome.

## Esito

Annotare eventuali regressioni prima di procedere a V356 o a nuove rimozioni.

