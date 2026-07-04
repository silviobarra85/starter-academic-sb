# AI Assistant Handoff V500 - Stato motore comune multi-lega

Questo documento serve al prossimo assistente AI che lavorera' sul progetto `starter-academic-sb`.

## Contesto operativo

Il progetto contiene due leghe statiche:

- `static/zonaorientale`
- `static/fantapetillomantramanager`

Il nome pubblico della seconda lega e' **FantaMantraManager**, ma il path resta `fantapetillomantramanager` per non rompere link, Netlify, Firebase, news share e asset.

Il motore comune vive in:

- `static/fanta-engine`

La copia annidata storica `static/zonaorientale/static` e' stata dismessa in V495 e non va ripristinata.

## Cose gia' fatte

- V480: registry sezioni unico in `fanta-engine`.
- V481: presentation engine comune per branding, footer, metadata e menu mobile.
- V482: audit anti-contaminazione multi-lega.
- V483: documentazione consolidata FantaMantraManager.
- V484: inventario asset comuni listone/calciomercato.
- V485: centralizzazione prudente asset listone/calciomercato con fallback locali.
- V486: inventario CSS/JS runtime comuni.
- V487: centralizzazione CSS comuni con fallback locali.
- V488: inventario dipendenze JS comuni.
- V489: centralizzazione JS classici autonomi.
- V490: data path adapter comune.
- V491: centralizzazione selettiva moduli JS comuni sicuri.
- V492: audit regressione runtime esteso.
- V493: merge readiness branch.
- V494: readiness cleanup duplicati locali, senza cancellazione.
- V495: cleanup copia annidata `static/zonaorientale/static`.
- V496: UI components engine comune.
- V497: registry card/funzionalita' comune metadata-first.
- V498: EmailJS adapter comune, con service/template ancora per lega.
- V499: Firebase adapter comune, senza migrazione dati.
- V500: Dashboard cards engine comune observe-first.

## Stato V500

La V500 introduce:

- `static/fanta-engine/js/ui/dashboard-cards-engine-v500.js`
- `static/fanta-engine/data/dashboard-cards-engine-v500.json`
- `static/fanta-engine/tools/audit-dashboard-cards-engine-v500.mjs`

Il motore V500 usa il registry V497 per produrre uno snapshot delle card Admin/Presidente e per marcare gli elementi gia' renderizzati con attributi `data-*`.

Modalita' corrente:

- `observe-first`

Significa che il motore osserva, classifica e marca le card, ma non forza ancora la loro rimozione/visibilita'. Questo e' voluto per evitare regressioni su Dashboard Presidente/Admin.

## Guardrail obbligatori

Non fare queste cose senza richiesta esplicita:

- non rinominare `static/fantapetillomantramanager`;
- non ripristinare `static/zonaorientale/static`;
- non modificare `docs/zonaorientale/FUNZIONALITA'.md`;
- non cancellare fallback locali;
- non migrare Firebase a `/leagues/{leagueId}/...`;
- non cambiare Firestore rules senza piano dedicato;
- non togliere card Svincola Giocatori e Comunicato avvenuto scambio da FantaMantraManager;
- non mostrare Dashboard Presidente quando la sessione e' Admin;
- non contaminare ZonaOrientale con stringhe/servizi FantaMantraManager.

## Roadmap proposta dopo V500

1. V501 - Tool engine comune: centralizzare Sorteggio giornate, parser range, seed e export JSON.
2. V502 - Template nuova lega: `static/_league-template` piu' script per creare una lega nuova.
3. V503 - Test browser Playwright: aprire pagine reali e controllare errori console/404.
4. V504 - Dashboard engine enforce opzionale: solo dopo test, usare il registry per governare davvero la visibilita' delle card.
5. V505 - Migrazione graduale moduli dashboard: spostare renderer comuni fuori dagli `app.js` locali.
6. Fase futura opzionale - Firebase namespace `/leagues/{leagueId}/...` solo dopo backup, rules e test browser.

## Audit principali dopo V500

Dal path `static`:

```bash
node fanta-engine/tools/audit-dashboard-cards-engine-v500.mjs
node fanta-engine/tools/audit-runtime-regression-v500.mjs
node fanta-engine/tools/audit-multileague-contamination-v500.mjs
```

## Nota finale

Il progetto e' in una fase di centralizzazione prudente. Ogni overlay deve preservare le funzionalita' esistenti e aggiungere guardrail/audit prima di spostare logica runtime sensibile.
