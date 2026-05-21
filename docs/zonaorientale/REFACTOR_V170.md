# Refactor V170 - Fantamercato lazy e meno letture Firebase

Data: 2026-05-21
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Ridurre le letture Firebase del caricamento pubblico evitando che le raccolte del Fantamercato vengano lette al bootstrap della webapp.

## Modifica

Il caricamento di:

```text
transferListings
transferNegotiations
```

non parte piu automaticamente dopo `loadData`.

Ora il Fantamercato viene caricato solo quando serve:

- apertura pagina `#fantamercato`;
- apertura `#teamarea` per utenti loggati/admin;
- apertura della propria pagina squadra, per mantenere coerenti badge e azioni mercato.

La chiamata bootstrap finale a `ensureTransferMarketDataV119()` e stata neutralizzata e sostituita da un wrapper V170.

## Effetto sulle letture

Un visitatore pubblico che apre dashboard, rose, listone, news, albo o competizioni non legge piu automaticamente i documenti attivi di `transferListings`.

Le query ottimizzate introdotte nelle versioni precedenti restano invariate quando il mercato viene effettivamente aperto:

```text
transferListings: seasonId == stagione corrente + status == ACTIVE
transferNegotiations: solo utente/squadra coinvolta, oppure admin
```

## File modificati

```text
static/zonaorientale/assets/app.js
static/zonaorientale/index.html
docs/zonaorientale/REFACTOR_V170.md
```

Nota: nel pacchetto overlay la documentazione e inclusa sotto `docs/zonaorientale/REFACTOR_V170.md`.

## Rischio

Basso/medio: il comportamento utente resta uguale, ma il caricamento del mercato diventa differito.

Punti da verificare:

- `#fantamercato` deve mostrare caricamento e poi trasferibili;
- `#teamarea` con account presidente deve mostrare trattative e proposta;
- pagina squadra del proprio club deve aggiornare badge/azioni mercato dopo il caricamento lazy;
- dashboard pubblica non deve piu leggere il mercato al bootstrap.

## Test consigliati

```text
/zonaorientale/#dashboard
/zonaorientale/#fantamercato
/zonaorientale/#teamarea
/zonaorientale/#clubs
```

Da DevTools / Firebase usage controllare che su `#dashboard` pubblico non partano query a `transferListings` o `transferNegotiations`.
