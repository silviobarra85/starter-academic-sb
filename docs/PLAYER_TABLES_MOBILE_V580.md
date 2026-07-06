# PLAYER_TABLES_MOBILE_V580

La V580 usa il Listone mobile come sorgente di verita visuale.

Motivo: Area Squadra e Rose ereditavano regole legacy da `mobile-suite-v168.css`, `rosters-tables.css` e dalla skin `team-profile-listone-skin-v415`; per questo i CSS V574-V579 potevano non produrre colori/font identici al Listone.

Implementazione:

- `table[data-player-table-v580="listone"]`: solo marcatura/campionamento.
- `table[data-player-table-v580="teamarea"]`: stile mobile clonato dal Listone.
- `table[data-player-table-v580="rose"]`: stile mobile clonato dal Listone.

Il campionamento usa `getComputedStyle` e viene ripetuto dopo render, click, cambio hash e resize. Se il Listone non e ancora presente nel DOM, usa fallback compatibile V550.
