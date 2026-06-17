# V456 - Hotfix click selettore card Admin

## Perche esiste

La V455 migliorava il selettore card Admin, ma in pagina reale il menu poteva risultare non cliccabile e il Generatore comunicati automatici non veniva sempre censito tra le card controllabili.

La V456 sostituisce il runtime con una versione piu diretta: niente pannello `details`, azioni gestite in capture phase e controllo esplicito del generatore comunicati.

## Comportamento Admin

- Il selettore resta subito sotto il titolo Admin.
- Di default nessuna card Admin e selezionata, quindi nessuna card e visibile.
- I pulsanti `Mostra tutte` e `Nascondi tutte` sono sempre cliccabili.
- Le checkbox aggiornano subito la visibilita delle card.
- Il Generatore comunicati automatici e incluso nella lista del selettore.
- Le card di pubblicazione dati restano incluse:
  - Nessun aggiornamento statico in sospeso;
  - Stato Firebase / JSON;
  - Procedura guidata Pubblica aggiornamenti.
- La Checklist QA Admin in basso resta nascosta di default.
- La Checklist QA Admin si mostra solo con il checkbox dedicato.

## File runtime

```text
assets/js/core/admin-card-visibility-v456.js
assets/css/refactor/admin-card-visibility-v456.css
tools/audit-admin-card-visibility-v456.mjs
```

## Invarianti

- Nessuna modifica a Firebase o rules.
- Nessuna modifica ai salvataggi Admin.
- Nessuna modifica ad Area Squadra.
- Nessuna modifica a Regolamento V453.
- Favicon FantaPetillo mantiene i file cache-proof V455, con cache-buster aggiornato a V456.
- ZonaOrientale e FantaPetillo restano separati.
