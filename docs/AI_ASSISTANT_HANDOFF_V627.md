# AI Assistant Handoff V627 - Sudatori/ioSudo fonti articolo puntuali

Data: 2026-07-13

Overlay: `fantacalcio_overlay_sudatori_iosudo_v627_fonti_articoli.zip`

## Scopo
Aggiorna Per i SUDATORI e ioSudo con l'Excel `fantacalcio_serie_a_2026_27_aggiornato_2026-07-13_fonti_articoli_v7(1).xlsx`.

## Modifiche principali
- Versione dati e runtime portata a V627.
- Le fonti di rumors, trattative, ufficialita, SOS/infortuni e ritiri/amichevoli usano la colonna `Articolo preciso / URL fonte puntuale` quando presente.
- ioSudo non fa piu fallback automatico alla homepage generica se e disponibile un URL puntuale.
- Per i SUDATORI mostra link articolo nelle card mercato/SOS e nei dettagli giocatore.
- Aggiunta tracciatura `Controllo_Fonti_Articoli`: 66 righe, 0 ancora da verificare progressivamente.

## Conteggi
- Squadre: 20
- Giocatori: 714
- Amichevoli/eventi: 94
- Trattative aggregate: 186
- Ufficialita in entrata: 97
- Ufficialita in uscita: 136
- SOS/infortunati: 8
- Fonti: 126

## Note operative
Non serve reinstallare ioSudo. Dopo il deploy chiudere e riaprire l'app; se resta cache vecchia, aprire dal browser e fare refresh.


Nota V627: 335 occorrenze con fonte generica/homepage marcata DA VERIFICARE sono state lasciate non cliccabili per evitare link a fonti generiche al posto dell'articolo puntuale.
