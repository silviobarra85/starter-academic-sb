# Handoff V513 - Runtime boot fix FantaMantraManager

## Problema
Dati in caricamento e navigazione tra pagine non funzionante perché il modulo `assets/js/core/league-config-v443.js` generava `ReferenceError: formValidatorsV506 is not defined`.

## Correzione
- Sostituito lo shorthand non definito con `formValidatorsV506: true` in entrambe le pubblicazioni runtime dell'oggetto config.
- Mantenuto `leagueTemplateHardeningV507: true`.
- Aggiornati footer e cache-buster a V513 per evitare cache del modulo rotto.
- Aggiunto audit mirato `tools/audit-runtime-boot-v513.mjs`.

## Preservazione funzionalita'
Nessuna funzionalita' esistente viene rimossa o scollegata: routing, dati statici, Firebase, EmailJS, ruoli, Admin, Presidenti, mobile UX e badge dispositivo V434 restano invariati.

## Verifica manuale
1. Aprire la home e controllare che il footer mostri V513.
2. Cliccare `Tutte le rose`, `Coppe`, `Listone`, `Bilanci`: la pagina attiva deve cambiare.
3. Controllare che le sezioni non restino su `Caricamento...` quando i dati statici sono disponibili.
4. Aprire DevTools Console: non deve comparire `formValidatorsV506 is not defined`.
