# Refactor V217 - Cache fix classifica campionato completa

## Sintesi

V217 è una patch correttiva di V216. La logica della classifica completa era presente, ma alcuni asset potevano rimanere in cache perché il modulo Admin importato da `app.js` non aveva query di versione, e la pagina `competition.html` veniva aperta senza parametro di versione.

## Interventi tecnici

### Admin competizioni

`assets/app.js` importa ora il modulo con cache-buster:

```js
import { createAdminCompetitionHelpersV131 } from "./js/admin/admin-competitions.js?v=217";
```

Questo forza il caricamento del modulo che genera la tabella Admin completa con i campi:

- PUNTI
- PG
- V
- N
- P
- GF
- GS
- DR
- FPT

### Pagina singola competizione

`getCompetitionOpenUrlV111()` aggiunge `v=217` alla query string, per evitare riuso di HTML/cache vecchi quando si apre una competizione campionato.

### CSS mobile

Aggiunti override di sicurezza su `styles.css`, `competition-detail-v130.css`, `admin-v130.css` e `mobile-suite-v168.css` per mantenere tutte le colonne visibili come celle tabellari, con scroll orizzontale su mobile.

## Validazione richiesta

- Aprire Admin → Risultati competizioni.
- Selezionare una competizione di tipo Campionato/Classifica.
- Verificare che siano presenti tutti i campi: POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT.
- Salvare alcuni valori e aprire la competizione dal sito pubblico.
- Verificare che la pagina singola mostri tutte le colonne anche da mobile tramite scroll orizzontale.
