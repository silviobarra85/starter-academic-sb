# Refactor V127 - CSS late refinements e helper loghi

Intervento prudente di pulizia codice, senza cambiare dati o logica funzionale.

## Modifiche

- Estratto il blocco CSS recente V119-V126 da `assets/styles.css` in `assets/css/refinements-v119-v126.css`.
- Mantenuto l'ordine di caricamento CSS: `styles.css` prima, refinements dopo.
- Estratti helper puri per fallback loghi squadra in `assets/js/domain/team-logos.js`.
- `assets/app.js` importa gli helper loghi invece di definire direttamente alias e normalizzazione.
- Aggiornato cache busting a V127.

## Obiettivo

Ridurre la crescita dei file principali e rendere piu sicuri i prossimi interventi:

- `styles.css` alleggerito di circa 900 righe.
- `app.js` leggermente alleggerito, senza toccare funzioni centrali come `loadData`, `renderAll`, stato globale o auth.

## Note

Questo step non rimuove file gia presenti in Git. Per rimuovere `.DS_Store` e cartelle `__MACOSX`, usare i comandi Git indicati nella risposta dell'assistente.
