# Handoff V501 - Tool engine comune ZonaOrientale

## Obiettivo

Spostare il Sorteggio giornate nel motore comune `fanta-engine`, mantenendo wrapper e fallback locali.

## Modifiche

- Aggiunto motore comune `matchday-draw-engine-v501.js`.
- Aggiornato wrapper locale `matchday-draw-tool-v473.js`.
- Aggiornato cache-buster/footer/config a V501.
- Aggiunti audit V501.

## Rischi evitati

- Non sono stati toccati Firebase, EmailJS, dati o dashboard.
- Non e stata cancellata la copia locale del tool.
- Non sono stati cambiati markup o CSS del tool.

## Verifica manuale

Aprire la home, sezione Sorteggio giornate, generare un seed, eseguire sorteggio, copiare JSON e ricaricare pagina per verificare ripristino.
