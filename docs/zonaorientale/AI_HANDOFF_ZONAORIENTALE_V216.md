# AI Handoff ZonaOrientale - V216

## Stato

V216 aggiunge la classifica completa per le competizioni di campionato/classifica.

## Modifica richiesta

Una classifica di campionato deve consentire inserimento e visualizzazione, in questo ordine:

```text
POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT
```

## Soluzione

- Esteso l'editor Admin dei risultati competizione con tutte le colonne richieste.
- Esteso il salvataggio Firebase dei risultati con i campi canonici:
  - `points`
  - `played`
  - `wins`
  - `draws`
  - `losses`
  - `goalsFor`
  - `goalsAgainst`
  - `goalDifference`
  - `fantapoints`
- Estesa la vista pubblica delle competizioni in `assets/app.js`.
- Estesa la pagina singola `competition.html`.
- Aggiunti alias di lettura per compatibilità con eventuali JSON/Firebase che usano nomi campo diversi.
- Aggiunti CSS desktop/mobile per evitare colonne schiacciate: da mobile la classifica resta tabellare e scorre orizzontalmente.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/competition.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/styles.css`
- `static/zonaorientale/assets/css/admin-v130.css`
- `static/zonaorientale/assets/css/competition-detail-v130.css`
- `static/zonaorientale/assets/css/mobile-suite-v168.css`
- `static/zonaorientale/assets/js/admin/admin-competitions.js`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V216.md`
- `docs/zonaorientale/REFACTOR_V216.md`

## Note operative

Le vecchie classifiche che hanno solo Punti/PG/FPT continuano a funzionare: le nuove colonne vengono mostrate con `-` finché non vengono valorizzate da Admin o nello snapshot JSON.

## Test consigliati

1. Aprire `/zonaorientale/#competitions` da desktop e verificare la tabella classifica.
2. Aprire una competizione a classifica/campionato tramite `competition.html`.
3. Da mobile verificare che tutte le colonne siano raggiungibili con scroll orizzontale e che la colonna squadra non si schiacci.
4. Login admin, aprire Risultati competizioni, inserire valori in tutte le colonne, salvare e verificare rendering pubblico.
5. Eseguire `node --check assets/app.js` e `node --check assets/js/admin/admin-competitions.js`.
