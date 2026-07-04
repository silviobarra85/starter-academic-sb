# Handoff V491 - Moduli JS comuni

La V491 centralizza selettivamente 12 moduli JS comuni e identici in `static/fanta-engine/js/shared/v491/`. Solo 11 moduli sono usati come import runtime primari da `assets/app.js`; `calciomercato-players-v340.js` viene copiato nel motore ma non viene ancora agganciato perché il runtime usa una versione diversa. Le copie locali restano in entrambe le leghe e nella copia annidata ZonaOrientale: non sono stati cancellati fallback/rollback locali. Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra, news, regolamenti, bilanci, listoni e calciomercato dati non sono stati modificati.

## Stato

Versione corrente V491. La centralizzazione e' selettiva e limitata ai moduli senza import statici e senza dipendenze Firebase/EmailJS. I loader dati continuano a usare l'adapter V490. I JS complessi restano lega-specifici.

## Prossimo passo consigliato

V492: audit regressione runtime esteso prima di qualsiasi ulteriore spostamento.
