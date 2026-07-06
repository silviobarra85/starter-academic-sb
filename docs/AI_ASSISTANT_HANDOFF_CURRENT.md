# AI Assistant Handoff Current

## Stato corrente
V582 - Tabelle giocatori mobile: fix font e Stati.

## Baseline funzionale
- ZonaOrientale: Calciomercato disattivato, Svincola Giocatori attivo, logo account presidente coerente con stagione.
- FantaPetilloMantraManager: Calciomercato disattivato.
- Tabelle giocatori mobile gestite da `player-tables-mobile-v582`.

## Nota per modifiche future
Le tabelle giocatori mobile sono ora normalizzate da un unico runtime/CSS. Prima di modificare Area Squadra, Rose o Listone verificare che non vengano reintrodotti conflitti da:

- `styles.css` ruolo V405;
- `rosters-tables.css`;
- `mobile-suite-v168.css`;
- badge `.status` e `.status-badge`.

## Verifica prioritaria
Da mobile: Listone, Rose espansa, Area Squadra / Dashboard Presidente.
