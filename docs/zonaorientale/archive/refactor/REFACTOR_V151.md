# V151 - Hotfix mobile dashboard, Coppe e Rose

Data: 2026-05-21
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Correggere alcuni problemi emersi nella nuova interfaccia mobile senza modificare la versione desktop.

## Modifiche

- Mobile Dashboard:
  - rimosso il blocco Alert dalla home mobile a blocchi;
  - migliorato il calcolo della prossima partita da giocare, considerando solo partite non giocate/non cancellate e ordinandole per data/giornata.

- Mobile Coppe / Competizioni:
  - per le partite già giocate viene mostrato il risultato;
  - per le partite ancora da disputare viene mostrata la data, con fallback su giornata Serie A se manca la data;
  - la modifica riguarda solo la sezione `#competitions`, non `competition.html`.

- Mobile Rose:
  - corretto l’allineamento delle colonne della tabella giocatori;
  - fissate larghezze coerenti tra intestazioni e celle per Giocatore, R(RM), Sq, Costo, Qt.A e Mercato.

## File modificati

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
```

## File nuovi

```text
static/zonaorientale/assets/css/mobile-hotfix-v151.css
```

## Test consigliati

```text
/zonaorientale/#dashboard
/zonaorientale/#competitions
/zonaorientale/#clubs
```

Da desktop verificare che la resa sia invariata.
