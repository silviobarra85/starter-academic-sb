# AI Assistant handoff V528

Baseline: V528 - Dashboard enforce whole-site.

## Stato

- V527 ha introdotto il bridge post-render dashboard.
- V528 aggiunge enforcement/guardie sopra il bridge.
- I renderer locali restano il percorso primario.
- Admin e Presidente sono marcati come flussi protetti.
- Firebase, EmailJS, dati e asset condivisi non sono stati modificati.

## Guardrail obbligatori

- Ogni overlay futuro resta whole-site: `static/` + `docs/`.
- Lo zip deve contenere solo file realmente modificati.
- Non modificare `FUNZIONALITA'.md` salvo richiesta esplicita.
- Non cancellare fallback locali Listoni/Calciomercato senza un overlay dedicato e audit.
- Non sostituire renderer dashboard locali senza test browser Admin/Presidente su entrambe le leghe.

## Prossimo overlay consigliato

V529 - Dashboard renderer extraction: spostare una singola funzione di rendering non critica nel motore comune con fallback locale, oppure consolidare audit browser se i test manuali mostrano ancora esitazioni.
