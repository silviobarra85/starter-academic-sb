# V452 - Favicon FantaPetilloMantraManager

La V452 sostituisce la favicon e le icone PWA/social del clone `FantaPetilloMantraManager`.

## File aggiornati

```text
static/fantapetillomantramanager/favicon.ico
static/fantapetillomantramanager/assets/icons/favicon-16x16.png
static/fantapetillomantramanager/assets/icons/favicon-32x32.png
static/fantapetillomantramanager/assets/icons/apple-touch-icon.png
static/fantapetillomantramanager/assets/icons/android-chrome-192x192.png
static/fantapetillomantramanager/assets/icons/android-chrome-512x512.png
static/fantapetillomantramanager/assets/icons/fantapetillo-favicon-source.svg
```

## Scelte grafiche

- sigla principale: `FPMM`;
- stagione indicata: `2026-2027`;
- palette coerente con il clone: granata, oro, sfondo scuro;
- icone piccole ottimizzate per leggibilita' browser;
- icone grandi adatte a PWA, Apple touch icon e metadata Open Graph/Twitter.

## Note operative

In V452 i link favicon del clone hanno cache-buster `?v=452`, cosi' il browser e' spinto a scaricare la nuova icona. In caso di cache aggressiva del browser, fare hard refresh o cancellare la cache favicon.

## Guardrail

La modifica e' limitata al clone `static/fantapetillomantramanager/` e agli audit/docs collegati. Non cambia Firebase, Admin, rules, snapshot o Area Squadra.
