# V550 - Stile Listone/Rose unificato

## Obiettivo

Uniformare le tabelle del Listone e delle Rose delle squadre su entrambe le leghe.

## Modifiche

- aggiunto CSS comune `static/fanta-engine/css/roster-listone-table-unification-v550.css`;
- le tabelle Rose pubbliche usano la skin Listone;
- aggiunta colonna `Stato` nelle Rose;
- `Stato` mostra `In listone` oppure `Asteriscato` usando il Listone corrente;
- font Listone/Rose uniformato con token comuni;
- prima colonna delle Rose colorata in base al ruolo del giocatore;
- Regolamento resta escluso dalla colorazione ruolo tramite guardia V540.

## Guardrail

- Nessuna modifica a Firebase.
- Nessuna modifica a EmailJS.
- Nessuna modifica a Admin/Presidente.
- Nessun ripristino dei fallback locali Listoni/Calciomercato.
- Nessuna modifica a `FUNZIONALITA'.md`.
