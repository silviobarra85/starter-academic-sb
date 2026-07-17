# AI Assistant Handoff - ioSudo V713

Versione corrente: **V713**.

Fonte: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-17_aggiornamento_globale_v67.xlsx`.

## Cosa è stato aggiornato

- Nessuna nuova ufficialità club aggiunta.
- Nessuna nuova amichevole giocata da compilare.
- **Hamed Junior Traorè** aggiunto in `injuriesByTeam.genoa` come monitoraggio fisico/SOS prudenziale da Transfermarkt.
- La riga rosa esistente di **Hamed Junior Traorè** è stata aggiornata, senza creare duplicati.
- Il badge **SOS** per Hamed è attivo sul player; resta una segnalazione non ufficiale, non uno stop certo.
- Aggiunte 2 fonti V67: controllo calendario amichevoli Sky e Transfermarkt infortunati Serie A.
- Confermata la regola: i giocatori con ufficialità attiva non devono restare nei rumor/trattative attive.

## Conteggi

- Squadre: 20
- Giocatori: 777
- Ufficialità attive: 366
- Trattative attive: 452
- Rumor Transfermarkt: 48
- Rumor attivi su ufficiali: 0
- Infortunati/monitoraggi SOS attivi: 23
- Amichevoli: 117
- Tabellini dettagliati: 1
- Righe tabellino giocatori: 26
- Fonti: 629
- Duplicati esatti giocatori: 0
- XI SOS da player: sì

## Audit

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v713.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v713.mjs
```
