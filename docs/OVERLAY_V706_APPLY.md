# Overlay V706 - ioSudo da Excel v57

## Obiettivo

Aggiorna ioSudo partendo dal file `fantacalcio_serie_a_2026_27_aggiornato_2026-07-17_aggiornamento_globale_v57.xlsx`.

La V706 aggiorna il dataset e introduce la scheda cliccabile per le amichevoli: dalla vista globale `AMICHEVOLI` e dalla sottosezione `Amichevoli` della squadra si puo aprire il riepilogo partita. Se il tabellino giocatori e presente in Excel, la scheda mostra badge per minuti, titolarita/subentro, gol, autogol e infortunio gara.

## File modificati

- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/js/apps/iosudo-app-v706.js`
- `static/fanta-engine/css/iosudo-app-v706.css`
- `static/fanta-engine/tools/audit-iosudo-v706.mjs`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `docs/COUNTS_V706.json`
- `docs/IOSUDO_APP_V706.md`
- `docs/AI_ASSISTANT_HANDOFF_V706.md`
- `docs/AI_ASSISTANT_HANDOFF_CURRENT.md`
- `docs/OVERLAY_ROADMAP.md`

## Applicazione

Dalla root del sito:

```bash
cp -R overlay_iosudo_v706/static/* static/
cp -R overlay_iosudo_v706/docs/* docs/
node --check static/fanta-engine/js/apps/iosudo-app-v706.js
node static/fanta-engine/tools/audit-iosudo-v706.mjs
```

## Controlli dati

- Squadre: 20
- Giocatori: 768
- Duplicati esatti in `playersByTeam`: 0
- Ufficialita: 365
- Trattative dopo deduplica conservativa: 578
- Trattative duplicate/consolidate escluse: 37
- Infortuni attivi: 16
- Righe infortuni storiche/superate escluse: 1
- Amichevoli raw nel dataset: 117
- Schede tabellino amichevoli: 1
- Righe giocatori nel tabellino Sassuolo-Alta Anaunia: 26

## Nota amichevoli

La partita `Sassuolo-Alta Anaunia` e tracciata come giocata con risultato `22-1`, fonte ufficiale Sassuolo. Il tabellino contiene anche giocatori non presenti nella rosa master precedente e la riga dell'autogol avversario.
