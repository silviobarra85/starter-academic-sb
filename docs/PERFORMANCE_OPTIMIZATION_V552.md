# V552 - Performance profiler + lazy render guard

## Obiettivo

ZonaOrientale risulta piu lenta di FantaPetilloMantraManager perche contiene molti piu dati reali/storici: snapshot, rose, competizioni, bilanci e storico. V552 non cambia funzionalita: riduce il lavoro duplicato durante la navigazione e misura dove il sito resta pesante.

## Cosa cambia

Aggiunto il modulo comune:

```text
static/fanta-engine/js/ui/performance-profiler-lazy-render-v552.js
```

Il modulo:

- misura click, pagina corrente, run di refresh/autoload e long task quando il browser li espone;
- lascia passare almeno un frame prima dei refresh/render pesanti dopo un click, cosi il tab attivo risponde subito;
- coalesca refresh duplicati di boot/autoload quando una pagina ha gia DOM renderizzato;
- cachea in memoria i JSON statici gia letti per snapshot/rose/competizioni/shared-assets;
- applica `content-visibility` alle sezioni non attive;
- non cambia hash, non sostituisce router, non scrive Firebase e non cambia EmailJS.

## Runtime console

```js
window.FantaEnginePerformanceOptimizationLastReportV552
```

Il report espone:

- run differiti;
- run duplicati saltati;
- hit/miss cache JSON;
- long task recenti;
- pagina corrente.

## Rischi e mitigazioni

- Non sostituisce `renderAll` o `setAppPage`, quindi non dovrebbe scollegare sezioni esistenti.
- La cache e solo in memoria e solo per JSON statici; non viene applicata a Firebase o alla Netlify Function del Calciomercato.
- In caso di dati non renderizzati, i refresh non vengono saltati.

## Prossimi passi possibili

Se ZonaOrientale resta lenta, passare a V553 con cache applicativa esplicita e render tabelle in blocchi. Se la fluidita diventa buona, V554 puo ridurre i moduli diagnostici caricati in produzione.
