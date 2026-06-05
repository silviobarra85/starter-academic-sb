# Matrice audit workflow pubblicazione Admin V351

## File verificato

| File | Stato | Decisione V351 |
| --- | --- | --- |
| `assets/js/refactor/admin-publication-workflow-v213.js` | presente, non importato direttamente | tenere, non rimuovere in V351 |

## Workflow canonico attivo

| Area | Implementazione attiva | Esito |
| --- | --- | --- |
| Stato Firebase / JSON | inline in `assets/app.js`, V190 | preservato |
| Preflight asset pubblici | inline in `assets/app.js`, V179/V203 | preservato |
| Promemoria pubblicazione dati | inline in `assets/app.js`, V189 | preservato |
| Pannello Admin | inline in `assets/app.js` | preservato |

## Rischio

Rischio basso in V351: audit-only, nessuna rimozione e nessun cambio logico.

Il rischio diventerebbe medio se si decidesse di rimuovere V213, perche riguarda documentazione storica e flussi Admin/pubblicazione. Eventuale rimozione va fatta solo in una versione dedicata.
