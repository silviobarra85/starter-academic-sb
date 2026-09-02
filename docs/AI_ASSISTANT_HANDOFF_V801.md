# V801 - Fix Admin movimenti svincolo

## Problema
Il fix legacy V751 (`repairStaticSvincoliV751`) correggeva gli svincoli storici di luglio 2026 ma filtrava tutti i movimenti `SVINCOLO` della stessa fantasquadra. Di conseguenza un nuovo svincolo Firebase veniva mutato in memoria con importo e descrizione del vecchio movimento canonico.

Esempio osservato: FC DueFratelli2005, nuovo movimento 19/08 mostrato come copia dello svincolo 05/07 da 103 FM.

## Correzione
- `repairStaticSvincoliV751` e' ora un no-op compatibile: non altera piu `state.raw.fmMovements`.
- I movimenti Firebase sono autorevoli e restano modificabili/eliminabili dall'Admin.
- Nessun movimento storico viene cancellato o riscritto dalla patch.
- Shell/cache-buster ZonaOrientale portati a V801.

## Nota operativa
Se un movimento nuovo era stato solo visualizzato male dal runtime V751, al reload V801 dovrebbe riapparire con i valori realmente salvati in Firestore. Se invece un amministratore lo ha successivamente modificato/salvato mentre era gia corrotto nel form, correggerlo manualmente una volta dall'Admin.
