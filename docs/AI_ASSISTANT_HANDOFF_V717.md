# AI Assistant Handoff - ioSudo V717

Versione corrente: V717.

Fonte Excel: `fantacalcio_serie_a_2026_27_aggiornato_2026-07-18_aggiornamento_globale_v72.xlsx`.

File principali aggiornati:

- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/js/apps/iosudo-app-v717.js`
- `static/fanta-engine/css/iosudo-app-v717.css`
- `static/fanta-engine/tools/audit-iosudo-v717.mjs`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`

Regole da mantenere:

1. applicare solo alias duplicati confermati dall'utente;
2. giocatori con ufficialità attiva non devono restare nei rumor attivi;
3. visite mediche, Sky live e rumor Transfermarkt non aggiornano la rosa senza comunicato/deposito ufficiale;
4. amichevoli senza tabellino ufficiale non generano minuti/gol giocatori;
5. gli XI devono mostrare il badge SOS dal giocatore reale quando SOS attivo.

Note V717:

- Caccavo è prestito ufficiale Bologna -> Juve Stabia, fuori rosa attiva.
- Iker Bravo, Jordan Zemura e Martin Payero restano trattative Udinese -> Watford non ufficiali.
- Atalanta-U23 è fonte ufficiale Atalanta, ma senza tabellino giocatori.
- Nuovi candidati duplicati sono in `docs/IOSUDO_DUPLICATE_CANDIDATES_V717.md` e non vanno fusi senza conferma.
