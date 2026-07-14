# ioSudo V645 - performance GIOCATORI e fantasy squadra nel XI

Overlay conservativo successivo a V644. Non modifica i dati Sudatori, listoni, rose, ufficialita o informazioni applicative gia presenti: cambia solo la shell ioSudo.

## Modifiche

- La vista globale `GIOCATORI` usa ora una cache in memoria (`playerRowsCache`) per evitare di ricostruire l'elenco aggregato a ogni render.
- La ricerca testuale sui giocatori usa un indice precompilato per ogni riga (`_iosudoPlayerSearchText`).
- L'input di ricerca usa un debounce leggero tramite `scheduleRenderResults`, evitando ricalcoli a ogni singolo tasto su mobile.
- La sezione `XI` mostra, dentro la casella del giocatore in campo, la fantasy squadra quando il giocatore e agganciato alle rose live della lega o quando il dato e presente nella riga di formazione.
- Aggiornati cache-buster, service worker e riferimenti shell a `iosudo-app-v645`.

## Nota operativa

V645 non aggiorna `sudatori-data.json`: deve essere applicato sopra V644 o sopra un master che contiene gia il dataset V644.
