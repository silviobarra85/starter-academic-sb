# V457 - Dati placeholder FantaPetillo 2026-2027

La V457 aggiunge dati statici provvisori per testare il clone senza attendere i dati reali dei presidenti.

## Scopo

- Rendere la stagione corrente `2026-2027`.
- Mostrare 10 club placeholder nelle sezioni pubbliche.
- Testare layout pubblici, Bilanci e sezioni dati senza scrivere su Firebase.
- Lasciare chiaro che i dati non sono ufficiali e devono essere sostituiti da Admin.

## File statici aggiornati

```text
assets/public/config.json
assets/snapshots/seasons/manifest.json
assets/snapshots/seasons/2026-2027.json
assets/snapshots/honor.json
assets/rose/manifest.json
assets/rose/2026-2027-placeholder.json
assets/competitions/manifest.json
assets/competitions/campionato-2026-2027.json
assets/competitions/playoff-2026-2027.json
assets/competitions/coppa-italia-2026-2027.json
assets/listoni/manifest.json
assets/calciomercato/links.json
assets/calciomercato/archive/manifest.json
```

## Placeholder creati

- 10 presidenti placeholder.
- 10 squadre placeholder.
- 10 associazioni squadra/stagione per `2026-2027`.
- 10 stadi livello 0.
- 10 movimenti FM iniziali da 250 FM, marcati come placeholder.
- 3 competizioni placeholder: Campionato/Regular Season, Playoff e Coppa Italia.

## Firebase

La V457 non scrive nulla su Firebase. Il file:

```text
tools/fantapetillo-placeholder-seed-v457.json
```

serve solo come schema di riferimento o seed manuale controllato. Non va importato come dato ufficiale senza revisione.

## Area Squadra

Area Squadra resta guardata. Prima dello sblocco servono dati reali e `teamUsers` corretti.

## Sostituzione con dati reali

Quando saranno disponibili i dati veri, usare Admin per inserire:

1. presidenti reali;
2. squadre reali;
3. associazioni squadre/stagione;
4. stadi e budget;
5. rose/listone/movimenti;
6. snapshot pubblici aggiornati.

Dopo la generazione snapshot, scaricare overlay statici e sostituire i placeholder.
