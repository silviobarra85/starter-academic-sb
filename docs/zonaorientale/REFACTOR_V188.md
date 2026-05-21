# V188 - Rose Excel senza normalizzazione nomi

## Obiettivo
Correggere il convertitore rose introdotto in V187: il nome squadra nel JSON statico deve rimanere quello presente nell'Excel, senza mapping verso i nomi canonici del sito e senza normalizzazione fuzzy.

## Modifiche
- Aggiornato `assets/app.js` per fare in modo che `mapStaticRosterTeamNameV187()` restituisca solo il testo ripulito dagli spazi ripetuti.
- La deduplicazione delle rose usa ora il nome Excel ripulito, non una chiave fuzzy che rimuove token come `FC`, `AS`, `AFC`.
- Aggiornato `assets/rose/2025-2026-2026-05-21.json` mantenendo i nomi squadra esatti dell'Excel.
- Aggiornati cache-buster e Version footer a V188.
- Aggiornata la checklist deploy per aspettarsi la versione 188.

## Nota
Questa scelta evita modifiche implicite ai dati in ingresso. L'eventuale associazione a squadre/stagioni dovrà avvenire in altri flussi, non nel convertitore JSON statico delle rose.

## Test
- `node --check static/zonaorientale/assets/app.js`
- `find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check`
- `find static/zonaorientale/assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool`
