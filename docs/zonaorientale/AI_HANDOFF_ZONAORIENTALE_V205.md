# AI Handoff ZonaOrientale - V205

## Contesto

Il progetto è una webapp statica HTML/CSS/JS in `static/zonaorientale`. Dopo V171-V204 il sito usa JSON statici e snapshot per ridurre letture Firebase. V205 introduce una regola importante: alcuni dati sono live e non devono dipendere dai JSON statici.

## Regola dati aggiornata

- JSON statici GitHub: dati storici, stagioni, rose, competizioni statiche, honor snapshot.
- Snapshot Firebase: fallback compatto se manca JSON statico.
- Firebase live: comunicati (`news`), trasferibili (`transferListings`) e trattative (`transferNegotiations`).

Motivo: se un presidente pubblica un comunicato, mette un giocatore tra i trasferibili o riceve un'offerta, deve vederlo subito senza aspettare snapshot/admin.

## Modifiche tecniche V205

### Comunicati

Aggiunto `loadLiveNewsFromFirebaseV205()`, che legge `news` da Firebase dopo il caricamento pubblico/statico e aggiorna le superfici visive: News, dashboard e Dashboard Presidente. In caso di errore mantiene il fallback snapshot.

### Fantamercato

Aggiunto `ensureLiveTransferMarketForPresidentV205()`. In presenza di utente presidente approvato, Dashboard Presidente e Fantamercato caricano il mercato da Firebase tramite la pipeline esistente `ensureTransferMarketDataV119()`.

`getActiveTransferListingsV119()` è stato protetto: se il mercato live non è caricato, non deve mostrare trasferibili eventualmente presenti da snapshot vecchi.

### Archivio

Override di `renderSeasonArchiveV196()` per rimuovere la card `Partite recenti`. Restano:

- Squadre della stagione
- Albo della stagione
- Competizioni
- Timeline dati

## Attenzione per futuri interventi

Non riportare `news`, `transferListings` o `transferNegotiations` come sorgente primaria da snapshot statico. Possono restare negli snapshot per contesto storico, ma la UI operativa deve preferire Firebase live.

Ogni overlay deve aggiornare:

- Version footer in `index.html`
- cache-buster `v=...`
- `DEPLOY_EXPECTED_VERSION_V181`
- handoff AI

## Test consigliati

1. Login presidente.
2. Apri Dashboard Presidente.
3. Verifica che `In vendita` e `Trattative` non mostrino più `lazy` dopo il caricamento.
4. Pubblica un comunicato squadra e verifica che appaia senza rigenerare snapshot.
5. Apri Archivio e verifica che la sezione `Partite recenti` non ci sia più.
6. Controlla mobile.
