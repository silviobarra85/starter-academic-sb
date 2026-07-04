# Shared assets current - V522

Questo percorso e' il punto operativo per l'upload unico degli asset comuni Listoni e Calciomercato.

## Percorsi da aggiornare quando carichi nuovi asset comuni

```text
static/fanta-engine/data/shared-assets/current/assets/listoni/
static/fanta-engine/data/shared-assets/current/assets/calciomercato/
```

Le copie locali sotto `static/zonaorientale/assets/` e `static/fantapetillomantramanager/assets/` restano fallback di emergenza e non vanno aggiornate nel flusso ordinario.

## Verifica

```bash
node static/fanta-engine/tools/audit-shared-assets-single-upload-v522.mjs
```
