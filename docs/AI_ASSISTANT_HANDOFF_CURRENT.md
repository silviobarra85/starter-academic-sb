# AI Assistant Handoff Current - V631

Versione corrente: V631.

V631 corregge il caricamento dati Sudatori/ioSudo: in V630 `manifest.current` era booleano e il codice tentava di leggere `.../current/true`. Ora `manifest.current` e `manifest.dataFile` puntano a `sudatori-data.json` e i loader sono robusti.
