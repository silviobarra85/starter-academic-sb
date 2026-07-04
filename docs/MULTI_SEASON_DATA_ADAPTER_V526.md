# V526 - Adapter dati multi-season

## Obiettivo

Preparare il sito multi-lega alla gestione pulita di stagioni diverse senza spostare fisicamente dati o cambiare flussi Firebase/EmailJS.

## Stato delle leghe

- `zonaorientale`: stagione corrente `2025-2026`.
- `fantapetillomantramanager`: stagione corrente `2026-2027`.

## Cosa cambia

- Aggiunto `static/fanta-engine/js/core/season-data-adapter-v526.js`.
- Ogni `league-config.json` espone `currentSeasonId`, `seasons` e metadata `multiSeasonDataAdapterV526`.
- Gli `app.js` installano il runtime comune `FantaEngineSeasonDataAdapterRuntimeV526`.
- `Listoni` e `Calciomercato` restano dati condivisi e continuano a leggere da `static/fanta-engine/data/shared-assets/current/`.
- `rose`, `competizioni`, `snapshot stagionali`, `bilanci` e `honor` vengono classificati come dati per-stagione.

## Cosa non cambia

- Nessuna migrazione fisica dei dati.
- Nessuna cancellazione di fallback locali.
- Nessuna modifica a Firebase, EmailJS, ruoli o admin.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.

## Verifica manuale

1. Aprire entrambe le leghe.
2. Controllare footer `V526`.
3. In console verificare `window.FantaEngineSeasonDataAdapterRuntimeV526.currentSeasonId`.
4. Su ZonaOrientale il valore deve essere `2025-2026`.
5. Su FantaPetilloMantraManager il valore deve essere `2026-2027`.
6. Listone e Calciomercato devono continuare a caricare dagli asset comuni.
