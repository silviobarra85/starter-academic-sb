# AI Assistant Handoff Current

## Versione corrente
V567 - Prima colonna Rose/Area Squadra opaca da mobile

## Stato sintetico
- V567 aggiunge un CSS comune `static/fanta-engine/css/roster-sticky-first-col-v567.css` caricato da entrambe le home.
- Da smartphone, la prima colonna sticky delle tabelle **Rose** e **Area Squadra** non e' piu' trasparente: durante lo scroll orizzontale il nome giocatore resta leggibile e non si sovrappone visivamente alle celle sottostanti.
- La patch e' mobile-only e interviene solo sul layout CSS delle tabelle rosa.
- ZonaOrientale: stagione corrente `2026-2027`, Calciomercato disattivato, Svincola Giocatori attivo, logo presidente coerente con stagione selezionata.
- FantaMantraManager: Calciomercato disattivato, patch V567 applicata alle stesse tabelle mobile.

## Guardrail
- Non reintrodurre fetch/loader Calciomercato.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Conservare mobile UX, Admin, Presidente, Firebase, EmailJS, Listone, Rose, Bilanci, Competizioni.
- V567 non modifica dati, snapshot, login, permessi, EmailJS, Firebase, funzioni Netlify o runtime di rendering.

## Audit V567
```bash
node static/fanta-engine/tools/audit-roster-sticky-first-col-v567.mjs
```
