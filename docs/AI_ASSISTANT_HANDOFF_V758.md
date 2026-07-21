# AI Assistant Handoff V758

## Stato

Overlay emergenziale per ZonaOrientale: il sito non caricava i dati da mobile dopo rimozione preloader. La causa probabile è l'attesa di Firebase/Auth o snapshot pubblici live. V758 forza il caricamento statico immediato dagli snapshot locali.

## File chiave

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/snapshots/seasons/2026-2027.json`
- `static/zonaorientale/assets/league-config.json`

## Funzionamento V758

Prima dello startup finale viene installato `zonaOrientaleStaticDataEmergencyV758`:

- override di `loadDataForCurrentAuthV100` per utenti non admin: usa sempre static snapshot.
- per admin: prova live con timeout 3200 ms, poi fallback statico.
- override di `loadData`.
- bootstrap indipendente dentro `initializeAppUi`, così il sito si renderizza anche se `onAuthStateChanged` non risponde.
- comando debug: `window.forceStaticDataV758()`.

## Note importanti

- Il boot loader resta rimosso dagli overlay precedenti.
- Gli svincoli completi sono inclusi nello snapshot 2026-2027 e riparati anche runtime se arrivano generici.
- Non toccare ioSudo in questa patch.
- Se dopo deploy il sito non mostra V758, controllare che `index.html` pubblichi davvero `app.js?v=758` e che Netlify stia pubblicando il branch/cartella corretta.
