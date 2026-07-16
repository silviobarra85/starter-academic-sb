# Overlay V702 - Fix modulo/allenatore ioSudo

Patch mirata ioSudo: corregge la visualizzazione di Modulo e Allenatore nelle card squadra e nel pannello squadra.

## Perché serviva

Nel dataset `teams` contiene solo id/nome/abbr. Le informazioni su modulo e allenatore sono invece presenti in `formationsByTeam`. Il renderer leggeva solo `team.module` / `team.coach`, quindi mostrava fallback `Modulo -` e `Allenatore n.d.`.

## Cosa cambia

- `iosudo-app-v702.js` legge modulo e allenatore anche da `formationsByTeam`.
- `renderPitch` usa lo stesso modulo risolto dal fallback.
- Aggiornati cache-buster di `index.html` e service worker.
- Nessuna modifica ai dati.
