# Site Audit V763 - Visibilità Admin

## Sintomo

Le checkbox, `Mostra tutte` e `Nascondi tutte` del pannello `Visibilità Admin · V456` non modificavano le card.

## Causa riprodotta

V761 aveva corretto il loop infinito del precedente `MutationObserver`, ma aveva lasciato due controller concorrenti:

1. il runtime V456, basato sull'evento `change` nativo;
2. l'hardfix V761, basato su intercettazione del `click` e inversione manuale di `input.checked`.

Sul click diretto della checkbox, il browser applica l'attivazione del controllo durante la sequenza del `click`; l'hardfix leggeva il valore già modificato e lo invertiva nuovamente. Il risultato era nessuna variazione visibile.

Inoltre la selezione era considerata valida soltanto se riscritta e riletta da `localStorage`. Le eccezioni erano catturate senza segnalazione: in un contesto nel quale lo storage non fosse scrivibile, anche i comandi globali tornavano immediatamente allo stato precedente.

## Correzione

- rimosso integralmente l'hardfix V761;
- riscritto il runtime come controller unico V763;
- mantenuta compatibilità con il nome file e con l'API V456;
- stato in memoria sempre funzionante;
- persistenza degradabile localStorage → sessionStorage → memoria;
- eventi delegati sul solo controllo;
- checkbox affidate al comportamento nativo `change`;
- observer limitato al pannello Admin;
- render strutturale idempotente;
- self-test runtime integrato.

## Test eseguiti

È stato usato Chromium headless con un fixture DOM equivalente al pannello Admin.

Scenario con storage scrivibile:

- click sull'etichetta: PASS;
- click diretto sulla checkbox: PASS;
- `Mostra tutte`: PASS;
- `Nascondi tutte`: PASS;
- self-test automatico: PASS.

Scenario con storage non disponibile:

- click sull'etichetta: PASS;
- click diretto sulla checkbox: PASS;
- `Mostra tutte`: PASS;
- `Nascondi tutte`: PASS.

Audit statico V763: 71/71 controlli superati.
Audit static-first V760 reso indipendente dalla versione della shell: 42/42 controlli superati.
