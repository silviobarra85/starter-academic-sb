# ioSudo - V610

**ioSudo** e una PWA mobile-first che carica solo la parte informativa di **Per i SUDATORI**.

## Novita V610
- Logo con personaggio che suda mentre pensa alla formazione del fantacalcio.
- Barra superiore compatta con: `ioSudo - <nome lega> - Vai al sito`.
- Nome lega dinamico dai redirect:
  - `/zonaorientale/iosudo/` -> `/iosudo/?league=zonaorientale`
  - `/fantapetillomantramanager/iosudo/` -> `/iosudo/?league=fantapetillomantramanager`
- Scheda squadra, tab **Rosa**, ordinata da **P** ad **A**: portieri, difensori, centrocampisti, attaccanti.

## Origine dati
L'app legge sempre:

```text
static/fanta-engine/data/sudatori/current/manifest.json
static/fanta-engine/data/sudatori/current/sudatori-data.json
```

Quindi quando un overlay aggiorna **Per i SUDATORI**, ioSudo si aggiorna senza altri interventi.

## Sezioni disponibili
- Cerca squadra o giocatore.
- Filtri rapidi: Nuovi, Rumor, SOS, XI.
- Scheda squadra:
  - probabile XI;
  - mercato con ufficialita in entrata, ufficialita in uscita, trattative in entrata, trattative in uscita;
  - SOS/infortunati;
  - rosa;
  - amichevoli.

## PWA
La PWA include:
- `manifest.webmanifest`;
- icone 192 e 512 aggiornate;
- service worker;
- cache app-shell;
- fetch network-first per i dati Sudatori.

## Verifica
```bash
node static/fanta-engine/tools/audit-iosudo-v610.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v610.js
node --check static/iosudo/sw.js
```
