# V534 - Navigation active singleton

## Obiettivo

Correggere il caso osservato manualmente in cui, dopo un click su una sezione come `Sorteggio giornate`, il contenuto della nuova pagina viene mostrato ma il vecchio pulsante `Dashboard` resta visualmente acceso.

## Diagnosi

La navigazione storica aggiorna le classi `.active` in piu' punti del file `app.js`. Con i moduli di smoke/observer introdotti nella fase V527-V533, alcuni aggiornamenti tardivi possono lasciare un link precedente con classe `active` anche quando la pagina corrente e' gia cambiata.

## Soluzione

V534 aggiunge il modulo comune:

```text
static/fanta-engine/js/ui/navigation-active-singleton-v534.js
```

Il modulo e' additive-only e fa solo una normalizzazione visuale dello stato nav:

- legge la pagina corrente da hash, sezione `.app-page.is-active` o `state.currentPage`;
- rimuove `.active` dai link che non corrispondono alla pagina corrente;
- aggiunge `.active` solo ai link della pagina corrente;
- aggiorna `aria-current="page"` sui link attivi;
- mantiene il comportamento mobile del tasto `Altro`;
- pubblica `window.FantaEngineNavigationActiveSingletonLastReportV534`.

## Cosa non cambia

- Non cambia hash.
- Non chiama `setAppPage`.
- Non renderizza dati.
- Non sostituisce la navigazione esistente.
- Non tocca Firebase.
- Non tocca EmailJS.
- Non tocca Admin/Presidente.
- Non tocca Listoni/Calciomercato condivisi.
- Non cancella fallback locali.
- Non modifica `FUNZIONALITA'.md`.

## Verifica manuale

1. Aprire ZonaOrientale e FantaPetilloMantraManager.
2. Cliccare rapidamente Dashboard, Listone, Calciomercato, Sorteggio giornate, Regolamento.
3. Verificare che non restino due pulsanti desktop accesi contemporaneamente.
4. In console controllare:

```js
window.FantaEngineNavigationActiveSingletonLastReportV534
```

Il report deve indicare `mutatesHash: false`, `callsSetAppPage: false` e `replacesNavigation: false`.

## Audit

```bash
node static/fanta-engine/tools/audit-navigation-active-singleton-v534.mjs
```
