# FUNZIONALITA V340 - Pannello Solo Admin e matching giocatore protetti

Versione: V340  
Data: 05/06/2026  
Ambito: refactor protetto pannello Solo Admin Calciomercato + disambiguazione matching giocatore.

## Obiettivo

Continuare il refactor della sezione Calciomercato preservando tutte le funzionalita esistenti, in particolare quelle presenti dopo l'ultimo merge su `master` e le versioni V333-V339.

La V340 interviene su due punti:

- estrazione del rendering/toggle del pannello `Solo Admin` dell'archivio Calciomercato in un modulo dedicato;
- miglioramento conservativo del matching articolo -> giocatore per evitare falsi positivi su parole minuscole usate come aggettivi, ad esempio `giovane`.

## Funzionalita V340

- Creato il modulo `assets/js/calciomercato/calciomercato-admin-v340.js`.
- Il modulo espone `createCalciomercatoArchiveAdminV340`.
- Il modulo gestisce solo:
  - view model del pannello Solo Admin;
  - rendering HTML del box archivio statico;
  - stato Espandi/Riduci;
  - aggiornamento DOM di `aria-expanded`, testo pulsante e `hidden`.
- `assets/app.js` mantiene il nome storico `renderCalciomercatoArchiveAdminToolsV323()` e lo usa come wrapper verso il modulo V340.
- `setCalciomercatoArchiveAdminExpandedV327()` resta disponibile e delega al modulo V340.
- Aggiunta diagnostica `window.ZonaOrientaleCalciomercatoArchiveAdminV340`.

## Matching giocatore V340

- Creato `assets/js/calciomercato/calciomercato-players-v340.js` come evoluzione protetta del modulo V337.
- La normalizzazione continua a rimuovere punteggiatura, separatori, apostrofi, tag HTML e spazi multipli.
- Per alias composti da una sola parola, lunghi almeno 5 caratteri, ora il match richiede anche una occorrenza capitalizzata nel testo originale.
- Esempio protetto:
  - `Giovane, il Napoli valuta il futuro` -> riconosce il giocatore `Giovane`;
  - `Il giovane talento piace al Napoli` -> non riconosce il giocatore `Giovane`.
- La logica resta conservativa:
  - nome completo;
  - cognome univoco;
  - nessun fuzzy matching aggressivo.
- Aggiunta diagnostica `window.ZonaOrientaleCalciomercatoPlayerMatchingV340` con smoke test runtime.

## Funzionalita preservate

- Calciomercato feed RSS/HTML.
- Fonti TMW squadra V329.
- Tile testuale `TMW - NomeSquadra` V330.
- Fallback favicon/fonte V328/V334.
- Card compatte V332.
- Renderer card V338.
- Filtri Calciomercato V339.
- Matching giocatore V335-V337, con policy conservativa aggiornata in V340.
- Modal timeline giocatore V336.
- Archivio statico Calciomercato V323/V324.
- Download archivio statico giornaliero dal pannello Admin Calciomercato.
- Toggle Espandi/Riduci Solo Admin V327.
- Listone e filtro Modifiche.
- Export CSV Listone solo Admin.
- Rose e pagina squadra.
- Fantamercato interno.
- Dashboard Presidente.
- Admin generale e Diagnostica dati.
- Firebase/Auth/EmailJS.
- News/share WhatsApp.
- Mobile bottom navigation e menu Altro.
- `competition.html` e `player.html`.

## File principali

```text
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/calciomercato/calciomercato-admin-v340.js
static/zonaorientale/assets/js/calciomercato/calciomercato-players-v340.js
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/player.html
docs/zonaorientale/FUNZIONALITAV340.md
docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V340.md
docs/zonaorientale/refactor/CALCIOMERCATO_ARCHIVE_ADMIN_REFACTOR_V340.md
docs/zonaorientale/release/RELEASE_V340_ARCHIVE_ADMIN_PLAYER_MATCHING.md
```

## Cose da non fare senza verifica

- Non rimuovere `calciomercato-players-v335.js` o `calciomercato-players-v337.js` solo perche sembrano legacy.
- Non rinominare ID DOM del pannello archivio, in particolare:
  - `calciomercatoArchiveAdminToolsV323`;
  - `calciomercatoArchiveToggleV326`;
  - `calciomercatoArchiveBodyV326`;
  - `calciomercatoDownloadArchiveDayV323`;
  - `calciomercatoDownloadArchiveRangeV323`.
- Non modificare `links.json`, archivi JSON o Netlify Function in questa fase.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
