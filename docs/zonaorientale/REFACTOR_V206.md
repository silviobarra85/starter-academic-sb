# V206 - Hotfix avvio dati live

## Obiettivo
Correggere il blocco/assenza dati riscontrato dopo V205.

## Causa
V205 aveva reso la lettura live dei comunicati Firebase parte `awaited` del caricamento pubblico. Se la lettura live era lenta, non disponibile o bloccata dalle regole, il caricamento poteva sembrare non completato.

## Correzione
- I dati statici/snapshot vengono renderizzati sempre per primi.
- I comunicati live Firebase vengono caricati in background.
- Il mercato live presidente resta live, ma con guardie sicure e senza bloccare il primo render.
- Archivio resta senza la sottosezione Partite recenti introdotta/rimossa in V205.

## Letture Firebase
- News live: in background.
- Mercato/trattative: solo per presidente/mercato.
- Dati storici: JSON/snapshot come prima.
