# Current state ZonaOrientale - V386 Soccer Data solo admin

Data: 2026-06-06

## Versione corrente

- Runtime atteso: V386.
- Branch di lavoro: `refactor/260528-zonaorientale-next`.
- Ultima release: Soccer Data riservata agli admin e link FBref giocatore in verde.

## Vincoli attivi

- Nessuna funzionalita esistente deve essere rimossa o staccata.
- `docs/zonaorientale/FUNZIONALITA'.md` non va modificato salvo richiesta esplicita.
- Gli zip da consegnare devono contenere entrambe le cartelle: `zonaorientale` e `docs`.
- Nei comandi di applicazione indicare solo le due righe `cp -R`.

## Soccer Data

- Sezione disponibile solo per admin.
- Link `Soccer Data` desktop e mobile nascosti ai non-admin.
- Accesso diretto `#soccerdata` bloccato ai non-admin con ritorno alla dashboard.
- Manifest/mapping Soccer Data non caricati per utenti non-admin.
- Solo giocatori `IN_LISTONE` quando l'admin apre la sezione.
- Mapping corrente: `assets/soccer-data/fbref-player-map.v383.json`.
- Confermati: 531/532.
- Restano: 1 mapping `needs-review` (`Balentien`).
- Asteriscati esclusi: 131.
- La tabella usa `FBref / Giocatore` come colonna primaria.
- Il nome listone rimane visibile come dettaglio secondario.
- I link giocatore FBref sono verdi per maggiore leggibilita.
- La patch locale V385 resta disponibile per i casi da associare.
- Nessuno scraping live dal browser.
- Nessuna scrittura Firebase.

## Prossimo passo

- Rivalutare `Balentien` solo se viene pubblicata/indicizzata una scheda FBref stabile.
- Per nuovi listoni, l'admin usa il filtro `Da associare` e la patch locale per preparare nuove associazioni FBref.
