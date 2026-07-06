# V580 - Tabelle giocatori mobile clonate dal Listone

## Obiettivo
Correggere la divergenza mobile tra Listone, Area Squadra e Rose: i colori e la dimensione font del Listone sono la sorgente visiva da copiare sulle altre due tabelle.

## Modifiche
- Nuovi asset `player-tables-mobile-v580.css` e `player-tables-mobile-v580.js`.
- Il runtime marca separatamente `teamarea`, `rose` e `listone`.
- Il Listone non viene riscritto: viene campionato con `getComputedStyle`.
- Area Squadra e Rose ricevono stili inline mobile-only con priorita `important` ricavati dal Listone, con fallback alla palette V550.
- Versione/footer/cache-buster aggiornati a V580 sulle due leghe.

## Preservato
- Link giocatore esterni.
- Calciomercato disattivato.
- Svincola Giocatori attivo.
- Nessuna modifica a Firebase, EmailJS, snapshot o Netlify.
