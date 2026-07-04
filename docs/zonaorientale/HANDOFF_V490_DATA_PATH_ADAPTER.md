# Handoff V490 - Data path adapter comune

La V490 introduce `static/fanta-engine/js/core/data-paths-v490.js`, un adapter comune e senza dipendenze per risolvere i path dati (`dataPaths.*`) e per caricare JSON con catena primary/fallback. I loader `static-files-service.js` delle due leghe e della copia annidata ZonaOrientale usano l'adapter con import dinamico e fallback locale: se il motore comune non si carica, restano attive le funzioni locali V446/V485. Non sono stati spostati ulteriori dati e non sono state cancellate copie locali.

## Stato

Versione corrente V490. L'adapter prepara la centralizzazione futura di loader e moduli JS, ma non cambia ancora i domini dati lega-specifici. Le copie locali restano obbligatorie come fallback.

## Prossimo passo consigliato

V491: centralizzazione selettiva dei moduli JS domain/core che possono usare l'adapter senza import relativi fragili.
