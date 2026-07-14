# AI Assistant Handoff V659

## Sintesi

V659 e un overlay solo sito, creato dopo V657. Non tocca ioSudo, dati, listoni, rose JSON, Firebase o EmailJS.

## Problema

Da smartphone le tabelle del Listone e della sezione Rose possono rallentare perche il sito crea molte righe HTML. V657 ha differito il rendering delle sezioni, ma una volta aperte Listone/Rose venivano ancora renderizzate molte righe.

## Soluzione

Su mobile:

- Listone viene renderizzato come card compatte;
- Movimenti/Rose viene renderizzato come card compatte;
- il dettaglio giocatori di una Rosa viene renderizzato come card compatte;
- le liste sono a blocchi progressivi;
- il click su `Mostra altre voci` mantiene la posizione di scroll;
- desktop resta tabellare.

## Vincoli preservati

- ioSudo non modificato;
- Per i SUDATORI pubblico resta disattivato;
- filtri Listone/Rose continuano a pilotare le card;
- nessuna modifica ai dati.
