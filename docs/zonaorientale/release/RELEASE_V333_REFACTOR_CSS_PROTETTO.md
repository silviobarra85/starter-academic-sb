# Release V333 - Refactor CSS protetto

Data: 05/06/2026

## Sintesi

V333 introduce un primo refactor protetto: separa le regole CSS specifiche del Listone dal CSS mobile generico, senza modificare logiche runtime o dati.

## Modifiche

- Nuovo `assets/css/refactor/listone.css`.
- Spostate in `listone.css` le regole del filtro Listone `Modifiche`.
- Aggiornato `index.html` per caricare `listone.css?v=333`.
- Aggiornati cache-buster/footer/versione a V333.
- Aggiunta diagnostica `window.ZonaOrientaleRefactorCssProtettoV333`.
- Aggiornato `check-zonaorientale.sh` con controllo V333.
- Aggiunto `FUNZIONALITAV333.md` con lista estesa delle funzionalita correnti.
- Aggiunto handoff V333 per futuro assistente AI.

## Nessun cambio funzionale previsto

La release non cambia dati, feed, Firebase, Netlify, rendering Calciomercato, export Listone o workflow Admin/Presidente.

## Test consigliati

```bash
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```

## Verifica manuale rapida

- Aprire Listone e verificare filtro `Modifiche`.
- Da mobile, verificare che il filtro `Modifiche` sia leggibile e selezionabile.
- Aprire Calciomercato e verificare che le card restino compatte.
- Aprire menu mobile `Altro`.
- Aprire `competition.html` e `player.html` per controllo cache/versione.
