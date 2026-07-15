# AI Assistant Handoff V690

Overlay combinato per aggiornare ioSudo dal file Excel `fantacalcio_serie_a_2026_27_aggiornato_2026-07-15_aggiornamento_globale_v40.xlsx` e correggere sul sito mobile le card di movimenti/comunicati nei profili squadra sotto la sezione Rose.

## ioSudo
- Dataset aggiornato a V690.
- Header mantiene data e ora tramite `updatedAtTime`.
- RUMOR e UFFICIALITÀ restano raggruppati per giocatore.
- GIOCATORI resta leggero, senza giocatori solo-rumor.

## Sito
- Desktop invariato.
- Su mobile, ultimi movimenti e ultimi comunicati del profilo squadra sono card responsive con `max-width` adattivo allo schermo.

## Conteggi
```json
{
  "version": 690,
  "sourceFile": "fantacalcio_serie_a_2026_27_aggiornato_2026-07-15_aggiornamento_globale_v40.xlsx",
  "players": 717,
  "teamTransferTalks": 581,
  "officialIncoming": 150,
  "officialOutgoing": 165,
  "officialMoves": 315,
  "friendlies": 92,
  "friendliesFilteredOut": 17,
  "injuries": 16,
  "sources": 470,
  "updateRows": 13,
  "updatedAtTime": "2026-07-15T22:44:12+02:00"
}
```
