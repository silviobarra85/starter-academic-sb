# AI Assistant Handoff V587 - Editor rose statiche Admin

## Obiettivo
Aggiungere in Area Admin uno strumento per modificare i JSON delle rose statiche caricati in `assets/rose` senza scrivere su Firebase.

## Modifiche
- Aggiunto `static/fanta-engine/js/ui/static-roster-editor-v587.js`.
- Aggiunto `static/fanta-engine/css/static-roster-editor-v587.css`.
- Inserito lo strumento negli `index.html` delle due leghe.
- Aggiornati footer/cache-buster/config a V587.
- Aggiunto audit `static/fanta-engine/tools/audit-static-roster-editor-v587.mjs`.

## Funzionamento
Lo strumento:
1. legge `assets/rose/manifest.json` della lega;
2. carica automaticamente l'ultima rosa disponibile;
3. carica il listone centrale più recente compatibile con la stagione, da `static/fanta-engine/data/shared-assets/current/assets/listoni/`;
4. permette di togliere giocatori da una rosa;
5. permette di aggiungere giocatori dal listone;
6. aggiorna `playerCount`, `meta.teams`, `meta.players`, `meta.id`, `meta.loadedAt`;
7. scarica il JSON rosa e il `manifest.json` aggiornato.

## File da caricare su GitHub dopo l'uso
- `static/<lega>/assets/rose/<seasonId>-<data>.json`
- `static/<lega>/assets/rose/manifest.json`

## Note regressioni
- Nessuna scrittura Firebase.
- Nessuna modifica EmailJS.
- Calciomercato resta disattivato.
- Svincola Giocatori resta attivo.
- `FUNZIONALITA'.md` non toccato.
