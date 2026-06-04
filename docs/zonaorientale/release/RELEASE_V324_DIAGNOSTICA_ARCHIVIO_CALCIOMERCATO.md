# Release V324 - Diagnostica archivio Calciomercato

## Obiettivo

V324 consolida l'archivio statico giornaliero introdotto in V323 aggiungendo una diagnostica operativa direttamente nella pagina Calciomercato, visibile solo agli Admin.

La release non cambia il modo in cui vengono scaricati i JSON: i pulsanti `Scarica JSON giorno` e `Scarica JSON intervallo` restano quelli della V323.

## Funzionalita aggiunte

Nella pagina Calciomercato, per gli Admin, il box `Archivio statico Calciomercato` ora mostra:

- giorni nel range selezionato;
- giorni disponibili nel manifest;
- giorni caricati nel range;
- totale articoli archivio dal manifest;
- articoli statici caricati nel range;
- doppioni scartati letti dalle statistiche dei JSON giornalieri;
- giorni mancanti nel range;
- fonti principali presenti negli articoli statici caricati.

## Funzionalita a rischio

- Calciomercato RSS automatico;
- archivio statico giornaliero V323;
- download JSON giorno/intervallo V323;
- filtri Squadre/Topic/Fonti;
- ricerca libera;
- range Da/A;
- caricamento articoli piu vecchi;
- layout mobile Calciomercato.

## Come vengono preservate

- nessuna modifica alla Netlify Function `calciomercato-feed.js`;
- nessuna modifica al Fantamercato interno;
- nessuna scrittura Firebase;
- nessuna modifica EmailJS;
- i JSON gia presenti in `assets/calciomercato/archive/` non vengono sovrascritti dall'overlay;
- la diagnostica legge solo `manifest.json` e i JSON giornalieri gia disponibili;
- i pulsanti V323 di download restano invariati;
- la diagnostica e visibile solo se `state.isAdmin === true`.

## Test manuali richiesti

1. Login Admin.
2. Aprire `Calciomercato`.
3. Impostare un range che include giorni gia archiviati.
4. Verificare che il box Admin mostri giorni disponibili, caricati e articoli statici.
5. Impostare un range che include un giorno non presente nel manifest.
6. Verificare che `Giorni mancanti nel range` mostri il giorno mancante.
7. Scaricare `JSON giorno` e verificare che il comportamento V323 resti attivo.
8. Scaricare `JSON intervallo` e verificare download dei giornalieri + manifest.
9. Uscire dall'Admin o accedere come utente non Admin: il box archivio non deve essere visibile.
10. Verificare mobile.

## Note operative

L'overlay V324 non contiene `assets/calciomercato/archive/manifest.json` e non contiene JSON giornalieri, per evitare di sovrascrivere lo storico gia committato.
