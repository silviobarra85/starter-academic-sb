# V159 - Fix selezione Rose mobile

Data: 2026-05-21

## Obiettivo

Correggere la schermata Rose da mobile dopo la V156/V158. I blocchi rosa venivano trasformati in semplici pulsanti `Espandi`/`Riduci` dal normalizzatore globale dei toggle.

## Modifiche

- `normalizeToggleLabelsV29` non modifica più i blocchi `.mobile-roster-select-block-v156`.
- I blocchi Rose mobile mostrano sempre logo, nome squadra, presidente/i e metadati.
- Nella scheda della rosa selezionata resta nascosto il tasto di chiusura/riduzione.
- La tabella giocatori della rosa selezionata resta scrollabile orizzontalmente.
- Desktop invariato.

## File

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/css/mobile-hotfix-v159.css`
