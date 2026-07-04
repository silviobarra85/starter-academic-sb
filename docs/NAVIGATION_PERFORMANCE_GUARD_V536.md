# V536 - Navigation performance guard

## Obiettivo

Correggere la lentezza percepita su ZonaOrientale senza tornare indietro rispetto a V535.

L'utente ha osservato che FantaPetilloMantraManager e' molto piu' fluido di ZonaOrientale. Questo indica che il problema non e' la navigazione in se', ma il peso dei render/refresh dati che ZonaOrientale attiva durante il cambio pagina.

## Diagnosi

ZonaOrientale contiene molti piu' dati reali/storici rispetto a FantaPetilloMantraManager: snapshot, rose, competizioni, calendari e storico. V535 migliora il feedback visuale, ma puo' anche avviare warm-up e refresh duplicati collegati a `navigation-fluidity-v535`.

Su FantaPetillo questi passaggi pesano poco. Su ZonaOrientale possono far percepire il cambio pagina come lento.

## Soluzione

V536 aggiunge:

```text
static/fanta-engine/js/ui/navigation-performance-guard-v536.js
```

Il modulo mantiene V535 attiva, ma intercetta i duplicati costosi:

- warm-up autoload V535 quando i dati della pagina sono gia' renderizzabili;
- refresh V511 avviati da `navigation-fluidity-v535` quando la pagina ha gia' dati e DOM sufficiente;
- retry di patch automatici per agganciarsi ai runtime installati piu' avanti nel bootstrap.

## Cosa non cambia

- Non cambia hash.
- Non chiama `setAppPage`.
- Non sostituisce router o navigazione locale.
- Non renderizza dati direttamente.
- Non tocca Firebase.
- Non tocca EmailJS.
- Non tocca Admin/Presidente.
- Non tocca Listoni/Calciomercato comuni.
- Non cancella fallback locali.
- Non modifica `FUNZIONALITA'.md`.

## Verifica manuale

1. Aprire ZonaOrientale.
2. Cliccare rapidamente Dashboard, News, Rose, Bilanci, Calciomercato, Listone, Sorteggio.
3. Il feedback del pulsante deve restare rapido come V535.
4. Il cambio pagina deve risultare piu' fluido di V535 su ZonaOrientale.
5. FantaPetilloMantraManager non deve peggiorare.

In console:

```js
window.FantaEngineNavigationPerformanceGuardLastReportV536
```

Il report deve indicare `replacesNavigation: false`, `callsSetAppPage: false`, `rendersDataDirectly: false`.

## Audit

```bash
node static/fanta-engine/tools/audit-navigation-performance-guard-v536.mjs
```
