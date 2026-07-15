# Handoff V676

V676 e' una patch solo sito.

- Desktop: Listone invariato come tabella.
- Mobile: Listone renderizzato in `#listoneMobileCardsV676`, fuori dalla tabella legacy.
- La vecchia `.listone-table-wrap` viene nascosta solo su mobile.
- Le card riusano il renderer mobile gia' esistente, quindi mantengono lo stile Rose/Listone V675.
- Non modifica ioSudo, dati, rose JSON, listoni JSON o Sudatori.
- Non contiene la cartella root `tools/`.
