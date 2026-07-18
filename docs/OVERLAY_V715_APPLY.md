# Overlay ioSudo V715 - Apply

Versione: **V715**  
Base consigliata: **V714**  
Excel sorgente: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-18_aggiornamento_globale_v69.xlsx`

## Applicazione

Dalla radice del progetto:

```bash
cp -R overlay_iosudo_v715/static/* static/
cp -R overlay_iosudo_v715/docs/* docs/
```

Poi verificare:

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v715.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v715.mjs
```

## Note

- L'overlay contiene solo i file modificati.
- Aggiorna `static/iosudo/index.html` per caricare JS/CSS V715.
- Aggiorna `static/iosudo/sw.js` alla cache `iosudo-shell-v715`.
- Mantiene la scheda cliccabile di Sassuolo-Alta Anaunia con tabellino giocatori.
