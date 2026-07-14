# AI Assistant Handoff V658

Patch solo ioSudo per micro-UX e coerenza conteggi.

## Problema osservato

- In GIOCATORI, cliccando `Mostra altre voci`, il browser tornava in alto o perdeva la posizione di lettura.
- La card `Giocatori` mostrava 714 mentre la vista GIOCATORI indicava 1071 voci.
- La card `Amichevoli` mostrava 90 mentre la vista AMICHEVOLI indicava 88 voci.

## Causa

- Il pulsante `Mostra altre voci` ricostruiva l'intero markup della vista; su mobile il browser poteva perdere l'ancoraggio dello scroll.
- La card `Giocatori` usava il conteggio del manifest/dataset base, mentre la vista globale GIOCATORI include anche giocatori listone/rose fantasy deduplicati.
- La card `Amichevoli` usava il conteggio grezzo del manifest, mentre la vista mostra solo amichevoli effettive filtrate/deduplicate.

## Soluzione

- Conservazione e ripristino esplicito della posizione scroll durante il click su `Mostra altre voci`.
- Card di riepilogo allineate alle viste effettive per `Giocatori` e `Amichevoli`.
- Nessuna modifica ai dati.
