# AI Assistant handoff current

## Versione corrente

V561 - Calciomercato disattivato e feed articoli bloccato.

## Architettura

- fanta-engine: motore comune e asset condivisi.
- zonaorientale: lega storica.
- fantapetillomantramanager: seconda lega.
- _league-template: base per nuove leghe.

## Stato runtime

Il runtime ordinario usa il router locale storico ripristinato in V558. Restano disattivati dal percorso ordinario i wrapper che avevano rallentato ZonaOrientale:

- navigation-actions-v510
- navigation-data-refresh-v511
- public-data-autoload-v526
- dashboard-renderer-migration-v527
- dashboard-enforce-v528
- navigation-active-singleton-v534
- navigation-fluidity-v535
- navigation-performance-guard-v536
- performance-profiler-lazy-render-v552
- application-cache-chunked-tables-v553
- eager-data-preload-v555

V560 mantiene il feedback visivo di bootstrap introdotto in V559, ma lo tara su un segnale piu' sicuro: `DOMContentLoaded`, `window.load`, evento `fanta:app-rendered-v560`, controlli DOM essenziali presenti e quiet frame. La percentuale non ruota; ruota solo l'anello esterno della rotellina.

## Funzioni da preservare

- Asset Listoni/Calciomercato centralizzati in `static/fanta-engine/data/shared-assets/current/`.
- Calciomercato: live ultimi 3 giorni via Netlify Function, storico da archivio centrale.
- Rose/Listone: stile unificato, colonna Stato nelle Rose espanse.
- Regolamento: nessuna colorazione ruolo.
- Firebase, EmailJS, Admin, Presidente invariati.
- Router locale storico e navigazione reattiva post-caricamento.

## Regole operative

- Overlay unico whole-site con radici `static/` e `docs/`.
- Solo file effettivamente modificati.
- Aggiornare sempre docs, handoff e roadmap overlay.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Ogni patch runtime deve includere audit e checklist manuale.
