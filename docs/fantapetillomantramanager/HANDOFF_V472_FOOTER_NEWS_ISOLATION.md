# Handoff V472 - Footer/news isolamento multi-lega

## Contesto

Il progetto contiene due leghe statiche:

- `static/zonaorientale/` per ZonaOrientale Salerno;
- `static/fantapetillomantramanager/` per FantaPetilloMantraManager.

L'obiettivo di medio periodo e' arrivare a un motore unico parametrico, mantenendo configurazioni e dati separati per lega. Regola di progetto: non cancellare funzionalita' esistenti se non richiesto esplicitamente.

## Problema risolto

1. I footer HTML erano apparentemente corretti, ma venivano sovrascritti a runtime da `assets/js/core/league-config-v443.js` con testo hard-coded:
   `vecchia etichetta tecnica del clone con data 15/06/2026`.
2. `static/fantapetillomantramanager/news.html` conteneva ancora il comunicato playoff di ZonaOrientale e l'id `news-ujE2CqJMjzkYhhjzZZHD`.
3. Esisteva anche una vecchia copia annidata in `static/zonaorientale/static/...`; non e' stata cancellata, ma il runtime footer li' presente e' stato aggiornato per non lasciare stringhe errate nei grep.

## Soluzione applicata

- Versione avanzata a V472.
- `assets/league-config.json` di entrambe le leghe ora contiene:
  - `branding.footerTemplate`;
  - `branding.footerLastUpdated`;
  - `guardrails.footerRuntimeConfigVersion = 472`;
  - `guardrails.footerNewsIsolationVersion = 472`.
- `assets/js/core/league-config-v443.js` formatta il footer da config usando token `{siteName}`, `{version}`, `{lastUpdated}`.
- `news.html` di FantaPetillo e' un fallback dedicato ai comunicati FantaPetillo, senza contenuti ZonaOrientale.
- `tools/generate-news-share-pages.mjs` del clone FantaPetillo e' stato reso coerente con FantaPetillo e gestisce `news: []` generando fallback neutro.
- Aggiunto audit `tools/audit-footer-news-isolation-v472.mjs` e collegato ai check principali.

## Cosa non e' stato toccato

- Nessuna cancellazione di file o funzionalita'.
- Netlify e `netlify/functions/news-share.js` non sono stati modificati: il mapping multi-lega V466 era gia' corretto.
- Le news ZonaOrientale non sono state cancellate o riscritte.
- Firebase, Admin, snapshot, regolamento, bilanci, mobile UX e badge dispositivo V434 restano invariati.

## Verifiche consigliate dopo applicazione

Dalla repo `starter-academic-sb`:

```bash
bash static/zonaorientale/tools/check-zonaorientale.sh
bash static/fantapetillomantramanager/tools/check-fantapetillomantramanager.sh
```

Controlli mirati:

```bash
grep -RIn "vecchia etichetta tecnica del clone\|data footer vecchia 15/06/2026" static/zonaorientale static/fantapetillomantramanager
grep -RIn "Playoff - Decise le finaliste\|news-ujE2CqJMjzkYhhjzZZHD\|COMUNICATO UFFICIALE DEL PRESIDENTE DI LEGA\|ZonaOrientale" static/fantapetillomantramanager/news.html static/fantapetillomantramanager/tools/generate-news-share-pages.mjs
```

Il primo grep non deve piu' trovare il footer hard-coded. Il secondo non deve piu' trovare contaminazioni ZonaOrientale dentro la landing news statica FantaPetillo o nel generator statico FantaPetillo.
