# Handoff V495 - Cleanup nested static ZonaOrientale

## Contesto

Nel branch V480-V494 era rimasta una copia storica annidata in `static/zonaorientale/static`.
L'output di verifica locale ha mostrato 12 MB e 250 file, ma nessun riferimento runtime utile quando si escludono docs/tools/audit/cleanup.

## Decisione

La cartella annidata non è necessaria al runtime e va rimossa prima del merge su master con:

```bash
git rm -r static/zonaorientale/static
```

## Overlay V495

L'overlay aggiorna:

- audit V495 senza aspettativa della copia annidata;
- config/footer/cache-buster a V495;
- redirect Netlify di sicurezza;
- docs/handoff.

## Ordine applicazione

Applicare overlay, poi `git rm`, poi audit. Non eseguire `git rm` prima dell'overlay, altrimenti i vecchi audit V494 potrebbero ancora aspettarsi la copia annidata.
