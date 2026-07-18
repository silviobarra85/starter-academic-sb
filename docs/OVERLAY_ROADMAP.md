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
