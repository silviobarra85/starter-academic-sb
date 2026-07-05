# V568 - Colonne mobili Rose/Area Squadra adattive

## Obiettivo

Correggere il layout mobile dopo V567: la prima colonna delle tabelle rosa non deve troncare il nome del giocatore e la colonna `Costo` non deve occupare piu' spazio del contenuto.

## Intervento

- Nuovo CSS comune: `static/fanta-engine/css/roster-mobile-column-fit-v568.css`.
- Applicazione su entrambe le leghe tramite `index.html`.
- La prima colonna `Giocatore` mantiene sticky/opacita' V567 ma perde larghezza fissa, `max-width` ed ellissi.
- La colonna `Costo` viene impostata a larghezza minima di contenuto (`width: 1%`, `min-width: max-content`) con allineamento numerico a destra.
- Anche `Qt.A` viene resa compatta per evitare colonne numeriche sovradimensionate.

## Funzionalita' preservate

- Firebase, EmailJS, Admin, Presidente.
- Area Squadra, Rose, Listone, Fantamercato.
- Calciomercato disattivato V561.
- Svincola Giocatori ZonaOrientale V563.
- Header Svincola V564.
- Logo presidente per stagione V565.

## Audit

```bash
node static/fanta-engine/tools/audit-roster-mobile-column-fit-v568.mjs
```

## Test manuale consigliato

- Smartphone o emulazione mobile.
- ZonaOrientale: Area Squadra, tabella rosa, scroll orizzontale.
- ZonaOrientale: sezione Rose, espandi una squadra, scroll orizzontale.
- Ripetere su FantaMantraManager.
- Verificare che il nome giocatore non venga troncato e che `Costo` sia compatta.
