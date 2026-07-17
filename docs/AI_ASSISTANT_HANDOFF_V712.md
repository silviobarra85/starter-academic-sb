# AI Assistant Handoff - ioSudo V712

Versione corrente: **V712**.

Fonte: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-17_aggiornamento_globale_v66.xlsx`.

## Cosa è stato aggiornato

- Nessuna nuova ufficialità club aggiunta.
- Nessuna nuova amichevole giocata da compilare.
- Aggiunti/aggiornati rumor Transfermarkt del 17/07 in `transfermarktRumors` e `teamTransferTalksByTeam`.
- Rafforzata la trattativa **Mergim Vojvoda -> Udinese** come non ufficiale: visite mediche segnalate, ma rose invariate finché non esce comunicato/deposito affidabile.
- Archiviata la pista **Vojvoda/Cagliari** come superata.
- Aggiornata nota **Buongiorno**: consulto chirurgico da decidere, non intervento già confermato dal club.
- Patch UI: nella sezione squadra, il pitch **XI** mostra il badge **SOS** se il giocatore collegato ha SOS attivo, anche quando la riga formazione non conteneva direttamente il flag.

## Conteggi

- Squadre: 20
- Giocatori: 777
- Ufficialità attive: 366
- Trattative attive: 452
- Rumor Transfermarkt: 48
- Rumor attivi su ufficiali: 0
- Infortunati attivi: 22
- Amichevoli: 117
- Tabellini dettagliati: 1
- Duplicati esatti giocatori: 0
- XI SOS da player: sì

## Audit

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v712.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v712.mjs
```
