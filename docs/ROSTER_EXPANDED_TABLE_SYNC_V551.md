# V551 - Sincronizzazione tabella Rose espansa con Listone

## Obiettivo

V550 ha unificato lo stile delle tabelle Rose/Listone, ma il dettaglio aperto da **Espandi/Riduci** nella sezione Rose usava ancora un renderer catturato prima degli override più recenti. Il risultato era una tabella con vecchio layout: niente colonna **Stato**, font non allineato e prima colonna non colorata per ruolo.

V551 corregge quel punto specifico senza cambiare dati, Listone, Regolamento, Firebase, EmailJS, Admin o Presidente.

## Modifica tecnica

Nei due `assets/app.js` il helper mobile/desktop delle Rose riceve ora un delegate dinamico:

```js
renderRosterPlayerTable: (...args) => renderRosterPlayerTable(...args)
```

In questo modo il renderer usato da `renderDesktopRosterTableV156` e dal dettaglio mobile chiama sempre l'ultima versione disponibile di `renderRosterPlayerTable`, inclusi gli override V441/V550/V551.

Aggiunto anche CSS comune:

```text
static/fanta-engine/css/roster-listone-table-unification-v551.css
```

che rafforza lo scope solo dentro la sezione Rose, senza toccare le tabelle Regolamento isolate in V540.

## Risultato atteso

Nel dettaglio aperto con **Espandi/Riduci**:

- compare la colonna **Stato**;
- lo stile è coerente con Listone;
- il font è allineato;
- la prima colonna è colorata in base al ruolo;
- il Regolamento resta senza righe colorate.

## Verifica

```bash
node static/fanta-engine/tools/audit-roster-expanded-table-sync-v551.mjs
```

