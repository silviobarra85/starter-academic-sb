# REFACTOR V197 - Generatore comunicati automatici

## Obiettivo
Aggiungere un pannello admin mobile-first per generare bozze di comunicati partendo dai dati gia' caricati dal sito.

## Funzionalita'
- Nuovo pannello **Generatore comunicati automatici** in Admin.
- Template disponibili:
  - Risultati / riepilogo giornata
  - Vincitore competizione
  - Aggiornamento mercato
  - Focus squadra
  - Albo d'Oro / Palmarès
  - Aggiornamento dati pubblici
- Tono selezionabile: istituzionale, celebrativo, ironico leggero.
- Azioni: genera bozza, copia testo, inserisci nel form Comunicati.

## Letture Firebase
Il generatore non introduce letture Firebase extra: usa soltanto `state.raw` gia' popolato da JSON statici, snapshot pubblici o caricamento admin completo.

## Mobile
Il pannello usa controlli a griglia, card e textarea responsive. Su mobile i campi diventano a colonna e i bottoni vanno a tutta larghezza.

## Note operative
`Inserisci nei Comunicati` non salva automaticamente. Compila il form Comunicati esistente, poi l'admin deve controllare e premere **Salva comunicato**. Dopo il salvataggio restano necessari Snapshot pubblici e JSON statici come da flusso V189-V191.

## File modificati
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `docs/zonaorientale/REFACTOR_V197.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V197.md`
