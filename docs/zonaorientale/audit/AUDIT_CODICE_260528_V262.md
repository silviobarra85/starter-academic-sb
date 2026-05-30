# Audit codice ZonaOrientale - V262

Documento creato sul branch `refactor/260528-zonaorientale-next` dopo la V261.

Obiettivo: fotografare lo stato del codice e indicare pulizie/refactor utili senza perdere funzionalita'. Questo documento non sostituisce `FUNZIONALITA'.md` e non lo modifica.

## Stato tecnico sintetico

Baseline analizzata: codice e documentazione allegati dopo V261.

Risultati principali:

- `assets/app.js`: circa 21.251 righe.
- `assets/styles.css`: circa 13.678 righe.
- JS principale sintatticamente valido con `node --check assets/app.js`.
- JSON pubblici validi: 33 file controllati.
- La funzionalita' V261 `Svincola Giocatori` e' presente in `Dashboard Presidente` e usa EmailJS senza scrivere su Firebase.

## Pulizie sicure individuate

### 1. File macOS da rimuovere dalla repo

Sono presenti file/metadati non necessari:

```text
.DS_Store
assets/.DS_Store
assets/css/.DS_Store
assets/js/.DS_Store
assets/snapshots/.DS_Store
assets/competitions/.DS_Store
__MACOSX/
```

V262 aggiunge `static/zonaorientale/.gitignore` per prevenirne il ritorno.

### 2. Simulatore trattative duplicato

Sono presenti due copie identiche del simulatore V255:

```text
assets/js/dev/trade-notification-simulator-v255.js
assets/js/trade-notification-simulator-v255.js
```

La copia attiva e importata da `app.js` e':

```text
assets/js/dev/trade-notification-simulator-v255.js
```

La copia nella root `assets/js/trade-notification-simulator-v255.js` e' un duplicato non importato ed e' candidata a rimozione.

### 3. Simulatore V254 non piu' importato

```text
assets/js/dev/trade-notification-simulator-v254.js
```

Non risulta importato. V255 espone comunque l'alias:

```js
window.ZonaOrientaleTradeSimulatorV254
```

quindi il file V254 e' candidato a rimozione controllata.

### 4. CSS mobile hotfix V166/V167

```text
assets/css/mobile-hotfix-v166.css
assets/css/mobile-hotfix-v167.css
```

Non risultano linkati dagli HTML. Le correzioni sono gia' inglobate in:

```text
assets/css/mobile-suite-v168.css
```

Sono candidati a rimozione, previa verifica mobile.

## File da NON rimuovere senza verifica ulteriore

### `assets/js/refactor/admin-publication-workflow-v213.js`

Modulo non importato direttamente, ma collegato storicamente al workflow pubblicazione Admin. La funzionalita' oggi vive inline in `app.js` ed e' stata consolidata in V251. Prima di rimuovere questo file conviene archiviare una nota o confermare che non serva come riferimento.

### `assets/js/domain/competitions.js`

Non risulta importato dalla baseline analizzata, ma riguarda un dominio centrale. Va verificato prima di qualsiasi cancellazione.

### Fallback inline `Admin -> Richieste presidenti`

Dopo V253 esiste il modulo:

```text
assets/js/admin/team-requests-panel-v253.js
```

Il vecchio blocco inline V249 resta come fallback intenzionale. Va rimosso solo dopo un ciclo completo di test Admin.

## Refactor consigliati successivi

1. **V263 - Pulizia fisica file sicuri**
   - Rimuovere `.DS_Store`, `__MACOSX`, duplicato simulatore V255 root, simulatore V254 non importato, CSS hotfix V166/V167 se test mobile ok.

2. **V264 - Consolidare Dashboard Presidente**
   - Estrarre i tre flussi comunicati in moduli separati:
     - comunicato squadra;
     - comunicato avvenuto scambio;
     - svincola giocatori.

3. **V265 - Storico svincoli opzionale**
   - Valutare se salvare in Firebase uno storico delle informative svincolo inviate, oltre alla mail.

4. **V266 - Ridurre fallback legacy**
   - Dopo test, eliminare fallback inline V249 e vecchi handler V50/V79 ormai neutralizzati.

5. **V267 - Audit competizioni**
   - Verificare `domain/competitions.js` e decidere se riattivarlo, fonderlo in app o rimuoverlo.

## Comandi di pulizia consigliati per V263

Da eseguire solo quando si decide di fare la pulizia fisica:

```bash
git rm --ignore-unmatch static/zonaorientale/assets/js/trade-notification-simulator-v255.js
git rm --ignore-unmatch static/zonaorientale/assets/js/dev/trade-notification-simulator-v254.js
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v166.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v167.css
find static/zonaorientale -name ".DS_Store" -delete
rm -rf static/zonaorientale/__MACOSX __MACOSX
```

Poi verificare:

```bash
node --check static/zonaorientale/assets/app.js
```

## Nota funzionale

Dall'audit non emerge perdita evidente di funzionalita' rispetto alle ultime modifiche. Le aree piu' delicate restano:

- comunicati presidente e flussi EmailJS;
- `Admin -> Richieste presidenti`;
- notifiche trattative multi-dispositivo;
- anteprime WhatsApp news/home;
- nuova informativa `Svincola Giocatori`.
