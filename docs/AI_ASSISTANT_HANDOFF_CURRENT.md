# AI Assistant Handoff Current

Versione corrente: V633

## Stato corrente

Per i SUDATORI e ioSudo usano il dataset condiviso:

```text
static/fanta-engine/data/sudatori/current/sudatori-data.json
```

La V633 mantiene le correzioni precedenti:

- rose live da `assets/rose`;
- vista GIOCATORI in ioSudo;
- card giocatore cliccabili;
- recupero ruolo da listone quando manca nel dataset;
- squadra attuale ufficiale o `Svincolato` in ioSudo;
- manifest Sudatori corretto con `current: sudatori-data.json`.

## Novità V633

- aggiunti i 10 link articolo puntuali forniti dall'utente;
- risolte le fonti residue che risultavano ancora mancanti dopo V631;
- `missingPreciseArticlesV633` è vuoto;
- `resolvedPreciseArticlesV633` contiene i 10 recuperi.

## Audit consigliati

```bash
node static/fanta-engine/tools/audit-sudatori-section-v633.mjs
node static/fanta-engine/tools/audit-iosudo-v633.mjs
```
