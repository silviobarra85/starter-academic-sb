# V536 - Restore native navigation speed

## Obiettivo

L'utente ha segnalato che il passaggio tra pagine e' diventato troppo lento e ha chiesto di riportarlo alla fluidita' iniziale della collaborazione.

## Decisione tecnica

V536 disattiva dal runtime i moduli sperimentali introdotti per osservare o forzare la navigazione:

- `quick-navigation-smoke-v532.js`
- `navigation-active-singleton-v534.js`
- `navigation-fluidity-v535.js`

I file possono restare nella repository come storico, ma non vengono piu' importati da `app.js` e non sono piu' pre-caricati dagli `index.html` delle leghe.

## Cosa resta attivo

Restano attivi i percorsi gia' stabili:

- router storico locale in `setupNavigation`;
- `navigation-actions-v510`;
- `navigation-data-refresh-v511`;
- `public-data-autoload-v512` stabilizzato fino a V526;
- asset comuni Listoni/Calciomercato in `shared-assets/current`;
- renderer locali Dashboard/Admin/Presidente.

## Cosa non cambia

- Nessun cambio Firebase.
- Nessun cambio EmailJS.
- Nessuno spostamento dati.
- Nessuna cancellazione fallback locali.
- Nessuna modifica a `FUNZIONALITA'.md`.
- Nessuna sostituzione del router.

## Verifica

```bash
node static/fanta-engine/tools/audit-native-navigation-speed-v536.mjs
```

## Test manuale

Cliccare rapidamente:

```text
Dashboard -> News -> Rose -> Bilanci -> Calciomercato -> Listone -> Sorteggio giornate
```

Il cambio deve tornare immediato o quasi immediato, senza observer/timer aggiuntivi che appesantiscono il passaggio pagina.
