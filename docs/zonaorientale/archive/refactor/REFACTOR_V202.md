# REFACTOR V202 - Dashboard Presidente e rose storiche season-aware

## Obiettivo

Correggere i casi in cui profili squadra e link dall'Albo mostravano dati della stagione sbagliata dopo il passaggio ai JSON/snapshot statici, mantenendo il sito mobile-first e senza introdurre nuove letture Firebase obbligatorie.

## Modifiche principali

- La rotta interna `teamarea` resta invariata, ma l'interfaccia la mostra come **Dashboard Presidente** invece di Area squadra/Richieste.
- Il profilo squadra ora viene risolto rispetto alla stagione selezionata quando si cambia stagione.
- Se la squadra non era iscritta nella stagione selezionata, la pagina profilo non mostra più la rosa precedente e mostra il messaggio: `Rosa non disponibile per la stagione selezionata`.
- I nomi squadra nell'Albo diventano cliccabili solo se quella squadra esisteva nella stagione della riga dell'Albo.
- Il click dall'Albo apre il profilo della squadra nella stagione corretta, così la rosa mostrata è quella storica della stagione della riga.
- Palmarès e FIFA Ranking usano la stagione globale selezionata per rendere cliccabili solo i club presenti in quella stagione.

## Letture Firebase

V202 non aggiunge letture Firebase obbligatorie all'avvio. Per profili storici può usare `loadPublicSeasonSnapshotV32(seasonId)`, che prova prima i JSON statici in `assets/snapshots/seasons/` e solo come fallback usa Firebase.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `docs/zonaorientale/REFACTOR_V202.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V202.md`

## Test consigliati

1. Aprire una scheda squadra nella stagione corrente.
2. Cambiare la stagione globale a una stagione in cui quella squadra non esisteva: non deve restare la rosa precedente.
3. Cambiare a una stagione in cui la squadra esisteva: deve mostrare la rosa di quella stagione.
4. Aprire Albo d'Oro e cliccare una squadra in una riga storica: deve aprire la rosa di quella stagione.
5. In Albo/Palmarès/FIFA, una squadra non presente nella stagione selezionata non deve essere cliccabile.
6. Verificare da mobile che la navigazione mostri Dashboard Presidente/Presidente in modo leggibile.

## Validazione tecnica

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
find static/zonaorientale/assets -type f -name '*.json' -print0 | xargs -0 -n 1 python3 -m json.tool
```
