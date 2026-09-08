# AI ASSISTANT HANDOFF - V805

Data: 2026-09-08

## Modifiche
- ZonaOrientale shell V805.
- Campionato: G1 23 agosto 2026, G2 30 agosto 2026, G3 6 settembre 2026.
- Mobile Competizioni usa la stessa card completa del desktop (classifica + giornate collassate).
- competition.html non unisce piu classifiche per ID: deduplica per squadra.
- Per un Campionato attivo la classifica viene ricalcolata dalle partite giocate, evitando snapshot obsoleti o duplicati.
- Fetch manifest/calendario con release=805 e link competition.html?v=805 per evitare cache mobile stale.

## Guardrail
- Non modificati rose, listoni, movimenti FM, Firebase, Admin, Battle Royale o altri calendari.
