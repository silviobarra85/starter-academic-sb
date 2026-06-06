# FUNZIONALITA V391 - Soccer Data stats FBref/Firebase

## Obiettivo

V391 aggiunge una pipeline mirata per iniziare a popolare Soccer Data con statistiche reali, senza modificare le altre sezioni del sito e senza cambiare il mapping FBref V383.

## Perimetro modificato

- Solo sezione Soccer Data.
- Aggiunta funzione Netlify `fbref-player-stats` per recupero admin-only di un singolo profilo FBref.
- Aggiunta lettura static-first con fallback Firebase dalla collection `soccerDataPlayerStats`.
- Aggiunti comandi admin dentro Soccer Data per recuperare stats per singolo giocatore, ricaricare stats ed esportare JSON Firebase.
- Aggiornati manifest Soccer Data/stats a V391.

## Cosa resta invariato

- Mapping corrente: `fbref-player-map.v383.json`.
- Numero mapping: 531 confermati, 1 needs-review.
- Soccer Data resta pubblica in sola lettura per non-admin.
- Comandi di associazione, recupero FBref, salvataggio Firebase ed export restano solo admin.
- Nessuna modifica a comunicati, rose, calciomercato, competizioni, snapshot, admin generale o Firebase rules.
- `FUNZIONALITA'.md` non modificato.

## Flusso admin

1. Apri Soccer Data da admin.
2. Su un giocatore mappato clicca `Recupera stats FBref`.
3. La UI chiama la Netlify Function `/.netlify/functions/fbref-player-stats` passando il token Firebase admin.
4. La funzione verifica che l'utente sia admin e recupera una sola pagina giocatore FBref.
5. La funzione restituisce summary normalizzato e tutte le tabelle FBref parsate dalla pagina.
6. La UI salva il payload in Firebase nella collection `soccerDataPlayerStats`.
7. Da Soccer Data l'admin puo scaricare `player-stats-firebase-<seasonId>-v391.json`.
8. Il JSON esportato va verificato e poi pubblicato nella repo come dato statico.

## Lettura runtime

Ordine di lettura:

1. JSON statico in `assets/soccer-data/stats/`.
2. Se lo statico non ha stats compilate, fallback Firebase `soccerDataPlayerStats`.
3. Se anche Firebase non e disponibile, Soccer Data resta consultabile con mapping/listone e mostra stats assenti/template.

## Note tecniche

- La funzione Netlify non scrive direttamente su Firebase: scrive solo il client admin dopo risposta positiva.
- Il parser non si limita ai campi summary: salva anche `tables`, cioe tutte le tabelle HTML/commentate trovate nella pagina FBref.
- Il recupero e volutamente per singolo giocatore: l'aggiornamento massivo andra costruito in un batch controllato/rate-limited successivo.
