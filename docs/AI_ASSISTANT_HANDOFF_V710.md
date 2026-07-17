# AI Assistant Handoff - ioSudo V710

Versione corrente: **V710**.

Fonte: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-17_aggiornamento_globale_v64.xlsx`.

## Cosa è stato aggiornato

- Genoa: **Hamed Junior Traorè** inserito come ufficialità da Olympique Marsiglia e aggiunto in rosa.
- Lazio: **Bruno Galassi** inserito come ufficialità dal Real Madrid, giovane/prospetto, non slot attivo finché non entra stabilmente in listoni/gerarchie.
- Napoli: **Buongiorno** rafforzato come SOS/infortunato con consulto chirurgico da fonte ufficiale Napoli.
- Lazio: **Patric** rafforzato con fonte puntuale ufficiale Lazio.
- Regola post-ufficialità: i giocatori ufficiali non restano nei rumor attivi.
- Amichevoli: nessuna nuova gara giocata; resta la scheda Sassuolo-Alta Anaunia con 26 righe giocatore.

## Conteggi

- Squadre: 20
- Giocatori: 777
- Ufficialità attive: 365
- Trattative attive: 459
- Rumor attivi su ufficiali: 0
- Infortunati attivi: 22
- Amichevoli: 117
- Tabellini dettagliati: 1
- Duplicati esatti giocatori: 0

## Audit

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v710.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v710.mjs
```
