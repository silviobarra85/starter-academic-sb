# Funzionalita V385 - Soccer Data associazione FBref locale

Documento additivo di release. Non sostituisce e non modifica `FUNZIONALITA'.md`.

## Soccer Data

- Sezione sempre read-only rispetto a Firebase.
- Mapping dati invariato: `fbref-player-map.v383.json`.
- Per i giocatori `Da associare` / `needs-review` la cella `FBref / Giocatore` mostra un mini flusso di associazione.
- Il flusso consente di:
  - aprire `Cerca FBref`;
  - incollare il link profilo FBref;
  - indicare un nome FBref opzionale;
  - premere `Prepara mapping`;
  - copiare o rimuovere la patch della singola riga.
- A livello sezione sono disponibili `Copia patch FBref` e `Scarica patch FBref`.
- La patch viene generata come JSON locale, con base mapping dichiarata e metadata `firebaseWrites: false` / `liveScraping: false`.
- Le bozze patch restano solo nel browser tramite `localStorage`; non vengono salvate su Firebase e non modificano il mapping statico.

## Garanzie di non regressione

- Nessuna scrittura Firebase.
- Nessuno scraping live dal browser.
- Nessun cambio al caricamento listoni.
- Nessun cambio al mapping V383.
- Nessuna modifica a `FUNZIONALITA'.md`.
- Le funzioni V371/V372/V383/V384 restano presenti.
- Il pulsante tecnico di copia riga non viene rimosso: viene rinominato in `Copia dati mapping` dentro il flusso di associazione.
