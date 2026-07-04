# V523 - Stabilita navigazione asset comuni

## Scopo

V523 corregge un comportamento intermittente osservato passando a **Listone** e **Calciomercato**: in alcuni casi la pagina sembrava esitare o tornare a `dashboard` senza errori in console.

## Causa identificata

Il modulo comune `static/fanta-engine/js/core/public-data-autoload-v512.js` installa timer ritardati di boot/load per caricare e renderizzare i dati pubblici. Prima di V523 quei timer memorizzavano la pagina al momento della schedulazione, spesso `dashboard`.

Se l'utente apriva `listone` o `calciomercato` mentre un timer di boot era ancora in coda, quel timer poteva completare dopo il click e riattivare la pagina schedulata iniziale.

## Correzione

V523 rende i timer di boot/load **fresh-page aware** e riallinea `calciomercato`, `bilanci`, `fantamercato` e `sorteggio` tra gli hash statici conosciuti dal router squadra:

- la pagina schedulata resta tracciata per diagnostica;
- prima dell'esecuzione ritardata viene riletto l'hash corrente;
- dopo un eventuale caricamento dati viene ricontrollata la pagina corrente;
- se l'utente ha navigato nel frattempo, vince la pagina corrente, non la vecchia `dashboard`.

## Funzionalita preservate

- Asset comuni V522 in `static/fanta-engine/data/shared-assets/current/` preservati.
- Fallback locali Listoni/Calciomercato preservati.
- Firebase non modificato.
- EmailJS non modificato.
- Nessuna modifica a ruoli Admin/Presidente.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.

## Audit

Da root repo:

```bash
node static/fanta-engine/tools/audit-navigation-stability-v523.mjs
```

L'audit controlla export V523, assenza di cache-buster V522 negli entrypoint runtime, versioni delle leghe a V523 e presenza del fix fresh-page nel modulo comune.

## Prossimo passo

Dopo V523 la roadmap funzionale puo riprendere con **V524 - Configuratore guidato nuova lega**.
