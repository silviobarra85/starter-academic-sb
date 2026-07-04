# V537 - Multi-season path resolver activation

## Obiettivo

Attivare l'adapter multi-season introdotto in V526 come risolutore comune dei percorsi dati, senza spostare file fisici.

La separazione resta questa:

```text
Dati condivisi:
- Listoni
- Calciomercato

Dati per-lega/per-stagione:
- public config
- rose
- competizioni
- snapshot stagionali
- bilanci
- honor/albo
```

## Modulo aggiunto

```text
static/fanta-engine/js/core/season-path-resolver-v537.js
```

Il modulo espone:

```text
installSeasonPathResolverV537
resolveLeagueDataPathWithSeasonV537
joinLeagueDataPathWithSeasonV537
createSeasonPathResolverReportV537
```

## Attivazione runtime

Entrambe le leghe installano il resolver in `assets/app.js` dopo `installSeasonDataAdapterV526`.

`assets/js/data/static-files-service.js` usa il resolver per:

- `listoniManifest` e `listoniBase` come dati condivisi;
- `rostersManifest` e `rostersBase` come dati per-stagione;
- `competitionsManifest` e `competitionsBase` come dati per-stagione.

## Guardrail

- Nessuna migrazione fisica dei dati.
- Nessuna cancellazione fallback locali.
- Nessuna modifica Firebase.
- Nessuna modifica EmailJS.
- Nessuna modifica Admin/Presidente.
- Listoni e Calciomercato restano su `static/fanta-engine/data/shared-assets/current/`.
- `FUNZIONALITA'.md` non viene modificato.

## Verifica

```bash
node static/fanta-engine/tools/audit-multiseason-path-resolver-v537.mjs
```

In console browser:

```js
window.FantaEngineSeasonPathResolverLastReportV537
```

Il report deve mostrare `physicalMigration: false`, `sharedAssetsCurrentPreserved: true` e `localFallbacksPreserved: true`.
