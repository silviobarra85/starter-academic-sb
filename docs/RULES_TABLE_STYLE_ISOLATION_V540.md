# V540 - Rules table style isolation

## Obiettivo

La V540 separa lo stile delle tabelle del **Regolamento** dallo stile delle tabelle operative di **Listone** e **Rose**.

La segnalazione nasceva da entrambe le leghe: nel Regolamento alcune righe venivano colorate come le righe ruolo del Listone. Il caso piu evidente era la tabella dei partecipanti, dove nomi di presidenti come `D'isanto` o `D'Acunto` venivano interpretati dal vecchio helper come ruolo `D` difensore.

## Causa

La colorazione ruolo V404/V406 era troppo ampia:

- il runtime scandiva tutte le righe di tutte le tabelle;
- se trovava un testo compatibile con un ruolo, aggiungeva classi `player-role-*` e `zo-role-bg-v405-*`;
- il CSS ruolo era globale e quindi poteva applicarsi anche alle tabelle del Regolamento.

## Soluzione V540

La patch introduce due protezioni:

1. **Guardia runtime locale** in `assets/app.js` di entrambe le leghe: le classi ruolo vengono applicate solo a righe di tabelle candidate, cioe Listone, svincolati, rose, profili squadra o tabelle con intestazione/metadata ruolo. Le tabelle dentro `regolamento`, `.rules-table-wrap`, `.rules-section`, `.regulation-panel` sono escluse.
2. **CSS condiviso in `fanta-engine`**: `static/fanta-engine/css/rules-table-isolation-v540.css` forza le tabelle del Regolamento a non mostrare background/left bar ereditati da `player-role-*` o `zo-role-bg-v405-*`.

## Scope

Modifica whole-site:

- `zonaorientale`
- `fantapetillomantramanager`
- `fanta-engine`

## Funzionalita preservate

- Colorazione ruolo su Listone preservata.
- Colorazione ruolo su Rose/profili squadra preservata.
- Regolamento senza righe colorate per ruolo.
- Nessuna modifica Firebase.
- Nessuna modifica EmailJS.
- Nessuno spostamento dati.
- Nessuna cancellazione fallback Listoni/Calciomercato.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Verifica manuale

1. Aprire ZonaOrientale e FantaPetilloMantraManager.
2. Andare su Regolamento.
3. Controllare le tabelle: nessuna riga deve avere bande verdi/gialle/azzurre/rosse da ruolo.
4. Andare su Listone: le righe ruolo devono continuare a essere colorate.
5. Andare su Rose/profilo squadra: le colorazioni ruolo devono restare dove previste.
