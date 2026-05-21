# V146 - Listone mobile search-first

Data: 2026-05-20  
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Migliorare la leggibilità del Listone da smartphone senza modificare la versione desktop e senza toccare la logica dati/Firebase.

## Modifiche

- Aggiunto CSS mobile dedicato: `static/zonaorientale/assets/css/mobile-listone-v146.css`.
- La sezione Listone da mobile diventa più simile agli altri blocchi della nuova mobile UI.
- Ricerca, filtro stagione, stato e ruoli sono disposti in verticale e centrati.
- I filtri Stato/Ruoli sono resi come chip più facili da premere.
- Il controllo Campi visibili è più compatto su mobile.
- La tabella Listone mantiene lo scroll orizzontale.
- La prima colonna con il nome giocatore resta sticky da mobile, per non perdere il riferimento durante lo scroll.
- Desktop invariato.

## File

Modificati:

- `static/zonaorientale/index.html`

Nuovi:

- `static/zonaorientale/assets/css/mobile-listone-v146.css`
- `docs/zonaorientale/REFACTOR_V146.md`

## Test consigliati

```bash
cd static
python3 -m http.server 1313 --bind 0.0.0.0
```

Da smartphone:

```text
http://IP_DEL_MAC:1313/zonaorientale/#listone
```

Verificare:

- Ricerca giocatore.
- Filtri Stato.
- Filtri Ruoli.
- Campo versione listone.
- Campi visibili.
- Scroll orizzontale tabella.
- Colonna giocatore sticky.

## Commit consigliato

```bash
git add static/zonaorientale/index.html static/zonaorientale/assets/css/mobile-listone-v146.css docs/zonaorientale/REFACTOR_V146.md
git commit -m "Improve mobile listone layout"
git push origin feature/zonaorientale-competizioni-statiche
```
