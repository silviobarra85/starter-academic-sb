# V470 - Isolamento footer multi-lega

La V470 aggiunge un audit dedicato ai footer HTML.

Regole bloccanti:

- i footer di ZonaOrientale non devono contenere riferimenti a FantaPetilloMantraManager;
- i footer di FantaPetilloMantraManager non devono contenere riferimenti a ZonaOrientale.

La patch include anche lo script `static/zonaorientale/tools/cleanup-nested-fantapetillo-v470.sh` per rimuovere la copia accidentale tracciata in `static/zonaorientale/static/fantapetillomantramanager`.

`FUNZIONALITA'.md` non viene modificato.
