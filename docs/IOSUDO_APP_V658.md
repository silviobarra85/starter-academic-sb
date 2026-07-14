# ioSudo App V658

V658 corregge due dettagli della UX mobile e dei conteggi.

## Scroll progressivo

Il pulsante `Mostra altre voci` continua ad aumentare il numero di righe visibili, ma la pagina non viene riportata in alto. La posizione di lettura viene preservata durante il re-render della lista.

## Conteggi card

Le card di riepilogo ora sono coerenti con le viste:

- `Giocatori`: conta le stesse voci della vista GIOCATORI, quindi rose Serie A + listone + rose fantasy deduplicate.
- `Amichevoli`: conta solo le partite effettive filtrate/deduplicate, come nella vista AMICHEVOLI.

## Compatibilita

- Mantiene le ottimizzazioni V651-V656.
- Non modifica dataset, manifest, listoni o rose.
- Non riattiva la sezione pubblica Per i SUDATORI.
