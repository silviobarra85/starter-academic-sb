# Matrice consolidamento cleanup/refactor V354

| Area | Stato V354 | Decisione | Rischio | Note |
| --- | --- | --- | --- | --- |
| Calciomercato immagini | Modulo V334 attivo | Preservare | Basso | Fallback favicon/fonte/TMW testuale invariati |
| Calciomercato player | Modulo V340 attivo | Preservare | Medio | Matching conservativo, modal timeline V336 |
| Calciomercato renderer | Modulo V338 attivo | Preservare | Basso | Wrapper storico ancora attivo |
| Calciomercato filtri | Modulo V339 attivo | Preservare | Basso | Cerca/Da/A/squadra/topic/fonte invariati |
| Calciomercato Solo Admin | Modulo V340 attivo | Preservare | Medio | Download archivio e diagnostica da testare manualmente |
| Helper condivisi | V295 + bridge V341 | Preservare | Basso | V294 rimosso in V345 |
| CSS refactor legacy | Rimossi V343 | Nessuna azione | Basso | Controlli obbligatori OK |
| Mobile hotfix V166/V167 | Rimossi V352 | Nessuna azione | Basso | Regole consolidate in mobile-suite-v168 |
| Simulatore trade | V255 attivo | Preservare | Medio | V254 e duplicato top-level rimossi; azioni locali V349 |
| Admin diagnostica | Timestamp V343 attivo | Preservare | Medio | Click Aggiorna Diagnostica mostra ora italiana |
| Workflow pubblicazione Admin V213 | Non importato | Tenere per ora | Medio | Rimozione solo dopo test Admin pubblicazione |
| theme-light-suspended.css | Non importato | Tenere per ora | Basso | Archivio/rollback tema Light |
| domain/competitions.js | Non importato | Tenere per ora | Medio | Rimozione solo dopo test Dashboard Competizioni/competition.html |
| Netlify Functions | Non toccate | Preservare | Medio | Warning V320 noto, non bloccante |
| `FUNZIONALITA'.md` | Non modificato | Preservare | Basso | Modificare solo su richiesta esplicita |

## Politica V354

Nessuna rimozione automatica. La V354 e un punto di stop e consolidamento.

## Comandi audit

```bash
static/zonaorientale/tools/audit-refactor-consolidation-v354.mjs
static/zonaorientale/tools/check-zonaorientale.sh
```
