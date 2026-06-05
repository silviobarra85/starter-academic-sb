# Manual QA Panel V357

## Scopo

Portare la checklist post-refactor da console a interfaccia grafica, solo per admin.

## Comportamento

- Pannello bottom fixed.
- Espandi/Riduci.
- Pulsanti Apri sezione / Simula proposta.
- Stato OK/Problema/Saltato/Reset.
- Note salvate localmente.
- Export Markdown.

## Sicurezza funzionale

Non scrive su Firebase, non modifica JSON, non invoca Netlify Functions. L'unica azione automatica potenzialmente attiva e il simulatore locale trade V255/V349, che non scrive su Firebase per le simulazioni.
