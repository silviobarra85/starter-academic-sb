# V135 - Fix mobile Dashboard / Classifiche competizioni

Data: 2026-05-20
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Correggere su mobile lo scroll orizzontale delle partite mostrate nella Dashboard, sottosezione **Classifiche competizioni**.

## Problema

Le righe compatte delle prossime partite possono essere piu larghe del viewport mobile quando i nomi squadra sono lunghi o includono i loghi. In alcune condizioni non era possibile scorrere verso destra per leggere tutta la partita.

## Modifica

Aggiunto CSS mobile mirato in `static/zonaorientale/assets/styles.css`:

- abilita `overflow-x: auto` solo dentro `#dashboardStandings .dashboard-competition-summary`;
- forza le righe partita compatte a usare `width: max-content`;
- mantiene nomi squadra e data su una singola riga;
- non modifica desktop, dati o logica JavaScript.

Aggiornato cache busting in `index.html` a V135.

## Test consigliati

```bash
cd static
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire da smartphone:

```text
http://IP_DEL_MAC:1313/zonaorientale/#dashboard
```

Verificare:

- Dashboard -> Classifiche competizioni;
- aprire una competizione con prossime partite;
- scorrere orizzontalmente la riga della partita verso destra;
- verificare che Ultimi risultati, Competizioni e pagina singola competizione siano invariati.
