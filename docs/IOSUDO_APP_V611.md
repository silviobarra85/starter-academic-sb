# ioSudo - V611

**ioSudo** e la PWA mobile-first collegata alla sezione **Per i SUDATORI**.

## Novita V611

- I giocatori sono cliccabili:
  - dal campetto della probabile formazione;
  - dalle card nei risultati di ricerca;
  - dalla tab **Rosa** della squadra.
- Il click apre il **dettaglio giocatore** con ruolo, squadra, badge mercato, eventuale SOS, probabile XI, fonti mercato/infortunio disponibili.
- Le card giocatore sono colorate per ruolo:
  - **P** giallo;
  - **D** verde;
  - **C** blu;
  - **A** rosso.
- Quando si apre una squadra, la card di ricerca viene nascosta.
- Il menu sezioni della squadra resta sticky in alto: **XI**, **Mercato**, **SOS**, **Rosa**, **Amichevoli**.

## Origine dati

L'app legge sempre i dati condivisi della sezione Sudatori:

```text
static/fanta-engine/data/sudatori/current/manifest.json
static/fanta-engine/data/sudatori/current/sudatori-data.json
```

Quindi ogni aggiornamento di **Per i SUDATORI** aggiorna automaticamente anche ioSudo.

## PWA

La PWA mantiene:

- `manifest.webmanifest`;
- icone `icon.svg`, `icon-192.png`, `icon-512.png`;
- service worker;
- cache app-shell;
- fetch network-first per i dati Sudatori.

## Verifica

```bash
node static/fanta-engine/tools/audit-iosudo-v611.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v611.js
node --check static/iosudo/sw.js
```
