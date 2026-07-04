# AI Assistant Handoff V540

## Overlay

`overlay_v540_rules_table_style_isolation_whole_site.zip`

## Sintesi

V540 corregge la contaminazione visuale tra tabelle operative e tabelle del Regolamento. Alcune righe del Regolamento venivano colorate come righe ruolo del Listone/Rose perche' il vecchio helper V404/V406 analizzava tutte le tabelle e interpretava testi come `D'isanto` come ruolo `D`.

## File chiave

- `static/fanta-engine/css/rules-table-isolation-v540.css`
- `static/fanta-engine/tools/audit-rules-table-style-isolation-v540.mjs`
- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/zonaorientale/index.html`
- `static/fantapetillomantramanager/index.html`
- `docs/RULES_TABLE_STYLE_ISOLATION_V540.md`
- `docs/OVERLAY_ROADMAP.md`

## Guardrail

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Non centralizzare brutalmente tutto il CSS locale in questa patch: la correzione usa CSS fanta-engine additive-only piu' guardia runtime nei due app.js, perche' il helper ruolo e' ancora duplicato localmente.
- Non cancellare fallback locali Listoni/Calciomercato.
- Non cambiare Firebase/EmailJS/Admin/Presidente.

## Verifica

Eseguire:

```bash
node static/fanta-engine/tools/audit-rules-table-style-isolation-v540.mjs
```

Controllo browser:

- Regolamento: nessuna riga colorata come Listone/Rose.
- Listone: righe ruolo ancora colorate.
- Rose/profili: colorazioni ruolo ancora disponibili.
- Console senza errori.
