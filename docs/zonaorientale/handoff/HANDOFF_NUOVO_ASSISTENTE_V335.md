# Handoff nuovo assistente AI - V335

## Stato corrente

Versione runtime: V335.

V335 aggiunge tag giocatore nelle card Calciomercato e una pagina timeline per ogni giocatore riconosciuto. Il riconoscimento usa l'ultimo listone disponibile per la stagione selezionata.

## File chiave

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/calciomercato/calciomercato-images-v334.js
static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js
static/zonaorientale/assets/css/refactor/calciomercato.css
static/zonaorientale/assets/calciomercato/links.json
static/zonaorientale/assets/calciomercato/archive/manifest.json
static/zonaorientale/assets/listoni/manifest.json
```

## Funzionalita V335

- Tag giocatore sopra il titolo della card articolo, accanto a squadra/topic/status.
- Click su tag -> `#calciomercato-player-<slug>`.
- Pagina timeline dinamica `data-page="calciomercato-player"`.
- Timeline da articoli caricati + archivio statico disponibile.
- Matching conservativo su nome completo e cognome univoco.

## Regole operative obbligatorie

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Preservare tutte le funzionalita dell'ultimo master.
- Ogni release futura deve includere handoff, `FUNZIONALITAVxxx.md` e doc release/refactor utile.
- Quando si consegna zip, includere un solo zip con `zonaorientale/` e `docs/`.
- Se si modifica Netlify, includere anche `netlify/` nello zip e segnalarlo.
- Aggiornare sempre footer, cache-buster e `DEPLOY_EXPECTED_VERSION_V181`.

## Rischi principali

| Rischio | Nota |
|---|---|
| Falsi positivi giocatore | Non rendere il matching piu aggressivo senza test; evitare nomi brevi/soprannomi non univoci. |
| Conflitto hash | La route `calciomercato-player-*` deve restare riconosciuta da `isKnownStaticHashV43`. |
| Performance archivio | Il pool timeline legge l'archivio solo su click e lo cachea in sessione. |
| Dati listone | Non modificare JSON listoni per questa feature; il matching deve restare runtime. |

## Test minimi futuri

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-players-v335.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```

## Prossimo passo consigliato

V336: estrarre il rendering delle card Calciomercato in un modulo dedicato, preservando i wrapper `renderCalciomercatoArticleCardV306`, tag giocatore V335 e fallback immagini V334.
