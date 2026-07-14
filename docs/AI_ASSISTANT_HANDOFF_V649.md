# AI Assistant Handoff V649

## Scopo

Aggiornare ioSudo dal file Excel globale v23 del 14/07/2026 e correggere due problemi segnalati:

1. navigazione tra sezioni app diventata lenta;
2. sezione `AMICHEVOLI` contaminata da righe fonte/guida non-partita.

## Cosa è stato fatto

- `manifest.json` e `sudatori-data.json` portati a V649.
- `iosudo-app-v649.js` creato da V648 con patch mirate.
- `iosudo-app-v649.css` copiato da V648, invariato funzionalmente.
- `static/iosudo/index.html` e `static/iosudo/sw.js` aggiornati con cache-buster V649.
- Nuovo audit `audit-iosudo-v649.mjs`.

## Performance

La lentezza era verosimilmente dovuta a due fattori:

- navigazione intercettata sia dal listener diretto sui pulsanti sia dal listener delegato globale;
- bind dei click ripetuto su tutte le card a ogni render.

V649 usa un solo handler delegato su `iosudoResults` per squadre/giocatori e mantiene un solo handler delegato per i pulsanti `data-view`.
La cache `GIOCATORI` non viene più preriscaldata in background: viene costruita quando la sezione viene aperta.

## Amichevoli

Il dataset V649 contiene solo partite effettive nella sezione `friendliesByTeam`:

- evento con separatore `Squadra-Squadra`, `Squadra – Squadra` o simile;
- data valida;
- almeno una squadra coinvolta è una squadra del perimetro Serie A;
- escluse righe guida, fonte, calendario, convocati, raduni, controlli e preparazione.

Righe filtrate: 31.
Partite effettive mantenute: 88.

## Nota operativa

La sezione pubblica `Per i SUDATORI` resta disattivata come da V647. Il dataset Sudatori resta usato internamente da ioSudo.
