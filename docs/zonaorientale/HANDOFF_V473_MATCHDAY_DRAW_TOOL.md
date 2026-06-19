# HANDOFF V473 - Tool sorteggio giornate multi-lega

Data: 19/06/2026

## Contesto
La base di partenza e la patch V472, che ha isolato footer e news tra `zonaorientale` e `fantapetillomantramanager`. La V473 mantiene quelle correzioni e aggiunge una funzionalita nuova a entrambi i siti.

## Funzionalita aggiunta
Aggiunta sezione pubblica `#sorteggio` in entrambe le home:

- input numero di giornate da sorteggiare;
- input giornate escluse, con supporto a numeri singoli e range tipo `3, 7, 18-20`;
- slider range minimo/massimo tra 1 e 38;
- seed editabile/generabile;
- output giornate sorteggiate ordinate;
- JSON risultato con impostazioni, seed e risultato per riproducibilita;
- copia risultato negli appunti quando supportato dal browser;
- ultimo JSON salvato in `localStorage` per sola comodita client-side.

## File principali modificati
- `static/zonaorientale/index.html`
- `static/fantapetillomantramanager/index.html`
- `assets/js/core/section-registry-v405.js` in entrambe le leghe
- `assets/league-config.json` in entrambe le leghe
- nuovi `assets/js/sections/matchday-draw-tool-v473.js`
- nuovi `assets/css/matchday-draw-tool-v473.css`
- nuovi `tools/audit-matchday-draw-tool-v473.mjs`

Nota: e stata aggiornata anche la copia annidata preservata `static/zonaorientale/static/...` per non lasciare residui V472/assenza tool nei grep, senza cancellarla.

## Guardrail
Nessuna funzionalita e stata cancellata. La V473 non scrive su Firebase, non tocca snapshot, listoni, rose, competizioni, Admin, Area Squadra, Bilanci o news. La navigazione esistente resta invariata; viene solo aggiunto il link `Sorteggio giornate`.

## Audit consigliato
Dopo applicazione patch, eseguire:

```bash
cd static/zonaorientale
node tools/audit-matchday-draw-tool-v473.mjs
cd ../fantapetillomantramanager
node tools/audit-matchday-draw-tool-v473.mjs
```

## Versione
Footer e cache-buster aggiornati a V473 con ultimo aggiornamento 19/06/2026.
