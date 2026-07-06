# AI Assistant Handoff - V579

## Versione

V579 - Tabelle giocatori mobile: Stato e palette Listone.

## Stato funzionale

- Calciomercato resta disattivato.
- Svincola Giocatori ZonaOrientale resta attivo.
- Resize colonne V570/V571 resta non caricato.
- Link giocatore nelle tabelle preservati.
- Stili mobile separati per Area Squadra, Rose e Listone.

## Modifica

V579 aumenta leggermente la colonna Stato e forza la palette ruolo del Listone anche su Area Squadra e Rose, usando CSS ad alta specificita e fallback JS inline mobile-only.

## Verifica manuale

Da mobile verificare:

1. Area Squadra / Dashboard Presidente: colori ruolo e prima colonna sticky/opaca.
2. Rose: espansione rosa, colori ruolo, prima colonna sticky/opaca.
3. Listone: colori invariati rispetto allo stile preferito, Stato leggermente piu largo.
