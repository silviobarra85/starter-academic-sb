# Handoff sito e FantaEngine

## Overlay cumulativo V785

Questo overlay comprende sia la disattivazione temporanea ioSudo prevista dalla V783 sia la pubblicazione del nuovo listone ufficiale del 05/08/2026. Non richiede l'applicazione preventiva della V783.

## Listone condiviso

- Sorgente: `Quotazioni_Fantacalcio_Stagione_2026_27.xlsx`.
- JSON: `static/fanta-engine/data/shared-assets/current/assets/listoni/2026-08-05.json`.
- Stagione: `2026-2027`.
- Giocatori attivi: 494; ceduti/asteriscati: 0.
- Squadre: 20; ID duplicati: 0; nomi duplicati: 0.
- Il manifest conserva `2026-07-04` e aggiunge `2026-08-05` come voce più recente.
- ZonaOrientale e FantaMantraManager usano entrambi il manifest e la base listoni centralizzati.
- Le configurazioni e le release shell delle due leghe restano invariate: il loader listoni usa `cache: no-store`, quindi il nuovo manifest viene letto senza alterare il bootstrap static-first.

## Compatibilità ID

- Ogni listone conserva i propri `fantacalcioId`; i link Fantacalcio.it usano l'ID della versione selezionata.
- Nel confronto con il 4 luglio risultano 432 identità abbinate, 108 nuove e 277 non più presenti.
- Le rose delle leghe vengono collegate al listone a runtime tramite il nome normalizzato, quindi il cambio degli ID non sostituisce gli ID canonici delle rose.
- Aggiunta la mappatura `FRO -> frosinone` nei due runtime e nei convertitori, necessaria per generare i link Fantacalcio.it corretti dei giocatori del Frosinone.

## Funzionalità preservate

- Selettore storico listoni, ricerca, filtri, ordinamenti, ruoli Classic/Mantra, svincolati, rose e link giocatore.
- Bootstrap static-first, Firebase, Admin, competizioni e snapshot non vengono modificati.
- ioSudo resta in manutenzione; i dati V782 non vengono cancellati.
