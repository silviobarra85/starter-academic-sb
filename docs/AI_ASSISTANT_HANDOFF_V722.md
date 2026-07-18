# AI Assistant Handoff - ioSudo V722

## Stato

V722 aggiorna la V721 con Excel V78.

## Modifiche principali

- Alias confermati V722: A. Sala, L. Berardi, Akarakiri, Akinsanmiro, Arokodare, Atta, Balbo, Baldanzi, Basic, Boga, più il typo Riccardo Oraolini/Riccardo Orsolini.
- Casale/Bologna: rimosso dagli infortunati attivi, status fisico rientrato/disponibile dopo Bologna-Arminia 0-4.
- Roberts Apsits/Inter e Lu. Pellegrini/Deportivo sono trattative non ufficiali.
- Basilea-Juventus resta live/parziale senza tabellino giocatore.
- Atalanta-U23 resta da ricontrollare post-gara.
- UI: `friendlyStatRow` collega il giocatore reale e apre `renderPlayerDetail`; la scheda giocatore mostra già `Amichevoli giocate`.

## Controlli richiesti

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v722.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v722.mjs
```
