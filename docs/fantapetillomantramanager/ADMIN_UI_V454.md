# V454 - Menu visibilita' Admin

La sezione Admin di FantaPetilloMantraManager ora include un selettore card sotto il titolo principale.

## Uso

1. Entra in `/#admin` con utente admin.
2. Apri `Menu card Admin`.
3. Spunta solo le card da usare.
4. Usa `Mostra tutte` solo quando serve una vista completa.
5. Usa `Nascondi tutte` per tornare alla vista pulita.

## Checklist QA Admin

La Checklist QA Admin in basso e' nascosta per impostazione predefinita. Per visualizzarla:

1. entra in Admin;
2. apri il menu card;
3. spunta `Mostra Checklist QA Admin in basso`.

## Note tecniche

- Runtime: `assets/js/core/admin-card-visibility-v454.js`.
- CSS: `assets/css/refactor/admin-card-visibility-v454.css`.
- Audit clone: `tools/audit-admin-card-visibility-v454.mjs`.
- Default: nessuna card visibile.
- Preferenze: localStorage separato per slug della lega.
