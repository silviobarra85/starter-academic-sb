
## Aggiornamento V487 - CSS comuni nel motore centrale (24/06/2026)

- Runtime avanzato a V487 con footer/cache-buster coerenti.
- I CSS comuni identici sono copiati in `static/fanta-engine/css/shared/v487/` e caricati come sorgente primaria.
- Le copie locali restano presenti e fungono da fallback.
- Nessun JS runtime viene centralizzato in questa versione.
- Nessuna modifica a Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra, news, regolamenti, bilanci, listoni o calciomercato.

# FantaMantraManager - Funzionalita' e changelog consolidato

Aggiornato alla **V484**.

## Funzionalita' pubbliche principali

- Home/dashboard pubblica con brand FantaMantraManager.
- Logo FantaMantraManager accanto al nome nella dashboard.
- Favicon, Apple Touch icon, Android icon e immagine social dedicate.
- News dedicate FantaMantraManager, separate da ZonaOrientale.
- Regolamento 2026-2027 dedicato con PDF scaricabile e pagina regolamento aggiornata.
- Competizioni, dettaglio competizione e pagina giocatore.
- Bilanci, listone, rose, fantamercato e calciomercato ereditati dal motore parametrizzato.
- Tool pubblico Sorteggio giornate, con esclusioni, range 1-38, seed e JSON riproducibile.
- Menu mobile `Altro` alimentato dal registry comune e presentazione runtime V481.

## Funzionalita' Admin

- Admin collegato al Firebase dedicato `fantapetillomantramanager`.
- Selettore card Admin per mostrare/nascondere pannelli operativi.
- Workflow dati reali: template, validatore, preview seed, import controllato e generatore snapshot pubblici.
- Checklist readiness Area Squadra e checklist pubblicazione/share.
- Pannello Admin per Proposte regolamento, con cambio stato e nota Admin.
- Dashboard Presidente non viene mostrata quando il login corrente e' Admin.

## Funzionalita' presidente / Area Squadra

- Area Squadra sbloccata in V476.
- Dashboard Presidente visibile ai presidenti, non ad Admin.
- Card `Svincola Giocatori` attiva in V478.
- Card `Comunicato avvenuto scambio` attiva in V478.
- `Svincola Giocatori` compone il corpo mail nel sito e usa template EmailJS generico.
- `Comunicato avvenuto scambio` usa template dedicato EmailJS.
- Proposte regolamento salvate in Firestore nella collection `ruleProposals`.

## Changelog recente consolidato

### V484 - Inventario asset comuni listone/calciomercato

- Aggiunto inventario osservativo dei candidati comuni listone/calciomercato.
- Risultato: 42 file candidati, 42 identici, 0 differenze.
- Aggiunto `static/fanta-engine/data/shared-assets-inventory-v484.json`.
- Aggiunto audit `static/fanta-engine/tools/audit-shared-assets-inventory-v484.mjs`.
- Nessun path runtime spostato e nessuna copia locale cancellata.

### V483 - Documentazione canonica FantaMantraManager

- Aggiunti documenti canonici `00`-`04` per ridurre dipendenza dagli handoff storici.
- Aggiunto handoff V483.
- Aggiornato README con indice canonico.
- Documentata la possibilita' di centralizzare listoni/calciomercato nel motore comune, senza spostarli in questa patch.
- Versione/cache-buster/footer aggiornati a V483 per tenere tracciata la release sul branch.

### V482 - Audit anti-contaminazione multi-lega

- Aggiunto audit comune per rilevare contaminazioni tra ZonaOrientale e FantaMantraManager.
- Controlli su footer, branding, news, regolamenti, EmailJS e ID lega.
- Corretto un residuo di label in ZonaOrientale.

### V481 - Motore comune presentazione

- Introdotto `league-presentation-v481.js` in `static/fanta-engine`.
- Centralizzati metadata, branding, footer e menu mobile `Altro`.
- Loader specifici per lega mantenuti con fallback locale.

### V480 - Registro sezioni unificato

- Introdotto `unified-section-registry-v480.js`.
- Registry di ZonaOrientale e FantaMantraManager trasformati in wrapper lega-specifici.
- Alias storici preservati.

### V479 - Proposte regolamento

- Aggiunta collection Firestore `ruleProposals`.
- Form presidente per nuova proposta/modifica/cancellazione/chiarimento.
- Liste `Le mie proposte` e `Tutte le proposte della lega`.
- Pannello Admin per aggiornare stato e nota.
- Rules dedicate da applicare manualmente.

### V478 - EmailJS card presidente

- Riattivate card `Svincola Giocatori` e `Comunicato avvenuto scambio`.
- Service EmailJS dedicato: `service_ttjf7js`.
- Destinatario FantaMantraManager: `barra.silvio@gmail.com`.
- Template scambio: `template_svkkhlr`.
- Template svincolo/generico: `template_e1o7z5e`.

### V477 - Dashboard Presidente

- Dashboard Presidente non renderizzata quando il login corrente e' Admin.
- Area Squadra e login/teamUsers preservati.

### V476 - Area Squadra

- Rimosso banner tecnico Admin bootstrap.
- Area Squadra resa visibile/sbloccata negli entrypoint del sito.

### V475 - Brand FantaMantraManager

- Nome pubblico aggiornato a FantaMantraManager.
- Logo inserito nella dashboard.
- Rimossa dicitura `LEGA FANTACALCIO IN CONFIGURAZIONE`.
- Logo usato come favicon/icona/social image.

### V474 - Regolamento 2026-2027

- Regolamento FantaMantraManager aggiornato con nuovo PDF 2026-2027.
- Pagina regolamento e link download aggiornati solo per FantaMantraManager.

### V473 - Sorteggio giornate

- Tool sorteggio giornate su entrambe le leghe.
- Input numero giornate, esclusioni, range 1-38 e seed riproducibile.

### V472 - Footer/news isolate

- Footer generato da config senza testo hard-coded del clone.
- News FantaMantraManager separate da ZonaOrientale.

## Funzionalita' da non perdere nei prossimi refactor

- Admin card visibility.
- Area Squadra sbloccata.
- Dashboard Presidente nascosta ad Admin.
- Card EmailJS presidente attive.
- Proposte regolamento in Firestore.
- Regolamento PDF V474.
- Brand/favicon V475.
- Sorteggio giornate V473.
- News separate V472.
