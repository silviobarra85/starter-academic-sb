# AI Assistant Handoff V557

## Stato

V557 = cleanup fisico dei moduli runtime sperimentali disattivati in V556.

La baseline desiderata e': runtime lean simile al sito online veloce, ma con le correzioni recenti preservate.

## File nuovi

```text
static/fanta-engine/tools/cleanup-disabled-runtime-modules-v557.mjs
static/fanta-engine/tools/audit-disabled-runtime-cleanup-v557.mjs
docs/DISABLED_RUNTIME_CLEANUP_V557.md
docs/AI_ASSISTANT_HANDOFF_V557.md
```

## Cleanup da eseguire dopo overlay

```bash
node static/fanta-engine/tools/cleanup-disabled-runtime-modules-v557.mjs --yes
```

## Audit

```bash
node static/fanta-engine/tools/audit-disabled-runtime-cleanup-v557.mjs
```

## Guardrail

- Non ripristinare i moduli performance V552/V553/V555 salvo nuova decisione esplicita.
- Non ripristinare i fallback locali Listoni/Calciomercato.
- Non modificare `FUNZIONALITA'.md` senza richiesta esplicita.
- Ogni overlay futuro deve essere whole-site e aggiornare docs + handoff.

## Funzionalita' da verificare manualmente

- ZonaOrientale veloce su cambio pagina.
- FantaPetilloMantraManager invariato.
- Rose espanse con stile Listone e colonna Stato.
- Regolamento senza righe colorate.
- Listone e Calciomercato funzionanti dagli asset centrali.
- Admin e Presidente invariati.
