# AI Assistant Handoff corrente

Baseline corrente: V581.

## Stato principale
- ZonaOrientale: V581.
- FantaPetilloMantraManager: V581.
- Calciomercato disattivato.
- Svincola Giocatori attivo su ZonaOrientale.
- Stili mobile tabelle giocatori unificati con `player-tables-mobile-v581`.

## Ultima modifica
V581 ha risolto la divergenza di stile tra Area Squadra, Rose e Listone eliminando il clone dinamico V580 e applicando una sorgente CSS/runtime unica alle tre tabelle.

## Guardrail
- Non riattivare V570/V571 resize tabelle.
- Non usare piu il clone computato del Listone come sorgente runtime.
- Mantenere stili separabili solo tramite `data-player-table-v581="teamarea|rose|listone"` se servono ritocchi futuri.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
