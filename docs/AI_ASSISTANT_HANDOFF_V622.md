# AI Assistant Handoff V622

Versione: V622
Data: 2026-07-13
Oggetto: aggiornamento Per i SUDATORI e ioSudo da Excel `mercato_udinese_amichevoli_v5`.

## Dati aggiornati
- Aggiunte 5 fonti dal foglio `Fonti`, incluse le fonti Udinese/Bwin per le amichevoli.
- Aggiunte 8 righe da `Trattative_Squadre`.
- Aggiunte 4 amichevoli Udinese da Bwin come eventi **da confermare**.
- Conservate 3 fonti di controllo per il calendario Udinese senza conteggiarle come amichevoli reali.
- Ufficialità, infortunati/SOS e probabili formazioni restano invariati rispetto a V621.

## Conteggi V622
- Giocatori: 714.
- Amichevoli reali: 94.
- Card trattative aggregate: 180.
- Ufficialità in entrata: 97.
- Ufficialità in uscita: 135.
- Fonti: 116.
- SOS/infortunati: 8.

## ioSudo
- Aggiunta vista rapida `GIOCATORI` accanto a SQUADRE, SOS, RUMOR, UFFICIALITÀ e AMICHEVOLI.
- La vista mostra nome, ruolo, squadra reale, squadra fantasy live, badge mercato/SOS, ultimo aggiornamento e presenza nel listone più recente.
- Il clic su una riga giocatore apre il dettaglio giocatore.
- Il listone più recente è letto da `static/fanta-engine/data/shared-assets/current/assets/listoni/`.

## Regole preservate
- Per i SUDATORI e ioSudo continuano a leggere le rose live dagli stessi file della sezione Rose.
- Le ufficialità non devono comparire tra le trattative in corso.
- Le card trattative restano aggregate per giocatore.
- Le fonti controllo ritiri/amichevoli non sono conteggiate come amichevoli reali.
