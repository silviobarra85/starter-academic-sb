# Aggiornamento V615 ioSudo

- Corretto campetto app per moduli a quattro valori.
- Separate le fonti aggregate nelle card mercato dell'app.

# Overlay Roadmap

## Stato corrente

- **V613**: fonti mercato multiple in ioSudo mostrate come chip separati e cliccabili singolarmente.

## Cronologia recente

- **V591**: aggiunta sezione standalone **Per i SUDATORI**.
- **V592**: aggiornata sezione Sudatori con listone corrente, rosa fantacalcio e mercato/formazioni.
- **V593**: aggiunto campetto probabile formazione in Sudatori e migliorato matching listone.
- **V594**: aggiunte trattative in corso per ogni squadra Serie A nella sezione standalone Sudatori.
- **V595**: aggiunti infortunati/monitoraggi SOS Fanta e corretto il campetto affinche usi il modulo dichiarato come vincolo.
- **V596**: rese leggibili le segnalazioni infortuni con stile scuro coerente con le card trattative.
- **V597**: applicato il nuovo Excel con formazioni coerenti e campetti allineati al modulo usato.
- **V598**: corretto orientamento ruoli sul campo, badge fisici sul campo e colonna Mercato.
- **V599**: aggiornati dati TMW e mantenuti i fix UI.
- **V600**: aggiornato Excel serale con movimenti, amichevoli e trattative.
- **V601**: aggiornati raduni/amichevoli e rumors Transfermarkt.
- **V602**: mostrati i rumors mercato nella colonna Mercato anche quando lo stato base era `In rosa`.
- **V607**: badge Mercato unico `NUOVO/RUMOR/CONFERMATO`, fix Gaetano e disambiguazione Giovane.
- **V608**: riepilogo mercato per squadra con ufficialita/trattative in entrata e uscita; una sola card trattativa per giocatore con fonti aggregate; ufficialita escluse dalle trattative in corso.
- **V609**: app **ioSudo** installabile, collegata allo stesso `sudatori-data.json` corrente.
- **V610**: logo ioSudo, barra superiore compatta e rosa ordinata da P ad A.
- **V611**: dettaglio giocatore cliccabile, colori ruolo, ricerca nascosta quando una squadra e aperta, menu squadra sticky.
- **V612**: card squadre ioSudo a righe con colori sociali e testi leggibili.
- **V613**: fonti mercato multiple in ioSudo separate e cliccabili singolarmente.

## Prossimi sviluppi possibili

- Aggiungere preferiti locali in ioSudo.
- Aggiungere filtro per squadra fantacalcio nella rosa.
- Aggiungere push/alert solo in una fase successiva, se serve un backend.
- Aggiungere collegamento diretto dai side rail desktop del sito.

## Guardrail

La sezione Sudatori e ioSudo devono restare standalone e cancellabili senza impatti su Rose, Listone, Area Squadra, Admin, Firebase o dati ufficiali di lega. ioSudo non deve duplicare i dati Sudatori.
