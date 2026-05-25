# AI Handoff ZonaOrientale - V207

## Stato
La V207 è un hotfix urgente dopo V206.

## Bug risolto
La V206 bloccava l'intero caricamento con:

```text
Uncaught TypeError: Assignment to constant variable.
```

Il punto problematico era la riassegnazione di `getActiveTransferListingsV119`. Quel nome deriva da destructuring `const` degli helper Fantamercato e non va mai sovrascritto.

## Regola per futuri overlay
Non riassegnare helper dichiarati tramite `const { ... } = ...`, in particolare quelli del Fantamercato V119/V128. Se serve un comportamento wrapper, creare un nuovo helper con nome nuovo oppure intervenire nei punti chiamanti.

## Dati live
La logica desiderata resta:

- dati storici/pesanti da JSON statici e snapshot;
- comunicati live da Firebase in background, senza bloccare il bootstrap;
- lista trasferibili e trattative live/lazy da Firebase quando servono;
- admin completo solo dopo `Carica dati amministrazione`.

## Verifiche consigliate

1. Aprire `/zonaorientale/` senza login.
2. Verificare che Dashboard/Albo/Statistiche/Confronta/Archivio carichino dati.
3. Login presidente e verifica Dashboard Presidente.
4. Aprire Mercato e controllare caricamento live/lazy.
5. Login admin e Checklist online finale.
