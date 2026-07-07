# AI Assistant Handoff corrente

Versione corrente: V588.

## Stato operativo
- ZonaOrientale e FantaPetilloMantraManager usano `assets/rose` come fonte primaria per la visualizzazione delle rose.
- `rosterEntries` resta preservato e non viene modificato automaticamente.
- L'Area Admin espone un comando esplicito per sincronizzare Firestore da una rosa GitHub gia' pubblicata.
- Calciomercato resta disattivato.
- Svincola Giocatori resta attivo su ZonaOrientale.
- Tabelle giocatori mobile e Dashboard Presidente mobile restano come consolidate nelle patch precedenti.

## Verifica principale
```bash
node static/fanta-engine/tools/audit-static-rosters-primary-v588.mjs
```
