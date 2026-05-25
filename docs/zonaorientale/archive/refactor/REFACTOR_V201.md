# V201 - Fix Area squadra: rose da snapshot/static rosters

## Obiettivo

Correggere il conteggio giocatori nell'Area squadra dei presidenti quando il sito lavora in modalita' pubblica leggera e non sono stati caricati i dati amministrativi completi.

## Problema

Dopo V199/V200, le pagine Statistiche e Confronta sono state corrette per leggere Albo/FIFA da `assets/snapshots/honor.json`. Un problema simile rimaneva nell'Area squadra: il numero giocatori poteva restare a zero se la dashboard presidente dipendeva solo da `state.raw.rosterEntries` o da helper creati prima dell'applicazione degli snapshot/static JSON.

## Soluzione

Aggiunti helper V201 che recuperano la rosa in questo ordine:

1. `state.raw.rosterEntries` gia' applicato dallo snapshot stagione.
2. `state.publicSeasonSnapshots[seasonId].rosterEntries` gia' caricato da JSON statico o fallback Firebase.
3. `state.rosters` da `assets/rose/manifest.json` e JSON statici rose.

La patch non modifica i JSON e non normalizza i nomi salvati: usa solo chiavi di matching lato runtime per collegare il nome squadra presente nell'Excel/JSON alla squadra stagionale.

## Cosa cambia

- Dashboard presidente V192: metrica `Rosa` ora usa il nuovo recupero robusto.
- Hub mobile Area squadra V144: il conteggio `x/30 giocatori` ora usa lo stesso recupero robusto.
- `getRosterForSeasonTeam` viene esteso con fallback snapshot/static rosters.
- Aggiunto debug console: `ZonaOrientaleRosterDebug`.

## Letture Firebase

Nessuna nuova lettura Firebase. La patch usa solo dati gia' caricati in memoria da JSON statici, snapshot pubblici o fallback esistenti.

## Verifiche consigliate

1. Login come presidente senza premere `Carica dati amministrazione`.
2. Aprire `Area squadra`.
3. Verificare che `Rosa` mostri il numero corretto di giocatori.
4. Verificare anche da mobile l'hub Area squadra.
5. Aprire la pagina squadra e controllare che la rosa sia presente.
6. Eseguire Checklist online finale: deve aspettarsi V201.
