# AI Assistant Handoff - ioSudo V711

Versione corrente: **V711**.

Fonte: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-17_aggiornamento_globale_v65.xlsx`.

## Cosa è stato aggiornato

- Sassuolo: **Tarik Muharemovic** marcato come ceduto ufficialmente al **Leeds United** a titolo definitivo.
- La riga rosa Sassuolo esistente è stata aggiornata: nessun duplicato creato, Probabile XI disattivato, stato `Ceduto ufficiale / fuori rosa attiva`.
- Chiuse le righe rumor/trattative attive su Muharemovic per Sassuolo/Juventus.
- Kolo Muani e Lucumì restano autonome/non ufficiali: non sono state chiuse per errore.
- Amichevoli: nessuna nuova gara giocata da compilare; resta cliccabile Sassuolo-Alta Anaunia con 26 righe giocatore.
- Infortuni: nessun nuovo infortunato ufficiale; Buongiorno resta SOS/infortunato dalla V710.

## Conteggi

- Squadre: 20
- Giocatori: 777
- Ufficialità attive: 366
- Trattative attive: 446
- Rumor attivi su ufficiali: 0
- Infortunati attivi: 22
- Amichevoli: 117
- Tabellini dettagliati: 1
- Righe tabellino giocatori: 26
- Duplicati esatti giocatori: 0
- Righe chiuse V711: 8

## Audit

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v711.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v711.mjs
```
