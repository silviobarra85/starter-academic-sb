# Handoff ioSudo e dati

## Versione corrente

- ioSudo: V759.
- Overlay complessivo: V770.
- Sorgente dati: Excel V146, cutoff 22/07/2026 21:51 CEST.
- Sorgente ruoli: ultimo listone disponibile, `2026-07-04.json`.
- Payload runtime: `static/fanta-engine/data/sudatori/current/sudatori-runtime.json`.
- Archivio tecnico: `static/fanta-engine/data/sudatori/current/sudatori-data.json`.

## Catalogo unico V757

La vista `GIOCATORI` usa un catalogo canonico che unisce e deduplica:

- rose;
- listone;
- trattative e rumor;
- ufficialità;
- SOS/infortuni;
- probabili formazioni;
- tabellini delle amichevoli.

Conteggi:

- 1.198 persone distinte nel catalogo;
- 1.018 giocatori nelle rose tecniche deduplicate;
- tutte le 663 righe del listone rappresentate una sola volta;
- 26 giocatori presenti soltanto nel listone;
- 154 identità presenti soltanto nei flussi informativi;
- 1.433 righe operative collegate a uno o più ID canonici;
- zero ID Fantacalcio duplicati;
- zero nomi visualizzati duplicati.

## Regole identità

1. Ogni persona possiede un solo ID canonico.
2. Un trasferimento non crea una seconda persona: gli ID storici confluiscono nell'identità corrente.
3. Il ruolo del listone è autorevole quando disponibile.
4. Il ruolo contenuto in una notizia non può creare una seconda identità.
5. Il solo cognome non è sufficiente per fondere due giocatori.
6. Le omonimie vere sono distinte tramite nome completo, squadra e ID Fantacalcio.
7. Ogni riga operativa contiene `canonicalPlayerId` o `canonicalPlayerIds`.
8. Il nome viene ampliato soltanto con associazione univoca o registro anagrafico verificato.

## Protezione Adams

- `Akor Adams` è l'attaccante del Venezia, ID canonico `venezia-akor-adams`.
- Il vecchio ID `torino-akor-adams` è soltanto storico e confluisce in `venezia-akor-adams`.
- `Che Adams` è una persona distinta, collegata al Torino e al listone con ID `listone-6646`.
- Non usare mai un alias globale `Adams`.
- Non fondere Akor Adams e Che Adams per cognome, ruolo o precedente squadra.

## Altre dedupliche verificate in V757

Nuove fusioni certe:

- Daniel Maldini: la riga EXTRA_LISTONE Lazio è assorbita nell'identità canonica Atalanta; stesso ID Fantacalcio 4896.
- Riccardo Sottil: la riga EXTRA_LISTONE Lecce è assorbita nell'identità canonica Fiorentina; stesso ID Fantacalcio 2839.

Fusioni riconfermate:

- Mergim Vojvoda: identità corrente Udinese.
- Alieu Fadera: identità corrente Como; riga Sassuolo EXTRA_LISTONE assorbita.
- Seydou Fini: identità corrente Frosinone; entrata e uscita descrivono lo stesso prestito.

Omonimie/alias protetti e non fusi:

- `Coulibaly W.`: Lassana Coulibaly al Lecce e Woyo Coulibaly al Sassuolo.
- `Giovane`: contesto Atalanta distinto dal contesto Napoli.
- `Kostic/Kostić`: Filip Kostić e Andrej Kostić.
- `Pessina Mas.`: Massimo Pessina e Matteo Pessina.
- `Massolin` = Yanis Massolin, Inter; Rabby Nzingoula è distinto.

## Dati V146 integrati

- 422 operazioni ufficiali;
- 225 trattative/rumor attivi;
- 14 rumor Transfermarkt attivi;
- 26 SOS/infortuni attivi;
- 106 amichevoli;
- 27 tabellini;
- 541 prestazioni individuali;
- 807 fonti URL deduplicate.

## Apertura scheda giocatore

V757 mantiene l'architettura indicizzata introdotta in V756:

- `playerByIdIndex`: ID giocatore → scheda;
- `playerSourceIndex`: ID giocatore → ufficialità, rumor, SOS, formazione e amichevoli.

L'apertura del dettaglio è una lettura per ID e non esegue scansioni globali `notizie × giocatori` sul thread principale. La navigazione usa la History API, con protezione dal doppio rendering, rientro e crash del dettaglio.

## Sorgente e ruolo

- Il badge P/D/C/A è a sinistra del nome.
- I nomi sono visualizzati in maiuscolo.
- Il badge `SORGENTE` indica la provenienza con cui il giocatore entra nel catalogo. LISTONE ha priorità per ogni giocatore presente nell’ultimo listone. ANAGRAFICA/alias è solo un metadato interno per ricostruire il nome completo e non deve comparire nell’interfaccia.
- Nel dettaglio personale le righe rumor non ripetono il nome del giocatore.

## Correzioni identità V759

- Yunus Musah è una sola identità: `milan-yunus-musah`, ruolo C dal listone e squadra corrente Milan dall’ufficialità dell’11/07/2026. Il valore Atalanta nel listone del 04/07 resta soltanto storico.
- `Samuel Giovane`, ID `atalanta-giovane-atalanta`, è il centrocampista dell’Atalanta.
- `Giovane Santana do Nascimento`, ID `napoli-giovane-napoli`, è l’attaccante del Napoli.
- Non mostrare più `Giovane (Atalanta)` o `Giovane (Napoli)`.
- L’alias semplice `Giovane` è consentito solo con contesto squadra/ID e non può essere globale.
- Le due identità non devono condividere alias, ID, ruolo o righe operative.
