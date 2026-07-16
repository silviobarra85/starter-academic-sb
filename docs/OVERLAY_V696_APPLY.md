# Overlay V696 - ioSudo deduplica GIOCATORI

Overlay mirato su ioSudo basato su V695.

## Cosa cambia

- Deduplica conservativa delle card GIOCATORI e della sottosezione SQUADRE -> ROSA.
- Unifica varianti nome/cognome, iniziale/cognome e cognome-only quando ruolo e contesto sono coerenti.
- Aggancia il listone al giocatore reale anche se la squadra del listone è diversa, quando il candidato reale è unico; se non c’è ufficialità contraria, la card globale usa la squadra del listone.
- Esempi gestiti: Audero, Provedel/Ivan Provedel, Esposito/S. Esposito, Boga/Jeremie Boga, Dragusin/Radu Dragusin.
- Non reinserisce i giocatori solo-rumor nella sezione GIOCATORI.

## Conteggi

- Giocatori in playersByTeam: 741
- Team con deduplica dati: 14

## Audit

```bash
node static/fanta-engine/tools/audit-iosudo-v696.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v696.js
node --check static/iosudo/sw.js
```
