# Matrice audit JS legacy V344

| File | Stato V344 | Motivazione | Azione |
| --- | --- | --- | --- |
| `assets/js/calciomercato/calciomercato-players-v335.js` | Rimosso | Superato da `calciomercato-players-v340.js`; nessun import runtime diretto | `git rm` se presente nella repo locale |
| `assets/js/calciomercato/calciomercato-players-v337.js` | Rimosso | Superato da `calciomercato-players-v340.js`; nessun import runtime diretto | `git rm` se presente nella repo locale |
| `assets/js/calciomercato/calciomercato-players-v340.js` | Attivo | Matching corrente con punteggiatura, maiuscole/minuscole e disambiguazione | Preservare |
| `renderCalciomercatoPlayerTagsV335` in `app.js` | Attivo | Wrapper pubblico usato dal renderer card V338 | Non rinominare |
| `activateCalciomercatoPlayerTimelineFromHashV335` in `app.js` | Attivo | Compatibilita hash/modal timeline V336 | Non rinominare |
| `normalizeCalciomercatoPlayerMatchValueV337` in `app.js` | Attivo | Wrapper normalizzazione usato con helper V340 | Non rinominare |

## Tool di verifica

```bash
static/zonaorientale/tools/audit-js-legacy-v344.mjs
```

## Esito atteso

- V340 presente.
- V335/V337 non presenti come file.
- Nessun import V335/V337 in `app.js`.
- Wrapper compatibili ancora presenti.
