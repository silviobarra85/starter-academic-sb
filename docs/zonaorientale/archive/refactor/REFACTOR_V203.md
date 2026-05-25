# V203 - Sync stato pubblicazione e palmarès

## Obiettivo

Correggere la discrepanza tra:

- pannello `Stato Firebase / JSON`, che poteva mostrare risultati vecchi `Failed to fetch`;
- tabella `Controllo pre-online asset pubblici`, che invece mostrava correttamente i JSON statici presenti.

## Modifiche

- Aggiornata la versione footer/cache-buster a `V203`.
- La checklist online finale ora si aspetta `203`.
- Il bottone `Controlla solo asset pubblici`, quando usato dentro `Stato Firebase / JSON`, sincronizza anche i semafori del pannello.
- Aggiunto helper console `ZonaOrientalePublicationStatus.syncFromPreflight()`.
- Aggiunto helper console `ZonaOrientalePublicationStatus.reset()` per cancellare stati locali vecchi.
- Migliorata la dicitura del controllo `honor.json`: se `palmares` è vuoto ma `honorRows` esiste, il report mostra che il palmarès è calcolabile dall'albo invece di far sembrare il dato mancante.

## Note operative

`22 albo · 0 palmarès · 16 ranking` non indicava necessariamente un errore applicativo. Significava che `honor.json` conteneva:

- 22 righe di albo;
- nessun array dedicato `palmares`;
- 16 righe di ranking FIFA.

Il palmarès può essere calcolato dalle righe dell'albo quando manca l'array dedicato.

## Test

- `node --check static/zonaorientale/assets/app.js`
