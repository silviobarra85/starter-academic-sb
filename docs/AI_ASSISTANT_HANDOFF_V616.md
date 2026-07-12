# AI Assistant Handoff V616

Overlay V616 aggiorna Per i SUDATORI e ioSudo con l'Excel `fantacalcio_serie_a_2026_27_aggiornato_2026-07-12_mercato_fonti_extra.xlsx`.

## Dati principali
- Squadre: 20
- Giocatori: 714
- Amichevoli reali caricate: 90
- Ufficialita aggregate: 232 (97 entrata, 135 uscita)
- Righe ufficialita raw nel foglio: 268
- Trattative aggregate one-card-per-player: 181
- Trattative filtrate per ufficialita: 0
- Rumors Transfermarkt: 42
- Infortunati/SOS: 7

## Aggiornamenti Excel rilevati rispetto a V614
- +42 righe in `Ufficialita` da Sky Sport, con righe speculari per uscite Serie A.
- +9 righe in `Trattative_Squadre` da SportMediaset/TMW.
- +5 fonti in `Fonti`.
- +1 riga di controllo fonte in `Ritiri_Amichevoli`, esclusa dal conteggio amichevoli operative.

## Regole confermate
- Riepilogo mercato per squadra con ufficialita in entrata, ufficialita in uscita, trattative in entrata e trattative in uscita.
- Le trattative sono aggregate per giocatore.
- Se un giocatore ha ufficialita nella stessa squadra, la sua card viene filtrata dalle trattative in corso.
- ioSudo legge gli stessi JSON di Per i SUDATORI: non serve reinstallare l'app, basta chiudere/riaprire dopo deploy.
