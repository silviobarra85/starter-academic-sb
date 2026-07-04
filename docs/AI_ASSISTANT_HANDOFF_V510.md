# AI Assistant Handoff V510 - Navigation actions fix

## Stato

Overlay V510 corregge una regressione osservata dall'utente: alcuni pulsanti/link non portavano alla sezione relativa.

## Causa probabile

La navigazione storica combinava listener statici su `[data-page-link]` installati da `setupNavigation()` e pulsanti legacy/dinamici con `[data-v42-page-link]`. I pulsanti creati dopo il bootstrap o fuori dal set iniziale potevano non essere intercettati in modo uniforme.

## Correzione V510

- Nuovo modulo comune `static/fanta-engine/js/ui/navigation-actions-v510.js`.
- Event delegation su `document` per `[data-page-link]` e `[data-v42-page-link]`.
- Routing locale ancora affidato a `setAppPageV42`, quindi non viene cambiato il modello di pagine esistente.
- `hashchange` gestito dal runtime comune.
- Prima della navigazione verso `teamarea`/`teamprofile` viene richiamato `ensureV34Dom` per garantire che le pagine dinamiche siano presenti.

## Guardrail

- Nessuna modifica Firebase.
- Nessuna modifica EmailJS.
- Nessuna modifica a dati, rules, Admin, Presidente, dashboard renderer, news, bilanci, listoni o calciomercato.
- Non ripristinare `static/zonaorientale/static`.
- Non ripristinare `static/static`.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.

## Audit V510

Da `static`:

```bash
node fanta-engine/tools/audit-navigation-actions-v510.mjs
node fanta-engine/tools/audit-runtime-regression-v510.mjs
node fanta-engine/tools/audit-multileague-contamination-v510.mjs
```

## Verifica manuale critica

Controllare i pulsanti dalla dashboard e dalla home mobile:

- Dashboard -> News.
- Dashboard -> Competizioni.
- Dashboard -> Fantamercato.
- Dashboard -> Area squadra/Trattative.
- Dashboard -> Listone.
- Dashboard -> Comunicati.
- Menu mobile Altro -> tutte le voci.
- Bottom nav mobile -> Home, Squadra, Mercato, Coppe.

## Prossimi overlay

V511 diventa il report centralizzazione fanta-engine + checklist pre-merge. La roadmap completa è in `docs/OVERLAY_ROADMAP.md`.
