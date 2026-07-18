# ioSudo V717

Overlay generato da `fantacalcio_serie_a_2026_27_aggiornato_2026-07-18_aggiornamento_globale_v72.xlsx`, base V716.

## Modifiche principali

- Applicati 10 alias duplicati confermati dall'utente dopo V716.
- Aggiornato Luigi Caccavo: prestito ufficiale alla Juve Stabia, riga Bologna marcata come fuori rosa attiva/slot non attivo.
- Aggiunta ufficialità in uscita Caccavo con fonte ufficiale Bologna.
- Consolidati 8 duplicati nelle ufficialità già presenti; il conteggio ufficialità è quindi netto/deduplicato.
- Rafforzate le uscite Udinese verso Watford per Iker Bravo, Jordan Zemura e Martin Payero da Sky Sport live 18/07; restano non ufficiali.
- Rafforzata Atalanta-Atalanta Under 23 con fonte ufficiale Atalanta; nessun tabellino giocatori perché non giocata al controllo V72.
- Nessun nuovo tabellino amichevole: resta Sassuolo-Alta Anaunia con 26 righe giocatore e scheda cliccabile.

## Controlli

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v717.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v717.mjs
```

Esito: audit OK.
