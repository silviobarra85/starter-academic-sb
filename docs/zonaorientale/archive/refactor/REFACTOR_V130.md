# Refactor V130 - Split CSS tematico

Data: 2026-05-20

Obiettivo: ridurre il file CSS aggregato recente `refinements-v119-v126.css` separando le regole in moduli tematici piu piccoli.

File nuovi:

- `assets/css/components-v130.css`: page heading, badge/status e metriche.
- `assets/css/admin-v130.css`: sottoblocchi Admin.
- `assets/css/transfer-market-v130.css`: Fantamercato e trattative.
- `assets/css/competition-detail-v130.css`: pagina dettaglio competizione e correzioni mobile competizioni.

Le pagine `index.html` e `competition.html` caricano i nuovi CSS dopo `styles.css`. Il vecchio `assets/css/refinements-v119-v126.css` non e piu referenziato e puo essere rimosso dalla repo dopo verifica.

Nessuna logica JS o Firebase modificata.
