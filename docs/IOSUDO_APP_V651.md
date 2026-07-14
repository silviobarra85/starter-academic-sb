# ioSudo V651 - Performance GIOCATORI, RUMOR e UFFICIALITA

Versione: V651  
Data: 2026-07-14

## Obiettivo

Velocizzare le tre viste piu lente di ioSudo: `GIOCATORI`, `RUMOR` e `UFFICIALITA`, senza modificare il dataset V649/V23 e senza riattivare la sezione pubblica Per i SUDATORI.

## Interventi

- `GIOCATORI` passa a una lista compatta: non ricostruisce piu tutti i collegamenti mercato/SOS per centinaia di giocatori appena si apre la vista.
- I dettagli completi restano disponibili aprendo la scheda del singolo giocatore.
- Le righe di `RUMOR` e `UFFICIALITA` usano fonti compatte: prima fonte visibile e contatore `+N`, invece di generare subito tutti i chip fonte.
- `GIOCATORI` parte da 36 card, espandibili con `Mostra altre voci`.
- `RUMOR` e `UFFICIALITA` partono da 40 righe, espandibili con `Mostra altre voci`.
- Cache HTML per le righe di mercato gia renderizzate.
- Service worker aggiornato a `iosudo-shell-v651`.

## File principali

- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/js/apps/iosudo-app-v651.js`
- `static/fanta-engine/css/iosudo-app-v651.css`
- `static/fanta-engine/tools/audit-iosudo-v651.mjs`

## Note

Questo overlay non cambia i dati. Rimane valido il dataset corrente installato con V649/V23. La sezione pubblica Per i SUDATORI resta disattivata.
