# V558 - Native runtime restore

## Obiettivo

Ripristinare un runtime piu vicino alla baseline online veloce di ZonaOrientale, mantenendo i fix funzionali recenti.

## Perche

La lentezza non era causata dalla quantita di dati: il sito online V473 usa gli stessi dati ed e veloce. La causa era la stratificazione runtime introdotta dagli overlay: wrapper di navigazione, refresh/autoload pubblico, dashboard migration/enforce e preloader.

## Cosa cambia

V558 disattiva dal runtime ordinario:

- navigation-actions-v510
- navigation-data-refresh-v511
- public-data-autoload-v526
- dashboard-renderer-migration-v527
- dashboard-enforce-v528
- i layer performance gia disattivati in V556/V557

Resta il router locale storico, cioe il percorso piu vicino alla baseline online.

## Cosa resta preservato

- fanta-engine come motore comune
- asset condivisi Listoni/Calciomercato
- Calciomercato live 3 giorni + archivio statico centrale
- stile Rose/Listone V550/V551
- isolamento Regolamento V540
- adapter/resolver multi-season
- Firebase, EmailJS, Admin, Presidente invariati

## Verifica manuale

- Footer V558
- ZonaOrientale veloce nei passaggi Dashboard, Rose, Listone, Calciomercato, Bilanci
- FantaPetilloMantraManager invariato
- Regolamento senza righe colorate
- Rose espanse con colonna Stato e stile Listone
