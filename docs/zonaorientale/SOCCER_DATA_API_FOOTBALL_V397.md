# V397 - Soccer Data API-Football diagnostica rose

Intervento mirato solo su Soccer Data.

## Obiettivo

Correggere il caso in cui API-Football risponde senza squadre per `teams?league=135&season=<stagione>` e la UI mostrava solo un errore generico.

## Modifiche

- La Netlify Function ora mostra gli errori API-Football reali invece di trasformarli in `nessuna squadra`.
- Aggiunta azione `status`/diagnostica per verificare piano, sottoscrizione e richieste giornaliere.
- Il download rose prova la stagione del listone e, se vuota, anche stagione precedente e successiva.
- La UI mostra la stagione API realmente usata e avvisa se e stato usato un fallback.
- Nessuna modifica a mapping profili, comunicati, rose, calciomercato, competizioni o snapshot.

## Note operative

Se `Scarica rose Serie A API` continua a fallire, usare prima `Diagnostica API` da Soccer Data admin.
