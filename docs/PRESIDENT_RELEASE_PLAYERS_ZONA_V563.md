# V563 - Svincola Giocatori ZonaOrientale runtime fix

## Obiettivo
Riattivare realmente in ZonaOrientale la funzione **Svincola Giocatori** nell'Area Presidente: selezione multipla dei giocatori dalla rosa, anteprima email precostituita e invio via EmailJS al presidente di lega.

## Causa individuata
La V562 aveva abilitato la card in `league-config.json`, ma il registry card V497 viene creato all'avvio usando il default locale di `league-config-v443.js`, prima del fetch asincrono della config JSON. Il default aveva ancora `release-players` disabilitato, quindi il motore dashboard poteva continuare a nascondere il pannello.

## Modifiche V563
- `static/zonaorientale/assets/js/core/league-config-v443.js`
  - default runtime aggiornato a V563;
  - `currentSeasonId` mantenuta a `2026-2027`;
  - `features.presidentReleasePlayers = true` gia nel bootstrap;
  - override default `featureCardRegistry.cards.release-players.enabled = true`;
  - cache-buster fetch config aggiornato a `league-config.json?v=563`.
- `static/zonaorientale/assets/app.js`
  - import config aggiornato a `?v=563`;
  - aggiunto runtime fix `ZonaOrientalePlayerReleaseV563`;
  - patch del registry V497 per `release-players`;
  - reinserimento/riattivazione del pannello dopo `renderUserArea`, `renderAll`, eventi auth e timer di sicurezza;
  - handler, preview e filtri ruolo richiamati dopo l'inserimento.
- `static/zonaorientale/assets/league-config.json`
  - V563;
  - `presidentReleasePlayers` attivo;
  - card `release-players` attiva solo per presidente.
- `static/zonaorientale/index.html`
  - cache-buster e footer V563.

## Funzionalita preservate
- Calciomercato resta disattivato come in V561.
- FantaPetilloMantraManager non viene modificato.
- EmailJS ZonaOrientale resta quello esistente.
- Destinatario svincoli ZonaOrientale preservato: `caparrotti86@yahoo.it`.
- `FUNZIONALITA'.md` non modificato.

## Audit
Eseguire:

```bash
node static/fanta-engine/tools/audit-zona-release-players-v563.mjs
```
