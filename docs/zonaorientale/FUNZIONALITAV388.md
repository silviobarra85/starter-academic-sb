# V388 - Snapshot comunicati admin

Stato: V388.

## Obiettivo

Rendere piu chiaro e immediato il pannello `Admin -> Snapshot e backup -> Snapshot pubblici`, soprattutto dopo il salvataggio/pubblicazione di comunicati.

## Modifiche

- I pulsanti snapshot aggiornano subito la data `Ultimo:` dopo click riuscito su:
  - Aggiorna stagione selezionata
  - Aggiorna comunicati
  - Aggiorna competizioni e classifiche
  - Aggiorna tutte le stagioni
  - Aggiorna Albo/FIFA
  - Aggiorna schede squadra
  - Aggiorna tutto
  - Scarica config pubblica
  - Scarica snapshot stagione JSON
  - Scarica overlay snapshot stagioni
  - Scarica honor JSON
- Il pannello Snapshot pubblici chiarisce il flusso dei comunicati:
  - salva o approva il comunicato;
  - premi `Aggiorna comunicati`;
  - scarica/applica lo snapshot stagione se vuoi renderlo stabile anche nei JSON statici dopo logout/refresh.

## Cosa non cambia

- Nessuna modifica a Firebase Rules.
- Nessuna modifica al flusso WhatsApp dinamico.
- Nessuna modifica a Soccer Data, mapping FBref o listone.
- Nessuno scraping live.
- `FUNZIONALITA'.md` non modificato.

## Nota operativa comunicati

Il link WhatsApp dinamico puo leggere il comunicato da Firebase. Per rendere il comunicato visibile in modo stabile anche al sito pubblico che legge i JSON statici, dopo aver salvato o approvato il comunicato bisogna aggiornare lo snapshot comunicati e pubblicare lo snapshot statico stagione.
