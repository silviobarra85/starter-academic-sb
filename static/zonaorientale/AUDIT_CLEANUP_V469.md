# V470 - Hotfix audit CSS legacy multi-lega

La V470 corregge il gate dopo la V468: il cleanup CSS legacy V343 non deve fallire per riferimenti storici o duplicati fuori dal runtime di ZonaOrientale, ad esempio copie in `static/assets` o nel clone `static/fantapetillomantramanager`.

## Cosa cambia

- Il controllo CSS legacy resta attivo sul runtime ZonaOrientale.
- I riferimenti fuori dal runtime ZonaOrientale non bloccano il gate principale.
- Il check del clone FantaPetillo viene riallineato alla versione V470.

## Funzionalita preservate

- Firebase non modificato.
- Admin runtime non modificato.
- Bilanci mobile V438 non modificato.
- Badge dispositivo V434 non modificato.
- `FUNZIONALITA'.md` non modificato.
