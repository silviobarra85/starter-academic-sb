# Overlay V659 - Card mobile per Listone e Rose sito

Overlay solo sito.

## Obiettivo

Alleggerire la navigazione da smartphone nelle tabelle piu lunghe del sito, applicando lo stesso principio usato in ioSudo: rendering compatto a card e caricamento progressivo.

## Modifiche

- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/zonaorientale/index.html`
- `static/fantapetillomantramanager/index.html`
- `static/fanta-engine/css/site-performance-v659.css`
- `static/fanta-engine/tools/audit-site-mobile-cards-v659.mjs`

## Cosa fa

- Su desktop lascia le tabelle come prima.
- Su smartphone converte la tabella Listone in card compatte.
- Su smartphone converte la tabella Movimenti/Rose in card compatte.
- Su smartphone converte il dettaglio giocatori di una Rosa in card compatte.
- Mostra solo un primo blocco e aggiunge `Mostra altre voci` / `Mostra altri giocatori`.
- Mantiene attivi i filtri esistenti di Listone e Rose.

## Comandi

```bash
cp -R ~/Downloads/fantacalcio_overlay_site_mobile_cards_v659/static/* static/
cp -R ~/Downloads/fantacalcio_overlay_site_mobile_cards_v659/docs/* docs/
```

## Audit

```bash
node static/fanta-engine/tools/audit-site-mobile-cards-v659.mjs
node --check static/zonaorientale/assets/app.js
node --check static/fantapetillomantramanager/assets/app.js
```
