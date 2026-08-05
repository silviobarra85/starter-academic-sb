# Roadmap overlay

## Stato V787

- ioSudo resta temporaneamente disattivato tramite pagina `Site under construction` V787; i dati V782 restano conservati.
- Il listone condiviso corrente della stagione `2026-2027` resta `2026-08-05`; il `2026-07-04` resta storico e selezionabile.
- Le rose di ZonaOrientale e FantaMantraManager vengono confrontate sempre con l'ultimo listone della stagione selezionata.
- Squadra reale, ruolo Classic/Mantra, quotazione, FVM, ID e link Fantacalcio.it arrivano dall'ultimo listone; costo d'asta, fantasquadra e storico restano invariati.
- Il refresh delle rose dopo il caricamento asincrono dei listoni ascolta ora gli eventi V760 su `window`, evitando dati di squadra obsoleti nelle schede gia aperte.
- Esempio verificato: Sohm resta nella rosa di Real Pisistrius ma viene mostrato come `VEN / Venezia`, non piu `BOL / Bologna`.
- Quando si apre una fantasquadra, l'ordine iniziale e sempre `P -> D -> C -> A`, con ordine alfabetico all'interno del ruolo. Gli ordinamenti manuali restano disponibili durante la consultazione.
- Badge permanenti: `In listone` per i presenti; `Asteriscato` per assenti o ceduti, senza cancellazione dalla rosa.

## Verifiche successive

- Controllare Sohm e almeno un altro trasferito in ZonaOrientale, sia nella lista Rose sia nella scheda squadra.
- Verificare l'ordine P-D-C-A su desktop e mobile, nella lista Rose e nel profilo squadra.
- Ripetere lo stesso controllo in FantaMantraManager quando saranno presenti rose operative.
- Con ogni nuovo listone mantenere le versioni precedenti nel manifest: l'ultimo della stagione verra scelto automaticamente per le rose.
- Alla riattivazione di ioSudo, rifare il matching completo sul listone corrente senza riutilizzare alla cieca gli ID precedenti.
