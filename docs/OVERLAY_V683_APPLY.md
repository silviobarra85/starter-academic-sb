# Overlay ioSudo V683

Aggiorna ioSudo dal file Excel `fantacalcio_serie_a_2026_27_aggiornato_2026-07-15_aggiornamento_globale_v32.xlsx`.

## Contenuto

- dati `sudatori-data.json` aggiornati alla V32 del 15/07/2026;
- manifest aggiornato a `uiVersion: 683`;
- mantiene la logica V682: RUMOR e UFFICIALITA raggruppate per giocatore e sezione MERCATO squadra con sottosezioni apribili/chiudibili;
- mantiene GIOCATORI leggero: rose Serie A + listone + rose fantasy, senza giocatori solo-rumor;
- non tocca il sito e non riattiva Per i SUDATORI pubblico.

## Conteggi

- Giocatori: 714
- Trattative/Rumor: 527
- Ufficialita: 300
  - Entrate ufficiali: 144
  - Uscite ufficiali: 156
- Amichevoli effettive: 91
- SOS/Infortunati: 16
- Fonti: 349
- Righe aggiornamento v32: 16

## Controlli

```bash
node static/fanta-engine/tools/audit-iosudo-v683.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v683.js
node --check static/iosudo/sw.js
```
