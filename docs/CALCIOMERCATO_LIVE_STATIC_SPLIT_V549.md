# V549 - Calciomercato live 3 giorni + static archive storico

V549 riallinea il comportamento della sezione Calciomercato:

- apertura pagina: recupero live via Netlify Function sugli ultimi 3 giorni dalle fonti configurate;
- se il live non restituisce articoli, fallback agli ultimi giorni disponibili dell archivio centrale;
- caricamento articoli piu vecchi: lettura dall archivio statico centrale, non estensione infinita del live;
- nessun ripristino dei fallback locali rimossi in V543;
- Firebase, EmailJS, Admin e Presidente invariati.

Path unico asset Calciomercato:

```text
static/fanta-engine/data/shared-assets/current/assets/calciomercato/
```

## Verifica

```bash
node static/fanta-engine/tools/audit-calciomercato-live-static-split-v549.mjs
```

Checklist manuale:

- Calciomercato mostra articoli live o, se il live non risponde, articoli dell archivio centrale.
- Il pulsante/caricamento articoli piu vecchi usa lo static archive.
- Non ricompaiono `static/<lega>/assets/calciomercato/`.
- Console senza errori.
