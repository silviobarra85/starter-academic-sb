# AI Assistant Handoff V672

V672 è un rollback mirato del Listone mobile del sito.

## Cosa è stato fatto

- Ripristinata la base CSS V667 per lo sfondo delle card e delle celle del Listone mobile.
- Conservato il renderer V668 per le card Listone/Rose.
- Rimosso l'approccio V671 che trasformava runtime le celle e rimuoveva `fpt-v584-col-player`.
- Aggiornati index/footer e cache-buster a V672.

## Cosa non è stato toccato

- ioSudo.
- Dataset mercato/Sudatori.
- Listoni JSON.
- Rose JSON.
- Workflow e script root `tools/`.

## Attenzione futura

Non reintrodurre fix che rimuovono runtime `td.fpt-v584-col-player` o `data-fpt-v584-role` senza prima verificare su smartphone reale: quel comportamento ha ristretto le card nel Listone mobile.
