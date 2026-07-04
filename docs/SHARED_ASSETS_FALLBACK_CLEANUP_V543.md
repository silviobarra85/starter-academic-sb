# V543 - Shared assets fallback cleanup

## Obiettivo

V543 rimuove dal workflow ordinario i fallback locali duplicati di **Listoni** e **Calciomercato**.

La sorgente unica resta:

```text
static/fanta-engine/data/shared-assets/current/assets/listoni/
static/fanta-engine/data/shared-assets/current/assets/calciomercato/
```

Le cartelle locali da rimuovere sono:

```text
static/zonaorientale/assets/listoni/
static/zonaorientale/assets/calciomercato/
static/fantapetillomantramanager/assets/listoni/
static/fantapetillomantramanager/assets/calciomercato/
```

## Perche' ora e' sicuro

V538 aveva certificato che i fallback locali erano identici agli asset centrali. V539 ha chiuso la release candidate. V541 ha confermato il peso e la baseline corrente. V542 ha pulito la repo da file non applicativi.

V543 applica quindi la pulizia richiesta, ma con due protezioni:

1. lo zip aggiorna codice, config, docs e audit;
2. la cancellazione fisica richiede il tool dedicato `cleanup-shared-assets-local-fallbacks-v543.mjs`, perche' un overlay zip non puo' cancellare file gia' presenti nella repo.

## Cosa cambia nel runtime

- `league-config.json` non contiene piu' i path fallback locali per Listoni/Calciomercato.
- Le funzioni Calciomercato non costruiscono piu' URL fallback locali.
- Il preflight pubblico controlla il manifest Listoni centrale.
- Le istruzioni Admin puntano al path centrale.
- `sharedAssetsMode` diventa `central-only`.

## Cosa non cambia

- Nessuna modifica Firebase.
- Nessuna modifica EmailJS.
- Nessuna modifica Admin/Presidente.
- Nessuna modifica a rose, competizioni, snapshot, bilanci, honor.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Procedura

Applicare overlay:

```bash
cp -R ~/Downloads/overlay_v543_shared_assets_fallback_cleanup_whole_site/static/* static/
cp -R ~/Downloads/overlay_v543_shared_assets_fallback_cleanup_whole_site/docs/* docs/
```

Eseguire la cancellazione controllata:

```bash
node static/fanta-engine/tools/cleanup-shared-assets-local-fallbacks-v543.mjs --yes
```

Verificare:

```bash
node static/fanta-engine/tools/audit-shared-assets-fallback-cleanup-v543.mjs
```

## Nota operativa futura

Da V543 in poi, quando si aggiorna il Listone o Calciomercato, caricare solo in `static/fanta-engine/data/shared-assets/current/assets/`.

Non caricare copie nelle singole leghe.
