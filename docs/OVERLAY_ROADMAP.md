# Overlay roadmap

## Stato corrente

V574 - Tabelle giocatori mobile stile Listone completato.

## Overlay previsti

0 overlay previsti.

Da qui procedere solo con bugfix mirati o nuova roadmap esplicita.

## V574 - Tabelle giocatori mobile stile Listone

Stato: completato.

- Il Listone mobile diventa riferimento grafico per Area Squadra e Rose.
- Uniformati font, dimensioni, prima colonna sticky/opaca, header sticky e colori righe per ruolo.
- Nome giocatore non troncato e link giocatore preservato.
- Resize colonne V570/V571 non caricato.
- Audit: `node static/fanta-engine/tools/audit-player-tables-mobile-v574.mjs`.

## Guardrail permanenti

- Overlay unico whole-site.
- Solo file modificati.
- Aggiornare docs e handoff a ogni overlay.
- Non modificare FUNZIONALITA'.md senza richiesta esplicita.
- Preservare Firebase, EmailJS, Admin, Presidente.
- Preservare asset condivisi Listoni/Calciomercato in fanta-engine.
- Non reintrodurre i layer runtime pesanti rimossi/disattivati in V558 senza prova misurata.
