# AI Assistant Handoff V636

Stato: overlay V636 creato per correggere la vista `GIOCATORI` in ioSudo.

## Problemi risolti

1. Alias nome/listone:
   - dataset: `Kilicksoy`;
   - listone: `Kilicsoy`;
   - ora vengono abbinati.
2. Deduplica Norton-Cuffy:
   - `Norton-Cuffy` e `Brooke Norton-Cuffy` sono trattati come lo stesso calciatore.
3. Lista GIOCATORI:
   - esclusi i calciatori ufficialmente fuori dalla Serie A o svincolati.
4. Rose fantasy su virtual player:
   - i giocatori presenti solo in trattative/rumor, come Dybala nel dataset attuale, vengono agganciati alle rose live della lega.

## Casi verificati

- Dybala viene trovato nella rosa `Real Pisistrius` quando il file rose live della lega contiene `Dybala, ROM, A`.
- Kilicksoy/Kilicsoy viene risolto tramite alias.
- Brooke Norton-Cuffy/Norton-Cuffy viene risolto tramite alias/subset di token.

## Audit

```bash
node static/fanta-engine/tools/audit-sudatori-section-v636.mjs
node static/fanta-engine/tools/audit-iosudo-v636.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v636.js
node --check static/iosudo/sw.js
```
