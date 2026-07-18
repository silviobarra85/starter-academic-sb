## V721 - 2026-07-18
- Excel V76: Candas Fiogbe U23 ufficiale non slot attivo, Oulai/Desplanches non ufficiali, scheda giocatore con riepilogo amichevoli giocate, alias duplicati confermati.

## V720 - 2026-07-18
- Excel V75: rinnovi Roma ufficiali, Bologna-Arminia tabellino, alias duplicati confermati.

## V719 - 2026-07-18
- Esposito disambiguato: Sebastiano/Cagliari e Francesco Pio/Inter, no alias generico.
- Applicati alias confermati V719 con Pessina solo Monza.
- Bologna-Arminia aggiornata come parziale live 0-3 HT, senza tabellino giocatori.

## V718 - 2026-07-18
- Applicati alias confermati V718.
- Ufficialità Engelhardt/Freiburg e Ravanelli/Sampdoria.
- Nessun nuovo tabellino o infortunio.

# Overlay Roadmap

## Stato corrente

- Versione ioSudo corrente: **V717**
- Fonte: Excel V72 del 18/07/2026
- Audit: `static/fanta-engine/tools/audit-iosudo-v717.mjs`

## Regole operative

- Un solo overlay per tutto il sito.
- Lo zip deve contenere solo i file effettivamente modificati.
- Applicazione consigliata:

```bash
cp -R overlay_iosudo_v717/static/* static/
cp -R overlay_iosudo_v717/docs/* docs/
```

## Prossima attività consigliata

Confermare o respingere i 10 nuovi duplicati in `docs/IOSUDO_DUPLICATE_CANDIDATES_V717.md` prima della prossima normalizzazione massiva.

## V722
- Excel V78: Casale rientrato, alias confermati, click giocatore da amichevole verso dettaglio giocatore.
