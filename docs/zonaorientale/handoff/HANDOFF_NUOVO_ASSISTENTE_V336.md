# Handoff nuovo assistente AI - V336

## Stato corrente

Versione runtime: V336.

V336 corregge la UX della timeline giocatore Calciomercato: il tag giocatore non naviga piu' verso una pagina dedicata, ma apre una scheda/modal sovrapposta chiudibile con `X`, backdrop o `Escape`.

## File chiave

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/calciomercato/calciomercato-images-v334.js
static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js
static/zonaorientale/assets/css/refactor/calciomercato.css
static/zonaorientale/assets/css/refactor/listone.css
static/zonaorientale/assets/calciomercato/links.json
static/zonaorientale/assets/calciomercato/archive/manifest.json
```

## Cosa e' cambiato in V336

- La funzione `ensureCalciomercatoPlayerTimelinePageV335()` mantiene il nome legacy ma ora crea/usa il modal `#calciomercatoPlayerTimelineModalV336`.
- `openCalciomercatoPlayerTimelineModalV336(slug)` apre la timeline del giocatore.
- `closeCalciomercatoPlayerTimelineModalV336()` chiude la scheda e pulisce eventuale hash legacy `#calciomercato-player-*`.
- Il click su `[data-calciomercato-player-slug]` non aggiorna piu' `window.location.hash`.
- La vecchia attivazione da hash resta compatibile per link storici, ma apre il modal invece della pagina.
- Aggiunta diagnostica `window.ZonaOrientaleCalciomercatoPlayerModalV336`.

## Funzionalita da non perdere

- Matching giocatore conservativo V335.
- Modulo puro `calciomercato-players-v335.js`.
- Lettura archivio statico per timeline giocatore.
- Deduplica articoli V323.
- Card compatte V332.
- Fallback immagini V334/V330/V328.
- Fonti TMW squadra V329.
- Pannello Solo Admin V327.
- Listone V333/V331.
- Tutte le funzionalita globali elencate in `FUNZIONALITAV336.md`.

## Rischi principali

| Rischio | Mitigazione |
|---|---|
| Regressione navigazione hash | Il click nuovo non usa hash; hash legacy resta gestito e apre modal. |
| Modal non chiudibile su mobile | Sono presenti X, backdrop ed Escape. Testare viewport stretto. |
| Doppio scroll body/modal | `body.calciomercato-player-modal-open-v336` blocca lo scroll body; il contenuto timeline scrolla nel modal. |
| Falsi positivi giocatore | Non rendere il matching piu aggressivo senza task dedicato. |

## Regole operative obbligatorie

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Preservare tutte le funzionalita dell'ultimo merge su master.
- Ogni release futura deve includere handoff, `FUNZIONALITAVxxx.md` e doc release/refactor utile.
- Aggiornare sempre footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181`.
- Consegnare un solo zip con `zonaorientale/` e `docs/`; includere `netlify/` solo se modificato.

## Test minimi futuri

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```

## Prossimo passo consigliato

V337: estrarre in modo protetto il rendering delle card Calciomercato in un modulo dedicato, mantenendo il wrapper storico `renderCalciomercatoArticleCardV306` e verificando tag giocatore/modal V336.
