# ioSudo V636 - Lista GIOCATORI deduplicata, alias e rose live sui virtual player

Overlay V636 per l'app ioSudo.

## Correzioni

- `Kilicksoy` nel dataset Sudatori viene agganciato al listone/lista giocatori dove il nome risulta `Kilicsoy`.
- `Norton-Cuffy` e `Brooke Norton-Cuffy` vengono trattati come lo stesso giocatore.
- Nella vista globale `GIOCATORI`, i calciatori ufficialmente fuori dalla Serie A non vengono più mostrati.
- I giocatori presenti solo in trattative/rumor/ufficialità, quindi creati come schede virtuali in ioSudo, ricevono anche l'eventuale squadra fantasy dalle rose live della lega.
- Caso verificato: `Dybala` viene agganciato alla rosa fantasy `Real Pisistrius` quando il file rose live della lega lo contiene.

## Regola lista GIOCATORI

La lista `GIOCATORI` mostra i calciatori ancora rilevanti per la Serie A/app:

- giocatori presenti nelle rose Serie A del dataset Sudatori;
- giocatori presenti in rumor/trattative/ufficialità in entrata verso una squadra Serie A;
- giocatori presenti in notizie di permanenza o rinnovo.

Sono esclusi dalla lista globale i giocatori con uscita ufficiale verso club fuori Serie A o svincolati. Le relative informazioni restano nel dataset e nelle sezioni ufficialità/mercato, ma non popolano la lista compatta `GIOCATORI`.

## File modificati

- `static/fanta-engine/js/apps/iosudo-app-v636.js`
- `static/fanta-engine/css/iosudo-app-v636.css`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/tools/audit-iosudo-v636.mjs`
- `static/fanta-engine/tools/audit-sudatori-section-v636.mjs`
