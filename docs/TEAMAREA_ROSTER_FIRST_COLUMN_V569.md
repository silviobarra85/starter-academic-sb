# V569 - Prima colonna rosa Area Squadra mobile compatta

## Obiettivo

Dopo V568, da mobile la prima colonna della tabella rosa nell'Area Squadra risultava troppo larga rispetto al nome del giocatore.

La V569 riduce quella colonna, mantenendo pero':

- prima colonna sticky;
- sfondo opaco;
- testi leggibili durante lo scroll orizzontale;
- stili separati da Rose e Listone.

## Intervento

Nuovo CSS comune:

```text
static/fanta-engine/css/teamarea-roster-first-col-compact-v569.css
```

Scope applicato solo a:

```text
.team-profile-listone-wrap-v415 table.team-profile-roster-table.roster-sticky-table
```

Regole principali:

- prima colonna a `clamp(6.25rem, 30vw, 9rem)`;
- contenuto interno limitato allo stesso ingombro meno padding;
- `white-space: normal` per evitare ellissi/troncamenti aggressivi;
- `overflow-wrap: anywhere` per non far riespandere la colonna su nomi lunghi.

## Funzionalita' preservate

- Firebase, EmailJS, Admin, Presidente.
- Area Squadra, Rose, Listone, Fantamercato.
- Calciomercato disattivato V561.
- Svincola Giocatori ZonaOrientale V563.
- Header Svincola V564.
- Logo presidente per stagione V565.
- Footer/config V566.
- Prima colonna opaca V567.
- Scope separati V568.

## Audit

```bash
node static/fanta-engine/tools/audit-teamarea-roster-first-col-v569.mjs
```

## Test manuale consigliato

- Smartphone o emulazione mobile.
- Login come presidente.
- Aprire Area Squadra / pagina squadra.
- Verificare la tabella Rosa:
  - prima colonna piu' stretta;
  - nome leggibile anche se va a capo;
  - sfondo opaco durante scroll orizzontale;
  - Rose e Listone invariati rispetto a V568.
