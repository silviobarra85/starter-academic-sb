# V466 - Share, Netlify e Open Graph FantaPetillo

La V466 prepara la preview dinamica dei comunicati di `FantaPetilloMantraManager` senza sbloccare il sito in produzione.

## File Netlify inclusi

- `netlify.toml`: aggiunge il redirect ` /fantapetillomantramanager/share/news/:id ` verso la funzione `news-share` con parametro `league=fantapetillomantramanager`.
- `netlify/functions/news-share.js`: diventa multi-lega e mantiene configurazioni separate per:
  - `zonaorientale` -> Firebase storico `zonaorientale-d07af`;
  - `fantapetillomantramanager` -> Firebase dedicato `fantapetillomantramanager`.

## Card Admin

Nel clone viene aggiunta la card selezionabile `Share, Netlify e Open Graph 2026-2027`.

La card:

- riepiloga i file Netlify da applicare;
- mostra lo snippet redirect;
- genera una checklist Markdown scaricabile;
- non scrive su Firebase;
- non modifica rules;
- non sblocca Area Squadra.

## Stato produzione

La patch prepara solo share e Open Graph. Restano invariati:

- noindex del clone;
- Area Squadra protetta;
- dati placeholder o dati reali non definitivi;
- Firebase ZonaOrientale;
- Admin ZonaOrientale.

## Test dopo deploy

1. Aprire un URL tipo `https://silviobarra.com/fantapetillomantramanager/share/news/test`.
2. Verificare che la pagina generi `og:site_name` e `og:image` FantaPetillo.
3. Verificare che il redirect porti a `/fantapetillomantramanager/#news-test`.
4. Verificare che un link `/zonaorientale/share/news/:id` continui a funzionare.
