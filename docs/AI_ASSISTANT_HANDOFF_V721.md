# AI Assistant Handoff - ioSudo V721

Versione corrente: V721.

Fonte workbook: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-18_aggiornamento_globale_v76.xlsx`.

## Applicato
- Alias confermati: Mancini, Cristante, A. Cuenca, A. Stankovic, B. Kone, F. Terracciano, N. Paz, R. Vaz, Azzi, Bakker.
- Protezioni: non creare alias globale `Esposito`; mantenere anche cautela su `Pessina` generico.
- Candas Fiogbe aggiunto come U23 Atalanta ceduto ufficialmente, non slot attivo.
- Oulai/Desplanches aggiornati da Di Marzio come visite terminate ma non ufficiali.
- Basilea-Juventus resta pre-gara: nessun tabellino giocatori finché non esce tabellino post-partita.
- UI: scheda giocatore arricchita con riepilogo amichevoli giocate da `friendlyPlayerStatsByMatch`.

## Audit
`node static/fanta-engine/tools/audit-iosudo-v721.mjs` deve restituire OK.
