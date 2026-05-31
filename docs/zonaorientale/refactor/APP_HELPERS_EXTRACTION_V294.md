# V294 - Estrazione minima helper puri da app.js

## Obiettivo

V294 avvia il refactor prudente di `assets/app.js` introducendo un modulo piccolo e isolato di helper puri:

```text
static/zonaorientale/assets/js/utils/shared-helpers-v294.js
```

Questa release non sposta ancora call-site funzionali storici e non cambia comportamento visibile. Il modulo viene importato da `assets/app.js`, esposto in diagnostica runtime e verificato con uno smoke test leggero.

## Funzionalita a rischio e preservazione

### Funzionalita che rischiamo di perdere in un refactor JS

- Listone pubblico: colonna `Modifica`, filtro `Modifiche`, usciti storici, export CSV.
- Rose pubbliche e pagina squadra: tabella rosa, prima colonna sticky e link giocatore.
- Dashboard Presidente: rosa, trattative, comunicati, svincoli e notifiche.
- Admin: Richieste presidenti, Diagnostica dati, Converti listone Excel, workflow pubblicazione.
- News e link WhatsApp dinamico `/zonaorientale/share/news/<id>`.
- Competizioni, `competition.html`, Archivio, Statistiche e Confronta.
- Mobile: bottom nav, menu Altro e pulsante globale `Su`.
- Tema Dark unico introdotto in V289.

### Come V294 le preserva

- Nessuna funzione storica viene rimossa da `app.js`.
- Nessun call-site critico viene riscritto per usare il nuovo modulo.
- Nessuna logica Firebase/Auth/Admin viene spostata.
- Nessun dato JSON o snapshot viene modificato.
- Gli helper V294 sono puri e non dipendono da DOM, Firebase o stato globale.
- Il nuovo modulo e' caricato con cache-buster `?v=294` e ha diagnostica autonoma.

## Helper esposti

`window.ZonaOrientaleSharedHelpersV294` espone:

```text
normalizeWhitespace
normalizeSearchKey
slugifyText
toFiniteNumber
formatSignedNumber
csvEscape
rowsToCsv
uniqueByKey
runSmokeTest
```

## Diagnostica runtime

```js
window.ZonaOrientaleSharedHelpersV294
window.ZonaOrientaleSharedHelpersV294.runSmokeTest()
window.ZonaOrientaleAppHelpersExtractionV294
```

Atteso:

```js
window.ZonaOrientaleAppHelpersExtractionV294.behaviorChange === false
window.ZonaOrientaleAppHelpersExtractionV294.smokeTest.ok === true
```

## Test obbligatori

```bash
static/zonaorientale/tools/check-zonaorientale.sh
```

Test manuali minimi:

- Home pubblica.
- Listone: filtro `Modifiche`, `Mostra usciti storici`, export CSV.
- Pagina squadra -> Rosa.
- Dashboard Presidente.
- Admin -> Richieste presidenti.
- Admin -> Diagnostica dati.
- Admin -> Converti listone Excel.
- Mobile: bottom nav, menu Altro e pulsante Su.
- `competition.html` e `player.html`.

## Prossimo passo consigliato

V295 puo' iniziare a sostituire un solo helper realmente usato, per esempio un helper CSV o di normalizzazione testuale, ma solo dopo grep dei call-site e test browser delle funzionalita collegate.
