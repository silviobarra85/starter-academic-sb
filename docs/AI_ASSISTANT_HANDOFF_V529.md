# AI Assistant handoff V529

Baseline: V529 - Dashboard renderer extraction controllata.

## Stato

- V527 ha introdotto il bridge post-render dashboard.
- V528 ha aggiunto guardie/enforcement.
- V529 estrae nel motore comune una sola funzione non critica: la sincronizzazione metadati delle metriche dashboard pubbliche.
- I renderer locali restano il percorso primario.
- Il fallback locale resta nel codice se il runtime V529 non e disponibile.
- Firebase, EmailJS, dati e asset condivisi non sono stati modificati.

## Guardrail obbligatori

- Ogni overlay futuro resta whole-site: `static/` + `docs/`.
- Lo zip deve contenere solo file realmente modificati.
- Non modificare `FUNZIONALITA'.md` salvo richiesta esplicita.
- Non cancellare fallback locali Listoni/Calciomercato senza overlay dedicato e audit.
- Non sostituire `renderDashboard` o i renderer Presidente/Admin senza test browser su entrambe le leghe.
- Migrare un solo blocco dashboard alla volta, sempre con fallback.

## Prossimo overlay consigliato

V530 - Dashboard public summary extraction oppure browser smoke test dashboard Admin/Presidente, in base ai risultati manuali dopo V529.
