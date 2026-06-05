# Legacy dependencies audit V342

## Scopo

Preparare una futura pulizia dei file legacy senza perdere funzionalita. La V342 non cancella nulla: aggiunge solo uno strumento di audit e documenta i candidati.

## Tool introdotto

```text
static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs
```

Esecuzioni consigliate:

```bash
node static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs
node static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs --quiet
node static/zonaorientale/tools/audit-legacy-dependencies-v342.mjs --json
```

## Cosa controlla

- HTML principali del sito.
- File JS/MJS/CSS sotto `assets/`.
- Import statici e dinamici.
- `href`, `src` e `url(...)` locali.
- Versioni duplicate con suffisso `-vNNN`.
- Alias stabili che possono aver sostituito file versionati vecchi.

## Cosa non decide

Il tool non puo' sapere con certezza se un file sia caricato dinamicamente da logiche non statiche, da documentazione storica o da workflow manuali. Per questo ogni risultato e' un candidato, non una decisione di cancellazione.

## Policy di sicurezza

Prima di rimuovere un file candidato:

1. cercare il nome file con `grep -R`;
2. eseguire `audit-assets-v298.sh`;
3. eseguire `audit-css-v300.sh` se e' CSS;
4. eseguire `check-zonaorientale.sh`;
5. testare browser desktop e mobile;
6. rimuovere un solo gruppo per release;
7. aggiornare docs e handoff.

## Marker runtime

```js
window.ZonaOrientaleLegacyDependencyAuditV342
```

Serve solo a indicare che la V342 e' stata applicata.

## Funzionalita preservate

Nessun cambio funzionale. Restano invariati Calciomercato, Listone, Rose, Fantamercato interno, Dashboard Presidente, Admin, Firebase/Auth/EmailJS, Netlify Functions, news/share e navigazione mobile.
