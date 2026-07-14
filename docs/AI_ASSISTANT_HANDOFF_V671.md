# Handoff V671

Problema: le card mobile del Listone restavano strette e con sfondo verde per interferenza della vecchia skin `player-tables-mobile-v584.css`, in particolare `td.fpt-v584-col-player` e `tr[data-fpt-v584-role] > *`.

Soluzione: CSS V671 + runtime JS V671. Il runtime opera solo sulle righe-card del Listone, aggiunge `site-mobile-fullwidth-card-cell-v671`, rimuove `fpt-v584-col-player` e `data-fpt-v584-role`, e forza la larghezza a `min(calc(100dvw - 1.25rem), 48rem)`.
