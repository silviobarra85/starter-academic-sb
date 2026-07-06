# Overlay roadmap

## Corrente
- V580 - Tabelle giocatori mobile clonate dal Listone.

## Note
- Mantenere separati gli stili runtime per Area Squadra, Rose e Listone.
- Non reintrodurre resize colonne V570/V571.
- Per ulteriori ritocchi mobile, intervenire su V580 senza toccare i dati.

## V582 - Tabelle giocatori mobile font/stati fix
- Sostituisce il clone dinamico V580 con uno stile unico deterministico per Area Squadra, Rose e Listone.
- Applica inline `important` anche al Listone per evitare divergenze da CSS legacy.
- Mantiene link giocatore, colori ruolo, header sticky/opaco e prima colonna sticky/opaca.

## V582 - Tabelle giocatori mobile: fix font e Stati
- Sostituisce V581 per le tre tabelle giocatori mobile.
- Rimuove il conflitto con classi ruolo legacy e normalizza i badge Stato.
- Test manuale prioritario: Listone, Rose espansa, Area Squadra da mobile.
