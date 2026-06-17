# V458 - Kit setup dati reali FantaPetilloMantraManager

Questa patch aggiunge una card Admin opzionale, selezionabile dal selettore card Admin, per scaricare i template dati reali 2026-2027.

File disponibili nel clone:

- `assets/setup/fantapetillo-real-teams-template-v458.csv`
- `assets/setup/fantapetillo-real-teams-template-v458.json`

Campi principali:

- presidente
- email presidente
- nome squadra
- slug squadra
- budget iniziale FM
- livello stadio
- logo
- UID Authentication, quando disponibile

La card non scrive su Firebase. Prima si compilano i template, poi si inseriscono i dati reali da Admin o tramite una futura procedura di seed controllata.

Area Squadra resta protetta fino alla creazione di `teamUsers` reali e degli snapshot pubblici iniziali.
