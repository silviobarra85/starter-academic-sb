# Branding V475 - FantaMantraManager

## Obiettivo
Aggiornare il nome pubblico del sito FantaPetilloMantraManager in `FantaMantraManager`, usando il logo fornito dall'utente nella dashboard e come favicon.

## Scelte conservative
- Non e' stata rinominata la cartella `static/fantapetillomantramanager`.
- Non sono stati cambiati `leagueId`, `slug`, `basePath`, URL pubblici o progetto Firebase.
- Non e' stata modificata alcuna risorsa di ZonaOrientale.
- La modifica e' solo di branding pubblico, asset icone, metadata, footer e testi visibili collegati.

## File principali aggiornati
- `assets/league-config.json`: nome pubblico, versione V475, rimozione dicitura configurazione, logo e immagine social.
- `index.html`: logo accanto al titolo della dashboard, cache-buster V475, favicon V475.
- `site.webmanifest` e `favicon.ico`: nuova identita' FantaMantraManager.
- `assets/js/core/league-config-v443.js`: fallback runtime e URL config cache-buster V475.
- `tools/audit-brand-v475.mjs`: controllo di regressione dedicato.
