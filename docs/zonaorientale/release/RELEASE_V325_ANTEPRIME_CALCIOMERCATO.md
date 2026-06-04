# Release V325 - Anteprime Calciomercato complete e fallback fonte

## Obiettivo

V325 corregge tre aspetti urgenti della sezione Calciomercato senza toccare feed, archivio JSON, Fantamercato interno o altre sezioni del sito.

## Modifiche applicate

- Le descrizioni delle schede articolo non vengono piu' limitate a una larghezza ridotta e non vengono piu' nascoste su mobile.
- La sottosezione `Giocatori/Allenatori` e' rimossa dalla visualizzazione delle schede articolo.
- Gli articoli caricati da archivio statico `assets/calciomercato/archive/` senza immagine propria mostrano ora una tile immagine della fonte.

## Dettagli implementativi

- `renderCalciomercatoArticleCardV306` usa `getCalciomercatoArticleImageInfoV325` per scegliere l'immagine.
- Il fallback immagine viene applicato solo agli articoli statici, riconosciuti tramite `archiveDay`, `archiveSourceMode` o mode/sourceMode statico.
- Il fallback e' un SVG data URI generato localmente con il nome della fonte, quindi non richiede file esterni e non modifica i JSON.
- Le funzioni per riconoscimento giocatori restano nel runtime per preservare ricerca e diagnostica, ma non generano piu' la sottosezione visiva nella card.
- Aggiornati cache-buster e footer a V325.

## Funzionalita a rischio

- Card Calciomercato pubbliche.
- Layout mobile compatto V319.
- Archivio statico giornaliero V323/V324.
- Feed RSS automatico V309/V313/V320.
- Filtri Squadre/Topic/Fonti, ricerca libera e range Da/A.
- Diagnostica archivio Admin V324.

## Come vengono preservate

- Nessuna modifica alla Netlify Function `calciomercato-feed.js`.
- Nessuna modifica ai JSON statici gia' committati.
- Nessuna modifica a `assets/calciomercato/links.json`.
- Nessuna modifica a Firebase, EmailJS, Listone, Rose, Dashboard Presidente, Admin generale o pagine standalone.
- Nessuna cancellazione di CSS o funzioni legacy V306/V319/V320; vengono solo disattivati dalla card i chip `Giocatori/Allenatori`.

## Test manuali consigliati

1. Aprire Calciomercato da desktop.
2. Controllare che le descrizioni riempiano la card e vadano a capo piu' tardi.
3. Ridurre la viewport a mobile e verificare che le descrizioni restino visibili.
4. Verificare che `Giocatori/Allenatori` non appaia piu' nelle card.
5. Usare un range con articoli statici e verificare la tile fonte sugli articoli senza immagine.
6. Verificare che gli articoli live con immagini proprie continuino a mostrare l'immagine originale.
7. Testare filtri, ricerca, range Da/A e caricamento articoli piu' vecchi.
8. Login Admin: verificare che il box diagnostica archivio V324 continui a funzionare.
