# Matrice audit tema/competizioni - V353

| File | Stato V353 | Evidenza | Decisione |
| --- | --- | --- | --- |
| `assets/css/refactor/theme-light-suspended.css` | conservato/non importato | gli entrypoint HTML non lo caricano; contiene marker di Light sospeso | non rimuovere in V353; decidere policy Light in una release dedicata |
| `assets/js/domain/competitions.js` | conservato/non importato | il runtime usa funzioni inline in `assets/app.js`; il modulo esporta duplicati storici V52 | non rimuovere in V353; eventuale cleanup solo dopo test Competizioni |

## Aree protette

- Tema corrente e Dark mode.
- Eventuale ripristino futuro della Light mode.
- Dashboard Competizioni.
- `competition.html`.
- Archivio e render gruppi competizioni.
- Admin competizioni e stato pubblicazione.

## Comando audit

```bash
static/zonaorientale/tools/audit-theme-competitions-v353.mjs
```

## Risultato atteso

Tutti i check devono essere `OK`. La release non prevede cancellazioni.
