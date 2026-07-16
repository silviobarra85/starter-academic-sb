# Overlay V699 - Frasi iconiche nel boot preloader

## Scopo
Aggiunge frasi iconiche tratte dal file `frasi_iconiche_whatsapp_lega_zonaorientale(1).txt` al messaggio sotto la rotella di caricamento del sito.

## Modifiche
- Aggiornato il boot preloader da V667 a V699 nelle due leghe.
- Aggiunte frasi random con nome dell'autore.
- Mantenute le frasi gia presenti.
- Randomizzazione delle frasi a ogni caricamento pagina.
- CSS del testo aggiornato per gestire frasi piu lunghe senza rompere il layout.

## File modificati
- `static/zonaorientale/index.html`
- `static/fantapetillomantramanager/index.html`
- `static/fanta-engine/js/ui/boot-preloader-v699.js`
- `static/fanta-engine/css/boot-preloader-v699.css`
- `static/fanta-engine/tools/audit-site-preloader-v699.mjs`

## Controlli
```bash
node static/fanta-engine/tools/audit-site-preloader-v699.mjs
node --check static/fanta-engine/js/ui/boot-preloader-v699.js
```
