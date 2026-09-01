# AI Assistant Handoff - V799

## Obiettivo
Correggere i duplicati nel dettaglio pubblico delle competizioni quando la stessa partita esiste nel calendario JSON e negli snapshot/Firebase con ID o testo giornata differenti.

## Regola canonica
- `assets/competitions/...json` resta il calendario base.
- Il record Firebase/snapshot e' un override amministrativo.
- Se rappresentano la stessa fixture, il record Firebase deve sovrascrivere la riga JSON e conservarne l'ID amministrativo, non essere aggiunto come seconda partita.
- Non eliminare il record Firebase: deve restare modificabile dall'Admin.

## Caso verificato
Campionato 2026/27, giornata 2: Prestige Worldwide - Afc Severgas Baronissi 1-2 (71-72,5).
Il calendario statico e lo snapshot hanno ID diversi; V799 li riconcilia tramite identita fixture robusta (competizione, giornata numerica, squadre, giornata Serie A).

## Audit
`static/fanta-engine/tools/audit-zona-competition-dedup-v799.mjs`
