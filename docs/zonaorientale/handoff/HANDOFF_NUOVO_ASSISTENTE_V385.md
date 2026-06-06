# Handoff V385 - Soccer Data associazione FBref locale

## Stato

- Runtime atteso: V385.
- Soccer Data continua a usare `fbref-player-map.v383.json`.
- Mapping confermati: 531/532.
- Residuo storico: `Balentien` (`fc-7262`) in needs-review.
- V385 non aggiunge mapping confermati: aggiunge solo il flusso UI per preparare patch future.

## Cosa fa V385

Per ogni giocatore non associato/needs-review mostra nella cella `FBref / Giocatore`:

- `Cerca FBref`;
- `Copia dati mapping`;
- campo `Link FBref`;
- campo `Nome FBref opz.`;
- `Prepara mapping`;
- dopo la preparazione: `Copia patch` e `Rimuovi patch`.

A livello sezione aggiunge:

- `Copia patch FBref`;
- `Scarica patch FBref`.

La patch e un JSON locale, salvato temporaneamente nel browser via localStorage ed esportabile. Non scrive su Firebase e non modifica `fbref-player-map.v383.json`.

## Non rompere

Preservare tutte le funzionalita esistenti: Admin, Area squadra, trattative, simulazioni, dashboard presidente, centro notifiche, listone, rose, competizioni, calciomercato, player page.

## Prossimo passo consigliato

Quando l'utente prepara una patch FBref dal sito, usare quel JSON per creare una nuova release mapping statica, ad esempio `fbref-player-map.v386.json`, dopo verifica manuale dei link.
