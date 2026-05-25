# AI Handoff ZonaOrientale - V208

## Stato generale

La versione corrente è **V208**. Questo overlay è un refactor tecnico, non una nuova funzionalità utente.

## Cosa è stato pulito

Prima di V208, la parte finale di `assets/app.js` conteneva tre blocchi consecutivi:

- V205: dati live Firebase per comunicati/fantamercato e Archivio senza Partite recenti;
- V206: hotfix per rendere i comunicati live non bloccanti;
- V207: hotfix per evitare la riassegnazione di un binding `const` del Fantamercato.

V208 li consolida in un unico blocco finale.

## Regole importanti per futuri assistenti

1. **Non riassegnare helper destructured const del Fantamercato.**
   In particolare evitare pattern tipo:

   ```js
   getActiveTransferListingsV119 = function (...) { ... }
   ```

   Se serve un override, intervenire nei punti chiamanti oppure creare un nuovo helper con nome nuovo.

2. **I comunicati devono restare live da Firebase, ma non devono bloccare il bootstrap.**
   Il sito deve mostrare subito JSON/snapshot statici; i comunicati live si aggiornano in background.

3. **Lista trasferibili e trattative sono dati live.**
   Devono essere letti da Firebase quando servono a presidente/mercato/dashboard, non da snapshot statici.

4. **Dati storici/pesanti restano da JSON e snapshot.**
   Stagioni, albo, statistiche, archivio, confronta e rose storiche devono preferire JSON statici e snapshot pubblici.

5. **Aggiornare sempre Version footer e cache-buster.**
   Da richiesta utente, ogni overlay applicativo deve aggiornare la Version nel footer.

6. **Ogni overlay deve includere un handoff AI.**
   Da V189 in poi l'utente vuole sempre un file `AI_HANDOFF_ZONAORIENTALE_VXXX.md`.

## Funzioni/debug rilevanti

```js
ZonaOrientaleLiveData.status()
ZonaOrientaleLiveData.refreshNewsBackground()
ZonaOrientaleLiveData.ensureMarket()
ZonaOrientaleSeasonArchive.render()
ZonaOrientaleSeasonArchive.setSeason("2025-2026")
```

## Verifiche minime dopo modifiche future

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
find static/zonaorientale/assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool
```

## Avvio locale richiesto dall'utente

Se si è dentro `static/zonaorientale`:

```bash
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```
