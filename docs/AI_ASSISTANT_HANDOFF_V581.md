# AI Assistant Handoff V581 - Tabelle giocatori mobile single-source

## Obiettivo
Correggere la divergenza di stile mobile tra Area Squadra, Rose e Listone dopo V580.

## Diagnosi
V580 provava a clonare a runtime lo stile computato del Listone. Il risultato poteva divergere per tre motivi:
- il Listone non viene sempre renderizzato quando Area Squadra o Rose vengono aperte;
- il Listone restava governato dagli stili legacy, mentre Area/Rose ricevevano inline/fallback;
- alcune regole legacy con `!important` continuavano a intervenire su font, colori e prima colonna.

## Soluzione V581
Sostituito il clone dinamico con uno stile unico e deterministico:
- `player-tables-mobile-v581.css` definisce una palette unica e le stesse regole mobile per tutte le tre tabelle;
- `player-tables-mobile-v581.js` marca Area Squadra, Rose e Listone con `data-player-table-v581` e applica gli stessi inline `important` a tutte le tre tabelle, incluso il Listone;
- V580 viene rimosso dal caricamento HTML.

## Funzionalita preservate
- Link nome giocatore preservati.
- Calciomercato resta disattivato.
- Svincola Giocatori resta attivo.
- Nessuna modifica a Firebase, EmailJS, Admin, Presidente, snapshot o Netlify.
- `FUNZIONALITA'.md` non modificato.

## Verifica
```bash
node static/fanta-engine/tools/audit-player-tables-mobile-v581.mjs
node --check static/fanta-engine/js/ui/player-tables-mobile-v581.js
```

## Checklist manuale
- Mobile: Area Squadra, tabella rosa del presidente.
- Mobile: Rose, espandi una squadra.
- Mobile: Listone.
- Verifica stesso font, stesso padding, stessi colori ruolo, prima colonna sticky/opaca, header sticky/opaco.
