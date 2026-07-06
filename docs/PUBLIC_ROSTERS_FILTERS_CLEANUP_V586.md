# V586 - Rose pubbliche senza filtri ruolo e verifica cleanup

## Richiesta
- Nella sezione **Tutte le rose**, rimuovere i filtri sul ruolo dei giocatori.
- Verificare eventuali file vecchi o inutili.
- Valutare cosa accorpare e cosa separare.

## Implementazione
La patch non elimina il sistema V441 in modo distruttivo, perche' lo stesso blocco gestisce anche filtri utili altrove. Invece aggiunge un override V586 che:

- impedisce l'inserimento del pannello `rosterRoleFiltersV441` nella pagina Rose/Tutte le rose;
- rimuove eventuali residui DOM gia' inseriti;
- neutralizza il filtraggio delle rose pubbliche restituendo sempre l'elenco completo dei giocatori;
- lascia intatti Listone e filtri operativi dell'Area Squadra.

## File vecchi/inutili verificati
Dopo V584 il runtime deve usare solo:

- `static/fanta-engine/css/player-tables-mobile-v584.css`
- `static/fanta-engine/js/ui/player-tables-mobile-v584.js`
- `static/fanta-engine/css/president-teamarea-mobile-v585.css`
- `static/fanta-engine/js/ui/president-teamarea-mobile-v585.js`

Sono considerati residui tecnici rimovibili, se ancora presenti localmente:

- `table-column-resizer-v570/v571`;
- `player-tables-mobile-v567` fino a `player-tables-mobile-v583`;
- audit sperimentali collegati a quegli asset.

Il cleanup V586 non tocca i documenti storici.

## Accorpamento consigliato
Da mantenere accorpato:

- gli stili mobile delle tabelle giocatori in `player-tables-mobile-v584`;
- i controlli Dashboard Presidente mobile in `president-teamarea-mobile-v585`.

Da tenere separato:

- Dashboard Presidente mobile;
- tabelle giocatori mobile;
- filtri/rose/listone;
- funzioni Firebase/EmailJS;
- funzioni Netlify.

## Nota per refactor futuro
`assets/app.js` e' il candidato principale per un refactor, ma non va spezzato in modo rapido: contiene molte patch storiche concatenate e alcune dipendenze implicite. Il refactor va fatto per blocchi piccoli e auditati.
