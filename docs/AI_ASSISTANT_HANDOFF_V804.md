# AI Assistant Handoff - V804 - 8 settembre 2026

## Modifiche
- Nuovo listone shared asset `2026-09-08.json`: 593 giocatori, 531 in listone, 62 asteriscati.
- Lo storico dei listoni 2026-2027 resta invariato e selezionabile.
- Calendario Campionato aggiornato dal nuovo Excel: prime 3 giornate concluse, 15 partite giocate.
- La 3a giornata ha `matchDate: 2026-09-06` su tutte e 5 le partite.
- Il JSON del Campionato include anche la classifica calcolata dopo la 3a giornata, usando gli stessi tie-break runtime: punti, FPT, DR, GF, nome.
- Non viene sovrascritto lo snapshot stagionale: scelta intenzionale per non distruggere eventuali override Admin/Firebase o modifiche manuali alle rose effettuate dopo V803. Il calendario statico resta la fonte base e gli override Firebase continuano a prevalere.
- Shell/cache-buster ZonaOrientale aggiornati a V804.

## Guardrail
- Non modificare rose, movimenti FM, news, competizioni diverse dal Campionato o dati Firebase per questo aggiornamento.
- Gosens/Maripan e la gestione manuale rose Admin V802/V803 devono restare intatti.
