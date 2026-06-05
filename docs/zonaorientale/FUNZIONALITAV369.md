# Funzionalita V369 - Dashboard Presidente protetta

## Obiettivo

Aggiungere una dashboard presidente in Area squadra, sopra le sezioni gia' esistenti, per rendere piu' leggibili saldo, rosa, trattative e richieste.

## Nuove funzioni

- Dashboard read-only in Area squadra per presidente approvato.
- Metriche: saldo FM, numero giocatori, valore rosa, trattative aperte, richieste Admin in attesa, giocatori sul mercato.
- Distribuzione ruoli della rosa.
- Alert operativi su trattative ricevute, esiti disponibili, richieste pending e rosa non disponibile.
- Richieste recenti inviate all'admin.
- Ultimi movimenti FM.
- Pulsanti rapidi verso trattative, nuova proposta, comunicato e scheda squadra.

## Funzioni preservate

- Proposta trattativa esistente.
- Liste trattative inviate/ricevute.
- Accetta/Rifiuta/Annulla trattative.
- Invio comunicato squadra.
- Scheda squadra.
- Dashboard pubblicazione Admin V368.
- Smoke test V367.
- Hardening stati trattativa V366.

## Note

La V369 non aggiunge collection, non scrive su Firebase, non modifica snapshot e non tocca `FUNZIONALITA'.md`.
