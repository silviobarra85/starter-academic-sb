# Handoff V691

Patch mirata dopo V690.

Problemi risolti:

1. Le card `Ultimi movimenti` e `Ultimi comunicati` sotto le Rose/profili squadra sforavano a destra su mobile.
2. Il footer continuava a mostrare una versione vecchia, spesso V667, per effetto di routine runtime precedenti.

Soluzione:

- Nuovo CSS `site-performance-v691.css` con regole mobile specifiche per contenitori e card profilo squadra.
- Nuova patch JS `fantaSiteProfileResponsiveFooterV691` applicata a entrambe le leghe.
- `renderTeamProfileContentV42` viene wrappato per produrre card V691 per movimenti e comunicati.
- Footer guard con MutationObserver su `document.body` e timeout multipli fino a 30 secondi.
- Reassegnazione di `forceFooterVersionV667` a `forceFooterV691` quando disponibile.

Vincoli preservati:

- Non toccare ioSudo.
- Non toccare i dati.
- Desktop invariato.
