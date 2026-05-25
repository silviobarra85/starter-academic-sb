# AI Handoff ZonaOrientale - V215

## Stato

V215 è un hotfix di stabilità dopo V214.

## Problema corretto

Dopo V214 il sito non mostrava dati perché `app.js` si fermava all'avvio con:

```text
Uncaught ReferenceError: buildSeasonArchiveV196 is not defined
```

La causa era che il refactor aveva lasciato gli override V204/V209 dell'Archivio, ma non gli helper base introdotti in V196.

## Soluzione

Sono stati reinseriti gli helper base V196 dell'Archivio dentro `assets/app.js`, prima del blocco V204. Gli override successivi restano validi.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `docs/zonaorientale/REFACTOR_V215.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V215.md`

## Avvertenza per refactor futuri

Non estrarre o rimuovere funzioni storiche Vxxx se sono ancora usate da override successivi. Prima verificare con `grep` tutti i riferimenti runtime, non solo `node --check`.

In particolare l'Archivio dipende da una catena:

```text
V196 helper base
V204 snapshot stagione selezionata
V209 modulo live-data/archive
```

Il modulo ES fallisce completamente se una funzione assegnata o letta direttamente non è definita.
