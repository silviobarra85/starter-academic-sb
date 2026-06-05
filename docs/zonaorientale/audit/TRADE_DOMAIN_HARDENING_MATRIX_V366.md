# Matrix V366 - Hardening dominio trattative/notifiche

## Scopo

Controllare che la V366 rafforzi il flusso trattative senza staccare funzionalita' esistenti.

| Area | Stato | Note |
| --- | --- | --- |
| Trattative reali Firebase | Preservata | Il wrapper normalizza lo status e poi delega al flusso esistente. |
| Simulazioni local-only V255 | Preservata | Nessuna scrittura Firebase per righe `localOnly`. |
| Azioni locali V349 | Preservata | Il wrapper V366 passa stati normalizzati al wrapper V349. |
| Simulazioni Admin target V362/V364 | Preservata | La sync localStorage V364 viene richiamata anche dopo il wrapper V366. |
| Badge notifiche V238/V239/V246 | Rafforzati | La normalizzazione V238 viene reindirizzata a V366. |
| Card trattativa | Rafforzata | Rendering e pulsanti usano stati normalizzati. |
| ID trattative | Rafforzati | `getNegotiationById` confronta gli ID come stringhe. |
| Admin QA | Preservato | Badge pannello aggiornato a V366, logica non riscritta. |
| Listone | Non toccato | Solo cache-buster globale. |
| Rose | Non toccate | Solo cache-buster globale. |
| Competizioni | Non toccate | Solo footer/cache-buster. |
| player.html | Non toccato | Solo footer/cache-buster. |
| Calciomercato | Non toccato | Solo cache-buster globale. |
| Mobile navigation | Non toccata | Solo cache-buster globale. |
| File legacy | Non rimossi | Nessuna cancellazione in V366. |

## Controlli automatici

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/market/transfer-market.js
```

## Controlli console

```js
ZonaOrientaleTradeDomainHardeningV366.normalizeStatus('in attesa') === 'PENDING'
ZonaOrientaleTradeDomainHardeningV366.normalizeStatus('accettata') === 'ACCEPTED'
ZonaOrientaleTradeDomainHardeningV366.normalizeStatus('rifiutata') === 'REJECTED'
ZonaOrientaleTradeDomainHardeningV366.normalizeStatus('annullata') === 'CANCELLED'
ZonaOrientaleTradeDomainHardeningV366.runSmokeTest().ok === true
```

## Rischi residui

- Le trattative reali restano dipendenti dai permessi Firestore configurati.
- Se una riga Firebase contiene uno status non previsto, viene mostrato come valore normalizzato sconosciuto e non viene trattato come pendente.
- La piena verifica cross-device degli esiti reali richiede ambiente Firebase live.

## Esito

V366 idonea come hardening mirato prima di eventuali test automatici minimi V367.
