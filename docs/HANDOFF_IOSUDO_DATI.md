# Handoff ioSudo V785

## Stato applicazione

- ioSudo è temporaneamente disattivato.
- `/iosudo/` mostra una pagina `Site under construction` V785 e non avvia l'applicazione o i fetch dei payload.
- I redirect delle singole leghe restano validi e raggiungono la pagina centrale di manutenzione.
- Il service worker usa la cache `iosudo-maintenance-v785` e rimuove le precedenti cache ioSudo.

## Dati preservati

- I payload normalizzati V782 restano in `static/fanta-engine/data/sudatori/current/`.
- Gli asset applicativi V782 non vengono cancellati e potranno essere riutilizzati alla riattivazione.
- Il nuovo listone condiviso non viene ancora innestato nel catalogo ioSudo perché l'app resta disattivata; alla riattivazione servirà il matching integrale delle identità.

## Listoni condivisi

- Manifest canonico: `static/fanta-engine/data/shared-assets/current/assets/listoni/manifest.json`.
- Nuovo listone predefinito: `2026-08-05.json`, 494 giocatori attivi.
- Vecchio listone storico preservato: `2026-07-04.json`.
