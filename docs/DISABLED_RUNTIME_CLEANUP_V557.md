# V557 - Disabled runtime cleanup

## Obiettivo

V557 chiude il ripristino prestazionale iniziato in V556: i moduli sperimentali disattivati dal runtime ordinario possono essere rimossi fisicamente dalla repo, senza perdere le correzioni funzionali successive.

## Perche'

ZonaOrientale era diventata piu' lenta non per la quantita' di dati, ma per la stratificazione di moduli aggiunti tra V532 e V555. V556 li ha tolti dal caricamento ordinario. V557 aggiunge il cleanup sicuro dei file runtime non piu' caricati.

## File runtime candidati alla rimozione

```text
static/fanta-engine/js/ui/navigation-active-singleton-v534.js
static/fanta-engine/js/ui/navigation-fluidity-v535.js
static/fanta-engine/js/ui/navigation-performance-guard-v536.js
static/fanta-engine/js/ui/performance-profiler-lazy-render-v552.js
static/fanta-engine/js/ui/application-cache-chunked-tables-v553.js
static/fanta-engine/js/ui/eager-data-preload-v555.js
```

## Comando cleanup

```bash
node static/fanta-engine/tools/cleanup-disabled-runtime-modules-v557.mjs --yes
```

Il tool elimina solo i file nella lista sopra. Non tocca documentazione storica, audit storici, dati, Firebase, EmailJS, Admin, Presidente, Listoni, Calciomercato o Netlify.

## Verifica

```bash
node static/fanta-engine/tools/audit-disabled-runtime-cleanup-v557.mjs
```

## Funzionalita' preservate

Restano attivi:

- routing locale storico;
- `navigation-actions-v510`;
- `navigation-data-refresh-v511`;
- `public-data-autoload-v526`;
- adapter e resolver multi-season V526/V537;
- asset comuni Listoni/Calciomercato;
- Calciomercato live/static split V549;
- stile Listone/Rose V550/V551;
- isolamento tabelle Regolamento V540;
- Firebase, EmailJS, Admin e Presidente.

## Note

Se dovesse ricomparire il problema dei pulsanti attivi multipli, non riattivare i vecchi observer. Serve una patch minima sul router locale, non un nuovo layer pesante.
