# V572 - Tabelle giocatori mobile pulite

## Obiettivo

Ripartire da zero con la visualizzazione mobile delle tre tabelle con giocatori:

- Area Squadra / Dashboard Presidente.
- Rose.
- Listone.

## Scelte applicate

- Lo strumento di resize colonne V570/V571 non viene piu' caricato.
- Le vecchie regole incrementali V567/V568/V569 non vengono piu' caricate dalle home.
- Un nuovo CSS unico, `player-tables-mobile-v572.css`, contiene scope separati per le tre aree.
- Le righe sono colorate per ruolo: portieri gialli, difensori verdi, centrocampisti blu, attaccanti rossi.
- La prima colonna resta sticky e opaca per evitare sovrapposizioni durante lo scroll orizzontale.
- L'intestazione resta sticky/opaca.
- Il nome giocatore non usa ellissi e puo' andare a capo.
- I link giocatore a Fantagazzetta/Fantacalcio restano gestiti dal runtime esistente.

## Non modificato

- Firebase.
- EmailJS.
- Admin.
- Presidente.
- Snapshot.
- Calciomercato disattivato.
- Svincola Giocatori.
- `FUNZIONALITA'.md`.

## Audit

```bash
node static/fanta-engine/tools/audit-player-tables-mobile-v572.mjs
```
