# Browser smoke tests V503 - FantaMantraManager

La V503 aggiunge uno smoke test browser condiviso. Per questa lega il test verifica caricamento pagina, errori console, request fallite, brand e footer V503.

Esecuzione consigliata con server locale dalla cartella parent:

```bash
FANTA_BASE_URL=http://127.0.0.1:1313 FANTA_SITE_PREFIX=/starter-academic-sb/static node static/fanta-engine/tools/playwright-smoke-v503.mjs
```

Il test e' sicuro: non fa login, non scrive Firebase e non invia EmailJS.
