# V493 - Checklist merge branch V480-V493

Questa checklist chiude il ciclo di stabilizzazione del branch dedicato al motore multi-lega.

## Scope V480-V493

- V480: registro sezioni unificato e primo modulo `static/fanta-engine`.
- V481: motore comune presentazione/branding/footer/menu mobile.
- V482: audit anti-contaminazione multi-lega.
- V483: documentazione canonica FantaMantraManager.
- V484: inventario asset comuni listone/calciomercato.
- V485: centralizzazione prudente listone/calciomercato con fallback locale.
- V486: inventario runtime CSS/JS.
- V487: centralizzazione CSS comuni con fallback locale.
- V488: inventario dipendenze JS comuni.
- V489: centralizzazione JS classici/autonomi con fallback locale.
- V490: adapter comune per path dati e fetch JSON con fallback.
- V491: centralizzazione selettiva moduli JS sicuri.
- V492: audit regressione runtime esteso.
- V493: checklist finale e audit merge readiness.

## Comandi audit prima del merge

```bash
cd static
node fanta-engine/tools/audit-merge-readiness-v493.mjs
node fanta-engine/tools/audit-runtime-regression-v493.mjs
node fanta-engine/tools/audit-multileague-contamination-v493.mjs
```

## Verifiche manuali minime

### ZonaOrientale

- Home, Competition e Player senza errori console.
- Footer V493 corretto.
- Menu desktop/mobile funzionante.
- Listone carica giocatori e apre player.
- Calciomercato/Fantamercato senza 404.
- Admin e Area Squadra invariati.
- Nessun riferimento visibile a FantaMantraManager.

### FantaMantraManager

- Home, Competition, Player, News e Bilanci senza errori console.
- Footer V493 corretto.
- Logo/nome FantaMantraManager corretti.
- Dashboard Presidente nascosta quando entra Admin.
- Card Svincola Giocatori e Comunicato avvenuto scambio presenti per i presidenti.
- Proposte regolamento preservata.
- Listone e Calciomercato funzionanti.
- Nessun riferimento visibile a ZonaOrientale.

## Guardrail per il merge

- Non cancellare le copie locali di listoni, calciomercato, CSS e JS: restano fallback.
- Non rinominare `static/fantapetillomantramanager` senza una migrazione Netlify/URL dedicata.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` se non richiesto esplicitamente.
- Non unificare Firebase/EmailJS tra le leghe: servizi e dati restano separati.
