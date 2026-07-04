# AI Assistant Handoff V512 - Public data autoload root-fix

## Contesto
L'utente ha segnalato che, dopo V510 e V511, cliccando ad esempio `News` l'URL diventa `#news`, ma le sezioni non caricano i dati. Anche un refresh della home delle due leghe non popola i dati pubblici.

## Diagnosi corretta
V510 correggeva il routing/hash. V511 aggiungeva un refresh dati dopo navigazione, ma il problema poteva restare se il bootstrap pubblico non partiva o se il controllo dati considerava sufficienti solo `seasons/leagueSettings`, lasciando vuote news, rose, competizioni e listoni.

## Fix V512
V512 aggiunge `static/fanta-engine/js/core/public-data-autoload-v512.js` e installa in entrambe le app un bootstrap no-auth che:

- parte dopo la valutazione del modulo, indipendentemente dal callback Auth;
- riprova a 0, 120, 600, 1600 e 3200 ms;
- considera dati renderizzabili solo contenuti reali, non solo la lista stagioni;
- carica dati pubblici via `loadDataForCurrentAuthV100`, con fallback statico V511;
- attiva pagina hash e renderizza la sezione corrente;
- non scrive su Firebase e non modifica EmailJS/ruoli/rules.

## Guardrail
Non ripristinare `static/zonaorientale/static` e `static/static`. Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita. Aggiornare sempre `docs/OVERLAY_ROADMAP.md`.

## Verifica prioritaria
Aprire `/zonaorientale/` e `/fantapetillomantramanager/`, verificare che la dashboard carichi dati; poi cliccare News/Listone/Rose/Competizioni e verificare che non restino `Caricamento...`.
