# REFACTOR V189 - Avvisi pubblicazione Admin

## Obiettivo

Aggiungere un sistema di promemoria operativo dopo modifiche effettuate da Admin, per evitare che dati aggiornati su Firebase tornino vecchi dopo refresh/logout perché i JSON statici GitHub non sono stati rigenerati e committati.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `docs/zonaorientale/REFACTOR_V189.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V189.md`

## Funzionalità

In Admin viene mostrato un pannello “Pubblicazione dati”.

Quando l'admin modifica o cancella dati rilevanti, il sito registra un avviso locale persistente in `localStorage` e indica quali passaggi fare:

- `Admin → Snapshot pubblici → Aggiorna tutto`
- `Scarica config pubblica`
- `Scarica overlay snapshot stagioni`
- `Scarica honor JSON`
- applicazione overlay statici nella repo
- commit/push

Il sistema intercetta form admin e cancellazioni principali:

- stagioni/config
- presidenti
- squadre
- squadre per stagione
- stadi
- competizioni
- partite/risultati
- FIFA Ranking
- movimenti FM
- comunicati
- import rose statiche
- convertitori rose/listone/competizioni statiche

## Mobile

Il pannello è responsive:

- layout a colonna su mobile
- bottone “Segna come pubblicato” a larghezza piena
- testi lunghi con `overflow-wrap: anywhere`

## Note tecniche

- Chiave `localStorage`: `zonaOrientaleAdminPublicationRemindersV189`
- Nessuna scrittura Firebase.
- Nessuna lettura Firebase aggiuntiva.
- Il pannello è solo una guida operativa persistente lato browser.
- “Segna come pubblicato” cancella gli avvisi locali dopo che admin ha effettivamente scaricato/committato i JSON statici.

## Test

- `node --check static/zonaorientale/assets/app.js`
- validazione sintassi JS asset principali
- validazione JSON asset principali
