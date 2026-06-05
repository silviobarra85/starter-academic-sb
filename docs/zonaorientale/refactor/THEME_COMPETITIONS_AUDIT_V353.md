# Refactor V353 - Audit tema/competizioni

La V353 non modifica logica runtime. Aggiunge un audit mirato per chiarire lo stato di due candidati legacy rimasti:

1. `assets/css/refactor/theme-light-suspended.css`
2. `assets/js/domain/competitions.js`

## Motivazione

Dopo le rimozioni controllate V343-V352, questi file risultano ancora candidati ma con rischio non nullo:

- il CSS Light sospeso puo servire come rollback/archivio per una futura ricostruzione del tema chiaro;
- il modulo `domain/competitions.js` duplica helper competizioni gia inline in `assets/app.js`, ma l'area Competizioni e delicata.

## Scelta tecnica

La V353 introduce solo:

- audit CLI `audit-theme-competitions-v353.mjs`;
- marker runtime `window.ZonaOrientaleThemeCompetitionsAuditV353`;
- documentazione e matrice decisionale.

Nessun file viene rimosso.

## Prossimo step consigliato

V354: consolidamento finale dei cleanup e programma prossime attivita, oppure audit piu approfondito di `domain/competitions.js` con test manuale delle pagine Competizioni prima di una rimozione futura.
