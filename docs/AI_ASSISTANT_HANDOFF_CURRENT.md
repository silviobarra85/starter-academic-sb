# AI Assistant Handoff Current

## Versione corrente
V563 - Svincola Giocatori ZonaOrientale runtime fix

## Stato sintetico
- ZonaOrientale: stagione corrente `2026-2027`.
- Calciomercato: disattivato come da V561.
- Svincola Giocatori: riattivato in Area Presidente ZonaOrientale con selezione giocatori, anteprima email e invio EmailJS al presidente di lega.
- FantaPetilloMantraManager: non modificato da V563.

## Guardrail
- Non reintrodurre fetch/loader Calciomercato.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Conservare mobile UX, Admin, Presidente, Firebase, EmailJS, Listone, Rose, Bilanci, Competizioni.
- Ogni overlay futuro deve restare whole-site quando applicabile, ma V563 e mirato per correzione urgente ZonaOrientale.

## Audit V563
```bash
node static/fanta-engine/tools/audit-zona-release-players-v563.mjs
```
