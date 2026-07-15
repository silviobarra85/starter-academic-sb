# AI Assistant Handoff V686 - ioSudo aggiornamento globale v36

Overlay: `fantacalcio_overlay_iosudo_v686_globale_v36.zip`

## Scopo
Aggiornare solo **ioSudo** dal file Excel `fantacalcio_serie_a_2026_27_aggiornato_2026-07-15_aggiornamento_globale_v36.xlsx`.

## Vincoli mantenuti
- Sito e card mobile del sito non modificati.
- Sezione pubblica **Per i SUDATORI** non riattivata.
- Vista **GIOCATORI** resta leggera: rose Serie A + listone + rose fantasy, senza giocatori solo-rumor.
- Logica V682+ mantenuta: RUMOR e UFFICIALITÀ raggruppate per giocatore; MERCATO squadra con sottosezioni apribili/chiudibili.

## Conteggi
```json
{
  "players": 716,
  "friendlies": 92,
  "teamTransferTalks": 565,
  "officialIncoming": 148,
  "officialOutgoing": 156,
  "officialMoves": 304,
  "injuries": 16,
  "sources": 420,
  "updateRows": 17,
  "filteredFriendlies": 39,
  "outOfScope": 0
}
```

## Note v36
- Inserite le fonti ufficiali dei club Serie A nel registro fonti.
- Rafforzate fonti ufficiali già presenti per alcune ufficialità e comunicati.
- Aggiornate/rafforzate trattative monitorate, senza modificare la vista GIOCATORI globale.
