# Refactor V337 - Matching giocatore Calciomercato con punteggiatura normalizzata

## Problema

Alcuni giocatori non venivano riconosciuti in titoli in cui il nome era seguito da punteggiatura. Il caso indicato e':

```text
Kalulu, ...
```

Il problema nasceva dal fatto che il modulo V335 accettava un normalizzatore esterno. Nel runtime veniva passato `normalizeCalciomercatoValueV306`, che puo' usare `ZonaOrientaleSharedHelpersV295.searchKey`. Questo helper normalizza maiuscole/minuscole e accenti, ma non rimuove sempre la punteggiatura. Di conseguenza il confronto a parola intera poteva fallire.

## Soluzione

Creato il nuovo modulo:

```text
assets/js/calciomercato/calciomercato-players-v337.js
```

Il modulo costruisce un normalizzatore specifico per il player matching che:

- usa il normalizzatore esterno se disponibile;
- applica comunque una seconda passata locale;
- rimuove punteggiatura, apostrofi, separatori e tag HTML;
- compatta gli spazi;
- preserva la policy conservativa V335.

## Comportamento invariato

- Nessuna modifica a JSON Listone.
- Nessuna modifica a JSON Calciomercato.
- Nessuna modifica a Netlify Functions.
- Nessuna scrittura Firebase.
- Nessun cambio alla modal V336.

## Diagnostica

`window.ZonaOrientaleCalciomercatoPlayerMatchingV337` espone:

- `version: "V337"`;
- `matchingPolicy`;
- `runSmokeTest()`.

## Rischi evitati

Non e' stato introdotto matching fuzzy aggressivo. Questo evita falsi positivi su parole comuni, cognomi ambigui e team name.
