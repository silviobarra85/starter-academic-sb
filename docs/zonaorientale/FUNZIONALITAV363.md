# FUNZIONALITAV363 - Checklist QA stabilizzata e simulazione presidente

Versione: V363  
Data: 05/06/2026

## Obiettivo

Stabilizzare la Checklist QA Admin introdotta nelle versioni V357-V362, in particolare il box di simulazione notifiche trade verso presidente.

## Modifiche funzionali

Nessun flusso reale viene modificato. La V363 interviene solo sulla UX Admin della checklist QA.

## Correzioni

- Il box simulatore trade ora occupa tutta la riga della griglia QA e non sfora nelle schede affiancate.
- Il menu a tendina del presidente destinatario non viene piu' resettato dal refresh automatico del pannello mentre lo si sta usando.
- La `i` informativa resta aperta mentre viene letta e non scompare dopo pochi secondi.
- L'auto-refresh della checklist passa a un comportamento non distruttivo: non ridisegna il pannello quando il focus e' dentro la checklist o quando una spiegazione e' aperta.
- Le istruzioni di test della simulazione presidente sono esplicitate in interfaccia e documentazione.

## Come testare la simulazione verso presidente

1. Accedere come Admin.
2. Aprire la Checklist QA Admin.
3. Filtrare l'area Fantamercato.
4. Nel box simulatore scegliere una squadra/presidente.
5. Premere `Simula per presidente`.
6. Uscire dall'admin e accedere come quel presidente nello stesso browser/origin.
7. Verificare badge e card proposta ricevuta.
8. Premere `Accetta` o `Rifiuta`.
9. Verificare che non compaia `Missing or Insufficient permissions`.

La simulazione resta solo in localStorage e non scrive su Firebase.

## Funzionalita preservate

- Trattative reali Firebase.
- Notifiche reali Fantamercato.
- Simulatore trade V255/V349.
- Simulazione target presidente V362.
- Checklist QA Admin V357-V362.
- Calciomercato, Listone, Rose, Competizioni, Admin, Dashboard Presidente.
- Netlify Functions e Firebase/Auth/EmailJS.

## File principali

- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/tools/audit-manual-qa-stability-v363.mjs`
- `static/zonaorientale/tools/check-zonaorientale.sh`
