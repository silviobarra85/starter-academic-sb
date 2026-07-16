# AI Assistant Handoff V697

Overlay ioSudo V697 generato da `fantacalcio_serie_a_2026_27_aggiornato_2026-07-16_aggiornamento_globale_v44(1).xlsx`.

## Note operative
- Mantiene la logica V696 di deduplica conservativa dei giocatori.
- Aggiorna data e ora nell'header tramite `manifest.updatedAtTime`.
- GIOCATORI resta leggero: rose Serie A + listone + rose fantasy; niente giocatori solo-rumor.
- RUMOR e UFFICIALITA restano raggruppati per giocatore, con fonti compatte.

## Conteggi
- Giocatori: 753
- Trattative/Rumor: 637
- Ufficialita: 334
  - Entrate: 161
  - Uscite: 173
- Amichevoli effettive: 92
- SOS/Infortunati: 16
- Fonti: 1539

## Verifica
Eseguire:

```bash
node static/fanta-engine/tools/audit-iosudo-v697.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v697.js
node --check static/iosudo/sw.js
```
