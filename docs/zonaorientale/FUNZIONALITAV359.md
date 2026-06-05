# FUNZIONALITAV359 - Diagnostica giocatori Calciomercato

Versione: V359
Data: 2026-06-05

## Obiettivo

Migliorare in modo conservativo il riconoscimento dei giocatori negli articoli Calciomercato e aggiungere una diagnostica Admin/QA per capire quanti articoli vengono associati ai giocatori dell'ultimo listone della stagione selezionata.

## Funzionalita aggiunte

- Nuovo modulo `assets/js/calciomercato/calciomercato-players-v359.js`.
- Matching giocatore preservato da V340 e ampliato con:
  - forma compatta per nomi con apostrofi/spazi, ad esempio `N'Doye` / `Ndoye`;
  - alias configurati nei dati giocatore, se presenti (`aliases`, `nickname`, `shortName`, ecc.);
  - diagnostica articoli associati/non associati.
- Nuova diagnostica runtime:
  - `window.ZonaOrientaleCalciomercatoPlayerMatchingV359`;
  - `window.ZonaOrientaleCalciomercatoPlayerDiagnosticsV359`.
- Nuovo controllo nella Checklist QA Admin:
  - `Diagnostica articoli associati/non associati ai giocatori V359`.

## Funzionalita preservate

- Calciomercato feed RSS/HTML TMW.
- Archivio statico Calciomercato.
- Card articolo compatte.
- Tag giocatore sopra il titolo.
- Timeline giocatore in modal V336.
- Falsi positivi V340 evitati, ad esempio `Giovane` giocatore vs `giovane` aggettivo.
- Filtri Calciomercato V339.
- Pannello Solo Admin V340.
- Listone, Rose, Competizioni, Fantamercato, Admin, Firebase/Auth/EmailJS e Netlify Functions.

## Note di sicurezza

La V359 non scrive su Firebase, non modifica `links.json`, non modifica gli archivi JSON e non cambia la Netlify Function.

`docs/zonaorientale/FUNZIONALITA'.md` non e' stato modificato.
