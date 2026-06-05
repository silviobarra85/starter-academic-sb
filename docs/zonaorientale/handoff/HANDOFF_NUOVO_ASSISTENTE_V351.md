# Handoff nuovo assistente AI - V351

## Stato

Versione corrente: V351.

## Modifica V351

Audit mirato di `assets/js/refactor/admin-publication-workflow-v213.js`.

Il file resta presente e non importato. Il workflow Admin pubblicazione canonico resta inline in `assets/app.js`.

## Vincolo principale

Preservare tutte le funzionalita esistenti. Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.

## Tool rilevante

- `static/zonaorientale/tools/audit-admin-publication-workflow-v351.mjs`

## Diagnostica runtime

- `window.ZonaOrientaleAdminPublicationWorkflowAuditV351`

## Prossimo passo consigliato

V352: audit dei CSS mobile hotfix storici `mobile-hotfix-v166.css` e `mobile-hotfix-v167.css`. Prima audit, poi eventuale rimozione in una V separata o nello stesso step solo se i controlli confermano assenza di import.
