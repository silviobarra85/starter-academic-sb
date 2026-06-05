# Handoff nuovo assistente - V369

## Versione corrente

V369 - Dashboard Presidente protetta.

## Cosa e' stato fatto

La V369 aggiunge una dashboard read-only in Area squadra per i presidenti approvati. Il pannello usa dati gia' presenti in `state.raw`, funzioni roster/FM/trattative esistenti e non scrive su Firebase.

## Punti da non rompere

- `renderUserAreaApprovedV119` resta la base delle sezioni esistenti.
- V369 avvolge il rendering aggiungendo la dashboard prima del contenuto V119.
- `attachUserAreaHandlersV119` deve continuare a gestire proposta trattativa e comunicato.
- Le azioni `data-trade-accept`, `data-trade-reject`, `data-trade-cancel` restano quelle esistenti.
- Non modificare `FUNZIONALITA'.md` senza richiesta esplicita.

## Marker

```js
window.ZonaOrientalePresidentDashboardV369
```

## Verifiche

```bash
node static/zonaorientale/tools/audit-president-dashboard-v369.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```
