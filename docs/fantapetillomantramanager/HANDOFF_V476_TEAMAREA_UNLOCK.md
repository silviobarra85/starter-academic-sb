# Handoff V476 - FantaMantraManager: banner rimosso e Area Squadra visibile

## Contesto

L'utente ha chiesto una modifica esclusiva per FantaMantraManager, senza toccare ZonaOrientale:

1. rimuovere l'header/banner che diceva `FantaPetilloMantraManager - Admin bootstrap attivo. Area Squadra resta protetta fino ai dati reali e teamUsers.`;
2. sbloccare l'Area Squadra.

## Strategia applicata

Patch conservativa solo sul clone `static/fantapetillomantramanager`:

- non e stato rinominato lo slug/cartella `fantapetillomantramanager`;
- non e stato toccato `static/zonaorientale`;
- non sono stati rimossi flussi Admin/Firebase/teamUsers;
- lo sblocco riguarda gli entrypoint e la visibilita della sezione Area Squadra, non l'eliminazione dei controlli operativi interni.

## Modifiche principali

- `assets/js/core/fanta-petillo-admin-bootstrap-v450.js`
  - convertito in guard V476 non invasiva;
  - rimuove eventuale banner legacy;
  - non applica piu classi `hidden/sandbox-disabled-*` ai link `#teamarea`;
  - dichiara `hidesTeamAreaEntrypoints: false`.

- `assets/app.js`
  - aggiunto fallback finale `unlockFantaMantraManagerTeamAreaEntrypointsV476()`;
  - il fallback ripulisce classi/attributi legacy dagli entrypoint `teamarea` dopo render, load e hashchange;
  - aggiornati i cache-buster interni da `?v=472` a `?v=476`.

- `assets/league-config.json`
  - versione `476`;
  - `features.teamArea: true`;
  - flag di guardia area squadra disattivati;
  - note aggiornate allo stato V476.

- HTML statici collegati al bootstrap:
  - `index.html`, `competition.html`, `player.html` aggiornati a V476 per cache-buster e footer.

- Docs e audit:
  - `TEAMAREA_UNLOCK_V476.md`;
  - `HANDOFF_V476_TEAMAREA_UNLOCK.md`;
  - `tools/audit-teamarea-unlock-v476.mjs`.

## Audit eseguito

Da `static/fantapetillomantramanager`:

```bash
node tools/audit-teamarea-unlock-v476.mjs
```

Risultato in ambiente overlay: `22 OK, 0 FAIL`.

## Attenzione per futuri assistenti

- Non modificare ZonaOrientale per questa linea di lavoro.
- Non cancellare funzionalita esistenti senza richiesta esplicita.
- Il vecchio nome `FantaPetilloMantraManager` puo restare solo come slug tecnico o nei nomi legacy dei file; il nome pubblico e `FantaMantraManager`.
- Le funzioni operative dell'Area Squadra sono ancora legate a login/account presidente: questa V476 sblocca la visibilita e rimuove la vecchia guardia/banner bootstrap.
