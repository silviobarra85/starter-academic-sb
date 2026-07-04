# Dashboard renderer helpers V505

La V505 introduce helper comuni per renderer dashboard dentro `static/fanta-engine`.

## File principali

- `static/fanta-engine/js/ui/dashboard-renderer-helpers-v505.js`
- `static/fanta-engine/data/dashboard-renderer-helpers-v505.json`
- `static/fanta-engine/tools/audit-dashboard-renderer-helpers-v505.mjs`

## Cosa e' stato migrato

Il renderer locale `renderAdminPanel(panelId, eyebrow, title, description, bodyHtml)` resta presente in entrambe le leghe, ma ora delega a:

```js
renderCollapsiblePanelV505(...)
```

Questo centralizza la shell HTML comune:

- `article.panel.admin-collapsible-panel`
- header con eyebrow/titolo/descrizione
- pulsante `data-admin-toggle-panel`
- marker `data-dashboard-renderer-v505`
- marker `data-feature-card-id`

## Cosa NON e' stato migrato

- form Admin;
- handler Admin;
- query Firebase;
- invii EmailJS;
- Dashboard Presidente concreta;
- Proposte Regolamento;
- Svincola Giocatori;
- Comunicato Avvenuto Scambio.

## Perche' graduale

La dashboard e' una parte delicata: contiene ruoli, auth, presidenti, richieste, pubblicazione dati e strumenti specifici FantaMantraManager. V505 centralizza solo il wrapper grafico comune, senza toccare la logica.

## Prossimo passo naturale

Dopo test manuali, si puo' procedere con altri renderer comuni, una funzione alla volta, preferendo componenti senza I/O e senza side effect.
