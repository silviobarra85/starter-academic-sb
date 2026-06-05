# Release V334 - Refactor immagini Calciomercato

Data: 05/06/2026
Tipo: refactor protetto

## Modifiche

- Aggiunto `assets/js/calciomercato/calciomercato-images-v334.js`.
- Collegato il modulo da `assets/app.js` con cache-buster V334.
- Sostituite le funzioni immagini/testi inline con wrapper verso il modulo.
- Aggiunta diagnostica `window.ZonaOrientaleCalciomercatoImagesV334`.
- Aggiornato `check-zonaorientale.sh` per verificare modulo e documentazione V334.
- Aggiornati footer e cache-buster a V334.

## Nessun cambio funzionale intenzionale

La V334 non cambia:

- card Calciomercato;
- feed RSS/HTML;
- fallback immagini;
- filtri;
- download archivio;
- Netlify Functions;
- dati JSON;
- Listone/Rose/Admin/Fantamercato/Presidente.

## Documenti

- `FUNZIONALITAV334.md`
- `handoff/HANDOFF_NUOVO_ASSISTENTE_V334.md`
- `refactor/CALCIOMERCATO_IMAGES_REFACTOR_V334.md`
- `release/RELEASE_V334_CALCIOMERCATO_IMAGES_REFACTOR.md`

## Check

Eseguire:

```bash
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```

