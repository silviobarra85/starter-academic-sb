# V553 - Cache applicativa e tabelle pesanti

## Obiettivo

Ridurre la lentezza percepita di ZonaOrientale, mantenendo FantaPetilloMantraManager invariato e senza cambiare funzionalita'.

V552 ha introdotto profiler, cache JSON in RAM e differimento dei refresh pesanti. V553 aggiunge un secondo livello conservativo:

- cache di sessione per JSON statici gia' scaricati;
- ottimizzazione rendering tabelle grandi con `content-visibility` sulle righe;
- observer leggero per tabelle create dopo click su Rose/Listone/Bilanci;
- nessuna sostituzione del router o dei renderer locali.

## File runtime

```text
static/fanta-engine/js/ui/application-cache-chunked-tables-v553.js
```

Runtime esposto:

```js
window.FantaEngineApplicationCacheChunkedTablesRuntimeV553
window.FantaEngineApplicationCacheChunkedTablesLastReportV553
```

## Guardrail

- Non cambia hash.
- Non chiama `setAppPage`.
- Non sostituisce il router.
- Non renderizza dati direttamente.
- Non scrive su Firebase.
- Non modifica EmailJS.
- Non tocca Admin o Presidente.
- Non ripristina fallback locali Listoni/Calciomercato.
- Non modifica `FUNZIONALITA'.md`.

## Verifica

```bash
node static/fanta-engine/tools/audit-application-cache-chunked-tables-v553.mjs
```

Esito atteso:

```text
Audit V553 superato: cache applicativa/sessione, ottimizzazione tabelle pesanti, runtime whole-site a ?v=553 e docs/handoff aggiornati.
```

## Test manuale consigliato

- Aprire ZonaOrientale.
- Passare Dashboard -> Rose -> Listone -> Bilanci -> Calciomercato.
- Ripassare sulle stesse sezioni: i JSON statici gia' letti dovrebbero essere riutilizzati nella sessione.
- Espandere una rosa con molti giocatori: la tabella deve restare corretta, ma il rendering deve pesare meno.
- Verificare FantaPetilloMantraManager per assenza regressioni.
