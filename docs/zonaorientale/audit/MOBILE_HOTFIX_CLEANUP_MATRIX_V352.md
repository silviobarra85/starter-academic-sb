# MOBILE_HOTFIX_CLEANUP_MATRIX_V352

## Decisione

`mobile-hotfix-v166.css` e `mobile-hotfix-v167.css` sono stati rimossi come file sciolti perche non sono linkati dagli entrypoint HTML e risultano gia consolidati dentro `mobile-suite-v168.css`.

## Verifiche

| Elemento | Esito | Note |
| --- | --- | --- |
| `index.html` | OK | Linka `mobile-suite-v168.css?v=352`, non linka hotfix V166/V167. |
| `competition.html` | OK | Linka `mobile-suite-v168.css?v=352`, non linka hotfix V166/V167. |
| `player.html` | OK | Usa `mobile-chrome-v223.css?v=352` e refactor mobile, non hotfix V166/V167. |
| `mobile-suite-v168.css` | OK | Contiene sezioni commentate `mobile-hotfix-v166.css` e `mobile-hotfix-v167.css`. |
| `audit-mobile-hotfix-v352.mjs` | OK | Verifica rimozione file, presenza suite e assenza link HTML. |

## Rischio

Basso, perche il CSS effettivo resta nella suite consolidata V168.

## Aree da verificare manualmente

- Mobile bottom nav.
- Menu mobile `Altro`.
- Card Calciomercato mobile.
- Tabelle Rose/Listone mobile.
- Competition detail mobile.
- Scheda giocatore mobile.
