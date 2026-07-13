# AI Assistant Handoff Current

## Ultimo overlay: V641

La V641 aggiunge l'automazione GitHub Actions per applicare gli overlay caricati in `incoming/overlays/`.

## Stato funzionale

- Per i SUDATORI/ioSudo restano sui dati della V639 se la V640 non e stata applicata.
- Da questo momento gli overlay futuri possono essere caricati da smartphone su GitHub e applicati automaticamente dal workflow `Apply Overlay`.

## Uso rapido

Caricare lo zip overlay in:

```text
incoming/overlays/
```

Il workflow copia `static/` e `docs/`, esegue audit e commit/push automatico.
