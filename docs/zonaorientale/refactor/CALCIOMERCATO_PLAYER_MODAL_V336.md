# Refactor V336 - Timeline giocatore in scheda/modal

## Obiettivo

Eliminare la navigazione verso una pagina timeline separata per i giocatori Calciomercato e sostituirla con una scheda/modal chiudibile, piu coerente con la lettura degli articoli.

## Motivazione

In V335 il tag giocatore apriva `#calciomercato-player-<slug>` e creava una pagina dinamica con due tasti di ritorno. In alcune condizioni quei tasti non riportavano correttamente agli articoli o al Calciomercato. V336 evita il cambio pagina: la timeline si apre sopra la sezione corrente e si chiude con X.

## Implementazione

In `assets/app.js`:

- `ensureCalciomercatoPlayerTimelinePageV335()` conserva il nome per compatibilita ma crea il modal V336.
- `setCalciomercatoPlayerTimelinePageActiveV335()` apre il modal invece di cambiare `state.currentPage`.
- `openCalciomercatoPlayerTimelineModalV336(slug)` renderizza la timeline.
- `closeCalciomercatoPlayerTimelineModalV336()` chiude la scheda.
- Il click su `[data-calciomercato-player-slug]` chiama direttamente `openCalciomercatoPlayerTimelineModalV336`.
- La route/hash legacy `#calciomercato-player-*` resta riconosciuta e apre il modal.

In `calciomercato.css`:

- aggiunte classi `calciomercato-player-modal-v336`, backdrop, dialog, header e close button;
- il body viene bloccato con `body.calciomercato-player-modal-open-v336`;
- il contenuto della timeline scrolla nel modal.

## Comportamento preservato

- Matching giocatore V335.
- Lettura ultimo listone stagione selezionata.
- Pool timeline da articoli caricati + archivio statico.
- Deduplica articoli.
- Rendering card articolo nella timeline.
- Nessuna scrittura Firebase.
- Nessun cambio Netlify.
- Nessun cambio JSON.

## Verifiche browser consigliate

1. Aprire Calciomercato.
2. Trovare un articolo con tag giocatore.
3. Cliccare il tag.
4. Verificare apertura scheda/modal.
5. Chiudere con X.
6. Riaprire e chiudere cliccando backdrop.
7. Riaprire e chiudere con Escape.
8. Verificare che la lista articoli Calciomercato sia ancora nello stesso stato.
9. Provare da mobile.

## Non fare in futuri refactor

- Non reintrodurre una pagina dedicata senza richiesta esplicita.
- Non aumentare aggressivita matching insieme al refactor UI.
- Non rinominare `calciomercato-players-v335.js` senza aggiornare import, check e documentazione.
