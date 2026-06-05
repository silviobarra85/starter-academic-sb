# Release V366 - Hardening trattative e notifiche

## Obiettivo

Rafforzare il dominio trattative/notifiche senza riscrivere il flusso esistente e senza rimuovere funzionalita'.

La V366 nasce dopo il fix V364 sulle simulazioni Admin verso presidente e dopo la stabilizzazione V365. L'intervento centralizza la normalizzazione degli stati e rende piu' esplicita la distinzione tra trattative reali Firebase e simulazioni local-only.

## Vincoli rispettati

- Nessuna funzionalita' rimossa.
- Nessun file runtime eliminato.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Nessuna nuova scrittura Firebase per le simulazioni local-only.
- Le trattative reali continuano a usare il flusso Firebase gia' esistente.
- Le simulazioni V255/V349/V361/V362/V364 restano local-only.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/player.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/market/transfer-market.js`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md`
- `docs/zonaorientale/CURRENT_STATE.md`
- `docs/zonaorientale/release/RELEASE_V366_HARDENING_TRATTATIVE_NOTIFICHE.md`
- `docs/zonaorientale/audit/TRADE_DOMAIN_HARDENING_MATRIX_V366.md`
- `docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V366.md`

## Modifiche runtime

### Normalizzazione stati trattativa

Aggiunta normalizzazione centralizzata per evitare divergenze tra card, badge e azioni.

Mapping principale:

- `PENDING`, `IN ATTESA`, `WAITING`, `OPEN` -> `PENDING`
- `ACCEPTED`, `APPROVED`, `ACCETTATA`, `APPROVATA` -> `ACCEPTED`
- `REJECTED`, `DECLINED`, `REFUSED`, `RIFIUTATA`, `RESPINTA` -> `REJECTED`
- `CANCELLED`, `CANCELED`, `ANNULLATA`, `DELETED`, `REMOVED` -> `CANCELLED`

### Helper mercato/trattative

In `assets/js/market/transfer-market.js`:

- `getNegotiationById` ora confronta gli ID come stringhe, evitando mismatch tra ID numerici/stringa.
- `renderNegotiationStatusBadge` usa lo stato normalizzato.
- `renderNegotiationCard` usa lo stato normalizzato per decidere se mostrare `Annulla`, `Approva` e `Rifiuta`.
- Esportati helper `normalizeNegotiationStatus` e `getNegotiationStatusLabel`.

### Wrapper V366 in app.js

Aggiunto marker:

```js
window.ZonaOrientaleTradeDomainHardeningV366
```

Il wrapper:

- normalizza lo status prima di chiamare il flusso esistente `updateNegotiationStatusV119`;
- accetta solo azioni finali valide: `ACCEPTED`, `REJECTED`, `CANCELLED`;
- classifica le righe come `firebase-real` o `local-simulation`;
- mantiene la sincronizzazione localStorage delle simulazioni target V364;
- aggiorna i badge trattative dopo l'azione.

## Cosa non cambia

- Il submit di una nuova proposta reale resta invariato.
- I permessi Firebase non vengono cambiati.
- L'Admin non viene riscritto.
- Le pagine pubbliche, listone, rose, competizioni, player e calciomercato non cambiano logica.
- Nessuna eliminazione di file legacy.

## Verifiche eseguite

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
```

## Smoke test runtime da console

Dopo apertura del sito:

```js
ZonaOrientaleTradeDomainHardeningV366.runSmokeTest()
```

Atteso: `ok: true`.

## Test manuale consigliato

1. Aprire sito e verificare footer V366.
2. Login Admin.
3. Aprire Checklist QA Admin.
4. Creare simulazione trattativa verso un presidente.
5. Login come presidente destinatario nello stesso browser.
6. Accettare o rifiutare.
7. Verificare che la card resti `Accettata` o `Rifiutata` e non torni `In attesa`.
8. Verificare che il badge ricevute si spenga.
9. Creare/visualizzare una trattativa reale solo se l'ambiente Firebase lo consente.
10. Aprire una competizione e una scheda giocatore per controllo regressione base.
