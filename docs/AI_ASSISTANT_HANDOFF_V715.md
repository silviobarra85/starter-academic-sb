# AI Assistant Handoff - ioSudo V715

## Stato

- Versione prodotta: **V715**
- Base: **V714**
- Excel sorgente: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-18_aggiornamento_globale_v69.xlsx`
- Aggiornamento: `2026-07-18T09:05:00+02:00`

## Conteggi

- Squadre: 20
- Giocatori: 777
- Ufficialità attive: 367
- Trattative attive: 442
- Rumor Transfermarkt: 47
- Infortunati/SOS: 23
- Amichevoli: 117
- Tabellini amichevoli dettagliati: 1
- Righe tabellino giocatori: 26
- Fonti: 644
- Duplicati esatti giocatori: 0
- ID giocatori duplicati: 0
- Rumor attivi su ufficialità: 0

## Cose fatte

1. Applicati i 10 duplicati confermati dall'utente:
   - N. Gonzalez / Nico Gonzalez
   - Trevoh Chalobah / Chalobah
   - Christ Inao Oulai / Oulai
   - Gallo / Antonino Gallo
   - Cheddira / Walid Cheddira
   - Nicolussi Caviglia / Hans Nicolussi Caviglia
   - Y. Fofana / Youssouf Fofana
   - D. Berardi / Domenico Berardi
   - M. Kone / Manu Kone
   - L. Moro / Luca Moro
2. Aggiornate le fonti V69 su Belotti, Oulai, Vojvoda, Zaniolo e Roma esterni.
3. Aggiornata Basilea-Juventus con fonte ufficiale convocati, senza playerStats perché non giocata al controllo mattutino.
4. Salvati 10 nuovi candidati duplicato in `duplicateNameCandidatesV715` e `docs/IOSUDO_DUPLICATE_CANDIDATES_V715.md`.

## Verifiche

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v715.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v715.mjs
```

Output atteso: `Audit ioSudo V715 OK`.
