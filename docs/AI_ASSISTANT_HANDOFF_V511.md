# AI Assistant Handoff V511 - Fix dati pubblici e navigazione hash

## Perche esiste V511

Dopo V510 la navigazione aggiorna correttamente l'hash, per esempio `#news`, ma in alcuni casi le sezioni restano senza dati. Il problema osservato dall'utente: clic su News cambia URL in `/zonaorientale/#news`, ma i dati non vengono renderizzati; al refresh della home i dati possono restare vuoti. Lo stesso comportamento e stato segnalato su FantaMantraManager.

## Cosa cambia

- Aggiunto `static/fanta-engine/js/core/navigation-data-refresh-v511.js`.
- Le app installano `FantaEngineNavigationDataRefreshRuntimeV511`.
- Ogni navigazione hash pubblica schedula un controllo dati + render della sezione corrente.
- Il loader pubblico ora ha fallback static-first: se il percorso standard non produce dati, legge config/snapshot statici locali gia presenti.
- Cache-buster interno di `league-config-v443.js` portato a V511 anche negli import JS, non solo negli HTML.

## Cosa non cambia

- Nessuna scrittura Firebase.
- Nessuna modifica a EmailJS.
- Nessuna modifica a ruoli Admin/Presidente.
- Nessuna migrazione path Firestore.
- Nessuna cancellazione fallback locali.
- `static/zonaorientale/static` e `static/static` devono restare assenti.

## Audit

Da `static`:

```bash
node fanta-engine/tools/audit-navigation-data-refresh-v511.mjs
node fanta-engine/tools/audit-runtime-regression-v511.mjs
node fanta-engine/tools/audit-multileague-contamination-v511.mjs
```

## Prossimo step previsto

V512 - Report centralizzazione fanta-engine + checklist pre-merge.
