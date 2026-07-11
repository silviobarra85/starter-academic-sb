# Overlay Roadmap

## Stato corrente

- **V602**: patch UI della sezione **Per i SUDATORI**. La colonna **Mercato** della tabella rosa mostra ora tutte le segnalazioni collegate al giocatore, incluse le voci Transfermarkt, anche quando lo stato base era `In rosa`.

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
- **V602**: badge mercato in tabella per qualunque rumor/segnalazione, compresi Transfermarkt.

## Prossimi sviluppi possibili

- Aggiungere un filtro per mostrare solo i giocatori con segnalazioni mercato.
- Aggiungere un editor/manuale per note mercato giocatore.
- Consentire upload periodico di un nuovo Excel Sudatori e rigenerazione JSON.
- Aggiungere filtri per ruolo, squadra reale e note mercato.
- Integrare ulteriori parametri se disponibili nei listoni futuri.

## Guardrail

La sezione Sudatori deve restare standalone e cancellabile senza impatti su Rose, Listone, Area Squadra, Admin, Firebase o dati ufficiali di lega.
