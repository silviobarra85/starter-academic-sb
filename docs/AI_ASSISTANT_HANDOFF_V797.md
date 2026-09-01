# AI Assistant Handoff V797

## Obiettivo
Correzione del dettaglio competizioni di ZonaOrientale (`competition.html`).

## Contratto dati
- Il calendario statico in `assets/competitions/` e il relativo `manifest.json` sono la fonte base per le competizioni con calendario.
- Lo snapshot stagionale locale e Firebase non sostituiscono il calendario base: forniscono override amministrativi di risultato/stato e dati squadra.
- Precedenza: JSON calendario < snapshot locale < Firebase live.
- Campionato 2026-2027: 180 partite, 10 gia giocate.
- Champions League 2026-2027: 8 partite configurate.
- Coppa Italia 2026-2027: Battle Royale, 4 giornate, nessun calendario H2H fittizio.

## competition.html
- Carica direttamente `./assets/competitions/manifest.json` prima dei path configurabili.
- Carica direttamente il file indicato dal manifest.
- Se non esiste un calendario statico, usa lo snapshot stagionale locale/Firebase come fallback.
- Gli override Admin in `competitionMatches` vengono fusi sul calendario base, senza perdere le partite future.
- I risultati Battle Royale continuano a usare `entryMode=BATTLE_ROYALE`.

## Admin
Il flusso esistente di inserimento/modifica risultati non viene sostituito. Gli override Firebase devono prevalere nel dettaglio competizione e possono poi essere consolidati nello snapshot statico.

## Audit
`static/fanta-engine/tools/audit-zona-competition-detail-v797.mjs` verifica manifest, calendari, Battle Royale, loader static-first del dettaglio e wiring Admin.
