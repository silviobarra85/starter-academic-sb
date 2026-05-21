# V143 - Rose mobile a card

Data: 2026-05-20
Branch: feature/zonaorientale-competizioni-statiche

## Obiettivo

Proseguire la nuova interfaccia mobile senza modificare la versione desktop/web.

## Modifiche

- Aggiunto `assets/css/mobile-rosters-v143.css`.
- In mobile, la sezione `Rose` mostra le squadre come card operative, non come tabella compressa.
- Ogni card rosa evidenzia:
  - logo/nome squadra;
  - presidenti;
  - saldo FM;
  - numero giocatori;
  - stadio;
  - pulsante Ingrandisci/Riduci.
- Il dettaglio giocatori resta completo e scrollabile orizzontalmente.
- La sottosezione Movimenti in mobile viene resa come lista di card leggibili.
- Desktop invariato.
- Nessuna modifica Firebase.
- Nessuna modifica funzionale JS.

## File modificati

- `static/zonaorientale/index.html`

## File nuovi

- `static/zonaorientale/assets/css/mobile-rosters-v143.css`
- `docs/zonaorientale/REFACTOR_V143.md`

## Test consigliati

- `/zonaorientale/#clubs` da smartphone.
- Aprire/ridurre più rose.
- Controllare una rosa con molti giocatori.
- Provare filtro e ricerca nella sottosezione Movimenti.
- Verificare da desktop che la pagina Rose resti invariata.
