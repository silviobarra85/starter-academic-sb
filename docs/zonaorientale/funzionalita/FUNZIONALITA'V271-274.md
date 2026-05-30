# FUNZIONALITA' V271-V274 - ZonaOrientale

Documento aggiuntivo al registro funzionale principale. Non sostituisce `FUNZIONALITA'.md` e non deve essere usato per cancellare funzionalita esistenti.

Periodo coperto: V271, V272, V273, V274.
Versione di riferimento: V275 funzionalita V271-274.
Branch di lavoro: `refactor/260528-zonaorientale-next`.

## Regola di manutenzione

- `FUNZIONALITA'.md` resta il registro storico principale e va modificato solo su richiesta esplicita.
- Questo file registra le modifiche recenti e deve essere consultato prima di refactor, pulizie o merge.
- Prima di rimuovere codice legacy, verificare che la funzionalita non sia citata qui, nei file `FUNZIONALITA'V240-255.md`, `FUNZIONALITA'V256-262.md`, `FUNZIONALITA'V263-270.md` o in `REGRESSION_TESTS.md`.

## Pubblico

### Listone

Funzionalita consolidate tra V271 e V274:

- La colonna opzionale `Modifica`, introdotta in V270, resta parte del Listone.
- La colonna `Modifica` puo indicare: `Nuovo`, `Uscito`, variazione quotazione `+N`/`-N`, cambio stato, cambio squadra, cambio ruolo o piu variazioni.
- I giocatori usciti dal listone corrente ma presenti in listoni precedenti possono essere mostrati come righe storiche.
- Le righe storiche indicano l'ultimo listone in cui il giocatore era presente.
- La ricerca puo includere anche altri listoni, non solo quello selezionato.
- Il confronto storico non deve generare falsi cambi squadra per differenze tra sigle e nomi estesi.

### Codici squadra nel Listone

Da V274 il sistema accetta sia sigle sia nomi estesi in input, ma visualizza e usa internamente il codice canonico a tre lettere.

Esempi:

- `Atalanta` -> `ATA`
- `Bologna` -> `BOL`
- `Inter` -> `INT`
- `Milan` -> `MIL`
- `Hellas Verona` -> `VER`

Regole:

- Il valore visualizzato nella tabella deve essere il codice canonico.
- Il valore originale proveniente dall'Excel puo essere conservato come metadato, ad esempio `realTeamOriginal`.
- La ricerca deve continuare a funzionare sia con sigla sia con nome esteso.
- Il confronto storico deve usare il valore canonico, non il testo grezzo dell'Excel.

## Presidente

Nessuna nuova funzionalita presidente e' stata introdotta tra V271 e V274. Restano valide le funzionalita precedenti:

- Dashboard Presidente.
- Comunicati squadra.
- Comunicati avvenuto scambio con EmailJS e richiesta Admin.
- Svincola Giocatori con invio EmailJS.
- Trattative inviate/ricevute e notifiche.
- Lettura esiti trattative sincronizzata con Firebase quando le rules V257 sono pubblicate.

## Admin

### Converti listone Excel

Funzionalita consolidate:

- Supporto formato storico con fogli `Tutti` e `Ceduti`.
- Supporto formato Classic a foglio singolo, ad esempio `Lista calciatori`.
- Mappatura colonne Classic:
  - `#` -> identificativo Fantacalcio
  - `Nome` -> nome giocatore
  - `Sq.` -> squadra reale, normalizzata a codice canonico
  - `R.` -> ruolo classic
  - `R.MANTRA` -> ruoli mantra
  - `QUOT.` -> quotazione attuale
  - `FVM/1000` -> FVM
  - `FantaSquadra` -> rosa/squadra fantasy se presente
  - `Costo` -> costo rosa se presente
  - `Fuori lista` -> stato in listone / asteriscato
- Report conversione con numero giocatori, formato riconosciuto, fogli usati e statistiche di stato.
- Confronto automatico con il listone precedente quando disponibile.
- Normalizzazione stabile dei codici squadra per evitare falsi cambi squadra.

### Test reale V273

Il test con il file Excel reale `lista_calciatori_lista calciatori_classic_zonaorientale-salerno.xlsx` ha prodotto:

- Formato riconosciuto: Fantacalcio Classic a foglio singolo.
- Foglio usato: `Lista calciatori`.
- Giocatori convertibili: 663.
- Giocatori in listone: 532.
- Giocatori asteriscati: 131.
- Giocatori con quotazione valida: 663.
- Giocatori con FantaSquadra valorizzata: 299.
- Confronto con listone precedente `2026-05-15`:
  - giocatori comuni: 661;
  - nuovi giocatori: 2;
  - giocatori usciti: 0;
  - quotazioni aumentate: 96;
  - quotazioni diminuite: 120;
  - quotazioni invariate: 445;
  - cambi ruolo: 0;
  - cambi squadra reali dopo normalizzazione: 0;
  - cambi stato: 1.

Nuovi giocatori rilevati nel test:

- Mikolajewski - Parma - Qt.A 2.
- Mosconi - Inter - Qt.A 1.

## Sviluppo, test e manutenzione

### Handoff e documentazione

V272 ha riorganizzato la documentazione di handoff e pre-merge in cartelle:

- `docs/zonaorientale/handoff/`
- `docs/zonaorientale/audit/`
- `docs/zonaorientale/pianificazione/`
- `docs/zonaorientale/release/`
- `docs/zonaorientale/listoni/`

V275 aggiunge questo registro funzionale per V271-V274.

### Diagnostiche runtime rilevanti

- `window.ZonaOrientaleFunctionLedgerV271`
- `window.ZonaOrientalePreMergeAuditV272`
- `window.ZonaOrientaleListoneE2ETestV273`
- `window.ZonaOrientaleListoneTeamCodesV274`
- `window.ZonaOrientaleFunctionLedgerV275`

### Test da ripetere dopo modifiche al Listone

1. Aprire `Admin -> Converti listone Excel`.
2. Caricare un Excel Classic a foglio singolo.
3. Verificare che il conteggio giocatori sia maggiore di zero.
4. Verificare che le squadre siano salvate/mostrate con codice canonico a tre lettere.
5. Aprire la sezione pubblica `Listone`.
6. Abilitare la colonna `Modifica` nei campi visibili.
7. Verificare assenza di falsi cambi squadra di massa.
8. Cercare un giocatore presente in altri listoni.
9. Verificare la sezione storica e gli eventuali usciti.

## Funzionalita da non perdere

Non rimuovere senza test mirato:

- `assets/js/admin/listone-converter.js`.
- La colonna `Modifica` del Listone.
- Il filtro/controllo `Mostra usciti storici`.
- La ricerca storica negli altri listoni.
- La normalizzazione codici squadra V274.
- I documenti `docs/zonaorientale/listoni/LISTONE_TEST_REALE_V273.md` e `docs/zonaorientale/listoni/LISTONE_CODICI_SQUADRA_V274.md`.

## Prossime verifiche consigliate

- Verificare un secondo Excel reale futuro per confermare che la normalizzazione squadra resta corretta.
- Verificare eventuali omonimie tra giocatori usando identificativo Fantacalcio `#` come chiave primaria.
- Decidere se portare queste informazioni nel file principale `FUNZIONALITA'.md` quando richiesto esplicitamente.
