# AI Assistant Handoff - ioSudo V714

## Base

- Base precedente: V713
- Excel sorgente: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-18_aggiornamento_globale_v68.xlsx`
- Versione prodotta: V714

## Aggiornamenti principali

1. **Khephren Thuram / K. Thuram**
   - Confermata equivalenza.
   - In rosa Juventus e negli XI viene usato `Khephren Thuram`.
   - Il badge SOS resta attivo e viene agganciato correttamente anche alla formazione.

2. **Ederson - Atalanta**
   - Inserito rinnovo ufficiale da fonte club Atalanta.
   - Chiuse le voci/rinnovo/uscita non ufficiali.
   - Nessun rumor attivo residuo su Ederson.

3. **Trattative V68 non ufficiali**
   - Christ Inao Oulai / Fiorentina
   - Trevoh Chalobah / Como
   - Kieron Bowie / Cagliari
   - Kieron Bowie / Sassuolo
   - Antonino Gallo / Genoa
   - Nico Gonzalez / Juventus
   - Cabal / Juventus
   - Pierre-Emile Hojbjerg / Milan
   - Walid Cheddira / Napoli

4. **Amichevoli**
   - Controllo V68 effettuato: nessuna nuova gara giocata con tabellino da aggiungere.
   - Resta attiva la scheda cliccabile di Sassuolo-Alta Anaunia con 26 righe giocatore.

## Audit

Comandi eseguiti:

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v714.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v714.mjs
```

Esito: OK.

## Conteggi V714

Vedere `docs/COUNTS_V714.json`.

## Duplicati

- Duplicati esatti in rosa: 0
- ID giocatori duplicati: 0
- Rumor attivi su ufficialità: 0
- Potenziali duplicati da confermare dall'utente: 10, salvati in `duplicateNameCandidatesV714`.
