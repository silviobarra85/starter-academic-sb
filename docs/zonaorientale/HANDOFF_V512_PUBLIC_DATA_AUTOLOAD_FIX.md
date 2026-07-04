# Handoff V512 - Public data autoload root-fix

V512 corregge il caso in cui l'hash cambia ma i dati pubblici non vengono caricati/renderizzati.

- Motore: `static/fanta-engine/js/core/public-data-autoload-v512.js`
- Manifest: `static/fanta-engine/data/public-data-autoload-v512.json`
- Nessuna scrittura Firebase.
- Nessuna modifica EmailJS.
- Nessuna modifica ruoli Admin/Presidente.
- Nessun ripristino di `static/static` o `static/zonaorientale/static`.

Verifica manuale: aprire home, cliccare News/Listone/Rose/Competizioni, controllare dati visibili e assenza errori console.
