# AI Assistant Handoff V641

Versione: V641
Tema: automazione applicazione overlay da GitHub Actions.

## Stato precedente

Il sito era alla V639 per Per i SUDATORI/ioSudo. La V640 non era stata applicata dall'utente.

## Modifica V641

Aggiunta automazione per permettere all'utente di caricare uno zip overlay da smartphone in `incoming/overlays/` e lasciare a GitHub Actions il compito di applicarlo, eseguire audit, committare e pushare.

## File principali

- `.github/workflows/apply-overlay.yml`
- `tools/apply-overlay-from-zip.sh`
- `incoming/overlays/README.md`
- `docs/OVERLAY_AUTOMATION.md`
- `docs/OVERLAY_V641_APPLY.md`

## Nota operativa

Questa V641 non aggiorna dati Excel/Sudatori/ioSudo. Serve solo a installare l'automazione. Gli overlay successivi potranno essere caricati su GitHub da smartphone.
