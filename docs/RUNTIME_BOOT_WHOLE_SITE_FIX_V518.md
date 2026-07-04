# V518 - Force FantaPetillo runtime alignment

Overlay whole-site di recupero dopo il persistere su FantaPetilloMantraManager del caricamento `league-config-v443.js?v=512`.

## Scopo

- Forzare cache-buster V518 su ZonaOrientale e FantaPetilloMantraManager.
- Mantenere il fix `formValidatorsV506: true` nel loader di configurazione di entrambe le leghe.
- Aggiungere alias `installPublicDataAutoloadV518` nel motore condiviso mantenendo compatibilita V515/V516/V517.
- Aggiungere audit V518 con controllo esplicito contro residui V512 nei runtime principali.

## Nota operativa

Se dopo l'applicazione e il deploy Chrome mostra ancora `league-config-v443.js?v=512`, il deploy sta servendo file vecchi o l'overlay e stato applicato a una cartella diversa da quella pubblicata.
