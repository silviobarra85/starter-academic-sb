# V593 - Sudatori campetto probabile formazione e matching listone

## Obiettivo
Migliorare la sezione standalone **Per i SUDATORI** senza influenzare le sezioni operative.

## Modifiche
- Aggiunto campetto grafico sotto la tabella rosa della squadra Serie A selezionata.
- Il campetto dispone i giocatori per linee: attacco, trequarti, centrocampo, difesa, portiere.
- I nomi nel campetto sono cliccabili e aprono la stessa scheda giocatore della tabella.
- Migliorato il matching tra nomi delle rose Serie A e listone `2026-07-04.json`.
- Aggiunte varianti di match: nome canonico, nome compatto, token ordinati, confronto team/ruolo.
- Corretto il caso `Milinkovic-Savic` Napoli, che ora viene collegato a `Milinkovic-Savic V.` nel listone.

## Dati
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`

## File principali
- `static/fanta-engine/css/sudatori-section-v593.css`
- `static/fanta-engine/js/sections/sudatori-section-v593.js`
- `static/fanta-engine/tools/audit-sudatori-section-v593.mjs`

## Isolamento
La sezione non modifica:
- Firebase
- `rosterEntries`
- Rose ufficiali
- Listone operativo
- Area Presidente
- Area Admin
