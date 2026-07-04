# FantaMantraManager - Admin, presidenti e Area Squadra

Aggiornato alla **V483**.

## Regola di visibilita' principale

- L'Admin non deve vedere la Dashboard Presidente.
- I presidenti loggati e approvati devono vedere Area Squadra e Dashboard Presidente.
- Le sezioni operative presidente non devono essere disponibili a utenti non loggati o non associati a teamUsers validi.

## Admin

L'Admin usa dashboard dedicata e card selezionabili. Le card Admin possono includere:

- setup dati reali;
- validazione dati;
- preview seed Firestore;
- import controllato;
- generatore snapshot pubblici;
- readiness Area Squadra;
- checklist pubblicazione/share;
- gestione Proposte regolamento.

Il selettore card Admin serve a non mostrare tutto insieme. Non eliminarlo nei refactor.

## Area Squadra

Area Squadra e' stata sbloccata in V476. Questo non significa che si possano rimuovere controlli di login, associazione squadra o teamUsers: lo sblocco riguarda la visibilita' degli entrypoint, non la rinuncia alle protezioni.

## Dashboard Presidente

La Dashboard Presidente deve restare nascosta quando la sessione corrente e' Admin. Questo e' un guardrail introdotto in V477 e preservato in V478-V483.

Card presidente operative note:

- `Svincola Giocatori` - attiva, usa EmailJS service FantaMantraManager e template generico.
- `Comunicato avvenuto scambio` - attiva, usa EmailJS service FantaMantraManager e template dedicato.
- `Proposte regolamento` - prevista in V479 con salvataggio Firestore in `ruleProposals`.

## Proposte regolamento

La funzionalita' e' pensata cosi':

- presidente crea una proposta;
- proposta resta modificabile dal creatore solo finche' e' in stato `SUBMITTED`;
- tutti i presidenti possono vedere le proposte della lega;
- Admin gestisce stato e nota;
- eventuale votazione e' una fase futura, non implementata in V479.

Se la sezione non compare nella UI, il problema probabile e' aggancio/registry/rendering della card, non assenza della struttura dati.

## EmailJS e destinatari

Per FantaMantraManager:

```text
Service: service_ttjf7js
Recipient: barra.silvio@gmail.com
Template scambio: template_svkkhlr
Template generico/svincolo: template_e1o7z5e
```

Non usare il service EmailJS di ZonaOrientale per FantaMantraManager.

## Test manuali minimi dopo patch che toccano Admin/presidenti

- login Admin: non deve apparire la Dashboard Presidente;
- login presidente: Area Squadra e Dashboard Presidente devono apparire;
- card Svincola Giocatori visibile e invio mail configurato;
- card Comunicato avvenuto scambio visibile e invio mail configurato;
- pannello Admin Proposte regolamento visibile solo ad Admin;
- nessuna scrittura su Firebase ZonaOrientale.
