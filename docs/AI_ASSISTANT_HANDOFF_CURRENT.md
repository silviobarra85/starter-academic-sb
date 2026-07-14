# Overlay V647 - Stato corrente

Data: 2026-07-14

## Stato

- `ioSudo` resta il canale attivo per dati Sudatori, listone, rose, XI, GIOCATORI e mercato.
- La sezione pubblica `Per i SUDATORI` nelle home delle leghe e stata disattivata rimuovendo CSS/JS della sezione dalle due shell principali.
- I dati centrali Sudatori non sono stati cancellati.
- I moduli storici `sudatori-section-*` restano nel repository per compatibilita e storico.

## Verifica

```bash
node static/fanta-engine/tools/audit-disable-sudatori-site-v647.mjs
```
