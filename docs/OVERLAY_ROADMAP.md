# Roadmap overlay

## Stato V785

- ioSudo è temporaneamente disattivato tramite pagina `Site under construction` V785.
- I dati V782 restano conservati in `static/fanta-engine/data/sudatori/current/` per una futura riattivazione.
- Il nuovo listone ufficiale `2026-08-05` è stato convertito dal file `Quotazioni_Fantacalcio_Stagione_2026_27.xlsx` e pubblicato negli asset condivisi del FantaEngine.
- ZonaOrientale e FantaMantraManager leggono lo stesso manifest e selezionano automaticamente il nuovo listone per la stagione `2026-2027`.
- Il listone `2026-07-04` resta disponibile nello storico e nel selettore.

## Verifiche successive

- Controllare visivamente ricerca, filtri Classic/Mantra, svincolati, ordinamenti e link Fantacalcio.it in entrambe le leghe.
- Quando verrà riattivato ioSudo, rifare il matching completo del catalogo V782 sul listone `2026-08-05`, senza riutilizzare alla cieca gli ID del listone precedente.
- Conservare sempre le versioni storiche del listone nel manifest della stessa stagione.
