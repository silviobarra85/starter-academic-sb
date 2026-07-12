# Per i SUDATORI V618

V618 rende dinamica l'assegnazione dei giocatori alle rose fantacalcio.

## Cosa cambia

La sezione continua a usare il dataset Sudatori per:

- rose Serie A reali;
- probabili formazioni;
- mercato, ufficialità e rumors;
- infortunati/SOS;
- raduni, ritiri e amichevoli.

L'informazione **Rosa fantacalcio** non viene più considerata definitiva dal campo statico `fantasyRoster` del JSON Sudatori quando è disponibile un file rose live della lega.

## Sorgente rose live

Per la lega corrente la sezione prova a leggere:

```text
/<slug-lega>/assets/rose/manifest.json
/<slug-lega>/assets/rose/<ultimo-file-2026-2027>.json
```

Esempio per Zona Orientale:

```text
/zonaorientale/assets/rose/manifest.json
/zonaorientale/assets/rose/2026-2027-....json
```

## Fallback

Se il manifest rose non esiste o non contiene rose, la sezione mantiene il comportamento precedente e usa lo snapshot incorporato nel JSON Sudatori.

## Impatto operativo

Quando vengono aggiornate solo le rose dei partecipanti e viene fatto il push su GitHub, non serve rigenerare il JSON Sudatori: dopo il deploy la sezione leggerà le nuove rose direttamente dalla fonte della sezione Rose.
