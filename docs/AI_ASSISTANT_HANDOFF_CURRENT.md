# AI Assistant handoff current

## Versione corrente

V562 - Svincola Giocatori riattivato su ZonaOrientale.

## Architettura

- fanta-engine: motore comune e asset condivisi.
- zonaorientale: lega storica, stagione corrente allineata a `2026-2027`.
- fantapetillomantramanager: seconda lega, stagione `2026-2027`.
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

V560 mantiene il feedback visivo di bootstrap introdotto in V559, tarato su render app, `window.load`, controlli DOM essenziali e quiet frame. La percentuale non ruota; ruota solo l'anello esterno della rotellina.

V561 disattiva Calciomercato e blocca il recupero articoli/feed.

V562 riattiva su ZonaOrientale solo la card presidente `Svincola Giocatori`, gia' presente nel runtime come `#teamPlayerReleasePanelV261`, governandola tramite feature registry.

## Funzioni da preservare

- Calciomercato resta disattivato: niente sezione, niente fetch articoli, Netlify Function no-op.
- Rose/Listone/Svincolati: stile unificato e dati preservati.
- Regolamento: nessuna colorazione ruolo.
- Firebase, EmailJS, Admin, Presidente e Area Squadra invariati.
- Svincola Giocatori attivo su ZonaOrientale e FantaMantraManager.
- Router locale storico e navigazione reattiva post-caricamento.
- Badge dispositivo V434.

## Regole operative

- Overlay unico whole-site con radici `static/` e `docs/`.
- Solo file effettivamente modificati.
- Aggiornare sempre docs, handoff e roadmap overlay.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Ogni patch runtime deve includere audit e checklist manuale.
