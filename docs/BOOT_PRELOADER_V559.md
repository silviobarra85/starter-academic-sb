# V559 - Boot preloader multi-lega

## Obiettivo

Aggiungere un feedback visivo durante l'apertura iniziale del sito, soprattutto per ZonaOrientale, senza reintrodurre layer di preload/autoload pesanti rimossi in V558.

## Cosa cambia

- Aggiunto preloader comune in `static/fanta-engine/css/boot-preloader-v559.css`.
- Aggiunto controller visivo in `static/fanta-engine/js/ui/boot-preloader-v559.js`.
- Aggiornate entrambe le home `index.html` con overlay, CSS e JS condivisi.
- Aggiornati entrambi gli `assets/app.js` per inviare l'evento `fanta:app-ready-v559` dopo il primo ciclo auth/data/render.
- Runtime, Firebase, EmailJS, router locale, dati e funzioni Netlify restano invariati.

## Comportamento

Il preloader mostra una rotellina e una percentuale progressiva. La percentuale avanza durante parsing, caricamento asset e bootstrap. Quando l'app segnala il completamento del primo caricamento dati/render, il preloader arriva al 100% e scompare. Esistono fallback temporizzati per evitare che l'overlay resti bloccato in caso di errore o ritardo anomalo.

## Guardrail

- Nessun import di `navigation-data-refresh`, `public-data-autoload`, `dashboard-enforce` o `eager-data-preload` viene reintrodotto.
- Nessuna scrittura Firebase o EmailJS.
- Nessuna sostituzione del router locale storico.
- `docs/zonaorientale/FUNZIONALITA'.md` non modificato.

## Audit

```bash
node static/fanta-engine/tools/audit-boot-preloader-v559.mjs
```

## Verifica manuale consigliata

- Aprire `/zonaorientale/` da cache pulita o finestra anonima: il preloader deve comparire subito, salire di percentuale e sparire a sito pronto.
- Aprire `/fantapetillomantramanager/`: stesso comportamento.
- Verificare che dopo la scomparsa del preloader la navigazione tra sezioni sia reattiva.
- Verificare login Admin/Presidente, News, Rose, Bilanci, Calciomercato e Listone.
