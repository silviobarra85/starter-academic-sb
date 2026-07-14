# ioSudo V650 - Performance navigazione

Versione: V650
Data: 2026-07-14

## Obiettivo

Velocizzare la navigazione interna di ioSudo senza cambiare i dati V649/V23 e senza rimuovere informazioni dall'app.

## Interventi

- Cache in memoria delle viste globali `RUMOR`, `UFFICIALITÀ`, `SOS` e `AMICHEVOLI`.
- Rendering progressivo delle liste lunghe con pulsante `Mostra altre voci`.
- Vista `GIOCATORI` inizialmente ridotta a 60 card, espandibile a blocchi.
- Viste mercato/SOS/amichevoli inizialmente limitate a 80/100 card, espandibili.
- Eliminati listener ricreati a ogni render nel pannello squadra/dettaglio giocatore: gestione delegata su un solo listener.
- CSS `content-visibility: auto` sulle card delle liste lunghe per alleggerire scroll e painting.
- Service worker aggiornato a `iosudo-shell-v650`.
- Navigazione HTML/ioSudo resa network-first nel service worker, così le versioni nuove della shell vengono recepite più facilmente.

## File principali

- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/js/apps/iosudo-app-v650.js`
- `static/fanta-engine/css/iosudo-app-v650.css`
- `static/fanta-engine/tools/audit-iosudo-v650.mjs`

## Note

I dati Sudatori/ioSudo non vengono modificati da questo overlay. Rimane valido il dataset corrente installato con V649.
