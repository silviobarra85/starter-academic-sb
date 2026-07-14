# ioSudo App V652

V652 e una patch di performance per il dettaglio giocatore.

## Obiettivo

Mantenere la velocita di navigazione ottenuta con V651 e ridurre il tempo di apertura della scheda del singolo giocatore.

## Cambiamenti principali

- Cache del dettaglio giocatore.
- Cache delle righe mercato del singolo giocatore.
- Matching diretto giocatore-riga mercato nel dettaglio, senza ricerca globale ripetuta.
- Calcolo unico per ufficialita, rumor, SOS, formazione e ultimo aggiornamento.

## File principali

- `static/fanta-engine/js/apps/iosudo-app-v652.js`
- `static/fanta-engine/css/iosudo-app-v652.css`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/tools/audit-iosudo-v652.mjs`

## Dati

V652 non aggiorna i dati. Usa il dataset corrente gia pubblicato nella cartella:

```text
static/fanta-engine/data/sudatori/current/
```
