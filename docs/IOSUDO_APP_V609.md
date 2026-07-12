# ioSudo - V609

**ioSudo** e una PWA mobile-first che carica solo la parte informativa di **Per i SUDATORI**.

## URL
- App principale: `/iosudo/`
- Redirect lega ZonaOrientale: `/zonaorientale/iosudo/` verso `/iosudo/?league=zonaorientale`
- Redirect lega FantaPetilloMantraManager: `/fantapetillomantramanager/iosudo/` verso `/iosudo/?league=fantapetillomantramanager`

## Origine dati
L'app legge:

```text
static/fanta-engine/data/sudatori/current/manifest.json
static/fanta-engine/data/sudatori/current/sudatori-data.json
```

Quindi quando un overlay aggiorna Per i SUDATORI, ioSudo si aggiorna senza altri interventi.

## Sezioni disponibili
- KPI generali.
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
- icone 192 e 512;
- service worker;
- cache app-shell;
- fetch network-first per i dati Sudatori.

## Verifica
```bash
node static/fanta-engine/tools/audit-iosudo-v609.mjs
node --check static/fanta-engine/js/apps/iosudo-app-v609.js
node --check static/iosudo/sw.js
```
