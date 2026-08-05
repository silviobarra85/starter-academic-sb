# Handoff ioSudo V786

## Stato applicazione

- ioSudo è temporaneamente disattivato.
- `/iosudo/` mostra una pagina `Site under construction` V786 e non avvia applicazione o fetch dei payload.
- I redirect delle singole leghe restano validi e raggiungono la pagina centrale di manutenzione.
- Il service worker usa la cache `iosudo-maintenance-v786` e rimuove le precedenti cache ioSudo.

## Dati preservati

- I payload normalizzati V782 restano in `static/fanta-engine/data/sudatori/current/`.
- Gli asset applicativi V782 non vengono cancellati e potranno essere riutilizzati alla riattivazione.
- La V786 modifica soltanto la sincronizzazione rose/listone dei siti di lega; non ricostruisce il catalogo ioSudo.

## Listoni condivisi

- Manifest canonico: `static/fanta-engine/data/shared-assets/current/assets/listoni/manifest.json`.
- Listone predefinito 2026-2027: `2026-08-05.json`, 494 giocatori attivi.
- Listone storico preservato: `2026-07-04.json`.
- Alla riattivazione, ioSudo dovrà adottare lo stesso principio V786: identità per nome/squadra/ruolo e non tramite riuso automatico degli ID Fantacalcio.
