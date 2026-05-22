# V157 - Hotfix rose mobile e presidenti

Data: 2026-05-21
Branch: feature/zonaorientale-competizioni-statiche

## Obiettivo

Correggere il blocco introdotto in V156 e completare la card mobile delle rose.

## Modifiche

- Risolto errore JavaScript `Unexpected token '||'` causato dal mix non parentetizzato di `??` e `||`.
- Nella griglia mobile delle rose, ogni blocco mostra ora anche il nome del presidente o dei presidenti.
- Corretto un uso errato di `join()` su una stringa presidente nel dettaglio mobile della rosa.
- Aggiornato cache busting a `v=157`.

## Note console

Gli errori `lockdown-install.js`, `SES Removing unpermitted intrinsics` e `message channel closed` sono tipicamente generati da estensioni del browser. L'errore reale del sito era `Unexpected token '||'`, corretto in questa versione.

## Test consigliati

- `/zonaorientale/`
- `/zonaorientale/#clubs` da mobile
- apertura dettaglio rosa dalla griglia mobile
- verifica che ogni blocco mostri logo, nome squadra e presidenti
