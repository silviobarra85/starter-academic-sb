# AI Assistant Handoff V796

## Obiettivo
La V796 corregge la semantica delle competizioni 2026/27.

- Le competizioni con veri accoppiamenti (Campionato, Champions, fasi KO) mostrano il calendario completo nella pagina `competition.html`.
- Le competizioni/formati `BATTLE_ROYALE` e `UNO_VS_TUTTI` non generano un calendario casa/trasferta artificiale.
- La Coppa Italia 2026/27 e' attualmente nella fase Battle Royale: 4 giornate collegate alle giornate Serie A 8, 17, 24 e 26, 10 partecipanti per giornata.
- L'export Excel della Coppa conteneva 45 confronti per giornata; sono una matrice tutti-contro-tutti e NON vanno trattati come 45 partite reali.

## Admin
Nel pannello Admin e' presente `Risultati Battle Royale`.
Per ogni giornata si inserisce il fantapunteggio di ciascuna squadra. I record sono salvati in `competitionMatches` con `entryMode: BATTLE_ROYALE`, quindi entrano gia' nel normale snapshot competizioni.
Il pannello `Partite competizioni` esclude Battle Royale/1-vs-tutti e continua a gestire solo partite reali H2H.

## Dati statici
`assets/competitions/2026-2027/coppa-italia-2026-2027.json` usa `rounds[]` e `matches: []` per la fase Battle Royale.
Campionato e Champions mantengono `matches[]` completi.
