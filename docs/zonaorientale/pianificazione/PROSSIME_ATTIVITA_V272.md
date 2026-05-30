# Prossime attivita V272

Backlog organizzato dopo le modifiche V258-V271.

## Priorita alta

### 1. Test end-to-end listoni V268-V270

Usare l'Excel reale `Lista calciatori` e verificare:

- convertitore formato Classic;
- report giocatori > 0;
- confronto con listone precedente;
- colonna `Modifica`;
- righe `Uscito`;
- indicazione ultimo listone.

### 2. Test EmailJS operativo

Verificare su ambiente reale:

- comunicato avvenuto scambio;
- svincola giocatori;
- oggetti email V266;
- Reply-To;
- spam/inbox.

Possibile sviluppo futuro: migrazione da EmailJS a Netlify Function + provider transazionale.

### 3. Verifica Firebase Rules V257

Confermare che le rules siano pubblicate e che la lettura esiti trattative sia multi-dispositivo.

## Priorita media

### 4. Audit `domain/competitions.js`

Obiettivo: capire se il modulo e' ancora utile, da reintegrare o da archiviare.

### 5. Audit `admin-publication-workflow-v213.js`

Obiettivo: decidere se rimuovere modulo legacy o conservarlo come archivio.

### 6. Pulizia fisica asset residui

Se non gia fatta in repo:

- rimuovere duplicati simulatori;
- rimuovere hotfix CSS non linkati;
- rimuovere file macOS.

## Nuove funzionalita possibili

### Listoni

- filtro dedicato per `Nuovo`, `Uscito`, `+/- quotazione`, `Stato`, `Squadra`, `Ruolo`.
- confronto manuale tra due listoni scelti dall'utente, non solo precedente automatico.
- export CSV/JSON delle differenze listone.

### Presidente

- storico Firebase/Admin per informative `Svincola Giocatori` inviate.
- download PDF/testo della mail svincolo.
- conferma visuale piu' dettagliata dopo invio comunicazioni EmailJS.

### Admin

- dashboard diagnostica piu' pulita, separando strumenti tecnici da funzioni operative.
- log azioni Admin su richieste presidenti/comunicati.
- controllo automatico disallineamenti rosa/listone.

### Dati esterni

- provider mail transazionale con Netlify Function.
- import listoni piu' robusto con anteprima colonne riconosciute.
- validatore Excel prima della conversione.
