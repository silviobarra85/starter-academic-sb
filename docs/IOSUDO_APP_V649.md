# ioSudo V649

Aggiornamento app da `fantacalcio_serie_a_2026_27_aggiornato_2026-07-14_aggiornamento_globale_v23(1).xlsx`.

## Modifiche

- Dataset centrale aggiornato a V649.
- La vista `AMICHEVOLI` mostra solo partite effettive con evento del tipo `Squadra-Squadra` e almeno una squadra di Serie A.
- Sono escluse righe di controllo/fonte come guide ritiri, calendari, convocati, raduni e note non-partita.
- La navigazione tra sezioni e card usa event delegation: non vengono più riagganciati listener a ogni card dopo ogni render.
- La cache della vista `GIOCATORI` viene costruita solo quando la vista viene aperta, non durante la navigazione normale.
- La vista `GIOCATORI` limita il primo render a 220 card e invita a usare la ricerca per restringere.
- Rimane il fix sulle date seriali Excel, inclusi formati anomali tipo `+046216-01`.

## Conteggi V649

- Squadre: 20
- Giocatori: 714
- Amichevoli/partite effettive: 88
- Righe non-partita filtrate dalle amichevoli: 31
- Trattative/rumor: 367
- Ufficialità in entrata: 143
- Ufficialità in uscita: 153
- SOS/infortuni: 9
- Fonti deduplicate: 232
