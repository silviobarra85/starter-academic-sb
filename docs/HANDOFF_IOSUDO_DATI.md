# Handoff ioSudo e dati

## Versione corrente

- ioSudo: V756.
- Overlay complessivo: V767.
- Sorgente dati mercato: Excel V140, cutoff 22/07/2026 14:30 CEST.
- Sorgente ruoli: ultimo listone disponibile, `2026-07-04.json`.
- Payload runtime: `static/fanta-engine/data/sudatori/current/sudatori-runtime.json`.
- Archivio tecnico: `static/fanta-engine/data/sudatori/current/sudatori-data.json`.

## Catalogo unico V756

La vista `GIOCATORI` usa `playerDirectory`, unione deduplicata di:

- rose;
- listone;
- trattative e rumor;
- ufficialità;
- SOS/infortuni;
- probabili formazioni;
- tabellini delle amichevoli.

Conteggi:

- 1.182 identità canoniche;
- 1.020 righe nelle rose tecniche dopo la deduplica;
- tutte le 663 righe del listone rappresentate una sola volta;
- 26 giocatori presenti soltanto nel listone;
- 136 giocatori provenienti soltanto dai flussi informativi;
- 1.228 righe operative collegate a uno o più ID canonici;
- zero ID Fantacalcio duplicati;
- zero nomi visualizzati duplicati.

Nel payload mobile le 1.020 identità già presenti nelle rose sono referenziate nel catalogo soltanto per ID. Le schede complete vengono duplicate solo per le identità non presenti nelle rose, riducendo il payload runtime a circa 4,55 MB.

## Regola identità

1. Ogni persona possiede un solo ID canonico.
2. Un trasferimento non crea una seconda persona: le righe di squadra precedente e successiva confluiscono nello stesso ID.
3. Il ruolo del listone è autorevole quando è disponibile.
4. Il ruolo contenuto in una notizia non può creare una seconda identità.
5. Le omonimie vere sono distinte tramite il nome completo.
6. Ogni riga operativa contiene `canonicalPlayerId` o `canonicalPlayerIds`.
7. Il nome viene ampliato soltanto con associazione univoca o registro anagrafico verificato.

## Disambiguazioni V756

- `Massolin` = `Yanis Massolin`, Inter, ruolo C.
- `Rabby Nzingoula` è una persona distinta; la forma errata `Rabby Nzingoula Massolin` è rimossa.
- `Coulibaly W.` Lecce = `Lassana Coulibaly`.
- `Coulibaly W.` Sassuolo = `Woyo Coulibaly`.
- `Kostic` Juventus = `Filip Kostić`.
- `Kostic` Milan = `Andrej Kostić`.
- `Pessina Mas.` Bologna = `Massimo Pessina`.
- `Pessina Mas.` Monza = `Matteo Pessina`.
- `Venturino` = `Lorenzo Venturino`.
- `Orsolini` = `Riccardo Orsolini`.
- `Dell'Aquila` = `Francesco Dell’Aquila`, ruolo A dalla relativa ufficialità.

Sono inoltre state unificate le identità duplicate di Alisson Santos, Gabriele Calvani, Gaetano Oristanio, Giacomo Giacomone, Giorgio Cittadini, Mattia Liberali, Riccardo Orsolini, Lorenzo Venturino e Sebastiano Esposito.

## Apertura scheda giocatore

V756 non risolve più le notizie al momento del click. Durante il caricamento costruisce una sola volta:

- `playerByIdIndex`: ID giocatore → scheda;
- `playerSourceIndex`: ID giocatore → ufficialità, rumor, SOS, formazione e amichevoli.

L'apertura del dettaglio è quindi una lettura indicizzata per ID, senza scansioni globali `notizie × giocatori` sul thread principale.

La navigazione usa la History API e non assegna direttamente `window.location.hash`; viene così eliminato il secondo rendering sincrono che poteva seguire il click. Il dettaglio dispone anche di una protezione contro il rientro e di un error boundary isolato.

## Sorgente e ruolo

- Il badge P/D/C/A è a sinistra del nome.
- I nomi sono visualizzati in maiuscolo.
- Il badge `SORGENTE` indica la provenienza del nome canonico: ROSA, LISTONE, TRATTATIVA, UFFICIALITÀ, SOS, FORMAZIONE, AMICHEVOLE o ANAGRAFICA.
- La presenza di dati del listone non sovrascrive più la sorgente esplicita del nome.
- Nel dettaglio personale le righe rumor non ripetono il nome del giocatore.
