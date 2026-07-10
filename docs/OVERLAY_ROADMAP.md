
## V599 - Sudatori Excel TMW aggiornato
- Applicato il nuovo Excel con aggiornamenti TMW alla sezione Per i SUDATORI.
- Riallineate rose, note mercato/trattative e XI Lazio; mantenute le correzioni campo/badge V598.

# Overlay Roadmap

## Stato corrente

- **V599**: correzione UI del campetto Sudatori: lato destro/sinistro coerente con i ruoli, badge fisico nascosto per disponibili, badge rosso solo per segnalazioni, rimozione badge **Probabile XI** dalla colonna **Mercato**.

## Cronologia recente

- **V591**: aggiunta sezione standalone **Per i SUDATORI**.
- **V592**: aggiornata sezione Sudatori con listone corrente, rosa fantacalcio e mercato/formazioni.
- **V593**: aggiunto campetto probabile formazione in Sudatori e migliorato matching listone.
- **V594**: aggiunte trattative in corso per ogni squadra Serie A nella sezione standalone Sudatori.
- **V595**: aggiunti infortunati/monitoraggi SOS Fanta e corretto il campetto affinché usi il modulo dichiarato come vincolo.
- **V596**: rese leggibili le segnalazioni infortuni con stile scuro coerente con le card trattative.
- **V597**: applicato il nuovo Excel con formazioni coerenti e campetti allineati al modulo usato.
- **V599**: corretto orientamento ruoli sul campo, badge fisici sul campo e colonna Mercato.

## Prossimi sviluppi possibili

- Aggiungere un editor/manuale per note mercato giocatore.
- Consentire upload periodico di un nuovo Excel Sudatori e rigenerazione JSON.
- Aggiungere filtri per ruolo, squadra reale e note mercato.
- Integrare ulteriori parametri se disponibili nei listoni futuri.

## Guardrail

La sezione Sudatori deve restare standalone e cancellabile senza impatti su Rose, Listone, Area Squadra, Admin, Firebase o dati ufficiali di lega.
