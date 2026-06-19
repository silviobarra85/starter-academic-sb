# V476 - Rimozione banner Admin bootstrap e sblocco Area Squadra

Data: 19/06/2026
Scope: solo FantaMantraManager (`static/fantapetillomantramanager`).

## Obiettivo

Rimuovere dal sito il banner/header tecnico:

`FantaPetilloMantraManager - Admin bootstrap attivo. Area Squadra resta protetta fino ai dati reali e teamUsers.`

La modifica rende inoltre visibili gli entrypoint dell'Area Squadra nel clone FantaMantraManager.

## File runtime modificati

- `assets/js/core/fanta-petillo-admin-bootstrap-v450.js`
  - non inietta piu il banner tecnico;
  - rimuove eventuali banner legacy gia presenti nel DOM;
  - non nasconde piu gli entrypoint `#teamarea`;
  - mantiene il bootstrap Admin e il noindex gia esistenti.
- `assets/app.js`
  - aggiunge un fallback V476 che rende visibili gli entrypoint `#teamarea` anche dopo i render dinamici;
  - non rimuove i controlli operativi gia esistenti su login/account presidente.
- `assets/js/core/section-registry-v405.js`
  - marca `teamarea` come entrypoint sbloccato in V476.
- `assets/league-config.json`
  - `currentVersion` portata a `476`;
  - `features.teamArea` portata a `true`;
  - flag di guardia entrypoint Area Squadra disattivati.
- `index.html`, `competition.html`, `player.html`
  - cache-buster e footer aggiornati a V476.
- `assets/js/core/fanta-petillo-admin-onboarding-v451.js` e `assets/js/core/fanta-petillo-share-netlify-v466.js`
  - testi tecnici aggiornati per non dichiarare piu Area Squadra nascosta/protetta dal bootstrap.

## Funzionalita preservate

- Nessun file ZonaOrientale viene modificato.
- Il percorso/cartella resta `fantapetillomantramanager`, per non rompere URL, Netlify, Firebase e share news.
- Admin, login, registrazione e flussi `teamUsers` non vengono rimossi.
- Le operazioni interne dell'Area Squadra continuano a usare i controlli esistenti: senza login/account presidente, la sezione mostra messaggi di accesso o attesa invece di esporre strumenti operativi.

## Audit

Comando:

```bash
cd static/fantapetillomantramanager
node tools/audit-teamarea-unlock-v476.mjs
```

Esito atteso: `22 OK, 0 FAIL`.
