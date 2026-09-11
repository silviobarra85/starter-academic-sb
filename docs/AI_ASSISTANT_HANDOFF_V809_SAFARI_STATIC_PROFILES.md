# ZonaOrientale V809 - Safari e profili squadra static-first

Data: 11/09/2026

## Problemi corretti

- Su Safari desktop il login Google non usa piu il popup che restituiva `auth/popup-closed-by-user`: usa `signInWithRedirect` nello stesso gesto utente. Gli altri browser conservano il popup esistente.
- Il profilo squadra viene costruito prima dallo snapshot statico della stagione. `publicTeamSnapshots` Firebase resta solo fallback e non puo piu imporre sul sito una scheda obsoleta o lasciare il caricamento in attesa.
- I movimenti del 10/09/2026 gia presenti nello snapshot diventano quindi visibili nel profilo: 10 acquisti aggregati, con tutti i 49 giocatori elencati nelle descrizioni, per -436 FM complessivi.

## Doppio livello dati

- Pubblico: config, rose, competizioni e snapshot stagionali statici sono la baseline autorevole e veloce.
- Firebase: autenticazione, ruoli, richieste e modifiche Admin; per i movimenti V808 mantiene delta/override con ID uguale alla baseline.
- L'export Admin consolida gli override Firebase nei nuovi snapshot statici. Fino al deploy dell'overlay esportato, il pubblico continua correttamente a leggere l'ultima baseline GitHub.

## Invarianti

- Nessun movimento FM aggiunto, eliminato o modificato in V809.
- Saldi invariati; totale acquisti asta settembre -436 FM e svincoli +223 FM.
- Nessuna modifica a FantaMantraManager o agli asset condivisi Listoni/Calciomercato.

## Verifica

Eseguire `node static/fanta-engine/tools/audit-zona-safari-profile-v809.mjs` dalla radice. Dopo il deploy fare hard reload su Safari Mac, provare login Google e aprire almeno due profili squadra dalla pagina Rose.
