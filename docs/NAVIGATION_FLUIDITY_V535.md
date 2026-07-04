# V535 - Navigation fluidity

## Obiettivo

Rendere piu' fluido il passaggio tra una pagina e l'altra. Dopo V534 lo stato attivo dei pulsanti e' corretto, ma l'utente ha segnalato che il cambio pagina resta percepito come lento.

## Diagnosi

Il router storico aggiorna le sezioni in modo sincrono, ma ci sono tre elementi che possono far percepire il cambio come lento:

1. lo scroll smooth del router `setAppPageV42`, che rende il cambio visivo meno immediato;
2. i render/autoload dati che partono subito dopo il click e possono occupare il primo frame utile;
3. il MutationObserver ampio del singleton V534, utile per correggere lo stato attivo ma non necessario come controllo continuo dopo ogni mutazione.

## Soluzione

V535 aggiunge il modulo comune:

```text
static/fanta-engine/js/ui/navigation-fluidity-v535.js
```

Il modulo:

- anticipa il feedback visuale su `pointerdown` e `click`;
- pre-riscalda l'autoload dei dati pubblici per pagine come Dashboard, Listone e Calciomercato;
- accoda il refresh dati dopo il primo frame utile, cosi' il browser puo' mostrare prima il cambio pagina;
- converte lo `scrollTo({ behavior: 'smooth' })` del cambio pagina in `behavior: 'auto'` solo nei millisecondi immediatamente successivi a un click di navigazione;
- mette il singleton V534 in modalita' event/frame, disattivando il MutationObserver ampio quando presente.

## Cosa non cambia

- Non cambia hash.
- Non chiama `setAppPage`.
- Non sostituisce la navigazione esistente.
- Non renderizza dati direttamente.
- Non tocca Firebase.
- Non tocca EmailJS.
- Non tocca Admin/Presidente.
- Non tocca Listoni/Calciomercato condivisi.
- Non cancella fallback locali.
- Non modifica `FUNZIONALITA'.md`.

## Verifica manuale

1. Aprire ZonaOrientale e FantaPetilloMantraManager.
2. Cliccare rapidamente Dashboard, Listone, Calciomercato, Sorteggio giornate e Regolamento.
3. Il pulsante deve rispondere subito e la pagina deve cambiare senza sensazione di trascinamento.
4. Controllare che non restino due pulsanti accesi.
5. In console controllare:

```js
window.FantaEngineNavigationFluidityLastReportV535
```

Il report deve indicare `mutatesHash: false`, `callsSetAppPage: false`, `replacesNavigation: false` e `rendersDataDirectly: false`.

## Audit

```bash
node static/fanta-engine/tools/audit-navigation-fluidity-v535.mjs
```
