# ioSudo V622

V622 aggiorna ioSudo con la nuova vista rapida `GIOCATORI`.

## Vista GIOCATORI

Il nuovo pulsante `GIOCATORI`, accanto a `SQUADRE`, `SOS`, `RUMOR`, `UFFICIALITÀ` e `AMICHEVOLI`, mostra una lista compatta di tutti i giocatori presenti nell'app.

Per ogni giocatore vengono mostrati:
- nome;
- ruolo;
- squadra reale;
- squadra fantasy live, oppure `-` se non assegnato;
- badge mercato/SOS;
- data dell'ultimo aggiornamento rilevante;
- presenza o assenza nel listone più recente.

Il clic sulla riga giocatore apre il dettaglio giocatore.

## Listone

La presenza nel listone viene controllata a runtime leggendo il manifest e il file più recente in:

```text
static/fanta-engine/data/shared-assets/current/assets/listoni/
```

Il service worker usa strategia network-first anche per i listoni, come già accade per i dati Sudatori e per le rose live.

Non è richiesta reinstallazione della PWA: dopo il deploy basta chiudere e riaprire l'app, oppure fare refresh dal browser in caso di cache vecchia.
