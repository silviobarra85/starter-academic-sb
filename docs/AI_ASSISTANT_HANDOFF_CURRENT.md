# AI Assistant Handoff CURRENT

## Stato corrente
- Versione corrente: V586.
- ZonaOrientale e FantaPetilloMantraManager hanno Calciomercato disattivato.
- Dashboard Presidente mobile: V585.
- Tabelle giocatori mobile: V584.
- Rose pubbliche/Tutte le rose: filtri ruolo rimossi in V586.

## Ultima modifica
V586 rimuove dalla sezione pubblica **Tutte le rose** i filtri ruolo dei giocatori, senza rimuovere i filtri Listone o i filtri operativi per Area Squadra/Presidente.

## Asset runtime principali
- `static/fanta-engine/css/player-tables-mobile-v584.css`
- `static/fanta-engine/js/ui/player-tables-mobile-v584.js`
- `static/fanta-engine/css/president-teamarea-mobile-v585.css`
- `static/fanta-engine/js/ui/president-teamarea-mobile-v585.js`

## Audit corrente
```bash
node static/fanta-engine/tools/audit-public-roster-filters-cleanup-v586.mjs
node static/fanta-engine/tools/audit-player-tables-mobile-v584.mjs
node static/fanta-engine/tools/audit-teamarea-dashboard-v585.mjs
```

## Vincoli da preservare
- Non reintrodurre il resize colonne V570/V571.
- Non reintrodurre Calciomercato.
- Non toccare `FUNZIONALITA'.md` senza richiesta esplicita.
- Mantenere docs storici.
- Preferire patch piccole e auditabili.
