# Handoff V482 - Audit anti-contaminazione multi-lega

## Contesto

Dopo V480 (registro sezioni unificato) e V481 (motore comune di presentazione), V482 aggiunge un audit condiviso per intercettare contaminazioni tra le due leghe prima del merge sul branch di stabilizzazione.

## Scope

Modifica multi-lega controllata:

- motore comune `static/fanta-engine`;
- config e pagine principali di ZonaOrientale;
- config e pagine principali di FantaMantraManager;
- documentazione di entrambe le leghe.

## Modifiche principali

- Nuovo file `static/fanta-engine/tools/audit-multileague-contamination-v482.mjs`.
- `currentVersion` aggiornato a V482 nei config attivi.
- Footer/cache-buster aggiornati a V482 dove presenti.
- Corretto `aria-label="Navigazione FantaMantra"` in ZonaOrientale, ora `Navigazione ZonaOrientale`.
- Nessun cambio a Firebase rules, Admin, Dashboard Presidente, EmailJS runtime, listoni, news data o regolamenti.

## Guardrail

- Non cancellare funzionalità.
- Non toccare `FUNZIONALITA'.md` se non richiesto esplicitamente.
- Non uniformare i dati legacy dei listoni senza richiesta: l'audit li documenta come fuori scope.
- FantaMantraManager mantiene il nome cartella/slug `fantapetillomantramanager` per non rompere URL e redirect.

## Verifica tecnica

Da `static`:

```bash
node fanta-engine/tools/audit-multileague-contamination-v482.mjs
```

Esito atteso: `43 OK, 0 FAIL`.
