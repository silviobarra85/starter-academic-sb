# V487 - Centralizzazione prudente CSS comuni

Data: 24/06/2026

## Obiettivo

Centralizzare nel motore comune i soli CSS risultati identici nell'inventario V486, senza spostare JS runtime e senza cancellare le copie locali delle due leghe.

## File runtime centrali

I CSS comuni sono copiati in:

```text
static/fanta-engine/css/shared/v487/
```

Il manifest e' in:

```text
static/fanta-engine/data/shared-css-assets-v487.json
```

## Strategia conservativa

Le pagine HTML delle leghe puntano al CSS centrale come sorgente primaria, ma ogni link contiene un fallback locale:

```html
data-local-fallback="./assets/..."
onerror="this.onerror=null;this.href=this.dataset.localFallback"
```

Questo permette di testare il motore centrale senza cancellare nulla: se il CSS centrale non fosse raggiungibile, il browser prova la copia locale.

## Cosa resta locale

Restano locali e non vengono spostati:

- `assets/styles.css`, perche' differisce tra le leghe;
- CSS specifici FantaMantraManager, inclusi brand/favicon/share/admin setup;
- tutti i JS runtime;
- Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra, news, regolamenti, bilanci, listoni e calciomercato.

## Audit

```bash
cd static
node fanta-engine/tools/audit-shared-css-centralization-v487.mjs
node fanta-engine/tools/audit-multileague-contamination-v487.mjs
```

## Regressioni da evitare

- perdita stile mobile;
- menu mobile non renderizzato;
- layout Listone/Calciomercato degradato;
- riferimenti incrociati tra le due leghe;
- rimozione accidentale di copie locali ancora necessarie come fallback.
