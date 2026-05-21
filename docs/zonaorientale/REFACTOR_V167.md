# V167 - Mobile squadra e Palmarès

Data: 2026-05-21
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Rifinire alcune parti della nuova interfaccia mobile senza modificare la resa desktop.

## Modifiche

- In mobile, la sottosezione `Palmarès per competizioni` usa sfondo scuro e testo bianco, coerente con le altre sezioni scure.
- In mobile, in `Area squadra`, il blocco riepilogo `Utente / Ruolo / Stato` viene nascosto.
- Nel blocco `Area squadra` vengono mostrati direttamente:
  - nome squadra;
  - presidente/presidenti;
  - conteggio rosa e FM;
  - tasto `Apri pagina squadra`.
- In mobile, nella pagina/scheda squadra, le colonne `R (RM)`, `Sq` e `Qt.A` della tabella rosa sono ridotte di circa il 30%.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`

## File nuovi

- `static/zonaorientale/assets/css/mobile-hotfix-v167.css`
- `docs/zonaorientale/REFACTOR_V167.md`

## Note

La modifica è solo mobile tramite media query. Desktop invariato.
