# AI Assistant Handoff V543

## Stato overlay

V543 e' un overlay whole-site di cleanup fallback asset condivisi.

Nome zip:

```text
overlay_v543_shared_assets_fallback_cleanup_whole_site.zip
```

## Regole rispettate

- Overlay unico per tutto il sito.
- Struttura `static/` + `docs/`.
- Solo file modificati e tool nuovi.
- Docs aggiornati.
- Handoff aggiornato.
- `docs/OVERLAY_ROADMAP.md` aggiornato.
- `FUNZIONALITA'.md` non modificato.

## Scopo

Rimuovere dal workflow ordinario i fallback locali duplicati di Listoni e Calciomercato.

Sorgente unica:

```text
static/fanta-engine/data/shared-assets/current/assets/listoni/
static/fanta-engine/data/shared-assets/current/assets/calciomercato/
```

Fallback locali da cancellare tramite tool:

```text
static/zonaorientale/assets/listoni/
static/zonaorientale/assets/calciomercato/
static/fantapetillomantramanager/assets/listoni/
static/fantapetillomantramanager/assets/calciomercato/
```

## Tool aggiunti

```text
static/fanta-engine/tools/cleanup-shared-assets-local-fallbacks-v543.mjs
static/fanta-engine/tools/audit-shared-assets-fallback-cleanup-v543.mjs
```

Il cleanup e' separato dall'applicazione overlay perche' lo zip non puo' cancellare file gia' tracciati nella repo.

## Comandi applicazione

```bash
cp -R ~/Downloads/overlay_v543_shared_assets_fallback_cleanup_whole_site/static/* static/
cp -R ~/Downloads/overlay_v543_shared_assets_fallback_cleanup_whole_site/docs/* docs/
node static/fanta-engine/tools/cleanup-shared-assets-local-fallbacks-v543.mjs --yes
node static/fanta-engine/tools/audit-shared-assets-fallback-cleanup-v543.mjs
```

## Guardrail

Non toccare:

- Firebase;
- EmailJS;
- Admin;
- Presidente;
- rose;
- competizioni;
- snapshot;
- bilanci;
- honor;
- `docs/zonaorientale/FUNZIONALITA'.md`.

## Prossimo overlay consigliato

V544 - Post-cleanup release validation.

Dopo V544, overlay previsti: 0, salvo bugfix o nuova roadmap.
