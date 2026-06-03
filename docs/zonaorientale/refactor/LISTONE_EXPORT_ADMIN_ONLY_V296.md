# V296 - Export modifiche Listone solo Admin

## Obiettivo

Rendere il pulsante `Esporta modifiche CSV` del Listone disponibile solo agli utenti Admin, senza rimuovere le logiche di confronto gia' usate da colonna `Modifica`, filtro `Modifiche`, usciti storici e calcolo CSV.

## Modifica applicata

- Aggiunta guardia runtime `canExportListoneChangesCsvV296()` basata su `state.isAdmin`.
- Il pulsante `#listoneExportChangesV278` viene creato solo se l'utente corrente e' Admin.
- Se il pulsante fosse gia' presente e l'utente non e' Admin, `syncListoneChangeExportButtonV296()` lo rimuove.
- `exportListoneChangesCsvV278()` blocca anche eventuali invocazioni dirette da console per utenti non Admin.
- La diagnostica runtime e' disponibile in `window.ZonaOrientaleListoneExportAdminOnlyV296`.

## Funzionalita' a rischio e preservazione

### Rischio: Listone pubblico

Possibile rischio: nascondendo un pulsante nella barra filtri, si poteva alterare il montaggio dei controlli Listone.

Preservazione:

- Non vengono modificati `renderListonePublic`, `getFilteredListonePlayers`, `getSelectedListone`, filtri ruolo/stato/Modifiche o colonna `Modifica`.
- Il pulsante export viene gestito come controllo opzionale Admin.

### Rischio: export CSV modifiche

Possibile rischio: bloccare anche l'Admin o alterare il contenuto del CSV.

Preservazione:

- `buildListoneChangeExportRowsV278()` e `buildListoneChangeExportCsvV278()` restano invariati.
- L'helper CSV V295 resta collegato a `csvEscapeV278`.
- Viene aggiunta solo una guardia di autorizzazione prima del download.

### Rischio: funzioni storiche Listone V269-V278

Possibile rischio: rimuovere accidentalmente storico, usciti o calcolo modifiche.

Preservazione:

- Nessuna funzione storica e' stata rimossa.
- Restano attivi: `Modifica`, filtro `Modifiche`, `Mostra usciti storici`, normalizzazione squadre e funzioni di calcolo diff.

## Test consigliati

### Utente pubblico/non Admin

1. Aprire `Listone`.
2. Verificare che `Esporta modifiche CSV` non compaia.
3. Verificare che `Modifiche` e `Mostra usciti storici` continuino a funzionare.
4. In console verificare:

```js
window.ZonaOrientaleListoneExportAdminOnlyV296.canExport()
window.ZonaOrientaleListoneExportAdminOnlyV296.getButton()
```

Risultato atteso: `false` e `null`.

### Admin

1. Accedere come Admin.
2. Aprire `Listone`.
3. Verificare che `Esporta modifiche CSV` compaia.
4. Usare filtro `Modifiche` e scaricare CSV.
5. Verificare che il file mantenga colonne e righe attese.

## File toccati

- `assets/app.js`
- `index.html`
- `competition.html`
- `player.html`
- `tools/check-zonaorientale.sh`
- documentazione operativa e handoff.

## Note

Questa modifica non tocca Firebase, EmailJS, dati JSON, CSS, Rose, Dashboard Presidente o funzioni Admin diverse dal riconoscimento `state.isAdmin` gia' esistente.
