# Handoff nuovo assistente - V339

## Stato corrente

La versione corrente e' V339. Il sito mantiene tutte le funzionalita dell'ultimo master e aggiunge solo un refactor protetto della gestione filtri Calciomercato.

## Modifica V339

E' stato creato il modulo:

```text
static/zonaorientale/assets/js/calciomercato/calciomercato-filters-v339.js
```

Il modulo gestisce:

- filtro ricerca testuale;
- filtro squadra;
- filtro topic;
- filtro fonte;
- range temporale `Da` / `A`;
- rendering option select;
- binding eventi dei controlli Calciomercato.

`assets/app.js` mantiene i nomi storici usati dal resto del runtime:

```js
getCalciomercatoFilteredArticlesV306()
renderCalciomercatoSelectOptionsV306()
renderCalciomercatoTeamSelectOptionsV314()
renderCalciomercatoSourceSelectOptionsV314()
setupCalciomercatoControlsV306()
```

Questi nomi delegano al modulo V339 tramite `getCalciomercatoFiltersV339()`.

## Vincoli obbligatori

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita dell'utente.
- Non cancellare file legacy candidati orfani senza task dedicato e conferma.
- Non cambiare ID DOM della sezione Calciomercato.
- Non cambiare schema di `links.json` o archivi JSON se non richiesto.
- Non modificare Netlify Functions durante refactor UI/client non necessario.
- Preservare tutti i wrapper storici in `app.js` finche' il refactor non e' completato e testato.

## Funzionalita da preservare

- Calciomercato V339/V338/V337/V336/V335/V334/V332/V330/V329/V328/V327.
- Listone V333/V331, inclusi filtro `Modifiche`, colonna `Modifica`, export CSV solo Admin.
- Rose, pagina squadra e dati statici rose.
- Fantamercato interno.
- Dashboard Presidente.
- Admin generale, diagnostica dati, richieste presidenti, convertitore listone.
- Firebase/Auth/EmailJS.
- Netlify Functions.
- News/share WhatsApp.
- Navigazione mobile, bottom bar, menu Altro, pulsante Su.
- `competition.html` e `player.html`.

## Diagnostica V339

In console browser:

```js
window.ZonaOrientaleCalciomercatoFiltersV339
window.ZonaOrientaleCalciomercatoFiltersV339.getState()
window.ZonaOrientaleCalciomercatoFiltersV339.getFilteredCount()
```

## Test consigliati

```bash
node --check static/zonaorientale/assets/app.js
node --check static/zonaorientale/assets/js/calciomercato/calciomercato-filters-v339.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-assets-v298.sh
static/zonaorientale/tools/audit-css-v300.sh
```

Test manuali minimi:

1. Aprire Calciomercato.
2. Digitare nel campo `Cerca` e verificare conteggio/card.
3. Cambiare squadra/topic/fonte.
4. Cambiare `Da` e `A`, poi applicare.
5. Premere reset periodo.
6. Verificare che il tag giocatore apra ancora la modal timeline.
7. Verificare da mobile che card e filtri restino usabili.

## Prossima modifica suggerita

V340: estrazione protetta del pannello `Solo Admin` / archivio Calciomercato in modulo dedicato, mantenendo intatti download, JSON e Netlify Function.
