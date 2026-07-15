# AI Assistant Handoff V678

L'utente ha confermato che la V676 funziona bene. La V678 deve quindi restare su quella base: Listone mobile fuori dalla tabella legacy e desktop invariato.

Punti implementati:

- `renderListoneMobileCardV678` sovrascrive il renderer mobile del Listone.
- La card mostra box per tutti i campi principali del listone/JSON (`LISTONE_COLUMNS` piu `fantacalcioId` quando presente).
- `Mercato` non viene renderizzato.
- Stato rimane in alto a destra.
- Modifica rimane in basso a destra.
- `forceFooter` usa anche `MutationObserver` e timeout lunghi per impedire che vecchie routine V667 riscrivano il footer.

Non toccare ioSudo in questa patch.
