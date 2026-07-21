# AI Assistant Handoff V748

## Stato

Overlay V748 applica una patch runtime al sito ZonaOrientale, non a ioSudo.

## Problemi risolti

### 1. Svincoli senza descrizione in Rose

Nel file statico `static/zonaorientale/assets/snapshots/seasons/2026-2027.json` le righe `fmMovements` di tipo `SVINCOLO` hanno descrizioni complete. Tuttavia desktop/admin può caricare dati da Firebase/full collections o snapshot pubblici non allineati, nei quali la descrizione è assente o ridotta a `SVINCOLI LUGLIO 2026`.

La patch V748 aggiunge in `app.js` la funzione runtime:

- `repairCurrentSeasonReleaseDescriptionsV748`
- `applyStaticReleaseDescriptionsV748`

La logica prende come fonte autorevole il JSON statico `assets/snapshots/seasons/<season>.json` e sostituisce descrizioni vuote/generiche o più corte con quelle complete.

### 2. Checkbox admin desktop

La patch aggiunge una guardia click/change sugli input `#adminPanel input[type="checkbox"]`, forza `pointer-events:auto`, `appearance:checkbox` e impedisce che handler esterni/summary/details intercettino il click.

### 3. Cache-buster

`static/zonaorientale/index.html` ora usa `./assets/app.js?v=748` sia in `modulepreload` sia nello script module.

## Attenzione prossimi overlay

- Non rimuovere la patch V748 senza prima verificare che Firebase/public snapshot abbiano le descrizioni complete degli svincoli.
- Se si rigenerano snapshot pubblici da admin, verificare che `fmMovements.description` venga preservato.
- Se si tocca l'area admin, testare manualmente checkbox del riversamento stagione e checkbox principali dei form admin.
- Per ioSudo resta valido l'handoff più recente precedente: mantenere dedupliche/disambiguazioni già confermate.

## Verifica minima

```bash
node --check static/zonaorientale/assets/app.js
```

Aprire Rose e controllare che Real Pisistrius mostri:

`SVINCOLI LUGLIO 2026: Malinovskyi (5); Coulibaly L. (13); Fadera (8); Vandeputte (11);`

