# AI Assistant Handoff V700

Overlay ioSudo V700.

- Sorgente: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-16_aggiornamento_globale_v47.xlsx`.
- Aggiorna dati Sudatori/ioSudo a V700.
- Mantiene GIOCATORI leggero e deduplica V696+.
- Mantiene RUMOR e UFFICIALITÀ raggruppati per giocatore.
- Mantiene data + ora nell'header di ioSudo.
- Non tocca il sito.

Conteggi principali:

```json
{
  "version": "V700",
  "sourceFile": "fantacalcio_serie_a_2026_27_aggiornato_2026-07-16_aggiornamento_globale_v47.xlsx",
  "players": 749,
  "talks": 599,
  "officialIncoming": 165,
  "officialOutgoing": 177,
  "officialMoves": 342,
  "friendlies": 94,
  "injuries": 16,
  "sources": 932,
  "updateRowsV47": 9,
  "friendliesFilteredOut": 17
}
```
