# ZonaOrientale V812 - login Google Safari

## Diagnosi

Il timeout sul reindirizzamento Google non dipende dalle regole Firestore. Il sito gira su `silviobarra.com`, mentre `authDomain` e su `zonaorientale-d07af.firebaseapp.com`: sui browser che limitano lo storage di terze parti, incluso Safari, `signInWithRedirect` richiede una configurazione hosting/proxy aggiuntiva.

## Correzione

- Google Auth usa `signInWithPopup` su desktop e mobile.
- `signInWithRedirect` e stato eliminato da applicazione, wrapper e adapter.
- Messaggi distinti per popup bloccato e popup chiuso dall'utente.
- Timeout di 15 secondi mantenuto per modulo Auth, email/password e popup Google.
- Cache-buster V812 applicato all'intero grafo Auth.
- Nessuna modifica alle regole Firestore o ai dati V810.

## Verifica Safari

1. Consentire i popup per `silviobarra.com`.
2. Ricaricare ignorando la cache con `Option-Command-R` (`⌥⌘R`).
3. Aprire Accedi / Registrati e selezionare Google.
4. Verificare anche email/password separatamente.

Audit: `node static/fanta-engine/tools/audit-zona-google-popup-v812.mjs` dalla radice del pacchetto.
